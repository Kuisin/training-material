import { cn } from "../lib/cn";
import {
  confirmPage,
  useDraftAnswerCount,
  usePageConfirmed,
  useScoreSummary,
} from "../lib/score-store";

interface PageSubmitBarProps {
  pageId: string;
  itemIds: string[];
  lessonLabel?: string;
}

/** レッスンページ末尾の「このページを提出」バー */
export function PageSubmitBar({ pageId, itemIds, lessonLabel }: PageSubmitBarProps) {
  const submitted = usePageConfirmed(pageId);
  const { total, answered, correct } = useScoreSummary(itemIds);
  const draftCount = useDraftAnswerCount(itemIds);

  function handleSubmit() {
    confirmPage(pageId, itemIds);
  }

  if (submitted) {
    const ratio = answered > 0 ? correct / answered : 0;
    const allCorrect = correct === total && answered === total;

    return (
      <div
        className={cn(
          "not-prose my-6 rounded-2xl border p-5 shadow-sm",
          allCorrect
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
            : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50"
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {allCorrect ? "✅ 提出済み — 満点！" : "📝 提出済み"}
              {lessonLabel && (
                <span className="ml-2 font-normal text-slate-500 dark:text-slate-400">
                  {lessonLabel}
                </span>
              )}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              正解 {correct} / {total} 問
              {answered < total && (
                <span className="text-amber-600 dark:text-amber-400">
                  {" "}
                  （未回答 {total - answered} 問）
                </span>
              )}
            </p>
          </div>
          <p
            className={cn(
              "text-2xl font-black tabular-nums",
              ratio >= 1
                ? "text-emerald-600 dark:text-emerald-400"
                : ratio >= 0.5
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-red-600 dark:text-red-400"
            )}
          >
            {answered > 0 ? Math.round(ratio * 100) : 0}%
          </p>
        </div>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          各問題の解説は上のカード内で確認できます。別ページに移動しても回答は保存されています。
        </p>
      </div>
    );
  }

  return (
    <div className="not-prose my-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
            このページを提出
            {lessonLabel && (
              <span className="ml-2 font-normal text-slate-500 dark:text-slate-400">
                {lessonLabel}
              </span>
            )}
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            回答済み {draftCount} / {itemIds.length} 問
          </p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={draftCount === 0}
          className="shrink-0 rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          提出する
        </button>
      </div>
      {draftCount > 0 && draftCount < itemIds.length && (
        <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">
          未回答の問題がありますが、回答済みの問題だけ採点されます
        </p>
      )}
      {draftCount === 0 && (
        <p className="mt-3 text-xs text-slate-400">1問以上回答すると提出できます</p>
      )}
    </div>
  );
}
