import { cn } from "../lib/cn";

const LINE_COLOR = "border-slate-300 dark:border-slate-500";

/** 枠線など、水平線と同色の border クラス */
export const horizontalLineBorderColor = LINE_COLOR;

/** 表のセル用：横方向の区切り線クラス */
export function horizontalLineClasses(weight: "normal" | "strong" = "normal"): string {
  return weight === "strong" ? `border-b-2 ${LINE_COLOR}` : `border-b ${LINE_COLOR}`;
}

interface HorizontalLineProps {
  className?: string;
  spacing?: "none" | "sm" | "md" | "lg";
}

const SPACING: Record<NonNullable<HorizontalLineProps["spacing"]>, string> = {
  none: "my-0",
  sm: "my-3",
  md: "my-6",
  lg: "my-8",
};

/** スライド内のセクション区切り用の水平線 */
export function HorizontalLine({ className, spacing = "md" }: HorizontalLineProps) {
  return (
    <hr
      aria-hidden
      className={cn("not-prose border-0 border-t-2", LINE_COLOR, SPACING[spacing], className)}
    />
  );
}
