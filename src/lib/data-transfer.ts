/** レッスン進捗・テスト結果のエクスポート／インポート */

import { getCompletionSnapshot, importCompletionData, type CompletionData } from "./completion-store";
import {
  loadAttemptHistory,
  loadCurrentAttempt,
  setAttemptHistory,
  saveCurrentAttempt,
  type AssessmentAttemptRecord,
  type CurrentAttemptState,
} from "./assessment-storage";

export interface AssessmentBundle {
  history: AssessmentAttemptRecord[];
  current: CurrentAttemptState | null;
}

export interface AppDataExport {
  version: 1;
  exportedAt: string;
  completion: {
    completedLessons: Record<string, string[]>;
    unlockedContent: Record<string, string[]>;
  };
  assessments: Record<string, AssessmentBundle>;
}

function scanAssessmentStorageKeys(): string[] {
  if (typeof window === "undefined") return [];
  const keys = new Set<string>();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith("assessment:")) continue;
    const inner = key.slice("assessment:".length);
    const lastColon = inner.lastIndexOf(":");
    if (lastColon < 1) continue;
    const suffix = inner.slice(lastColon + 1);
    if (suffix === "history" || suffix === "current") {
      keys.add(inner.slice(0, lastColon));
    }
  }
  return [...keys];
}

export function buildExportData(): AppDataExport {
  const completion = getCompletionSnapshot();
  const storageKeys = scanAssessmentStorageKeys();
  const assessments: Record<string, AssessmentBundle> = {};
  for (const key of storageKeys) {
    assessments[key] = {
      history: loadAttemptHistory(key),
      current: loadCurrentAttempt(key),
    };
  }
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    completion,
    assessments,
  };
}

export function downloadAppData(): void {
  const data = buildExportData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const date = new Date().toISOString().slice(0, 10);
  a.download = `training-data-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export type ImportResult = { ok: true } | { ok: false; error: string };

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

export function importAppData(raw: unknown): ImportResult {
  if (!isRecord(raw)) return { ok: false, error: "データ形式が不正です" };
  if (raw.version !== 1) return { ok: false, error: `未対応のバージョン: ${String(raw.version)}` };

  if (isRecord(raw.completion)) {
    importCompletionData(raw.completion as Partial<CompletionData>);
  }

  if (isRecord(raw.assessments)) {
    for (const [storageKey, bundle] of Object.entries(raw.assessments)) {
      if (!isRecord(bundle)) continue;

      if (Array.isArray(bundle.history)) {
        const incoming = (bundle.history as AssessmentAttemptRecord[]).filter(
          (r) => isRecord(r) && typeof r.id === "string"
        );
        const existing = loadAttemptHistory(storageKey);
        const existingIds = new Set(existing.map((r) => r.id));
        const fresh = incoming.filter((r) => !existingIds.has(r.id));
        if (fresh.length > 0) {
          const merged = [...fresh, ...existing];
          setAttemptHistory(storageKey, merged);
        }
      }

      if (isRecord(bundle.current) && typeof (bundle.current as CurrentAttemptState).attemptId === "string") {
        const existing = loadCurrentAttempt(storageKey);
        if (!existing) {
          saveCurrentAttempt(storageKey, bundle.current as CurrentAttemptState);
        }
      }
    }
  }

  return { ok: true };
}
