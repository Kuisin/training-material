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
            "複数データをまとめる\nヘッダと明細を合わせて出力する。後で使いやすい形にデータを整える方法を学びます。\n⏱ 25分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・複数の内部テーブル（ヘッダ用・明細用）を使い分ける\n・データを移す・対応づける命令（MOVE / MOVE-CORRESPONDING）\n・蓄える・消す命令（APPEND / CLEAR / REFRESH）",
          content: (
            <>
              <hgroup>
                <h1>複数データをまとめる</h1>
                <p>ヘッダと明細を合わせて出力する。後で使いやすい形にデータを整える方法を学びます。</p>
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
                <li>複数の内部テーブル（ヘッダ用・明細用）を使い分ける</li>
                <li>データを移す・対応づける命令（<code>MOVE</code> / <code>MOVE-CORRESPONDING</code>）</li>
                <li>蓄える・消す命令（<code>APPEND</code> / <code>CLEAR</code> / <code>REFRESH</code>）</li>
              </ul>
            </>
          ),
        },
        {
          title: "領収書整理のたとえ",
          plainText:
            "バラバラの情報を、1枚の表にまとめる\nお店の情報（ヘッダ）と買った品物（明細）が別々にあると見づらい。突き合わせて1つの見やすい一覧にするのが今回のテーマ。\n先生：会計でいうと伝票ヘッダ（BKPF）と明細（BSEG）を組み合わせて、1行で意味が分かる一覧を作るイメージ。\nBちゃん：レシートと家計簿を見比べて、1行にまとめる作業に似てますね。\n先生：その通り。バラバラのままだと使いにくいので、後で使える形に整えます。",
          content: (
            <>
              <h2>バラバラの情報を、1枚の表にまとめる</h2>
              <p>「お店の情報（ヘッダ）」と「買った品物（明細）」が別々にあると見づらいですよね。これらを突き合わせて、1つの見やすい一覧にするのが今回のテーマです。</p>
              <Figure
                src="image/08-receipt-organize.png"
                alt="左：お店情報のカード（ヘッダ）と品物リストのカード（明細）がバラバラに散らばっている。右：それらを突き合わせて1行ずつにまとめた整然とした一覧表。"
                caption="ヘッダ（お店）と明細（品物）を突き合わせ、1行で意味が分かる一覧に整える"
                kind="concept"
              />
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
          plainText:
            "用途ごとに「棚」を分ける\n取得用と出力用で内部テーブルを分けると頭が整理される。\nDATA lt_bkpf TYPE TABLE OF bkpf. \" ヘッダ取得用\nDATA lt_bseg TYPE TABLE OF bseg. \" 明細取得用\nDATA lt_out TYPE TABLE OF ty_out. \" 出力用（まとめた形）\nAくん：入力（生データ）と出力（整形後）の棚を分けるんですね。役割が混ざらなくて良い設計。\n先生：そう。生データはいじらず、別の棚で整形すると安全です。",
          content: (
            <>
              <h2>用途ごとに「棚」を分ける</h2>
              <p>取得用と出力用で内部テーブルを分けると、頭が整理されます。</p>
              <CodeBlock
                language="ABAP"
                code={`DATA lt_bkpf TYPE TABLE OF bkpf.   " ヘッダ取得用
DATA lt_bseg TYPE TABLE OF bseg.   " 明細取得用
DATA lt_out  TYPE TABLE OF ty_out. " 出力用（まとめた形）`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>lt_bkpf</code> … ヘッダ（BKPF）をそのまま受け取る棚。生データ用
                </li>
                <li>
                  <code>lt_bseg</code> … 明細（BSEG）をそのまま受け取る棚。生データ用
                </li>
                <li>
                  <code>lt_out</code> … ヘッダと明細を合体・整形した結果を入れる棚。出力用
                </li>
              </ul>
              <Dialog speaker="a">
                入力（生データ）と出力（整形後）の棚を分けるんですね。役割が混ざらなくて良い設計です。
              </Dialog>
              <Dialog speaker="teacher">
                そうです。生データはそのまま残し、別の棚で整形すると安全です。元に戻したくなったとき、生データが手元にあると助かります。
              </Dialog>
            </>
          ),
        },
        {
          title: "MOVEと対応づけ",
          plainText:
            "値を移す：MOVE と MOVE-CORRESPONDING\nMOVE a TO b（または b = a）：1つの値を移す\nMOVE-CORRESPONDING：同じ名前の項目をまとめて移す（とても便利）\nMOVE-CORRESPONDING ls_bkpf TO ls_out. \" 同名項目を一気にコピー\nls_out-amount = ls_bseg-dmbtr. \" 個別に1項目だけ移す\n先生：MOVE-CORRESPONDING は名前が一致する欄だけ自動で詰め替える便利屋さん。\nAくん：名前が同じ前提なんですね。違う名前は個別に代入、と。",
          content: (
            <>
              <h2>値を移す：<code>MOVE</code> と <code>MOVE-CORRESPONDING</code></h2>
              <ul>
                <li><code>MOVE a TO b</code>（または <code>b = a</code>）：1つの値を移す</li>
                <li><code>MOVE-CORRESPONDING</code>：<strong>同じ名前の項目</strong>をまとめて移す（とても便利）</li>
              </ul>
              <CodeBlock
                language="ABAP"
                code={`MOVE-CORRESPONDING ls_bkpf TO ls_out.  " 同名項目を一気にコピー
ls_out-amount = ls_bseg-dmbtr.         " 個別に1項目だけ移す`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>MOVE-CORRESPONDING ls_bkpf TO ls_out.</code> … ヘッダから出力用へ、<strong>名前が同じ項目</strong>（伝票番号・日付など）をまとめてコピー
                </li>
                <li>
                  <code>ls_out-amount = ls_bseg-dmbtr.</code> … 名前が違う項目（金額）は1項目ずつ手動で代入
                </li>
              </ul>
              <Dialog speaker="teacher">
                <code>MOVE-CORRESPONDING</code> は「名前が一致する欄だけ自動で詰め替える」便利屋さん。手作業のコピーを減らせます。
              </Dialog>
              <Dialog speaker="a">
                逆に言えば「項目名が同じ」が前提なんですね。名前が違う項目は個別に代入する、と。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。便利ですが万能ではありません。「同名は自動、違う名前は手動」と切り分けて使ってください。
              </Dialog>
            </>
          ),
        },
        {
          title: "蓄える・消す",
          plainText:
            "蓄える・消す：APPEND / CLEAR / REFRESH\nAPPEND ls_out TO lt_out：作った1行を出力テーブルに追加\nCLEAR ls_out：作業領域（1行）を空にする\nREFRESH lt_out：内部テーブル（全行）を空にする\nつまずき：APPEND したあと CLEAR し忘れると前の行の値が次に残る。→ 1行作る → 追加 → クリア をワンセットに。\nBちゃん：使った皿を洗ってから次の料理、ですね。",
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
                使った皿を洗ってから次の料理、みたいな感じですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "図解：取得→対応付け→蓄積",
          plainText:
            "図で見る：まとめる流れ\nflowchart：ヘッダ取得＋明細取得 → 1行を組み立て → APPENDで蓄積 → CLEARして次の行へ → 繰り返し\nこの章のABAPキーワード：MOVE / MOVE-CORRESPONDING / APPEND / CLEAR / REFRESH。",
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
              <Callout variant="tip">
                この章のABAPキーワード：<code>MOVE</code> / <code>MOVE-CORRESPONDING</code> / <code>APPEND</code> / <code>CLEAR</code> / <code>REFRESH</code>。
              </Callout>
            </>
          ),
        },
        {
          title: "ミニ演習",
          plainText:
            "確認質問＆ミニ演習\n先生の問い：1行を組み立てて出力テーブルに足したあと、次の行に進む前にやるべきことは？\nAくん：作業領域を CLEAR します。前の値が残ると混ざるので。\nBちゃん：使った皿を洗ってから次の料理、みたいな感じですね。\n先生：その通り。組み立て→APPEND→CLEAR を口ぐせにすれば混ざる事故はほぼ防げます。",
          content: (
            <>
              <h2>確認質問＆ミニ演習</h2>
              <p><strong>先生の問い：</strong>「1行を組み立てて出力テーブルに足したあと、次の行に進む前にやるべきことは？」</p>
              <Reveal>
                <Dialog speaker="a">
                  作業領域を <code>CLEAR</code> します。前の値が残ると混ざるので。
                </Dialog>
                <Dialog speaker="b">
                  使った皿を洗ってから次の料理、みたいな感じですね。
                </Dialog>
                <Dialog speaker="teacher">
                  その通り！「組み立て→APPEND→CLEAR」を口ぐせにすれば、混ざる事故はほぼ防げます。
                </Dialog>
              </Reveal>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：ヘッダと明細をただ並べるのではなく後続で使える出力構造に組み立てるのが主題。取得用と出力用を分け、1行ずつ作ってAPPENDする流れを崩さない。\nAくん：MOVE-CORRESPONDINGで共通項目をまとめ、差分項目を個別代入する設計が効率的。APPEND後にCLEARすることで前行の残値混入を防げる。\nBちゃん：毎回「組み立てる→追加する→片付ける」の順にするとミスが減ると実感しました。",
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
          plainText:
            "理解度チェック\nQ1 同じ名前の項目をまとめて移すのに便利なのは？→ MOVE-CORRESPONDING\nQ2 1行をAPPENDした後、次の行の前に作業領域を空にする命令は？→ CLEAR\nQ3 内部テーブルを取得用と出力用に分ける主な利点は？→ 役割が分離され整形処理を安全に管理できる\n今日のひとこと：組み立て→追加→クリア。このリズムが身につけば、データ整形はもう得意分野です。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="MOVE-CORRESPONDING は、両者で名前が一致する項目だけをまとめてコピーします。手作業で1項目ずつ代入するより記述漏れを減らせるため、ヘッダ情報の引き継ぎなどで特に有効です。"
                question={<strong>同じ名前の項目をまとめて移すのに便利なのは？</strong>}
                options={["APPEND", "MOVE-CORRESPONDING", "REFRESH"]}
              />
              <Quiz
                answer={2}
                explanation="CLEAR は作業領域（1行）を空にします。APPEND の後にこれを忘れると前の値が残ります。REFRESH はテーブル全体を空にする命令であり、用途を取り違えると必要データまで消してしまう点に注意が必要です。"
                question={<strong>1行をAPPENDした後、次の行の前に作業領域を空にする命令は？</strong>}
                options={["MOVE", "ULINE", "CLEAR"]}
              />
              <Quiz
                answer={0}
                explanation="取得用テーブルと出力用テーブルを分離すると、元データの保持と表示用整形を独立して管理できます。役割を分けることで、仕様変更時にも影響範囲を限定しやすく保守性が上がります。"
                question={<strong>内部テーブルを「取得用」と「出力用」に分ける主な利点は？</strong>}
                options={[
                  "役割が分離され、整形処理を安全に管理できる",
                  "必ず実行速度が2倍になる",
                  "CLEARやAPPENDが不要になる",
                ]}
              />
              <Dialog speaker="closing">
                「組み立て→追加→クリア」。このリズムが身につけば、データ整形はもう得意分野です。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(CombineDataLesson);
