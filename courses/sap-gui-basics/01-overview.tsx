import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  Figure,
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
            "コース全体像\nゼロから SAP GUI を使えるようになるまでの道のりを、章ごとに整理します。\n⏱ 10分 / 📶 初学者 / 🏷 SAP GUI 基礎\nゴール\n・ログインして、目的の画面（トランザクション）を開ける\n・画面の各部分の名前と役割が分かる\n・よく使うショートカットで迷子にならない\n・つまずいたときの対処の型を持つ",
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
              <h3>このコースのゴール</h3>
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
            "章の流れ\nログイン → 画面の見方 → トランザクション → 移動とセッション → 入力とヘルプ → ショートカット → コツと確認\n第2章：ログイン・クライアント・接続の意味\n第3章：メニュー・ツールバー・ステータスバー・コマンド欄\n第4章：トランザクションコードとお気に入り\n第5章：戻る・複数セッション\n第6章：F4 検索ヘルプ・メッセージ\n第7章：ショートカット一覧（重点）\n第8章：設定のコツ・トラブル・総仕上げ\n先生：迷ったらこのスライドに戻ってください。「今どの段階か」が分かれば安心して進められます。",
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
                <li><strong>第2章</strong> … ログイン・クライアント・接続の意味</li>
                <li><strong>第3章</strong> … メニュー・ツールバー・ステータスバー・コマンド欄</li>
                <li><strong>第4章</strong> … トランザクションコードとお気に入り</li>
                <li><strong>第5章</strong> … 戻る・複数セッション</li>
                <li><strong>第6章</strong> … F4 検索ヘルプ・メッセージ</li>
                <li><strong>第7章</strong> … ショートカット一覧（重点）</li>
                <li><strong>第8章</strong> … 設定のコツ・トラブル・総仕上げ</li>
              </ol>
              <Dialog speaker="teacher">
                迷ったらこのスライドに戻ってください。「今どの段階か」が分かれば安心して進められます。
              </Dialog>
            </>
          ),
        },
        {
          title: "ロードマップを図で見る",
          plainText:
            "ロードマップ\n7つの章がどう積み重なるかを図で確認します。ログイン→画面→操作→発展の順に積み上がります。\nAくん：土台（ログイン・画面構造）を固めてから、応用（ショートカット・トラブル対処）に進む流れですね。\nBちゃん：料理で言うと、まず道具の名前を覚えて、次に使い方を学ぶ感じ。",
          content: (
            <>
              <h2>ロードマップを図で見る</h2>
              <Figure
                src="image/01-roadmap.webp"
                alt="SAP GUI 基礎コースの7章のロードマップ。ログイン（第2章）から始まり、画面の見方（第3章）、トランザクション（第4章）、移動（第5章）、入力ヘルプ（第6章）、ショートカット（第7章）、実務のコツ（第8章）の順に積み上がるピラミッド型の図。土台が操作基礎、頂点が実務活用。"
                caption="基礎を積み上げ、最後に実務で活かす"
                kind="concept"
              />
              <Dialog speaker="a">
                土台（ログイン・画面構造）を固めてから、応用（ショートカット・トラブル対処）に進む設計ですね。理屈に合っています。
              </Dialog>
              <Dialog speaker="b">
                料理で言うと、まず道具の名前を覚えて、次に使い方を学ぶ感じ。それなら私もついていけそうです！
              </Dialog>
            </>
          ),
        },
        {
          title: "ABAP 研修とのつながり",
          plainText:
            "ABAP 研修とのつながり\nこのコースのあと ABAP 研修に進む場合、SE38 などの画面も同じ SAP GUI 上で動きます。F1・F4・F8・コマンド欄の使い方は、そのまま開発でも活きます。\nAくん：GUI 基礎 → ABAP の順なら説明がつながりそうです。\n先生：第7章のショートカットは開発でもそのまま使えます。ここで体に入れておくと ABAP 研修がスムーズです。",
          content: (
            <>
              <h2>ABAP 研修とのつながり</h2>
              <p>
                社内で ABAP 研修（<code>abap-taining</code>）に進む場合も、画面は同じ SAP GUI です。
                特に <kbd>F1</kbd>・<kbd>F4</kbd>・<kbd>F8</kbd>・コマンド欄の使い方は、そのまま開発で活きます。
              </p>
              <Callout variant="tip">
                このコースで学ぶショートカットや画面操作の習慣は、<strong>業務担当者・ABAP 開発者どちらにも</strong>共通して使えます。一度学べば二度美味しい内容です。
              </Callout>
              <Dialog speaker="a">
                GUI 基礎 → ABAP の順なら、研修の中で「画面を開いて確認してみましょう」と言われた瞬間に動けますね。
              </Dialog>
              <Dialog speaker="teacher">
                そうです。第7章のショートカットは開発環境でもそのまま使えます。ここで体に入れておくと、ABAP 研修が格段にスムーズになります。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-taining"
                lessonFile="14-sap-development-tools"
                slide={3}
                label="ABAP研修: 開発ツールとショートカット"
                variant="forward"
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(OverviewLesson);
