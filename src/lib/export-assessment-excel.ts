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

function kindLabel(kind: ScoreReportItem["kind"]): string {
  if (kind === "code") return "コード組み立て";
  if (kind === "flow") return "フロー組み立て";
  return "理解度チェック";
}

function resultLabel(entry: ScoreEntry | undefined): string {
  if (!entry?.answered) return "未回答";
  return entry.correct ? "正解" : "不正解";
}

/** 採点結果を Excel（.xlsx）としてダウンロードする。 */
export async function downloadAssessmentExcel(
  meta: AssessmentReportMeta,
  summary: AssessmentReportSummary,
  items: ScoreReportItem[],
  entries: Array<{ id: string; entry: ScoreEntry | undefined }>
): Promise<void> {
  const XLSX = await import("xlsx");
  const now = new Date();
  const dateStr = now.toLocaleString("ja-JP", { hour12: false });

  const summarySheet = XLSX.utils.aoa_to_sheet([
    ["項目", "値"],
    ["研修コース", meta.courseTitle],
    ["テスト名", meta.assessmentTitle],
    ["実施日時", dateStr],
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
    return [
      i + 1,
      `L${item.lessonNum} ${item.lessonTitle}`,
      kindLabel(item.kind),
      item.difficulty ? quizLevelLabel(item.difficulty) : "—",
      item.labelText,
      resultLabel(entry),
      getReportDetail(item.id) || "（未回答）",
      getReportDetail(`${item.id}:correct`),
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

  const stamp = now.toISOString().slice(0, 10);
  const fileName = meta.fileName ?? `assessment-report-${stamp}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}
