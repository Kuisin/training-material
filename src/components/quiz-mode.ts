export type QuizMode = "instant" | "submit";

/** レッスン末尾は instant、scoreId 付きのコーステストは submit。 */
export function resolveQuizMode(mode: QuizMode | undefined, scoreId: string | undefined): QuizMode {
  if (mode) return mode;
  return scoreId ? "submit" : "instant";
}
