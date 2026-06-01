import type { ReactNode } from "react";
import type { InfoPanelVariant } from "../lib/types";
import { cn } from "../lib/cn";
import { NESTED_TABLE_STYLES } from "../lib/nested-table-styles";

interface InfoPanelVariantStyle {
  container: string;
  title: string;
  lead: string;
  icon: string;
  label: string;
}

const VARIANT_STYLES: Record<InfoPanelVariant, InfoPanelVariantStyle> = {
  breakdown: {
    container:
      "border-indigo-200/90 bg-indigo-50/95 text-indigo-950 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-50",
    title: "text-indigo-900 dark:text-indigo-100",
    lead: "text-indigo-800/90 dark:text-indigo-100/80",
    icon: "📖",
    label: "コード解説",
  },
  reference: {
    container:
      "border-violet-200/90 bg-violet-50/95 text-violet-950 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-50",
    title: "text-violet-900 dark:text-violet-100",
    lead: "text-violet-800/90 dark:text-violet-100/80",
    icon: "📋",
    label: "参考情報",
  },
};

interface InfoPanelProps {
  /** パネル見出し（例: 「1行ずつ読む」「よく使う型（TYPE）」） */
  title: string;
  /** 見出し下の短い説明（任意） */
  lead?: ReactNode;
  /** breakdown＝コード解説 / reference＝一覧・参照 */
  variant?: InfoPanelVariant;
  children: ReactNode;
}

export function InfoPanel({
  title,
  lead,
  variant = "breakdown",
  children,
}: InfoPanelProps) {
  const style = VARIANT_STYLES[variant];

  return (
    <aside
      role="note"
      aria-label={style.label}
      className={cn(
        "not-prose my-5 rounded-xl border p-4 shadow-sm sm:p-5",
        style.container
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <span aria-hidden className="select-none text-lg leading-none">
          {style.icon}
        </span>
        <h3 className={cn("m-0 text-base font-semibold tracking-tight", style.title)}>
          {title}
        </h3>
      </div>
      {lead ? (
        <p className={cn("mb-3 text-[0.95rem] leading-relaxed", style.lead)}>{lead}</p>
      ) : null}
      <div
        className={cn(
          "overflow-x-auto text-[0.95rem] leading-relaxed",
          NESTED_TABLE_STYLES,
          "[&_ul]:my-0 [&_ul]:list-none [&_ul]:space-y-2 [&_ul]:p-0",
          "[&_li]:m-0",
          "[&_code]:rounded [&_code]:bg-black/8 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] dark:[&_code]:bg-white/10"
        )}
      >
        {children}
      </div>
    </aside>
  );
}
