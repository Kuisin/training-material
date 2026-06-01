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
  title: "入力とヘルプ — F4・必須項目・メッセージ",
  meta: "初学者 · 15分",
};

export default function InputAndHelpLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-gui-basics", "06-input-and-help", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "入力とヘルプ\nSAP の画面では、値の一覧から選ぶ・必須項目を埋める・メッセージを読む、が基本の3点です。",
          content: (
            <>
              <hgroup>
                <h1>入力とヘルプ</h1>
                <p>検索ヘルプ（F4）・必須項目・メッセージの読み方を学びます。</p>
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
                <li>F4 検索ヘルプで値を選ぶ</li>
                <li>必須項目（入力必須）の見分け方</li>
                <li>F1 ヘルプとメッセージの読み方</li>
              </ul>
            </>
          ),
        },
        {
          title: "F4検索ヘルプ",
          plainText:
            "F4＝入力の候補一覧\n入力欄にカーソルを置き F4 を押すと、選べる値の一覧が開く。コードを覚えなくても選べる。",
          content: (
            <>
              <h2>
                <code>F4</code> 検索ヘルプ
              </h2>
              <p>
                会社コード・勘定科目・マスタコードなど、<strong>決まった一覧から選ぶ</strong>項目では
                <kbd>F4</kbd> が使えます。
              </p>
              <ol>
                <li>入力欄をクリックしてカーソルを置く</li>
                <li>
                  <kbd>F4</kbd> を押す（または入力欄右の検索アイコン）
                </li>
                <li>一覧から行を選び、選択ボタンで確定</li>
              </ol>
              <Callout variant="tip">
                一部の欄では <kbd>F4</kbd> の代わりにドロップダウンや「…」ボタンがあります。どれも「一覧から選ぶ」系です。
              </Callout>
              <Dialog speaker="a">
                コードを全部暗記しなくても、F4 で正しい値を拾えるのは助かりますね。
              </Dialog>
            </>
          ),
        },
        {
          title: "必須項目",
          plainText:
            "必須項目\n欄のラベルや枠が強調されている項目は未入力だと実行できない。エラー時はステータスバーと、該当欄へのカーソル移動を確認。",
          content: (
            <>
              <h2>必須項目</h2>
              <p>
                <strong>必須</strong>の項目は未入力のまま実行するとエラーになります。画面によってはラベル横に
                <code>*</code> や色付きの枠で示されます。
              </p>
              <ul>
                <li>実行前に、日付・会社コードなど“よくある必須”を上から確認</li>
                <li>エラー時はステータスバーの文言を読み、ハイライトされた欄を修正</li>
              </ul>
              <Dialog speaker="stumble">
                「何も起きない」と思ったら、実は必須欄が空、ということがよくあります。
              </Dialog>
            </>
          ),
        },
        {
          title: "F1とメッセージ",
          plainText:
            "F1ヘルプとメッセージ\nF1=カーソル位置の項目説明。エラーメッセージをダブルクリックすると詳細や対処のヒントが出ることがある。",
          content: (
            <>
              <h2>
                <code>F1</code> ヘルプとメッセージ
              </h2>
              <ul>
                <li>
                  <kbd>F1</kbd> … カーソルがある項目の説明（フィールドヘルプ）
                </li>
                <li>
                  ステータスバーのメッセージを<strong>ダブルクリック</strong> … 詳細・長文メッセージ
                </li>
                <li>
                  メッセージ番号（例: <code>E</code> で始まるコード）… 検索や問い合わせに使える
                </li>
              </ul>
              <Dialog speaker="teacher">
                分からない項目はまず F1。エラーはメッセージ全文をコピーしてメモする習慣をつけましょう。
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
                answer={1}
                explanation="F4 は入力欄の検索ヘルプ（値の一覧）を開くキーです。"
                question={<strong>入力欄の候補一覧を開くキーは？</strong>}
                options={["F1", "F4", "F8"]}
              />
              <Quiz
                answer={0}
                explanation="F1 はカーソル位置の項目についてのヘルプを表示します。"
                question={<strong>項目の説明を見るキーは？</strong>}
                options={["F1", "F3", "F4"]}
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(InputAndHelpLesson);
