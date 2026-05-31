/**
 * Resize PNG masters and emit WebP for site delivery.
 * Masters live in `originals/` (kept in git); WebP siblings are what the app loads.
 *
 * Usage: node scripts/optimize-images.mjs [--dry-run] [--force]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");

/** @type {{ originalsDir: string, outDir: string, maxWidth: number, quality: number }[]} */
const TARGETS = [
  {
    originalsDir: path.join(root, "courses"),
    outDir: null,
    maxWidth: 1400,
    quality: 86,
  },
  {
    originalsDir: path.join(root, "assets/characters/originals"),
    outDir: path.join(root, "public/characters"),
    maxWidth: 256,
    quality: 88,
  },
];

function walkPng(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    if (fs.statSync(abs).isDirectory()) {
      if (name === "node_modules") continue;
      walkPng(abs, files);
    } else if (name.toLowerCase().endsWith(".png")) {
      files.push(abs);
    }
  }
  return files;
}

function courseImageJobs(coursesRoot) {
  /** @type {{ master: string, out: string, maxWidth: number, quality: number }[]} */
  const jobs = [];
  if (!fs.existsSync(coursesRoot)) return jobs;

  for (const slug of fs.readdirSync(coursesRoot)) {
    const originalsDir = path.join(coursesRoot, slug, "image", "originals");
    const outDir = path.join(coursesRoot, slug, "image");
    if (!fs.existsSync(originalsDir)) continue;

    for (const master of walkPng(originalsDir)) {
      const base = path.basename(master, path.extname(master));
      jobs.push({
        master,
        out: path.join(outDir, `${base}.webp`),
        maxWidth: TARGETS[0].maxWidth,
        quality: TARGETS[0].quality,
      });
    }
  }
  return jobs;
}

function characterImageJobs(originalsDir, outDir) {
  return walkPng(originalsDir).map((master) => ({
    master,
    out: path.join(outDir, `${path.basename(master, path.extname(master))}.webp`),
    maxWidth: TARGETS[1].maxWidth,
    quality: TARGETS[1].quality,
  }));
}

async function optimizeOne({ master, out, maxWidth, quality }) {
  if (!force && fs.existsSync(out)) {
    const masterMtime = fs.statSync(master).mtimeMs;
    const outMtime = fs.statSync(out).mtimeMs;
    if (outMtime >= masterMtime) {
      return { master, out, skipped: true, bytes: fs.statSync(out).size };
    }
  }

  const input = sharp(master);
  const meta = await input.metadata();

  let pipeline = input.rotate();
  if ((meta.width ?? 0) > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  if (dryRun) {
    return { master, out, skipped: false, bytes: 0 };
  }

  await pipeline.webp({ quality, effort: 4 }).toFile(out);
  return { master, out, skipped: false, bytes: fs.statSync(out).size };
}

async function main() {
  const jobs = [
    ...courseImageJobs(TARGETS[0].originalsDir),
    ...characterImageJobs(TARGETS[1].originalsDir, TARGETS[1].outDir),
  ].sort((a, b) => a.master.localeCompare(b.master));

  let totalIn = 0;
  let totalOut = 0;
  let count = 0;
  let skipped = 0;

  for (const job of jobs) {
    const before = fs.statSync(job.master).size;
    totalIn += before;

    const result = await optimizeOne(job);
    if (result.skipped) {
      skipped += 1;
      continue;
    }

    if (dryRun) {
      console.log(`[dry-run] ${path.relative(root, job.master)} → ${path.relative(root, job.out)}`);
      count += 1;
      continue;
    }

    totalOut += result.bytes;
    count += 1;
    const pct = Math.round((1 - result.bytes / before) * 100);
    console.log(
      `${path.relative(root, job.master)} → ${path.relative(root, job.out)} (${formatKb(before)} → ${formatKb(result.bytes)}, -${pct}%)`
    );
  }

  if (dryRun) {
    console.log(`\n[dry-run] Would process ${count} file(s) (${skipped} up to date)`);
  } else {
    console.log(`\nOptimized ${count} file(s), skipped ${skipped} up to date`);
    if (count > 0) console.log(`Output size: ${formatKb(totalOut)} from ${formatKb(totalIn)} masters`);
  }
}

function formatKb(n) {
  return n < 1024 * 1024 ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
