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
  title: "Kai Swimlane テキストエディタ — コース概要とDSL入門",
  meta: "初学者 · 15分",
};

export default function IntroductionLesson() {
  return (
    <Lesson
      chrome={lessonChrome("swimlane", "05-text-introduction", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "Kai Swimlane テキストエディタ — コース概要とDSL入門\nテキストを書くだけでスイムレーン図が完成する — その仕組みをゼロから学ぶコースです。\n⏱ 15分 / 📶 初学者 / 🏷 Kai Swimlane\nこの章で学ぶこと\n・テキストエディタモードとは何か、どこで使えるか\n・DSL（ドメイン固有言語）とは何か\n・@kai-swimlane と @end で囲む理由\n・7つのセクション（/title/ /page/ /option/ /role/ /block/ /prop/ /line/）の役割概要\n・セクションの順序ルールと省略できるセクション\n・テキストエディタが持つ便利機能（フォーマット・エクスポートなど）",
          content: (
            <>
              <hgroup>
                <h1>Kai Swimlane テキストエディタ — コース概要とDSL入門</h1>
                <p>テキストを書くだけでスイムレーン図が完成する — その仕組みをゼロから学ぶコースです。</p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "15分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "Kai Swimlane" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>テキストエディタモードとは何か、どこで使えるか</li>
                <li>DSL（ドメイン固有言語）とは何か、なぜ便利なのか</li>
                <li><code>@kai-swimlane</code> と <code>@end</code> で囲む理由</li>
                <li>7つのセクションの役割概要</li>
                <li>セクションの順序ルールと省略できるセクション</li>
                <li>テキストエディタが持つ便利機能（フォーマット・エクスポートなど）</li>
              </ul>
            </>
          ),
        },
        {
          title: "テキストエディタとは",
          plainText:
            "テキストエディタとは\nKai Swimlane のテキストエディタは https://kuisin.github.io/swimlane-app/ でブラウザから利用できます。文字を打つだけでリアルタイムにスイムレーン図が生成されるモードです。\n先生：ブラウザを開いてURLにアクセスするだけで使えます。インストール不要です。\nAくん：GUIモードもあるんですよね？テキストモードはどう使い分けるんですか？\n先生：GUIはクリックで直感的に操作できます。テキストモードはコピー・ペーストや一括編集が得意で、バージョン管理（Git）とも相性が良いです。\nBちゃん：じゃあテキストで書けると、プロっぽい使い方ができるんですね。",
          content: (
            <>
              <h2>テキストエディタとは</h2>
              <p>
                Kai Swimlane のテキストエディタは{" "}
                <a href="https://kuisin.github.io/swimlane-app/" target="_blank" rel="noreferrer">
                  https://kuisin.github.io/swimlane-app/
                </a>{" "}
                でブラウザから利用できます。テキストを打つだけでリアルタイムにスイムレーン図が生成されるモードです。
              </p>
              <Figure
                src="image/00-text-editor-ui.webp"
                alt="Kai Swimlaneのテキストエディタ画面。左側にDSLテキストを入力するエディタペインがあり、右側にリアルタイムでスイムレーン図が描画されるプレビューペインが表示されている。上部にフォーマットボタン、テーマ切り替え、エクスポートボタンが並ぶ。"
                caption="テキストエディタのUI — 左がコード入力、右がリアルタイムプレビュー"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                ブラウザを開いてURLにアクセスするだけで使えます。インストールは一切不要です。
              </Dialog>
              <Dialog speaker="a">
                GUIモードもありますよね。テキストモードはどう使い分けるんですか？
              </Dialog>
              <Dialog speaker="teacher">
                GUIはクリックで直感的に操作できます。テキストモードはコピー・ペーストや一括編集が得意で、テキストファイルとして保存できるのでGitによるバージョン管理とも相性が良いです。
              </Dialog>
              <Dialog speaker="b">
                テキストで書けると、何か「プロっぽい」感じがしますね。
              </Dialog>
              <Dialog speaker="teacher">
                慣れると確かにそうです。大きな図を編集するときも、テキストなら一箇所変えるだけで全体が整います。
              </Dialog>
            </>
          ),
        },
        {
          title: "DSLとは何か",
          plainText:
            "DSLとは何か\nDSL（Domain Specific Language）とは「特定の目的のために作られた小さな言語」のことです。Kai Swimlane のDSLは「スイムレーン図を描く」ことだけに特化した書き方です。\n先生：DSLはレシピのようなものです。材料（/role/や/block/）と手順（/line/）を書けば、料理（スイムレーン図）が完成します。\nBちゃん：レシピって分かりやすい！書き方を覚えれば私でも図が作れるってことですね。\nAくん：汎用プログラミング言語より覚えることが少なくて済む、ということですね。\n先生：その通りです。目的が明確なので、文法もシンプルです。",
          content: (
            <>
              <h2>DSLとは何か</h2>
              <p>
                <strong>DSL（Domain Specific Language）</strong>とは、「特定の目的のために作られた小さな言語」のことです。
                Kai Swimlane の DSL は「スイムレーン図を描く」ことだけに特化した書き方です。
              </p>
              <Figure
                src="image/00-dsl-concept.webp"
                alt="左側にテキスト（DSLのコード）があり、矢印を挟んで右側に完成したスイムレーン図が表示されるイメージ図。テキストが図に変換されるDSLの概念を示す。上にはDSL＝ドメイン固有言語というラベルが付く。"
                caption="DSL = テキストの記述 → スイムレーン図の自動生成"
                kind="concept"
              />
              <Dialog speaker="teacher">
                DSLはレシピのようなものです。材料（<code>/role/</code> や <code>/block/</code>）と手順（<code>/line/</code>）を書けば、料理（スイムレーン図）が完成します。
              </Dialog>
              <Dialog speaker="b">
                レシピって分かりやすいです！書き方を覚えれば私でも図が作れるってことですね。
              </Dialog>
              <Dialog speaker="a">
                Pythonや JavaScriptのような汎用言語より、覚えることが少なくて済む、ということですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。目的が「スイムレーン図を描く」だけなので、文法もシンプルに保たれています。数十分あれば全体の構造を理解できます。
              </Dialog>
            </>
          ),
        },
        {
          title: "@kai-swimlaneと@end",
          plainText:
            "@kai-swimlane と @end\nすべての Kai Swimlane DSL は @kai-swimlane で始まり @end で終わります。この2行が「ここからここまでが図の定義ですよ」という目印です。\n先生：@kai-swimlane がないとエディタはただのテキストとして扱います。@end がないと図の終わりが分かりません。必ずセットで書きます。\nAくん：Markdownのコードフェンス（```）に似た考え方ですね。\n先生：良い比喩です。ただしウェブエディタ上では@kai-swimlane と@endの間のテキストが自動的に図として描画されます。\nBちゃん：最初と最後のおまじないとして覚えておきます。",
          content: (
            <>
              <h2>@kai-swimlane と @end</h2>
              <p>
                すべての Kai Swimlane DSL は <code>@kai-swimlane</code> で始まり <code>@end</code> で終わります。
                この2行が「ここからここまでが図の定義です」という目印になります。
              </p>
              <CodeBlock
                language="kai-swimlane"
                code={`@kai-swimlane

/title/
受注プロセス

/role/
<sales>
label: 営業;

/line/
[sales: 注文受付]

@end`}
              />
              <Dialog speaker="teacher">
                <code>@kai-swimlane</code> がないとエディタはただのテキストとして扱います。<code>@end</code> がないと図の終わりが分かりません。必ずセットで書きましょう。
              </Dialog>
              <Dialog speaker="a">
                Markdownのコードフェンス（<code>```</code>）に似た考え方ですね。囲みで意味を与える。
              </Dialog>
              <Dialog speaker="teacher">
                良い比喩です。ただし Markdown フェンスはそのまま表示されるのに対し、Kai Swimlane のエディタは <code>@kai-swimlane</code> ～ <code>@end</code> の内容をリアルタイムで図として描画します。
              </Dialog>
              <Dialog speaker="b">
                最初と最後の「おまじない」として覚えておきます！
              </Dialog>
            </>
          ),
        },
        {
          title: "7つのセクション",
          plainText:
            "7つのセクション\nKai Swimlane DSL には7つのセクションがあります。それぞれスラッシュで囲んだキーワードで始まります。\n/title/ — 図のタイトル\n/page/ — サブタイトル・ヘッダー・フッター\n/option/ — 表示設定（ガター・見出しなど）\n/role/ — ロール（スイムレーンのカラム）の定義\n/block/ — ステップ形状スタイルの定義\n/prop/ — ドキュメントチップの定義\n/line/ — フロー（ステップの流れ）の記述\n先生：この7つを順番に覚えていきます。最初は名前と役割だけでOKです。\nAくん：/line/が一番書く量が多そうですね。\n先生：その通りです。/line/がフローの本体で、残り6つはその設定やスタイル定義です。",
          content: (
            <>
              <h2>7つのセクション</h2>
              <p>
                Kai Swimlane DSL には7つのセクションがあります。それぞれ <code>/セクション名/</code> というキーワードで始まります。
              </p>
              <Figure
                src="image/00-sections-overview.webp"
                alt="Kai Swimlane DSLの7つのセクションを示す構成図。上から順に @kai-swimlane、/title/、/page/、/option/、/role/、/block/、/prop/、/line/、@end と並んでいる。各セクションの役割が右側に短い説明文として記されている。"
                caption="DSLの7セクション構造 — @kai-swimlane〜@end に収まる"
                kind="diagram"
              />
              <InfoPanel title="7つのセクション一覧" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>セクション</th>
                      <th>役割</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td><code>/title/</code></td><td>図のタイトル（見出し）</td></tr>
                    <tr><td><code>/page/</code></td><td>サブタイトル・ヘッダー・フッター</td></tr>
                    <tr><td><code>/option/</code></td><td>表示設定（ガター・列見出しなど）</td></tr>
                    <tr><td><code>/role/</code></td><td>ロール（スイムレーンのカラム）の定義</td></tr>
                    <tr><td><code>/block/</code></td><td>ステップ形状スタイルの定義（再利用可能）</td></tr>
                    <tr><td><code>/prop/</code></td><td>ドキュメントチップの定義（再利用可能）</td></tr>
                    <tr><td><code>/line/</code></td><td>フローステップの記述（本体）</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                この7つを順番に学んでいきます。今は名前と役割だけでOKです。
              </Dialog>
              <Dialog speaker="a">
                <code>/line/</code> が一番書く量が多そうですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。<code>/line/</code> がフローの本体で、残り6つはその設定やスタイル定義に当たります。設定は一度書けば何度でも再利用できます。
              </Dialog>
            </>
          ),
        },
        {
          title: "セクションの順序と省略",
          plainText:
            "セクションの順序と省略\nセクションは上から /title/ → /page/ → /option/ → /role/ → /block/ → /prop/ → /line/ の順で書きます。/option/ は省略可能です。/block/ と /prop/ もステップで使わない場合は省略できます。\n先生：必ず必要なのは /title/ /role/ /line/ の3つです。あとは必要に応じて追加します。\nBちゃん：最初はシンプルな3つから始められるんですね。安心しました。\nAくん：フォーマットボタンで自動整形できると聞いたのですが？\n先生：はい。エディタ上部の「フォーマット」ボタンを押すと、インデントやスペースを自動で整えてくれます。",
          content: (
            <>
              <h2>セクションの順序と省略ルール</h2>
              <p>
                セクションは以下の順番で書きます。省略可能なものもあります。
              </p>
              <CodeBlock
                language="kai-swimlane"
                code={`@kai-swimlane

/title/       ← 必須：図のタイトル
/page/        ← 任意：ヘッダー・フッター等
/option/      ← 任意：表示設定
/role/        ← 必須：ロール定義
/block/       ← 任意：ブロック定義
/prop/        ← 任意：プロップ定義
/line/        ← 必須：フロー記述

@end`}
              />
              <Callout variant="tip">
                最小構成は <code>/title/</code> + <code>/role/</code> + <code>/line/</code> の3セクションです。
                慣れてきたら <code>/option/</code> や <code>/block/</code> を追加していきましょう。
              </Callout>
              <Dialog speaker="teacher">
                必ず必要なのは <code>/title/</code>・<code>/role/</code>・<code>/line/</code> の3つです。残りは必要に応じて追加します。
              </Dialog>
              <Dialog speaker="b">
                最初はシンプルな3セクションから始められるんですね。安心しました。
              </Dialog>
              <Dialog speaker="a">
                フォーマットボタンで自動整形できると聞いたのですが？
              </Dialog>
              <Dialog speaker="teacher">
                はい。エディタ上部の「フォーマット」ボタンを押すと、インデントやスペースを自動で整えてくれます。積極的に活用してください。
              </Dialog>
            </>
          ),
        },
        {
          title: "テキストエディタの機能",
          plainText:
            "テキストエディタの主な機能\nフォーマット：インデント・空白を自動整形\nステータスバー：ロール数・ブロック数・プロップ数をリアルタイム表示\nタブ：複数のドキュメントをタブで管理（localStorageに保存）\n構文ダイアログ：全DSL文法のヘルプを表示\nテーマ切り替え：basic / washi / ink / mono の4テーマ\nエクスポート：SVG / PNG / .txt 形式でダウンロード\n先生：これらの機能を使いこなすと作業効率が大きく上がります。\nBちゃん：ステータスバーって何が分かるんですか？\n先生：何個ロールを定義したか、ブロックやプロップがいくつあるかが一目で確認できます。定義漏れを見つけるのに便利です。",
          content: (
            <>
              <h2>テキストエディタの主な機能</h2>
              <InfoPanel title="エディタ機能一覧" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>機能</th>
                      <th>説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td><strong>フォーマット</strong></td><td>インデント・空白を自動整形する</td></tr>
                    <tr><td><strong>ステータスバー</strong></td><td>ロール数・ブロック数・プロップ数をリアルタイム表示</td></tr>
                    <tr><td><strong>タブ</strong></td><td>複数のドキュメントをタブで管理（localStorage保存）</td></tr>
                    <tr><td><strong>構文ダイアログ</strong></td><td>全DSL文法のヘルプを表示</td></tr>
                    <tr><td><strong>テーマ切り替え</strong></td><td>basic / washi / ink / mono の4テーマ</td></tr>
                    <tr><td><strong>エクスポート</strong></td><td>SVG / PNG / .txt 形式でダウンロード</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                これらの機能を使いこなすと作業効率が大きく上がります。まずはフォーマットボタンを頻繁に押す習慣をつけましょう。
              </Dialog>
              <Dialog speaker="b">
                ステータスバーって何が分かるんですか？
              </Dialog>
              <Dialog speaker="teacher">
                何個ロールを定義したか、ブロックやプロップがいくつあるかが一目で確認できます。「定義したつもりが参照できない」という定義漏れを素早く見つけられます。
              </Dialog>
              <Dialog speaker="a">
                エクスポートはSVGとPNGの両方に対応しているんですね。Confluenceなどのドキュメントツールへの貼り付けに使えそうです。
              </Dialog>
              <Dialog speaker="teacher">
                まさにそういった用途に最適です。SVGはベクター形式なので拡大しても綺麗に表示されます。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：この章のポイントを振り返りましょう。Kai Swimlane のテキストエディタは https://kuisin.github.io/swimlane-app/ でブラウザから使えます。テキストを打つだけでスイムレーン図がリアルタイム生成されます。\nAくん：DSLというのは「スイムレーン図を描くためだけの専用言語」で、汎用言語より覚えることが少ない。全体構造は @kai-swimlane〜@end に囲まれた7つのセクションで成り立っている。\nBちゃん：必須は /title/ /role/ /line/ の3つだけで、あとは徐々に追加すればいい。フォーマットボタンで整形できるから、多少雑に書いてもOKというのも安心材料です。\n先生：その通りです。次の章からは各セクションを1つずつ丁寧に学んでいきます。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章のポイントを振り返りましょう。Kai Swimlane のテキストエディタはブラウザから使え、テキストを打つだけでスイムレーン図がリアルタイム生成されます。
              </Dialog>
              <Dialog speaker="a">
                DSLというのは「スイムレーン図を描くためだけの専用言語」で、汎用言語より覚えることが少ない。全体構造は <code>@kai-swimlane</code>〜<code>@end</code> に囲まれた7つのセクションで成り立っている、ということですね。
              </Dialog>
              <Dialog speaker="b">
                必須は <code>/title/</code>・<code>/role/</code>・<code>/line/</code> の3つだけで、あとは徐々に追加すればいい。フォーマットボタンで整形できるから、多少雑に書いてもOKというのも安心です。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。次の章からは各セクションを1つずつ丁寧に学んでいきます。まずは <code>/title/</code>・<code>/page/</code>・<code>/option/</code> から始めましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 @kai-swimlane と @end の役割は？→ DSLの開始と終了を示すラッパー\nQ2 省略できるセクションはどれか？→ /option/\n先生：このコースのスタートライン。次の章からは実際にDSLを書いて図を作っていきます。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                question={<strong><code>@kai-swimlane</code> と <code>@end</code> の役割として正しいのはどれ？</strong>}
                options={[
                  "コメントを書くための記号",
                  "DSLの開始と終了を示すラッパー（必須のペア）",
                  "セクションを区切るための区切り文字",
                ]}
                explanation="@kai-swimlane はDSL定義の始まり、@end は終わりを示します。この2行がないとエディタはテキストを図として認識しません。必ずセットで書きます。"
              />
              <Quiz
                answer={2}
                question={<strong>Kai Swimlane DSL の7つのセクションのうち、省略できるのはどれ？</strong>}
                options={[
                  "/title/（図のタイトル）",
                  "/line/（フロー記述）",
                  "/option/（表示設定）",
                ]}
                explanation="/option/ は表示設定のためのセクションで、省略すると既定値が使われます。/title/（タイトル）と /role/（ロール定義）と /line/（フロー記述）は必須です。"
              />
              <Dialog speaker="closing">
                スタートラインに立ちました。次の章からは実際にDSLを書いて図を作っていきます。まず書いて、フォーマットして、図を確認する — その繰り返しで自然に身につきます。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(IntroductionLesson);
