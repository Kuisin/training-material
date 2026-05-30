import { useState } from "react";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";

interface QuizProps {
  question: ReactNode;
  options: string[];
  /** 正解の 0 始まりインデックス */
  answer: number;
  explanation: string;
}

export function Quiz({ question, options, answer, explanation }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const isCorrect = selected === answer;

  function optionClass(i: number): string {
    if (!answered)
      return "border-slate-300 bg-white hover:border-brand hover:bg-brand/5 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-brand";
    if (i === answer)
      return "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-100";
    if (i === selected)
      return "border-red-500 bg-red-50 text-red-900 dark:bg-red-500/15 dark:text-red-100";
    return "border-slate-200 bg-white/60 text-slate-400 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-500";
  }

  return (
    <div className="not-prose my-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      <p className="mb-4 flex items-start gap-2 font-semibold">
        <span aria-hidden className="text-brand">
          ❓
        </span>
        <span>{question}</span>
      </p>
      <ul className="flex flex-col gap-2.5" role="list">
        {options.map((opt, i) => (
          <li key={i}>
            <button
              type="button"
              disabled={answered}
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
                {answered && i === answer
                  ? "✓"
                  : answered && i === selected
                    ? "✕"
                    : String.fromCharCode(65 + i)}
              </span>
              <span>{opt}</span>
            </button>
          </li>
        ))}
      </ul>

      {answered && (
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
          {!isCorrect && (
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-3 rounded-lg border border-current px-3 py-1.5 text-xs font-medium transition hover:bg-black/5 dark:hover:bg-white/10"
            >
              もう一度
            </button>
          )}
        </div>
      )}
    </div>
  );
}
