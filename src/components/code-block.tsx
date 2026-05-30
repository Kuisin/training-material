import { useState } from "react";
import { copyText } from "../lib/clipboard";

interface CodeBlockProps {
  code: string;
  /** 表示用ラベル（例: "ABAP"）。省略可。 */
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyText(code);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="not-prose group relative my-4 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-700/70 bg-slate-800/60 px-4 py-1.5">
        <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
          {language ?? "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md px-2 py-1 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          aria-label="コードをコピー"
        >
          {copied ? "✓ コピー済み" : "コピー"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-slate-100">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
