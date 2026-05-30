/** 条件付きクラス名を結合する小さなヘルパー（clsx 相当の最小版）。 */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
