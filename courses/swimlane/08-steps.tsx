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
  title: "第3章 — ステップ記述（/line/）の基本",
  meta: "初学者 · 25分",
};

export default function StepsLesson() {
  return (
    <Lesson
      chrome={lessonChrome("swimlane", "08-steps", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "第3章 — ステップ記述（/line/）の基本\n図のフロー本体を書く /line/ セクションの全メタデータを学びます。\n⏱ 25分 / 📶 初学者 / 🏷 Kai Swimlane\nこの章で学ぶこと\n・[roleId: テキスト] <blockId> の基本構文\n・id と label の違いと使い分け\n・desc（左ガター説明）の書き方とインライン装飾\n・remark と remark-desc（右ガター備考）\n・skip（ステップ番号なし）の使い方\n・arrow（コネクタースタイル）の指定\n・props（ドキュメントチップの付与）\n・// と *** のコメント構文\n・インライン装飾（太字・斜体・取り消し線・エスケープ）",
          content: (
            <>
              <hgroup>
                <h1>第3章 — ステップ記述（/line/）の基本</h1>
                <p>図のフロー本体を書く <code>/line/</code> セクションの全メタデータを学びます。</p>
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
                <li><code>[roleId: テキスト] &lt;blockId&gt;</code> の基本構文</li>
                <li><code>id</code> と <code>label</code> の違いと使い分け</li>
                <li><code>desc</code>（左ガター説明）の書き方とインライン装飾</li>
                <li><code>remark</code> と <code>remark-desc</code>（右ガター備考）</li>
                <li><code>skip</code>（ステップ番号なし）の使い方</li>
                <li><code>arrow</code>（コネクタースタイル）の指定</li>
                <li><code>props</code>（ドキュメントチップの付与）</li>
                <li><code>//</code> と <code>***</code> のコメント構文</li>
                <li>インライン装飾（太字・斜体・取り消し線・エスケープ）</li>
              </ul>
            </>
          ),
        },
        {
          title: "ステップの基本構文",
          plainText:
            "ステップの基本構文\n/line/ セクション内のステップは [roleId: テキスト] で書きます。任意でブロックIDを <blockId> と後置できます。\n先生：角括弧の中にロールIDとコロンを書き、その後にステップのテキスト（ブロック上に表示される名前）を書きます。\nAくん：ロールIDは /role/ で定義したIDと完全一致する必要があるんですよね？\n先生：はい。IDが一致しないとステップがどのカラムにも属さずエラーになります。ステータスバーのロール数で確認できます。\nBちゃん：ブロックIDも同様ですか？\n先生：はい。/block/ で定義したIDと一致させる必要があります。定義のないブロックIDを使うとエラーになります。",
          content: (
            <>
              <h2>ステップの基本構文</h2>
              <p>
                <code>/line/</code> セクション内のステップは <code>[roleId: テキスト]</code> で書きます。
                任意でブロックIDを <code>&lt;blockId&gt;</code> と後置できます。
              </p>
              <Figure
                src="image/03-step-anatomy.webp"
                alt="Kai Swimlaneのステップ行の構造を示す解説図。[sales: 注文受付] <start> というコード行が示され、角括弧部分が「ロールIDとステップテキスト」、山括弧部分が「ブロックID（任意）」であることを矢印で指示している。"
                caption="ステップ行の構造 — [roleId: テキスト] <blockId（任意）>"
                kind="diagram"
              />
              <CodeBlock
                language="kai-swimlane"
                code={`/line/
// ブロックIDなし（デフォルトスタイル）
[sales: 注文受付]

// ブロックIDあり（カスタムスタイル適用）
[sales: 開始] <start>

// 複数ロールを使う場合
[accounting: 請求処理]
[system: データ登録] <process>`}
              />
              <Dialog speaker="teacher">
                角括弧の中にロールIDとコロンを書き、その後にステップのテキスト（ブロック上に表示される名前）を書きます。
              </Dialog>
              <Dialog speaker="a">
                ロールIDは <code>/role/</code> で定義したIDと完全一致する必要があるんですよね？
              </Dialog>
              <Dialog speaker="teacher">
                はい。IDが一致しないとエラーになります。ステータスバーのロール数を確認しながら書きましょう。
              </Dialog>
              <Dialog speaker="b">
                ブロックIDも同様ですか？
              </Dialog>
              <Dialog speaker="teacher">
                はい。<code>/block/</code> で定義したIDと一致させる必要があります。定義のないブロックIDを使うとエラーになります。
              </Dialog>
            </>
          ),
        },
        {
          title: "id と label",
          plainText:
            "ステップのメタデータ — id と label\nid はステップに一意の識別子を付けます。主にマージ（合流）のターゲット指定に使います。label は左ガターに表示されるステップ名です。ステップ本文のテキストとは別に設定できます。\n先生：id は機能的な識別子で、label は視覚的な表示名です。用途が異なります。\nAくん：id はマージ先として参照されるんですね。第3章では merge の構文は扱いますか？\n先生：マージの構文は上級トピックのため今回は扱いませんが、id を設定しておくことで後から追加できます。\nBちゃん：label はガターを表示したときだけ意味があるんですか？\n先生：その通りです。show-left-gutter: true; のときだけ label の内容が見えます。",
          content: (
            <>
              <h2>ステップのメタデータ — id と label</h2>
              <p>
                <code>id</code> はステップの一意識別子（機能的）、<code>label</code> は左ガターに表示されるステップ名（視覚的）です。
              </p>
              <CodeBlock
                language="kai-swimlane"
                code={`/line/
[sales: 注文受付] <start>
id: step-001;
label: 受注ステップ;

[accounting: 請求書作成]
id: step-002;
label: 請求処理;
desc: 受注データをもとに請求書を作成する;

[system: データ登録]
label: DB登録;`}
              />
              <Dialog speaker="teacher">
                <code>id</code> は機能的な識別子で、<code>label</code> は視覚的な表示名です。用途が異なります。
              </Dialog>
              <Dialog speaker="a">
                <code>id</code> はマージ先として参照されるんですね。あとから合流ロジックを追加するときのための「留め置き」として設定しておける。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。先に <code>id</code> を設定しておくと、後から合流処理を追加するときにスムーズです。
              </Dialog>
              <Dialog speaker="b">
                <code>label</code> はガターを表示したときだけ意味があるんですか？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。<code>show-left-gutter: true;</code> のときだけ <code>label</code> の内容が見えます。ガターを使う予定がなければ省略してもOKです。
              </Dialog>
            </>
          ),
        },
        {
          title: "desc — 左ガター説明",
          plainText:
            "ステップのメタデータ — desc\ndesc は左ガターに表示されるステップの説明文です。1行ならセミコロン終わりで書けます。複数行にする場合は ``` フェンスで囲みます。インライン装飾（**太字** *斜体* ~~取り消し~~）も使えます。\n先生：desc はガターの説明文なので、show-left-gutter: true; のときのみ表示されます。\nAくん：インライン装飾は Markdown と同じ記法ですね。\n先生：ほぼ同じです。**太字**、*斜体*、***太字+斜体***、~~取り消し線~~ が使えます。\nBちゃん：長い説明文はフェンスで改行できるんですね。",
          content: (
            <>
              <h2>ステップのメタデータ — desc（左ガター説明）</h2>
              <p>
                <code>desc</code> は左ガターに表示されるステップの説明文です。インライン装飾も使えます。
              </p>
              <CodeBlock
                language="kai-swimlane"
                code={`/line/
[sales: 注文受付]
desc: 顧客からの注文を受け付けて内容を確認する;

[accounting: 請求書作成]
desc: \`\`\`
受注データをもとに請求書を作成する。
**金額は必ず2名で確認すること。**
\`\`\`;

[system: データ登録]
desc: *自動処理* — 手動操作は不要;`}
              />
              <Callout variant="tip">
                <strong>インライン装飾の例：</strong>
                <ul>
                  <li><code>**テキスト**</code> → 太字</li>
                  <li><code>*テキスト*</code> → 斜体</li>
                  <li><code>***テキスト***</code> → 太字＋斜体</li>
                  <li><code>~~テキスト~~</code> → 取り消し線</li>
                </ul>
              </Callout>
              <Dialog speaker="teacher">
                <code>desc</code> はガターの説明文なので、<code>show-left-gutter: true;</code> のときのみ表示されます。
              </Dialog>
              <Dialog speaker="a">
                インライン装飾は Markdown と同じ記法ですね。覚えやすい。
              </Dialog>
              <Dialog speaker="teacher">
                ほぼ同じです。<code>**太字**</code>、<code>*斜体*</code>、<code>***太字+斜体***</code>、<code>~~取り消し線~~</code> が使えます。
              </Dialog>
              <Dialog speaker="b">
                長い説明文はフェンスで改行できる。ガイドラインや注意事項を複数行で書けるのは便利ですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "remark と remark-desc",
          plainText:
            "ステップのメタデータ — remark と remark-desc\nremark は右ガターに表示される備考テキストです。remark-desc は remark の続き（追記）として書けます。どちらも複数行フェンスとインライン装飾が使えます。右ガターは1つでも remark を持つステップがある場合にのみ表示されます。\n先生：remark は担当者へのメモや、エラー時の対応手順などを書くのに向いています。\nAくん：right ガターは全ステップで表示されるわけではなく、remark を持つステップがある場合にだけ列が出るんですね。\n先生：その通りです。remark が1件もなければ右ガター列は非表示のままです。\nBちゃん：remark-desc は remark と何が違うんですか？\n先生：remark が主の備考、remark-desc は同じステップへの追記です。見た目は続きとして表示されます。",
          content: (
            <>
              <h2>ステップのメタデータ — remark と remark-desc</h2>
              <p>
                <code>remark</code> は右ガターの備考、<code>remark-desc</code> はその追記です。
                1件でも <code>remark</code> があれば右ガター列が表示されます。
              </p>
              <Figure
                src="image/03-gutter-columns.webp"
                alt="Kai Swimlaneで左ガターと右ガターが両方表示されているレンダリング結果。左ガターにはlabel（ステップ名）とdesc（説明文）が表示され、右ガターにはremark（備考テキスト）が表示されている。中央にはスイムレーン図本体が配置されている。"
                caption="左ガター（label/desc）と右ガター（remark）の位置関係"
                kind="diagram"
              />
              <CodeBlock
                language="kai-swimlane"
                code={`/line/
[sales: 注文受付]
remark: 電話またはメールで受付;
remark-desc: **FAX受付は廃止済み**;

[accounting: 請求書作成]
remark: \`\`\`
請求書はPDF形式で発行。
送付先は注文書記載の住所。
\`\`\`;`}
              />
              <Dialog speaker="teacher">
                <code>remark</code> は担当者へのメモや、エラー時の対応手順などを書くのに向いています。
              </Dialog>
              <Dialog speaker="a">
                右ガターは全ステップで表示されるわけではなく、<code>remark</code> を持つステップがある場合にだけ列が出るんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。<code>remark</code> が1件もなければ右ガター列は非表示のままです。
              </Dialog>
              <Dialog speaker="b">
                <code>remark-desc</code> は <code>remark</code> と何が違うんですか？
              </Dialog>
              <Dialog speaker="teacher">
                <code>remark</code> が主の備考、<code>remark-desc</code> は同じステップへの追記です。見た目は続きとして表示されます。
              </Dialog>
            </>
          ),
        },
        {
          title: "skip",
          plainText:
            "ステップのメタデータ — skip\nskip; を書くとステップに番号が付きません。見出しステップや区切りとして使いたい場合に使います。\n先生：通常のステップには自動で番号（1, 2, 3...）が付きます。skip; を付けると番号がスキップされ、その番号は次のステップに使われます。\nAくん：セクション区切りのような使い方ができるんですね。例えば「準備フェーズ」という見出しステップを挟んで、その次から本番の番号が始まる。\n先生：まさにそういった使い方が典型的です。\nBちゃん：skip したステップはフローには表示されますか？\n先生：はい。スタイルは通常通り表示されますが、ステップ番号だけが付きません。",
          content: (
            <>
              <h2>ステップのメタデータ — skip</h2>
              <p>
                <code>skip;</code> を書くとそのステップにはステップ番号が割り当てられません。
                見出し・フェーズ区切りとして使います。
              </p>
              <CodeBlock
                language="kai-swimlane"
                code={`/line/
// 番号付きステップ（1番）
[sales: 事前確認]

// 番号なし区切りステップ
[sales: ▼ 受注処理フェーズ] <skip-label>
skip;

// 次の番号付きステップ（2番）
[sales: 注文受付]
[accounting: 請求書作成]`}
              />
              <Dialog speaker="teacher">
                通常のステップには自動で番号（1, 2, 3...）が付きます。<code>skip;</code> を付けると番号がスキップされ、その番号は次のステップに使われます。
              </Dialog>
              <Dialog speaker="a">
                セクション区切りのような使い方ができるんですね。「準備フェーズ」「本処理フェーズ」という見出しを挟んで、本番の番号体系を維持できる。
              </Dialog>
              <Dialog speaker="teacher">
                まさにそういった使い方が典型的です。フローが長い場合にフェーズを視覚的に区切るのに便利です。
              </Dialog>
              <Dialog speaker="b">
                <code>skip</code> したステップはフロー図に表示されますか？
              </Dialog>
              <Dialog speaker="teacher">
                はい。スタイルは通常通り表示されますが、ステップ番号だけが付きません。
              </Dialog>
            </>
          ),
        },
        {
          title: "arrow",
          plainText:
            "ステップのメタデータ — arrow\narrow: solid|dashed|dotted; でそのステップの次のコネクター（矢印線）のスタイルを指定します。デフォルトは solid（実線）です。\n先生：arrow はそのステップから出る矢印線のスタイルを決めます。dashed は点線、dotted は短い点線です。\nAくん：条件分岐の後の「どちらでもない場合」に dashed を使うのが一般的ですか？\n先生：はい。オプション的な流れや、非推奨のパスに dashed を使うことが多いです。\nBちゃん：矢印のスタイルを変えるだけで、「重要なフロー」と「例外フロー」が視覚的に区別できるんですね。",
          content: (
            <>
              <h2>ステップのメタデータ — arrow（コネクタースタイル）</h2>
              <p>
                <code>arrow:</code> でそのステップから出るコネクター（矢印線）のスタイルを指定します。
                デフォルトは <code>solid</code>（実線）です。
              </p>
              <Figure
                src="image/03-arrow-styles.webp"
                alt="Kai Swimlaneで3種類のarrowスタイル（solid=実線、dashed=破線、dotted=短い点線）を比較したレンダリング例。3つのステップが縦に並び、それぞれ異なるスタイルの矢印で接続されている。"
                caption="arrow の3スタイル — solid（実線）/ dashed（破線）/ dotted（点線）"
                kind="diagram"
              />
              <CodeBlock
                language="kai-swimlane"
                code={`/line/
[sales: 注文受付]
arrow: solid;

[sales: 承認判断] <gate>
arrow: dashed;

[sales: 例外処理]
arrow: dotted;

[sales: 完了] <end>`}
              />
              <Dialog speaker="teacher">
                <code>arrow</code> はそのステップから出る矢印線のスタイルを決めます。<code>dashed</code> は破線、<code>dotted</code> は点線です。
              </Dialog>
              <Dialog speaker="a">
                条件分岐の後の「例外フロー」に <code>dashed</code> を使うのが一般的ですか？
              </Dialog>
              <Dialog speaker="teacher">
                はい。オプション的な流れや非推奨のパスに <code>dashed</code>、まれなケースに <code>dotted</code> を使うことが多いです。
              </Dialog>
              <Dialog speaker="b">
                矢印のスタイルを変えるだけで、「主フロー」と「例外フロー」が視覚的に区別できるんですね。図の読みやすさが上がりそうです。
              </Dialog>
            </>
          ),
        },
        {
          title: "props",
          plainText:
            "ステップのメタデータ — props\nprops: ID; でステップにドキュメントチップを付けます。複数のプロップを付ける場合は props: A,B,C; とカンマ区切りで書きます。\n先生：ここで参照する ID は /prop/ セクションで定義したプロップIDです。ID が一致しないとチップは表示されません。\nAくん：props の順番はチップの表示順に影響しますか？\n先生：はい。書いた順にチップが表示されます。\nBちゃん：同じプロップを複数のステップに付けるとき、毎回 props: RQ; と書けばいいんですか？\n先生：その通りです。/prop/ で一度定義すれば何度でも参照できます。",
          content: (
            <>
              <h2>ステップのメタデータ — props（チップの付与）</h2>
              <p>
                <code>props: ID;</code> でステップにドキュメントチップを付けます。
                複数付ける場合はカンマ区切りで書きます。
              </p>
              <CodeBlock
                language="kai-swimlane"
                code={`/prop/
<RQ>
label: 申請書;
side: right;

<AP>
label: 承認書;
side: right;

<INV>
label: 請求書;
side: left;

/line/
[sales: 申請書提出]
props: RQ;

[manager: 承認処理]
props: RQ,AP;

[accounting: 請求書発行]
props: INV;`}
              />
              <Dialog speaker="teacher">
                ここで参照するIDは <code>/prop/</code> セクションで定義したプロップIDです。IDが一致しないとチップは表示されません。
              </Dialog>
              <Dialog speaker="a">
                <code>props</code> の順番はチップの表示順に影響しますか？
              </Dialog>
              <Dialog speaker="teacher">
                はい。書いた順にチップが表示されます。重要なドキュメントを先に書くと見やすくなります。
              </Dialog>
              <Dialog speaker="b">
                同じプロップを複数のステップに付けるとき、毎回 <code>props: RQ;</code> と書けばいいんですか？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。<code>/prop/</code> で一度定義すれば何度でも参照できます。これが定義と参照を分離するメリットです。
              </Dialog>
            </>
          ),
        },
        {
          title: "コメント",
          plainText:
            "コメント構文 — // と ***\n// をステップ行の先頭に書くとコメントになります。/line/ セクション内では次のステップ行に付属する形でコメントが保持されます。*** を行の先頭に書くとどこでも完全に無視されます。\n先生：// コメントは /line/ 内では特別で、フォーマットしても残ります。次のステップ行に付属する形で並んでいます。\nAくん：// は Git の差分管理でなぜここを変えたかの理由を書くのにも使えますね。\n先生：その通りです。開発チームでのコラボレーションに有用です。\nBちゃん：*** と // の違いは何ですか？\n先生：*** は完全に無視されます。/line/ の外でも内でもコメントアウトできます。一方 // は /line/ の外に書くと無視されます。",
          content: (
            <>
              <h2>コメント構文 — <code>//</code> と <code>***</code></h2>
              <p>
                2種類のコメント構文があります。用途が異なります。
              </p>
              <CodeBlock
                language="kai-swimlane"
                code={`@kai-swimlane

/title/
受注フロー

*** ここはどこでも無視される（/line/ の外でも使える）
*** テーマ: 2024年度版

/line/
// 受注ステップ開始（このコメントは次の行に付属）
[sales: 注文受付]

// 経理処理
[accounting: 請求書作成]

*** 一時的に無効化したいステップ
*** [system: 旧システム登録]

[system: 新システム登録]

@end`}
              />
              <Callout variant="warning">
                <code>//</code> コメントは <code>/line/</code> セクションの<strong>外に書くと無視</strong>されます。
                <code>/line/</code> の外にメモを残したい場合は <code>***</code> を使いましょう。
              </Callout>
              <Dialog speaker="teacher">
                <code>//</code> コメントは <code>/line/</code> 内では特別で、フォーマットしても残ります。次のステップ行に付属する形で並んでいます。
              </Dialog>
              <Dialog speaker="a">
                <code>//</code> は Git の差分管理でなぜここを変えたかの理由を書くのにも使えますね。レビューしやすくなる。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。開発チームでのコラボレーションや将来の自分へのメモとして有用です。
              </Dialog>
              <Dialog speaker="b">
                <code>***</code> と <code>//</code> の違いは何ですか？
              </Dialog>
              <Dialog speaker="teacher">
                <code>***</code> は完全に無視され、<code>/line/</code> の外でも内でも使えます。<code>//</code> は <code>/line/</code> の中でのみ機能します。一時的にステップを無効化したいときは <code>***</code> が便利です。
              </Dialog>
            </>
          ),
        },
        {
          title: "インライン装飾まとめ",
          plainText:
            "インライン装飾まとめ\ndesc と remark では Markdown に似たインライン装飾が使えます。**太字** *斜体* ***太字+斜体*** ~~取り消し線~~ とバックスラッシュエスケープが利用可能です。\n先生：インライン装飾は desc と remark（および remark-desc）の中でのみ有効です。ステップのテキスト（角括弧内）には使えません。\nAくん：バックスラッシュエスケープはどういうときに使いますか？\n先生：** や ~~ などの記号をそのまま表示したいときにバックスラッシュを前に付けます。\nBちゃん：記号の組み合わせで4種類の装飾ができるんですね。シンプルで覚えやすいです。",
          content: (
            <>
              <h2>インライン装飾まとめ</h2>
              <p>
                <code>desc</code>・<code>remark</code>・<code>remark-desc</code> の中でインライン装飾が使えます。
              </p>
              <CodeBlock
                language="kai-swimlane"
                code={`/line/
[sales: 注文受付]
desc: \`\`\`
**重要：** 注文書の*原本*を必ず保管すること。
***緊急の場合*** はマネージャーに即報告。
~~旧フォームは使用禁止~~（2024年4月廃止）。
\`\`\`;`}
              />
              <InfoPanel title="インライン装飾の一覧" variant="reference">
                <table>
                  <thead>
                    <tr><th>記法</th><th>効果</th><th>使用例</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><code>**テキスト**</code></td><td>太字</td><td><code>**重要:**</code></td></tr>
                    <tr><td><code>*テキスト*</code></td><td>斜体</td><td><code>*注意事項*</code></td></tr>
                    <tr><td><code>***テキスト***</code></td><td>太字＋斜体</td><td><code>***必須***</code></td></tr>
                    <tr><td><code>~~テキスト~~</code></td><td>取り消し線</td><td><code>~~廃止~~</code></td></tr>
                    <tr><td><code>\*</code></td><td>エスケープ（記号をそのまま表示）</td><td><code>\*</code> → *</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="note">
                インライン装飾は <code>desc</code>・<code>remark</code>・<code>remark-desc</code> の中でのみ有効です。
                ステップのテキスト（<code>[role: ここ]</code>）には使えません。
              </Callout>
              <Dialog speaker="teacher">
                インライン装飾は <code>desc</code> と <code>remark</code> の中でのみ有効です。ステップのテキスト（角括弧内）には使えません。
              </Dialog>
              <Dialog speaker="a">
                バックスラッシュエスケープはどういうときに使いますか？
              </Dialog>
              <Dialog speaker="teacher">
                <code>**</code> や <code>~~</code> などの記号をそのまま表示したいときにバックスラッシュを前に付けます。例えば <code>\*</code> と書けば * がそのまま表示されます。
              </Dialog>
              <Dialog speaker="b">
                記号の組み合わせで4種類の装飾ができるんですね。Markdown を少し知っていれば覚えやすいです。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：第3章のポイントを整理しましょう。/line/ セクションはDSLの本体です。[roleId: テキスト] <blockId> でステップを書き、その下にメタデータをセミコロン区切りで付けます。\nAくん：主なメタデータは id（識別子）、label（左ガター名）、desc（左ガター説明）、remark（右ガター備考）、skip（番号なし）、arrow（矢印スタイル）、props（チップ付与）の7種類。コメントは // と *** の2種類。\nBちゃん：インライン装飾は **太字** *斜体* ***太字+斜体*** ~~取り消し~~ の4種類で、エスケープもバックスラッシュ1つ。desc と remark の中だけで使える。これで一通りのフロー図が書けそうです！\n先生：その通りです。このコースの4章をすべて学んだので、Kai Swimlane のテキストエディタで本格的なスイムレーン図が書けるようになりました。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                第3章のポイントを整理しましょう。<code>/line/</code> セクションはDSLの本体です。<code>[roleId: テキスト] &lt;blockId&gt;</code> でステップを書き、その下にメタデータをセミコロン区切りで付けます。
              </Dialog>
              <Dialog speaker="a">
                主なメタデータは <code>id</code>（識別子）、<code>label</code>（左ガター名）、<code>desc</code>（左ガター説明）、<code>remark</code>（右ガター備考）、<code>skip</code>（番号なし）、<code>arrow</code>（矢印スタイル）、<code>props</code>（チップ付与）の7種類。コメントは <code>//</code> と <code>***</code> の2種類ですね。
              </Dialog>
              <Dialog speaker="b">
                インライン装飾は <code>**太字**</code>・<code>*斜体*</code>・<code>***太字+斜体***</code>・<code>~~取り消し~~</code> の4種類で、エスケープはバックスラッシュ1つ。<code>desc</code> と <code>remark</code> の中だけで使える。これで一通りのフロー図が書けそうです！
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。このコースの4章をすべて学んだので、Kai Swimlane のテキストエディタで本格的なスイムレーン図を書けるようになりました。実際に書いてみることが一番の近道です。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 ステップに番号を付けないためのメタデータは？→ skip;\nQ2 インライン装飾が使えるのはどこか？→ desc と remark の中\n先生：これでKai Swimlane テキストエディタ入門コースが完了です。実際に図を書いて練習しましょう。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={2}
                question={<strong>ステップにステップ番号を付けないようにするメタデータはどれ？</strong>}
                options={[
                  "arrow: none;",
                  "id: skip;",
                  "skip;",
                ]}
                explanation="skip; をステップのメタデータ行として書くと、そのステップには番号が付きません。arrow は矢印スタイル、id はステップ識別子のためのプロパティです。"
              />
              <Quiz
                answer={1}
                question={<strong>インライン装飾（**太字** など）が使える場所はどこ？</strong>}
                options={[
                  "ステップのテキスト（[roleId: ここ]）",
                  "desc と remark の中",
                  "/title/ セクション",
                ]}
                explanation="インライン装飾は desc・remark・remark-desc の中でのみ有効です。ステップのテキスト（角括弧内）や /title/ セクションには使えません。"
              />
              <Dialog speaker="closing">
                Kai Swimlane テキストエディタ入門コースが完了です。<code>@kai-swimlane</code> から <code>@end</code> まで、7つのセクションすべての使い方を習得しました。まずはシンプルな3セクション構成から書き始め、徐々に機能を追加していきましょう。実際に書くことが一番の近道です。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(StepsLesson);
