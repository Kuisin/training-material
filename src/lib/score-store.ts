import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  appendAttemptHistory,
  clearCurrentAttempt,
  createAttemptId,
  loadAttemptHistory,
  loadCurrentAttempt,
  saveCurrentAttempt,
  type AssessmentAttemptRecord,
  type CurrentAttemptState,
  type StoredAnswerDetail,
} from "./assessment-storage";

/**
 * 採点用のページ内ストア。
 *
 * - ページ単位の提出（confirmedPages）
 * - localStorage への回答・結果の永続化
 * - 再テスト時の受験履歴保存
 */

export interface ScoreEntry {
  answered: boolean;
  correct: boolean;
}

interface Grader {
  isAnswered: () => boolean;
  grade: () => boolean;
}

const scores = new Map<string, ScoreEntry>();
const uiState = new Map<string, unknown>();
const graders = new Map<string, Grader>();
const reportDetails = new Map<string, () => string>();
const confirmedPages = new Set<string>();
const listeners = new Set<() => void>();
let version = 0;

let storageKey: string | null = null;
let attemptId = createAttemptId();
let attemptStartedAt = new Date().toISOString();
let historyCache: AssessmentAttemptRecord[] = [];

function emit(): void {
  version += 1;
  persistCurrent();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getVersion(): number {
  return version;
}

function persistCurrent(): void {
  if (!storageKey) return;
  saveCurrentAttempt(storageKey, {
    attemptId,
    startedAt: attemptStartedAt,
    uiState: Object.fromEntries(uiState),
    scores: Object.fromEntries(scores),
    confirmedPages: [...confirmedPages],
  });
}

function hydrateFromStorage(key: string): void {
  const stored = loadCurrentAttempt(key);
  if (!stored) return;

  attemptId = stored.attemptId;
  attemptStartedAt = stored.startedAt;
  scores.clear();
  uiState.clear();
  confirmedPages.clear();

  for (const [id, entry] of Object.entries(stored.scores)) {
    scores.set(id, entry);
  }
  for (const [id, value] of Object.entries(stored.uiState)) {
    uiState.set(id, value);
  }
  for (const pageId of stored.confirmedPages) {
    confirmedPages.add(pageId);
  }
}

/** テスト開始時に一度呼ぶ（localStorage キーと履歴を読み込む）。 */
export function configureAssessmentStorage(key: string): void {
  if (storageKey === key) return;
  storageKey = key;
  historyCache = loadAttemptHistory(key);
  hydrateFromStorage(key);
  emit();
}

export function pageIdFromScoreId(scoreId: string): string {
  const match = scoreId.match(/^(fa-l\d+)/);
  return match?.[1] ?? scoreId;
}

export function isPageConfirmed(pageId: string): boolean {
  return confirmedPages.has(pageId);
}

export function isItemConfirmed(scoreId: string): boolean {
  return isPageConfirmed(pageIdFromScoreId(scoreId));
}

/** @deprecated use isItemConfirmed / isPageConfirmed */
export function isAssessmentConfirmed(): boolean {
  return confirmedPages.size > 0;
}

export function usePageConfirmed(pageId: string): boolean {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  return confirmedPages.has(pageId);
}

export function useItemConfirmed(scoreId: string | undefined): boolean {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  if (!scoreId) return false;
  return confirmedPages.has(pageIdFromScoreId(scoreId));
}

/** @deprecated use useItemConfirmed / usePageConfirmed */
export function useAssessmentConfirmed(): boolean {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  return confirmedPages.size > 0;
}

export function useAttemptId(): string {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  return attemptId;
}

export function useAttemptHistory(): AssessmentAttemptRecord[] {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  return historyCache;
}

/** 設問ごとの採点ロジックを登録する（コンポーネント mount 時）。 */
export function registerGrader(id: string, grader: Grader): void {
  graders.set(id, grader);
  emit();
}

/** Excel レポート用の回答詳細を登録する。 */
export function registerReportDetail(id: string, getDetail: () => string): void {
  reportDetails.set(id, getDetail);
}

export function getReportDetail(id: string): string {
  return reportDetails.get(id)?.() ?? "";
}

export function unregisterGrader(id: string): void {
  graders.delete(id);
}

function gradeItems(ids: string[]): { answered: number; correct: number } {
  let answered = 0;
  let correct = 0;

  for (const id of ids) {
    if (!isItemAnswered(id)) continue;
    const grader = graders.get(id);
    if (!grader) continue;
    answered += 1;
    const ok = grader.grade();
    if (ok) correct += 1;
    scores.set(id, { answered: true, correct: ok });
  }

  return { answered, correct };
}

/** 1ページ分の設問を採点して提出する。 */
export function confirmPage(
  pageId: string,
  ids: string[]
): { answered: number; correct: number; total: number } {
  const result = gradeItems(ids);
  confirmedPages.add(pageId);
  emit();
  return { ...result, total: ids.length };
}

/** @deprecated use confirmPage */
export function confirmAssessment(ids: string[]): { answered: number; correct: number } {
  const pageIds = [...new Set(ids.map(pageIdFromScoreId))];
  let answered = 0;
  let correct = 0;
  for (const pageId of pageIds) {
    const pageIds2 = ids.filter((id) => pageIdFromScoreId(id) === pageId);
    const r = confirmPage(pageId, pageIds2);
    answered += r.answered;
    correct += r.correct;
  }
  return { answered, correct };
}

/** 設問の正誤を記録する（同じ結果なら再通知しない）。 */
export function recordScore(id: string, correct: boolean): void {
  const prev = scores.get(id);
  if (prev && prev.answered && prev.correct === correct) return;
  scores.set(id, { answered: true, correct });
  emit();
}

function snapshotDetails(ids: string[]): Record<string, StoredAnswerDetail> {
  const details: Record<string, StoredAnswerDetail> = {};
  for (const id of ids) {
    details[id] = {
      userAnswer: getReportDetail(id),
      correctAnswer: getReportDetail(`${id}:correct`),
    };
  }
  return details;
}

function buildAttemptRecord(ids: string[]): AssessmentAttemptRecord | null {
  const answeredEntries = ids.filter((id) => scores.get(id)?.answered);
  if (answeredEntries.length === 0 && confirmedPages.size === 0) return null;

  let answered = 0;
  let correct = 0;
  const scoreSnapshot: Record<string, ScoreEntry> = {};
  for (const id of ids) {
    const entry = scores.get(id);
    if (entry) scoreSnapshot[id] = entry;
    if (entry?.answered) {
      answered += 1;
      if (entry.correct) correct += 1;
    }
  }

  const percent = answered > 0 ? Math.round((correct / answered) * 100) : 0;

  return {
    id: attemptId,
    startedAt: attemptStartedAt,
    finishedAt: new Date().toISOString(),
    summary: { total: ids.length, answered, correct, percent },
    scores: scoreSnapshot,
    details: snapshotDetails(ids),
    pagesConfirmed: [...confirmedPages],
  };
}

/** 現在の受験を履歴に保存して、新しい受験を開始する。 */
export function startNewAttempt(ids: string[]): void {
  if (storageKey) {
    const record = buildAttemptRecord(ids);
    if (record) {
      historyCache = appendAttemptHistory(storageKey, record);
    }
    clearCurrentAttempt(storageKey);
  }

  scores.clear();
  uiState.clear();
  confirmedPages.clear();
  graders.clear();
  reportDetails.clear();
  attemptId = createAttemptId();
  attemptStartedAt = new Date().toISOString();
  emit();
}

/** 設問の回答・UI 状態をクリアする（やり直し用）。 */
export function clearScore(id: string): void {
  let changed = scores.delete(id);
  for (const key of [...uiState.keys()]) {
    if (key === id || key.startsWith(`${id}:`)) {
      uiState.delete(key);
      changed = true;
    }
  }
  graders.delete(id);
  reportDetails.delete(id);
  reportDetails.delete(`${id}:correct`);
  if (changed) emit();
}

/** 複数設問をまとめてクリアする（再テスト用 — startNewAttempt を推奨）。 */
export function clearScores(ids: string[]): void {
  startNewAttempt(ids);
}

export interface ScoreSummary {
  total: number;
  answered: number;
  correct: number;
  entries: Array<{ id: string; entry: ScoreEntry | undefined }>;
}

/** 指定した設問 id 群の集計を購読する。 */
export function useScoreSummary(ids: string[]): ScoreSummary {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  let answered = 0;
  let correct = 0;
  const entries = ids.map((id) => {
    const entry = scores.get(id);
    if (entry?.answered) {
      answered += 1;
      if (entry.correct) correct += 1;
    }
    return { id, entry };
  });
  return { total: ids.length, answered, correct, entries };
}

/** uiState から回答済みか判定（grader 未登録時・復元直後も正しく数える）。 */
export function isItemAnswered(id: string): boolean {
  const grader = graders.get(id);
  if (grader?.isAnswered()) return true;

  if (uiState.has(`${id}:built`) || uiState.has(`${id}:pool`)) {
    const built = readUiState<number[]>(`${id}:built`) ?? [];
    const pool = readUiState<number[]>(`${id}:pool`) ?? [];
    return pool.length === 0 && built.length > 0;
  }

  if (!uiState.has(id)) return false;
  const val = uiState.get(id);
  if (val === null || val === undefined) return false;
  if (Array.isArray(val)) return val.length > 0;
  return typeof val === "number";
}

/** ページ内の回答済み設問数を数える。 */
export function countDraftAnswers(ids: string[]): number {
  let count = 0;
  for (const id of ids) {
    if (isItemAnswered(id)) count += 1;
  }
  return count;
}

/** 回答済み設問数を購読する（uiState 変更で再描画）。 */
export function useDraftAnswerCount(ids: string[]): number {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  return countDraftAnswers(ids);
}

/** ページ単位の集計。 */
export function getPageSummary(
  ids: string[]
): { total: number; answered: number; correct: number; submitted: boolean } {
  const pageId = ids[0] ? pageIdFromScoreId(ids[0]) : "";
  let answered = 0;
  let correct = 0;
  for (const id of ids) {
    const entry = scores.get(id);
    if (entry?.answered) {
      answered += 1;
      if (entry.correct) correct += 1;
    }
  }
  return {
    total: ids.length,
    answered,
    correct,
    submitted: pageId ? confirmedPages.has(pageId) : false,
  };
}

/**
 * アンマウントをまたいでも値を保持する useState。
 * id を渡さない場合は通常の useState と同じ（永続化しない）。
 */
export function usePersistentState<T>(
  id: string | undefined,
  initial: T | (() => T)
): readonly [T, (next: T) => void] {
  useSyncExternalStore(subscribe, getVersion, getVersion);
  const initialRef = useRef(initial);
  initialRef.current = initial;

  const readStored = useCallback((): T => {
    if (id !== undefined && uiState.has(id)) return uiState.get(id) as T;
    const init = initialRef.current;
    return typeof init === "function" ? (init as () => T)() : init;
  }, [id]);

  const [value, setValueRaw] = useState<T>(readStored);

  useEffect(() => {
    setValueRaw(readStored());
  }, [readStored, attemptId]);

  const setValue = useCallback(
    (next: T) => {
      if (id !== undefined) {
        uiState.set(id, next);
        emit();
      }
      setValueRaw(next);
    },
    [id]
  );

  return [value, setValue] as const;
}

/** uiState を直接読む（grader 登録用）。 */
export function readUiState<T>(id: string): T | undefined {
  return uiState.get(id) as T | undefined;
}

/** uiState を直接書く（永続化付き）。 */
export function writeUiState(id: string, value: unknown): void {
  uiState.set(id, value);
  emit();
}

export type { AssessmentAttemptRecord, CurrentAttemptState };
