import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CodeBlock,
  Quiz,
  MermaidDiagram,
  Figure,
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
          plainText:
            "データを扱う基本\n内部テーブル＝行の集まり、作業領域＝いま触っている1行。プログラムの中でのデータの持ち方を学びます。\n⏱ 25分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・内部テーブル（複数行）と作業領域（1行）の役割の違い\n・作る/並べる/1件ずつ処理/1件取り出す/追加・初期化（DATA・SORT・LOOP・READ TABLE・APPEND/CLEAR/REFRESH）\n・「内部テーブルはDBそのものではない」という大事な区別",
          content: (
            <>
              <hgroup>
                <h1>データを扱う基本</h1>
                <p>
                  内部テーブル＝行の集まり、作業領域＝いま触っている1行。プログラムの中での「データの持ち方」を学びます。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "25分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>内部テーブル（複数行）と作業領域（1行）の役割の違い</li>
                <li>
                  作る・並べる・1件ずつ処理・1件取り出す・追加/初期化（
                  <code>DATA</code> / <code>SORT</code> / <code>LOOP</code> /{" "}
                  <code>READ TABLE</code> / <code>APPEND</code>・
                  <code>CLEAR</code>・<code>REFRESH</code>）
                </li>
                <li>「内部テーブルはDBそのものではない」という大事な区別</li>
              </ul>
              <Dialog speaker="teacher">
                前章まではデータを「取ってくる」話でした。この章は、取ってきたデータを<strong>プログラムの中でどう持ち、どう触るか</strong>です。ここが分かると、以降の章が一気に楽になります。
              </Dialog>
            </>
          ),
        },
        {
          title: "たとえ：棚と机",
          plainText:
            "内部テーブル＝棚、作業領域＝手に取った1枚\nたくさんの書類が並んだ棚が内部テーブル。そこから1枚だけ手に取って机に置いたものが作業領域（1行）。書き込みや確認は机の上の1枚に対して行う。\n先生：プログラムは棚全体を一度に触るのではなく、1枚ずつ机に出して処理するのが基本。\nBちゃん：棚の本を1冊ずつ取り出して読むイメージなら分かります。",
          content: (
            <>
              <h2>内部テーブル＝棚、作業領域＝机の上の1枚</h2>
              <p>
                たくさんの書類が並んだ「棚」が内部テーブル。そこから1枚だけ手に取って机に置いたものが「作業領域（1行）」です。
                <strong>書き込みや確認は、机の上の1枚</strong>に対して行います。
              </p>
              <Figure
                src="image/05-shelf-desk.png"
                alt="左に書類が整然と並んだ棚（内部テーブル＝複数行）、右に棚から抜き出した1枚を広げた机（作業領域＝1行）。棚から机へ1枚を移す矢印。"
                caption="棚（内部テーブル）から、机（作業領域）へ1枚ずつ取り出して処理する"
                kind="concept"
              />
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
          title: "なぜメモリに持つ",
          plainText:
            "業務の意味：なぜ一度メモリに持つのか\n仕訳日記帳のように何百件もの明細を扱うとき、1件ごとにDBへ行って戻ってを繰り返すと遅い。必要な分をまとめて取り出し、内部テーブル（手元の作業台）に広げてから、並べ替え・集計・整形をまとめて行う。\n先生：DBは倉庫、内部テーブルは作業台。倉庫に何度も往復せず、必要な物を作業台に出してから仕事をする、という発想です。\nAくん：取得と加工を分けると、DBアクセスを最小限にできる。性能の話にもつながりそう。\nBちゃん：買い物に1個ずつ行くより、まとめ買いして家で料理する感じ？\n先生：まさにそれ。往復の回数を減らすほど速くなります。\nBちゃん：イメージできました。",
          content: (
            <>
              <h2>なぜ一度メモリに持つのか（業務の意味）</h2>
              <p>
                仕訳日記帳のように<strong>何百・何千件</strong>もの明細を扱うとき、1件ごとにデータベースへ往復していては遅くなります。必要な分を
                <strong>まとめて取り出し</strong>、内部テーブル（手元の作業台）に広げてから、並べ替え・集計・整形を一気に行います。
              </p>
              <Callout variant="note">
                データベース＝<strong>倉庫</strong>（永続・遠い）。内部テーブル＝
                <strong>作業台</strong>（一時・手元）。倉庫に何度も往復せず、必要な物を作業台に出してから仕事をする、という発想です。
              </Callout>
              <Dialog speaker="a">
                取得（SELECT）と加工（内部テーブル操作）を分けることで、DBアクセスを最小限にできるんですね。性能の話にもつながりそう。
              </Dialog>
              <Dialog speaker="b">
                買い物に1個ずつ行くより、まとめ買いして家で料理する…みたいな感じですか？
              </Dialog>
              <Dialog speaker="teacher">
                まさにそれです。倉庫（DB）への往復回数を減らすほど速くなります。「まず必要な分を手元に出す → あとは手元で作業」と覚えてください。
              </Dialog>
              <Dialog speaker="b">
                それなら家でもやってます。少し安心しました。
              </Dialog>
            </>
          ),
        },
        {
          title: "1行と複数行",
          plainText:
            "1件の箱（構造）と、複数件の表（内部テーブル）\nABAPでは両方を用意する。\nDATA ls_row TYPE bkpf.        \" 1行ぶんの作業領域（構造）\nDATA lt_tab TYPE TABLE OF bkpf. \" 複数行の内部テーブル\nAくん：ls_ が単一行(structure)、lt_ がテーブル、という命名の慣習なんですね。",
          content: (
            <>
              <h2>1件の箱（構造）と、複数件の表（内部テーブル）</h2>
              <p>
                ABAPでは、<strong>1行ぶんの「作業領域（構造）」</strong>と
                <strong>複数行の「内部テーブル」</strong>の両方を用意します。
              </p>
              <CodeBlock
                language="ABAP"
                code={`" 1行ぶんの作業領域（机の上の1枚＝構造）
DATA ls_row TYPE bkpf.

" 複数行の内部テーブル（棚）
DATA lt_tab TYPE TABLE OF bkpf.`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>DATA ls_row TYPE bkpf.</code> … 1行ぶんの作業領域（構造）。<code>ls_</code> は「local structure」
                </li>
                <li>
                  <code>DATA lt_tab TYPE TABLE OF bkpf.</code> … 同じ形の行を複数持てる内部テーブル（棚）。<code>lt_</code> は「local table」
                </li>
                <li>
                  <code>TYPE TABLE OF bkpf</code> … <code>bkpf</code> 型の行を並べた表、という意味
                </li>
              </ul>
              <Figure
                src="image/05-structure-vs-table.png"
                alt="左：1個のカード（構造 ls_row、列が横一列）。右：同じ形のカードが縦に積み重なった表（内部テーブル lt_tab）。両者が同じ列構成であることを示す。"
                caption="構造（1行）と内部テーブル（同じ形の行が複数）。形は同じ、件数が違う"
                kind="diagram"
              />
              <Dialog speaker="a">
                <code>ls_</code>（local structure）が単一行、<code>lt_</code>（local
                table）がテーブル、という命名の慣習なんですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "作り方",
          plainText:
            "内部テーブルの作り方\nまず形（型）を決め、その形の入れ物を用意する。\nTYPES: tt_bkpf TYPE STANDARD TABLE OF bkpf WITH EMPTY KEY.\nDATA: lt_bkpf TYPE tt_bkpf,\n      ls_bkpf TYPE bkpf.\n先生：TYPE TABLE OF は STANDARD TABLE OF の短い書き方。最初は STANDARD（標準）でOK。\nAくん：TYPES が設計図、DATA が実物、という関係ですね。\n先生：その通り。設計図は何個でも実物を作れます。\nBちゃん：クッキーの型と、焼いたクッキー本体、みたいな？\n先生：完璧なたとえです。型は1つ、クッキー（データ）はたくさん。",
          content: (
            <>
              <h2>内部テーブルの作り方</h2>
              <p>
                手順はシンプルです。<strong>① 形（型）を決める → ② その形の入れ物（変数）を用意する</strong>。
              </p>
              <CodeBlock
                language="ABAP"
                code={`" ① 形（行の型）を決めて、テーブル型に名前を付ける
TYPES tt_bkpf TYPE STANDARD TABLE OF bkpf WITH EMPTY KEY.

" ② その型で、内部テーブルと作業領域を用意する
DATA: lt_bkpf TYPE tt_bkpf,   " 複数行
      ls_bkpf TYPE bkpf.      " 1行（作業領域）`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>TYPES tt_bkpf TYPE STANDARD TABLE OF bkpf ...</code> … テーブルの「型（設計図）」を定義。<code>tt_</code> はテーブル型の名前
                </li>
                <li>
                  <code>STANDARD TABLE OF</code> … 標準的な内部テーブル（最初はこれで十分）
                </li>
                <li>
                  <code>WITH EMPTY KEY</code> … キーなしの表（詳細は後の章で。今は「型定義の一部」と覚えればOK）
                </li>
                <li>
                  <code>DATA: lt_bkpf TYPE tt_bkpf, ls_bkpf TYPE bkpf.</code> … 設計図（<code>TYPES</code>）から実物の棚と机を用意
                </li>
              </ul>
              <Callout variant="tip">
                <code>TYPE TABLE OF</code> は <code>TYPE STANDARD TABLE OF</code>{" "}
                の短い書き方です。テーブルには STANDARD / SORTED / HASHED の種類がありますが、
                <strong>最初は STANDARD（標準）だけ</strong>で十分です。
              </Callout>
              <Dialog speaker="a">
                <code>TYPES</code> が設計図、<code>DATA</code> が実物、という関係ですね。設計図は1枚でも、実物は何個でも作れる。
              </Dialog>
              <Dialog speaker="b">
                クッキーの「型」と、焼いた「クッキー本体」みたいな感じですか？
              </Dialog>
              <Dialog speaker="teacher">
                完璧なたとえです。型（<code>TYPES</code>）は1つ、そこから作るクッキー（データ）はたくさん。だから設計図と実物は分けて考えます。
              </Dialog>
              <Dialog speaker="stumble">
                「型」と「実データ」を混同しがちです。<code>TYPES</code> は“形”の定義、
                <code>DATA</code> で作った内部テーブルが“その形に入った実データ”です。
              </Dialog>
            </>
          ),
        },
        {
          title: "1件ずつ：LOOP",
          plainText:
            "1行ずつ処理する：LOOP\nLOOP AT lt_bkpf INTO ls_bkpf.\n  WRITE: / ls_bkpf-belnr, ls_bkpf-budat.\nENDLOOP.\nLOOP は棚から1枚ずつ机に出して、最後の行まで繰り返す。INTO の後ろが机（作業領域）。\n先生：LOOP の中では、いま机にある ls_bkpf の1行だけを見て処理します。\nBちゃん：全部の行を一度に書くのかと思ってました。\n先生：いいえ、1回につき1行だけ。それが行の数だけ自動で繰り返されます。\nBちゃん：トランプを1枚ずつめくる感じですね。\nAくん：INTO の後ろ(ls_bkpf)が毎回上書きされる、という理解で合ってますか？\n先生：その通りです。",
          content: (
            <>
              <h2>1行ずつ処理する：<code>LOOP</code></h2>
              <p>
                <code>LOOP AT … INTO …</code> は、棚から1枚ずつ机に出して、
                <strong>最後の行まで自動で繰り返す</strong>命令です。
              </p>
              <CodeBlock
                language="ABAP"
                code={`LOOP AT lt_bkpf INTO ls_bkpf.   " 1行を机(ls_bkpf)へ
  WRITE: / ls_bkpf-belnr, ls_bkpf-budat.
ENDLOOP.                         " 次の行へ。なくなれば終了`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>LOOP AT lt_bkpf INTO ls_bkpf.</code> … 棚（<code>lt_bkpf</code>）から1行ずつ机（<code>ls_bkpf</code>）へ取り出して繰り返す
                </li>
                <li>
                  <code>WRITE: / ls_bkpf-belnr, ls_bkpf-budat.</code> … いま机にある1行の伝票番号・日付を表示。<code>/</code> は改行
                </li>
                <li>
                  <code>ENDLOOP.</code> … ループの終わり。次の行がなければ自動で抜ける
                </li>
              </ul>
              <Figure
                src="image/05-loop-flow.png"
                alt="棚（内部テーブル）の各行に1,2,3…と番号。各行が順番に矢印で机（作業領域）へ移り、机の上で WRITE 処理される様子を3コマで示す。"
                caption="LOOP：棚の行を上から順に机へ出し、1行ずつ処理して次へ進む"
                kind="diagram"
              />
              <Dialog speaker="b">
                全部の行を一度にまとめて書くのかと思っていました…。
              </Dialog>
              <Dialog speaker="teacher">
                いいえ、1回につき<strong>1行だけ</strong>です。それが「棚にある行の数」だけ自動で繰り返されます。トランプを1枚ずつめくるイメージですね。
              </Dialog>
              <Dialog speaker="a">
                つまり <code>INTO</code> の後ろ（<code>ls_bkpf</code>）が毎回、次の行で上書きされる。だから中では「今の1行」だけを見ればいい、という理解で合っていますか？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。棚全体ではなく「今の1枚」に集中する——これがループを読むコツです。
              </Dialog>
            </>
          ),
        },
        {
          title: "並べ替え：SORT",
          plainText:
            "並べ替える：SORT\nSORT lt_bkpf BY budat.            \" 日付の昇順\nSORT lt_bkpf BY bukrs ASCENDING budat DESCENDING. \" 複数キー\n先生：LOOP の前に SORT しておくと、決まった順番で処理できる。集計や見出しの制御にも効いてきます。",
          content: (
            <>
              <h2>並べ替える：<code>SORT</code></h2>
              <p>
                処理の前に順番を整えておくと、結果が安定し、後の集計や見出し制御がやりやすくなります。
              </p>
              <CodeBlock
                language="ABAP"
                code={`SORT lt_bkpf BY budat.            " 日付の昇順（既定）

" 複数キー・昇順/降順の指定もできる
SORT lt_bkpf BY bukrs ASCENDING
                budat DESCENDING.`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>SORT lt_bkpf BY budat.</code> … 棚の中身を転記日（<code>budat</code>）の昇順に並べ替え
                </li>
                <li>
                  <code>SORT lt_bkpf BY bukrs ASCENDING budat DESCENDING.</code> … 会社コード昇順 → 同じ会社内は日付降順、の2段ソート
                </li>
                <li>
                  <code>ASCENDING</code> / <code>DESCENDING</code> … 昇順／降順の指定（省略時は昇順）
                </li>
              </ul>
              <Callout variant="note">
                <code>SORT</code> は棚の中身そのものを並べ替える。並べ替えたあと <code>LOOP</code> すると、決まった順番で処理できる。
              </Callout>
              <Dialog speaker="teacher">
                「<strong>並べる → 1件ずつ</strong>」は今後あらゆる場面で使う黄金パターンです。<code>SORT</code> してから <code>LOOP</code> する、と覚えてください。
              </Dialog>
            </>
          ),
        },
        {
          title: "1件取り出す：READ",
          plainText:
            "狙った1件を取り出す：READ TABLE\nREAD TABLE lt_bkpf INTO ls_bkpf WITH KEY belnr = '0000000001'.\nIF sy-subrc = 0.   \" 見つかった\n  WRITE ls_bkpf-budat.\nENDIF.\n先生：LOOP＝全件を順番に、READ TABLE＝条件に合う1件を1発で。見つかったかは sy-subrc で確認。\nAくん：目的が全件処理か1件検索かで命令を選ぶ整理ですね。\nBちゃん：sy-subrc を見ないとどうなるの？\n先生：前の値が残ったまま進んで誤った結果になることがある。取り出したら必ず sy-subrc を確認。",
          content: (
            <>
              <h2>狙った1件を取り出す：<code>READ TABLE</code></h2>
              <p>
                全件を回さず、<strong>条件に合う1行だけ</strong>を取り出したいときに使います。
              </p>
              <CodeBlock
                language="ABAP"
                code={`READ TABLE lt_bkpf INTO ls_bkpf
  WITH KEY belnr = '0000000001'.

IF sy-subrc = 0.        " 0 なら見つかった
  WRITE ls_bkpf-budat.
ELSE.
  WRITE '該当なし'.
ENDIF.`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>READ TABLE lt_bkpf INTO ls_bkpf WITH KEY belnr = ...</code> … 伝票番号が一致する1行だけを棚から机へ取り出す
                </li>
                <li>
                  <code>IF sy-subrc = 0.</code> … 見つかったか確認。<code>0</code> なら成功、それ以外は該当なし
                </li>
                <li>
                  <code>ELSE.</code> … 見つからなかったときの処理。確認を省略すると前の値が残る事故につながる
                </li>
              </ul>
              <Callout variant="note">
                <code>LOOP</code>＝全件を順番に。<code>READ TABLE</code>＝条件に合う1件を一発で。見つかったかどうかは
                <strong> <code>sy-subrc</code>（0＝成功）</strong>で必ず確認します。
              </Callout>
              <Dialog speaker="a">
                目的が「全件処理」か「1件検索」かで命令を選ぶ、という整理ですね。無駄なループを避けられそうです。
              </Dialog>
              <Dialog speaker="b">
                見つからなかったときに <code>sy-subrc</code> を見ないと、どうなるんですか？
              </Dialog>
              <Dialog speaker="teacher">
                良い質問です。確認しないと、<code>ls_bkpf</code> に<strong>前の値が残ったまま</strong>処理が進み、誤った結果になることがあります。だから「取り出したら必ず <code>sy-subrc</code> を確認」をクセにしましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "追加・初期化",
          plainText:
            "行を足す・中身を消す：APPEND / CLEAR / REFRESH\nls_bkpf-belnr = '0000000010'.\nAPPEND ls_bkpf TO lt_bkpf.   \" 机の1枚を棚へ追加\nCLEAR ls_bkpf.               \" 机の上(1行)を空にする\nREFRESH lt_bkpf.            \" 棚(テーブル全体)を空にする\nつまずき：CLEAR は1行だけ、REFRESH はテーブル全体。次のループ前に CLEAR を忘れると前の値が残る。",
          content: (
            <>
              <h2>行を足す・中身を消す：<code>APPEND</code> / <code>CLEAR</code> / <code>REFRESH</code></h2>
              <CodeBlock
                language="ABAP"
                code={`ls_bkpf-belnr = '0000000010'.
APPEND ls_bkpf TO lt_bkpf.   " 机の1枚を棚へ追加

CLEAR ls_bkpf.               " 机の上（1行）だけを空にする
REFRESH lt_bkpf.             " 棚（テーブル全体）を空にする`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>ls_bkpf-belnr = &apos;0000000010&apos;.</code> … 机の上の1行に値をセット
                </li>
                <li>
                  <code>APPEND ls_bkpf TO lt_bkpf.</code> … 机の1枚を棚の末尾に追加（行を1件増やす）
                </li>
                <li>
                  <code>CLEAR ls_bkpf.</code> … 机（作業領域）だけを空にする。次の行を組み立てる前に使う
                </li>
                <li>
                  <code>REFRESH lt_bkpf.</code> … 棚（内部テーブル）全体を空にする
                </li>
              </ul>
              <Callout variant="warning">
                <code>CLEAR</code> は1行だけ、<code>REFRESH</code> は棚ごと。ループで行を組み立てるとき、次の行の前に <code>CLEAR</code> を忘れると前の値が混ざる。
              </Callout>
              <Dialog speaker="stumble">
                <code>CLEAR</code> は「机の1枚」、<code>REFRESH</code> は「棚ごと」。次の組み立ての前に
                <code>CLEAR</code> を忘れると、前の行の値が残って混ざる事故が起きます。
              </Dialog>
              <Dialog speaker="b">
                作業台の上を毎回きれいに拭いてから次の物を置く、みたいなことですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "図解：全体像",
          plainText:
            "図で見る：棚（テーブル）と机（作業領域）\nflowchart\n取得(SELECT) → 内部テーブル(棚) → SORTで並べ替え → LOOP/READ で作業領域(机) → 加工 → 出力や蓄積\nこの章のABAPキーワード：TYPE TABLE OF / SORT / LOOP ... INTO / READ TABLE ... WITH KEY / APPEND / CLEAR / REFRESH",
          content: (
            <>
              <h2>図で見る：棚（テーブル）と机（作業領域）</h2>
              <MermaidDiagram
                chart={`flowchart LR
  DB[("DB / 倉庫")] -->|SELECT| T["内部テーブル<br/>(棚・複数行)"]
  T -->|SORT| T
  T -->|LOOP / READ TABLE| W["作業領域<br/>(机・1行)"]
  W -->|加工| O["出力 / 蓄積"]
  W -.->|APPEND| T`}
              />
              <Callout variant="tip">
                この章のABAPキーワード：<code>TYPE TABLE OF</code> /{" "}
                <code>SORT</code> / <code>LOOP ... INTO</code> /{" "}
                <code>READ TABLE ... WITH KEY</code> / <code>APPEND</code> /{" "}
                <code>CLEAR</code> / <code>REFRESH</code>
              </Callout>
            </>
          ),
        },
        {
          title: "DBとの違い",
          plainText:
            "Excelの表と似て、ちょっと違う／DBとも違う\n行と列の表という点はExcelに似ている。でも内部テーブルはプログラムが動いている間だけメモリ上にある一時的な表で、実行が終われば消える。\nつまずき：内部テーブル＝データベースではない。DBは倉庫（永続）、内部テーブルは作業台（一時）。\nつまずき：内部テーブルを書き換えてもDBは変わらない。DBへ反映するには別の処理（更新）が要る。\nBちゃん：机の上のメモを直しても倉庫の台帳はそのまま、ということ？\n先生：その通り。倉庫を更新したいなら書き戻す手続きが要る。\nAくん：逆に言えば内部テーブルで試行錯誤してもDBは汚れない。安全に加工できる場所ですね。",
          content: (
            <>
              <h2>Excelの表に似て、ちょっと違う（DBとも違う）</h2>
              <p>
                「行と列の表」という点はExcelに似ています。でも内部テーブルは
                <strong>プログラムが動いている間だけ、メモリ上にある一時的な表</strong>で、実行が終われば消えます。
              </p>
              <Figure
                src="image/05-table-vs-db.png"
                alt="左：頑丈な倉庫の棚（データベース＝永続）。右：作業中の机に広げた一時的な書類の束（内部テーブル＝一時）。机を片付けても倉庫の中身は変わらないことを矢印で示す。"
                caption="DB＝永続の倉庫／内部テーブル＝一時の作業台。作業台を消してもDBは変わらない"
                kind="concept"
              />
              <Dialog speaker="stumble">
                内部テーブルを書き換えても、それだけでは<strong>DBは変わりません</strong>。DBへ反映するには別の更新処理が必要です（後の章で扱います）。
              </Dialog>
              <Dialog speaker="b">
                机の上のメモを直しても、倉庫の台帳はそのまま、ということですか？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。倉庫（DB）を更新したいなら、机での作業のあとに「倉庫へ書き戻す」手続きが要ります。ここを混同すると「直したのに反映されない」とハマりがちです。
              </Dialog>
              <Dialog speaker="a">
                逆に言えば、内部テーブルでいくら試行錯誤してもDBは汚れない。安全に加工できる場所、とも言えますね。
              </Dialog>
            </>
          ),
        },
        {
          title: "ミニ演習",
          plainText:
            "確認質問＆ミニ演習\n先生の問い：棚にある全書類を、日付順に1枚ずつ確認したい。どの操作を、どの順で使う？\nAくん：まず SORT で日付順に並べ、LOOP で1行ずつ回す、です。\nBちゃん：先に並べ替えてからめくる、なら家でもやってます。\n先生：正解。並べる→1件ずつ、が黄金パターン。",
          content: (
            <>
              <h2>確認質問＆ミニ演習</h2>
              <p>
                <strong>先生の問い：</strong>「棚にある全書類を、日付順に1枚ずつ確認したい」。どの操作を、どの順で使う？
              </p>
              <Dialog speaker="a">
                まず <code>SORT</code> で日付順に並べ、<code>LOOP</code> で1行ずつ回す、です。
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
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1「作業領域」が表すのは？→ いま処理している1行\nQ2 内部テーブルについて正しいのは？→ 実行中だけ存在する一時的な表である\nQ3 伝票番号が一致する1件だけ確認したい→ READ TABLE ... WITH KEY\n今日のひとこと：棚と机のイメージさえあれば、データ操作はもう怖くありません。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="作業領域は「いま処理している1行」。内部テーブルは複数行の集まりです。LOOPで1行ずつ作業領域へ取り出して処理する前提を理解すると、データの流れを追いやすくなります。"
                question={<strong>「作業領域」が表すのは？</strong>}
                options={["複数行の集まり全体", "いま処理している1行", "データベースの実体"]}
              />
              <Quiz
                answer={2}
                explanation="内部テーブルはプログラム実行中だけメモリに存在する一時的な表。DB（永続的な倉庫）とは別物です。この区別を持つと、どこで更新が永続化されるかを誤解せずに設計できます。"
                question={<strong>内部テーブルについて正しいのは？</strong>}
                options={[
                  "データベースと同じで、ずっと保存される",
                  "データの「型」の定義そのものである",
                  "実行中だけ存在する一時的な表である",
                ]}
              />
              <Quiz
                answer={1}
                explanation="READ TABLEは条件に合う特定行を狙って取り出す命令で、全件を順に処理するLOOPとは役割が異なります。要件が「1件検索」なのか「全件処理」なのかを先に分けると、無駄な処理を避けられます。"
                question={<strong>「伝票番号が一致する1件だけ確認したい」場面で最も適切なのは？</strong>}
                options={[
                  "LOOPで全件を必ず走査する",
                  "READ TABLE ... WITH KEY を使う",
                  "REFRESHで内部テーブルを空にしてから探す",
                ]}
              />
              <Dialog speaker="closing">
                「棚と机」のイメージさえあれば、データ操作はもう怖くありません。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(InternalTablesLesson);
