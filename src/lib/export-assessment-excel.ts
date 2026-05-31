import type { AssessmentAttemptRecord } from "./assessment-storage";
import type { ScoreEntry } from "./score-store";
import { getReportDetail } from "./score-store";

import type { QuizLevel } from "../components/quiz-level-badge";
import { quizLevelLabel } from "../components/quiz-level-badge";

export interface ScoreReportItem {
  id: string;
  labelText: string;
  lessonNum: string;
  lessonTitle: string;
  kind: "code" | "flow" | "quiz";
  difficulty?: QuizLevel;
  explanation?: string;
}

export interface AssessmentReportMeta {
  courseTitle: string;
  assessmentTitle: string;
  fileName?: string;
}

export interface AssessmentReportSummary {
  total: number;
  answered: number;
  correct: number;
  percent: number;
  tierMessage: string;
}

interface AnswerDetails {
  userAnswer: (id: string) => string;
  correctAnswer: (id: string) => string;
}

function kindLabel(kind: ScoreReportItem["kind"]): string {
  if (kind === "code") return "コード組み立て";
  if (kind === "flow") return "フロー組み立て";
  return "理解度チェック";
}

function resultLabel(entry: ScoreEntry | undefined): string {
  if (!entry?.answered) return "未回答";
  return entry.correct ? "正解" : "不正解";
}

async function buildAssessmentWorkbook(
  meta: AssessmentReportMeta,
  summary: AssessmentReportSummary,
  items: ScoreReportItem[],
  entries: Array<{ id: string; entry: ScoreEntry | undefined }>,
  details: AnswerDetails,
  reportDate: string
) {
  const XLSX = await import("xlsx");

  const summarySheet = XLSX.utils.aoa_to_sheet([
    ["項目", "値"],
    ["研修コース", meta.courseTitle],
    ["テスト名", meta.assessmentTitle],
    ["実施日時", reportDate],
    ["総問題数", summary.total],
    ["回答数", summary.answered],
    ["未回答数", summary.total - summary.answered],
    ["正答数", summary.correct],
    ["正答率", `${summary.percent}%`],
    ["評価", summary.tierMessage],
  ]);
  summarySheet["!cols"] = [{ wch: 16 }, { wch: 56 }];

  const detailHeader = [
    "No",
    "レッスン",
    "種別",
    "難易度",
    "設問",
    "結果",
    "回答内容",
    "正解",
    "解説",
  ];
  const detailRows = items.map((item, i) => {
    const entry = entries.find((e) => e.id === item.id)?.entry;
    const userAnswer = details.userAnswer(item.id);
    return [
      i + 1,
      `L${item.lessonNum} ${item.lessonTitle}`,
      kindLabel(item.kind),
      item.difficulty ? quizLevelLabel(item.difficulty) : "—",
      item.labelText,
      resultLabel(entry),
      userAnswer || "（未回答）",
      details.correctAnswer(item.id),
      item.explanation ?? "",
    ];
  });

  const detailSheet = XLSX.utils.aoa_to_sheet([detailHeader, ...detailRows]);
  detailSheet["!cols"] = [
    { wch: 5 },
    { wch: 28 },
    { wch: 16 },
    { wch: 8 },
    { wch: 36 },
    { wch: 10 },
    { wch: 52 },
    { wch: 52 },
    { wch: 52 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, summarySheet, "サマリー");
  XLSX.utils.book_append_sheet(workbook, detailSheet, "詳細");
  return workbook;
}

function formatFileNameStamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function buildReportFileName(
  meta: AssessmentReportMeta,
  date: Date,
  attemptNumber?: number
): string {
  const base = meta.fileName?.replace(/\.xlsx$/i, "") ?? "assessment_report";
  const stamp = formatFileNameStamp(date);
  if (attemptNumber !== undefined) {
    return `${base}_#${attemptNumber}_${stamp}.xlsx`;
  }
  return `${base}_${stamp}.xlsx`;
}

/** 現在の受験結果を Excel（.xlsx）としてダウンロードする。 */
export async function downloadAssessmentExcel(
  meta: AssessmentReportMeta,
  summary: AssessmentReportSummary,
  items: ScoreReportItem[],
  entries: Array<{ id: string; entry: ScoreEntry | undefined }>
): Promise<void> {
  const XLSX = await import("xlsx");
  const reportDate = new Date().toLocaleString("ja-JP", { hour12: false });
  const workbook = await buildAssessmentWorkbook(meta, summary, items, entries, {
    userAnswer: (id) => getReportDetail(id),
    correctAnswer: (id) => getReportDetail(`${id}:correct`),
  }, reportDate);

  XLSX.writeFile(workbook, buildReportFileName(meta, new Date()));
}

/** 過去の受験履歴を Excel（.xlsx）としてダウンロードする。 */
export async function downloadHistoricalAttemptExcel(
  meta: AssessmentReportMeta,
  record: AssessmentAttemptRecord,
  items: ScoreReportItem[],
  tierMessage: string,
  attemptNumber?: number
): Promise<void> {
  const XLSX = await import("xlsx");
  const entries = items.map((item) => ({
    id: item.id,
    entry: record.scores[item.id],
  }));
  const summary: AssessmentReportSummary = {
    total: record.summary.total,
    answered: record.summary.answered,
    correct: record.summary.correct,
    percent: record.summary.percent,
    tierMessage,
  };
  const reportDate = new Date(record.finishedAt).toLocaleString("ja-JP", { hour12: false });
  const workbook = await buildAssessmentWorkbook(meta, summary, items, entries, {
    userAnswer: (id) => record.details[id]?.userAnswer ?? "",
    correctAnswer: (id) => record.details[id]?.correctAnswer ?? "",
  }, reportDate);

  const finishedAt = new Date(record.finishedAt);
  XLSX.writeFile(workbook, buildReportFileName(meta, finishedAt, attemptNumber));
}
