import fs from 'node:fs';
import path from 'node:path';
import { buildSearchIndex } from './scripts/extract-search-index.mjs';

function htmlShell(scriptHref, cssHrefs = []) {
  const cssLinks = cssHrefs
    .map((href) => `    <link rel="stylesheet" crossorigin href="${href}">`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
${cssLinks ? `${cssLinks}\n` : ''}  </head>
  <body>
    <div id="root"></div>
    <script type="module" crossorigin src="${scriptHref}"></script>
  </body>
</html>
`;
}

/** HTML 出力位置からアセットへの相対 URL（GitHub Pages の /repo/ 配下でも動く） */
function assetHrefFromHtml(htmlOut, assetFile) {
  const htmlDir = path.dirname(htmlOut);
  return path.relative(htmlDir, assetFile).replace(/\\/g, '/');
}

/** エントリ chunk とその静的 import 先から CSS を再帰収集（共有 chunk 内の styles.css 用） */
function collectImportedCss(chunk, bundle, visited = new Set()) {
  if (!chunk || visited.has(chunk.fileName)) return [];
  visited.add(chunk.fileName);

  const css = chunk.viteMetadata?.importedCss
    ? [...chunk.viteMetadata.importedCss]
    : [];

  for (const id of chunk.imports ?? []) {
    const dep = bundle[id];
    if (dep?.type === 'chunk') {
      css.push(...collectImportedCss(dep, bundle, visited));
    }
  }

  return css;
}

/** courses/<slug>/course.json からレッスンエントリ一覧を構築する */
function readLessonEntries(root) {
  const coursesDir = path.join(root, 'courses');
  /** @type {{ tsxPath: string, htmlOut: string }[]} */
  const entries = [];

  if (!fs.existsSync(coursesDir)) return entries;

  for (const slug of fs.readdirSync(coursesDir).sort()) {
    const courseDir = path.join(coursesDir, slug);
    if (!fs.statSync(courseDir).isDirectory()) continue;

    const metaPath = path.join(courseDir, 'course.json');
    if (!fs.existsSync(metaPath)) continue;

    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));

    for (const lesson of meta.lessons ?? []) {
      const tsxPath = path.join(courseDir, `${lesson.file}.tsx`);
      if (!fs.existsSync(tsxPath)) continue;

      entries.push({
        tsxPath,
        htmlOut: `${slug}/${lesson.file}.html`,
      });
    }
  }

  return entries;
}

const IMAGE_EXT_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
};

/** courses/<slug>/image/ 配下の画像を再帰収集する（出力先 <slug>/image/... と実体パスの対応） */
function readCourseImages(root) {
  const coursesDir = path.join(root, 'courses');
  /** @type {{ outFile: string, absPath: string }[]} */
  const images = [];
  if (!fs.existsSync(coursesDir)) return images;

  for (const slug of fs.readdirSync(coursesDir).sort()) {
    const imageDir = path.join(coursesDir, slug, 'image');
    if (!fs.existsSync(imageDir) || !fs.statSync(imageDir).isDirectory()) continue;

    const walk = (dir) => {
      for (const name of fs.readdirSync(dir)) {
        const abs = path.join(dir, name);
        if (fs.statSync(abs).isDirectory()) {
          // PNG masters in originals/ are not deployed
          if (name === 'originals') continue;
          walk(abs);
          continue;
        }
        const ext = path.extname(abs).toLowerCase();
        if (!(ext in IMAGE_EXT_TYPES)) continue;
        // Prefer WebP over PNG when both exist at the same path
        if (ext === '.png') {
          const webp = abs.replace(/\.png$/i, '.webp');
          if (fs.existsSync(webp)) continue;
        }
        const rel = path.relative(imageDir, abs).replace(/\\/g, '/');
        images.push({ outFile: `${slug}/image/${rel}`, absPath: abs });
      }
    };
    walk(imageDir);
  }

  return images;
}

/**
 * courses/<slug>/*.tsx 用の HTML をビルド時に生成し、dev では仮想ルートで配信する。
 * ルート index はプロジェクト直下の index.html を使う（Vite 標準）。
 */
function searchIndexJson(root) {
  return JSON.stringify(buildSearchIndex(root));
}

export function tsxMpaPlugin({ root }) {
  const indexHtml = path.resolve(root, 'index.html');
  const lessons = readLessonEntries(root);

  const input = {
    index: indexHtml,
    ...Object.fromEntries(
      lessons.map((p) => {
        const key = p.htmlOut.replace(/\.html$/, '').replace(/\//g, '-');
        return [key, p.tsxPath];
      })
    ),
  };

  /** @type {string} */
  let base = '/';

  return {
    name: 'tsx-mpa',
    config() {
      return { build: { rollupOptions: { input } } };
    },
    configResolved(config) {
      base = config.base;
    },
    configureServer(server) {
      // 検索インデックス（dev ではリクエスト時に再生成）
      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split('?')[0] ?? '';
        const basePrefix = base.endsWith('/') ? base.slice(0, -1) : base;
        const rel =
          basePrefix && pathname.startsWith(basePrefix)
            ? pathname.slice(basePrefix.length)
            : pathname;
        if (rel !== '/search-index.json') return next();

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(searchIndexJson(root));
      });

      // 画像配信: /<slug>/image/<file> を courses/<slug>/image/<file> から返す
      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split('?')[0] ?? '';
        const basePrefix = base.endsWith('/') ? base.slice(0, -1) : base;
        const rel =
          basePrefix && pathname.startsWith(basePrefix)
            ? pathname.slice(basePrefix.length)
            : pathname;
        const match = rel.match(/^\/([^/]+)\/image\/(.+)$/);
        if (!match) return next();

        const ext = path.extname(match[2]).toLowerCase();
        const type = IMAGE_EXT_TYPES[ext];
        if (!type) return next();

        const filePath = path.join(root, 'courses', match[1], 'image', match[2]);
        if (!fs.existsSync(filePath)) return next(); // 未作成なら 404 → Figure がプレースホルダ表示

        res.statusCode = 200;
        res.setHeader('Content-Type', type);
        fs.createReadStream(filePath).pipe(res);
      });

      // Vite の index フォールバックより先に実行する（後ろだと一覧 index.html が返る）
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split('?')[0]?.replace(/\/$/, '') ?? '';
        const basePrefix = base.endsWith('/') ? base.slice(0, -1) : base;
        const pathWithoutBase =
          basePrefix && pathname.startsWith(basePrefix)
            ? pathname.slice(basePrefix.length) || '/'
            : pathname;
        const page = lessons.find(
          (p) =>
            pathWithoutBase === `/${p.htmlOut}` ||
            pathWithoutBase === `/${p.htmlOut.replace(/\.html$/, '')}`
        );
        if (!page) return next();

        const scriptSrc = `/${path.relative(root, page.tsxPath).replace(/\\/g, '/')}`;
        const url = req.originalUrl ?? req.url ?? pathname;

        try {
          // @vitejs/plugin-react の preamble / @vite/client を注入する（素の HTML だと HMR が壊れる）
          const html = await server.transformIndexHtml(url, htmlShell(scriptSrc));
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(html);
        } catch (err) {
          next(err);
        }
      });
    },
    generateBundle(_options, bundle) {
      for (const page of lessons) {
        const chunk = Object.values(bundle).find(
          (item) =>
            item.type === 'chunk' &&
            item.isEntry &&
            item.facadeModuleId === page.tsxPath
        );
        if (!chunk) continue;

        const scriptHref = assetHrefFromHtml(page.htmlOut, chunk.fileName);
        const cssHrefs = [...new Set(collectImportedCss(chunk, bundle))].map(
          (file) => assetHrefFromHtml(page.htmlOut, file)
        );

        this.emitFile({
          type: 'asset',
          fileName: page.htmlOut,
          source: htmlShell(scriptHref, cssHrefs),
        });
      }

      // courses/<slug>/image/ の画像を dist/<slug>/image/ へコピーする
      for (const image of readCourseImages(root)) {
        this.emitFile({
          type: 'asset',
          fileName: image.outFile,
          source: fs.readFileSync(image.absPath),
        });
      }

      this.emitFile({
        type: 'asset',
        fileName: 'search-index.json',
        source: searchIndexJson(root),
      });
    },
  };
}
