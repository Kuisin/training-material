import { useState } from "react";
import { copyText } from "../lib/clipboard";
import type { SlideData } from "../lib/types";

interface AiAskButtonProps {
  title: string;
  slides: SlideData[];
}

function slidesToPlainText(slides: SlideData[]): string {
  const parser = new DOMParser();
  return slides
    .map((s) => {
      const doc = parser.parseFromString(s.html, "text/html");
      const text = (doc.body.textContent ?? "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .join("\n");
      return `## ${s.title}\n${text}`;
    })
    .join("\n\n");
}

export function AiAskButton({ title, slides }: AiAskButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    const body = slidesToPlainText(slides);
    const text =
      `以下は研修レッスン「${title}」の内容です。この内容について質問があります。\n\n` +
      `----\n${body}\n----\n\n【質問】（ここに知りたいことを書いてください）`;
    const ok = await copyText(text);
    setCopied(ok);
    window.setTimeout(() => setCopied(false), 2400);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title="このレッスンの内容をコピーして Copilot に質問する"
      className="fixed right-4 top-16 z-30 inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
    >
      <span aria-hidden>🤖</span>
      {copied ? "コピーしました" : "Copilotに質問"}
    </button>
  );
}
