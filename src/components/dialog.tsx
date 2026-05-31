import { useState, type ReactNode } from "react";
import type { DialogSpeaker } from "../lib/types";
import {
  CHARACTER_STYLES,
  isCharacterSpeaker,
  type CharacterSpeaker,
  type CharacterSpeakerStyle,
} from "../lib/character-speakers";
import { characterAvatarHref } from "../lib/app-href";
import { cn } from "../lib/cn";
import { DIALOG_BODY, DialogBubbleTail } from "./dialog-bubble";

interface BadgeSpeakerStyle {
  container: string;
  badge: string;
  label: string;
}

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

function CharacterAvatar({ style }: { style: CharacterSpeakerStyle }) {
  const [failed, setFailed] = useState(false);
  const src = characterAvatarHref(style.avatarFile);

  return (
    <div className="flex w-14 shrink-0 flex-col items-center gap-1">
      {failed ? (
        <span
          aria-hidden
          className={cn(
            "grid size-12 place-items-center rounded-full text-base font-bold shadow-sm",
            style.avatar
          )}
        >
          {style.avatarChar}
        </span>
      ) : (
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className={cn(
            "size-12 rounded-full bg-white object-cover shadow-sm ring-2 dark:bg-slate-800",
            style.ring
          )}
        />
      )}
      <span className={cn("text-center text-[0.7rem] font-semibold leading-tight", style.labelText)}>
        {style.label}
      </span>
    </div>
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
      <CharacterAvatar style={style} />
      <div
        className={cn(
          "relative min-w-0 flex-1 rounded-2xl px-4 py-3 text-[0.95rem] leading-relaxed shadow-sm",
          style.bubble,
          DIALOG_BODY
        )}
      >
        {children}
        <DialogBubbleTail
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
