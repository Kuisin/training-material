import { useState, type ReactNode } from "react";
import {
  CHARACTER_STYLES,
  type CharacterSpeaker,
  type CharacterSpeakerStyle,
} from "../lib/character-speakers";
import { characterAvatarHref } from "../lib/app-href";
import { cn } from "../lib/cn";
import { DIALOG_BODY, DialogBubbleTail } from "./dialog-bubble";

interface CharacterIntroProps {
  speaker: CharacterSpeaker;
  children: ReactNode;
}

function IntroPortrait({ style }: { style: CharacterSpeakerStyle }) {
  const [failed, setFailed] = useState(false);
  const src = characterAvatarHref(style.avatarFile);

  return (
    <div className="flex w-28 shrink-0 flex-col items-center gap-1.5">
      {failed ? (
        <span
          aria-hidden
          className={cn(
            "grid size-28 place-items-center rounded-full text-2xl font-bold shadow-sm",
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
            "size-28 rounded-full bg-white object-cover shadow-sm ring-2 dark:bg-slate-800",
            style.ring
          )}
        />
      )}
      <span className={cn("text-center text-sm font-semibold leading-tight", style.labelText)}>
        {style.label}
      </span>
    </div>
  );
}

/**
 * 登場人物紹介スライド用。大きな立ち絵＋吹き出し。通常の会話は `<Dialog>` を使う。
 */
export function CharacterIntro({ speaker, children }: CharacterIntroProps) {
  const style = CHARACTER_STYLES[speaker];
  const isTeacher = speaker === "teacher";
  const tailSide = isTeacher ? "left" : "right";

  return (
    <div
      role="note"
      className={cn(
        "not-prose my-4 flex items-start gap-4",
        !isTeacher && "flex-row-reverse"
      )}
    >
      <IntroPortrait style={style} />
      <div className="flex min-h-28 flex-1 items-center">
        <div
          className={cn(
            "relative min-w-0 w-full rounded-2xl px-4 py-3 text-[0.95rem] leading-relaxed shadow-sm",
            style.bubble,
            DIALOG_BODY
          )}
        >
          {children}
          <DialogBubbleTail
            fill={style.tailFill}
            stroke={style.tailStroke}
            side={tailSide}
            className="top-1/2 -translate-y-1/2"
          />
        </div>
      </div>
    </div>
  );
}
