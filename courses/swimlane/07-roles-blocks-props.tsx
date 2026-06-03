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
  title: "第2章 — /role/ /block/ /prop/ の定義",
  meta: "初学者 · 25分",
};

export default function RolesBlocksPropsLesson() {
  return (
    <Lesson
      chrome={lessonChrome("swimlane", "07-roles-blocks-props", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "第2章 — /role/ /block/ /prop/ の定義\nスイムレーンのカラム（ロール）、ステップのスタイル（ブロック）、ドキュメントチップ（プロップ）の定義方法を学びます。\n⏱ 25分 / 📶 初学者 / 🏷 Kai Swimlane\nこの章で学ぶこと\n・/role/ でスイムレーンカラムを定義する\n・/role/ のカラー・アイコン設定\n・/block/ で再利用可能なステップスタイルを定義する\n・/block/ の6種類の形状（shape）\n・/prop/ で再利用可能なドキュメントチップを定義する\n・/prop/ の各プロパティとツールチップ設定\n・Lucideアイコンの使い方",
          content: (
            <>
              <hgroup>
                <h1>第2章 — /role/ /block/ /prop/ の定義</h1>
                <p>スイムレーンのカラム・ステップスタイル・ドキュメントチップの定義を学びます。</p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "25分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "Kai Swimlane" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li><code>/role/</code> でスイムレーンカラムを定義する</li>
                <li><code>/role/</code> のカラー・アイコン設定</li>
                <li><code>/block/</code> で再利用可能なステップスタイルを定義する</li>
                <li><code>/block/</code> の6種類の形状（<code>shape</code>）</li>
                <li><code>/prop/</code> で再利用可能なドキュメントチップを定義する</li>
                <li>Lucideアイコン（<code>#アイコン名</code>）の使い方</li>
              </ul>
            </>
          ),
        },
        {
          title: "/role/ の基本",
          plainText:
            "/role/ セクション — 基本\n/role/ セクションでは <roleId> という形式でロールIDを宣言し、直後の行に label: 表示名; などのプロパティを書きます。ロールは図の縦カラム（スイムレーン）に対応します。\n先生：山括弧で囲んだ英数字がロールIDです。IDはDSL内で参照するための名前で、図には表示されません。label が図に表示されるテキストです。\nAくん：IDと表示名を分けることで、ロールIDは英語・表示名は日本語にできるわけですね。\n先生：その通りです。IDはスペースなし・英数字で書き、表示名は自由に書けます。\nBちゃん：左から右への順番は、/role/ セクションに書いた順番と同じですか？\n先生：はい。書いた順番がそのまま左から右のカラム順になります。",
          content: (
            <>
              <h2>/role/ セクション — 基本</h2>
              <p>
                <code>/role/</code> セクションでは <code>&lt;roleId&gt;</code> でロールIDを宣言し、直後の行にプロパティを書きます。
                ロールは図の縦カラム（スイムレーン）に対応します。
              </p>
              <CodeBlock
                language="kai-swimlane"
                code={`/role/
<sales>
label: 営業;

<accounting>
label: 経理;

<system>
label: システム;`}
              />
              <Figure
                src="image/02-role-lanes.webp"
                alt="Kai Swimlaneで3つのロール（営業・経理・システム）を定義したときのレンダリング結果。図の上部に3つの横並びカラムが表示され、それぞれに「営業」「経理」「システム」というラベルが付いている。"
                caption="/role/ に書いた順番がそのままカラムの左→右の順になる"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                山括弧で囲んだ英数字がロールIDです。IDはDSL内で参照するための名前で、図には表示されません。<code>label</code> が図に表示されるテキストです。
              </Dialog>
              <Dialog speaker="a">
                IDと表示名を分けることで、ロールIDは英語・表示名は日本語にできるわけですね。コードの可読性が上がる。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。IDはスペースなし・英数字で書き、<code>label</code> は自由なテキストで書けます。
              </Dialog>
              <Dialog speaker="b">
                カラムの左から右への順番は、<code>/role/</code> に書いた順番と同じですか？
              </Dialog>
              <Dialog speaker="teacher">
                はい。書いた順番がそのまま左から右のカラム順になります。順番を変えたければDSL内のロールの順序を変えるだけです。
              </Dialog>
            </>
          ),
        },
        {
          title: "/role/ — カラーとアイコン",
          plainText:
            "/role/ のカラーとアイコン\ntext-color、background-color でカラムヘッダーの色を設定できます。icon プロパティで Lucide アイコン（#名前）か絵文字を設定できます。\n先生：色の指定は CSS カラー名や HEX コードが使えます。アイコンは #check や #user のように # に続けて Lucide のアイコン名を書きます。\nAくん：Lucide アイコンの名前はどこで調べればいいですか？\n先生：https://lucide.dev/ でアイコン一覧を検索できます。また後のスライドでよく使うアイコンをまとめます。\nBちゃん：絵文字も使えるんですね。日本語の文書なら馴染みやすいですね。",
          content: (
            <>
              <h2>/role/ — カラーとアイコン設定</h2>
              <p>
                <code>text-color</code>・<code>background-color</code> でカラムヘッダーの色を、
                <code>icon</code> でアイコンを設定できます。
              </p>
              <CodeBlock
                language="kai-swimlane"
                code={`/role/
<sales>
label: 営業;
background-color: #3b82f6;
text-color: #ffffff;
icon: #user;

<accounting>
label: 経理;
background-color: #10b981;
text-color: #ffffff;
icon: #file-text;

<system>
label: システム;
icon: ☁;`}
              />
              <Figure
                src="image/02-role-styles.webp"
                alt="Kai Swimlaneで各ロールにカラーとアイコンを設定したときのイメージ。「営業」カラムは青背景に白文字とユーザーアイコン、「経理」カラムは緑背景に白文字とファイルアイコン、「システム」カラムはデフォルト色に雲の絵文字が表示されている。"
                caption="カラーとアイコンでロールを視覚的に区別できる"
                kind="concept"
              />
              <Dialog speaker="teacher">
                色の指定はCSS カラー名や HEX コードが使えます。アイコンは <code>#check</code> や <code>#user</code> のように <code>#</code> に続けて Lucide アイコン名を書きます。
              </Dialog>
              <Dialog speaker="a">
                Lucide アイコンの名前はどこで調べればいいですか？
              </Dialog>
              <Dialog speaker="teacher">
                <a href="https://lucide.dev/" target="_blank" rel="noreferrer">https://lucide.dev/</a> でアイコン一覧を検索できます。また後のスライドでよく使うアイコンをまとめます。
              </Dialog>
              <Dialog speaker="b">
                絵文字も使えるんですね！日本語の文書なら馴染みやすくて良いと思います。
              </Dialog>
            </>
          ),
        },
        {
          title: "/block/ とは",
          plainText:
            "/block/ セクションとは\n/block/ は再利用可能なステップの「スタイル定義」です。色・形状・アイコンをブロックIDで定義しておき、/line/ セクションのステップに適用します。\n先生：ブロックは「ステップの見た目のテンプレート」です。一度定義すれば何度でも使い回せます。\nAくん：CSSのクラスに似た概念ですね。スタイルに名前を付けて再利用する。\n先生：良い比喩です。start・end・gate のような意味のあるIDを付けると管理しやすいです。\nBちゃん：ブロックを使わないと全部デフォルトの見た目になるんですか？\n先生：はい。ブロックを省略するとデフォルトの矩形スタイルになります。",
          content: (
            <>
              <h2>/block/ セクションとは</h2>
              <p>
                <code>/block/</code> は再利用可能なステップの「スタイル定義」です。
                色・形状・アイコンをブロックIDで定義しておき、<code>/line/</code> セクションのステップに適用します。
              </p>
              <CodeBlock
                language="kai-swimlane"
                code={`/block/
<start>
shape: ellipse;
background-color: #1e40af;
text-color: #ffffff;
icon: #play;

<end>
shape: ellipse;
background-color: #dc2626;
text-color: #ffffff;
icon: #square;

<gate>
shape: hex;
background-color: #f59e0b;`}
              />
              <Dialog speaker="teacher">
                ブロックは「ステップの見た目のテンプレート」です。一度定義すれば何度でも使い回せます。
              </Dialog>
              <Dialog speaker="a">
                CSSのクラスに似た概念ですね。スタイルに名前を付けて再利用する。
              </Dialog>
              <Dialog speaker="teacher">
                良い比喩です。<code>start</code>・<code>end</code>・<code>gate</code> のような意味のあるIDを付けると管理しやすいです。
              </Dialog>
              <Dialog speaker="b">
                ブロックを使わないと全部デフォルトの見た目になるんですか？
              </Dialog>
              <Dialog speaker="teacher">
                はい。ブロックを省略するとデフォルトの角丸矩形スタイルになります。シンプルな図の場合は省略でも問題ありません。
              </Dialog>
            </>
          ),
        },
        {
          title: "/block/ — shapeの種類",
          plainText:
            "/block/ — shape プロパティの種類\nshape には rect、rounded、hex、ellipse、cloud、note、subroutine の7種類が使えます。\n先生：それぞれの形状はフロー図の表記規則に対応しています。ellipse が開始・終了、hex が分岐・ゲートとして使われることが多いです。\nAくん：flowchart の表記に近いですね。\nBちゃん：cloud はどんなときに使うんですか？\n先生：クラウドサービスや外部システムを示すときによく使います。",
          content: (
            <>
              <h2>/block/ — shape プロパティ</h2>
              <p>
                <code>shape</code> プロパティでステップの形状を指定できます。7種類があります。
              </p>
              <Figure
                src="image/02-block-shapes.webp"
                alt="Kai Swimlaneで利用できる7種類のブロック形状（rect・rounded・hex・ellipse・cloud・note・subroutine）をそれぞれ表示した比較図。各形状の下にその名前が書かれている。"
                caption="7種類のブロック形状 — 用途に合わせて使い分ける"
                kind="diagram"
              />
              <InfoPanel title="shape プロパティの種類" variant="reference">
                <table>
                  <thead>
                    <tr><th>値</th><th>形状</th><th>主な用途</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><code>rect</code></td><td>矩形（角あり）</td><td>通常の処理ステップ</td></tr>
                    <tr><td><code>rounded</code></td><td>角丸矩形</td><td>通常の処理（デフォルト）</td></tr>
                    <tr><td><code>hex</code></td><td>六角形</td><td>分岐・ゲート・判断</td></tr>
                    <tr><td><code>ellipse</code></td><td>楕円</td><td>開始・終了</td></tr>
                    <tr><td><code>cloud</code></td><td>雲形</td><td>外部システム・クラウド</td></tr>
                    <tr><td><code>note</code></td><td>メモ形（折り角）</td><td>ドキュメント・メモ</td></tr>
                    <tr><td><code>subroutine</code></td><td>両端線矩形</td><td>サブルーティン呼び出し</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                それぞれの形状はフロー図の表記規則に対応しています。<code>ellipse</code> が開始・終了、<code>hex</code> が分岐・ゲートとして使われることが多いです。
              </Dialog>
              <Dialog speaker="a">
                フローチャートの表記規則に近いですね。標準的な図の読み手でも直感的に理解できる。
              </Dialog>
              <Dialog speaker="b">
                <code>cloud</code> はどんなときに使うんですか？
              </Dialog>
              <Dialog speaker="teacher">
                クラウドサービスや外部システムとのやり取りを示すステップによく使います。
              </Dialog>
            </>
          ),
        },
        {
          title: "/block/ の使い方",
          plainText:
            "/block/ をステップに適用する\n/line/ セクションのステップ行で [roleId: テキスト] の後ろに <blockId> を書くと、そのブロック定義のスタイルが適用されます。\n先生：ステップ行の書き方は [ロールID: テキスト] <ブロックID> です。ブロックIDは省略可能です。\nAくん：ブロックIDを書かないとデフォルトスタイルが適用される、ということですね。\n先生：その通りです。\nBちゃん：start と end のブロックを定義しておいて、最初と最後のステップだけ使うのが一般的ですか？\n先生：はい。それが一番よく使われるパターンです。",
          content: (
            <>
              <h2>/block/ をステップに適用する</h2>
              <p>
                <code>/line/</code> セクションのステップ行で <code>[roleId: テキスト] &lt;blockId&gt;</code> と書くと、そのブロックのスタイルが適用されます。
              </p>
              <CodeBlock
                language="kai-swimlane"
                code={`/block/
<start>
shape: ellipse;
background-color: #1e40af;
text-color: #ffffff;

<end>
shape: ellipse;
background-color: #dc2626;
text-color: #ffffff;

<gate>
shape: hex;
background-color: #f59e0b;

/line/
[sales: 開始] <start>
[sales: 注文確認]
[sales: 承認判断] <gate>
[sales: 完了] <end>`}
              />
              <Dialog speaker="teacher">
                ステップ行の書き方は <code>[ロールID: テキスト] &lt;ブロックID&gt;</code> です。ブロックIDは省略可能です。
              </Dialog>
              <Dialog speaker="a">
                ブロックIDを書かないとデフォルトスタイルが適用される、ということですね。スタイルの共通化が図れる。
              </Dialog>
              <Dialog speaker="b">
                <code>start</code> と <code>end</code> のブロックを定義しておいて、最初と最後のステップだけ使うのが一般的ですか？
              </Dialog>
              <Dialog speaker="teacher">
                はい。それが最もよく使われるパターンです。加えて <code>gate</code>（分岐）も定義しておくと、図の表現力が大きく上がります。
              </Dialog>
            </>
          ),
        },
        {
          title: "/prop/ とは",
          plainText:
            "/prop/ セクションとは\n/prop/ はステップに付けるドキュメントチップ（タグのような小さなラベル）の定義です。申請書・承認書・データベースなど、ステップに関連するモノを視覚的に示すために使います。\n先生：プロップはステップに props: ID; という書き方で付けます。複数付ける場合は props: A,B,C; のようにカンマ区切りにします。\nAくん：UMLのノートやステレオタイプに近い概念ですね。ステップに付随する成果物や入出力を示す。\nBちゃん：「この手順ではこの書類が必要」というのを視覚的に表せるんですね。",
          content: (
            <>
              <h2>/prop/ セクションとは</h2>
              <p>
                <code>/prop/</code> はステップに付けるドキュメントチップの定義です。
                申請書・承認書・帳票など、ステップに関連する成果物や入出力を視覚的に示します。
              </p>
              <Figure
                src="image/02-prop-chips.webp"
                alt="Kai Swimlaneのステップにドキュメントチップ（プロップ）が付いている様子。ステップの横に「申請書」「承認書」という小さなチップラベルが表示されている。チップは左右どちら側にも付けられることを示す。"
                caption="/prop/ チップ — ステップに関連するドキュメントを視覚的に付与"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                プロップはステップに <code>props: ID;</code> という書き方で付けます。複数付ける場合は <code>props: A,B,C;</code> のようにカンマ区切りにします。
              </Dialog>
              <Dialog speaker="a">
                UMLのノートやステレオタイプに近い概念ですね。ステップに付随する成果物や入出力を示す。
              </Dialog>
              <Dialog speaker="b">
                「この手順ではこの書類が必要」というのを視覚的に表せるんですね。業務フロー図に必須の要素です。
              </Dialog>
              <Dialog speaker="teacher">
                まさにそういった用途のための機能です。特に業務フロー図では、どのステップでどの書類が発生するかを明示することが重要です。
              </Dialog>
            </>
          ),
        },
        {
          title: "/prop/ — プロパティ詳細",
          plainText:
            "/prop/ のプロパティ詳細\nlabel、side、background-color、border-color、text-color、title/hint（ホバーツールチップ）、max-chars が設定できます。\n先生：side プロパティは left か right でチップを図の左右どちら側に表示するかを決めます。title と hint はホバーしたときに表示されるツールチップテキストです。\nAくん：title と hint は同じ機能ですか？\n先生：title が主要なツールチップテキストで、hint は補足説明です。どちらか一方だけでも問題ありません。\nBちゃん：max-chars って何ですか？\n先生：チップに表示する最大文字数です。長い名前を持つプロップでも見た目を統一できます。",
          content: (
            <>
              <h2>/prop/ — プロパティ詳細</h2>
              <CodeBlock
                language="kai-swimlane"
                code={`/prop/
<RQ>
label: 申請書;
side: right;
background-color: #fef3c7;
border-color: #f59e0b;
text-color: #92400e;
title: 購買申請書（Form RQ-001）;
hint: 経理部門の承認が必要;
max-chars: 6;

<AP>
label: 承認書;
side: left;
background-color: #d1fae5;
border-color: #10b981;`}
              />
              <InfoPanel title="/prop/ プロパティ一覧" variant="reference">
                <table>
                  <thead>
                    <tr><th>プロパティ</th><th>説明</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><code>label</code></td><td>チップに表示されるテキスト</td></tr>
                    <tr><td><code>side</code></td><td>表示位置：<code>left</code> または <code>right</code></td></tr>
                    <tr><td><code>background-color</code></td><td>チップの背景色</td></tr>
                    <tr><td><code>border-color</code></td><td>チップの枠線の色</td></tr>
                    <tr><td><code>text-color</code></td><td>チップのテキスト色</td></tr>
                    <tr><td><code>title</code></td><td>ホバー時のツールチップ（主テキスト）</td></tr>
                    <tr><td><code>hint</code></td><td>ホバー時のツールチップ（補足テキスト）</td></tr>
                    <tr><td><code>max-chars</code></td><td>表示する最大文字数</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                <code>side</code> プロパティは <code>left</code> か <code>right</code> でチップを図の左右どちら側に表示するかを決めます。<code>title</code> と <code>hint</code> はホバーしたときに表示されるツールチップテキストです。
              </Dialog>
              <Dialog speaker="a">
                <code>title</code> と <code>hint</code> は同じ機能ですか？
              </Dialog>
              <Dialog speaker="teacher">
                <code>title</code> が主要なツールチップテキストで、<code>hint</code> は補足説明です。どちらか一方だけでも問題ありません。
              </Dialog>
              <Dialog speaker="b">
                <code>max-chars</code> って何ですか？
              </Dialog>
              <Dialog speaker="teacher">
                チップに表示する最大文字数です。長い名前を持つプロップでもチップのサイズを揃えて、図全体の見た目を統一できます。
              </Dialog>
            </>
          ),
        },
        {
          title: "アイコンリファレンス",
          plainText:
            "Lucide アイコンリファレンス\nKai Swimlane でよく使う Lucide アイコンの一覧。#アイコン名 の形式で icon プロパティに指定します。\n先生：Lucideは800以上のアイコンがあります。まずよく使うものを覚えて、必要に応じて https://lucide.dev/ で検索しましょう。\nAくん：アイコン名はハイフン区切りなんですね。例えば #alert-triangle みたいに。\n先生：その通りです。Lucideのウェブサイトに表示されている名前をそのまま使えます。\nBちゃん：絵文字と Lucide アイコンはどう使い分けますか？\n先生：Lucideはサイズ・色がスタイルに合わせて自動調整されます。絵文字はそのままの見た目です。色を合わせたいなら Lucide がおすすめです。",
          content: (
            <>
              <h2>Lucide アイコンリファレンス</h2>
              <p>
                <code>icon: #アイコン名;</code> の形式で指定します。ハイフン区切りの名前を使います。
              </p>
              <InfoPanel title="よく使う Lucide アイコン" variant="reference">
                <table>
                  <thead>
                    <tr><th>アイコン名</th><th>主な用途</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><code>#play</code></td><td>開始・スタート</td></tr>
                    <tr><td><code>#square</code></td><td>終了・ストップ</td></tr>
                    <tr><td><code>#check</code></td><td>承認・完了</td></tr>
                    <tr><td><code>#user</code></td><td>担当者・人物</td></tr>
                    <tr><td><code>#users</code></td><td>チーム・複数人</td></tr>
                    <tr><td><code>#database</code></td><td>データベース・システム</td></tr>
                    <tr><td><code>#mail</code></td><td>メール・通知</td></tr>
                    <tr><td><code>#shield</code></td><td>セキュリティ・承認</td></tr>
                    <tr><td><code>#zap</code></td><td>自動処理・高速</td></tr>
                    <tr><td><code>#settings</code></td><td>設定・管理</td></tr>
                    <tr><td><code>#server</code></td><td>サーバー・インフラ</td></tr>
                    <tr><td><code>#cloud</code></td><td>クラウド・外部サービス</td></tr>
                    <tr><td><code>#file-text</code></td><td>ドキュメント・書類</td></tr>
                    <tr><td><code>#alert-triangle</code></td><td>警告・注意</td></tr>
                    <tr><td><code>#rocket</code></td><td>デプロイ・リリース</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="tip">
                全アイコンは <a href="https://lucide.dev/" target="_blank" rel="noreferrer">https://lucide.dev/</a> で検索できます。
                表示されているアイコン名（ハイフン区切り）をそのまま <code>#アイコン名</code> の形式で使えます。
              </Callout>
              <Dialog speaker="teacher">
                Lucideは800以上のアイコンがあります。まずよく使うものを覚えて、必要に応じて検索しましょう。
              </Dialog>
              <Dialog speaker="a">
                アイコン名はハイフン区切りなんですね。<code>#alert-triangle</code> のように。
              </Dialog>
              <Dialog speaker="b">
                絵文字と Lucide アイコンはどう使い分けますか？
              </Dialog>
              <Dialog speaker="teacher">
                Lucideはサイズ・色がスタイルに合わせて自動調整されます。絵文字はそのままの見た目です。色を統一したいなら Lucide、手軽さを重視するなら絵文字がおすすめです。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：第2章のポイントを整理しましょう。/role/ でスイムレーンのカラムを定義。/block/ でステップのスタイルテンプレートを定義。/prop/ でドキュメントチップを定義。3つとも <ID> で宣言してプロパティを書く形式です。\nAくん：/role/ と /block/ と /prop/ はすべて再利用のための定義セクションで、実際に使うのは /line/ セクションのステップです。role はカラム配置に、block はスタイル適用に、prop は props: で付与する。\nBちゃん：アイコンは #Lucideアイコン名 か絵文字を使う。色は CSS カラー名や HEX コードで指定する。これだけ覚えれば基本は書けそうですね。\n先生：完璧な整理です。次の章ではいよいよ /line/ セクションでフローを書く方法を学びます。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                第2章のポイントを整理しましょう。<code>/role/</code> でスイムレーンのカラムを定義、<code>/block/</code> でステップのスタイルテンプレートを定義、<code>/prop/</code> でドキュメントチップを定義。3つとも <code>&lt;ID&gt;</code> で宣言してプロパティを書く形式です。
              </Dialog>
              <Dialog speaker="a">
                <code>/role/</code>・<code>/block/</code>・<code>/prop/</code> はすべて再利用のための定義セクションで、実際に使うのは <code>/line/</code> セクションのステップです。<code>role</code> はカラム配置に、<code>block</code> はスタイル適用に、<code>prop</code> は <code>props:</code> で付与する、ということですね。
              </Dialog>
              <Dialog speaker="b">
                アイコンは <code>#Lucideアイコン名</code> か絵文字を使う。色はCSS カラー名や HEX コードで指定する。これだけ覚えれば基本は書けそうです。
              </Dialog>
              <Dialog speaker="teacher">
                完璧な整理です。次の章ではいよいよ <code>/line/</code> セクションでフローを書く方法を学びます。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 /block/ の shape プロパティで使える値はどれ？→ ellipse\nQ2 /prop/ で side: right; に設定したとき、チップはどこに表示されるか？→ 図の右ガター側\n先生：次の章では /line/ セクションでフローを記述する方法を詳しく学びます。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={2}
                question={<strong><code>/block/</code> の <code>shape</code> プロパティで使える値はどれ？</strong>}
                options={[
                  "diamond（ダイヤモンド）",
                  "triangle（三角形）",
                  "ellipse（楕円形）",
                ]}
                explanation="shape に使える値は rect / rounded / hex / ellipse / cloud / note / subroutine の7種類です。diamond と triangle は使えません。"
              />
              <Quiz
                answer={1}
                question={<strong><code>/prop/</code> で <code>side: right;</code> に設定したとき、チップはどこに表示されるか？</strong>}
                options={[
                  "ステップブロックの左側に重なって表示される",
                  "図の右ガター側（右列）に表示される",
                  "ステップのテキストの下に表示される",
                ]}
                explanation="side プロパティは left または right で、図のガター（左列・右列）のどちら側にチップを表示するかを指定します。side: right; なら右ガター側に表示されます。"
              />
              <Dialog speaker="closing">
                <code>/role/</code>・<code>/block/</code>・<code>/prop/</code> の定義方法をマスターしました。次の章では <code>/line/</code> セクションでフロー全体を記述します。いよいよ図の「ストーリー」を書く段階です。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(RolesBlocksPropsLesson);
