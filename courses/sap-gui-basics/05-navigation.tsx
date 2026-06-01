import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  InfoPanel,
  Quiz,
  MermaidDiagram,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "画面の移動 — 戻る・セッション・複数画面",
  meta: "初学者 · 15分",
};

export default function NavigationLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-gui-basics", "05-navigation", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "画面の移動\nSAP は画面が深くネストします。戻る・キャンセル・セッションを理解すると迷子になりません。",
          content: (
            <>
              <hgroup>
                <h1>画面の移動</h1>
                <p>戻る・キャンセル・複数セッションを押さえ、画面間を迷わず移動します。</p>
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
                <li>F3（戻る）とキャンセルの違い</li>
                <li>セッション（複数の SAP 画面タブ）の考え方</li>
                <li>コマンド欄の /n など基本コマンド</li>
              </ul>
            </>
          ),
        },
        {
          title: "戻るとキャンセル",
          plainText:
            "戻る F3 と キャンセル\nF3=前の画面に戻る。赤い×やキャンセル=入力を破棄して閉じる。保存していない変更があると確認ダイアログが出る。",
          content: (
            <>
              <h2>
                戻る（<code>F3</code>）とキャンセル
              </h2>
              <ul>
                <li>
                  <kbd>F3</kbd> またはツールバーの<strong>戻る</strong> … ひとつ前の画面へ
                </li>
                <li>
                  <strong>キャンセル</strong>（赤い × など）… 現在の処理をやめて閉じる
                </li>
              </ul>
              <Callout variant="warning">
                未保存の入力があると「保存しますか？」と聞かれます。<strong>はい／いいえ／キャンセル</strong>を間違えないよう、メッセージを読んでから選びましょう。
              </Callout>
              <Dialog speaker="b">
                ブラウザの「戻る」に近いのが F3 なんですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "セッション",
          plainText:
            "セッション＝作業の切り口\n新しいセッションを開くと、別タブのように別の作業を並行できる。/o で新規セッション。",
          content: (
            <>
              <h2>セッション ＝ 作業の切り口</h2>
              <p>
                SAP GUI では<strong>セッション</strong>を増やすと、ブラウザのタブのように複数の作業を並べられます。
                例: セッション1で <code>SE38</code>、セッション2で仕様書を見ながら照会、など。
              </p>
              <MermaidDiagram
                chart={`flowchart TB
  S1[セッション 1\nSE38]
  S2[セッション 2\nSE16N]
  S3[セッション 3\n業務照会]`}
              />
              <InfoPanel title="セッション関連（コマンド欄）" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>入力</th>
                      <th>意味</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>/o</code>
                      </td>
                      <td>新しいセッションを開く</td>
                    </tr>
                    <tr>
                      <td>
                        <code>/i</code>
                      </td>
                      <td>現在のセッションを終了</td>
                    </tr>
                    <tr>
                      <td>
                        <code>/n</code>
                      </td>
                      <td>現在のトランザクションを終了してから次を入力（例: <code>/nSE38</code>）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
            </>
          ),
        },
        {
          title: "迷子になったら",
          plainText:
            "迷子になったら\n1. F3で段階的に戻る 2. /n で目的の T-code を開き直す 3. セッションを閉じて最初から",
          content: (
            <>
              <h2>迷子になったら</h2>
              <ol>
                <li>
                  <kbd>F3</kbd> でひとつずつ戻る
                </li>
                <li>
                  コマンド欄に <code>/n</code>＋目的の T-code（例: <code>/nSE38</code>）で開き直す
                </li>
                <li>それでもダメなら、セッションを終了（<code>/i</code>）して必要な画面から再開</li>
              </ol>
              <Dialog speaker="teacher">
                いきなり SAP Logon を閉じるより、セッション単位で整理するほうが安全です。未保存データに注意してください。
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
                answer={0}
                explanation="F3 は前の画面に戻る操作です。SAP GUI では最もよく使うキーのひとつです。"
                question={<strong>前の画面に戻るキーは？</strong>}
                options={["F3", "F8", "F12"]}
              />
              <Quiz
                answer={2}
                explanation="/o は新しいセッション（作業タブ）を開くコマンドです。"
                question={<strong>新しいセッションを開くコマンド欄の入力は？</strong>}
                options={["/n", "/h", "/o"]}
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(NavigationLesson);
