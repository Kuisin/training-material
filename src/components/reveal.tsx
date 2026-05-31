import { useState } from "react";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";

interface RevealProps {
  children: ReactNode;
  /** 非表示時に表示するボタンのラベル */
  label?: string;
  /** 再非表示ボタンのラベル */
  hideLabel?: string;
  className?: string;
}

export function Reveal({
  children,
  label = "答えを見る",
  hideLabel = "隠す",
  className,
}: RevealProps) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  function handleHide() {
    if (closing) return;
    setClosing(true);
  }

  function handleAnimationEnd(e: React.AnimationEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget || !closing) return;
    setOpen(false);
    setClosing(false);
  }

  if (!open && !closing) {
    return (
      <div className={cn("not-prose my-5", className)}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          className="inline-flex items-center gap-2 rounded-xl border border-brand/30 bg-brand/5 px-4 py-2.5 text-sm font-semibold text-brand shadow-sm transition hover:border-brand/50 hover:bg-brand/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-brand/40 dark:bg-brand/10 dark:hover:bg-brand/15"
        >
          <span aria-hidden>👀</span>
          {label}
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "not-prose",
        closing ? "animate-slide-fade-out" : "animate-slide-fade",
        className
      )}
      aria-live="polite"
      aria-expanded={!closing}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
      <div className="mt-2 text-right">
        <button
          type="button"
          onClick={handleHide}
          disabled={closing}
          className="text-xs text-slate-400 transition hover:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:opacity-50 dark:text-slate-500 dark:hover:text-slate-300"
        >
          {hideLabel}
        </button>
      </div>
    </div>
  );
}
