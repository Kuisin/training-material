import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  InfoPanel,
  Quiz,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "画面の見方 — メニュー・ツールバー・ステータスバー",
  meta: "初学者 · 15分",
};

export default function ScreenLayoutLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-gui-basics", "03-screen-layout", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "画面の見方\nSAP GUI の画面はどこも同じ“型”です。名前が分かると、説明を聞いたときにすぐ場所を特定できます。",
          content: (
            <>
              <hgroup>
                <h1>画面の見方</h1>
                <p>SAP GUI の画面はどこも同じ“型”です。各部分の名前を覚えましょう。</p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "15分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "SAP GUI 基礎" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>メニューバー・標準ツールバー・タイトルバー</li>
                <li>コマンド欄（トランザクション入力欄）</li>
                <li>ステータスバーとメッセージ領域</li>
                <li>作業領域（入力フォームや一覧）</li>
              </ul>
            </>
          ),
        },
        {
          title: "画面の上下",
          plainText:
            "上から下へ\nタイトルバー→メニュー→ツールバー→（アプリケーションツールバー）→作業領域→ステータスバー",
          content: (
            <>
              <h2>上から下へ</h2>
              <InfoPanel title="画面の構成（覚える順番）" variant="reference">
                <ol>
                  <li>
                    <strong>タイトルバー</strong> … 今開いている画面の名前
                  </li>
                  <li>
                    <strong>メニューバー</strong> … システム・ヘルプ・画面ごとのメニュー
                  </li>
                  <li>
                    <strong>標準ツールバー</strong> … 戻る・保存・印刷などのボタン
                  </li>
                  <li>
                    <strong>アプリケーションツールバー</strong> … 画面固有のボタン（ある画面のみ）
                  </li>
                  <li>
                    <strong>作業領域</strong> … 入力欄・表・ツリーなど、実際に触る部分
                  </li>
                  <li>
                    <strong>ステータスバー</strong> … 画面下部。メッセージやシステム情報
                  </li>
                </ol>
              </InfoPanel>
              <Dialog speaker="b">
                いちばん大事なのは、真ん中の作業領域と、下のステータスバー、ですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "コマンド欄",
          plainText:
            "コマンド欄\n画面上部付近の入力欄。トランザクションコード（例 SE38）を入力して Enter で画面を開く。SAP GUI 操作の“住所検索”。",
          content: (
            <>
              <h2>コマンド欄</h2>
              <p>
                <strong>コマンド欄</strong>は、トランザクションコード（画面の住所）を入力する欄です。
                例: <code>SE38</code> と入力して <kbd>Enter</kbd> → ABAP エディタが開く。
              </p>
              <Callout variant="tip">
                コマンド欄にフォーカスがないときは、<kbd>/n</kbd> のあとにコードを入力する方法もよく使います（詳細は第4章・第5章）。
              </Callout>
            </>
          ),
        },
        {
          title: "ステータスバー",
          plainText:
            "ステータスバー\n画面左下付近。成功・警告・エラーのメッセージが表示される。色やアイコンで種類が分かる。",
          content: (
            <>
              <h2>ステータスバー</h2>
              <p>処理の結果は、多くの場合<strong>画面左下のステータスバー</strong>に表示されます。</p>
              <ul>
                <li>
                  <strong>成功</strong> … 緑やチェック（例: 保存しました）
                </li>
                <li>
                  <strong>警告</strong> … 黄（続行できるが注意）
                </li>
                <li>
                  <strong>エラー</strong> … 赤（入力や処理が止まる）
                </li>
              </ul>
              <Dialog speaker="teacher">
                ボタンを押したあとは、必ずステータスバーを見る習慣をつけてください。「押したつもり」で終わらせないことが大事です。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText: "理解度チェック",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={2}
                explanation="コマンド欄はトランザクションコードを入力して目的の画面を開くための欄です。"
                question={<strong>トランザクションコードを入力する欄は？</strong>}
                options={["ステータスバー", "タイトルバー", "コマンド欄"]}
              />
              <Quiz
                answer={1}
                explanation="成功・警告・エラーなど、操作の結果メッセージはステータスバーに表示されることが多いです。"
                question={<strong>「保存しました」などのメッセージが出る場所は？</strong>}
                options={["メニューバー", "ステータスバー", "標準ツールバー"]}
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ScreenLayoutLesson);
