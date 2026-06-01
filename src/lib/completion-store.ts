import { useSyncExternalStore } from "react";

/**
 * レッスン／コースの完了状態と、特別コンテンツの解放状態を保持するストア。
 *
 * 設計方針:
 * - 追記専用（append-only）。アプリ側から完了・解放を取り消す API は提供しない。
 * - localStorage と Cookie の 2 系統に同じ内容を書き込み、読み取り時に和集合（union）でマージする。
 *   片方が消えても、もう片方から復元される（次回書き込みで両系統が再同期）。
 * - 静的サイトのため「完全な削除防止」は不可能（DevTools 等での消去は防げない）。
 *   ここでは現実的な範囲で消えにくくする。
 */

interface CompletionData {
  /** courseSlug -> 完了したレッスンファイル一覧 */
  completedLessons: Record<string, string[]>;
  /** courseSlug -> 解放済み特別コンテンツファイル一覧 */
  unlockedSpecial: Record<string, string[]>;
}

const LS_KEY = "training:completion:v1";
const COOKIE_KEY = "training_completion_v1";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 10; // 約10年

let data: CompletionData = { completedLessons: {}, unlockedSpecial: {} };
let loaded = false;

const listeners = new Set<() => void>();
let version = 0;

function emit(): void {
  version += 1;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getVersion(): number {
  return version;
}

function safeParse(raw: string | null): Partial<CompletionData> | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Partial<CompletionData>;
  } catch {
    return null;
  }
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const escaped = name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]!) : null;
}

function writeCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function mergeMap(target: Record<string, string[]>, src?: Record<string, string[]>): void {
  if (!src) return;
  for (const [key, files] of Object.entries(src)) {
    const set = new Set(target[key] ?? []);
    for (const file of files ?? []) set.add(file);
    target[key] = [...set];
  }
}

function mergeInto(target: CompletionData, src: Partial<CompletionData> | null): void {
  if (!src) return;
  mergeMap(target.completedLessons, src.completedLessons);
  mergeMap(target.unlockedSpecial, src.unlockedSpecial);
}

function persist(): void {
  const raw = JSON.stringify(data);
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(LS_KEY, raw);
  } catch {
    // quota / privacy mode — Cookie 側だけでも残す
  }
  writeCookie(COOKIE_KEY, raw);
}

function load(): void {
  if (loaded) return;
  loaded = true;

  const fresh: CompletionData = { completedLessons: {}, unlockedSpecial: {} };
  if (typeof window !== "undefined") {
    mergeInto(fresh, safeParse(window.localStorage.getItem(LS_KEY)));
  }
  mergeInto(fresh, safeParse(readCookie(COOKIE_KEY)));
  data = fresh;

  // 片方が欠けていた場合に両系統を再同期する。
  persist();
}

function ensureLoaded(): void {
  if (!loaded) load();
}

function addTo(map: Record<string, string[]>, courseSlug: string, file: string): boolean {
  const set = new Set(map[courseSlug] ?? []);
  if (set.has(file)) return false;
  set.add(file);
  map[courseSlug] = [...set];
  return true;
}

/** レッスン（ページ）を完了済みにする。 */
export function markLessonComplete(courseSlug: string, file: string): void {
  if (!courseSlug || !file) return;
  ensureLoaded();
  if (addTo(data.completedLessons, courseSlug, file)) {
    persist();
    emit();
  }
}

export function isLessonComplete(courseSlug: string, file: string): boolean {
  ensureLoaded();
  return (data.completedLessons[courseSlug] ?? []).includes(file);
}

export function getCompletedLessons(courseSlug: string): string[] {
  ensureLoaded();
  return data.completedLessons[courseSlug] ?? [];
}

/** 特別コンテンツを解放済みにする（パスワード一致時など）。 */
export function markSpecialUnlocked(courseSlug: string, file: string): void {
  if (!courseSlug || !file) return;
  ensureLoaded();
  if (addTo(data.unlockedSpecial, courseSlug, file)) {
    persist();
    emit();
  }
}

export function isSpecialUnlocked(courseSlug: string, file: string): boolean {
  ensureLoaded();
  return (data.unlockedSpecial[courseSlug] ?? []).includes(file);
}

/** 完了・解放状態の変化を購読する（変化のたびに再描画）。 */
export function useCompletion(): number {
  return useSyncExternalStore(subscribe, getVersion, getVersion);
}
