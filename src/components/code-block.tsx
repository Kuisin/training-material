import { useLayoutEffect, useRef, useState } from "react";
import { copyText } from "../lib/clipboard";
import { cn } from "../lib/cn";

const DEFAULT_COLLAPSE_AFTER = 10;

const PRE_CLASS =
  "overflow-x-auto p-4 text-sm leading-relaxed text-slate-100 motion-reduce:transition-none";

interface CodeBlockProps {
  code: string;
  /** 表示用ラベル（例: "ABAP"）。省略可。 */
  language?: string;
  /** この行数を超えると折りたたみ表示（既定: 10）。 */
  collapseAfter?: number;
}

export function CodeBlock({ code, language, collapseAfter = DEFAULT_COLLAPSE_AFTER }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");
  const isCollapsible = lines.length > collapseAfter;
  const collapsedCode = lines.slice(0, collapseAfter).join("\n");
  const hiddenLineCount = isCollapsible ? lines.length - collapseAfter : 0;

  const [expanded, setExpanded] = useState(false);
  const [heights, setHeights] = useState({ collapsed: 0, full: 0 });
  const [heightsReady, setHeightsReady] = useState(false);

  const collapsedMeasureRef = useRef<HTMLPreElement>(null);
  const fullMeasureRef = useRef<HTMLPreElement>(null);

  useLayoutEffect(() => {
    if (!isCollapsible) {
      setHeightsReady(false);
      return;
    }

    function measure() {
      const collapsed = collapsedMeasureRef.current?.scrollHeight ?? 0;
      const full = fullMeasureRef.current?.scrollHeight ?? 0;
      setHeights({ collapsed, full });
      setHeightsReady(true);
    }

    measure();

    const target = fullMeasureRef.current;
    if (!target) return;

    const observer = new ResizeObserver(measure);
    observer.observe(target);
    return () => observer.disconnect();
  }, [code, collapseAfter, isCollapsible, collapsedCode]);

  async function handleCopy() {
    const ok = await copyText(code);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function handleToggle() {
    setExpanded((value) => !value);
  }

  const targetHeight = expanded ? heights.full : heights.collapsed;

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

      {isCollapsible ? (
        <div
          aria-hidden
          className="pointer-events-none absolute -left-[9999px] top-0 w-full opacity-0"
        >
          <pre ref={collapsedMeasureRef} className={PRE_CLASS}>
            <code className="font-mono">{collapsedCode}</code>
          </pre>
          <pre ref={fullMeasureRef} className={PRE_CLASS}>
            <code className="font-mono">{code}</code>
          </pre>
        </div>
      ) : null}

      <div className="relative">
        <div
          className={cn(
            "overflow-hidden",
            heightsReady && "transition-[max-height] duration-300 ease-in-out motion-reduce:transition-none"
          )}
          style={{
            maxHeight: isCollapsible && heightsReady ? targetHeight : undefined,
          }}
        >
          <pre className={PRE_CLASS}>
            <code className="font-mono">{code}</code>
          </pre>
        </div>
        {isCollapsible ? (
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-slate-900 to-transparent",
              "transition-opacity duration-300 ease-in-out motion-reduce:transition-none",
              expanded ? "opacity-0" : "opacity-100"
            )}
          />
        ) : null}
      </div>

      {isCollapsible ? (
        <div className="border-t border-slate-700/70 bg-slate-800/40 px-4 py-2 text-center">
          <button
            type="button"
            onClick={handleToggle}
            aria-expanded={expanded}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-slate-300 transition",
              "hover:bg-white/10 hover:text-white",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            )}
          >
            <span
              aria-hidden
              className={cn(
                "inline-block transition-transform duration-300 ease-in-out motion-reduce:transition-none",
                expanded && "rotate-180"
              )}
            >
              ▾
            </span>
            {expanded ? "折りたたむ" : `残り ${hiddenLineCount} 行を表示`}
          </button>
        </div>
      ) : null}
    </div>
  );
}
