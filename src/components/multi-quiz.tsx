import { useLayoutEffect, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import {
  readUiState,
  registerGrader,
  registerReportDetail,
  useItemConfirmed,
  usePersistentState,
} from "../lib/score-store";
import { QuizLevelBadge, type QuizLevel } from "./quiz-level-badge";
import { resolveQuizMode, type QuizMode } from "./quiz-mode";

export type { QuizMode } from "./quiz-mode";

interface MultiQuizProps {
  question: ReactNode;
  options: string[];
  /** 正解の 0 始まりインデックス（複数） */
  answers: number[];
  explanation: string;
  scoreId?: string;
  level?: QuizLevel;
  /** instant: 「答えを見る」で解説 / submit: ページ提出後に解説 */
  mode?: QuizMode;
}

function setsEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);
  return sortedA.every((v, i) => v === sortedB[i]);
}

type OptionStatus = "idle" | "draft" | "hit" | "miss" | "wrong" | "neutral";

function getOptionStatus(
  index: number,
  selected: number[],
  answers: number[],
  confirmed: boolean,
  answered: boolean
): OptionStatus {
  if (!answered) return "idle";
  if (!confirmed) return selected.includes(index) ? "draft" : "idle";

  const isAnswer = answers.includes(index);
  const isSelected = selected.includes(index);
  if (isAnswer && isSelected) return "hit";
  if (isAnswer && !isSelected) return "miss";
  if (!isAnswer && isSelected) return "wrong";
  return "neutral";
}

const STATUS_STYLE: Record<OptionStatus, string> = {
  idle: "border-slate-300 bg-white hover:border-brand hover:bg-brand/5 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-brand",
  draft: "border-brand bg-brand/5 text-slate-900 dark:bg-brand/10 dark:text-slate-100",
  hit: "border-emerald-500 bg-emerald-50 text-emerald-950 dark:border-emerald-500/70 dark:bg-emerald-500/15 dark:text-emerald-100",
  miss: "border-amber-500 border-dashed bg-amber-50 text-amber-950 dark:border-amber-500/70 dark:bg-amber-500/15 dark:text-amber-100",
  wrong: "border-red-500 bg-red-50 text-red-950 dark:border-red-500/70 dark:bg-red-500/15 dark:text-red-100",
  neutral:
    "border-slate-200 bg-slate-50/80 text-slate-500 dark:border-slate-700 dark:bg-slate-800/30 dark:text-slate-500",
};

const STATUS_BADGE: Partial<Record<OptionStatus, { label: string; className: string }>> = {
  hit: {
    label: "正解",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/25 dark:text-emerald-100",
  },
  miss: {
    label: "正解（選び忘れ）",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-500/25 dark:text-amber-100",
  },
  wrong: {
    label: "不正解",
    className: "bg-red-100 text-red-800 dark:bg-red-500/25 dark:text-red-100",
  },
};

function statusMarker(status: OptionStatus, letter: string): string {
  switch (status) {
    case "hit":
      return "✓";
    case "miss":
      return "!";
    case "wrong":
      return "✕";
    case "draft":
      return "●";
    default:
      return letter;
  }
}

function markerClass(status: OptionStatus): string {
  switch (status) {
    case "hit":
      return "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-400 dark:bg-emerald-500";
    case "miss":
      return "border-amber-600 bg-amber-600 text-white dark:border-amber-400 dark:bg-amber-500";
    case "wrong":
      return "border-red-600 bg-red-600 text-white dark:border-red-400 dark:bg-red-500";
    case "draft":
      return "border-brand bg-brand text-white";
    default:
      return "border-current";
  }
}

function countResults(selected: number[], answers: number[]) {
  const answerSet = new Set(answers);
  let hits = 0;
  let misses = 0;
  let wrongs = 0;

  for (const i of answers) {
    if (selected.includes(i)) hits += 1;
    else misses += 1;
  }
  for (const i of selected) {
    if (!answerSet.has(i)) wrongs += 1;
  }

  return { hits, misses, wrongs, totalCorrect: answers.length };
}

export function MultiQuiz({ question, options, answers, explanation, scoreId, level, mode }: MultiQuizProps) {
  const effectiveMode = resolveQuizMode(mode, scoreId);
  const pageConfirmed = useItemConfirmed(scoreId);
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = usePersistentState<number[]>(scoreId, []);
  const answered = selected.length > 0;
  const confirmed =
    effectiveMode === "instant" ? revealed : pageConfirmed;
  const isCorrect = setsEqual(selected, answers);
  const results = countResults(selected, answers);

  useLayoutEffect(() => {
    if (!scoreId) return;
    registerGrader(scoreId, {
      isAnswered: () => (readUiState<number[]>(scoreId) ?? []).length > 0,
      grade: () => setsEqual(readUiState<number[]>(scoreId) ?? [], answers),
    });
    registerReportDetail(scoreId, () => {
      const selected = readUiState<number[]>(scoreId) ?? [];
      if (selected.length === 0) return "";
      return [...selected]
        .sort((a, b) => a - b)
        .map((i) => `・${options[i]}`)
        .join("\n");
    });
    registerReportDetail(`${scoreId}:correct`, () =>
      [...answers]
        .sort((a, b) => a - b)
        .map((i) => `・${options[i]}`)
        .join("\n")
    );
  }, [scoreId, answers, options]);

  function toggle(i: number) {
    if (confirmed) return;
    setSelected(selected.includes(i) ? selected.filter((v) => v !== i) : [...selected, i]);
  }

  function handleRetry() {
    setSelected([]);
    setRevealed(false);
  }

  return (
    <div className="not-prose my-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      <div className="mb-1 flex flex-wrap items-start gap-2">
        {level && <QuizLevelBadge level={level} />}
        <p className="flex min-w-0 flex-1 items-start gap-2 font-semibold">
          <span aria-hidden className="text-brand">
            ❓
          </span>
          <span>{question}</span>
        </p>
      </div>
      <p className="mb-4 pl-7 text-xs text-slate-500 dark:text-slate-400">
        該当するものをすべて選んでください（複数選択）
      </p>

      {confirmed && (
        <div className="mb-4 flex flex-wrap gap-2 pl-7 text-[0.65rem] font-medium">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-100">
            ✓ 正解を選択
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-amber-800 dark:bg-amber-500/20 dark:text-amber-100">
            ! 正解の選び忘れ
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-red-800 dark:bg-red-500/20 dark:text-red-100">
            ✕ 不正解を選択
          </span>
        </div>
      )}

      <ul className="flex flex-col gap-2.5" role="list">
        {options.map((opt, i) => {
          const status = getOptionStatus(i, selected, answers, confirmed, answered);
          const badge = STATUS_BADGE[status];
          const letter = String.fromCharCode(65 + i);

          return (
            <li key={i}>
              <button
                type="button"
                disabled={confirmed}
                onClick={() => toggle(i)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-[0.95rem] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-default",
                  STATUS_STYLE[status]
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full border text-xs font-bold",
                    markerClass(status)
                  )}
                >
                  {statusMarker(status, letter)}
                </span>
                <span className="min-w-0 flex-1">{opt}</span>
                {badge && (
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold",
                      badge.className
                    )}
                  >
                    {badge.label}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {effectiveMode === "submit" && answered && !confirmed && (
        <p className="mt-4 text-xs font-medium text-brand">
          {selected.length} 件選択済み（ページ下部で提出）
        </p>
      )}

      {effectiveMode === "instant" && answered && !confirmed && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            答えを見る
          </button>
        </div>
      )}

      {answered && confirmed && (
        <div
          role="status"
          className={cn(
            "mt-4 rounded-xl p-4 text-sm leading-relaxed",
            isCorrect
              ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100"
              : "bg-amber-50 text-amber-900 dark:bg-amber-500/10 dark:text-amber-100"
          )}
        >
          <p className="font-bold">{isCorrect ? "✅ 正解！" : "❌ 惜しい！"}</p>

          {!isCorrect && (
            <ul className="mt-2 space-y-1 text-xs font-medium">
              {results.hits > 0 && (
                <li className="text-emerald-700 dark:text-emerald-300">
                  ✓ 正解を選択: {results.hits} / {results.totalCorrect} 件
                </li>
              )}
              {results.misses > 0 && (
                <li className="text-amber-700 dark:text-amber-300">
                  ! 選び忘れ: {results.misses} 件
                </li>
              )}
              {results.wrongs > 0 && (
                <li className="text-red-700 dark:text-red-300">✕ 不正解を選択: {results.wrongs} 件</li>
              )}
            </ul>
          )}

          <p className="mt-2">{explanation}</p>
          {effectiveMode === "instant" && !isCorrect && (
            <button
              type="button"
              onClick={handleRetry}
              className="mt-3 rounded-lg border border-current/30 px-4 py-2 text-sm font-semibold transition hover:bg-black/5 dark:hover:bg-white/10"
            >
              解き直す
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** レッスン末尾の複数選択テスト — 「答えを見る」で解説を表示 */
export function LessonMultiQuiz(props: Omit<MultiQuizProps, "mode" | "scoreId">) {
  return <MultiQuiz {...props} mode="instant" />;
}

/** コーステスト — ページ提出後にのみ正解・解説を表示 */
export function CourseTestMultiQuiz(props: Omit<MultiQuizProps, "mode"> & { scoreId: string }) {
  return <MultiQuiz {...props} mode="submit" />;
}
