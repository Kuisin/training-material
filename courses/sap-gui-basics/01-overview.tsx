import {
  Lesson,
  lessonChrome,
  Dialog,
  MermaidDiagram,
  LessonMeta,
  LessonLinkButton,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "コース全体像 — この研修で身につけること",
  meta: "初学者 · 10分",
};

export default function OverviewLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-gui-basics", "01-overview", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "コース全体像\nゼロから SAP GUI を使えるようになるまでの道のりを、章ごとに整理します。",
          content: (
            <>
              <hgroup>
                <h1>コース全体像</h1>
                <p>ゼロから SAP GUI を使えるようになるまでの道のりを、章ごとに整理します。</p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "10分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "SAP GUI 基礎" },
                ]}
              />
              <h3>ゴール</h3>
              <ul>
                <li>ログインして、目的の画面（トランザクション）を開ける</li>
                <li>画面の各部分の名前と役割が分かる</li>
                <li>よく使うショートカットで迷子にならない</li>
                <li>つまずいたときの対処の型を持つ</li>
              </ul>
            </>
          ),
        },
        {
          title: "学習の流れ",
          plainText:
            "章の流れ\n接続→画面の見方→トランザクション→移動→入力とヘルプ→ショートカット→実務のコツ",
          content: (
            <>
              <h2>章の流れ</h2>
              <MermaidDiagram
                chart={`flowchart LR
  A[ログイン] --> B[画面の見方]
  B --> C[トランザクション]
  C --> D[移動とセッション]
  D --> E[入力とヘルプ]
  E --> F[ショートカット]
  F --> G[コツと確認]`}
              />
              <ol>
                <li>
                  <strong>第2章</strong> … ログイン・クライアント・接続の意味
                </li>
                <li>
                  <strong>第3章</strong> … メニュー・ツールバー・ステータスバー・コマンド欄
                </li>
                <li>
                  <strong>第4章</strong> … トランザクションコードとお気に入り
                </li>
                <li>
                  <strong>第5章</strong> … 戻る・複数セッション
                </li>
                <li>
                  <strong>第6章</strong> … F4 検索ヘルプ・メッセージ
                </li>
                <li>
                  <strong>第7章</strong> … ショートカット一覧（重点）
                </li>
                <li>
                  <strong>第8章</strong> … 設定のコツ・トラブル・総仕上げ
                </li>
              </ol>
              <Dialog speaker="teacher">
                迷ったらこのスライドに戻ってください。「今どの段階か」が分かれば安心して進められます。
              </Dialog>
            </>
          ),
        },
        {
          title: "ABAP研修との関係",
          plainText:
            "ABAP研修とのつながり\nこのコースのあと ABAP 研修に進む場合、SE38 などの画面も同じ SAP GUI 上で動きます。第7章のショートカットは開発でもそのまま使えます。",
          content: (
            <>
              <h2>ABAP 研修とのつながり</h2>
              <p>
                社内で ABAP 研修（<code>abap-taining</code>）に進む場合も、画面は同じ SAP GUI です。
                特に <code>F1</code>・<code>F4</code>・<code>F8</code>・コマンド欄の使い方は、そのまま開発で活きます。
              </p>
              <LessonLinkButton
                courseSlug="abap-taining"
                lessonFile="14-sap-development-tools"
                slide={3}
                label="ABAP研修: 開発ツールとショートカット"
                variant="forward"
              />
              <Dialog speaker="a">
                GUI 基礎 → ABAP、の順なら説明がつながりそうです。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(OverviewLesson);
