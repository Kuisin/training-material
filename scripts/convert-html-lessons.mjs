/**
 * abap-taining/*.html → abap-taining/*.tsx へ一括変換する。
 * 実行: node scripts/convert-html-lessons.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse, HTMLElement, TextNode } from "node-html-parser";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const lessonsDir = path.join(root, "abap-taining");

function jsString(s) {
  return JSON.stringify(s);
}

function templateLiteral(s) {
  return "`" + s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";
}

function plainText(node) {
  if (node instanceof TextNode) return node.text;
  if (!(node instanceof HTMLElement)) return "";
  return node.childNodes.map(plainText).join("");
}

function calloutVariant(cls) {
  if (cls.includes("warning")) return "warning";
  if (cls.includes("note")) return "note";
  return "tip";
}

function nodeToJsx(node, indent = 6) {
  const pad = " ".repeat(indent);

  if (node instanceof TextNode) {
    const t = node.text.replace(/\s+/g, (m, off, str) => {
      if (off === 0 || off + m.length === str.length) return "";
      return " ";
    });
    if (!t) return "";
    return t;
  }

  if (!(node instanceof HTMLElement)) return "";

  const tag = node.tagName?.toLowerCase();
  const cls = node.getAttribute("class") ?? "";

  if (tag === "div" && cls.includes("callout")) {
    const inner = node.childNodes
      .map((c) => nodeToJsx(c, indent + 2))
      .filter(Boolean)
      .join("\n");
    return `${pad}<Callout variant="${calloutVariant(cls)}">\n${inner}\n${pad}</Callout>`;
  }

  if (tag === "div" && cls.includes("lesson-meta")) {
    const items = node.querySelectorAll("span").map((span) => {
      const raw = plainText(span).trim();
      const [icon, ...rest] = raw.split(/\s+/);
      return `{ icon: ${jsString(icon)}, text: ${jsString(rest.join(" "))} }`;
    });
    return `${pad}<LessonMeta items={[${items.join(", ")}]} />`;
  }

  if (tag === "div" && cls.includes("quiz")) {
    const answer = node.getAttribute("data-answer") ?? "0";
    const explanation = node.getAttribute("data-explanation") ?? "";
    const questionEl = node.childNodes.find(
      (c) => c instanceof HTMLElement && c.tagName === "P"
    );
    const questionInner = questionEl
      ? questionEl.childNodes
          .map((c) => nodeToJsx(c, indent + 4))
          .filter(Boolean)
          .join("")
      : "";
    const options = node.querySelectorAll("button").map((b) => jsString(plainText(b).trim()));
    const qBlock = questionInner.includes("\n")
      ? `{\n${" ".repeat(indent + 2)}<>\n${questionInner}\n${" ".repeat(indent + 2)}</>\n${pad}}`
      : `<>${questionInner}</>`;
    return `${pad}<Quiz
${pad}  answer={${answer}}
${pad}  explanation={${jsString(explanation)}}
${pad}  question={${qBlock}}
${pad}  options={[${options.join(", ")}]}
${pad}/>`;
  }

  if (tag === "pre" && cls.includes("mermaid")) {
    const chart = plainText(node).trim();
    return `${pad}<MermaidDiagram chart={${templateLiteral(chart)}} />`;
  }

  if (tag === "pre") {
    const codeEl = node.querySelector("code");
    const code = codeEl ? plainText(codeEl).replace(/\n$/, "") : plainText(node).trim();
    const lang = codeEl?.getAttribute("class")?.match(/language-(\S+)/)?.[1];
    const langProp = lang ? ` language=${jsString(lang)}` : "";
    return `${pad}<CodeBlock code={${templateLiteral(code)}}${langProp} />`;
  }

  const voidTags = new Set(["br", "hr", "img", "input", "meta", "link"]);
  const childJsx = node.childNodes
    .map((c) => nodeToJsx(c, indent + 2))
    .filter((s) => s !== "");
  const inner = childJsx.join(childJsx.some((s) => s.includes("\n")) ? "\n" : "");

  const attrs = [];
  if (cls) attrs.push(`className=${jsString(cls)}`);
  for (const [name, value] of Object.entries(node.attributes ?? {})) {
    if (name === "class" || name === "data-answer" || name === "data-explanation") continue;
    const jsxName = name === "for" ? "htmlFor" : name;
    attrs.push(`${jsxName}={${jsString(value)}}`);
  }
  const attrStr = attrs.length ? " " + attrs.join(" ") : "";

  if (voidTags.has(tag)) return `${pad}<${tag}${attrStr} />`;

  if (!inner) return `${pad}<${tag}${attrStr} />`;

  if (inner.includes("\n")) {
    return `${pad}<${tag}${attrStr}>\n${inner}\n${pad}</${tag}>`;
  }
  return `${pad}<${tag}${attrStr}>${inner}</${tag}>`;
}

function convertSlide(section) {
  const title = section.getAttribute("data-title")?.trim() || "スライド";
  const contentNodes = section.childNodes.filter(
    (n) => !(n instanceof TextNode && !n.text.trim())
  );
  const contentJsx = contentNodes
    .map((n) => nodeToJsx(n, 8))
    .filter(Boolean)
    .join("\n");
  const text = plainText(section)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");

  return {
    title,
    text,
    contentJsx,
  };
}

function convertLesson(htmlPath) {
  const html = fs.readFileSync(htmlPath, "utf8");
  const doc = parse(html);
  const body = doc.querySelector("body");
  if (!body) throw new Error(`No body in ${htmlPath}`);

  const chrome = {
    title: body.getAttribute("data-title")?.trim() || "",
    prevHref: body.getAttribute("data-prev")?.trim() || "",
    nextHref: body.getAttribute("data-next")?.trim() || "",
    indexHref: body.getAttribute("data-index")?.trim() || "../index.html",
  };

  const sections = body.querySelectorAll("section.slide");
  const slides = sections.map(convertSlide);

  const base = path.basename(htmlPath, ".html");
  const slidesTsx = slides
    .map(
      (s, i) => `  {
    title: ${jsString(s.title)},
    plainText: ${jsString(s.text)},
    content: (
      <>
${s.contentJsx}
      </>
    ),
  }`
    )
    .join(",\n");

  return `import { renderLesson } from "../src/render-lesson";
import { Callout } from "../src/components/callout";
import { CodeBlock } from "../src/components/code-block";
import { Quiz } from "../src/components/quiz";
import { MermaidDiagram } from "../src/components/mermaid-diagram";
import { LessonMeta } from "../src/components/lesson-meta";

const chrome = {
  title: ${jsString(chrome.title)},
  prevHref: ${jsString(chrome.prevHref)},
  nextHref: ${jsString(chrome.nextHref)},
  indexHref: ${jsString(chrome.indexHref)},
};

const slides = [
${slidesTsx}
];

renderLesson(chrome, slides);
`;
}

for (const f of fs.readdirSync(lessonsDir)) {
  if (!f.endsWith(".html")) continue;
  const out = path.join(lessonsDir, f.replace(".html", ".tsx"));
  const tsx = convertLesson(path.join(lessonsDir, f));
  fs.writeFileSync(out, tsx);
  console.log("wrote", out);
}

console.log("done");
