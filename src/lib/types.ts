import type { ReactNode } from "react";

export interface SlideDefinition {
  /** ジャンプメニューに出すラベル */
  title: string;
  /** スライド本文（TSX） */
  content: ReactNode;
  /** Copilot コピー用のプレーンテキスト（省略時はタイトルのみ） */
  plainText?: string;
}

export interface LessonChrome {
  /** レッスンタイトル（上部バー・<title> に使用） */
  title: string;
  /** 次の章のパス（例 "01-overview.html"）。最終章は空文字。 */
  nextHref: string;
  /** 前の章のパス（例 "00-introduction.html"）。最初の章は空文字。 */
  prevHref: string;
  /** レッスン一覧へのリンク */
  indexHref: string;
}

export type CalloutVariant = "tip" | "warning" | "note";

/** 対話型レッスンの登場人物・つまずき・締めの一言 */
export type DialogSpeaker = "teacher" | "a" | "b" | "stumble" | "closing";
