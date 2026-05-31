import type { ReactNode } from "react";
import type { DialogSpeaker } from "../lib/types";
import { cn } from "../lib/cn";

interface CharacterSpeakerStyle {
  avatar: string;
  bubble: string;
  tailFill: string;
  tailStroke: string;
  avatarChar: string;
  label: string;
}

/** Tail depth (px); matches bubble `border` (1px) overlap via BUBBLE_BORDER. */
const TAIL_WIDTH = 8;
const TAIL_HEIGHT = 12;
const BUBBLE_BORDER = 1;

interface BadgeSpeakerStyle {
  container: string;
  badge: string;
  label: string;
}

const CHARACTER_SPEAKERS = ["teacher", "a", "b"] as const;
type CharacterSpeaker = (typeof CHARACTER_SPEAKERS)[number];

/**
 * Solid hex (100% opacity), pre-blended to match former opacity utilities.
 * Light border: *-500 at 40% on *-50. Dark fill/border: *-500 at 10%/30% on slate-950.
 */
const CHARACTER_STYLES: Record<CharacterSpeaker, CharacterSpeakerStyle> = {
  teacher: {
    avatar: "bg-sky-600 text-white dark:bg-sky-500",
    bubble:
      "border border-[#96d7f6] bg-[#f0f9ff] text-sky-950 dark:border-[#054156] dark:bg-[#03242c] dark:text-sky-100",
    tailFill: "fill-[#f0f9ff] dark:fill-[#03242c]",
    tailStroke: "stroke-[#96d7f6] dark:stroke-[#054156]",
    avatarChar: "先",
    label: "先生",
  },
  a: {
    avatar: "bg-emerald-600 text-white dark:bg-emerald-500",
    bubble:
      "border border-[#94e1c6] bg-[#ecfdf5] text-emerald-950 dark:border-[#064737] dark:bg-[#032621] dark:text-emerald-100",
    tailFill: "fill-[#ecfdf5] dark:fill-[#032621]",
    tailStroke: "stroke-[#94e1c6] dark:stroke-[#064737]",
    avatarChar: "理",
    label: "Aくん",
  },
  b: {
    avatar: "bg-amber-600 text-white dark:bg-amber-500",
    bubble:
      "border border-[#fbd591] bg-[#fffbeb] text-amber-950 dark:border-[#4b3f1c] dark:bg-[#1a2415] dark:text-amber-100",
    tailFill: "fill-[#fffbeb] dark:fill-[#1a2415]",
    tailStroke: "stroke-[#fbd591] dark:stroke-[#4b3f1c]",
    avatarChar: "文",
    label: "Bちゃん",
  },
};

const BADGE_STYLES: Record<"stumble" | "closing", BadgeSpeakerStyle> = {
  stumble: {
    container:
      "border-[#fa8699] bg-[#fff1f2] text-rose-950 dark:bg-[#1a0810] dark:text-rose-100",
    badge: "bg-rose-600 text-white dark:bg-rose-500",
    label: "つまずき",
  },
  closing: {
    container:
      "border-[#b598f9] bg-[#f5f3ff] text-violet-950 dark:bg-[#150d24] dark:text-violet-100",
    badge: "bg-violet-600 text-white dark:bg-violet-500",
    label: "今日のひとこと",
  },
};

interface DialogProps {
  speaker: DialogSpeaker;
  children: ReactNode;
}

const DIALOG_BODY =
  "[&_code]:rounded [&_code]:bg-[#e2e8f0] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] dark:[&_code]:bg-[#1e293b]";

function isCharacterSpeaker(
  speaker: DialogSpeaker
): speaker is CharacterSpeaker {
  return CHARACTER_SPEAKERS.includes(speaker as CharacterSpeaker);
}

function BubbleTail({
  fill,
  stroke,
  side,
}: {
  fill: string;
  stroke: string;
  side: "left" | "right";
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
      className="absolute top-4 z-1 shrink-0"
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

function CharacterDialog({
  speaker,
  children,
}: {
  speaker: CharacterSpeaker;
  children: ReactNode;
}) {
  const style = CHARACTER_STYLES[speaker];
  const isTeacher = speaker === "teacher";
  const tailSide = isTeacher ? "left" : "right";

  return (
    <div
      role="note"
      className={cn(
        "not-prose my-4 flex items-start gap-3",
        !isTeacher && "flex-row-reverse"
      )}
    >
      <div className="flex w-10 shrink-0 flex-col items-center gap-1">
        <span
          aria-hidden
          className={cn(
            "grid size-10 place-items-center rounded-full text-base font-bold shadow-sm",
            style.avatar
          )}
        >
          {style.avatarChar}
        </span>
        <span className="sr-only">{style.label}</span>
      </div>
      <div
        className={cn(
          "relative min-w-0 flex-1 rounded-2xl px-4 py-3 text-[0.95rem] leading-relaxed shadow-sm",
          style.bubble,
          DIALOG_BODY
        )}
      >
        {children}
        <BubbleTail
          fill={style.tailFill}
          stroke={style.tailStroke}
          side={tailSide}
        />
      </div>
    </div>
  );
}

function BadgeDialog({
  speaker,
  children,
}: {
  speaker: "stumble" | "closing";
  children: ReactNode;
}) {
  const style = BADGE_STYLES[speaker];

  return (
    <div
      role="note"
      className={cn(
        "not-prose my-4 rounded-2xl border-l-4 p-4 text-[0.95rem] leading-relaxed shadow-sm",
        style.container
      )}
    >
      <div className="mb-2">
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide",
            style.badge
          )}
        >
          {style.label}
        </span>
      </div>
      <div className={cn("min-w-0", DIALOG_BODY)}>{children}</div>
    </div>
  );
}

export function Dialog({ speaker, children }: DialogProps) {
  if (isCharacterSpeaker(speaker)) {
    return <CharacterDialog speaker={speaker}>{children}</CharacterDialog>;
  }

  return <BadgeDialog speaker={speaker}>{children}</BadgeDialog>;
}
