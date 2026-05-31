import { useEffect } from "react";
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

interface QuizProps {
  question: ReactNode;
  options: string[];
  /** 正解の 0 始まりインデックス */
  answer: number;
  explanation: string;
  scoreId?: string;
  level?: QuizLevel;
}

export function Quiz({ question, options, answer, explanation, scoreId, level }: QuizProps) {
  const confirmed = useItemConfirmed(scoreId);
  const [selected, setSelected] = usePersistentState<number | null>(scoreId, null);
  const answered = selected !== null;
  const isCorrect = selected === answer;

  useEffect(() => {
    if (!scoreId) return;
    registerGrader(scoreId, {
      isAnswered: () => readUiState<number | null>(scoreId) !== null,
      grade: () => readUiState<number | null>(scoreId) === answer,
    });
    registerReportDetail(scoreId, () => {
      const selected = readUiState<number | null>(scoreId);
      if (selected === null || selected === undefined) return "";
      return options[selected] ?? "";
    });
    registerReportDetail(`${scoreId}:correct`, () => options[answer] ?? "");
  }, [scoreId, answer, options]);

  function optionClass(i: number): string {
    if (!answered)
      return "border-slate-300 bg-white hover:border-brand hover:bg-brand/5 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-brand";
    if (!confirmed) {
      if (i === selected)
        return "border-brand bg-brand/5 text-slate-900 dark:bg-brand/10 dark:text-slate-100";
      return "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800";
    }
    if (i === answer)
      return "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-100";
    if (i === selected)
      return "border-red-500 bg-red-50 text-red-900 dark:bg-red-500/15 dark:text-red-100";
    return "border-slate-200 bg-white/60 text-slate-400 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-500";
  }

  return (
    <div className="not-prose my-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      <div className="mb-4 flex flex-wrap items-start gap-2">
        {level && <QuizLevelBadge level={level} />}
        <p className="flex min-w-0 flex-1 items-start gap-2 font-semibold">
          <span aria-hidden className="text-brand">
            ❓
          </span>
          <span>{question}</span>
        </p>
      </div>
      <ul className="flex flex-col gap-2.5" role="list">
        {options.map((opt, i) => (
          <li key={i}>
            <button
              type="button"
              disabled={confirmed}
              onClick={() => setSelected(i)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-[0.95rem] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-default",
                optionClass(i)
              )}
            >
              <span
                aria-hidden
                className="grid size-6 shrink-0 place-items-center rounded-full border border-current text-xs font-bold"
              >
                {confirmed && i === answer
                  ? "✓"
                  : confirmed && i === selected
                    ? "✕"
                    : answered && i === selected
                      ? "●"
                      : String.fromCharCode(65 + i)}
              </span>
              <span>{opt}</span>
            </button>
          </li>
        ))}
      </ul>

      {answered && !confirmed && (
        <p className="mt-4 text-xs font-medium text-brand">回答済み（ページ下部で提出）</p>
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
          <p className="mt-1">{explanation}</p>
        </div>
      )}
    </div>
  );
}
