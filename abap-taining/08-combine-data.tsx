import { renderLesson } from "../src/render-lesson";
import { Callout } from "../src/components/callout";
import { Dialog } from "../src/components/dialog";
import { CodeBlock } from "../src/components/code-block";
import { Quiz } from "../src/components/quiz";
import { MermaidDiagram } from "../src/components/mermaid-diagram";
import { LessonMeta } from "../src/components/lesson-meta";

const chrome = {
  title: "複数データをまとめる",
  prevHref: "07-output-report.html",
  nextHref: "09-control-flow.html",
  indexHref: "../index.html",
};

const slides = [
  {
    title: "概要",
    plainText: "複数データをまとめる\nヘッダと明細を合わせて出力する。後で使いやすい形にデータを整える方法を学びます。\n⏱ 25分📶 初学者🏷 ABAP研修\nこの章で学ぶこと\n複数の内部テーブル（ヘッダ用・明細用）を使い分ける\nデータを移す・対応づける命令（MOVE / MOVE-CORRESPONDING）\n蓄える・消す命令（APPEND / CLEAR / REFRESH）",
    content: (
      <>
        <hgroup>          <h1>複数データをまとめる</h1>          <p>ヘッダと明細を合わせて出力する。後で使いやすい形にデータを整える方法を学びます。</p></hgroup>
        <LessonMeta items={[{ icon: "⏱", text: "25分" }, { icon: "📶", text: "初学者" }, { icon: "🏷", text: "ABAP研修" }]} />
        <h3>この章で学ぶこと</h3>
        <ul>          <li>複数の内部テーブル（ヘッダ用・明細用）を使い分ける</li>          <li>データを移す・対応づける命令（            <code>MOVE</code>/            <code>MOVE-CORRESPONDING</code>）</li>          <li>蓄える・消す命令（            <code>APPEND</code>/            <code>CLEAR</code>/            <code>REFRESH</code>）</li></ul>
      </>
    ),
  },
  {
    title: "領収書整理のたとえ",
    plainText: "バラバラの情報を、1枚の表にまとめる\n「お店の情報（ヘッダ）」と「買った品物（明細）」が別々にあると見づらいですよね。これらを突き合わせて、1つの見やすい一覧にするのが今回のテーマです。\n先生：会計でいうと、伝票ヘッダ（BKPF）と明細（BSEG）を組み合わせて、「1行で意味が分かる一覧」を作るイメージです。\nBちゃん：レシートと家計簿を見比べて、1行にまとめる作業に似てますね。",
    content: (
      <>
        <h2>バラバラの情報を、1枚の表にまとめる</h2>
        <p>「お店の情報（ヘッダ）」と「買った品物（明細）」が別々にあると見づらいですよね。これらを突き合わせて、1つの見やすい一覧にするのが今回のテーマです。</p>
        <Dialog speaker="teacher">
会計でいうと、伝票ヘッダ（BKPF）と明細（BSEG）を組み合わせて、「1行で意味が分かる一覧」を作るイメージです。
        </Dialog>
        <Dialog speaker="b">
レシートと家計簿を見比べて、1行にまとめる作業に似てますね。
        </Dialog>
      </>
    ),
  },
  {
    title: "複数テーブルの使い分け",
    plainText: "用途ごとに「棚」を分ける\n取得用と出力用で内部テーブルを分けると、頭が整理されます。\n<code>DATA lt_bkpf TYPE TABLE OF bkpf.   \" ヘッダ取得用\nDATA lt_bseg TYPE TABLE OF bseg.   \" 明細取得用\nDATA lt_out  TYPE TABLE OF ty_out. \" 出力用（まとめた形）</code>\nAくん：入力（生データ）と出力（整形後）の棚を分けるんですね。役割が混ざらなくて良い設計です。",
    content: (
      <>
        <h2>用途ごとに「棚」を分ける</h2>
        <p>取得用と出力用で内部テーブルを分けると、頭が整理されます。</p>
        <CodeBlock code={`<code>DATA lt_bkpf TYPE TABLE OF bkpf.   " ヘッダ取得用
DATA lt_bseg TYPE TABLE OF bseg.   " 明細取得用
DATA lt_out  TYPE TABLE OF ty_out. " 出力用（まとめた形）</code>`} />
        <Dialog speaker="a">
入力（生データ）と出力（整形後）の棚を分けるんですね。役割が混ざらなくて良い設計です。
        </Dialog>
      </>
    ),
  },
  {
    title: "MOVEと対応づけ",
    plainText: "値を移す：MOVE と MOVE-CORRESPONDING\nMOVE a TO b（または b = a）：1つの値を移す\nMOVE-CORRESPONDING：同じ名前の項目をまとめて移す（とても便利）\n<code>MOVE-CORRESPONDING ls_bkpf TO ls_out.  \" 同名項目を一気にコピー\nls_out-amount = ls_bseg-dmbtr.         \" 個別に1項目だけ移す</code>\n先生：MOVE-CORRESPONDING は「名前が一致する欄だけ自動で詰め替える」便利屋さん。手作業のコピーを減らせます。",
    content: (
      <>
        <h2>値を移す：MOVE と MOVE-CORRESPONDING</h2>
        <ul>          <li>            <code>MOVE a TO b</code>（または            <code>b = a</code>）：1つの値を移す</li>          <li>            <code>MOVE-CORRESPONDING</code>：            <strong>同じ名前の項目</strong>をまとめて移す（とても便利）</li></ul>
        <CodeBlock code={`<code>MOVE-CORRESPONDING ls_bkpf TO ls_out.  " 同名項目を一気にコピー
ls_out-amount = ls_bseg-dmbtr.         " 個別に1項目だけ移す</code>`} />
        <Dialog speaker="teacher">
<code>MOVE-CORRESPONDING</code>
は「名前が一致する欄だけ自動で詰め替える」便利屋さん。手作業のコピーを減らせます。
        </Dialog>
      </>
    ),
  },
  {
    title: "蓄える・消す",
    plainText: "蓄える・消す：APPEND / CLEAR / REFRESH\nAPPEND ls_out TO lt_out：作った1行を出力テーブルに追加\nCLEAR ls_out：作業領域（1行）を空にする\nREFRESH lt_out：内部テーブル（全行）を空にする\nつまずき：APPEND したあと CLEAR し忘れると、前の行の値が次に残ってしまう。→ 「1行作る → 追加 → クリア」をワンセットに。",
    content: (
      <>
        <h2>蓄える・消す：APPEND / CLEAR / REFRESH</h2>
        <ul>          <li>            <code>APPEND ls_out TO lt_out</code>：作った1行を出力テーブルに追加</li>          <li>            <code>CLEAR ls_out</code>：作業領域（1行）を空にする</li>          <li>            <code>REFRESH lt_out</code>：内部テーブル（全行）を空にする</li></ul>
        <Dialog speaker="stumble">
<code>APPEND</code>
したあと
          <code>CLEAR</code>
し忘れると、前の行の値が次に残ってしまう。→ 「1行作る → 追加 → クリア」をワンセットに。
        </Dialog>
      </>
    ),
  },
  {
    title: "図解：取得→対応付け→蓄積",
    plainText: "図で見る：まとめる流れ\nflowchart LR\nA[ヘッダ取得] --> C[1行を組み立て]\nB[明細取得] --> C\nC --> D[APPEND で蓄積]\nD --> E[CLEAR して次の行へ]\nE --> C\nこの章のABAPキーワード：MOVE / MOVE-CORRESPONDING / APPEND / CLEAR / REFRESH。",
    content: (
      <>
        <h2>図で見る：まとめる流れ</h2>
        <MermaidDiagram chart={`flowchart LR
  A[ヘッダ取得] --> C[1行を組み立て]
  B[明細取得] --> C
  C --> D[APPEND で蓄積]
  D --> E[CLEAR して次の行へ]
  E --> C`} />
        <Callout variant="tip">
この章のABAPキーワード：
          <code>MOVE</code>
/
          <code>MOVE-CORRESPONDING</code>
/
          <code>APPEND</code>
/
          <code>CLEAR</code>
/
          <code>REFRESH</code>
。
        </Callout>
      </>
    ),
  },
  {
    title: "ミニ演習",
    plainText: "確認質問＆ミニ演習\n先生の問い：「1行を組み立てて出力テーブルに足したあと、次の行に進む前にやるべきことは？」\nAくん：作業領域を CLEAR します。前の値が残ると混ざるので。\nBちゃん：使った皿を洗ってから次の料理、みたいな感じですね。\n先生：その通り！「組み立て→APPEND→CLEAR」を口ぐせにすれば、混ざる事故はほぼ防げます。",
    content: (
      <>
        <h2>確認質問＆ミニ演習</h2>
        <p>          <strong>先生の問い：</strong>「1行を組み立てて出力テーブルに足したあと、次の行に進む前にやるべきことは？」</p>
        <Dialog speaker="a">
作業領域を
          <code>CLEAR</code>
します。前の値が残ると混ざるので。
        </Dialog>
        <Dialog speaker="b">
使った皿を洗ってから次の料理、みたいな感じですね。
        </Dialog>
        <Dialog speaker="teacher">
その通り！「組み立て→APPEND→CLEAR」を口ぐせにすれば、混ざる事故はほぼ防げます。
        </Dialog>
      </>
    ),
  },
  {
    title: "対話で整理",
    plainText: "対話で整理\n先生：この章は、ヘッダと明細をただ並べるのではなく「後続で使える出力構造に組み立てる」ことが主題です。取得用テーブルと出力用テーブルを分け、1行ずつ作ってAPPENDする流れを崩さないことが重要です。\nAくん：MOVE-CORRESPONDINGで共通項目をまとめて移し、差分項目を個別代入する設計が効率的ですね。さらにAPPEND後にCLEARすることで、前行の残値混入を防げる。\nBちゃん：毎回「組み立てる→追加する→片付ける」の順にするとミスが減ると実感しました。料理で使った道具を次の工程前に戻す感覚に近いです。",
    content: (
      <>
        <h2>対話で整理</h2>
        <Dialog speaker="teacher">
この章は、ヘッダと明細をただ並べるのではなく「後続で使える出力構造に組み立てる」ことが主題です。取得用テーブルと出力用テーブルを分け、1行ずつ作ってAPPENDする流れを崩さないことが重要です。
        </Dialog>
        <Dialog speaker="a">
MOVE-CORRESPONDINGで共通項目をまとめて移し、差分項目を個別代入する設計が効率的ですね。さらにAPPEND後にCLEARすることで、前行の残値混入を防げる。
        </Dialog>
        <Dialog speaker="b">
毎回「組み立てる→追加する→片付ける」の順にするとミスが減ると実感しました。料理で使った道具を次の工程前に戻す感覚に近いです。
        </Dialog>
      </>
    ),
  },
  {
    title: "確認テスト",
    plainText: "理解度チェック\n同じ名前の項目をまとめて移すのに便利なのは？\nAPPEND\nMOVE-CORRESPONDING\nREFRESH\n1行をAPPENDした後、次の行の前に作業領域を空にする命令は？\nMOVE\nULINE\nCLEAR\n今日のひとこと：「組み立て→追加→クリア」。このリズムが身につけば、データ整形はもう得意分野です。",
    content: (
      <>
        <h2>理解度チェック</h2>
        <Quiz
          answer={1}
          explanation={"MOVE-CORRESPONDING は、両者で名前が一致する項目だけをまとめてコピーします。手作業で1項目ずつ代入するより記述漏れを減らせるため、ヘッダ情報の引き継ぎなどで特に有効です。"}
          question={<>            <strong>同じ名前の項目をまとめて移すのに便利なのは？</strong></>}
          options={["APPEND", "MOVE-CORRESPONDING", "REFRESH"]}
        />
        <Quiz
          answer={2}
          explanation={"CLEAR は作業領域（1行）を空にします。APPEND の後にこれを忘れると前の値が残ります。REFRESH はテーブル全体を空にする命令であり、用途を取り違えると必要データまで消してしまう点に注意が必要です。"}
          question={<>            <strong>1行をAPPENDした後、次の行の前に作業領域を空にする命令は？</strong></>}
          options={["MOVE", "ULINE", "CLEAR"]}
        />
        <Quiz
          answer={0}
          explanation={"取得用テーブルと出力用テーブルを分離すると、元データの保持と表示用整形を独立して管理できます。役割を分けることで、仕様変更時にも影響範囲を限定しやすく保守性が上がります。"}
          question={<>            <strong>内部テーブルを「取得用」と「出力用」に分ける主な利点は？</strong></>}
          options={["役割が分離され、整形処理を安全に管理できる", "必ず実行速度が2倍になる", "CLEARやAPPENDが不要になる"]}
        />
        <Dialog speaker="closing">
「組み立て→追加→クリア」。このリズムが身につけば、データ整形はもう得意分野です。
        </Dialog>
      </>
    ),
  }
];

renderLesson(chrome, slides);
