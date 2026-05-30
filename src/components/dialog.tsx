import type { ReactNode } from "react";
import type { DialogSpeaker } from "../lib/types";
import { cn } from "../lib/cn";

interface DialogSpeakerStyle {
  container: string;
  badge: string;
  tail: string;
  label: string;
}

const SPEAKER_STYLES: Record<DialogSpeaker, DialogSpeakerStyle> = {
  teacher: {
    container:
      "border-sky-500/60 bg-sky-50 text-sky-950 dark:bg-sky-500/10 dark:text-sky-100",
    badge: "bg-sky-600 text-white dark:bg-sky-500",
    tail: "border-t-sky-50 dark:border-t-sky-500/10",
    label: "先生",
  },
  a: {
    container:
      "border-emerald-500/60 bg-emerald-50 text-emerald-950 dark:bg-emerald-500/10 dark:text-emerald-100",
    badge: "bg-emerald-600 text-white dark:bg-emerald-500",
    tail: "border-t-emerald-50 dark:border-t-emerald-500/10",
    label: "Aくん",
  },
  b: {
    container:
      "border-amber-500/60 bg-amber-50 text-amber-950 dark:bg-amber-500/10 dark:text-amber-100",
    badge: "bg-amber-600 text-white dark:bg-amber-500",
    tail: "border-t-amber-50 dark:border-t-amber-500/10",
    label: "Bちゃん",
  },
  stumble: {
    container:
      "border-rose-500/60 bg-rose-50 text-rose-950 dark:bg-rose-500/10 dark:text-rose-100",
    badge: "bg-rose-600 text-white dark:bg-rose-500",
    tail: "border-t-rose-50 dark:border-t-rose-500/10",
    label: "つまずき",
  },
  closing: {
    container:
      "border-violet-500/60 bg-violet-50 text-violet-950 dark:bg-violet-500/10 dark:text-violet-100",
    badge: "bg-violet-600 text-white dark:bg-violet-500",
    tail: "border-t-violet-50 dark:border-t-violet-500/10",
    label: "今日のひとこと",
  },
};

interface DialogProps {
  speaker: DialogSpeaker;
  children: ReactNode;
}

function SpeechBubbleIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("size-5 shrink-0 opacity-80", className)}
    >
      <path d="M12 3C7.03 3 3 6.58 3 11c0 2.13 1.05 4.04 2.72 5.38-.12.95-.47 2.33-1.42 3.72 0 0 2.2-.47 3.68-1.55.87.24 1.78.37 2.72.37 4.97 0 9-3.58 9-8s-4.03-8-9-8Z" />
    </svg>
  );
}

export function Dialog({ speaker, children }: DialogProps) {
  const style = SPEAKER_STYLES[speaker];

  return (
    <div
      role="note"
      className={cn(
        "not-prose relative my-4 rounded-2xl border-l-4 p-4 pb-5 pl-4 text-[0.95rem] leading-relaxed shadow-sm",
        style.container
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <SpeechBubbleIcon />
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide",
            style.badge
          )}
        >
          {style.label}
        </span>
      </div>
      <div className="min-w-0 pl-7 [&_code]:rounded [&_code]:bg-black/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] dark:[&_code]:bg-white/10">
        {children}
      </div>
      <span
        aria-hidden
        className={cn(
          "absolute -bottom-2 left-8 h-0 w-0 border-x-8 border-t-8 border-x-transparent",
          style.tail
        )}
      />
    </div>
  );
}
