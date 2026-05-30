import { cn } from "../lib/cn";

interface ControlsProps {
  current: number;
  total: number;
  hasPrevChapter: boolean;
  hasNextChapter: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const baseBtn =
  "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40";

export function Controls({
  current,
  total,
  hasPrevChapter,
  hasNextChapter,
  onPrev,
  onNext,
}: ControlsProps) {
  const atStart = current === 0;
  const atEnd = current === total - 1;
  const prevDisabled = atStart && !hasPrevChapter;
  const nextDisabled = atEnd && !hasNextChapter;

  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-slate-200 bg-white/85 px-4 py-2.5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85">
      <button
        type="button"
        onClick={onPrev}
        disabled={prevDisabled}
        className={cn(
          baseBtn,
          "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        )}
      >
        ← {atStart && hasPrevChapter ? "前の章" : "前へ"}
      </button>

      <span className="flex-1 text-center text-sm tabular-nums text-slate-500 dark:text-slate-400">
        {current + 1} / {total}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className={cn(baseBtn, "bg-brand text-white hover:bg-brand-dark")}
      >
        {atEnd && hasNextChapter ? "次の章" : "次へ"} →
      </button>
    </footer>
  );
}
