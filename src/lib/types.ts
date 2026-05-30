export interface SlideData {
  /** ジャンプメニューに出すラベル（data-title 由来） */
  title: string;
  /** スライド本文の生 HTML（パーサーが TSX コンポーネントへ変換する） */
  html: string;
}

export interface LessonChrome {
  /** レッスンタイトル（上部バー・<title> に使用） */
  title: string;
  /** 次の章のファイル名。最終章は空文字。 */
  nextHref: string;
  /** 前の章のファイル名。最初の章は空文字。 */
  prevHref: string;
  /** レッスン一覧へのリンク */
  indexHref: string;
}

export type CalloutVariant = "tip" | "warning" | "note";
