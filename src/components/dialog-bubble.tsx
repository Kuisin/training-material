import { cn } from "../lib/cn";
import { NESTED_TABLE_STYLES } from "../lib/nested-table-styles";

/** Tail depth (px); matches bubble `border` (1px) overlap via BUBBLE_BORDER. */
const TAIL_WIDTH = 8;
const TAIL_HEIGHT = 12;
const BUBBLE_BORDER = 1;

export const DIALOG_BODY = cn(
  NESTED_TABLE_STYLES,
  "[&_code]:rounded [&_code]:bg-[#e2e8f0] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] dark:[&_code]:bg-[#1e293b]"
);

export function DialogBubbleTail({
  fill,
  stroke,
  side,
  className,
}: {
  fill: string;
  stroke: string;
  side: "left" | "right";
  className?: string;
}) {
  const mid = TAIL_HEIGHT / 2;
  const inset = -(TAIL_WIDTH - BUBBLE_BORDER);
  const isLeft = side === "left";

  const polygonPoints = isLeft
    ? `0,${mid} ${TAIL_WIDTH},0 ${TAIL_WIDTH},${TAIL_HEIGHT}`
    : `${TAIL_WIDTH},${mid} 0,0 0,${TAIL_HEIGHT}`;
  const strokePath = isLeft
    ? `M0,${mid} L${TAIL_WIDTH},0 M0,${mid} L${TAIL_WIDTH},${TAIL_HEIGHT}`
    : `M${TAIL_WIDTH},${mid} L0,0 M${TAIL_WIDTH},${mid} L0,${TAIL_HEIGHT}`;

  return (
    <svg
      aria-hidden
      width={TAIL_WIDTH}
      height={TAIL_HEIGHT}
      viewBox={`0 0 ${TAIL_WIDTH} ${TAIL_HEIGHT}`}
      className={cn("absolute z-1 shrink-0", className ?? "top-4")}
      style={isLeft ? { left: inset } : { right: inset }}
    >
      <polygon points={polygonPoints} className={fill} />
      <path
        d={strokePath}
        className={stroke}
        fill="none"
        strokeWidth={BUBBLE_BORDER}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
