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
  title: "データを扱う基本",
  meta: "初学者 · 25分",
};

export default function InternalTablesLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-taining", "05-internal-tables", lessonMeta.title)}
      slides={[
  {
    title: "概要",
    plainText: "データを扱う基本\n内部テーブル＝行の集まり、作業領域＝いま触っている1行。プログラムの中でのデータの持ち方を学びます。\n⏱ 25分📶 初学者🏷 ABAP研修\nこの章で学ぶこと\n内部テーブル（複数行）と作業領域（1行）の関係\n並べ替え・1件ずつ処理・1件取り出し（SORT / LOOP / READ TABLE）\n「内部テーブルはDBそのものではない」という大事な区別",
    content: (
      <>
        <hgroup>          <h1>データを扱う基本</h1>          <p>内部テーブル＝行の集まり、作業領域＝いま触っている1行。プログラムの中でのデータの持ち方を学びます。</p></hgroup>
        <LessonMeta items={[{ icon: "⏱", text: "25分" }, { icon: "📶", text: "初学者" }, { icon: "🏷", text: "ABAP研修" }]} />
        <h3>この章で学ぶこと</h3>
        <ul>          <li>内部テーブル（複数行）と作業領域（1行）の関係</li>          <li>並べ替え・1件ずつ処理・1件取り出し（            <code>SORT</code>/            <code>LOOP</code>/            <code>READ TABLE</code>）</li>          <li>「内部テーブルはDBそのものではない」という大事な区別</li></ul>
      </>
    ),
  },
  {
    title: "棚と1枚のたとえ",
    plainText: "内部テーブル＝棚、作業領域＝手に取った1枚\nたくさんの書類が並んだ「棚」が内部テーブル。そこから1枚だけ手に取って机に置いたものが「作業領域（1行）」です。書き込みや確認は、机の上の1枚に対して行います。\n先生：プログラムは「棚全体」を一度に触るのではなく、「1枚ずつ机に出して処理する」のが基本です。\nBちゃん：棚の本を1冊ずつ取り出して読む、みたいなイメージなら分かります。",
    content: (
      <>
        <h2>内部テーブル＝棚、作業領域＝手に取った1枚</h2>
        <p>たくさんの書類が並んだ「棚」が内部テーブル。そこから1枚だけ手に取って机に置いたものが「作業領域（1行）」です。書き込みや確認は、机の上の1枚に対して行います。</p>
        <Dialog speaker="teacher">
プログラムは「棚全体」を一度に触るのではなく、「1枚ずつ机に出して処理する」のが基本です。
        </Dialog>
        <Dialog speaker="b">
棚の本を1冊ずつ取り出して読む、みたいなイメージなら分かります。
        </Dialog>
      </>
    ),
  },
  {
    title: "1行と複数行",
    plainText: "1件の箱と、複数件の表\nABAPでは、両方を用意します。\n<code>\" 1行ぶんの作業領域（机の上の1枚）\nDATA ls_row  TYPE bkpf.\n\" 複数行の内部テーブル（棚）\nDATA lt_tab  TYPE TABLE OF bkpf.</code>\nAくん：ls_ が単一行(structure)、lt_ がテーブル、という命名の慣習なんですね。",
    content: (
      <>
        <h2>1件の箱と、複数件の表</h2>
        <p>ABAPでは、両方を用意します。</p>
        <CodeBlock code={`" 1行ぶんの作業領域（机の上の1枚）
DATA ls_row  TYPE bkpf.
" 複数行の内部テーブル（棚）
DATA lt_tab  TYPE TABLE OF bkpf.`} />
        <Dialog speaker="a">
<code>ls_</code>
が単一行(structure)、
          <code>lt_</code>
がテーブル、という命名の慣習なんですね。
        </Dialog>
      </>
    ),
  },
  {
    title: "主要な操作",
    plainText: "並べ替え・1件ずつ・1件取り出し\n内部テーブルに対するよく使う操作は3つです。\n<code>SORT lt_tab BY budat.            \" 日付で並べ替え\nLOOP AT lt_tab INTO ls_row.      \" 1行ずつ机に出して処理\nWRITE: / ls_row-belnr.\nENDLOOP.\nREAD TABLE lt_tab INTO ls_row    \" 条件に合う1件を取り出す\nWITH KEY belnr = '0000000001'.</code>\n先生：LOOP＝「1行ずつ順番に」、READ TABLE＝「狙った1行を1発で」。目的で使い分けます。",
    content: (
      <>
        <h2>並べ替え・1件ずつ・1件取り出し</h2>
        <p>内部テーブルに対するよく使う操作は3つです。</p>
        <CodeBlock code={`SORT lt_tab BY budat.            " 日付で並べ替え

LOOP AT lt_tab INTO ls_row.      " 1行ずつ机に出して処理
  WRITE: / ls_row-belnr.
ENDLOOP.

READ TABLE lt_tab INTO ls_row    " 条件に合う1件を取り出す
  WITH KEY belnr = '0000000001'.`} />
        <Dialog speaker="teacher">
<code>LOOP</code>
＝「1行ずつ順番に」、
          <code>READ TABLE</code>
＝「狙った1行を1発で」。目的で使い分けます。
        </Dialog>
      </>
    ),
  },
  {
    title: "図解：棚と机",
    plainText: "図で見る：棚（テーブル）と机（作業領域）\nflowchart LR\nT[\"内部テーブル<br/>(複数行の棚)\"] -->|LOOP / READ TABLE| W[\"作業領域<br/>(1行=机の上)\"]\nW -->|加工してから| O[出力 や 蓄積]\nこの章のABAPキーワード：TYPE TABLE OF / SORT / LOOP ... INTO / READ TABLE ... WITH KEY。",
    content: (
      <>
        <h2>図で見る：棚（テーブル）と机（作業領域）</h2>
        <MermaidDiagram chart={`flowchart LR
  T["内部テーブル<br/>(複数行の棚)"] -->|LOOP / READ TABLE| W["作業領域<br/>(1行=机の上)"]
  W -->|加工してから| O[出力 や 蓄積]`} />
        <Callout variant="tip">
この章のABAPキーワード：
          <code>TYPE TABLE OF</code>
/
          <code>SORT</code>
/
          <code>LOOP ... INTO</code>
/
          <code>READ TABLE ... WITH KEY</code>
。
        </Callout>
      </>
    ),
  },
  {
    title: "Excelとの異同",
    plainText: "Excelの表と似て、ちょっと違う\n「行と列の表」という点はExcelに似ています。でも内部テーブルはプログラムが動いている間だけ、メモリ上にある一時的な表です。実行が終われば消えます。\nつまずき：「内部テーブル＝データベース」ではありません。DBは倉庫（永続）、内部テーブルは作業机の上（一時的）です。\nつまずき：「型そのもの」と混同しがち。TYPE は“形”の定義、内部テーブルは“その形に入った実データ”です。",
    content: (
      <>
        <h2>Excelの表と似て、ちょっと違う</h2>
        <p>「行と列の表」という点はExcelに似ています。でも内部テーブルは          <strong>プログラムが動いている間だけ、メモリ上にある一時的な表</strong>です。実行が終われば消えます。</p>
        <Dialog speaker="stumble">
「内部テーブル＝データベース」ではありません。DBは倉庫（永続）、内部テーブルは作業机の上（一時的）です。
        </Dialog>
        <Dialog speaker="stumble">
「型そのもの」と混同しがち。
          <code>TYPE</code>
は“形”の定義、内部テーブルは“その形に入った実データ”です。
        </Dialog>
      </>
    ),
  },
  {
    title: "ミニ演習",
    plainText: "確認質問＆ミニ演習\n先生の問い：「棚にある全書類を、日付順に1枚ずつ確認したい」。どの操作を、どの順で使う？\nAくん：まず SORT で日付順に並べ、LOOP で1行ずつ回す、です。\nBちゃん：先に並べ替えてからめくる、なら家でもやってます。安心しました。\n先生：正解です。「並べる→1件ずつ」は今後あらゆる場面で使う黄金パターン。覚えておくとずっと楽になります。",
    content: (
      <>
        <h2>確認質問＆ミニ演習</h2>
        <p>          <strong>先生の問い：</strong>「棚にある全書類を、日付順に1枚ずつ確認したい」。どの操作を、どの順で使う？</p>
        <Dialog speaker="a">
まず
          <code>SORT</code>
で日付順に並べ、
          <code>LOOP</code>
で1行ずつ回す、です。
        </Dialog>
        <Dialog speaker="b">
先に並べ替えてからめくる、なら家でもやってます。安心しました。
        </Dialog>
        <Dialog speaker="teacher">
正解です。「並べる→1件ずつ」は今後あらゆる場面で使う黄金パターン。覚えておくとずっと楽になります。
        </Dialog>
      </>
    ),
  },
  {
    title: "対話で整理",
    plainText: "対話で整理\n先生：この章は「棚（内部テーブル）と机（作業領域）」の役割を混ぜないことがポイントです。複数行データを保持する場所と、いま処理する1行を分けることで、操作の意図が明確になります。\nAくん：処理パターンとしては、SORTで順序を整えてLOOPで全件処理、必要ならREAD TABLEで特定行を参照する流れですね。アクセス目的ごとに命令を選ぶ整理が重要だと分かりました。\nBちゃん：Excelの表に似ていても、内部テーブルは実行中だけの一時データだと理解できました。DBと同じと思い込まないように、毎回「これは作業机の上か」を確認します。",
    content: (
      <>
        <h2>対話で整理</h2>
        <Dialog speaker="teacher">
この章は「棚（内部テーブル）と机（作業領域）」の役割を混ぜないことがポイントです。複数行データを保持する場所と、いま処理する1行を分けることで、操作の意図が明確になります。
        </Dialog>
        <Dialog speaker="a">
処理パターンとしては、SORTで順序を整えてLOOPで全件処理、必要ならREAD TABLEで特定行を参照する流れですね。アクセス目的ごとに命令を選ぶ整理が重要だと分かりました。
        </Dialog>
        <Dialog speaker="b">
Excelの表に似ていても、内部テーブルは実行中だけの一時データだと理解できました。DBと同じと思い込まないように、毎回「これは作業机の上か」を確認します。
        </Dialog>
      </>
    ),
  },
  {
    title: "確認テスト",
    plainText: "理解度チェック\n「作業領域」が表すのは？\n複数行の集まり全体\nいま処理している1行\nデータベースの実体\n内部テーブルについて正しいのは？\nデータベースと同じで、ずっと保存される\nデータの「型」の定義そのものである\n実行中だけ存在する一時的な表である\n今日のひとこと：「棚と机」のイメージさえあれば、データ操作はもう怖くありません。",
    content: (
      <>
        <h2>理解度チェック</h2>
        <Quiz
          answer={1}
          explanation={"作業領域は「いま処理している1行」。内部テーブルは複数行の集まりです。LOOPで1行ずつ作業領域へ取り出して処理する前提を理解すると、データの流れを追いやすくなります。"}
          question={<>            <strong>「作業領域」が表すのは？</strong></>}
          options={["複数行の集まり全体", "いま処理している1行", "データベースの実体"]}
        />
        <Quiz
          answer={2}
          explanation={"内部テーブルはプログラム実行中だけメモリに存在する一時的な表。DB（永続的な倉庫）とは別物です。この区別を持つと、どこで更新が永続化されるかを誤解せずに設計できます。"}
          question={<>            <strong>内部テーブルについて正しいのは？</strong></>}
          options={["データベースと同じで、ずっと保存される", "データの「型」の定義そのものである", "実行中だけ存在する一時的な表である"]}
        />
        <Quiz
          answer={1}
          explanation={"READ TABLEは条件に合う特定行を狙って取り出す命令で、全件を順に処理するLOOPとは役割が異なります。要件が「1件検索」なのか「全件処理」なのかを先に分けると、無駄な処理を避けられます。"}
          question={<>            <strong>「伝票番号が一致する1件だけ確認したい」場面で最も適切なのは？</strong></>}
          options={["LOOPで全件を必ず走査する", "READ TABLE ... WITH KEY を使う", "REFRESHで内部テーブルを空にしてから探す"]}
        />
        <Dialog speaker="closing">
「棚と机」のイメージさえあれば、データ操作はもう怖くありません。
        </Dialog>
      </>
    ),
  }
]}
    />
  );
}

mountLesson(InternalTablesLesson);
