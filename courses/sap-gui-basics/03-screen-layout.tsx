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
            "画面の見方\nSAP GUI の画面はどこも同じ「型」です。名前が分かると、説明を聞いたときにすぐ場所を特定できます。\n⏱ 15分 / 📶 初学者 / 🏷 SAP GUI 基礎\nこの章で学ぶこと\n・メニューバー・標準ツールバー・タイトルバー\n・コマンド欄（トランザクション入力欄）\n・ステータスバーとメッセージ領域\n・作業領域（入力フォームや一覧）",
          content: (
            <>
              <hgroup>
                <h1>画面の見方</h1>
                <p>SAP GUI の画面はどこも同じ"型"です。各部分の名前を覚えましょう。</p>
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
          title: "画面構成の全体像",
          plainText:
            "画面の上から下へ\nタイトルバー → メニューバー → 標準ツールバー → （アプリケーションツールバー） → 作業領域 → ステータスバー\n先生：どの画面を開いても、この上下の「型」は変わりません。まずこれを骨格として覚えましょう。\nAくん：HTML ページのヘッダー・メイン・フッターに似た構成ですね。上下は固定で、真ん中が可変。",
          content: (
            <>
              <h2>画面の上から下へ</h2>
              <Figure
                src="image/03-screen-map.webp"
                alt="SAP GUI 画面の構成図。上から順に：タイトルバー（画面名表示）→ メニューバー（システム・ヘルプ等のメニュー）→ 標準ツールバー（保存・戻る・印刷等のボタン列）→ コマンド欄（トランザクションコード入力）→ アプリケーションツールバー（画面固有ボタン）→ 作業領域（入力フォーム・表・ツリー）→ ステータスバー（画面下部のメッセージ表示）。各部分が色分けされて示されている。"
                caption="SAP GUI の画面は上から下まで決まった「型」で並んでいる"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                どの画面を開いても、この上下の「型」は変わりません。まずこれを骨格として覚えましょう。
              </Dialog>
              <Dialog speaker="a">
                Web ページのヘッダー・メイン・フッターに似た構成ですね。上下は固定で、真ん中の作業領域だけが画面ごとに変わる。
              </Dialog>
            </>
          ),
        },
        {
          title: "各部分の名前と役割",
          plainText:
            "各部分の名前と役割\n1. タイトルバー：今開いている画面の名前\n2. メニューバー：システム・ヘルプ・画面ごとのメニュー\n3. 標準ツールバー：戻る・保存・印刷などのボタン\n4. アプリケーションツールバー：画面固有のボタン（ある画面のみ）\n5. 作業領域：入力欄・表・ツリーなど、実際に触る部分\n6. ステータスバー：画面下部。メッセージやシステム情報\nBちゃん：いちばん大事なのは、真ん中の作業領域と、下のステータスバー、ですね。",
          content: (
            <>
              <h2>各部分の名前と役割</h2>
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
                いちばん大事なのは、真ん中の「作業領域」と、下の「ステータスバー」ですね。ここを見ておけば大体わかる？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。作業領域で入力して、ステータスバーで結果を確認する — この2点を意識するだけで操作の流れがつかめます。
              </Dialog>
            </>
          ),
        },
        {
          title: "コマンド欄",
          plainText:
            "コマンド欄\n画面上部付近の入力欄。トランザクションコード（例 SE38）を入力して Enter で画面を開く。SAP GUI 操作の「住所検索」。\nAくん：URL バーにアドレスを直打ちする感じですね。SE38 と入力して Enter を押せばその画面に飛べる。\n先生：コマンド欄にフォーカスがないときは、/n のあとにコードを入力する方法もよく使います。",
          content: (
            <>
              <h2>コマンド欄</h2>
              <p>
                <strong>コマンド欄</strong>は、トランザクションコード（画面の住所）を入力する欄です。
                例: <code>SE38</code> と入力して <kbd>Enter</kbd> → ABAP エディタが開く。
              </p>
              <MermaidDiagram
                chart={`flowchart LR
  A[コマンド欄に\\nSE38 入力] --> B[Enter を押す]
  B --> C[ABAP エディタ\\n（SE38）が開く]`}
              />
              <Dialog speaker="a">
                ブラウザの URL バーにアドレスを直打ちする感じですね。<code>SE38</code> と入力して Enter を押せばその画面に飛べる。
              </Dialog>
              <Callout variant="tip">
                コマンド欄にフォーカスがないときは、<kbd>/n</kbd> のあとにコードを入力する方法もよく使います（例: <code>/nSE38</code>）。詳細は第4章・第5章で扱います。
              </Callout>
            </>
          ),
        },
        {
          title: "ステータスバー",
          plainText:
            "ステータスバー\n画面左下付近。成功・警告・エラーのメッセージが表示される。色やアイコンで種類が分かる。\n成功：緑やチェック（例: 保存しました）\n警告：黄（続行できるが注意が必要）\nエラー：赤（入力や処理が止まる）\n先生：ボタンを押したあとは、必ずステータスバーを見る習慣をつけてください。「押したつもり」で終わらせないことが大事です。\nBちゃん：エラーが赤で分かりやすいなら、ひと目で気づけそうです。",
          content: (
            <>
              <h2>ステータスバー</h2>
              <p>処理の結果は、多くの場合<strong>画面左下のステータスバー</strong>に表示されます。</p>
              <InfoPanel title="メッセージの種類" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>種類</th>
                      <th>色・記号</th>
                      <th>意味</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>成功</strong></td>
                      <td>緑 / チェック</td>
                      <td>操作が正常に完了（例: 保存しました）</td>
                    </tr>
                    <tr>
                      <td><strong>警告</strong></td>
                      <td>黄 / ！</td>
                      <td>注意は必要だが続行できる</td>
                    </tr>
                    <tr>
                      <td><strong>エラー</strong></td>
                      <td>赤 / ×</td>
                      <td>入力や処理が止まる（修正が必要）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                ボタンを押したあとは、<strong>必ずステータスバーを見る</strong>習慣をつけてください。「押したつもり」で終わらせないことが大事です。
              </Dialog>
              <Dialog speaker="b">
                エラーが赤で分かりやすいなら、ひと目で気づけそうです。メッセージを読めば何をすればいいか分かりますか？
              </Dialog>
              <Dialog speaker="teacher">
                だいたいは分かります。さらに詳しく知りたいときは、ステータスバーのメッセージを<strong>ダブルクリック</strong>すると詳細が表示されます（第6章で詳しく扱います）。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 トランザクションコードを入力する欄は？→ コマンド欄\nQ2 「保存しました」などのメッセージが出る場所は？→ ステータスバー\n今日のひとこと：画面の「型」を覚えると、どの画面でも迷わず操作できるようになります。同じ骨格が全画面に共通しているのが SAP の強みです。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={2}
                explanation="コマンド欄はトランザクションコードを入力して目的の画面を開くための欄です。ブラウザの URL バーに似た役割で、SE38 のようなコードを入力して Enter を押せばその画面に飛べます。"
                question={<strong>トランザクションコードを入力する欄は？</strong>}
                options={["ステータスバー", "タイトルバー", "コマンド欄"]}
              />
              <Quiz
                answer={1}
                explanation="成功・警告・エラーなど、操作の結果メッセージはステータスバーに表示されます。操作後は必ずここを確認する習慣が大切です。ダブルクリックで詳細も確認できます。"
                question={<strong>「保存しました」などのメッセージが出る場所は？</strong>}
                options={["メニューバー", "ステータスバー", "標準ツールバー"]}
              />
              <Dialog speaker="closing">
                画面の「型」を覚えると、どの画面でも迷わず操作できるようになります。同じ骨格が全画面に共通しているのが SAP の強みです。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ScreenLayoutLesson);
