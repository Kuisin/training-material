import { renderLesson } from "../src/render-lesson";
import { Callout } from "../src/components/callout";
import { CodeBlock } from "../src/components/code-block";
import { Quiz } from "../src/components/quiz";
import { MermaidDiagram } from "../src/components/mermaid-diagram";
import { LessonMeta } from "../src/components/lesson-meta";

const chrome = {
  title: "プログラムを分かりやすくする",
  prevHref: "09-control-flow.html",
  nextHref: "11-document-posting.html",
  indexHref: "../index.html",
};

const slides = [
  {
    title: "概要",
    plainText: "プログラムを分かりやすくする\n処理をサブルーチンに分けると、なぜ分かりやすくなるのか。引数とスコープを学びます。\n⏱ 25分📶 初学者🏷 ABAP研修\nこの章で学ぶこと\n処理を「部品（サブルーチン）」に分ける理由\n部品へ値を渡す引数（USING / CHANGING）\n変数のスコープ（グローバル＝全体／ローカル＝その部品の中だけ）",
    content: (
      <>
        <hgroup>          <h1>プログラムを分かりやすくする</h1>          <p>処理をサブルーチンに分けると、なぜ分かりやすくなるのか。引数とスコープを学びます。</p></hgroup>
        <LessonMeta items={[{ icon: "⏱", text: "25分" }, { icon: "📶", text: "初学者" }, { icon: "🏷", text: "ABAP研修" }]} />
        <h3>この章で学ぶこと</h3>
        <ul>          <li>処理を「部品（サブルーチン）」に分ける理由</li>          <li>部品へ値を渡す引数（            <code>USING</code>/            <code>CHANGING</code>）</li>          <li>変数のスコープ（グローバル＝全体／ローカル＝その部品の中だけ）</li></ul>
      </>
    ),
  },
  {
    title: "手順書のたとえ",
    plainText: "長い手順書は「章」に分ける\n1000行の手順書がのっぺり続くと、どこに何が書いてあるか分かりません。「準備」「本作業」「片付け」と章に分ければ、探すのも直すのも楽になります。プログラムも同じです。\n先生：処理を意味のかたまり（部品）に分けて名前を付ける。これがサブルーチンの発想です。\nBちゃん：料理本も「下ごしらえ」「焼く」「盛り付け」に分かれてると作りやすいです。",
    content: (
      <>
        <h2>長い手順書は「章」に分ける</h2>
        <p>1000行の手順書がのっぺり続くと、どこに何が書いてあるか分かりません。「準備」「本作業」「片付け」と章に分ければ、探すのも直すのも楽になります。プログラムも同じです。</p>
        <Callout variant="note">
先生：処理を意味のかたまり（部品）に分けて名前を付ける。これがサブルーチンの発想です。
        </Callout>
        <Callout variant="warning">
Bちゃん：料理本も「下ごしらえ」「焼く」「盛り付け」に分かれてると作りやすいです。
        </Callout>
      </>
    ),
  },
  {
    title: "なぜ分けるか",
    plainText: "分けると、3つ良いことがある\n読みやすい：名前を見れば「何をする部分か」が分かる\n直しやすい：その部品だけ直せばよい（影響範囲が狭い）\n再利用できる：同じ処理を何度も呼べる\nAくん：関数に切り出すのと同じ発想ですね。重複を1か所にまとめられる。",
    content: (
      <>
        <h2>分けると、3つ良いことがある</h2>
        <ul>          <li>            <strong>読みやすい</strong>：名前を見れば「何をする部分か」が分かる</li>          <li>            <strong>直しやすい</strong>：その部品だけ直せばよい（影響範囲が狭い）</li>          <li>            <strong>再利用できる</strong>：同じ処理を何度も呼べる</li></ul>
        <Callout variant="tip">
Aくん：関数に切り出すのと同じ発想ですね。重複を1か所にまとめられる。
        </Callout>
      </>
    ),
  },
  {
    title: "FORMとPERFORM",
    plainText: "部品を作る FORM、呼ぶ PERFORM\nFORM で部品を定義し、PERFORM で呼び出します。値を渡すときは USING（渡すだけ）／CHANGING（渡して結果も受け取る）。\n<code>\" 呼び出し側\nPERFORM calc_tax USING lv_price CHANGING lv_tax.\n\" 部品の定義\nFORM calc_tax USING    p_price TYPE i\nCHANGING p_tax   TYPE i.\np_tax = p_price / 10.\nENDFORM.</code>\n先生：USING＝「材料を渡す」、CHANGING＝「材料を渡して、加工後を返してもらう」。役割で使い分けます。",
    content: (
      <>
        <h2>部品を作る FORM、呼ぶ PERFORM</h2>
        <p>          <code>FORM</code>で部品を定義し、          <code>PERFORM</code>で呼び出します。値を渡すときは          <code>USING</code>（渡すだけ）／          <code>CHANGING</code>（渡して結果も受け取る）。</p>
        <CodeBlock code={`<code>" 呼び出し側
PERFORM calc_tax USING lv_price CHANGING lv_tax.

" 部品の定義
FORM calc_tax USING    p_price TYPE i
              CHANGING p_tax   TYPE i.
  p_tax = p_price / 10.
ENDFORM.</code>`} />
        <Callout variant="note">
先生：
          <code>USING</code>
＝「材料を渡す」、
          <code>CHANGING</code>
＝「材料を渡して、加工後を返してもらう」。役割で使い分けます。
        </Callout>
      </>
    ),
  },
  {
    title: "変数スコープ",
    plainText: "グローバル と ローカル\nグローバル変数：プログラム全体のどこからでも見える（共有の掲示板）\nローカル変数：その部品の中だけで使える（手元のメモ）\nつまずき：何でもグローバルにすると、どこで値が変わったか追えなくなる。→ できるだけローカルに閉じ込めるのが安全です。\nAくん：スコープを狭く保つと、影響範囲が読めて安心ですね。",
    content: (
      <>
        <h2>グローバル と ローカル</h2>
        <ul>          <li>            <strong>グローバル変数</strong>：プログラム全体のどこからでも見える（共有の掲示板）</li>          <li>            <strong>ローカル変数</strong>：その部品の中だけで使える（手元のメモ）</li></ul>
        <Callout variant="warning">
つまずき：何でもグローバルにすると、どこで値が変わったか追えなくなる。→ できるだけローカルに閉じ込めるのが安全です。
        </Callout>
        <Callout variant="tip">
Aくん：スコープを狭く保つと、影響範囲が読めて安心ですね。
        </Callout>
      </>
    ),
  },
  {
    title: "図解：メインと部品",
    plainText: "図で見る：メインから部品を呼ぶ\nflowchart TD\nM[メイン処理] --> A[PERFORM 入力チェック]\nM --> B[PERFORM データ取得]\nM --> C[PERFORM 整形]\nM --> D[PERFORM 出力/ダウンロード]\nこの章のABAPキーワード：FORM / PERFORM / USING / CHANGING / グローバル・ローカル。",
    content: (
      <>
        <h2>図で見る：メインから部品を呼ぶ</h2>
        <MermaidDiagram chart={`flowchart TD
  M[メイン処理] --> A[PERFORM 入力チェック]
  M --> B[PERFORM データ取得]
  M --> C[PERFORM 整形]
  M --> D[PERFORM 出力/ダウンロード]`} />
        <Callout variant="tip">
この章のABAPキーワード：
          <code>FORM</code>
/
          <code>PERFORM</code>
/
          <code>USING</code>
/
          <code>CHANGING</code>
/ グローバル・ローカル。
        </Callout>
      </>
    ),
  },
  {
    title: "GUI・イベント・DL",
    plainText: "画面・イベント・ダウンロード処理も「部品」に\n実務では、画面の表示・ボタンが押されたときの処理（イベント）・ファイルのダウンロードなども、それぞれ部品に分けて整理します。機能が増えるほど、この“分ける力”が効いてきます。\n先生：今は「役割ごとに分ける」という発想だけ持てれば十分。詳しい書き方は使うときに覚えれば大丈夫です。",
    content: (
      <>
        <h2>画面・イベント・ダウンロード処理も「部品」に</h2>
        <p>実務では、画面の表示・ボタンが押されたときの処理（イベント）・ファイルのダウンロードなども、それぞれ部品に分けて整理します。機能が増えるほど、この“分ける力”が効いてきます。</p>
        <Callout variant="note">
先生：今は「役割ごとに分ける」という発想だけ持てれば十分。詳しい書き方は使うときに覚えれば大丈夫です。
        </Callout>
      </>
    ),
  },
  {
    title: "対話で整理",
    plainText: "対話で整理\n先生：この章の要点は、処理を役割単位で部品化して、読む人が流れを追える構造にすることです。FORMで定義しPERFORMで呼び、USINGとCHANGINGでデータの出入りを明確にします。\nAくん：引数の向きを明示すると副作用が見えやすくなりますね。さらにローカル変数中心にすれば、どこで値が変わるか追跡しやすく、修正時の影響範囲も限定できる。\nBちゃん：長いコードを章立てして読む感覚で、部品ごとに意味がまとまっていると安心です。後で機能追加するときも、どこを触るか判断しやすくなります。",
    content: (
      <>
        <h2>対話で整理</h2>
        <Callout variant="note">
先生：この章の要点は、処理を役割単位で部品化して、読む人が流れを追える構造にすることです。FORMで定義しPERFORMで呼び、USINGとCHANGINGでデータの出入りを明確にします。
        </Callout>
        <Callout variant="tip">
Aくん：引数の向きを明示すると副作用が見えやすくなりますね。さらにローカル変数中心にすれば、どこで値が変わるか追跡しやすく、修正時の影響範囲も限定できる。
        </Callout>
        <Callout variant="warning">
Bちゃん：長いコードを章立てして読む感覚で、部品ごとに意味がまとまっていると安心です。後で機能追加するときも、どこを触るか判断しやすくなります。
        </Callout>
      </>
    ),
  },
  {
    title: "確認テスト",
    plainText: "理解度チェック\n処理をサブルーチンに分ける利点として正しいのは？\nプログラムのファイルサイズが必ず小さくなる\n読みやすく・直しやすく・再利用しやすくなる\n実行が必ず速くなる\n部品に値を渡し、加工後の結果も受け取りたいときに使うのは？\nWRITE\nUSING\nCHANGING\n今日のひとこと：分けることは、未来の自分と仲間への親切。整理されたコードは、それだけで価値があります。",
    content: (
      <>
        <h2>理解度チェック</h2>
        <Quiz
          answer={1}
          explanation={"処理を部品に分けると「読みやすい・直しやすい・再利用できる」。どこを直せばよいか分かりやすくなります。結果として、仕様変更時に修正対象を局所化でき、レビューやテストの負担も軽減されます。"}
          question={<>            <strong>処理をサブルーチンに分ける利点として正しいのは？</strong></>}
          options={["プログラムのファイルサイズが必ず小さくなる", "読みやすく・直しやすく・再利用しやすくなる", "実行が必ず速くなる"]}
        />
        <Quiz
          answer={2}
          explanation={"USING は値を渡すだけ、CHANGING は渡して加工後の結果も受け取ります。どちらを使うかを明示しておくと、呼び出し側から見たデータ更新の有無が分かり、副作用を読み解きやすくなります。"}
          question={<>            <strong>部品に値を渡し、加工後の結果も受け取りたいときに使うのは？</strong></>}
          options={["WRITE", "USING", "CHANGING"]}
        />
        <Quiz
          answer={1}
          explanation={"ローカル変数はその部品内でのみ有効なため、値の変更範囲を閉じ込められます。グローバル変数を乱用すると、どこで値が変わったか追いにくくなり保守性が低下します。"}
          question={<>            <strong>保守性を高めるための変数設計として望ましいのは？</strong></>}
          options={["更新が必要な値はすべてグローバルに置く", "可能な限りローカル変数に閉じ込める", "変数名を短くしてスコープを気にしない"]}
        />
        <Callout variant="note">
今日のひとこと：分けることは、未来の自分と仲間への親切。整理されたコードは、それだけで価値があります。
        </Callout>
      </>
    ),
  }
];

renderLesson(chrome, slides);
