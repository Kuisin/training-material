import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { useArrangeExercise } from "../lib/use-arrange-exercise";

interface FlowArrangeProps {
  scoreId: string;
  instruction?: ReactNode;
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
        "grid size-7 place-items-center rounded-md border border-slate-300 text-xs text-slate-500 transition",
        "hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-30",
        "dark:border-slate-600",
        className
      )}
    >
      {children}
    </button>
  );
}

/** 手順・フローなどコード以外の並べ替え問題 */
export function FlowArrange({ scoreId, instruction, lines }: FlowArrangeProps) {
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
  } = useArrangeExercise({ scoreId, lines });

  function builtRowClass(lineIdx: number, pos: number): string {
    if (!confirmed) return "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/60";
    if (lineIdx === pos) return "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10";
    return "border-red-500 bg-red-50 dark:bg-red-500/10";
  }

  return (
    <div className="not-prose my-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      <p className="mb-1 flex items-start gap-2 font-semibold text-slate-900 dark:text-slate-100">
        <span aria-hidden className="text-brand">
          📋
        </span>
        <span>{instruction ?? "一覧から手順を選び、正しい順番に並べてください"}</span>
      </p>
      <p className="mb-4 pl-7 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        下の一覧から手順を追加 → 組み立て欄でドラッグまたは ↑ ↓ で並べ替え
      </p>

      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">組み立てた流れ</p>
          <span className="text-xs tabular-nums text-slate-400">
            {built.length}/{lines.length}
          </span>
        </div>

        <div
          className={cn(
            "min-h-28 rounded-xl border-2 border-dashed p-3 transition",
            complete && !confirmed
              ? "border-brand/40 bg-brand/5"
              : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/30"
          )}
        >
          {built.length === 0 ? (
            <p className="flex min-h-24 items-center justify-center px-4 text-center text-sm text-slate-400">
              下の一覧から手順を選んで追加してください
            </p>
          ) : (
            <ol className="flex flex-col gap-1.5" role="list">
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
                    "group flex items-stretch gap-2 rounded-lg border px-2 py-2 transition",
                    confirmed ? "cursor-default" : "cursor-grab active:cursor-grabbing",
                    dragIndex === pos && "opacity-50",
                    builtRowClass(lineIdx, pos)
                  )}
                >
                  {!confirmed && (
                    <span
                      aria-hidden
                      className="flex w-5 shrink-0 select-none items-center text-slate-300"
                    >
                      ⋮⋮
                    </span>
                  )}
                  <span
                    aria-hidden
                    className="flex w-6 shrink-0 items-center justify-center text-xs font-bold text-slate-400"
                  >
                    {confirmed ? (lineIdx === pos ? "✓" : "✗") : pos + 1}
                  </span>
                  <span className="min-w-0 flex-1 text-sm leading-relaxed text-slate-800 dark:text-slate-100">
                    {displayText(lineIdx, pos)}
                  </span>
                  {!confirmed && (
                    <span className="flex shrink-0 items-center gap-0.5">
                      <IconButton label="上へ" disabled={pos === 0} onClick={() => reorder(pos, pos - 1)}>
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
                        label="手順を戻す"
                        onClick={() => unpick(pos)}
                        className="hover:border-red-400 hover:text-red-500"
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

      <div>
        <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          手順（一覧）
          {pool.length > 0 && (
            <span className="ml-2 font-normal text-slate-400">残り {pool.length} 件</span>
          )}
        </p>
        {pool.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 px-4 py-3 text-center text-sm text-slate-400 dark:border-slate-700">
            すべての手順を使いました — 並べ替えて完成させてください
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5" role="list">
            {pool.map((lineIdx) => (
              <li key={lineIdx}>
                <div className="flex items-stretch overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/40">
                  <span className="min-w-0 flex-1 px-3 py-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                    {lines[lineIdx] ?? ""}
                  </span>
                  <button
                    type="button"
                    disabled={confirmed}
                    onClick={() => pick(lineIdx)}
                    className={cn(
                      "shrink-0 border-l px-3 text-xs font-semibold transition",
                      confirmed
                        ? "cursor-default border-slate-200 text-slate-300"
                        : "border-slate-200 text-brand hover:bg-brand/10 dark:border-slate-700"
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
            ? "❌ すべての行を組み立ててから提出してください。"
            : isCorrect
              ? "✅ 正解！順番どおりに組み立てられました。"
              : "❌ 惜しい！流れの順番を見直してみましょう。"}
        </div>
      )}
    </div>
  );
}
