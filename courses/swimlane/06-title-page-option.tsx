import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  InfoPanel,
  Figure,
  LessonMeta,
  CodeBlock,
  Quiz,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "第1章 — /title/ /page/ /option/ の設定",
  meta: "初学者 · 20分",
};

export default function TitlePageOptionLesson() {
  return (
    <Lesson
      chrome={lessonChrome("swimlane", "06-title-page-option", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "第1章 — /title/ /page/ /option/ の設定\nDSLの最初の3セクションを学びます。図のタイトル、ページ情報、表示オプションを設定する方法を習得します。\n⏱ 20分 / 📶 初学者 / 🏷 Kai Swimlane\nこの章で学ぶこと\n・/title/ セクションで図のタイトルを設定する\n・/page/ セクションでサブタイトル・ヘッダー・フッターを設定する\n・/option/ セクションで左右ガター・ヘッダー・フッター・説明文の表示を制御する\n・left-title / right-title などの列見出しを設定する\n・merge-at-previous-block の意味と使い方",
          content: (
            <>
              <hgroup>
                <h1>第1章 — /title/ /page/ /option/ の設定</h1>
                <p>DSLの最初の3セクションを学びます。図のタイトル・ページ情報・表示オプションを習得します。</p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "20分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "Kai Swimlane" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li><code>/title/</code> セクションで図のタイトルを設定する</li>
                <li><code>/page/</code> セクションでサブタイトル・ヘッダー・フッターを設定する</li>
                <li><code>/option/</code> セクションで各部の表示・非表示を制御する</li>
                <li><code>left-title</code> / <code>right-title</code> などの列見出しを設定する</li>
                <li><code>merge-at-previous-block</code> の意味と使い方</li>
              </ul>
            </>
          ),
        },
        {
          title: "/title/ セクション",
          plainText:
            "/title/ セクション\n/title/ の直後の行がそのまま図のタイトル（見出し）になります。1行のテキストです。セクション宣言の次の行に書きます。\n先生：/title/ セクションはシンプルです。/title/ と書いた次の行にタイトルテキストを書くだけです。\nAくん：複数行は書けないんですか？\n先生：タイトルは1行のみです。長い説明は /page/ の description に書きます。\nBちゃん：なるほど。タイトルはシンプルに、詳しい説明は別の場所に書くんですね。",
          content: (
            <>
              <h2>/title/ セクション</h2>
              <p>
                <code>/title/</code> の直後の行がそのまま図のタイトル（見出し）になります。
                シンプルに、セクション宣言の次の行にタイトルテキストを書くだけです。
              </p>
              <CodeBlock
                language="kai-swimlane"
                code={`@kai-swimlane

/title/
受注処理フロー

/role/
<sales>
label: 営業;

/line/
[sales: 受注]

@end`}
              />
              <Figure
                src="image/01-title-result.webp"
                alt="Kai Swimlaneで /title/ セクションに「受注処理フロー」と書いたときのレンダリング結果。図の最上部に大きく「受注処理フロー」というタイトルが表示されている。"
                caption="/title/ セクションのテキストが図の見出しとして表示される"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                <code>/title/</code> セクションはシンプルです。<code>/title/</code> と書いた次の行にタイトルテキストを書くだけです。
              </Dialog>
              <Dialog speaker="a">
                複数行は書けないんですか？
              </Dialog>
              <Dialog speaker="teacher">
                タイトルは1行のみです。長い説明は次の <code>/page/</code> セクションの <code>description</code> に書きます。
              </Dialog>
              <Dialog speaker="b">
                タイトルはシンプルに、詳しい説明は別の場所に書くという設計なんですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "/page/ — description",
          plainText:
            "/page/ セクション — description\ndescription: テキスト; と書くと、タイトルの下にサブタイトル（説明文）が表示されます。複数行にしたい場合はバッククォート3つのフェンスで囲みます。\n先生：description はセミコロンで終わります。1行ならそのまま書けます。複数行は ``` と ``` で囲みます。\nAくん：複数行フェンス構文は /line/ の desc や remark でも使えますか？\n先生：はい。同じ ``` フェンス構文が使えます。\nBちゃん：セミコロンで終わるというルールを忘れないようにしないと。",
          content: (
            <>
              <h2>/page/ セクション — description</h2>
              <p>
                <code>description: テキスト;</code> と書くと、タイトルの下にサブタイトル（説明文）が表示されます。
                複数行にしたい場合はバッククォート3つのフェンスで囲みます。
              </p>
              <CodeBlock
                language="kai-swimlane"
                code={`/page/
description: 月次締め処理の全体フロー;

// 複数行にする場合
/page/
description: \`\`\`
月次締め処理の全体フロー
2024年度版
\`\`\`;`}
              />
              <Callout variant="tip">
                プロパティはすべて <strong>セミコロン（;）</strong> で終わります。書き忘れるとパースエラーの原因になります。
              </Callout>
              <Dialog speaker="teacher">
                <code>description</code> はセミコロンで終わります。1行ならそのまま書けます。複数行は <code>```</code> と <code>```</code> で囲みます。
              </Dialog>
              <Dialog speaker="a">
                複数行フェンス構文は <code>/line/</code> の <code>desc</code> や <code>remark</code> でも使えますか？
              </Dialog>
              <Dialog speaker="teacher">
                はい。同じ <code>```</code> フェンス構文がステップのメタデータでも使えます。一貫したルールです。
              </Dialog>
              <Dialog speaker="b">
                セミコロンで終わるというルール、うっかり忘れそうですね。フォーマットボタンで検出できますか？
              </Dialog>
              <Dialog speaker="teacher">
                フォーマットボタンは整形はしてくれますが、セミコロン漏れの場合はプレビューが正しく更新されないことで気づきます。プレビューを見ながら書くのがコツです。
              </Dialog>
            </>
          ),
        },
        {
          title: "/page/ — ヘッダーとフッター",
          plainText:
            "/page/ — ヘッダーとフッター\nheader-left/center/right と footer-left/center/right の6つのポジションにテキストを配置できます。\n先生：ヘッダーは図の上部、フッターは図の下部にある帯です。それぞれ左・中央・右の3箇所にテキストを設定できます。\nAくん：合計6つの位置が使えるんですね。\nBちゃん：会社名と日付を入れたりするんですか？\n先生：はい。例えば header-center に会社名、footer-right に作成日を入れるのが一般的な使い方です。",
          content: (
            <>
              <h2>/page/ — ヘッダーとフッター</h2>
              <p>
                ヘッダーとフッターにはそれぞれ左・中央・右の3つの位置にテキストを配置できます。
              </p>
              <CodeBlock
                language="kai-swimlane"
                code={`/page/
description: 月次締め処理の全体フロー;
header-left: 社外秘;
header-center: ACME株式会社;
header-right: 業務フロー v1.2;
footer-left: 作成：山田太郎;
footer-center: 管理番号：BPD-001;
footer-right: 2024年4月;`}
              />
              <Figure
                src="image/01-page-layout.webp"
                alt="Kai Swimlaneのページレイアウト図。図の上部にheader-left（社外秘）、header-center（会社名）、header-right（バージョン）が配置され、図の下部にfooter-left（作成者）、footer-center（管理番号）、footer-right（日付）が配置されている様子。"
                caption="/page/ のヘッダー・フッター — 6つの位置にテキストを配置できる"
                kind="diagram"
              />
              <InfoPanel title="ヘッダー・フッターの6ポジション" variant="reference">
                <table>
                  <thead>
                    <tr><th>プロパティ</th><th>表示位置</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><code>header-left</code></td><td>図の上部・左端</td></tr>
                    <tr><td><code>header-center</code></td><td>図の上部・中央</td></tr>
                    <tr><td><code>header-right</code></td><td>図の上部・右端</td></tr>
                    <tr><td><code>footer-left</code></td><td>図の下部・左端</td></tr>
                    <tr><td><code>footer-center</code></td><td>図の下部・中央</td></tr>
                    <tr><td><code>footer-right</code></td><td>図の下部・右端</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                ヘッダーは図の上部、フッターは図の下部の帯です。それぞれ左・中央・右の3箇所にテキストを設定できます。
              </Dialog>
              <Dialog speaker="b">
                会社名と日付を入れたりするんですか？
              </Dialog>
              <Dialog speaker="teacher">
                はい。<code>header-center</code> に会社名、<code>footer-right</code> に作成日を入れるのが典型的な使い方です。
              </Dialog>
            </>
          ),
        },
        {
          title: "/option/ — ガター表示",
          plainText:
            "/option/ セクション — ガター表示\nshow-left-gutter と show-right-gutter でガター（図の左右の列）の表示・非表示を切り替えます。左ガターにはステップのラベルと説明、右ガターには備考が表示されます。\n先生：ガターとは図の左右に付く補足情報の列のことです。show-left-gutter: true; と書くと表示されます。\nAくん：true/false 以外の書き方も使えますか？\n先生：はい。true/false の他に yes/no、on/off、1/0 も使えます。どれを使っても構いません。\nBちゃん：ガターを表示すると図が横に広くなるんですね。",
          content: (
            <>
              <h2>/option/ — ガター表示設定</h2>
              <p>
                <code>show-left-gutter</code> と <code>show-right-gutter</code> でガター（図の左右の補足情報列）の表示・非表示を切り替えます。
              </p>
              <CodeBlock
                language="kai-swimlane"
                code={`/option/
show-left-gutter: true;
show-right-gutter: true;

// true / false / yes / no / on / off / 1 / 0 がすべて使える
show-left-gutter: yes;
show-right-gutter: off;`}
              />
              <Callout variant="note">
                <strong>ガターの役割：</strong>
                左ガターにはステップの <code>label</code>（名称）と <code>desc</code>（説明）が表示されます。
                右ガターにはステップの <code>remark</code>（備考）が表示されます。
                ガターは <code>/line/</code> セクションで各ステップに設定します（第3章で学習）。
              </Callout>
              <Dialog speaker="teacher">
                ガターとは図の左右に付く補足情報の列のことです。<code>show-left-gutter: true;</code> と書くと表示されます。
              </Dialog>
              <Dialog speaker="a">
                <code>true/false</code> 以外の書き方も使えますか？
              </Dialog>
              <Dialog speaker="teacher">
                はい。<code>true/false</code> の他に <code>yes/no</code>、<code>on/off</code>、<code>1/0</code> も使えます。好みで選んで構いません。
              </Dialog>
              <Dialog speaker="b">
                ガターを表示すると図が横に広くなるから、必要なときだけオンにする感じですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "/option/ — ヘッダー・フッター・説明文",
          plainText:
            "/option/ — ヘッダー・フッター・説明文の表示切り替え\nshow-header、show-footer、show-description、show-step-block-captions の4つのオプションで各要素の表示・非表示を制御できます。\n先生：/page/ でヘッダーを設定しても、show-header: false; にすれば非表示にできます。\nAくん：設定と表示制御が分離されているんですね。設定だけ書いておいて、必要なときに表示する使い方ができる。\n先生：その通りです。ドラフト段階では非表示にしておいて、最終版で表示するという使い方が便利です。\nBちゃん：show-step-block-captions って何ですか？\n先生：ステップのブロック形状上に表示されるキャプション（ラベル）の表示・非表示です。",
          content: (
            <>
              <h2>/option/ — ヘッダー・フッター・説明文の表示制御</h2>
              <p>
                4つのオプションで図の各要素の表示・非表示を細かく制御できます。
              </p>
              <CodeBlock
                language="kai-swimlane"
                code={`/option/
show-header: true;
show-footer: false;
show-description: true;
show-step-block-captions: true;`}
              />
              <InfoPanel title="表示制御オプション" variant="reference">
                <table>
                  <thead>
                    <tr><th>オプション</th><th>対象</th><th>既定値</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><code>show-header</code></td><td>ヘッダー帯（上部）</td><td>true</td></tr>
                    <tr><td><code>show-footer</code></td><td>フッター帯（下部）</td><td>true</td></tr>
                    <tr><td><code>show-description</code></td><td>タイトル下のdescription</td><td>true</td></tr>
                    <tr><td><code>show-step-block-captions</code></td><td>ステップブロック上のキャプション</td><td>true</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                <code>/page/</code> でヘッダーを設定しても、<code>show-header: false;</code> にすれば非表示にできます。
              </Dialog>
              <Dialog speaker="a">
                設定と表示制御が分離されているんですね。設定だけ書いておいて、必要なときに表示する使い方ができる。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。ドラフト段階では非表示にしておいて、最終版で表示する、という使い方も便利です。
              </Dialog>
              <Dialog speaker="b">
                <code>show-step-block-captions</code> って何ですか？
              </Dialog>
              <Dialog speaker="teacher">
                ステップのブロック形状の上に重ねて表示されるキャプションテキストの表示・非表示です。アイコンだけのシンプルな図を作りたいときに <code>false</code> にします。
              </Dialog>
            </>
          ),
        },
        {
          title: "/option/ — カラム見出し",
          plainText:
            "/option/ — カラム見出し（left-title など）\nleft-title、left-subtitle、right-title、right-subtitle の4つで、ガター列の見出しテキストを設定できます。\n先生：左ガターの列見出しを変えたいときに left-title を使います。既定値は「手順」や「説明」などの汎用的なテキストです。\nAくん：プロジェクト固有の用語に合わせて変更できるんですね。例えば「作業名」「担当者メモ」とか。\n先生：その通りです。図を受け取る側が読みやすい言葉に変更しましょう。\nBちゃん：right-title と right-subtitle は右ガターに対応しているんですよね？",
          content: (
            <>
              <h2>/option/ — カラム見出し設定</h2>
              <p>
                ガター列の見出しテキストを <code>left-title</code>、<code>left-subtitle</code>、<code>right-title</code>、<code>right-subtitle</code> で設定できます。
              </p>
              <CodeBlock
                language="kai-swimlane"
                code={`/option/
show-left-gutter: true;
show-right-gutter: true;
left-title: 作業手順;
left-subtitle: 担当者と内容;
right-title: 備考;
right-subtitle: 注意事項・エラー対応;`}
              />
              <Figure
                src="image/01-option-columns.webp"
                alt="Kai Swimlaneの図で左ガター列の見出しに「作業手順」「担当者と内容」、右ガター列の見出しに「備考」「注意事項・エラー対応」と表示されているレンダリング結果。カラム見出しのカスタマイズ例。"
                caption="left-title / right-title などでガター列の見出しをカスタマイズ"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                左ガターの列見出しを変えたいときに <code>left-title</code> を使います。図を受け取る側が読みやすい言葉に変更しましょう。
              </Dialog>
              <Dialog speaker="a">
                プロジェクト固有の用語に合わせて変更できるんですね。「作業名」「担当者メモ」など、業務に合った言葉に変えられる。
              </Dialog>
              <Dialog speaker="b">
                <code>right-title</code> と <code>right-subtitle</code> は右ガターに対応してるんですよね？
              </Dialog>
              <Dialog speaker="teacher">
                はい。<code>right-title</code> が右ガターの大見出し、<code>right-subtitle</code> が右ガターの小見出しになります。4つセットで覚えておくと便利です。
              </Dialog>
            </>
          ),
        },
        {
          title: "/option/ — merge-at-previous-block",
          plainText:
            "/option/ — merge-at-previous-block\nmerge-at-previous-block: true; を設定すると、分岐や合流点（ダイヤモンド型ノード）が前のブロックの位置に結合するレイアウトになります。\n先生：分岐点が前のステップにくっつく表示になり、よりコンパクトな図になります。\nAくん：デフォルトは false ですよね。どういうときに true にするんですか？\n先生：ステップ数が多くて縦に長い図を圧縮したいとき、または特定のレイアウト表現をしたいときに使います。\nBちゃん：まず false で作ってみて、必要に応じて true にする感じでいいですか？\n先生：はい、その進め方が一番理解しやすいです。",
          content: (
            <>
              <h2>/option/ — merge-at-previous-block</h2>
              <p>
                <code>merge-at-previous-block: true;</code> を設定すると、分岐・合流ノードが直前ブロックの位置に結合するレイアウトになります。
              </p>
              <CodeBlock
                language="kai-swimlane"
                code={`/option/
merge-at-previous-block: true;`}
              />
              <Callout variant="note">
                <strong>使いどころ：</strong> ステップ数が多くて縦に長い図を圧縮したいとき、または特定のビジュアル表現が必要なときに使います。
                まずは <code>false</code>（既定）で作成し、レイアウトを確認してから変更するのがおすすめです。
              </Callout>
              <Dialog speaker="teacher">
                分岐点が前のステップにくっつく表示になり、よりコンパクトな図を作れます。
              </Dialog>
              <Dialog speaker="a">
                デフォルトは <code>false</code> ですよね。どういうときに <code>true</code> にするんですか？
              </Dialog>
              <Dialog speaker="teacher">
                ステップ数が多くて縦に長い図を圧縮したいとき、または特定のレイアウト表現をしたいときに使います。
              </Dialog>
              <Dialog speaker="b">
                まず <code>false</code> で作ってみて、必要に応じて <code>true</code> にする感じでいいですか？
              </Dialog>
              <Dialog speaker="teacher">
                はい、その進め方が一番理解しやすいです。まずデフォルトで図を完成させてから調整しましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "互換性メモ",
          plainText:
            "互換性メモ — /page/ と /option/ の重複プロパティ\nleft-title・right-title などのカラム見出しは /page/ セクションにも書けます。ただし同じプロパティが /option/ と /page/ の両方にある場合は /option/ の値が優先されます。\n先生：古いDSLや他の人が書いたファイルを見ると /page/ 側にこれらを書いてあることがあります。エラーにはなりませんが、/option/ に統一するのがおすすめです。\nAくん：後方互換性のための仕様なんですね。\n先生：その通りです。混乱を避けるために /option/ に書くルールを社内で統一するといいでしょう。",
          content: (
            <>
              <h2>互換性メモ — /page/ と /option/ の重複プロパティ</h2>
              <p>
                <code>left-title</code>・<code>right-title</code> などのカラム見出しは <code>/page/</code> セクションにも書けます。
                ただし同じプロパティが両方にある場合は <strong><code>/option/</code> の値が優先</strong>されます。
              </p>
              <Callout variant="note">
                古いファイルや他の人が書いたDSLで <code>/page/</code> 側にカラム見出しが書かれていることがあります。
                エラーにはなりませんが、<strong>新規作成時は <code>/option/</code> に統一する</strong>ことをおすすめします。
              </Callout>
              <Dialog speaker="teacher">
                古いDSLや他の人が書いたファイルを見ると <code>/page/</code> 側にこれらを書いてあることがあります。エラーにはなりませんが、<code>/option/</code> に統一するのがおすすめです。
              </Dialog>
              <Dialog speaker="a">
                後方互換性のための仕様なんですね。古いフォーマットを壊さないためにどちらでも動くようにしている。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。混乱を避けるために、<code>/option/</code> に書くルールを社内やチームで統一すると良いでしょう。
              </Dialog>
              <Dialog speaker="b">
                どちらに書いてもいい、でも優先順位があるということをメモしておきます。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：第1章のポイントを整理しましょう。/title/ は図の見出しで1行のみ。/page/ はヘッダー・フッター・descriptionの設定。/option/ は表示のオン・オフと列見出しの調整です。\nAくん：/option/ の boolean 値は true/false だけでなく yes/no、on/off、1/0 が全部使える。left-title などのカラム見出しは /option/ に書くのが推奨で、/page/ にも書けるが /option/ が優先される。\nBちゃん：まず /title/ だけ書いて図の形を確認して、そのあと /page/ でヘッダーを追加して、最後に /option/ で見た目を調整するという順番で作るといいですね。\n先生：その段階的なアプローチが正解です。次の章では /role/ /block/ /prop/ を学びます。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                第1章のポイントを整理しましょう。<code>/title/</code> は図の見出しで1行のみ。<code>/page/</code> はヘッダー・フッター・<code>description</code> の設定。<code>/option/</code> は表示のオン・オフと列見出しの調整です。
              </Dialog>
              <Dialog speaker="a">
                <code>/option/</code> の boolean 値は <code>true/false</code> だけでなく <code>yes/no</code>、<code>on/off</code>、<code>1/0</code> が全部使える。<code>left-title</code> などは <code>/option/</code> に書くのが推奨で、<code>/page/</code> にも書けるが <code>/option/</code> が優先される、ということですね。
              </Dialog>
              <Dialog speaker="b">
                まず <code>/title/</code> だけ書いて図の形を確認して、次に <code>/page/</code> でヘッダーを追加して、最後に <code>/option/</code> で見た目を調整するという順番で作ると良さそうです。
              </Dialog>
              <Dialog speaker="teacher">
                その段階的なアプローチが正解です。次の章では <code>/role/</code>・<code>/block/</code>・<code>/prop/</code> を学びます。いよいよスイムレーンの「中身」の定義に入ります。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 /page/ セクションで設定できないのはどれ？→ show-left-gutter（これは /option/ のプロパティ）\nQ2 /option/ の boolean 値として正しくない書き方はどれ？→ enable（正しいのは true/yes/on/1 など）\n先生：/title/ /page/ /option/ の役割と書き方を覚えたら、次はいよいよロール・ブロック・プロップの定義に進みます。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={2}
                question={<strong><code>/page/</code> セクションで設定するプロパティとして正しいのはどれ？</strong>}
                options={[
                  "show-left-gutter（ガター表示切り替え）",
                  "merge-at-previous-block（ブロック結合）",
                  "header-center（ヘッダー中央のテキスト）",
                ]}
                explanation="header-center は /page/ セクションのプロパティです。show-left-gutter と merge-at-previous-block は /option/ セクションのプロパティです。"
              />
              <Quiz
                answer={1}
                question={<strong><code>/option/</code> の boolean プロパティに使えない値はどれ？</strong>}
                options={[
                  "yes",
                  "enable",
                  "on",
                ]}
                explanation="使える値は true/false、yes/no、on/off、1/0 の8種類です。enable は認識されません。"
              />
              <Dialog speaker="closing">
                <code>/title/</code>・<code>/page/</code>・<code>/option/</code> の役割と書き方を覚えたら、次はいよいよロール・ブロック・プロップの定義に進みます。スイムレーンの「中身」を作っていきましょう。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(TitlePageOptionLesson);
