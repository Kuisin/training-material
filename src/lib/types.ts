import type { ReactNode } from "react";

export interface SlideDefinition {
  /** ジャンプメニューに出すラベル */
  title: string;
  /** スライド本文（TSX） */
  content: ReactNode;
  /** Copilot コピー用のプレーンテキスト（省略時はタイトルのみ） */
  plainText?: string;
}

export interface AdjacentLesson {
  num: string;
  title: string;
}

export interface LessonChrome {
  /** レッスンタイトル（上部バー・<title> に使用） */
  title: string;
  /** course.json のレッスン番号（ヘッダー表示用） */
  lessonNum: string;
  /** 次の章のパス（例 "01-overview.html"）。最終章は空文字。 */
  nextHref: string;
  /** 前の章のパス（例 "00-introduction.html"）。最初の章は空文字。 */
  prevHref: string;
  /** レッスン一覧（トップ）へのリンク */
  indexHref: string;
  /** 前の章（章移動の確認ダイアログ用） */
  prevLesson?: AdjacentLesson;
  /** 次の章（章移動の確認ダイアログ用） */
  nextLesson?: AdjacentLesson;
}

export interface CourseLesson {
  num: string;
  file: string;
  title: string;
  meta: string;
}

/** 特別コンテンツの解放条件（password と requires は「いずれか」を満たせば解放）。 */
export interface ContentLock {
  /** 前提となる完了: "course"（コース完了）またはレッスンファイルの配列（すべて完了） */
  requires?: "course" | string[];
  /** 解放用パスワード（静的サイトのため簡易ゲート。バンドルに含まれる点に注意） */
  password?: string;
}

export interface SpecialContentEntry extends CourseLesson {
  /** 省略時は無条件で解放（通常コンテンツと同じ扱い） */
  lock?: ContentLock;
}

export interface Course {
  slug: string;
  title: string;
  description: string;
  /** false のときコース一覧で非活性表示（省略時は true） */
  active: boolean;
  lessons: CourseLesson[];
  courseTest: CourseLesson[];
  additionalContent: CourseLesson[];
  specialContent: SpecialContentEntry[];
}

export type CalloutVariant = "tip" | "warning" | "note";

/** InfoPanel の見た目区分（コード解説 vs 参照一覧） */
export type InfoPanelVariant = "breakdown" | "reference";

/** 対話型レッスンの登場人物・つまずき・締めの一言 */
export type DialogSpeaker = "teacher" | "a" | "b" | "stumble" | "closing";
