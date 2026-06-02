import type { Course, CourseLesson } from "./types";
import { markContentUnlocked } from "./completion-store";

/** 共有リンク用: `?pw=...` でロック済みコンテンツを自動解放する。 */
export const CONTENT_PASSWORD_SEARCH_PARAM = "pw";

let cachedSearchPassword: string | null | undefined;

/** 現在の URL からパスワードパラメータを読む（同一ページ内はキャッシュ）。 */
export function readContentPasswordFromSearch(search?: string): string | null {
  if (cachedSearchPassword !== undefined) return cachedSearchPassword;
  if (typeof window === "undefined") {
    cachedSearchPassword = null;
    return null;
  }
  const raw = new URLSearchParams(search ?? window.location.search).get(
    CONTENT_PASSWORD_SEARCH_PARAM
  );
  cachedSearchPassword = raw && raw.length > 0 ? raw : null;
  return cachedSearchPassword;
}

function clearContentPasswordSearchCache(): void {
  cachedSearchPassword = undefined;
}

/** 成功後に履歴・Referer に残りにくいよう `pw` を URL から取り除く。 */
export function stripContentPasswordFromUrl(): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has(CONTENT_PASSWORD_SEARCH_PARAM)) return;
  url.searchParams.delete(CONTENT_PASSWORD_SEARCH_PARAM);
  const query = url.searchParams.toString();
  const next = `${url.pathname}${query ? `?${query}` : ""}${url.hash}`;
  window.history.replaceState(null, "", next);
  clearContentPasswordSearchCache();
}

export function allPasswordLockedEntries(course: Course): CourseLesson[] {
  const entries = [
    ...course.lessons,
    ...course.courseTest,
    ...course.additionalContent,
    ...course.specialContent,
  ];
  return entries.filter((entry) => Boolean(entry.lock?.password));
}

/**
 * URL の `pw` を検証し、一致するロック済みエントリを解放する。
 * いずれかが解放できたら `pw` を URL から除去する。
 */
export function applyContentPasswordFromUrl(course: Course, entries: CourseLesson[]): boolean {
  const password = readContentPasswordFromSearch();
  if (!password) return false;

  let unlocked = false;
  for (const entry of entries) {
    const expected = entry.lock?.password;
    if (expected && password === expected) {
      markContentUnlocked(course.slug, entry.file);
      unlocked = true;
    }
  }
  if (unlocked) stripContentPasswordFromUrl();
  return unlocked;
}
