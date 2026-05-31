export const CHARACTER_SPEAKERS = ["teacher", "a", "b"] as const;

export type CharacterSpeaker = (typeof CHARACTER_SPEAKERS)[number];

export interface CharacterSpeakerStyle {
  avatar: string;
  bubble: string;
  tailFill: string;
  tailStroke: string;
  avatarChar: string;
  avatarFile: string;
  ring: string;
  labelText: string;
  label: string;
}

/**
 * Solid hex (100% opacity), pre-blended to match former opacity utilities.
 * Light border: *-500 at 40% on *-50. Dark fill/border: *-500 at 10%/30% on slate-950.
 */
export const CHARACTER_STYLES: Record<CharacterSpeaker, CharacterSpeakerStyle> = {
  teacher: {
    avatar: "bg-sky-600 text-white dark:bg-sky-500",
    bubble:
      "border border-[#96d7f6] bg-[#f0f9ff] text-sky-950 dark:border-[#054156] dark:bg-[#03242c] dark:text-sky-100",
    tailFill: "fill-[#f0f9ff] dark:fill-[#03242c]",
    tailStroke: "stroke-[#96d7f6] dark:stroke-[#054156]",
    avatarChar: "先",
    avatarFile: "teacher.webp",
    ring: "ring-sky-500/60",
    labelText: "text-sky-700 dark:text-sky-300",
    label: "先生",
  },
  a: {
    avatar: "bg-emerald-600 text-white dark:bg-emerald-500",
    bubble:
      "border border-[#94e1c6] bg-[#ecfdf5] text-emerald-950 dark:border-[#064737] dark:bg-[#032621] dark:text-emerald-100",
    tailFill: "fill-[#ecfdf5] dark:fill-[#032621]",
    tailStroke: "stroke-[#94e1c6] dark:stroke-[#064737]",
    avatarChar: "理",
    avatarFile: "student-a.webp",
    ring: "ring-emerald-500/60",
    labelText: "text-emerald-700 dark:text-emerald-300",
    label: "Aくん",
  },
  b: {
    avatar: "bg-amber-600 text-white dark:bg-amber-500",
    bubble:
      "border border-[#fbd591] bg-[#fffbeb] text-amber-950 dark:border-[#4b3f1c] dark:bg-[#1a2415] dark:text-amber-100",
    tailFill: "fill-[#fffbeb] dark:fill-[#1a2415]",
    tailStroke: "stroke-[#fbd591] dark:stroke-[#4b3f1c]",
    avatarChar: "文",
    avatarFile: "student-b.webp",
    ring: "ring-amber-500/60",
    labelText: "text-amber-700 dark:text-amber-300",
    label: "Bちゃん",
  },
};

export function isCharacterSpeaker(speaker: string): speaker is CharacterSpeaker {
  return CHARACTER_SPEAKERS.includes(speaker as CharacterSpeaker);
}
