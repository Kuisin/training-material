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
            "トランザクション\nSAP の各機能は「トランザクション（T-code）」という4〜20文字程度のコードで開きます。",
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
                <li>コマンド欄での開き方</li>
                <li>お気に入りへの登録</li>
                <li>よく使うコードの例</li>
              </ul>
            </>
          ),
        },
        {
          title: "T-codeとは",
          plainText:
            "トランザクション＝画面の住所\n例: SE38=ABAPエディタ SE16N=テーブル表示 SM37=ジョブ一覧。覚えなくても、お気に入りや検索で辿れる。",
          content: (
            <>
              <h2>トランザクション ＝ 画面の住所</h2>
              <p>
                電話の内線番号のように、<strong>コードを覚えて直接ダイヤル</strong>するイメージです。
                全部暗記する必要はありませんが、よく使うものは体に入れると速いです。
              </p>
              <Dialog speaker="a">
                開発では <code>SE38</code> が最初に覚えるやつ、というイメージですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "開き方",
          plainText:
            "3つの開き方\n1. コマンド欄にコード入力→Enter\n2. メニューから辿る\n3. お気に入りから選ぶ",
          content: (
            <>
              <h2>3つの開き方</h2>
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
              <Callout variant="tip">
                研修の最初はコマンド欄で開く練習をすると、画面のつながりが理解しやすくなります。
              </Callout>
            </>
          ),
        },
        {
          title: "お気に入り",
          plainText:
            "お気に入りに登録\n画面を開いた状態でメニューから「お気に入りに追加」、またはドラッグで登録。フォルダ分けすると探しやすい。",
          content: (
            <>
              <h2>お気に入りに登録</h2>
              <p>毎日使うトランザクションは<strong>お気に入り</strong>に登録しておくと、コードを思い出す必要が減ります。</p>
              <ol>
                <li>目的のトランザクションで画面を開く</li>
                <li>メニューから「お気に入り」関連の項目で追加（環境により表記が異なります）</li>
                <li>フォルダ名を「開発」「照会」など業務別に分けると便利</li>
              </ol>
              <Dialog speaker="teacher">
                個人のお気に入りは自分のユーザー設定に保存されます。チームで共有リストがある場合は、そちらも確認しましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "よく使うコード",
          plainText:
            "初心者が触ることの多い T-code\nSE38 SE16N SM37 SU01 など",
          content: (
            <>
              <h2>初心者が触ることの多い T-code</h2>
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
                      <td>
                        <code>SE38</code>
                      </td>
                      <td>ABAP プログラムの作成・変更</td>
                    </tr>
                    <tr>
                      <td>
                        <code>SE16N</code>
                      </td>
                      <td>テーブルデータの表示（権限が必要）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>SM37</code>
                      </td>
                      <td>バックグラウンドジョブの確認</td>
                    </tr>
                    <tr>
                      <td>
                        <code>ST22</code>
                      </td>
                      <td>実行時エラー（ダンプ）の確認</td>
                    </tr>
                    <tr>
                      <td>
                        <code>SU01</code>
                      </td>
                      <td>ユーザー管理（管理者向け）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <p className="text-sm opacity-90 mt-2">権限のない T-code は開けません。研修環境で使える一覧は担当者に確認してください。</p>
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
                explanation="トランザクションコードは SAP の各機能画面を開くための短い識別子（住所）です。"
                question={<strong>トランザクションコード（T-code）とは？</strong>}
                options={[
                  "パスワードの別名",
                  "SAP の画面・機能を開くための短いコード",
                  "Windows のファイル名",
                ]}
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(TransactionsLesson);
