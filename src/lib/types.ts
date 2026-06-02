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
  /** 省略時は無条件で解放 */
  lock?: ContentLock;
}

/**
 * 完了の前提条件。
 * - "course": このコース（self）のレッスンをすべて完了
 * - string[]: このコース内の指定レッスンファイルをすべて完了
 * - オブジェクト: 別コースの完了を含む柔軟な指定
 */
export type ContentRequirement =
  | "course"
  | string[]
  | {
      /** 完了が必要なコース slug 一覧（"self" = このコース） */
      courses?: string[];
      /** 完了が必要なこのコース内のレッスンファイル一覧 */
      lessons?: string[];
      /** 条件の満たし方。"all"=すべて / "any"=いずれか（既定: all） */
      match?: "all" | "any";
    };

/** 特別コンテンツ（追加コース）の解放条件。 */
export interface ContentLock {
  /** 前提となる完了条件（特定コース・複数コースのいずれか／すべて等） */
  requires?: ContentRequirement;
  /** 解放用パスワード（静的サイトのため簡易ゲート。バンドルに含まれる点に注意） */
  password?: string;
  /**
   * requires と password の両方を設定したときの扱い。
   * - "any"（既定）: どちらか一方を満たせば解放
   * - "all": 完了条件とパスワードの両方が必要
   */
  mode?: "all" | "any";
}

/** 特別コンテンツ（course.json の specialContent） */
export type SpecialContentEntry = CourseLesson;

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
