import type { ReactNode } from "react";
import { cn } from "../lib/cn";

interface DiagramCollapsibleHelpProps {
  /** `<summary>` に表示するラベル */
  label?: string;
  children: ReactNode;
  className?: string;
}

/**
 * 図の下（または全画面ヘッダー下）に置く折りたたみ説明。
 */
export function DiagramCollapsibleHelp({
  label = "図の見方・記号の説明",
  children,
  className,
}: DiagramCollapsibleHelpProps) {
  return (
    <details
      className={cn(
        "group rounded-xl border border-slate-200 bg-slate-50/80 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200",
        className
      )}
    >
      <summary className="cursor-pointer list-none px-4 py-2.5 font-semibold text-slate-800 marker:content-none dark:text-slate-100 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-2">
          <span>{label}</span>
          <span aria-hidden className="text-slate-400 transition group-open:rotate-180">
            ▼
          </span>
        </span>
      </summary>
      <div className="border-t border-slate-200 px-4 py-3 leading-relaxed dark:border-slate-700">{children}</div>
    </details>
  );
}
