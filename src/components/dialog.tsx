import type { ReactNode } from "react";
import type { DialogSpeaker } from "../lib/types";
import { cn } from "../lib/cn";

interface CharacterSpeakerStyle {
  avatar: string;
  bubble: string;
  tail: string;
  avatarChar: string;
  label: string;
}

interface BadgeSpeakerStyle {
  container: string;
  badge: string;
  label: string;
}

const CHARACTER_SPEAKERS = ["teacher", "a", "b"] as const;
type CharacterSpeaker = (typeof CHARACTER_SPEAKERS)[number];

const CHARACTER_STYLES: Record<CharacterSpeaker, CharacterSpeakerStyle> = {
  teacher: {
    avatar: "bg-sky-600 text-white dark:bg-sky-500",
    bubble:
      "border border-sky-500/40 bg-sky-50 text-sky-950 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100",
    tail: "border-r-sky-50 dark:border-r-sky-500/10",
    avatarChar: "先",
    label: "先生",
  },
  a: {
    avatar: "bg-emerald-600 text-white dark:bg-emerald-500",
    bubble:
      "border border-emerald-500/40 bg-emerald-50 text-emerald-950 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100",
    tail: "border-r-emerald-50 dark:border-r-emerald-500/10",
    avatarChar: "理",
    label: "Aくん",
  },
  b: {
    avatar: "bg-amber-600 text-white dark:bg-amber-500",
    bubble:
      "border border-amber-500/40 bg-amber-50 text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100",
    tail: "border-r-amber-50 dark:border-r-amber-500/10",
    avatarChar: "文",
    label: "Bちゃん",
  },
};

const BADGE_STYLES: Record<"stumble" | "closing", BadgeSpeakerStyle> = {
  stumble: {
    container:
      "border-rose-500/60 bg-rose-50 text-rose-950 dark:bg-rose-500/10 dark:text-rose-100",
    badge: "bg-rose-600 text-white dark:bg-rose-500",
    label: "つまずき",
  },
  closing: {
    container:
      "border-violet-500/60 bg-violet-50 text-violet-950 dark:bg-violet-500/10 dark:text-violet-100",
    badge: "bg-violet-600 text-white dark:bg-violet-500",
    label: "今日のひとこと",
  },
};

interface DialogProps {
  speaker: DialogSpeaker;
  children: ReactNode;
}

const DIALOG_BODY =
  "[&_code]:rounded [&_code]:bg-black/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] dark:[&_code]:bg-white/10";

function isCharacterSpeaker(
  speaker: DialogSpeaker
): speaker is CharacterSpeaker {
  return CHARACTER_SPEAKERS.includes(speaker as CharacterSpeaker);
}

function CharacterDialog({
  speaker,
  children,
}: {
  speaker: CharacterSpeaker;
  children: ReactNode;
}) {
  const style = CHARACTER_STYLES[speaker];

  return (
    <div role="note" className="not-prose my-4 flex items-start gap-3">
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
        <span
          aria-hidden
          className={cn(
            "absolute top-4 -left-2 h-0 w-0 border-y-[6px] border-r-8 border-y-transparent",
            style.tail
          )}
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
