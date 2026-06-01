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
  title: "トランザクション — コマンド欄とお気に入り",
  meta: "初学者 · 20分",
};

export default function TransactionsLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-gui-basics", "04-transactions", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "トランザクション\nSAP の各機能は「トランザクションコード（T-code）」という短いコードで開きます。\n⏱ 20分 / 📶 初学者 / 🏷 SAP GUI 基礎\nこの章で学ぶこと\n・トランザクションとは何か\n・コマンド欄での開き方\n・お気に入りへの登録\n・よく使うコードの例",
          content: (
            <>
              <hgroup>
                <h1>トランザクション</h1>
                <p>
                  SAP の各機能は<strong>トランザクションコード（T-code）</strong>という短いコードで開きます。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "20分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "SAP GUI 基礎" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>トランザクションとは何か</li>
                <li>コマンド欄からの開き方（3種類）</li>
                <li>お気に入りへの登録と活用</li>
                <li>よく使うコードの一覧</li>
              </ul>
            </>
          ),
        },
        {
          title: "トランザクション＝画面の住所",
          plainText:
            "トランザクション＝画面の住所\n例: SE38=ABAPエディタ、SE16N=テーブル表示、SM37=ジョブ一覧。電話の内線番号のように、コードを入力して直接ダイヤルするイメージ。\nAくん：開発では SE38 が最初に覚えるコード、というイメージですね。\nBちゃん：コードを覚えるのは大変そう…。全部暗記しないといけないんですか？\n先生：全部暗記する必要はありません。よく使うものだけ体に入れて、残りはお気に入りや検索で辿れます。",
          content: (
            <>
              <h2>トランザクション ＝ 画面の住所</h2>
              <p>
                電話の<strong>内線番号</strong>のように、コードを覚えて<strong>直接ダイヤル</strong>するイメージです。
                SAP のすべての機能画面にはこの「住所コード」があります。
              </p>
              <Figure
                src="image/04-tcode-address.webp"
                alt="電話の内線番号帳のイメージ図。左側に番号リスト（SE38・SE16N・SM37 など）、右側にそれぞれの画面のミニチュア（ABAP エディタ・テーブル表示・ジョブ管理画面）が並んでいる。コードと画面が1対1で対応していることを示す。"
                caption="T-code は画面への「内線番号」。コードを知れば直接ダイヤルできる"
                kind="concept"
              />
              <Dialog speaker="a">
                開発では <code>SE38</code> が最初に覚えるコードのイメージです。入力して Enter を押せば ABAP エディタが開く。
              </Dialog>
              <Dialog speaker="b">
                コードを全部暗記しないといけないんですか…？いっぱいあって大変そう。
              </Dialog>
              <Dialog speaker="teacher">
                全部暗記する必要はありません。まずよく使う5〜10個を覚えて、残りは<strong>お気に入り</strong>や検索で辿れます。
              </Dialog>
            </>
          ),
        },
        {
          title: "3つの開き方",
          plainText:
            "3つの開き方\n1. コマンド欄にコードを入力して Enter（いちばん速い）\n2. メニューから階層を辿る（場所が分かっているとき）\n3. お気に入りから選ぶ（よく使う画面はこちら）\nAくん：研修の最初はコマンド欄で開く練習をすると、画面のつながりが理解しやすくなりそうですね。\n先生：その通り。まずコマンド欄で操作感をつかんで、実務では使いやすい方法に切り替えれば OK です。",
          content: (
            <>
              <h2>3つの開き方</h2>
              <MermaidDiagram
                chart={`flowchart TD
  A[画面を開きたい] --> B{どうやって？}
  B --> C[コマンド欄入力\\n最速・慣れると楽]
  B --> D[メニューを辿る\\n場所が分かるとき]
  B --> E[お気に入りから\\n実務でよく使う]`}
              />
              <ol>
                <li>
                  <strong>コマンド欄</strong> … <code>SE38</code> → <kbd>Enter</kbd>（いちばん速い）
                </li>
                <li>
                  <strong>メニュー</strong> … 階層を辿る（場所が分かっているとき）
                </li>
                <li>
                  <strong>お気に入り</strong> … よく使う画面をブックマーク（実務ではこちらが多い）
                </li>
              </ol>
              <Dialog speaker="a">
                研修の最初はコマンド欄で開く練習をすると、画面のつながりが理解しやすくなりそうですね。
              </Dialog>
              <Dialog speaker="teacher">
                そうです。まずコマンド欄で操作感をつかんで、実務では使いやすい方法に切り替えれば OK です。
              </Dialog>
              <Callout variant="tip">
                研修の最初はコマンド欄で開く練習をすると、<strong>どの画面がどのコードか</strong>が自然と身につきます。
              </Callout>
            </>
          ),
        },
        {
          title: "お気に入りに登録",
          plainText:
            "お気に入りに登録\n毎日使うトランザクションはお気に入りに登録しておくと、コードを思い出す必要が減ります。\n手順: 目的のトランザクションで画面を開く → メニューから「お気に入りに追加」\nフォルダ名を「開発」「照会」など業務別に分けると便利。\n先生：個人のお気に入りは自分のユーザー設定に保存されます。チームで共有リストがある場合はそちらも確認しましょう。\nBちゃん：ブラウザのブックマークと同じ感覚で使えるんですね！",
          content: (
            <>
              <h2>お気に入りに登録</h2>
              <p>毎日使うトランザクションは<strong>お気に入り</strong>に登録しておくと、コードを思い出す必要が減ります。</p>
              <ol>
                <li>目的のトランザクションで画面を開く</li>
                <li>メニューから「お気に入りに追加」（環境により表記が異なります）</li>
                <li>フォルダ名を「開発」「照会」など<strong>業務別に分ける</strong>と探しやすい</li>
              </ol>
              <Dialog speaker="b">
                ブラウザのブックマークと同じ感覚で使えるんですね！よく行くサイトをお気に入りに入れるのと同じ。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。個人のお気に入りは自分のユーザー設定に保存されます。チームで共有リストがある場合は、そちらも確認しましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "よく使う T-code 一覧",
          plainText:
            "初心者がよく触る T-code\nSE38: ABAP プログラムの作成・変更\nSE16N: テーブルデータの表示（権限が必要）\nSM37: バックグラウンドジョブの確認\nST22: 実行時エラー（ダンプ）の確認\nSU01: ユーザー管理（管理者向け）\nAくん：SE38 と ST22 は開発でセットで使いそうです。プログラムを実行してエラーが出たらダンプを確認する流れ。\n先生：権限のない T-code は開けません。研修環境で使える一覧は担当者に確認してください。",
          content: (
            <>
              <h2>初心者がよく触る T-code</h2>
              <InfoPanel title="開発・確認でよく出る例" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>コード</th>
                      <th>用途（ざっくり）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>SE38</code></td>
                      <td>ABAP プログラムの作成・変更</td>
                    </tr>
                    <tr>
                      <td><code>SE16N</code></td>
                      <td>テーブルデータの表示（権限が必要）</td>
                    </tr>
                    <tr>
                      <td><code>SM37</code></td>
                      <td>バックグラウンドジョブの確認</td>
                    </tr>
                    <tr>
                      <td><code>ST22</code></td>
                      <td>実行時エラー（ダンプ）の確認</td>
                    </tr>
                    <tr>
                      <td><code>SU01</code></td>
                      <td>ユーザー管理（管理者向け）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="a">
                <code>SE38</code> と <code>ST22</code> は開発でセットで使いそうですね。プログラムを実行してエラーが出たらダンプを確認する流れ。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。権限のない T-code は開けません。研修環境で使える一覧は<strong>担当者に確認</strong>してください。
              </Dialog>
              <Callout variant="note">
                全部今すぐ覚えなくて大丈夫です。まず <code>SE38</code>（開発者向け）または自分がよく使う1〜2個からスタートしましょう。
              </Callout>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 トランザクションコード（T-code）とは？→ SAP の画面・機能を開くための短いコード\nQ2 お気に入りの主な用途は？→ よく使うトランザクションを登録してすぐに開けるようにする\n今日のひとこと：T-code はすべて覚えなくていい。まず5個、あとはお気に入りと検索を活用しましょう。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="トランザクションコードは SAP の各機能画面を開くための短い識別子（住所）です。SE38 なら ABAP エディタ、SE16N ならテーブル表示、のように1対1で対応しています。"
                question={<strong>トランザクションコード（T-code）とは？</strong>}
                options={[
                  "パスワードの別名",
                  "SAP の画面・機能を開くための短いコード",
                  "Windows のファイル名",
                ]}
              />
              <Quiz
                answer={2}
                explanation="お気に入りはよく使うトランザクションを登録してすぐ開けるようにする機能です。ブラウザのブックマークに相当します。フォルダ分けして整理するとさらに便利です。"
                question={<strong>お気に入りの主な用途は？</strong>}
                options={[
                  "SAP のバージョンを記録する",
                  "パスワードを保存する",
                  "よく使うトランザクションを登録してすぐに開けるようにする",
                ]}
              />
              <Dialog speaker="closing">
                T-code はすべて覚えなくて大丈夫。まず5個から始めて、残りはお気に入りと検索を活用しましょう。慣れるにつれ自然と増えていきます。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(TransactionsLesson);
