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
            "複数データをまとめる\nバラバラの情報（ヘッダと明細）を、1行ずつ見やすい一覧に整える章です。\n⏱ 25分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・取得用と出力用の「棚」を分ける\n・データを移す命令（MOVE / MOVE-CORRESPONDING）\n・1行ずつ追加・片付け（APPEND / CLEAR / REFRESH）\nBちゃん：前の章まででなんとかついてきたけど…今回は難しそう。\n先生：難しい章です。でも覚えることは3つだけ。棚を分ける→1行を組み立てる→追加して片付ける。\nBちゃん：3つだけなら、深呼吸して挑戦します。",
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
                前の章まででなんとかついてきたけど…「ヘッダと明細を合体」とか、今回は難しそうです。
              </Dialog>
              <Dialog speaker="teacher">
                正直、この章は難易度が上がります。でも覚えることは<strong>3つだけ</strong>です。
                「棚を分ける → 1行を組み立てる → 追加して片付ける」。英語の命令名は後からで大丈夫。
              </Dialog>
              <Callout variant="tip">
                この章の核心：<strong>組み立て → APPEND → CLEAR</strong> のリズム。
                たとえで言えば「1皿盛る → 配膳台に載せる → 使った皿を洗う」を繰り返すだけです。
              </Callout>
              <Dialog speaker="b">
                3つだけなら、深呼吸して挑戦します。レシートを1行ずつきれいに並べる作業、ですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "領収書整理のたとえ",
          plainText:
            "バラバラの情報を、1枚の表にまとめる\nお店の情報（ヘッダ）と買った品物（明細）が別々にあると見づらい。突き合わせて1つの見やすい一覧にするのが今回のテーマ。\nBちゃん：なんで最初から1枚の表になってないんですか？\n先生：DBでは役割ごとに分けて保存する。見やすくするのはプログラムの仕事。\nBちゃん：レシートの「日付・店名」と「商品名・金額」を1行に並べる感じ？\n先生：まさにそれ。バラバラのままだと使いにくいので、後で使える形に整えます。",
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
              <Dialog speaker="b">
                なんで最初から1枚の表になっていないんですか？わざわざ合体させるの、面倒に感じます…。
              </Dialog>
              <Dialog speaker="teacher">
                データベースでは「見出し用」と「中身用」に<strong>役割ごとに分けて保存</strong>します。
                会計では伝票ヘッダ（BKPF）と明細（BSEG）が別テーブルです。
                見やすく整えるのは、プログラム側の仕事——今回学ぶことです。
              </Dialog>
              <Dialog speaker="b">
                レシートの「日付・店名」と「商品名・金額」を1行に並べる感じ、ですか？
              </Dialog>
              <Dialog speaker="teacher">
                まさにそれです。1つの伝票に明細が3行あれば、出力は<strong>3行</strong>になります。
                ヘッダの情報（日付・会社など）は各行に繰り返し載せて、バラバラのまま使えない状態から解放します。
              </Dialog>
            </>
          ),
        },
        {
          title: "複数テーブルの使い分け",
          plainText:
            "用途ごとに「棚」を分ける\n取得用（生データ）と出力用（整えた一覧）で棚を分けると頭が整理される。\nDATA lt_bkpf TYPE TABLE OF bkpf. \" ヘッダ取得用\nDATA lt_bseg TYPE TABLE OF bseg. \" 明細取得用\nDATA lt_out TYPE TABLE OF ty_out. \" 出力用（まとめた形）\nBちゃん：lt_ と ls_ の違い、まだ混乱します…\n先生：lt_＝複数行の棚、ls_＝1行だけの机。第5章の復習です。\nBちゃん：生の食材用ボウルと、盛り付け用の皿を分ける感じ？\n先生：その通り。生データは触らず、別の棚で整えると安全です。",
          content: (
            <>
              <h2>用途ごとに「棚」を分ける</h2>
              <p>
                <strong>取得用（生データ）</strong>と<strong>出力用（整えた一覧）</strong>で棚を分けると、頭が整理されます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`DATA lt_bkpf TYPE TABLE OF bkpf.   " ヘッダ取得用（複数行の棚）
DATA lt_bseg TYPE TABLE OF bseg.   " 明細取得用（複数行の棚）
DATA lt_out  TYPE TABLE OF ty_out. " 出力用（まとめた形の棚）

DATA ls_bkpf TYPE bkpf.            " ヘッダ1行（机）
DATA ls_bseg TYPE bseg.            " 明細1行（机）
DATA ls_out  TYPE ty_out.          " 出力1行（机）`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>lt_bkpf</code> … ヘッダをそのまま受け取る棚（生データ・複数行）
                </li>
                <li>
                  <code>lt_bseg</code> … 明細をそのまま受け取る棚（生データ・複数行）
                </li>
                <li>
                  <code>lt_out</code> … ヘッダと明細を合体した結果を入れる棚（出力用・複数行）
                </li>
                <li>
                  <code>ls_bkpf</code> / <code>ls_bseg</code> / <code>ls_out</code> … 組み立て作業用の机（1行ずつ触る）
                </li>
              </ul>
              <Dialog speaker="b">
                <code>lt_</code> と <code>ls_</code> の違い、まだ混乱します…。どっちが棚で、どっちが机でしたっけ？
              </Dialog>
              <Dialog speaker="teacher">
                第5章の復習です。<code>lt_</code>（L<strong>T</strong>able）＝<strong>複数行の棚</strong>、
                <code>ls_</code>（L<strong>S</strong>tructure）＝<strong>1行だけの机</strong>。
                組み立ては机の上で行い、できあがった行を棚（<code>lt_out</code>）へ載せます。
              </Dialog>
              <Dialog speaker="b">
                生の食材用ボウル（取得用）と、盛り付け用の皿（出力用）を分ける感じ？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。生データのボウルは<strong>そのまま残す</strong>。別の皿で整えるので、
                間違えても元に戻せます。出力用の形（<code>ty_out</code>）は「盛り付けのデザイン」——
                載せたい項目だけを決めた設計図です。
              </Dialog>
              <Dialog speaker="stumble">
                取得用テーブルを直接書き換えると、元データが汚れて原因調査が難しくなります。
                「読む用」と「作る用」は必ず分けましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "MOVEと対応づけ",
          plainText:
            "値を移す：MOVE と MOVE-CORRESPONDING\nMOVE a TO b（または b = a）：1つの値を移す\nMOVE-CORRESPONDING：同じ名前の項目をまとめて移す（とても便利）\nMOVE-CORRESPONDING ls_bkpf TO ls_out. \" 同名項目を一気にコピー\nls_out-amount = ls_bseg-dmbtr. \" 名前が違う項目は1つずつ移す\nBちゃん：同名だけ自動って、名前が合ってないと移らないんですね。\n先生：その通り。違う名前は手で1つずつ。amount と dmbtr は同じ「金額」でも名前が違う。\nBちゃん：同じラベルの引き出しから、中身をまとめて移す感じ？\n先生：完璧。同名は MOVE-CORRESPONDING、違う名前は手動、と覚えてください。",
          content: (
            <>
              <h2>値を移す：<code>MOVE</code> と <code>MOVE-CORRESPONDING</code></h2>
              <p>
                1行を組み立てるとき、「ヘッダから日付をコピー」「明細から金額をコピー」と
                <strong>項目ごとに値を移します</strong>。
              </p>
              <ul>
                <li><code>MOVE a TO b</code>（または <code>b = a</code>）：1つの値を移す</li>
                <li>
                  <code>MOVE-CORRESPONDING</code>：<strong>同じ名前の項目</strong>をまとめて移す（とても便利）
                </li>
              </ul>
              <CodeBlock
                language="ABAP"
                code={`" ① ヘッダから、名前が同じ項目をまとめてコピー
MOVE-CORRESPONDING ls_bkpf TO ls_out.

" ② 名前が違う項目は、1つずつ手動で移す
ls_out-amount = ls_bseg-dmbtr.   " 出力側=amount、明細側=dmbtr`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>MOVE-CORRESPONDING ls_bkpf TO ls_out.</code> … ヘッダから出力用へ、
                  <strong>名前が同じ項目</strong>（伝票番号 <code>belnr</code>・日付 <code>budat</code> など）をまとめてコピー
                </li>
                <li>
                  <code>ls_out-amount = ls_bseg-dmbtr.</code> … 意味は同じ「金額」でも、
                  出力側は <code>amount</code>、明細側は <code>dmbtr</code> と<strong>名前が違う</strong>ので手動で移す
                </li>
              </ul>
              <Dialog speaker="b">
                「同名だけ自動」って、名前が合っていない項目は移らないんですね…。
                全部 <code>MOVE-CORRESPONDING</code> だけで済まないの、最初は残念に感じました。
              </Dialog>
              <Dialog speaker="teacher">
                その気持ち、よく分かります。でも表ごとに項目名が違うのは日常です。
                <code>amount</code> と <code>dmbtr</code> はどちらも「金額」——名前が違うだけ。
                だから<strong>同名は自動、違う名前は手動</strong>の2段構えになります。
              </Dialog>
              <Dialog speaker="b">
                同じラベルの引き出しから、中身をまとめて移す感じ？
              </Dialog>
              <Dialog speaker="teacher">
                完璧なたとえです。ラベル（項目名）が一致する引き出しだけ一気に移せます。
                ラベルが違う引き出しは、1つずつ手で移してください。
              </Dialog>
            </>
          ),
        },
        {
          title: "蓄える・消す",
          plainText:
            "蓄える・消す：APPEND / CLEAR / REFRESH\nAPPEND ls_out TO lt_out：作った1行を出力テーブルに追加\nCLEAR ls_out：作業領域（1行）を空にする\nREFRESH lt_out：内部テーブル（全行）を空にする\nBちゃん：CLEAR と REFRESH、どっちが何を消すのか混同しそう…\n先生：CLEAR＝机1枚、REFRESH＝棚全体。今回のループでは CLEAR が主役。\nつまずき：APPEND したあと CLEAR し忘れると前の行の値が次に残る。\nBちゃん：使った皿を洗ってから次の料理、ですね。\n先生：完璧なたとえ。組み立て→追加→クリアを口ぐせに。",
          content: (
            <>
              <h2>蓄える・消す：<code>APPEND</code> / <code>CLEAR</code> / <code>REFRESH</code></h2>
              <ul>
                <li><code>APPEND ls_out TO lt_out</code>：作った1行を出力テーブル（棚）に追加</li>
                <li><code>CLEAR ls_out</code>：作業領域（<strong>机の1行</strong>）を空にする</li>
                <li><code>REFRESH lt_out</code>：内部テーブル（<strong>棚の全行</strong>）を空にする</li>
              </ul>
              <Dialog speaker="b">
                <code>CLEAR</code> と <code>REFRESH</code>、どっちが何を消すのか、いつも混同しそうです…。
              </Dialog>
              <Dialog speaker="teacher">
                覚え方はシンプルです。<code>CLEAR</code>＝<strong>机1枚</strong>を拭く（<code>ls_</code>）。
                <code>REFRESH</code>＝<strong>棚全体</strong>を空にする（<code>lt_</code>）。
                今回の「1行ずつ組み立てる」ループでは、毎回使うのは <code>CLEAR</code> です。
              </Dialog>
              <Dialog speaker="stumble">
                <code>APPEND</code> したあと <code>CLEAR</code> し忘れると、前の行の値が次の行に<strong>残って混ざる</strong>。
                原因が分かりにくいバグの代表例です。→ 「1行作る → 追加 → クリア」をワンセットに。
              </Dialog>
              <Dialog speaker="b">
                使った皿（<code>ls_out</code>）を洗ってから次の料理、ですね。
                <code>REFRESH</code> は「配膳台ごと全部片付ける」——最初からやり直すとき用、と理解しました。
              </Dialog>
              <Dialog speaker="teacher">
                完璧なたとえです。「組み立て → 追加 → クリア」を口ぐせにすれば、混ざる事故はほぼ防げます。
              </Dialog>
            </>
          ),
        },
        {
          title: "LOOPの中で組み立てる",
          plainText:
            "実際の流れ：LOOPの中で1行ずつ\nLOOP AT lt_bseg INTO ls_bseg. READ TABLE lt_bkpf INTO ls_bkpf WITH KEY ... MOVE-CORRESPONDING ls_bkpf TO ls_out. ls_out-amount = ls_bseg-dmbtr. APPEND ls_out TO lt_out. CLEAR ls_out. ENDLOOP.\nBちゃん：明細を1行ずつめくりながら、対応するヘッダを探して盛り付ける？\n先生：その通り。明細1行につき出力1行。これがこの章の実務パターン。\nBちゃん：中身は長いけど、やってることは「組み立て→追加→クリア」の繰り返しだけ？\n先生：まさに。コードが長く見えても中身は同じリズム。",
          content: (
            <>
              <h2>実際の流れ：<code>LOOP</code> の中で1行ずつ</h2>
              <p>
                ここまでの命令が、<code>LOOP</code> の中で<strong>1行ずつ繰り返されます</strong>。
                全体像を一度見てから、中身を1行ずつ読みましょう。
              </p>
              <CodeBlock
                language="ABAP"
                code={`LOOP AT lt_bseg INTO ls_bseg.          " 明細を1行ずつ机へ

  READ TABLE lt_bkpf INTO ls_bkpf         " 対応するヘッダを1行取得
    WITH KEY bukrs = ls_bseg-bukrs
             belnr = ls_bseg-belnr
             gjahr = ls_bseg-gjahr.
  IF sy-subrc <> 0. CONTINUE. ENDIF.      " 見つからなければ次の明細へ

  MOVE-CORRESPONDING ls_bkpf TO ls_out.   " ヘッダの同名項目をコピー
  ls_out-amount = ls_bseg-dmbtr.          " 金額は手動で移す

  APPEND ls_out TO lt_out.                " できた1行を出力棚へ
  CLEAR ls_out.                           " 机を空にして次の行へ

ENDLOOP.`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>LOOP AT lt_bseg INTO ls_bseg.</code> … 明細棚から1行ずつ机へ（第5章の <code>LOOP</code>）
                </li>
                <li>
                  <code>READ TABLE ... WITH KEY ...</code> … いまの明細に対応するヘッダを1行だけ取得
                </li>
                <li>
                  <code>MOVE-CORRESPONDING</code> ＋ 個別代入 … 机の上で1行を組み立て
                </li>
                <li>
                  <code>APPEND</code> → <code>CLEAR</code> … 出力棚へ載せて、机を片付け
                </li>
              </ul>
              <Dialog speaker="b">
                明細を1行ずつめくりながら、対応するヘッダを探して盛り付ける——
                トランプをめくりながら、ペアのカードを探す感じ？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。明細1行につき、出力も1行。
                ヘッダは <code>READ TABLE</code> で「この明細の親」を1行だけ取り出します。
              </Dialog>
              <Dialog speaker="b">
                コードは長く見えますけど、やってることは「組み立て → 追加 → クリア」の繰り返しだけ、ですね？
              </Dialog>
              <Dialog speaker="teacher">
                まさにそれです。命令が増えて見えても、<strong>リズムは1つ</strong>。
                怖がらず、1ブロックずつ「何をしているか」を声に出して読んでみてください。
              </Dialog>
            </>
          ),
        },
        {
          title: "図解：取得→対応付け→蓄積",
          plainText:
            "図で見る：まとめる流れ\nflowchart：ヘッダ取得＋明細取得 → 1行を組み立て → APPENDで蓄積 → CLEARして次の行へ → 繰り返し\nBちゃん：材料を取る→1皿盛る→追加→皿を洗う、を繰り返すだけ？\n先生：その通り。このリズムがこの章の核心。\nBちゃん：図とコード、両方見ると頭の中でつながりました。",
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
                その通り。このリズムがこの章の核心です。前のスライドのコードも、
                この図の <code>C → D → E → C</code> を <code>LOOP</code> の中で回しているだけです。
              </Dialog>
              <Dialog speaker="b">
                図とコード、両方見ると頭の中でつながりました。単独だと難しかったです…。
              </Dialog>
              <Callout variant="tip">
                この章のABAPキーワード：<code>MOVE</code> / <code>MOVE-CORRESPONDING</code> / <code>APPEND</code> / <code>CLEAR</code> / <code>REFRESH</code>。
                全部覚えなくてOK。まずは <strong>組み立て → APPEND → CLEAR</strong> だけ口ぐせに。
              </Callout>
            </>
          ),
        },
        {
          title: "ミニ演習",
          plainText:
            "確認質問＆ミニ演習\n先生の問い：1行を組み立てて出力テーブルに足したあと、次の行に進む前にやるべきことは？\nBちゃん：えっと…追加したら次の材料を載せる前に、使った皿を洗う…つまり CLEAR？\n先生：正解！組み立て→APPEND→CLEAR を口ぐせにすれば混ざる事故はほぼ防げます。\nBちゃん：最初は APPEND だけで終わっちゃいそうでした。クリア、忘れやすい。",
          content: (
            <>
              <h2>確認質問＆ミニ演習</h2>
              <p><strong>先生の問い：</strong>「1行を組み立てて出力テーブルに足したあと、次の行に進む前にやるべきことは？」</p>
              <Dialog speaker="b">
                えっと…追加したら、次の材料を載せる前に、使った皿を洗う…つまり <code>CLEAR</code>、ですか？
              </Dialog>
              <Reveal>
                <Dialog speaker="teacher">
                  正解！「組み立て → APPEND → CLEAR」を口ぐせにすれば、混ざる事故はほぼ防げます。
                </Dialog>
                <Dialog speaker="b">
                  最初は <code>APPEND</code> だけで終わっちゃいそうでした。
                  「追加したら必ず片付け」——メモしておきます。
                </Dialog>
              </Reveal>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\nBちゃん：最初は難しかったけど、棚を分けて1行ずつ組み立て→追加→片付け、の流れは掴めました。\n先生：同名は MOVE-CORRESPONDING、違う名前は手動。取得用は触らない。\nAくん：取得用を残したまま整形できるので、仕様変更にも強い設計ですね。\nBちゃん：命令名はまだ覚えきれないけど、たとえがあれば読めそう。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="b">
                最初は「ヘッダと明細を合体」と聞いて途方に暮れましたけど、
                生データ用の棚と出力用の棚を分けて、1行ずつ「組み立て → 追加 → 片付け」——
                この流れなら、もう一度やれそうです。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。細かい点は3つだけ。
                ① 同名項目は <code>MOVE-CORRESPONDING</code>、違う名前は手動で移す。
                ② 取得用テーブルは触らない。③ <code>APPEND</code> のあとは必ず <code>CLEAR</code>。
              </Dialog>
              <Dialog speaker="a">
                取得用を残したまま整形できるので、仕様変更にも強い設計ですね。
              </Dialog>
              <Dialog speaker="b">
                命令名はまだ全部覚えきれませんけど、「食材ボウルと盛り付け皿」「皿を洗う」
                みたいなたとえがあれば、コードを読むときの道しるべになりそうです。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 同じ名前の項目をまとめて移すのに便利なのは？→ MOVE-CORRESPONDING\nQ2 1行をAPPENDした後、次の行の前に作業領域を空にする命令は？→ CLEAR\nQ3 内部テーブルを取得用と出力用に分ける主な利点は？→ 役割が分離され整形処理を安全に管理できる\nBちゃん：組み立て→追加→クリア。このリズムが身につけば、難しい章も乗り越えられそうです。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="MOVE-CORRESPONDING は、両者で名前が一致する項目だけをまとめてコピーします。Bちゃんのたとえで言えば「同じラベルの引き出しから中身をまとめて移す」命令です。名前が違う項目（amount と dmbtr など）は自動では移りません。"
                question={<strong>同じ名前の項目をまとめて移すのに便利なのは？</strong>}
                options={["APPEND", "MOVE-CORRESPONDING", "REFRESH"]}
              />
              <Quiz
                answer={2}
                explanation="CLEAR は作業領域（1行・机）を空にします。APPEND の後にこれを忘れると前の値が残ります。Bちゃんのたとえで言えば「使った皿を洗う」作業です。REFRESH は棚全体を空にするので、今回のループでは使いません。"
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
                「組み立て → 追加 → クリア」。このリズムが身につけば、
                難しい章も、たとえを頼りに乗り越えられそうです。次の章も頑張ります！
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(CombineDataLesson);
