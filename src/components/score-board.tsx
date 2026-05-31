import { useState } from "react";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import {
  downloadAssessmentExcel,
  type AssessmentReportMeta,
  type ScoreReportItem,
} from "../lib/export-assessment-excel";
import {
  isItemAnswered,
  pageIdFromScoreId,
  startNewAttempt,
  useAttemptHistory,
  useDraftAnswerCount,
  usePageConfirmed,
  useScoreSummary,
} from "../lib/score-store";

interface ScoreItem extends ScoreReportItem {
  /** UI 表示用ラベル */
  label: ReactNode;
}

interface ScoreBoardProps {
  items: ScoreItem[];
  title?: ReactNode;
  /** Excel レポートのメタ情報（省略時はダウンロードボタン非表示） */
  report?: AssessmentReportMeta;
}

interface Tier {
  emoji: string;
  message: string;
  ring: string;
}

function tierFor(ratio: number): Tier {
  if (ratio >= 1)
    return { emoji: "🏆", message: "全問正解！おめでとうございます。", ring: "text-emerald-500" };
  if (ratio >= 0.8)
    return { emoji: "🎉", message: "よくできました。あと少しで満点です。", ring: "text-emerald-500" };
  if (ratio >= 0.5)
    return { emoji: "👍", message: "合格ライン。間違えた問題を復習しましょう。", ring: "text-amber-500" };
  return { emoji: "📚", message: "もう一度該当の章を見直してみましょう。", ring: "text-red-500" };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", { hour12: false });
}

export function ScoreBoard({ items, title = "総合スコア", report }: ScoreBoardProps) {
  const ids = items.map((item) => item.id);
  const { total, answered, correct, entries } = useScoreSummary(ids);
  const history = useAttemptHistory();
  const draftCount = useDraftAnswerCount(ids);
  const ratio = answered > 0 ? correct / answered : 0;
  const percent = Math.round(ratio * 100);
  const tier = tierFor(ratio);
  const [downloading, setDownloading] = useState(false);

  const pageIds = [...new Set(ids.map(pageIdFromScoreId))];
  const pageGroups = pageIds.map((pageId) => ({
    pageId,
    itemIds: ids.filter((id) => pageIdFromScoreId(id) === pageId),
  }));

  function handleRetest() {
    const hasProgress = answered > 0 || draftCount > 0;
    if (hasProgress) {
      if (
        !window.confirm(
          "現在の回答を履歴に保存して、新しいテストを開始します。よろしいですか？"
        )
      ) {
        return;
      }
    } else if (!window.confirm("新しいテストを開始しますか？")) {
      return;
    }
    startNewAttempt(ids);
  }

  async function handleDownload() {
    if (!report) return;
    setDownloading(true);
    try {
      await downloadAssessmentExcel(
        report,
        { total, answered, correct, percent, tierMessage: tier.message },
        items,
        entries
      );
    } finally {
      setDownloading(false);
    }
  }

  const hasAnyProgress = answered > 0 || draftCount > 0;

  return (
    <div className="not-prose my-6 flex flex-col gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
        {hasAnyProgress ? (
          <>
            <div className="flex flex-col items-center gap-2 text-center">
              <span aria-hidden className="text-5xl">
                {answered > 0 ? tier.emoji : "📝"}
              </span>
              <h3 className="text-lg font-bold">{title}</h3>
              {answered > 0 ? (
                <>
                  <p className={cn("text-5xl font-black tabular-nums", tier.ring)}>
                    {correct}
                    <span className="text-2xl text-slate-400"> / {answered}</span>
                  </p>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    正答率 {percent}%（提出済み {answered} / {total} 問）
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {answered > 0 ? tier.message : "各レッスンページで提出すると、ここにスコアが反映されます。"}
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  回答済み {draftCount} 問 — 各レッスンページで「提出する」を押すと採点されます
                </p>
              )}
            </div>

            {answered > 0 && (
              <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-brand transition-[width] duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <span aria-hidden className="text-5xl">
              📝
            </span>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              各レッスンページで回答し「提出する」を押すと、ここに総合スコアが表示されます。
            </p>
          </div>
        )}

        <ul className="mt-5 flex flex-col gap-1.5" role="list">
          {entries.map(({ id, entry }, i) => (
            <li
              key={id}
              className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2 text-sm dark:border-slate-700/60"
            >
              <span
                aria-hidden
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold",
                  !entry?.answered
                    ? isItemAnswered(id)
                      ? "bg-brand/15 text-brand"
                      : "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-400"
                    : entry.correct
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                      : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                )}
              >
                {!entry?.answered
                  ? isItemAnswered(id)
                    ? "…"
                    : "–"
                  : entry.correct
                    ? "✓"
                    : "✕"}
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-slate-400">Q{i + 1}.</span> {items[i]!.label}
              </span>
            </li>
          ))}
        </ul>

        {answered > 0 && (
          <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            各問題のスライドに戻ると、解説を確認できます
          </p>
        )}

        {report && answered > 0 && (
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-600/40 bg-emerald-50 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-60 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100 dark:hover:bg-emerald-500/20"
          >
            <span aria-hidden>{downloading ? "⏳" : "📥"}</span>
            {downloading ? "Excel を作成中…" : "詳細レポートを Excel でダウンロード"}
          </button>
        )}
      </div>

      {/* ページ別提出状況 */}
      <PageStatusList pageGroups={pageGroups} />

      {/* 再テスト */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">再テスト</h4>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          現在の回答を履歴に保存し、最初からやり直します。回答データはブラウザの localStorage に保存されます。
        </p>
        <button
          type="button"
          onClick={handleRetest}
          className="mt-4 w-full rounded-lg border border-brand/40 bg-brand/5 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand/10 dark:border-brand/30 dark:bg-brand/10 dark:hover:bg-brand/20"
        >
          新しいテストを開始する
        </button>
      </div>

      {/* 受験履歴 */}
      {history.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">過去の受験履歴</h4>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            再テストを開始すると、前回の結果がここに記録されます（最大50件）
          </p>
          <ul className="mt-4 flex flex-col gap-2" role="list">
            {history.map((record, i) => (
              <li
                key={record.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 px-3 py-2.5 text-sm dark:border-slate-700/60"
              >
                <div>
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    #{history.length - i}
                  </span>
                  <span className="ml-2 text-slate-500 dark:text-slate-400">
                    {formatDate(record.finishedAt)}
                  </span>
                </div>
                <div className="flex items-center gap-3 tabular-nums">
                  <span
                    className={cn(
                      "font-bold",
                      record.summary.percent >= 80
                        ? "text-emerald-600 dark:text-emerald-400"
                        : record.summary.percent >= 50
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {record.summary.percent}%
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {record.summary.correct}/{record.summary.answered} 正解
                  </span>
                  <span className="text-xs text-slate-400">
                    {record.pagesConfirmed.length} ページ提出
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function PageStatusList({
  pageGroups,
}: {
  pageGroups: Array<{ pageId: string; itemIds: string[] }>;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">レッスン別提出状況</h4>
      <ul className="mt-3 flex flex-col gap-1.5" role="list">
        {pageGroups.map(({ pageId, itemIds }) => (
          <PageStatusRow key={pageId} pageId={pageId} itemIds={itemIds} />
        ))}
      </ul>
    </div>
  );
}

function PageStatusRow({ pageId, itemIds }: { pageId: string; itemIds: string[] }) {
  const submitted = usePageConfirmed(pageId);
  const { answered, correct, total } = useScoreSummary(itemIds);
  const lessonNum = pageId.replace("fa-l", "");

  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2 text-sm dark:border-slate-700/60">
      <span className="text-slate-700 dark:text-slate-200">L{lessonNum}</span>
      {submitted ? (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          提出済み — {correct}/{total} 正解
        </span>
      ) : answered > 0 || isItemAnswered(itemIds[0]!) || itemIds.some(isItemAnswered) ? (
        <span className="text-xs text-brand">未提出（回答あり）</span>
      ) : (
        <span className="text-xs text-slate-400">未着手</span>
      )}
    </li>
  );
}
