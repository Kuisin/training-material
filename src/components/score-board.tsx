import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import {
  downloadAssessmentExcel,
  downloadHistoricalAttemptExcel,
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
  type AssessmentAttemptRecord,
  type ScoreEntry,
} from "../lib/score-store";
import { quizLevelLabel } from "./quiz-level-badge";

interface ScoreItem extends ScoreReportItem {
  label: ReactNode;
}

interface ScoreBoardProps {
  items: ScoreItem[];
  title?: ReactNode;
  report?: AssessmentReportMeta;
}

interface LessonGroup {
  lessonNum: string;
  lessonTitle: string;
  pageId: string;
  items: ScoreItem[];
}

interface Tier {
  emoji: string;
  message: string;
  ring: string;
}

type LessonFilter = "all" | "review";

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

function groupByLesson(items: ScoreItem[]): LessonGroup[] {
  const map = new Map<string, LessonGroup>();
  for (const item of items) {
    let group = map.get(item.lessonNum);
    if (!group) {
      group = {
        lessonNum: item.lessonNum,
        lessonTitle: item.lessonTitle,
        pageId: pageIdFromScoreId(item.id),
        items: [],
      };
      map.set(item.lessonNum, group);
    }
    group.items.push(item);
  }
  return [...map.values()].sort((a, b) => Number(a.lessonNum) - Number(b.lessonNum));
}

function itemShortLabel(item: ScoreItem): string {
  if (item.kind === "code") return "コード組み立て";
  if (item.kind === "flow") return "フロー組み立て";
  if (item.kind === "quiz" && item.difficulty) return quizLevelLabel(item.difficulty);
  return item.labelText;
}

function itemStatusIcon(
  entry: ScoreEntry | undefined,
  id: string
): { symbol: string; className: string } {
  if (!entry?.answered) {
    if (isItemAnswered(id)) {
      return {
        symbol: "…",
        className: "bg-brand/15 text-brand",
      };
    }
    return {
      symbol: "–",
      className: "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-400",
    };
  }
  if (entry.correct) {
    return {
      symbol: "✓",
      className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    };
  }
  return {
    symbol: "✕",
    className: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  };
}

export function ScoreBoard({ items, title = "総合スコア", report }: ScoreBoardProps) {
  const ids = items.map((item) => item.id);
  const { total, answered, correct, entries } = useScoreSummary(ids);
  const entryMap = useMemo(() => new Map(entries.map((e) => [e.id, e.entry])), [entries]);
  const history = useAttemptHistory();
  const draftCount = useDraftAnswerCount(ids);
  const ratio = answered > 0 ? correct / answered : 0;
  const percent = Math.round(ratio * 100);
  const tier = tierFor(ratio);
  const [downloading, setDownloading] = useState(false);
  const [downloadingHistoryId, setDownloadingHistoryId] = useState<string | null>(null);
  const [filter, setFilter] = useState<LessonFilter>("all");
  const [expandedPageId, setExpandedPageId] = useState<string | null>(null);

  const lessonGroups = useMemo(() => groupByLesson(items), [items]);
  const hasAnyProgress = answered > 0 || draftCount > 0;

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

  async function handleDownloadHistory(record: AssessmentAttemptRecord, attemptNumber: number) {
    if (!report) return;
    setDownloadingHistoryId(record.id);
    try {
      const ratio =
        record.summary.answered > 0 ? record.summary.correct / record.summary.answered : 0;
      await downloadHistoricalAttemptExcel(
        report,
        record,
        items,
        tierFor(ratio).message,
        attemptNumber
      );
    } finally {
      setDownloadingHistoryId(null);
    }
  }

  return (
    <div className="not-prose my-6 flex flex-col gap-4">
      {/* サマリーカード */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
        {hasAnyProgress ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4 sm:flex-1">
              <span aria-hidden className="text-4xl">
                {answered > 0 ? tier.emoji : "📝"}
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
                {answered > 0 ? (
                  <>
                    <p className={cn("text-3xl font-black tabular-nums leading-tight", tier.ring)}>
                      {correct}
                      <span className="text-lg text-slate-400"> / {answered}</span>
                      <span className="ml-2 text-base font-semibold text-slate-500 dark:text-slate-400">
                        ({percent}%)
                      </span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      提出済み {answered} / {total} 問 · {tier.message}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    回答済み {draftCount} 問 — 各ページで「提出する」を押すと採点されます
                  </p>
                )}
              </div>
            </div>

            {answered > 0 && (
              <div className="sm:w-40">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-brand transition-[width] duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span aria-hidden className="text-4xl">
              📝
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                各レッスンページで回答し「提出する」を押すと、ここに総合スコアが表示されます。
              </p>
            </div>
          </div>
        )}

        {(report || hasAnyProgress) && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-700/60">
            {report && answered > 0 && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/40 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-60 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100 dark:hover:bg-emerald-500/20"
              >
                <span aria-hidden>{downloading ? "⏳" : "📥"}</span>
                {downloading ? "作成中…" : "Excel レポート"}
              </button>
            )}
            <button
              type="button"
              onClick={handleRetest}
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand/40 bg-brand/5 px-3 py-2 text-xs font-semibold text-brand transition hover:bg-brand/10 dark:border-brand/30 dark:bg-brand/10 dark:hover:bg-brand/20"
            >
              再テスト
            </button>
          </div>
        )}
      </div>

      {/* レッスン別（折りたたみ） */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-700/60">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            レッスン別結果
            <span className="ml-2 font-normal text-slate-400">({lessonGroups.length})</span>
          </h4>
          <div className="flex gap-1">
            {(
              [
                ["all", "すべて"],
                ["review", "要復習"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition",
                  filter === key
                    ? "bg-brand/10 text-brand"
                    : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ul className="divide-y divide-slate-100 dark:divide-slate-700/60" role="list">
          {lessonGroups.map((group) => (
            <LessonRow
              key={group.pageId}
              group={group}
              entryMap={entryMap}
              filter={filter}
              expanded={expandedPageId === group.pageId}
              onToggle={() =>
                setExpandedPageId((prev) => (prev === group.pageId ? null : group.pageId))
              }
            />
          ))}
        </ul>

        {filter === "review" && (
          <p className="border-t border-slate-100 px-4 py-2 text-xs text-slate-400 dark:border-slate-700/60">
            未提出・不正解あり・満点未達のレッスンのみ表示
          </p>
        )}

        {answered > 0 && (
          <p className="border-t border-slate-100 px-4 py-2.5 text-center text-xs text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
            行をタップすると設問ごとの結果を表示 · 該当スライドで解説を確認できます
          </p>
        )}
      </div>

      {/* 受験履歴（折りたたみ） */}
      {history.length > 0 && (
        <details className="group rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-bold text-slate-900 marker:content-none dark:text-slate-100 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-2">
              <span>
                過去の受験履歴
                <span className="ml-2 font-normal text-slate-400">({history.length})</span>
              </span>
              <span
                aria-hidden
                className="text-slate-400 transition group-open:rotate-180"
              >
                ▼
              </span>
            </span>
          </summary>
          <ul className="divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-700/60 dark:border-slate-700/60" role="list">
            {history.map((record, i) => {
              const attemptNumber = history.length - i;
              const isDownloading = downloadingHistoryId === record.id;

              return (
                <li
                  key={record.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm"
                >
                  <div className="min-w-0">
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      #{history.length - i}
                    </span>
                    <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(record.finishedAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-3 tabular-nums text-xs">
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
                        {record.summary.correct}/{record.summary.answered}
                      </span>
                    </div>
                    {report && (
                      <button
                        type="button"
                        onClick={() => handleDownloadHistory(record, attemptNumber)}
                        disabled={isDownloading}
                        aria-label={`#${history.length - i} の結果を Excel でダウンロード`}
                        className="inline-flex shrink-0 items-center gap-1 rounded-md border border-emerald-600/30 bg-emerald-50 px-2 py-1 text-[0.65rem] font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-60 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100 dark:hover:bg-emerald-500/20"
                      >
                        <span aria-hidden>{isDownloading ? "⏳" : "📥"}</span>
                        Excel
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </details>
      )}
    </div>
  );
}

function LessonRow({
  group,
  entryMap,
  filter,
  expanded,
  onToggle,
}: {
  group: LessonGroup;
  entryMap: Map<string, ScoreEntry | undefined>;
  filter: LessonFilter;
  expanded: boolean;
  onToggle: () => void;
}) {
  const itemIds = group.items.map((item) => item.id);
  const submitted = usePageConfirmed(group.pageId);
  const { correct, total } = useScoreSummary(itemIds);
  const hasDraft = itemIds.some(isItemAnswered);
  const hasWrong = group.items.some((item) => {
    const entry = entryMap.get(item.id);
    return entry?.answered && !entry.correct;
  });
  const needsReview = !submitted || hasWrong || (submitted && correct < total);

  if (filter === "review" && !needsReview) return null;

  const statusLabel = submitted
    ? `${correct}/${total} 正解`
    : hasDraft
      ? "未提出"
      : "未着手";

  const statusClass = submitted
    ? correct === total
      ? "text-emerald-600 dark:text-emerald-400"
      : correct > 0
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400"
    : hasDraft
      ? "text-brand"
      : "text-slate-400";

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
      >
        <span className="w-8 shrink-0 font-mono text-xs font-bold text-slate-400">
          L{group.lessonNum}
        </span>
        <span className="min-w-0 flex-1 truncate text-slate-700 dark:text-slate-200">
          {group.lessonTitle}
        </span>
        <span className="hidden shrink-0 sm:flex">
          <QuestionDots items={group.items} entryMap={entryMap} />
        </span>
        <span className={cn("shrink-0 text-xs font-semibold tabular-nums", statusClass)}>
          {statusLabel}
        </span>
        <span
          aria-hidden
          className={cn(
            "shrink-0 text-xs text-slate-400 transition",
            expanded && "rotate-180"
          )}
        >
          ▼
        </span>
      </button>

      {expanded && (
        <ul
          className="border-t border-slate-100 bg-slate-50/80 px-4 py-2 dark:border-slate-700/60 dark:bg-slate-900/30"
          role="list"
        >
          {group.items.map((item) => {
            const entry = entryMap.get(item.id);
            const { symbol, className } = itemStatusIcon(entry, item.id);
            return (
              <li
                key={item.id}
                className="flex items-center gap-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300"
              >
                <span
                  aria-hidden
                  className={cn(
                    "grid size-5 shrink-0 place-items-center rounded-full text-[0.6rem] font-bold",
                    className
                  )}
                >
                  {symbol}
                </span>
                <span className="min-w-0 flex-1">{itemShortLabel(item)}</span>
                {entry?.answered && (
                  <span
                    className={cn(
                      "shrink-0 font-medium",
                      entry.correct
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {entry.correct ? "正解" : "不正解"}
                  </span>
                )}
                {!entry?.answered && isItemAnswered(item.id) && (
                  <span className="shrink-0 text-brand">回答済み</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

function QuestionDots({
  items,
  entryMap,
}: {
  items: ScoreItem[];
  entryMap: Map<string, ScoreEntry | undefined>;
}) {
  return (
    <span className="flex items-center gap-1" aria-hidden>
      {items.map((item) => {
        const entry = entryMap.get(item.id);
        let dotClass = "bg-slate-200 dark:bg-slate-600";
        if (entry?.answered) {
          dotClass = entry.correct
            ? "bg-emerald-500"
            : "bg-red-500";
        } else if (isItemAnswered(item.id)) {
          dotClass = "bg-brand";
        }
        return (
          <span key={item.id} className={cn("size-1.5 rounded-full", dotClass)} />
        );
      })}
    </span>
  );
}
