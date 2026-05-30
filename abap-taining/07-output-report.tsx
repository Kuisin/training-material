import { renderLesson } from "../src/render-lesson";
import { Callout } from "../src/components/callout";
import { CodeBlock } from "../src/components/code-block";
import { Quiz } from "../src/components/quiz";
import { MermaidDiagram } from "../src/components/mermaid-diagram";
import { LessonMeta } from "../src/components/lesson-meta";

const chrome = {
  title: "出力をつくる",
  prevHref: "06-select-from-db.html",
  nextHref: "08-combine-data.html",
  indexHref: "../index.html",
};

const slides = [
  {
    title: "概要",
    plainText: "出力をつくる\n帳票＝整えて見せること。データを取るだけでは不十分、という話を学びます。\n⏱ 20分📶 初学者🏷 ABAP研修\nこの章で学ぶこと\n帳票（レポート出力）は「見やすく整える」工程だということ\n出力を整える命令（WRITE / ULINE / SKIP / NEW-LINE / NEW-PAGE）\n「見やすさ」はユーザーにとっての価値だ、という視点",
    content: (
      <>
        <hgroup>          <h1>出力をつくる</h1>          <p>帳票＝整えて見せること。データを取るだけでは不十分、という話を学びます。</p></hgroup>
        <LessonMeta items={[{ icon: "⏱", text: "20分" }, { icon: "📶", text: "初学者" }, { icon: "🏷", text: "ABAP研修" }]} />
        <h3>この章で学ぶこと</h3>
        <ul>          <li>帳票（レポート出力）は「見やすく整える」工程だということ</li>          <li>出力を整える命令（            <code>WRITE</code>/            <code>ULINE</code>/            <code>SKIP</code>/            <code>NEW-LINE</code>/            <code>NEW-PAGE</code>）</li>          <li>「見やすさ」はユーザーにとっての価値だ、という視点</li></ul>
      </>
    ),
  },
  {
    title: "見にくい議事録のたとえ",
    plainText: "同じ内容でも、整え方で伝わり方が変わる\n改行も見出しもない、文字がびっしりの議事録は読む気が失せますよね。逆に、見出し・区切り線・適度な空きがあると、ぐっと読みやすくなります。帳票も同じです。\n先生：取得したデータをそのまま並べるだけでは「読めるけど、つらい」状態。整えて初めて“使える資料”になります。\nBちゃん：レシピでも、材料と手順が分かれてると作りやすいです。あれと同じですね。",
    content: (
      <>
        <h2>同じ内容でも、整え方で伝わり方が変わる</h2>
        <p>改行も見出しもない、文字がびっしりの議事録は読む気が失せますよね。逆に、見出し・区切り線・適度な空きがあると、ぐっと読みやすくなります。帳票も同じです。</p>
        <Callout variant="note">
先生：取得したデータをそのまま並べるだけでは「読めるけど、つらい」状態。整えて初めて“使える資料”になります。
        </Callout>
        <Callout variant="warning">
Bちゃん：レシピでも、材料と手順が分かれてると作りやすいです。あれと同じですね。
        </Callout>
      </>
    ),
  },
  {
    title: "整える命令たち",
    plainText: "見た目を整える基本命令\nWRITE：文字や値を書き出す（/ で改行つき）\nULINE：横の区切り線を引く\nSKIP：空行を入れる\nNEW-LINE：次の行へ移る\nNEW-PAGE：改ページする\nAくん：文章でいう「改行」「罫線」「空行」「改ページ」に1対1で対応しているんですね。",
    content: (
      <>
        <h2>見た目を整える基本命令</h2>
        <ul>          <li>            <code>WRITE</code>：文字や値を書き出す（            <code>/</code>で改行つき）</li>          <li>            <code>ULINE</code>：横の区切り線を引く</li>          <li>            <code>SKIP</code>：空行を入れる</li>          <li>            <code>NEW-LINE</code>：次の行へ移る</li>          <li>            <code>NEW-PAGE</code>：改ページする</li></ul>
        <Callout variant="tip">
Aくん：文章でいう「改行」「罫線」「空行」「改ページ」に1対1で対応しているんですね。
        </Callout>
      </>
    ),
  },
  {
    title: "出力のコード例",
    plainText: "見出し → 区切り → 明細\n<code>WRITE: / '会計伝票一覧'.\nULINE.\nWRITE: / '伝票番号', 20 '日付', 40 '金額'.\nULINE.\nLOOP AT lt_out INTO ls_out.\nWRITE: / ls_out-belnr, 20 ls_out-budat, 40 ls_out-amount.\nENDLOOP.</code>\n先生：数字（20, 40）は「何桁目から書くか」という位置指定。列をそろえると一気に表らしくなります。",
    content: (
      <>
        <h2>見出し → 区切り → 明細</h2>
        <CodeBlock code={`<code>WRITE: / '会計伝票一覧'.
ULINE.
WRITE: / '伝票番号', 20 '日付', 40 '金額'.
ULINE.
LOOP AT lt_out INTO ls_out.
  WRITE: / ls_out-belnr, 20 ls_out-budat, 40 ls_out-amount.
ENDLOOP.</code>`} />
        <Callout variant="note">
先生：数字（20, 40）は「何桁目から書くか」という位置指定。列をそろえると一気に表らしくなります。
        </Callout>
      </>
    ),
  },
  {
    title: "図解：取得から帳票へ",
    plainText: "図で見る：取得しただけ → 整えて帳票に\nflowchart LR\nA[\"取得データ<br/>(並べただけ)\"] --> B[見出しをつける]\nB --> C[区切り線・桁そろえ]\nC --> D[\"読みやすい帳票\"]\nこの章のABAPキーワード：WRITE / ULINE / SKIP / NEW-LINE / NEW-PAGE。",
    content: (
      <>
        <h2>図で見る：取得しただけ → 整えて帳票に</h2>
        <MermaidDiagram chart={`flowchart LR
  A["取得データ<br/>(並べただけ)"] --> B[見出しをつける]
  B --> C[区切り線・桁そろえ]
  C --> D["読みやすい帳票"]`} />
        <Callout variant="tip">
この章のABAPキーワード：
          <code>WRITE</code>
/
          <code>ULINE</code>
/
          <code>SKIP</code>
/
          <code>NEW-LINE</code>
/
          <code>NEW-PAGE</code>
。
        </Callout>
      </>
    ),
  },
  {
    title: "見やすさは価値",
    plainText: "見やすさ＝ユーザーへの思いやり\n帳票を見るのは「人」です。少し整えるだけで、相手の確認作業が何倍も楽になります。これは技術というより“気づかい”の部分です。\nつまずき：「データが合っていればOK」と思いがち。でも見づらい帳票は、現場では「使えない」と言われてしまいます。\nBちゃん：正しいだけじゃなく、優しい資料にしたいですね。",
    content: (
      <>
        <h2>見やすさ＝ユーザーへの思いやり</h2>
        <p>帳票を見るのは「人」です。少し整えるだけで、相手の確認作業が何倍も楽になります。これは技術というより“気づかい”の部分です。</p>
        <Callout variant="warning">
つまずき：「データが合っていればOK」と思いがち。でも見づらい帳票は、現場では「使えない」と言われてしまいます。
        </Callout>
        <Callout variant="warning">
Bちゃん：正しいだけじゃなく、優しい資料にしたいですね。
        </Callout>
      </>
    ),
  },
  {
    title: "確認テスト",
    plainText: "理解度チェック\n横の区切り線を引く命令はどれ？\nSKIP\nNEW-PAGE\nULINE\n出力（帳票）を整える一番の理由は？\n見る人の確認作業を楽にするため（ユーザー価値）\nプログラムを速くするため\nデータを暗号化するため\n今日のひとこと：ひと手間の整えが、相手の「ありがとう」につながります。",
    content: (
      <>
        <h2>理解度チェック</h2>
        <Quiz
          answer={2}
          explanation={"ULINE は横の区切り線を引く命令です。SKIP は空行、NEW-PAGE は改ページ。"}
          question={<>            <strong>横の区切り線を引く命令はどれ？</strong></>}
          options={["SKIP", "NEW-PAGE", "ULINE"]}
        />
        <Quiz
          answer={0}
          explanation={"データが正しくても、見づらい帳票は現場で使われません。見やすさはユーザーにとっての価値です。"}
          question={<>            <strong>出力（帳票）を整える一番の理由は？</strong></>}
          options={["見る人の確認作業を楽にするため（ユーザー価値）", "プログラムを速くするため", "データを暗号化するため"]}
        />
        <Callout variant="note">
今日のひとこと：ひと手間の整えが、相手の「ありがとう」につながります。
        </Callout>
      </>
    ),
  }
];

renderLesson(chrome, slides);
