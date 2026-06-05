import type { CompletionData } from "./completion-store";
import { getCompletionSnapshot, importCompletionData } from "./completion-store";
import type { AssessmentAttemptRecord, CurrentAttemptState } from "./assessment-storage";
import { loadAttemptHistory, setAttemptHistory } from "./assessment-storage";
import { copyText } from "./clipboard";

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

export async function copyExport(): Promise<boolean> {
  const payload = buildExportPayload();
  const json = JSON.stringify(payload, null, 2);
  return copyText(json);
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

export function importFromText(text: string): void {
  const payload = JSON.parse(text) as ExportPayload;
  applyImportPayload(payload);
}
