import { cn } from "../lib/cn";

export type QuizLevel = "basic" | "intermediate" | "advanced";

const LEVEL_META: Record<QuizLevel, { label: string; className: string }> = {
  basic: {
    label: "基礎",
    className:
      "border-sky-500/50 bg-sky-50 text-sky-800 dark:border-sky-500/40 dark:bg-sky-500/15 dark:text-sky-100",
  },
  intermediate: {
    label: "応用",
    className:
      "border-amber-500/50 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-100",
  },
  advanced: {
    label: "発展",
    className:
      "border-violet-500/50 bg-violet-50 text-violet-800 dark:border-violet-500/40 dark:bg-violet-500/15 dark:text-violet-100",
  },
};

export function quizLevelLabel(level: QuizLevel): string {
  return LEVEL_META[level].label;
}

interface QuizLevelBadgeProps {
  level: QuizLevel;
}

export function QuizLevelBadge({ level }: QuizLevelBadgeProps) {
  const meta = LEVEL_META[level];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider",
        meta.className
      )}
    >
      {meta.label}
    </span>
  );
}
