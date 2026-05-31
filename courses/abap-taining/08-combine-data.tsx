import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CodeBlock,
  Quiz,
  Reveal,
  MermaidDiagram,
  Figure,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "複数データをまとめる",
  meta: "初学者 · 25分",
};

export default function CombineDataLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-taining", "08-combine-data", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "複数データをまとめる\nバラバラの情報（ヘッダと明細）を、1行ずつ見やすい一覧に整える章です。\n⏱ 25分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・取得用と出力用の「棚」を分ける\n・データを移す命令（MOVE / MOVE-CORRESPONDING）\n・1行ずつ追加・片付け（APPEND / CLEAR / REFRESH）\nBちゃん：レシートの「お店情報」と「商品リスト」を1行にまとめる作業、ですね。",
          content: (
            <>
              <hgroup>
                <h1>複数データをまとめる</h1>
                <p>
                  バラバラにある「お店の情報（ヘッダ）」と「買った品物（明細）」を、
                  <strong>1行ずつ見やすい一覧</strong>に整える方法を学びます。
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
                <li>取得用と出力用の「棚」を分ける</li>
                <li>データを移す命令（<code>MOVE</code> / <code>MOVE-CORRESPONDING</code>）</li>
                <li>1行ずつ追加・片付け（<code>APPEND</code> / <code>CLEAR</code> / <code>REFRESH</code>）</li>
              </ul>
              <Dialog speaker="b">
                レシートの「お店情報」と「商品リスト」を1行にまとめる作業、ですね。
              </Dialog>
              <Dialog speaker="teacher">
                そのイメージで大丈夫です。英語の命令名は後から覚えればOK。まずは「組み立てる→追加する→片付ける」の流れを体に入れましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "領収書整理のたとえ",
          plainText:
            "バラバラの情報を、1枚の表にまとめる\nお店の情報（ヘッダ）と買った品物（明細）が別々にあると見づらい。突き合わせて1つの見やすい一覧にするのが今回のテーマ。\n先生：会計では伝票ヘッダ（BKPF）と明細（BSEG）を組み合わせて、1行で意味が分かる一覧を作ります。\nBちゃん：レシートの「日付・店名」と「商品名・金額」を1行に並べる感じ？\n先生：まさにそれ。バラバラのままだと使いにくいので、後で使える形に整えます。",
          content: (
            <>
              <h2>バラバラの情報を、1枚の表にまとめる</h2>
              <p>
                「お店の情報（ヘッダ）」と「買った品物（明細）」が別々にあると見づらいですよね。
                これらを突き合わせて、<strong>1行ずつ意味が分かる一覧</strong>にするのが今回のテーマです。
              </p>
              <Figure
                src="image/08-receipt-organize.png"
                alt="左：お店情報のカード（ヘッダ）と品物リストのカード（明細）がバラバラに散らばっている。右：それらを突き合わせて1行ずつにまとめた整然とした一覧表。"
                caption="ヘッダ（お店）と明細（品物）を突き合わせ、1行で意味が分かる一覧に整える"
                kind="concept"
              />
              <Dialog speaker="teacher">
                会計では、伝票ヘッダ（BKPF）と明細（BSEG）を組み合わせて「1行で意味が分かる一覧」を作ります。
              </Dialog>
              <Dialog speaker="b">
                レシートの「日付・店名」と「商品名・金額」を1行に並べる感じ？
              </Dialog>
              <Dialog speaker="teacher">
                まさにそれです。バラバラのままだと使いにくいので、後で使える形に整えます。
              </Dialog>
            </>
          ),
        },
        {
          title: "複数テーブルの使い分け",
          plainText:
            "用途ごとに「棚」を分ける\n取得用（生データ）と出力用（整えた一覧）で棚を分けると頭が整理される。\nDATA lt_bkpf TYPE TABLE OF bkpf. \" ヘッダ取得用\nDATA lt_bseg TYPE TABLE OF bseg. \" 明細取得用\nDATA lt_out TYPE TABLE OF ty_out. \" 出力用（まとめた形）\nBちゃん：生の食材用ボウルと、盛り付け用の皿を分ける感じ？\n先生：その通り。生データは触らず、別の棚で整えると安全です。",
          content: (
            <>
              <h2>用途ごとに「棚」を分ける</h2>
              <p>
                <strong>取得用（生データ）</strong>と<strong>出力用（整えた一覧）</strong>で棚を分けると、頭が整理されます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`DATA lt_bkpf TYPE TABLE OF bkpf.   " ヘッダ取得用
DATA lt_bseg TYPE TABLE OF bseg.   " 明細取得用
DATA lt_out  TYPE TABLE OF ty_out. " 出力用（まとめた形）`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>lt_bkpf</code> … ヘッダをそのまま受け取る棚（生データ）
                </li>
                <li>
                  <code>lt_bseg</code> … 明細をそのまま受け取る棚（生データ）
                </li>
                <li>
                  <code>lt_out</code> … ヘッダと明細を合体した結果を入れる棚（出力用）
                </li>
              </ul>
              <Dialog speaker="b">
                生の食材用ボウルと、盛り付け用の皿を分ける感じ？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。生データはそのまま残し、別の棚で整えると安全です。間違えても元に戻せます。
              </Dialog>
            </>
          ),
        },
        {
          title: "MOVEと対応づけ",
          plainText:
            "値を移す：MOVE と MOVE-CORRESPONDING\nMOVE a TO b（または b = a）：1つの値を移す\nMOVE-CORRESPONDING：同じ名前の項目をまとめて移す（とても便利）\nMOVE-CORRESPONDING ls_bkpf TO ls_out. \" 同名項目を一気にコピー\nls_out-amount = ls_bseg-dmbtr. \" 名前が違う項目は1つずつ移す\nBちゃん：同じラベルの引き出しから、中身をまとめて移す感じ？\n先生：その通り。名前が違う項目だけ、手で1つずつ移せばOKです。",
          content: (
            <>
              <h2>値を移す：<code>MOVE</code> と <code>MOVE-CORRESPONDING</code></h2>
              <ul>
                <li><code>MOVE a TO b</code>（または <code>b = a</code>）：1つの値を移す</li>
                <li>
                  <code>MOVE-CORRESPONDING</code>：<strong>同じ名前の項目</strong>をまとめて移す（とても便利）
                </li>
              </ul>
              <CodeBlock
                language="ABAP"
                code={`MOVE-CORRESPONDING ls_bkpf TO ls_out.  " 同名項目を一気にコピー
ls_out-amount = ls_bseg-dmbtr.         " 名前が違う項目は1つずつ移す`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>MOVE-CORRESPONDING ls_bkpf TO ls_out.</code> … ヘッダから出力用へ、<strong>名前が同じ項目</strong>（伝票番号・日付など）をまとめてコピー
                </li>
                <li>
                  <code>ls_out-amount = ls_bseg-dmbtr.</code> … 名前が違う項目（金額）は1つずつ手動で移す
                </li>
              </ul>
              <Dialog speaker="b">
                同じラベルの引き出しから、中身をまとめて移す感じ？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。<code>MOVE-CORRESPONDING</code> は「同名は自動、違う名前は手動」と覚えてください。
              </Dialog>
            </>
          ),
        },
        {
          title: "蓄える・消す",
          plainText:
            "蓄える・消す：APPEND / CLEAR / REFRESH\nAPPEND ls_out TO lt_out：作った1行を出力テーブルに追加\nCLEAR ls_out：作業領域（1行）を空にする\nREFRESH lt_out：内部テーブル（全行）を空にする\nつまずき：APPEND したあと CLEAR し忘れると前の行の値が次に残る。→ 1行作る → 追加 → クリア をワンセットに。\nBちゃん：使った皿を洗ってから次の料理、ですね。\n先生：完璧なたとえ。組み立て→追加→クリアを口ぐせに。",
          content: (
            <>
              <h2>蓄える・消す：<code>APPEND</code> / <code>CLEAR</code> / <code>REFRESH</code></h2>
              <ul>
                <li><code>APPEND ls_out TO lt_out</code>：作った1行を出力テーブルに追加</li>
                <li><code>CLEAR ls_out</code>：作業領域（1行）を空にする</li>
                <li><code>REFRESH lt_out</code>：内部テーブル（全行）を空にする</li>
              </ul>
              <Dialog speaker="stumble">
                <code>APPEND</code> したあと <code>CLEAR</code> し忘れると、前の行の値が次に残ってしまう。→ 「1行作る → 追加 → クリア」をワンセットに。
              </Dialog>
              <Dialog speaker="b">
                使った皿を洗ってから次の料理、ですね。
              </Dialog>
              <Dialog speaker="teacher">
                完璧なたとえです。「組み立て → 追加 → クリア」を口ぐせにすれば、混ざる事故はほぼ防げます。
              </Dialog>
            </>
          ),
        },
        {
          title: "図解：取得→対応付け→蓄積",
          plainText:
            "図で見る：まとめる流れ\nflowchart：ヘッダ取得＋明細取得 → 1行を組み立て → APPENDで蓄積 → CLEARして次の行へ → 繰り返し\nBちゃん：材料を取る→1皿盛る→追加→皿を洗う、を繰り返すだけ？\n先生：その通り。このリズムがこの章の核心です。",
          content: (
            <>
              <h2>図で見る：まとめる流れ</h2>
              <MermaidDiagram
                chart={`flowchart LR
  A[ヘッダ取得] --> C[1行を組み立て]
  B[明細取得] --> C
  C --> D[APPEND で蓄積]
  D --> E[CLEAR して次の行へ]
  E --> C`}
              />
              <Figure
                src="image/08-header-detail-join.png"
                alt="lt_bkpf（ヘッダ行）とlt_bseg（明細行）から、MOVE-CORRESPONDINGと個別代入で1行(ls_out)を組み立て、APPENDでlt_out（出力テーブル）に積み上げていく流れの図。"
                caption="ヘッダ＋明細 → 1行を組み立て（MOVE-CORRESPONDING＋個別代入）→ APPENDで蓄積"
                kind="diagram"
              />
              <Dialog speaker="b">
                材料を取る → 1皿盛る → 追加 → 皿を洗う、を繰り返すだけ？
              </Dialog>
              <Dialog speaker="teacher">
                その通り。このリズムがこの章の核心です。
              </Dialog>
              <Callout variant="tip">
                この章のABAPキーワード：<code>MOVE</code> / <code>MOVE-CORRESPONDING</code> / <code>APPEND</code> / <code>CLEAR</code> / <code>REFRESH</code>。
              </Callout>
            </>
          ),
        },
        {
          title: "ミニ演習",
          plainText:
            "確認質問＆ミニ演習\n先生の問い：1行を組み立てて出力テーブルに足したあと、次の行に進む前にやるべきことは？\nBちゃん：使った皿を洗う…つまり CLEAR ですね。\n先生：正解！組み立て→APPEND→CLEAR を口ぐせにすれば混ざる事故はほぼ防げます。",
          content: (
            <>
              <h2>確認質問＆ミニ演習</h2>
              <p><strong>先生の問い：</strong>「1行を組み立てて出力テーブルに足したあと、次の行に進む前にやるべきことは？」</p>
              <Reveal>
                <Dialog speaker="b">
                  使った皿を洗う…つまり <code>CLEAR</code> ですね。
                </Dialog>
                <Dialog speaker="teacher">
                  正解！「組み立て → APPEND → CLEAR」を口ぐせにすれば、混ざる事故はほぼ防げます。
                </Dialog>
              </Reveal>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\nBちゃん：生データ用の棚と出力用の棚を分けて、1行ずつ組み立て→追加→片付け。これだけ覚えれば大丈夫そう。\n先生：その通り。同名項目は MOVE-CORRESPONDING、違う名前は手動で移す。\nAくん：取得用を残したまま整形できるので、仕様変更にも強い設計ですね。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="b">
                生データ用の棚と出力用の棚を分けて、1行ずつ「組み立て → 追加 → 片付け」。これだけ覚えれば大丈夫そうです。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。あとは細かい点として、同名項目は <code>MOVE-CORRESPONDING</code>、違う名前は手動で移す、と覚えてください。
              </Dialog>
              <Dialog speaker="a">
                取得用を残したまま整形できるので、仕様変更にも強い設計ですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 同じ名前の項目をまとめて移すのに便利なのは？→ MOVE-CORRESPONDING\nQ2 1行をAPPENDした後、次の行の前に作業領域を空にする命令は？→ CLEAR\nQ3 内部テーブルを取得用と出力用に分ける主な利点は？→ 役割が分離され整形処理を安全に管理できる\nBちゃん：組み立て→追加→クリア。このリズムが身につけば、もう怖くないです。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="MOVE-CORRESPONDING は、両者で名前が一致する項目だけをまとめてコピーします。Bちゃんのたとえで言えば「同じラベルの引き出しから中身をまとめて移す」命令です。"
                question={<strong>同じ名前の項目をまとめて移すのに便利なのは？</strong>}
                options={["APPEND", "MOVE-CORRESPONDING", "REFRESH"]}
              />
              <Quiz
                answer={2}
                explanation="CLEAR は作業領域（1行）を空にします。APPEND の後にこれを忘れると前の値が残ります。Bちゃんのたとえで言えば「使った皿を洗う」作業です。"
                question={<strong>1行をAPPENDした後、次の行の前に作業領域を空にする命令は？</strong>}
                options={["MOVE", "ULINE", "CLEAR"]}
              />
              <Quiz
                answer={0}
                explanation="取得用テーブルと出力用テーブルを分離すると、元データの保持と表示用整形を独立して管理できます。Bちゃんのたとえで言えば「生食材用ボウル」と「盛り付け用の皿」を分けるイメージです。"
                question={<strong>内部テーブルを「取得用」と「出力用」に分ける主な利点は？</strong>}
                options={[
                  "役割が分離され、整形処理を安全に管理できる",
                  "必ず実行速度が2倍になる",
                  "CLEARやAPPENDが不要になる",
                ]}
              />
              <Dialog speaker="b">
                「組み立て → 追加 → クリア」。このリズムが身につけば、もう怖くないです。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(CombineDataLesson);
