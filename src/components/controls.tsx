import { cn } from "../lib/cn";

interface ControlsProps {
  current: number;
  total: number;
  hasPrevChapter: boolean;
  hasNextChapter: boolean;
  onPrev: () => void;
  onNext: () => void;
  /** コース内レッスンか（完了ボタンを出せるか） */
  canComplete?: boolean;
  /** レッスンを完了済みか */
  lessonComplete?: boolean;
  /** 完了ボタン押下時 */
  onMarkComplete?: () => void;
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
  canComplete = false,
  lessonComplete = false,
  onMarkComplete,
}: ControlsProps) {
  const atStart = current === 0;
  const atEnd = current === total - 1;
  const prevDisabled = atStart && !hasPrevChapter;

  const showComplete = atEnd && canComplete;
  // 最終スライドで次の章がある場合、完了するまで進めない。
  const mustCompleteToAdvance = showComplete && hasNextChapter && !lessonComplete;
  const nextDisabled = (atEnd && !hasNextChapter) || mustCompleteToAdvance;

  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-slate-200 bg-white/85 px-4 py-2.5 backdrop-blur sm:gap-3 dark:border-slate-800 dark:bg-slate-900/85">
      <button
        type="button"
        onClick={onPrev}
        disabled={prevDisabled}
        className={cn(
          baseBtn,
          "shrink-0 border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        )}
      >
        ← {atStart && hasPrevChapter ? "前の章" : "前へ"}
      </button>

      <span className="min-w-0 flex-1 text-center text-sm tabular-nums text-slate-500 dark:text-slate-400">
        {current + 1} / {total}
      </span>

      {showComplete ? (
        lessonComplete ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            <span aria-hidden>✓</span>完了済み
          </span>
        ) : (
          <button
            type="button"
            onClick={onMarkComplete}
            className={cn(
              baseBtn,
              "gap-0! shrink-0 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
            )}
          >
            <span aria-hidden className="mr-1">🎓</span>
            <span className="hidden sm:inline">このレッスンを</span>完了にする
          </button>
        )
      ) : null}

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        title={mustCompleteToAdvance ? "このレッスンを完了にすると次の章へ進めます" : undefined}
        className={cn(baseBtn, "shrink-0 bg-brand text-white hover:bg-brand-dark")}
      >
        {atEnd && hasNextChapter ? "次の章" : "次へ"} →
      </button>
    </footer>
  );
}
