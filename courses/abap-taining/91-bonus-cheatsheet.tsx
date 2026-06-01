import {
  Lesson,
  Callout,
  Dialog,
  CodeBlock,
  LessonQuiz,
  MermaidDiagram,
  LessonMeta,
  lessonChrome,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "特別コンテンツ — ABAP実務チートシート",
  meta: "特別 · 10分",
};

export default function BonusCheatsheetLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-taining", "91-bonus-cheatsheet", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "特別コンテンツ — ABAP実務チートシート\nコース完了者・パスワード保持者向けの特典。現場で迷いやすいポイントを1枚に凝縮します。\nこの章で学ぶこと\n・SELECTは件数と受け取り先で書き方を決める\n・SY-SUBRCは依頼の直後に必ず確認\n・性能はLOOP内SELECTの回避から",
          content: (
            <>
              <hgroup>
                <h1>特別コンテンツ — ABAP実務チートシート</h1>
                <p>
                  コースを修了した方への特典です。現場で迷いやすいポイントを
                  <strong>1枚に凝縮</strong>しました。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "10分" },
                  { icon: "⭐", text: "特別コンテンツ" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <Callout variant="tip">
                このページはコース完了、またはパスワードで解放される特別コンテンツです。
              </Callout>
              <h3>この章で確認すること</h3>
              <ul>
                <li>
                  <code>SELECT</code> は「何件・どこへ」で書き方を決める
                </li>
                <li>
                  <code>SY-SUBRC</code> は依頼の直後に必ず確認する
                </li>
                <li>性能改善は <code>LOOP</code> 内 <code>SELECT</code> の回避から</li>
              </ul>
            </>
          ),
        },
        {
          title: "頻出パターン",
          plainText:
            "頻出パターン早見表\n複数件→INTO TABLE、1件・キー完備→SELECT SINGLE、存在確認→UP TO 1 ROWS。\nSELECTの直後は IF sy-subrc = 0 で必ず分岐する。",
          content: (
            <>
              <h2>頻出パターン早見表</h2>
              <p>取得は「何件欲しいか」で構文を選び、直後に結果を確認します。</p>
              <CodeBlock
                language="ABAP"
                code={`" 複数件 → 内部テーブルへ一括
SELECT belnr budat bukrs
  FROM bkpf INTO TABLE lt_bkpf
  WHERE bukrs = p_bukrs.

" 1件・キー完備 → 作業領域へ
SELECT SINGLE * FROM bkpf INTO ls_bkpf
  WHERE bukrs = p_bukrs AND belnr = p_belnr AND gjahr = p_gjahr.

" 取得後は必ず確認
IF sy-subrc <> 0.
  MESSAGE '該当データがありません' TYPE 'I'.
ENDIF.`}
              />
              <Dialog speaker="teacher">
                「依頼して終わり」ではなく「取れたか確認」まで。これが安全なレポートの基本です。
              </Dialog>
            </>
          ),
        },
        {
          title: "性能の勘所",
          plainText:
            "性能の勘所\nLOOP内SELECTは件数分の往復になり遅い。まとめて取得してから内部テーブルで突き合わせる。",
          content: (
            <>
              <h2>性能の勘所</h2>
              <p>
                もっとも避けたいのは <code>LOOP</code> の中で <code>SELECT</code> を回すことです。
                先にまとめて取得し、内部テーブル上で突き合わせます。
              </p>
              <MermaidDiagram
                chart={`flowchart LR
  Bad["LOOP内SELECT<br/>件数分の往復"] -->|改善| Good["まとめてSELECT<br/>内部テーブルで突合"]`}
              />
              <Callout variant="warning">
                件数が増えるほど差が開きます。まず往復回数を減らすことを考えましょう。
              </Callout>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ 性能改善で最初に見直すのは → LOOP内のSELECT",
          content: (
            <>
              <h2>理解度チェック</h2>
              <LessonQuiz
                answer={1}
                explanation="LOOP内のSELECTは件数分だけDBへ往復するため、件数増加で急激に遅くなります。まとめて取得し内部テーブルで突き合わせるのが定石です。"
                question={<strong>性能改善でまず見直すべき書き方は？</strong>}
                options={[
                  "WRITE の整形",
                  "LOOP 内の SELECT",
                  "コメントの量",
                ]}
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(BonusCheatsheetLesson);
