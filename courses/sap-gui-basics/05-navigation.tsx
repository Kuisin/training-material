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
            "画面の移動\nSAP は画面が深くネストします。戻る・キャンセル・セッションを理解すると迷子になりません。\n⏱ 15分 / 📶 初学者 / 🏷 SAP GUI 基礎\nこの章で学ぶこと\n・F3（戻る）とキャンセルの違い\n・セッション（複数の SAP 画面タブ）の考え方\n・コマンド欄の /n・/o・/i など基本コマンド",
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
                <li><kbd>F3</kbd>（戻る）とキャンセルの違い</li>
                <li>セッション（複数の SAP 画面タブ）の考え方</li>
                <li>コマンド欄の <code>/n</code>・<code>/o</code>・<code>/i</code> など基本コマンド</li>
              </ul>
            </>
          ),
        },
        {
          title: "戻るとキャンセルの違い",
          plainText:
            "戻る（F3）とキャンセルの違い\nF3 または「戻る」ボタン：ひとつ前の画面へ戻る。ブラウザの「戻る」に近いイメージ。\nキャンセル（赤い × など）：現在の処理をやめて閉じる。\n未保存の入力があると「保存しますか？」と確認が出る。はい/いいえ/キャンセルを読んでから選ぶ。\nBちゃん：ブラウザの「戻る」に近いのが F3 なんですね。\nAくん：データを書いた状態で F3 を押すと確認ダイアログが出る。意図しない保存や破棄を防ぐための仕組みですね。",
          content: (
            <>
              <h2>
                戻る（<kbd>F3</kbd>）とキャンセルの違い
              </h2>
              <InfoPanel title="2つの操作の比較" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>操作</th>
                      <th>何が起きるか</th>
                      <th>データへの影響</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><kbd>F3</kbd>（戻る）</td>
                      <td>ひとつ前の画面へ移動</td>
                      <td>確認ダイアログが出る場合あり</td>
                    </tr>
                    <tr>
                      <td>キャンセル（赤 ×）</td>
                      <td>現在の処理を中断して閉じる</td>
                      <td>未保存の入力は破棄される可能性</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="b">
                ブラウザの「戻る」に近いのが F3 なんですね。いつでも押してよさそう。
              </Dialog>
              <Dialog speaker="a">
                データを入力した状態で F3 を押すと確認ダイアログが出る。意図しない保存・破棄を防ぐ仕組みですね。
              </Dialog>
              <Callout variant="warning">
                未保存の入力があると「保存しますか？」と確認が出ます。<strong>はい／いいえ／キャンセル</strong>の違いを読んでから選びましょう。特に本番環境では慎重に。
              </Callout>
            </>
          ),
        },
        {
          title: "セッションとは",
          plainText:
            "セッション＝作業の切り口\n新しいセッションを開くと、別タブのように別の作業を並行できる。例: セッション1でSE38（開発）、セッション2でSE16N（データ確認）。\nAくん：ブラウザで複数タブを開いて並行作業するのと同じイメージですね。\n先生：その通りです。SAP では最大6〜9つのセッションを同時に開けます（会社設定による）。",
          content: (
            <>
              <h2>セッション ＝ 作業の切り口</h2>
              <p>
                SAP GUI では<strong>セッション</strong>を増やすと、ブラウザのタブのように複数の作業を並べられます。
              </p>
              <Figure
                src="image/05-sessions.webp"
                alt="デスクトップ上に3つの SAP GUI ウィンドウが重なって並んでいる図。左のウィンドウには「セッション1 SE38 開発」、中央には「セッション2 SE16N データ確認」、右には「セッション3 業務照会」と書かれている。ブラウザの複数タブに相当する働きを視覚化。"
                caption="セッション＝ブラウザのタブ。複数の作業を同時進行できる"
                kind="concept"
              />
              <MermaidDiagram
                chart={`flowchart TB
  S1[セッション 1\\nSE38 開発]
  S2[セッション 2\\nSE16N データ確認]
  S3[セッション 3\\n業務照会]`}
              />
              <Dialog speaker="a">
                ブラウザで複数タブを開いて並行作業するのと同じイメージですね。SE38 でコードを書きながら別のセッションでデータを確認できる。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。SAP では最大6〜9つのセッションを同時に開けます（会社の設定による）。ただし開きすぎるとサーバー負荷になるので、不要なセッションは閉じましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "コマンド欄のナビゲーション",
          plainText:
            "コマンド欄のナビゲーションコマンド\n/n+T-code: 現在の画面を終了して指定画面へ（例: /nSE38）\n/o: 新しいセッションを開く\n/i: 現在のセッションを終了\n/h: デバッグモードの切替（開発時）\nAくん：/nSE38 と入力すれば、今の画面を終了して SE38 に飛べる。コマンド欄がナビとしても機能するんですね。\n先生：/o で新しいセッションを開いてから T-code を入力すると、現在の作業を残したまま別の画面で確認できます。",
          content: (
            <>
              <h2>コマンド欄のナビゲーションコマンド</h2>
              <InfoPanel title="コマンド欄（先頭に / を付ける）" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>入力</th>
                      <th>意味</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>/n</code>＋T-code</td>
                      <td>現在の画面を終了してから指定画面へ（例: <code>/nSE38</code>）</td>
                    </tr>
                    <tr>
                      <td><code>/o</code></td>
                      <td>新しいセッションを開く（現在の作業はそのまま）</td>
                    </tr>
                    <tr>
                      <td><code>/i</code></td>
                      <td>現在のセッションを終了</td>
                    </tr>
                    <tr>
                      <td><code>/h</code></td>
                      <td>デバッグモードの切替（開発時のみ）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="a">
                <code>/nSE38</code> と入力すれば、今の画面を終了して SE38 に飛べる。コマンド欄がナビとしても機能するんですね。
              </Dialog>
              <Dialog speaker="teacher">
                <code>/o</code> で新しいセッションを開いてから T-code を入力すると、現在の作業を残したまま別の画面で確認できます。並行作業に便利です。
              </Dialog>
            </>
          ),
        },
        {
          title: "迷子になったら",
          plainText:
            "迷子になったら\n1. F3 でひとつずつ戻る\n2. コマンド欄に /n+目的の T-code で開き直す（例: /nSE38）\n3. それでもダメなら /i でセッションを終了して再開\n先生：いきなり SAP Logon を閉じるより、セッション単位で整理するほうが安全です。未保存データに注意してください。\nBちゃん：焦って「×」を押しまくらず、F3 を使えばいいんですね。\nつまずき：「何も起きない」「固まった気がする」と思ったら、まず SAP が処理中でないか待ってみましょう。カーソルが砂時計になっていたら、完了を待つのが正解です。",
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
                <li>それでもダメなら、<code>/i</code> でセッションを終了して必要な画面から再開</li>
              </ol>
              <Dialog speaker="b">
                焦って「×」を押しまくらず、まず <kbd>F3</kbd> を使えばいいんですね。少しずつ戻れる。
              </Dialog>
              <Dialog speaker="teacher">
                いきなり SAP Logon 全体を閉じるより、セッション単位で整理するほうが安全です。未保存データに注意しながら、落ち着いて対処しましょう。
              </Dialog>
              <Dialog speaker="stumble">
                「何も起きない」「固まった気がする」と思ったら、まず SAP が処理中でないか確認を。カーソルが砂時計になっていたら、<strong>完了を待つ</strong>のが正解です。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 前の画面に戻るキーは？→ F3\nQ2 新しいセッションを開くコマンドは？→ /o\n今日のひとこと：SAP で迷子になったら F3 で戻り、どうにもならなければ /n+T-code で開き直す。この2つが迷子脱出の王道です。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={0}
                explanation="F3 は前の画面に戻る操作で、SAP GUI で最もよく使うキーのひとつです。ブラウザの「戻る」に相当します。未保存データがある場合は確認ダイアログが出ます。"
                question={<strong>前の画面に戻るキーは？</strong>}
                options={["F3", "F8", "F12"]}
              />
              <Quiz
                answer={2}
                explanation="/o は新しいセッション（作業タブ）を開くコマンドです。現在の作業画面をそのままにして別の作業を並行できます。ブラウザで「新しいタブ」を開くのと同じ感覚です。"
                question={<strong>新しいセッションを開くコマンド欄の入力は？</strong>}
                options={["/n", "/h", "/o"]}
              />
              <Dialog speaker="closing">
                SAP で迷子になったら <kbd>F3</kbd> で戻り、どうにもならなければ <code>/n</code>＋T-code で開き直す。この2つが迷子脱出の王道です。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(NavigationLesson);
