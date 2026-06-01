import type { ReactNode } from "react";
import type { CalloutVariant } from "../lib/types";
import { cn } from "../lib/cn";
import { NESTED_TABLE_STYLES } from "../lib/nested-table-styles";

interface CalloutVariantStyle {
  container: string;
  icon: string;
  label: string;
}

const VARIANT_STYLES: Record<CalloutVariant, CalloutVariantStyle> = {
  tip: {
    container:
      "border-emerald-500/60 bg-emerald-50 text-emerald-950 dark:bg-emerald-500/10 dark:text-emerald-100",
    icon: "💡",
    label: "ヒント",
  },
  warning: {
    container:
      "border-amber-500/60 bg-amber-50 text-amber-950 dark:bg-amber-500/10 dark:text-amber-100",
    icon: "⚠️",
    label: "注意",
  },
  note: {
    container:
      "border-sky-500/60 bg-sky-50 text-sky-950 dark:bg-sky-500/10 dark:text-sky-100",
    icon: "📝",
    label: "メモ",
  },
};

interface CalloutProps {
  variant: CalloutVariant;
  children: ReactNode;
}

export function Callout({ variant, children }: CalloutProps) {
  const style = VARIANT_STYLES[variant];
  return (
    <div
      role="note"
      className={cn(
        "not-prose my-4 flex gap-3 rounded-lg border-l-4 p-4 text-[0.95rem] leading-relaxed shadow-sm",
        style.container
      )}
    >
      <span aria-hidden className="select-none text-lg leading-none">
        {style.icon}
      </span>
      <div
        className={cn(
          "min-w-0 overflow-x-auto",
          NESTED_TABLE_STYLES,
          "[&_code]:rounded [&_code]:bg-black/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] dark:[&_code]:bg-white/10"
        )}
      >
        <span className="sr-only">{style.label}: </span>
        {children}
      </div>
    </div>
  );
}
