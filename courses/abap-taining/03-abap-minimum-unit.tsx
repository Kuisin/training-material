import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CodeBlock,
  Quiz,
  MermaidDiagram,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "はじめてのレポートプログラム",
  meta: "初学者 · 20分",
};

export default function AbapMinimumUnitLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-taining", "03-abap-minimum-unit", lessonMeta.title)}
      slides={[
  {
    title: "概要",
    plainText: "はじめてのレポートプログラム\nABAPの最小単位「レポートプログラム」を作り、変数・定数・コメントの意味を知ります。\n⏱ 20分📶 初学者🏷 ABAP研修\nこの章で学ぶこと\nレポートプログラムとは何か（作る→実行する→結果を見る）\n変数と定数の違い、それぞれ「何のために」あるのか\nコメントを書く理由（未来の自分と仲間のため）",
    content: (
      <>
        <hgroup>          <h1>はじめてのレポートプログラム</h1>          <p>ABAPの最小単位「レポートプログラム」を作り、変数・定数・コメントの意味を知ります。</p></hgroup>
        <LessonMeta items={[{ icon: "⏱", text: "20分" }, { icon: "📶", text: "初学者" }, { icon: "🏷", text: "ABAP研修" }]} />
        <h3>この章で学ぶこと</h3>
        <ul>          <li>レポートプログラムとは何か（作る→実行する→結果を見る）</li>          <li>変数と定数の違い、それぞれ「何のために」あるのか</li>          <li>コメントを書く理由（未来の自分と仲間のため）</li></ul>
      </>
    ),
  },
  {
    title: "レポートとは",
    plainText: "レポートプログラム＝「自動の作業手順書」\nレポートプログラムは、コンピュータに「この順番でこれをやって」と書いた手順書です。書いて実行すると、上から順に処理して、結果を画面に出してくれます。\n先生：まずは「画面に文字を出す」だけの小さなプログラムから始めます。最初の一歩はこれで十分です。\nBちゃん：手順書なら家電の説明書みたいなものですね。順番に書けばいいなら、できそう。",
    content: (
      <>
        <h2>レポートプログラム＝「自動の作業手順書」</h2>
        <p>レポートプログラムは、コンピュータに「この順番でこれをやって」と書いた手順書です。書いて実行すると、上から順に処理して、結果を画面に出してくれます。</p>
        <Dialog speaker="teacher">
まずは「画面に文字を出す」だけの小さなプログラムから始めます。最初の一歩はこれで十分です。
        </Dialog>
        <Dialog speaker="b">
手順書なら家電の説明書みたいなものですね。順番に書けばいいなら、できそう。
        </Dialog>
      </>
    ),
  },
  {
    title: "作る→実行→結果",
    plainText: "3つのステップで動かす\nABAP開発は、いつもこのリズムです。\n作る：エディタにプログラムを書く\n実行する：実行ボタンを押す\n結果を見る：画面に出た結果を確認する\nflowchart LR\nA[作る] --> B[実行する]\nB --> C[結果を見る]\nC -->|直す| A",
    content: (
      <>
        <h2>3つのステップで動かす</h2>
        <p>ABAP開発は、いつもこのリズムです。</p>
        <ol>          <li>            <strong>作る</strong>：エディタにプログラムを書く</li>          <li>            <strong>実行する</strong>：実行ボタンを押す</li>          <li>            <strong>結果を見る</strong>：画面に出た結果を確認する</li></ol>
        <MermaidDiagram chart={`flowchart LR
  A[作る] --> B[実行する]
  B --> C[結果を見る]
  C -->|直す| A`} />
      </>
    ),
  },
  {
    title: "最小のコード",
    plainText: "いちばん小さなプログラム\n最初の行 REPORT は「これはレポートプログラムです」という宣言。WRITE は「画面に書く」命令です。\n<code>REPORT z_hello.\nWRITE 'こんにちは、ABAP'.</code>\nAくん：REPORT がプログラムの名札、WRITE が出力命令、と読めば素直ですね。\n先生：英語の意味そのまま。write＝書く、です。記号に身構えず「英単語の命令文」として読みましょう。",
    content: (
      <>
        <h2>いちばん小さなプログラム</h2>
        <p>最初の行          <code>REPORT</code>は「これはレポートプログラムです」という宣言。          <code>WRITE</code>は「画面に書く」命令です。</p>
        <CodeBlock code={`REPORT z_hello.

WRITE 'こんにちは、ABAP'.`} />
        <Dialog speaker="a">
<code>REPORT</code>
がプログラムの名札、
          <code>WRITE</code>
が出力命令、と読めば素直ですね。
        </Dialog>
        <Dialog speaker="teacher">
英語の意味そのまま。write＝書く、です。記号に身構えず「英単語の命令文」として読みましょう。
        </Dialog>
      </>
    ),
  },
  {
    title: "変数",
    plainText: "変数 ＝ 中身を入れ替えられる箱\nDATA で「箱」を用意します。箱には名前を付け、あとから値を入れたり替えたりできます。\n<code>DATA lv_name TYPE string.\nlv_name = '田中'.\nWRITE lv_name.</code>\nAくん（理系向け）：数学の文字 x のようなもの。x にいろいろな値を代入できる、あの感覚です。\nBちゃん（生活の比喩）：ラベルを貼った“タッパー”。中身は入れ替えられるけど、容器の名前は同じ、という感じ。",
    content: (
      <>
        <h2>変数 ＝ 中身を入れ替えられる箱</h2>
        <p>          <code>DATA</code>で「箱」を用意します。箱には名前を付け、あとから値を入れたり替えたりできます。</p>
        <CodeBlock code={`DATA lv_name TYPE string.
lv_name = '田中'.
WRITE lv_name.`} />
        <Dialog speaker="a">
数学の文字 x のようなもの。x にいろいろな値を代入できる、あの感覚です。
        </Dialog>
        <Dialog speaker="b">
ラベルを貼った“タッパー”。中身は入れ替えられるけど、容器の名前は同じ、という感じ。
        </Dialog>
      </>
    ),
  },
  {
    title: "定数",
    plainText: "定数 ＝ 中身を変えない箱\nCONSTANTS は、一度決めたら変えない値です。「消費税率」「会社コード」のように、途中で勝手に変わると困るものに使います。\n<code>CONSTANTS lc_tax_rate TYPE p DECIMALS 2 VALUE '0.10'.</code>\n先生：「変えていい箱（変数）」と「変えない箱（定数）」を区別すると、事故が減ります。固定の値に名前を付けておくと、読みやすさも上がります。",
    content: (
      <>
        <h2>定数 ＝ 中身を変えない箱</h2>
        <p>          <code>CONSTANTS</code>は、一度決めたら変えない値です。「消費税率」「会社コード」のように、途中で勝手に変わると困るものに使います。</p>
        <CodeBlock code={`CONSTANTS lc_tax_rate TYPE p DECIMALS 2 VALUE '0.10'.`} />
        <Dialog speaker="teacher">
「変えていい箱（変数）」と「変えない箱（定数）」を区別すると、事故が減ります。固定の値に名前を付けておくと、読みやすさも上がります。
        </Dialog>
      </>
    ),
  },
  {
    title: "コメント",
    plainText: "コメント ＝ 未来の自分へのメモ\n行の先頭に *、または \" を書くと、その部分は「実行されないメモ」になります。何のための処理かを残しておくためのものです。\n<code>* 税込金額を計算する（社内ルール: 端数切り捨て）\nDATA lv_total TYPE i.\nlv_total = lv_price + lv_tax.   \" ここで合算</code>\nつまずき：「自分が書いたコードは覚えている」と思いがち。でも3ヶ月後の自分は他人同然です。理由をメモしておきましょう。\nこの章のABAPキーワード：REPORT / DATA / CONSTANTS / WRITE / コメント（*・\"）。",
    content: (
      <>
        <h2>コメント ＝ 未来の自分へのメモ</h2>
        <p>行の先頭に          <code>*</code>、または          <code>"</code>を書くと、その部分は「実行されないメモ」になります。何のための処理かを残しておくためのものです。</p>
        <CodeBlock code={`* 税込金額を計算する（社内ルール: 端数切り捨て）
DATA lv_total TYPE i.
lv_total = lv_price + lv_tax.   " ここで合算`} />
        <Dialog speaker="stumble">
「自分が書いたコードは覚えている」と思いがち。でも3ヶ月後の自分は他人同然です。理由をメモしておきましょう。
        </Dialog>
        <Callout variant="tip">
この章のABAPキーワード：
          <code>REPORT</code>
/
          <code>DATA</code>
/
          <code>CONSTANTS</code>
/
          <code>WRITE</code>
/ コメント（
          <code>*</code>
・
          <code>"</code>
）。
        </Callout>
      </>
    ),
  },
  {
    title: "対話で整理",
    plainText: "対話で整理\n先生：この章の到達点は、最小のレポートを「読んで意図を説明できる」状態になることです。REPORTで始まり、DATAやCONSTANTSで値を準備し、WRITEで結果を出す流れが基本になります。\nAくん：変数は途中で値が変わる箱、定数は固定値の箱、コメントは処理意図を残すメモという役割分担ですね。単語の意味を押さえるとコードが命令文として読めます。\nBちゃん：英語が怖かったけど、箱にラベルを貼る感覚で考えると理解しやすいです。特にコメントが「未来の自分への手紙」だと思うと、書く意味がちゃんとあります。",
    content: (
      <>
        <h2>対話で整理</h2>
        <Dialog speaker="teacher">
この章の到達点は、最小のレポートを「読んで意図を説明できる」状態になることです。REPORTで始まり、DATAやCONSTANTSで値を準備し、WRITEで結果を出す流れが基本になります。
        </Dialog>
        <Dialog speaker="a">
変数は途中で値が変わる箱、定数は固定値の箱、コメントは処理意図を残すメモという役割分担ですね。単語の意味を押さえるとコードが命令文として読めます。
        </Dialog>
        <Dialog speaker="b">
英語が怖かったけど、箱にラベルを貼る感覚で考えると理解しやすいです。特にコメントが「未来の自分への手紙」だと思うと、書く意味がちゃんとあります。
        </Dialog>
      </>
    ),
  },
  {
    title: "確認テスト",
    plainText: "理解度チェック\n「途中で中身を入れ替えられる箱」はどれ？\nCONSTANTS（定数）\nDATA（変数）\nREPORT\nコメントを書く一番の目的は？\nプログラムを速くするため\n画面にきれいに表示するため\n処理の意図を後で読む人に伝えるため\n今日のひとこと：最初のプログラムは数行で十分。動いた瞬間の「できた！」を大切に。",
    content: (
      <>
        <h2>理解度チェック</h2>
        <Quiz
          answer={1}
          explanation={"変数(DATA)は途中で中身を入れ替えられる箱。定数(CONSTANTS)は決めたら変えない値です。用途を分けることで、意図せず重要値を書き換える事故を防ぎ、コードの読み手にも意図が伝わりやすくなります。"}
          question={<>            <strong>「途中で中身を入れ替えられる箱」はどれ？</strong></>}
          options={["CONSTANTS（定数）", "DATA（変数）", "REPORT"]}
        />
        <Quiz
          answer={2}
          explanation={"コメントは実行されないメモ。処理の意図を未来の自分や仲間に伝えるために書きます。特に業務ルールや判断理由を補足しておくと、修正時に「なぜこの実装か」を再調査する手間を減らせます。"}
          question={<>            <strong>コメントを書く一番の目的は？</strong></>}
          options={["プログラムを速くするため", "画面にきれいに表示するため", "処理の意図を後で読む人に伝えるため"]}
        />
        <Quiz
          answer={0}
          explanation={"REPORTはプログラムの種別を宣言する入口で、実行可能なレポートとして扱う前提になります。最初の宣言が明確だと、後続のDATA定義やWRITE出力も一貫した文脈で読めます。"}
          question={<>            <strong>最小レポートコードで `REPORT` を最初に書く主な理由は？</strong></>}
          options={["レポートプログラムであることを宣言するため", "画面の色を変更するため", "変数を自動的に初期化するため"]}
        />
        <Dialog speaker="closing">
最初のプログラムは数行で十分。動いた瞬間の「できた！」を大切に。
        </Dialog>
      </>
    ),
  }
]}
    />
  );
}

mountLesson(AbapMinimumUnitLesson);
