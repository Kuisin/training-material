import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  InfoPanel,
  Figure,
  Quiz,
  MermaidDiagram,
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
            "入力とヘルプ\nSAP の画面では、値の一覧から選ぶ・必須項目を埋める・メッセージを読む、が基本の3点です。\n⏱ 15分 / 📶 初学者 / 🏷 SAP GUI 基礎\nこの章で学ぶこと\n・F4 検索ヘルプで値を選ぶ\n・必須項目（入力必須）の見分け方\n・F1 フィールドヘルプとメッセージの読み方",
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
                <li><kbd>F4</kbd> 検索ヘルプで値の一覧から選ぶ</li>
                <li>必須項目（入力必須）の見分け方</li>
                <li><kbd>F1</kbd> フィールドヘルプとメッセージの読み方</li>
              </ul>
            </>
          ),
        },
        {
          title: "F4 検索ヘルプ",
          plainText:
            "F4＝入力の候補一覧\n入力欄にカーソルを置いて F4 を押すと、選べる値の一覧が開く。会社コード・勘定科目・マスタコードなど「決まった一覧から選ぶ」項目で使える。コードを全部暗記しなくて済む。\n手順: 入力欄をクリック → F4 → 一覧から行を選ぶ → 選択ボタンで確定\nAくん：コードを全部暗記しなくても、F4 で正しい値を拾えるのは助かりますね。\nBちゃん：テレビのリモコンで「チャンネル一覧」を出して選ぶ感じです。",
          content: (
            <>
              <h2>
                <kbd>F4</kbd> 検索ヘルプ
              </h2>
              <p>
                会社コード・勘定科目・マスタコードなど、<strong>決まった一覧から選ぶ</strong>項目では
                <kbd>F4</kbd> が使えます。
              </p>
              <MermaidDiagram
                chart={`flowchart LR
  A[入力欄をクリック] --> B[F4 を押す]
  B --> C[値の一覧が開く]
  C --> D[行を選ぶ]
  D --> E[欄に値が入る]`}
              />
              <Figure
                src="image/06-f4-help.webp"
                alt="SAP GUI の入力フォームで F4 キーを押した結果、画面中央にポップアップウィンドウが開いている。ウィンドウには会社コードと会社名の一覧が表示され、行を選ぶとフォームの入力欄に値が入る流れを矢印で示している。"
                caption="F4 を押すと「選べる値の一覧」が開く。コード暗記不要。"
                kind="diagram"
              />
              <Dialog speaker="a">
                コードを全部暗記しなくても、F4 で正しい値を拾えるのは助かりますね。タイプミスも防げる。
              </Dialog>
              <Dialog speaker="b">
                テレビのリモコンで「チャンネル一覧」を出して選ぶ感じです。直感でわかる！
              </Dialog>
              <Callout variant="tip">
                一部の欄では <kbd>F4</kbd> の代わりにドロップダウンや「…」ボタンがあります。どれも「一覧から選ぶ」系です。
              </Callout>
            </>
          ),
        },
        {
          title: "必須項目",
          plainText:
            "必須項目\n欄のラベルや枠が強調されている項目は未入力だと実行できない。エラー時はステータスバーと、該当欄へのカーソル移動を確認。\n日付・会社コードなど「よくある必須」を上から確認する習慣をつける。\nBちゃん：「何も起きない」と思ったら、実は必須欄が空だったことがよくあります。\nAくん：必須項目にはアスタリスク（*）や色付き枠などのマークがあるんですか？\n先生：そうです。画面によってマークの種類が異なりますが、実行してエラーが出たらステータスバーとハイライトされた欄を確認すれば分かります。",
          content: (
            <>
              <h2>必須項目</h2>
              <p>
                <strong>必須</strong>の項目は未入力のまま実行するとエラーになります。画面によってはラベル横に
                <code>*</code> や色付きの枠で示されます。
              </p>
              <ul>
                <li>実行前に、日付・会社コードなど<strong>"よくある必須"</strong>を上から確認</li>
                <li>エラーが出たらステータスバーの文言を読み、<strong>ハイライトされた欄</strong>を修正</li>
                <li>修正後は再度 <kbd>F8</kbd> で実行</li>
              </ul>
              <Dialog speaker="b">
                「何も起きない」と思ったら、実は必須欄が空だったことがよくあります。これが分かると焦らずに対処できますね。
              </Dialog>
              <Dialog speaker="a">
                必須項目にはアスタリスク（<code>*</code>）や色付き枠などのマークがあるんですか？
              </Dialog>
              <Dialog speaker="teacher">
                そうです。ただ画面によってマークの種類が違います。実行してエラーが出たら、ステータスバーと<strong>ハイライトされた欄</strong>を確認すれば確実に見つかります。
              </Dialog>
              <Dialog speaker="stumble">
                「何も起きない」と感じたときの9割は、必須欄の未入力か入力値のエラーです。ステータスバーを見る習慣で解決できます。
              </Dialog>
            </>
          ),
        },
        {
          title: "F1 ヘルプとメッセージ",
          plainText:
            "F1 フィールドヘルプとメッセージ\nF1: カーソルがある項目の説明（フィールドヘルプ）。「この欄に何を入れればいいか」をその場で確認できる。\nステータスバーのメッセージをダブルクリック: 詳細・長文メッセージを確認できる。\nメッセージ番号（例: E001 など）: 検索や問い合わせに使える。\n先生：分からない項目はまず F1。エラーはメッセージ全文をコピーしてメモする習慣をつけましょう。\nBちゃん：まずF1で調べてから、それでも分からなければ先輩に聞く。自己解決の第一歩ですね。",
          content: (
            <>
              <h2>
                <kbd>F1</kbd> フィールドヘルプとメッセージ
              </h2>
              <InfoPanel title="ヘルプの使い方" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>方法</th>
                      <th>何が分かるか</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><kbd>F1</kbd></td>
                      <td>カーソル位置の項目の説明（何を入力すべきか）</td>
                    </tr>
                    <tr>
                      <td>ステータスバーをダブルクリック</td>
                      <td>メッセージの詳細・長文テキスト</td>
                    </tr>
                    <tr>
                      <td>メッセージ番号（例: <code>E001</code>）</td>
                      <td>検索・問い合わせ・SAP Note の参照に使える</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                分からない項目はまず <kbd>F1</kbd>。エラーが出たらメッセージ全文をコピーしてメモする習慣をつけましょう。問い合わせのときに役立ちます。
              </Dialog>
              <Dialog speaker="b">
                まず F1 で調べてから、それでも分からなければ先輩に聞く。自己解決の第一歩ですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 入力欄の候補一覧を開くキーは？→ F4\nQ2 項目の説明を見るキーは？→ F1\n今日のひとこと：F4 で選んで、F1 で調べる。この2つを知っているだけで、SAP のどの画面でも自力で進む力が身につきます。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="F4 は入力欄の検索ヘルプ（値の一覧）を開くキーです。コードを覚えていなくても一覧から選ぶだけで正しい値を入力でき、タイプミスも防げます。"
                question={<strong>入力欄の候補一覧を開くキーは？</strong>}
                options={["F1", "F4", "F8"]}
              />
              <Quiz
                answer={0}
                explanation="F1 はカーソル位置の項目についてのヘルプ（フィールドヘルプ）を表示します。「この欄に何を入力すればいいか」をその場で確認できます。F4 は値の一覧、F8 は実行、と混同しないよう注意。"
                question={<strong>項目の説明を見るキーは？</strong>}
                options={["F1", "F3", "F4"]}
              />
              <Dialog speaker="closing">
                <kbd>F4</kbd> で選んで、<kbd>F1</kbd> で調べる。この2つを知っているだけで、SAP のどの画面でも自力で進む力が身につきます。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(InputAndHelpLesson);
