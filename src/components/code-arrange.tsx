import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { useArrangeExercise } from "../lib/use-arrange-exercise";

interface CodeArrangeProps {
  scoreId: string;
  instruction?: ReactNode;
  language?: string;
  lines: string[];
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
  className,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "grid size-7 place-items-center rounded-md border text-xs transition",
        "border-slate-600/80 text-slate-400 hover:border-brand hover:text-brand",
        "disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-slate-600/80 disabled:hover:text-slate-400",
        "dark:border-slate-600 dark:hover:border-brand",
        className
      )}
    >
      {children}
    </button>
  );
}

export function CodeArrange({ scoreId, instruction, language = "ABAP", lines }: CodeArrangeProps) {
  const {
    confirmed,
    pool,
    built,
    dragIndex,
    setDragIndex,
    pick,
    unpick,
    reorder,
    complete,
    isCorrect,
    displayText,
  } = useArrangeExercise({ scoreId, lines, autoIndent: true });

  function builtRowClass(lineIdx: number, pos: number): string {
    if (!confirmed || !complete) return "border-transparent bg-slate-800/40 hover:bg-slate-800/70";
    if (lineIdx === pos) return "border-emerald-500/60 bg-emerald-950/40";
    return "border-red-500/60 bg-red-950/30";
  }

  return (
    <div className="not-prose my-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      <p className="mb-1 flex items-start gap-2 font-semibold text-slate-900 dark:text-slate-100">
        <span aria-hidden className="text-brand">
          🧩
        </span>
        <span>{instruction ?? "一覧から行を選んでコードを組み立ててください"}</span>
      </p>
      <p className="mb-4 pl-7 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        下の一覧から行を追加 → 組み立て欄で並べ替え（LOOP/IF/FORM などは自動でインデント）
      </p>

      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">組み立てたコード</p>
          <span className="font-mono text-xs tabular-nums text-slate-400">
            {built.length}/{lines.length}
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-700/80 bg-slate-800/80 px-3 py-1.5">
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-slate-500">
              {language}
            </span>
            {complete && !confirmed && (
              <span className="text-[0.65rem] font-medium text-emerald-400">回答済み</span>
            )}
          </div>

          <div className="min-h-28 p-2">
            {built.length === 0 ? (
              <p className="flex min-h-24 items-center justify-center px-4 text-center text-sm text-slate-500">
                下の一覧から行を選んで追加してください
              </p>
            ) : (
              <ol className="flex flex-col gap-1" role="list">
                {built.map((lineIdx, pos) => (
                  <li
                    key={`${pos}-${lineIdx}`}
                    draggable={!confirmed}
                    onDragStart={() => setDragIndex(pos)}
                    onDragEnd={() => setDragIndex(null)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragIndex === null || dragIndex === pos || confirmed) return;
                      reorder(dragIndex, pos);
                      setDragIndex(pos);
                    }}
                    onDrop={(e) => e.preventDefault()}
                    className={cn(
                      "group flex items-stretch gap-0 rounded-lg border transition",
                      confirmed ? "cursor-default" : "cursor-grab active:cursor-grabbing",
                      dragIndex === pos && "opacity-50",
                      builtRowClass(lineIdx, pos)
                    )}
                  >
                    {!confirmed && (
                      <span
                        aria-hidden
                        className="flex w-7 shrink-0 select-none items-center justify-center text-slate-600 group-hover:text-slate-400"
                      >
                        ⋮⋮
                      </span>
                    )}

                    <span
                      aria-hidden
                      className="flex w-8 shrink-0 select-none items-center justify-end pr-1 font-mono text-xs tabular-nums text-slate-500"
                    >
                      {confirmed && complete ? (lineIdx === pos ? "✓" : "✗") : String(pos + 1).padStart(2, "0")}
                    </span>

                    <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre py-2 pr-2 font-mono text-[0.8125rem] leading-relaxed text-slate-100">
                      {displayText(lineIdx, pos)}
                    </code>

                    {!confirmed && (
                      <span className="flex shrink-0 items-center gap-0.5 pr-1.5">
                        <IconButton
                          label="上へ"
                          disabled={pos === 0}
                          onClick={() => reorder(pos, pos - 1)}
                        >
                          ↑
                        </IconButton>
                        <IconButton
                          label="下へ"
                          disabled={pos === built.length - 1}
                          onClick={() => reorder(pos, pos + 1)}
                        >
                          ↓
                        </IconButton>
                        <IconButton
                          label="行を戻す"
                          onClick={() => unpick(pos)}
                          className="hover:border-red-500/60 hover:text-red-400"
                        >
                          ×
                        </IconButton>
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          コード行（一覧）
          {pool.length > 0 && (
            <span className="ml-2 font-normal text-slate-400">残り {pool.length} 行</span>
          )}
        </p>

        {pool.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 px-4 py-3 text-center text-sm text-slate-400 dark:border-slate-700">
            すべての行を使いました — 並べ替えて完成させてください
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5" role="list">
            {pool.map((lineIdx) => (
              <li key={lineIdx}>
                <div className="flex items-stretch overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40">
                  <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre px-3 py-2.5 font-mono text-[0.8125rem] leading-relaxed text-slate-700 dark:text-slate-200">
                    {lines[lineIdx]?.trimStart() ?? ""}
                  </code>
                  <button
                    type="button"
                    disabled={confirmed}
                    onClick={() => pick(lineIdx)}
                    className={cn(
                      "shrink-0 border-l px-3 text-xs font-semibold transition",
                      confirmed
                        ? "cursor-default border-slate-200 text-slate-300 dark:border-slate-700"
                        : "border-slate-200 text-brand hover:bg-brand/10 dark:border-slate-700 dark:hover:bg-brand/15"
                    )}
                  >
                    追加
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {confirmed && (
        <div
          role="status"
          className={cn(
            "mt-4 rounded-xl p-4 text-sm leading-relaxed",
            isCorrect
              ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100"
              : "bg-amber-50 text-amber-900 dark:bg-amber-500/10 dark:text-amber-100"
          )}
        >
          {!complete
            ? "❌ 未回答のため採点対象外です。"
            : isCorrect
              ? "✅ 正解！順番どおりに組み立てられました。"
              : "❌ 惜しい！組み立てたコードの順番を見直してみましょう。"}
        </div>
      )}
    </div>
  );
}
