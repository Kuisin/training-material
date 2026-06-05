import type { CompletionData } from "./completion-store";
import { getCompletionSnapshot, importCompletionData } from "./completion-store";
import type { AssessmentAttemptRecord, CurrentAttemptState } from "./assessment-storage";
import { loadAttemptHistory, setAttemptHistory } from "./assessment-storage";

export interface ExportPayload {
  version: 1;
  exportedAt: string;
  completion: CompletionData;
  assessments: Record<string, AssessmentAttemptRecord[]>;
  assessmentCurrent: Record<string, CurrentAttemptState>;
}

const ASSESSMENT_HISTORY_RE = /^assessment:(.+):history$/;
const ASSESSMENT_CURRENT_RE = /^assessment:(.+):current$/;

function collectAssessmentData(): {
  history: Record<string, AssessmentAttemptRecord[]>;
  current: Record<string, CurrentAttemptState>;
} {
  const history: Record<string, AssessmentAttemptRecord[]> = {};
  const current: Record<string, CurrentAttemptState> = {};

  if (typeof window === "undefined") return { history, current };

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    const histMatch = ASSESSMENT_HISTORY_RE.exec(key);
    if (histMatch) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) history[histMatch[1]!] = JSON.parse(raw) as AssessmentAttemptRecord[];
      } catch {
        // skip corrupt entry
      }
      continue;
    }

    const currMatch = ASSESSMENT_CURRENT_RE.exec(key);
    if (currMatch) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) current[currMatch[1]!] = JSON.parse(raw) as CurrentAttemptState;
      } catch {
        // skip corrupt entry
      }
    }
  }

  return { history, current };
}

export function buildExportPayload(): ExportPayload {
  const { history, current } = collectAssessmentData();
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    completion: getCompletionSnapshot(),
    assessments: history,
    assessmentCurrent: current,
  };
}

export function downloadExport(): void {
  const payload = buildExportPayload();
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  a.href = url;
  a.download = `training-data-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function mergeAssessmentHistories(
  storageKey: string,
  incoming: AssessmentAttemptRecord[]
): void {
  const existing = loadAttemptHistory(storageKey);
  const existingIds = new Set(existing.map((r) => r.id));
  const fresh = incoming.filter((r) => !existingIds.has(r.id));
  if (fresh.length === 0) return;
  const merged = [...fresh, ...existing];
  setAttemptHistory(storageKey, merged);
}

export function applyImportPayload(payload: ExportPayload): void {
  if (payload.version !== 1) throw new Error("Unsupported export version");

  importCompletionData(payload.completion);

  for (const [key, records] of Object.entries(payload.assessments ?? {})) {
    mergeAssessmentHistories(key, records);
  }

  if (payload.assessmentCurrent) {
    for (const [key, state] of Object.entries(payload.assessmentCurrent)) {
      const lsKey = `assessment:${key}:current`;
      if (!localStorage.getItem(lsKey)) {
        localStorage.setItem(lsKey, JSON.stringify(state));
      }
    }
  }
}

export function importFromFile(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(reader.result as string) as ExportPayload;
        applyImportPayload(payload);
        resolve();
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function parseAndValidateImport(text: string): ExportPayload {
  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error("テキストが有効なJSONではありません");
  }
  if (typeof payload !== "object" || payload === null) {
    throw new Error("データの形式が正しくありません");
  }
  const p = payload as Record<string, unknown>;
  if (p["version"] !== 1) {
    throw new Error(`対応していないバージョンです（version: ${String(p["version"])}）`);
  }
  if (!p["completion"] || typeof p["completion"] !== "object") {
    throw new Error("completion フィールドがありません");
  }
  if (!p["exportedAt"] || typeof p["exportedAt"] !== "string") {
    throw new Error("exportedAt フィールドがありません");
  }
  return payload as ExportPayload;
}
