/** localStorage 永続化 — 現在の受験状態と過去の受験履歴 */

export interface StoredScoreEntry {
  answered: boolean;
  correct: boolean;
}

export interface StoredAnswerDetail {
  userAnswer: string;
  correctAnswer: string;
}

export interface AssessmentAttemptRecord {
  id: string;
  startedAt: string;
  finishedAt: string;
  summary: {
    total: number;
    answered: number;
    correct: number;
    percent: number;
  };
  scores: Record<string, StoredScoreEntry>;
  details: Record<string, StoredAnswerDetail>;
  pagesConfirmed: string[];
}

export interface CurrentAttemptState {
  attemptId: string;
  startedAt: string;
  uiState: Record<string, unknown>;
  scores: Record<string, StoredScoreEntry>;
  confirmedPages: string[];
}

const HISTORY_MAX = 50;

function currentKey(storageKey: string): string {
  return `assessment:${storageKey}:current`;
}

function historyKey(storageKey: string): string {
  return `assessment:${storageKey}:history`;
}

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded — silently ignore
  }
}

export function loadCurrentAttempt(storageKey: string): CurrentAttemptState | null {
  return readJson<CurrentAttemptState>(currentKey(storageKey));
}

export function saveCurrentAttempt(storageKey: string, state: CurrentAttemptState): void {
  writeJson(currentKey(storageKey), state);
}

export function clearCurrentAttempt(storageKey: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(currentKey(storageKey));
  } catch {
    // ignore
  }
}

export function loadAttemptHistory(storageKey: string): AssessmentAttemptRecord[] {
  return readJson<AssessmentAttemptRecord[]>(historyKey(storageKey)) ?? [];
}

export function appendAttemptHistory(
  storageKey: string,
  record: AssessmentAttemptRecord
): AssessmentAttemptRecord[] {
  const prev = loadAttemptHistory(storageKey);
  const next = [record, ...prev].slice(0, HISTORY_MAX);
  writeJson(historyKey(storageKey), next);
  return next;
}

export function createAttemptId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function setAttemptHistory(
  storageKey: string,
  records: AssessmentAttemptRecord[]
): void {
  writeJson(historyKey(storageKey), records.slice(0, HISTORY_MAX));
}
