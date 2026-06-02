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
  LessonLinkButton,
  horizontalLineClasses,
  horizontalLineBorderColor,
  mountLesson,
} from "../../src/lesson";
import type { ReactNode } from "react";
import { cn } from "../../src/lib/cn";

export const lessonMeta = {
  title: "レポート制御（基本）— サプレスとAT NEW/END OF",
  meta: "初学者 · 20分",
};

const SUPPRESS_SAMPLE_ROWS = [
  { prefecture: "東京都", name: "田中" },
  { prefecture: "東京都", name: "佐藤" },
  { prefecture: "東京都", name: "鈴木" },
  { prefecture: "大阪府", name: "山田" },
  { prefecture: "大阪府", name: "伊藤" },
] as const;

const SUPPRESS_MULTI_COLUMN_ROWS = [
  { bukrs: "1000", gjahr: "2025", blart: "SA", belnr: "900001", amount: "150,000" },
  { bukrs: "1000", gjahr: "2025", blart: "SA", belnr: "900002", amount: "28,000" },
  { bukrs: "1000", gjahr: "2025", blart: "KR", belnr: "900003", amount: "12,500" },
  { bukrs: "1000", gjahr: "2026", blart: "SA", belnr: "900004", amount: "9,800" },
  { bukrs: "2000", gjahr: "2026", blart: "SA", belnr: "900005", amount: "18,300" },
] as const;

/** SORT 前後の対比：同じ5行、並び順だけ違う */
const SORT_UNSORTED_ROWS = [
  { bukrs: "1000", belnr: "100001", amount: "158,000" },
  { bukrs: "2000", belnr: "100002", amount: "6,750" },
  { bukrs: "1000", belnr: "100003", amount: "8,900" },
  { bukrs: "2000", belnr: "100004", amount: "4,200" },
  { bukrs: "1000", belnr: "100005", amount: "2,480" },
] as const;

const SORT_SORTED_ROWS = [
  { bukrs: "1000", belnr: "100001", amount: "158,000", control: "AT NEW" },
  { bukrs: "1000", belnr: "100003", amount: "8,900", control: "" },
  { bukrs: "1000", belnr: "100005", amount: "2,480", control: "AT END OF" },
  { bukrs: "2000", belnr: "100002", amount: "6,750", control: "AT NEW" },
  { bukrs: "2000", belnr: "100004", amount: "4,200", control: "AT END OF" },
] as const;

/** AT制御の4イベント — いつ・何をするかの早見表 */
const AT_EVENT_GUIDE = [
  { event: "AT FIRST", when: "LOOPの1行目だけ", output: "全体見出し・初期化" },
  { event: "AT NEW 項目", when: "その項目が前行と違う行", output: "グループ見出し" },
  { event: "AT END OF 項目", when: "その項目が次行と違う行", output: "小計・区切り" },
  { event: "AT LAST", when: "LOOPの最終行だけ", output: "総合計・後処理" },
] as const;

/** LOOP 1周ごとに実行される命令（SORT済み5行・会社コード制御） */
const CONTROL_LOOP_TRACE_ROWS = [
  {
    loop: 1,
    bukrs: "1000",
    belnr: "100001",
    amount: "158,000",
    fired: ["AT FIRST", "AT NEW bukrs", "WRITE 明細"],
    note: "先頭行 → 全体見出し＋会社1000見出し＋明細",
  },
  {
    loop: 2,
    bukrs: "1000",
    belnr: "100003",
    amount: "8,900",
    fired: ["WRITE 明細"],
    note: "同じ会社の続き。境界ではない",
  },
  {
    loop: 3,
    bukrs: "1000",
    belnr: "100005",
    amount: "2,480",
    fired: ["WRITE 明細", "AT END OF bukrs"],
    note: "次行が2000に変わる → 会社1000の小計",
  },
  {
    loop: 4,
    bukrs: "2000",
    belnr: "100002",
    amount: "6,750",
    fired: ["AT NEW bukrs", "WRITE 明細"],
    note: "前行と会社が違う → 会社2000見出し＋明細",
  },
  {
    loop: 5,
    bukrs: "2000",
    belnr: "100004",
    amount: "4,200",
    fired: ["WRITE 明細", "AT END OF bukrs", "AT LAST"],
    note: "最終行 → 小計＋総合計",
  },
] as const;

const CONTROL_OUTPUT_ROWS = [
  { line: "会社別 一覧", bukrs: "—", belnr: "—", amount: "—", trigger: "AT FIRST" },
  { line: "■ 会社: 1000", bukrs: "1000", belnr: "—", amount: "—", trigger: "AT NEW bukrs" },
  { line: "明細", bukrs: "1000", belnr: "100001", amount: "158,000", trigger: "通常行" },
  { line: "明細", bukrs: "1000", belnr: "100003", amount: "8,900", trigger: "通常行" },
  { line: "明細", bukrs: "1000", belnr: "100005", amount: "2,480", trigger: "通常行" },
  { line: "小計", bukrs: "1000", belnr: "—", amount: "169,380", trigger: "AT END OF bukrs" },
  { line: "■ 会社: 2000", bukrs: "2000", belnr: "—", amount: "—", trigger: "AT NEW bukrs" },
  { line: "明細", bukrs: "2000", belnr: "100002", amount: "6,750", trigger: "通常行" },
  { line: "明細", bukrs: "2000", belnr: "100004", amount: "4,200", trigger: "通常行" },
  { line: "小計", bukrs: "2000", belnr: "—", amount: "10,950", trigger: "AT END OF bukrs" },
  { line: "== 総合計 ==", bukrs: "—", belnr: "—", amount: "180,330", trigger: "AT LAST" },
] as const;

function isSplitGroupRow(rows: readonly { bukrs: string }[], index: number): boolean {
  const bukrs = rows[index].bukrs;
  const seenBefore = rows.slice(0, index).some((row) => row.bukrs === bukrs);
  if (seenBefore && (index === 0 || rows[index - 1].bukrs !== bukrs)) {
    return true;
  }
  const appearsLater = rows.slice(index + 1).some((row) => row.bukrs === bukrs);
  if (appearsLater && (index === rows.length - 1 || rows[index + 1].bukrs !== bukrs)) {
    return true;
  }
  return false;
}

function SampleTable({
  caption,
  variant = "default",
  children,
}: {
  caption: string;
  variant?: "warn" | "ok" | "default";
  children: ReactNode;
}) {
  const captionClass =
    variant === "warn"
      ? "text-amber-800 dark:text-amber-200"
      : variant === "ok"
        ? "text-emerald-800 dark:text-emerald-200"
        : "text-slate-600 dark:text-slate-300";

  return (
    <figure className="not-prose my-4">
      <figcaption className={`mb-2 text-sm font-medium ${captionClass}`}>{caption}</figcaption>
      <div
        className={cn(
          "overflow-x-auto rounded-lg border shadow-sm",
          horizontalLineBorderColor
        )}
      >
        <table className="w-full min-w-0 border-collapse text-left text-sm">{children}</table>
      </div>
    </figure>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th
      className={cn(
        horizontalLineClasses("strong"),
        "bg-slate-100 px-3 py-2 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  highlight = false,
  muted = false,
}: {
  children: ReactNode;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <td
      className={cn(
        horizontalLineClasses("normal"),
        "px-3 py-2",
        highlight && "bg-amber-100/80 text-amber-950 dark:bg-amber-500/15 dark:text-amber-100",
        muted && "text-slate-400 dark:text-slate-500"
      )}
    >
      {children}
    </td>
  );
}

function FiredCommands({ commands }: { commands: readonly string[] }) {
  return (
    <ul className="m-0 list-none space-y-1 p-0">
      {commands.map((cmd) => (
        <li key={cmd}>
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">{cmd}</code>
        </li>
      ))}
    </ul>
  );
}

/** 基本編の最後から応用編へ誘導するリンク */
function AdvancedLink() {
  return (
    <div className="mt-4 flex flex-wrap justify-end gap-2">
      <LessonLinkButton
        courseSlug="abap-taining"
        lessonFile="09-control-flow-advanced"
        label="応用編へ進む（フラグ・設計・AT制御の仕組み）"
        variant="forward"
      />
    </div>
  );
}

export default function ControlFlowLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-training", "09-control-flow", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "制御の考え方（基本編）\n同じ見出しを繰り返さない「サプレス」、キーの変わり目で処理を分ける「AT 制御」を学びます。\n⏱ 20分 / 📶 初学者 / 🏷 ABAP研修\nこの基本編で学ぶこと\n・サプレス（＝同じ表示を繰り返さないこと）の考え方\n・並びの「変わり目」で処理する制御（AT FIRST / AT LAST / AT NEW / AT END OF）\n・制御の前提となる SORT（並べ替え）\nフラグ・SY-SUBRCとの使い分け・多重ネスト回避・AT制御の内部（IF版）は応用編で扱います。",
          content: (
            <>
              <hgroup>
                <h1>制御の考え方（基本編）</h1>
                <p>同じ見出しを繰り返さない「サプレス」、キーの変わり目で処理を分ける「AT 制御」を学びます。</p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "20分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <h3>この基本編で学ぶこと</h3>
              <ul>
                <li>サプレス（＝同じ表示を繰り返さないこと）の考え方</li>
                <li>並びの「変わり目」で処理する制御（<code>AT FIRST</code> / <code>AT LAST</code> / <code>AT NEW</code> / <code>AT END OF</code>）</li>
                <li>制御の前提となる <code>SORT</code>（並べ替え）</li>
              </ul>
              <h3>この章の2つの工夫</h3>
              <div className="not-prose my-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                  <p className="mb-1 text-sm font-semibold text-slate-800 dark:text-slate-100">① サプレス</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <strong>同じ見出しを繰り返さない</strong>。前行と同じ値なら表示を消す（見た目の整理）。
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                  <p className="mb-1 text-sm font-semibold text-slate-800 dark:text-slate-100">② AT制御</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <strong>変わり目で別の処理をする</strong>。見出し・小計・総合計を、境界のタイミングだけ差し込む。
                  </p>
                </div>
              </div>
              <Callout variant="tip">
                ①と②は別物です。サプレスは「消す」、AT制御は「足す（見出しや小計を追加する）」。両方とも<strong>先に SORT</strong>しておくのが共通の前提です。
                フラグ（旗）・<code>SY-SUBRC</code> との使い分け・多重ネストの回避・<code>AT</code> 制御の内部の仕組み（IF版）は、続編の
                <strong>応用編</strong>で扱います（このページ末尾と確認テストの後にリンクがあります）。
              </Callout>
              <Dialog speaker="b">
                先生、「サプレス」と「AT制御」って名前が難しくて、どう違うのか見分けがつきません……。
              </Dialog>
              <Dialog speaker="teacher">
                いい質問です。ひとことで言うと、サプレスは「消す」、AT制御は「足す」。表をすっきり見せたいか、見出しや小計の行を差し込みたいか、で選びます。まずサプレス、次にAT制御の順で、一つずつ見ていきましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "サプレスのたとえ",
          plainText:
            "同じ見出しを何度も書かない\n名簿で東京都 田中／東京都 佐藤／東京都 鈴木と毎行書くより、最初の1回だけ東京都と出してあとは省くほうが見やすい。これがサプレス＝同じ表示を繰り返さないこと。\n先生：用語は難しそうでも中身は重複する見出しを省いて見やすくするだけ。日常でも自然にやっている。\nBちゃん：時刻表で9時台とまとめて分だけ並べるのと同じですね。あれなら分かります！\nAくん：データ的には「直前の行と同じ値なら出さない」という判定ですね。",
          content: (
            <>
              <h2>同じ見出しを何度も書かない</h2>
              <p>名簿で「東京都 田中」「東京都 佐藤」「東京都 鈴木」と毎行「東京都」を書くより、最初の1回だけ「東京都」と出して、あとは省くほうが見やすいですよね。これが<strong>サプレス＝同じ表示を繰り返さないこと</strong>です。</p>
              <div className="not-prose my-4 grid grid-cols-2 gap-4 [&>figure]:my-0">
                <SampleTable caption="❌ サプレス前：都道府県が毎行繰り返される" variant="warn">
                  <thead>
                    <tr>
                      <Th>都道府県</Th>
                      <Th>氏名</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {SUPPRESS_SAMPLE_ROWS.map((row, i) => {
                      const isRepeat = i > 0 && row.prefecture === SUPPRESS_SAMPLE_ROWS[i - 1].prefecture;
                      return (
                        <tr key={row.name}>
                          <Td highlight={isRepeat}>{row.prefecture}</Td>
                          <Td>{row.name}</Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </SampleTable>
                <SampleTable caption="✅ サプレス後：変わった行だけ都道府県を表示" variant="ok">
                  <thead>
                    <tr>
                      <Th>都道府県</Th>
                      <Th>氏名</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {SUPPRESS_SAMPLE_ROWS.map((row, i) => {
                      const isRepeat = i > 0 && row.prefecture === SUPPRESS_SAMPLE_ROWS[i - 1].prefecture;
                      return (
                        <tr key={row.name}>
                          <Td muted={isRepeat}>{isRepeat ? "—" : row.prefecture}</Td>
                          <Td>{row.name}</Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </SampleTable>
              </div>
              <Dialog speaker="a">
                先生、これってデータ的には何を判定しているんですか？
              </Dialog>
              <Dialog speaker="teacher">
                「直前の行と同じ値か？」を見るだけです。同じなら出さない、違えば出す。用語は難しそうでも、日常でも自然にやっていることですよ。
              </Dialog>
              <Dialog speaker="b">
                時刻表で「9時台」とまとめて、分だけ並べるのと同じですか？
              </Dialog>
              <Dialog speaker="teacher">
                まさにそれです。その「変わったかどうか」を見るのが、次に出てくる制御の考え方にもつながります。
              </Dialog>
            </>
          ),
        },
        {
          title: "サプレスを複数列に適用",
          plainText:
            "サプレスの最小ロジック\n基本：『前行と同じなら出さない、違えば出す』。\n表示イメージ（会社・年度・伝票タイプ）→ 手順4つ（SORT・コピーして見出しをCLEAR・AT NEW 列名で戻す・WRITE）。\nAT NEWなら前の行を自分で見比べる処理は不要。階層は自動。\nBちゃん：表がすっきり、コードは？先生：次スライドで部品ごとに書く。",
          content: (
            <>
              <h2>まずはサプレスの最小ロジック</h2>
              <p>
                サプレスはシンプルです。<strong>「前行と同じなら出さない、違えば出す」</strong>。まず1列で理解してから、テーブルの複数列に広げます。
              </p>
              <h3>表示イメージ（複数列サプレス）</h3>
              <p>
                会社・年度・伝票タイプのように<strong>列に上下関係（階層）</strong>があるとき、左（上位）から順に「同じなら消す」と、次のような表になります。
              </p>
              <SampleTable caption="✅ 会社・年度・伝票タイプを段階的にサプレス" variant="ok">
                <thead>
                  <tr>
                    <Th>会社</Th>
                    <Th>年度</Th>
                    <Th>伝票タイプ</Th>
                    <Th>伝票</Th>
                    <Th>金額</Th>
                  </tr>
                </thead>
                <tbody>
                  {SUPPRESS_MULTI_COLUMN_ROWS.map((row, i) => {
                    const previous = i > 0 ? SUPPRESS_MULTI_COLUMN_ROWS[i - 1] : null;
                    const suppressBukrs = !!previous && previous.bukrs === row.bukrs;
                    const suppressGjahr =
                      !!previous && suppressBukrs && previous.gjahr === row.gjahr;
                    const suppressBlart =
                      !!previous && suppressGjahr && previous.blart === row.blart;

                    return (
                      <tr key={row.belnr}>
                        <Td muted={suppressBukrs}>{suppressBukrs ? "—" : row.bukrs}</Td>
                        <Td muted={suppressGjahr}>{suppressGjahr ? "—" : row.gjahr}</Td>
                        <Td muted={suppressBlart}>{suppressBlart ? "—" : row.blart}</Td>
                        <Td>{row.belnr}</Td>
                        <Td>{row.amount}</Td>
                      </tr>
                    );
                  })}
                </tbody>
              </SampleTable>
              <Dialog speaker="b">
                表の見た目、すごくすっきりしました。これをコードでどう作るんですか？
              </Dialog>
              <Dialog speaker="teacher">
                いい流れです。まず<strong>見た目</strong>を押さえて、次のスライドで手順どおりにコードを<strong>部品ごと</strong>に書いていきます。
              </Dialog>
              <h3>この考え方をテーブルに適用する（手順）</h3>
              <p>
                ABAP には「列が変わった行」を自動で教えてくれる <code>AT NEW 列名</code> があります。これを使えば、前行を自分で覚える必要も、<code>IF</code> を重ねる必要もありません。次のスライドでは、この4ステップを順に書きます。
              </p>
              <ol>
                <li>
                  <code>SORT</code> … サプレス対象の列を左（上位）から順に並べる
                </li>
                <li>
                  <code>ls_disp</code> に表示用コピーを作り、見出し列をいったんすべて <code>CLEAR</code>（消した状態から始める）
                </li>
                <li>
                  <code>AT NEW 列名</code> … その列が変わった行だけ、値を戻して表示する
                </li>
                <li>
                  <code>ls_disp</code> を <code>WRITE</code> で出力する
                </li>
              </ol>
              <Callout variant="tip">
                <code>AT NEW gjahr</code> は「年度が変わった行」だけでなく「<strong>会社が変わった行</strong>」でも発火します（並べ替えキーの左側が変われば、右側も一緒に変わるため）。この<strong>階層が自動</strong>なのが <code>AT NEW</code> の利点です。
                なお、伝票番号・金額など<strong>明細列</strong>はサプレスせず、毎行そのまま出力します。
              </Callout>
            </>
          ),
        },
        {
          title: "サプレスのコード（部品ごと）",
          plainText:
            "サプレスのコード（部品ごと）\n①SORT ②ty_outを階層順で定義しコピー＆見出しCLEAR ③AT NEW bukrsで会社表示 ④AT NEW gjahrで年度 ⑤AT NEW blartで伝票タイプ ⑥WRITE。\nAくん：前の行と手で比べる処理が無いけど大丈夫？先生：AT NEWが変わり目を自動判定。\nBちゃん：AT NEW gjahrはなぜ会社が変わっただけでも発火？先生：AT NEW fは構造でfより左の項目が変わっても発火。4→5行目で年度2026のままでも会社1000→2000で再表示。\nBちゃん：ty_outの並び順もそろえる？先生：その通り。構造の定義順とSORTの順を一致させるのが鉄則。\nBちゃん：住所の比喩。",
          content: (
            <>
              <h2>サプレスのコード（部品ごと）</h2>
              <p>
                前のスライドの表と手順4つを、次のとおり<strong>小さな塊</strong>に分けて書きます。上から順に読んでください。
              </p>

              <h3>① 並べ替え（SORT）</h3>
              <p>
                同じ会社・年度が連続しないと <code>AT NEW</code> の「変わり目」判定が狂います。サプレスする列を<strong>左（上位）から</strong>並べます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`SORT lt_out BY bukrs gjahr blart belnr.`}
              />

              <h3>② 表示用コピーを作り見出し列を消す</h3>
              <p>
                <code>ls_disp</code> は画面に出す用のコピー。毎周、まず <code>ls_out</code> をコピーし、見出し列（会社・年度・伝票タイプ）を<strong>いったんすべて消した</strong>状態から始めます。
              </p>
              <p>
                行の型 <code>ty_out</code> は、サプレスの<strong>階層と同じ順（会社→年度→伝票タイプ→…）</strong>で項目を並べておきます。後述のとおり <code>AT NEW</code> はこの<strong>定義順</strong>を見て「上位／下位」を判断します。
              </p>
              <CodeBlock
                language="ABAP"
                code={`TYPES: BEGIN OF ty_out,
         bukrs TYPE bukrs,     " 上位
         gjahr TYPE gjahr,     " 中位
         blart TYPE blart,     " 下位
         belnr TYPE belnr_d,
         amount TYPE dmbtr,
       END OF ty_out.

DATA ls_disp TYPE ty_out.

LOOP AT lt_out INTO ls_out.
  ls_disp = ls_out.
  CLEAR: ls_disp-bukrs, ls_disp-gjahr, ls_disp-blart.`}
              />

              <h3>③ 会社が変わった行だけ表示</h3>
              <p>
                <code>AT NEW bukrs</code> は会社が変わった行で発火。そのときだけ会社を戻します（表の「—」でない第1段）。
              </p>
              <CodeBlock
                language="ABAP"
                code={`  AT NEW bukrs.
    ls_disp-bukrs = ls_out-bukrs.
  ENDAT.`}
              />

              <h3>④ 年度が変わった行だけ表示</h3>
              <p>
                <code>AT NEW gjahr</code> は年度が変わった行で発火。<strong>会社が変わった行でも一緒に発火</strong>するので、階層は自動です。
              </p>
              <CodeBlock
                language="ABAP"
                code={`  AT NEW gjahr.
    ls_disp-gjahr = ls_out-gjahr.
  ENDAT.`}
              />
              <Dialog speaker="b">
                先生、<code>AT NEW gjahr</code> は「年度が変わったとき」ですよね？ なのに、なぜ<strong>会社が変わっただけ</strong>でも発火するんですか？ 年度が同じ（2026のまま）なら、スキップされそうな気がします……。
              </Dialog>
              <Dialog speaker="teacher">
                とても大事な点です。<code>AT NEW f</code> は、その項目 <code>f</code> 自身だけでなく、<strong>構造（行の型）で <code>f</code> より左にある項目が変わったとき</strong>にも発火します。
                ここでは <code>ty_out</code> が <code>bukrs → gjahr → blart …</code> の順で定義されているので、<code>gjahr</code> から見て <code>bukrs</code> は左＝上位。会社が変われば「年度も新しいグループの先頭」とみなされ、<code>AT NEW gjahr</code> も発火します。
              </Dialog>
              <Dialog speaker="b">
                具体的にはどの行で起きるんですか？
              </Dialog>
              <Dialog speaker="teacher">
                前スライドの表の<strong>4行目→5行目</strong>を見てください。年度はどちらも <code>2026</code> ですが、会社が <code>1000 → 2000</code> に変わります。
                このとき <code>AT NEW gjahr</code> は「上位（会社）が変わった」ので発火し、<strong>同じ <code>2026</code> でも表示し直し</strong>ます。会社2000の固まりの先頭なので、年度を省くと「いつの2026か」が読み取れなくなるからです。
              </Dialog>
              <Dialog speaker="b">
                ということは、<code>SORT</code> の順番だけでなく、<code>ty_out</code> の<strong>項目の並び順</strong>も <code>bukrs → gjahr → blart</code> にそろえないといけないんですか？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。<code>AT NEW</code> が「左の項目」と見るのは<strong>構造の定義順</strong>です。だから<strong>構造の並び順</strong>と <code>SORT</code> の順を一致させるのが鉄則。
                たとえば <code>ty_out</code> で <code>gjahr</code> を <code>bukrs</code> より前に置いたり、別キーで <code>SORT</code> したりすると、変わり目の判定がずれて見出しが正しく出ません。
              </Dialog>
              <Callout variant="note">
                <strong>ルール</strong>：<code>AT NEW f</code> は「<code>f</code> が変わった行」＋「構造で <code>f</code> より<strong>左にある項目</strong>が変わった行」で発火します。
                「左」を決めるのは<strong>構造（行の型）の定義順</strong>。<code>SORT</code> の順番もこれにそろえること。両方が一致して初めて、上位が切り替わるたびに下位の見出しが<strong>もれなく出し直され</strong>ます。
              </Callout>

              <h3>⑤ 伝票タイプが変わった行だけ表示</h3>
              <p>
                <code>AT NEW blart</code> は会社・年度・伝票タイプのどれかが変わった行で発火（階層の3段目）。
              </p>
              <CodeBlock
                language="ABAP"
                code={`  AT NEW blart.
    ls_disp-blart = ls_out-blart.
  ENDAT.`}
              />

              <h3>⑥ 出力する</h3>
              <p>
                見出し列は <code>ls_disp</code>（消されたか・戻されたか）、明細列は元の <code>ls_out</code> から出力します。これで <code>LOOP</code> は完成です。
              </p>
              <CodeBlock
                language="ABAP"
                code={`  WRITE: / ls_disp-bukrs, ls_disp-gjahr, ls_disp-blart,
           ls_out-belnr, ls_out-amount.
ENDLOOP.`}
              />

              <Callout variant="note">
                <strong>つなげると</strong>：①の直後に②〜⑥を入れた <code>LOOP</code> が、前スライドの表全体を再現します。<code>AT NEW</code> が「変わった行」を自動で判定するので、自分で前の行と見比べる処理を書く必要はありません。
              </Callout>

              <Dialog speaker="a">
                先生、このコードには「前の行と同じか手で比べる処理」が見当たりませんが、なくて大丈夫なんですか？
              </Dialog>
              <Dialog speaker="teacher">
                大丈夫です。<code>AT NEW</code> が「列が変わった行」を自動で見つけてくれるので、自分で前の行と比べる必要はありません。③④⑤を上から並べるだけで、列の<strong>階層</strong>がそのまま表現できます。
              </Dialog>
              <Dialog speaker="b">
                住所みたいですね。「東京都／渋谷区／1-2-3」で、都道府県が同じなら省く。でも都道府県が変わったら、市区町村も番地も全部出し直す？
              </Dialog>
              <Dialog speaker="teacher">
                まさにその感覚です。<code>AT NEW gjahr</code> は会社が変わった行でも発火するので、<strong>上位が変われば下位も自動で出し直され</strong>ます。
              </Dialog>
            </>
          ),
        },
        {
          title: "行ごと：どの命令が動くか",
          plainText:
            "行ごと：どの命令が動くか\n【テーマ切替】サプレス（消す）の章は終了。ここから②AT制御（足す）。\nAT制御＝変わり目で見出し・小計を足す。まずLOOP1周ごとにどの命令が動くかを追う。\nAくん：サプレスと混同しないで。先生：SORTは共通の前提。",
          content: (
            <>
              <Callout variant="tip">
                <strong>ここからテーマが変わります。</strong>
                これまで学んだのは<strong>① サプレス</strong>（同じ見出しを<strong>消す</strong>）でした。
                このスライド以降は<strong>② AT制御</strong>（変わり目で見出し・小計・総合計の行を<strong>足す</strong>）です。
                どちらも <code>SORT</code> 済みのデータが前提ですが、やることは別物なので、混同しないよう注意してください。
              </Callout>
              <Dialog speaker="b">
                先生、サプレスの続きですか？ また前行と比べるんですよね？
              </Dialog>
              <Dialog speaker="teacher">
                比べる点は似ていますが、目的が違います。サプレスは「同じ表示を出さない」、AT制御は「変わり目だけ別の行を追加する」。
                概要スライドの②の話に入ります。まずコードより、<strong>どの命令がいつ動くか</strong>を表で追いましょう。
              </Dialog>
              <h2>行ごと：どの命令が動くか</h2>
              <p>
                並べ替えたデータの<strong>変わり目</strong>で、見出し・小計・総合計を差し込むのが <strong>AT制御</strong>です。
                まず「入力の1行（LOOP 1周）」ごとに、<strong>どの命令が実行されるか</strong>を追います（帳票の見た目やコードは、このあと順に見ます）。
              </p>
              <ul className="text-sm">
                <li><code>AT FIRST</code> … LOOPの1行目だけ</li>
                <li><code>AT NEW</code> … 前行とキーが違う行</li>
                <li><code>AT END OF</code> … 次行とキーが違う行</li>
                <li><code>AT LAST</code> … LOOPの最終行だけ</li>
              </ul>
              <Callout variant="note">
                <code>AT NEW</code>＝<strong>前と違う</strong>、<code>AT END OF</code>＝<strong>次と違う</strong>。
                下表は <code>SORT lt_out BY bukrs belnr.</code> 済みの5行を前提にしています。
              </Callout>
              <p>
                <strong>LOOP が1周するたび</strong>、下の表のように <code>AT …</code> と <code>WRITE</code> が選ばれて実行されます（動かない命令はスキップ）。
              </p>
              <SampleTable caption="入力データ（SORT済み・5行）" variant="ok">
                <thead>
                  <tr>
                    <Th>LOOP</Th>
                    <Th>会社</Th>
                    <Th>伝票</Th>
                    <Th>金額</Th>
                  </tr>
                </thead>
                <tbody>
                  {CONTROL_LOOP_TRACE_ROWS.map((row) => (
                    <tr key={row.loop}>
                      <Td>{row.loop}</Td>
                      <Td>{row.bukrs}</Td>
                      <Td>{row.belnr}</Td>
                      <Td>{row.amount}</Td>
                    </tr>
                  ))}
                </tbody>
              </SampleTable>
              <SampleTable caption="各行で実行される命令（この順で上から評価）" variant="default">
                <thead>
                  <tr>
                    <Th>LOOP</Th>
                    <Th>会社</Th>
                    <Th>実行される命令</Th>
                    <Th>補足</Th>
                  </tr>
                </thead>
                <tbody>
                  {CONTROL_LOOP_TRACE_ROWS.map((row) => (
                    <tr key={row.loop}>
                      <Td highlight>{row.loop}</Td>
                      <Td>{row.bukrs}</Td>
                      <Td>
                        <FiredCommands commands={row.fired} />
                      </Td>
                      <Td>
                        <span className="text-sm">{row.note}</span>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </SampleTable>
              <Callout variant="tip">
                <code>WRITE 明細</code> は LOOP 内の通常の <code>WRITE: / ls_out-belnr, ls_out-amount.</code> です。
                <code>AT …</code> は境界の行だけ。1回の LOOP で複数の命令が動く行（例：3周目・5周目）に注意してください。
              </Callout>
              <Dialog speaker="b">
                先生、同じ会社の途中の行（2周目）では、なぜ見出しも小計も出ないんですか？
              </Dialog>
              <Dialog speaker="teacher">
                前の行とも次の行とも会社が同じだからです。境界ではないので、明細の <code>WRITE</code> だけが動きます。
              </Dialog>
              <Dialog speaker="a">
                なるほど。入力は5行なのに、境界の行では命令がいくつも動きますね。LOOPの回数と、画面上の行数は一致しそうもない……。
              </Dialog>
              <Dialog speaker="teacher">
                その違和感が大事です。次のスライドで、これらの命令が帳票に<strong>どう並ぶか</strong>（11行になる理由）を表で見ましょう。
              </Dialog>
              <h3>4イベントの早見表</h3>
              <SampleTable caption="いつ発火するか・何を出すか（会社コード bukrs）" variant="default">
                <thead>
                  <tr>
                    <Th>イベント</Th>
                    <Th>発火する行</Th>
                    <Th>典型的な出力</Th>
                  </tr>
                </thead>
                <tbody>
                  {AT_EVENT_GUIDE.map((row) => (
                    <tr key={row.event}>
                      <Td>
                        <code>{row.event}</code>
                      </Td>
                      <Td>{row.when}</Td>
                      <Td>{row.output}</Td>
                    </tr>
                  ))}
                </tbody>
              </SampleTable>
            </>
          ),
        },
        {
          title: "出力の並び（帳票イメージ）",
          plainText:
            "出力の並び（帳票イメージ）\n入力5行→帳票11行。Aくん：5行が11行になる理由。先生：前スライドのWRITEの並び。\nBちゃん：小計の合計は？先生：次スライドのコードで足し込み。運動会の比喩。次でLOOPのコード。",
          content: (
            <>
              <h2>出力の並び（帳票イメージ）</h2>
              <p>
                前のスライドでは、入力<strong>5行</strong>を LOOP するとき<strong>どの命令が動くか</strong>を追いました。
                ここでは、それらの <code>WRITE</code> が帳票に<strong>どう並ぶか</strong>を先に見ます。
                <code>AT …</code> が<strong>追加の行</strong>を差し込むため、画面には<strong>11行</strong>並びます（上から読む）。
              </p>
              <h3>表の見方</h3>
              <ul>
                <li>
                  <strong>行種別</strong> … 帳票に実際に表示される文言（見出し・明細・小計など）
                </li>
                <li>
                  <strong>会社 / 伝票 / 金額</strong> … 明細行だけ値が入る。見出し・小計は <code>—</code> または集計値
                </li>
                <li>
                  <strong>発火条件</strong> … その行を生んだ命令（前スライドの「実行される命令」と対応）
                </li>
              </ul>
              <SampleTable caption="帳票に並ぶ順序（入力5行 → 出力11行）" variant="default">
                <thead>
                  <tr>
                    <Th>#</Th>
                    <Th>行種別</Th>
                    <Th>会社</Th>
                    <Th>伝票</Th>
                    <Th>金額</Th>
                    <Th>発火条件</Th>
                  </tr>
                </thead>
                <tbody>
                  {CONTROL_OUTPUT_ROWS.map((row, index) => (
                    <tr key={`${row.line}-${index}`}>
                      <Td muted>{index + 1}</Td>
                      <Td highlight={row.trigger !== "通常行"}>{row.line}</Td>
                      <Td muted={row.bukrs === "—"}>{row.bukrs}</Td>
                      <Td muted={row.belnr === "—"}>{row.belnr}</Td>
                      <Td muted={row.amount === "—"}>{row.amount}</Td>
                      <Td>
                        <code>{row.trigger}</code>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </SampleTable>
              <Callout variant="note">
                <strong>レイアウトの型</strong>：全体見出し（<code>AT FIRST</code>）→ 会社見出し（<code>AT NEW</code>）→ 明細（毎行の <code>WRITE</code>）→
                小計（<code>AT END OF</code>）→ … 繰り返し → 総合計（<code>AT LAST</code>）。
                明細だけが入力データ1行＝帳票1行、それ以外は境界で<strong>足される行</strong>です。
              </Callout>
              <Dialog speaker="a">
                先生、さっきの「5行の入力」が、帳票では<strong>11行</strong>になっているんですね。見出しや小計が足されているからですか？
              </Dialog>
              <Dialog speaker="teacher">
                その理解で合っています。前のスライドで追った「実行される命令」の <code>WRITE</code> が、この順番で並んだものです。
              </Dialog>
              <Dialog speaker="b">
                小計の金額は、この表だけだとどこで足しているか分かりません……。
              </Dialog>
              <Dialog speaker="teacher">
                いい着眼点です。<strong>次のスライドのコード</strong>では、明細を出すたびに合計用の変数へ足し込み、<code>AT END OF</code> で出して 0 に戻します。集計の作法は応用編でくわしく扱いますよ。
              </Dialog>
              <Dialog speaker="b">
                運動会みたいですね。開会式→各組の入場→選手が走る→組の結果→閉会式。決まった場面でだけ式が差し込まれる、と考えればいいですか？
              </Dialog>
              <Dialog speaker="teacher">
                その理解でぴったりです。明細（走る人）は毎回、見出しや小計（式典）は変わり目だけ、と覚えてください。
              </Dialog>
              <Dialog speaker="teacher">
                この並びが頭に入ったら、次のスライドでそれを作る LOOP のコードを読みましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "コードの読み方",
          plainText:
            "コードの読み方\nBちゃん：見た目と命令がつながった。LOOPを帳票どおりに読む。\nSORT → AT FIRST / AT NEW / WRITE / AT END OF / AT LAST。\nBちゃん：1周目にAT FIRSTとAT NEWが両方？Aくん：SORTは次スライドで確認。\n迷ったら4問で追う。",
          content: (
            <>
              <h2>コードの読み方</h2>
              <p>
                前のスライドの<strong>帳票11行</strong>と、その前の「実行される命令」の表を思い出しながら、次の LOOP を読みます。
                ブロックは<strong>上からの並び</strong>どおりに評価されます。
              </p>
              <Dialog speaker="b">
                先生、いまやっと「見た目」と「命令」がつながりました。コードはこの並びどおりに書けばいいんですね？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。帳票の行種別と、LOOP 内の <code>AT …</code> / <code>WRITE</code> を対応づけながら読んでください。
              </Dialog>
              <CodeBlock
                language="ABAP"
                code={`SORT lt_out BY bukrs belnr.

LOOP AT lt_out INTO ls_out.
  AT FIRST.                              " ① 先頭行だけ
    WRITE: / '会社別 一覧'.
  ENDAT.

  AT NEW bukrs.                          " ② 前行と会社が違う行
    WRITE: / '■ 会社:', ls_out-bukrs.
  ENDAT.

  WRITE: / ls_out-belnr, ls_out-amount.  " ③ 毎行（明細）

  AT END OF bukrs.                       " ④ 次行と会社が違う行
    WRITE: / '  小計 ...'.
  ENDAT.

  AT LAST.                               " ⑤ 最終行だけ
    WRITE: / '== 総合計 =='.
  ENDAT.
ENDLOOP.`}
              />
              <h3>命令と発火条件の対応</h3>
              <SampleTable caption="コードの各行が動く条件（帳票の行種別と対応）" variant="default">
                <thead>
                  <tr>
                    <Th>コード上の位置</Th>
                    <Th>動く条件</Th>
                    <Th>帳票での例</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td>
                      <code>AT FIRST</code>
                    </Td>
                    <Td>LOOPの1行目</Td>
                    <Td>「会社別 一覧」（1行目）</Td>
                  </tr>
                  <tr>
                    <Td>
                      <code>AT NEW bukrs</code>
                    </Td>
                    <Td>先頭行、または前行と会社が違う</Td>
                    <Td>「■ 会社: 1000」など</Td>
                  </tr>
                  <tr>
                    <Td>
                      <code>WRITE</code>（明細）
                    </Td>
                    <Td>毎周</Td>
                    <Td>伝票・金額の行（5行）</Td>
                  </tr>
                  <tr>
                    <Td>
                      <code>AT END OF bukrs</code>
                    </Td>
                    <Td>最終行、または次行と会社が違う</Td>
                    <Td>「小計」行</Td>
                  </tr>
                  <tr>
                    <Td>
                      <code>AT LAST</code>
                    </Td>
                    <Td>LOOPの最終行</Td>
                    <Td>「== 総合計 ==」（最終行）</Td>
                  </tr>
                </tbody>
              </SampleTable>
              <ul>
                <li>
                  <code>SORT lt_out BY bukrs belnr.</code> … 同じ会社を連続させないと ②④ の判定が狂います
                </li>
                <li>
                  明細の <code>WRITE</code> は毎行、<code>AT … ENDAT.</code> は境界行だけ。役割を分けて読む
                </li>
                <li>
                  迷ったら「先頭？会社が切り替わった？会社の最後？データの最終行？」の4問で追う
                </li>
              </ul>
              <Dialog speaker="b">
                先生、<code>AT FIRST</code> と <code>AT NEW</code> が同じ1周目に両方動くことってありますか？
              </Dialog>
              <Dialog speaker="teacher">
                あります。先頭行は「最初の行」でもあり「最初の会社の始まり」でもあるからです。前のスライドの帳票でも1・2行目に全体見出しと会社見出しが続き、命令の表でも1周目は両方立っていますね。
              </Dialog>
              <Dialog speaker="a">
                先生、コードの先頭の <code>SORT</code> は、さっきの表でも暗に前提になっていましたよね？
              </Dialog>
              <Dialog speaker="teacher">
                鋭いです。次のスライドで、並んでいないと何が起きるかをはっきり見ます。
              </Dialog>
            </>
          ),
        },
        {
          title: "SORTが前提",
          plainText:
            "SORTが前提\nBちゃん：これまでの例はSORT済み前提？先生：並んでいないと変わり目が狂う。\n黄色行＝グループ分割。Aくん：11行の並びも崩れる。実装はSORTしてからLOOP。",
          content: (
            <>
              <h2>SORT が前提</h2>
              <p>
                行ごとの命令表は、<strong>会社コードで並べ替え済み</strong>が前提です。並んでいないと同じ会社が離れ、
                <code>AT NEW</code> / <code>AT END OF</code> のタイミングがずれます（黄色＝グループが分割されている行）。
              </p>
              <div className="not-prose my-4 grid grid-cols-2 gap-4 [&>figure]:my-0">
                <SampleTable caption="❌ SORT 前：会社が飛び飛びで小計が狂う" variant="warn">
                  <thead>
                    <tr>
                      <Th>会社</Th>
                      <Th>伝票</Th>
                      <Th>金額</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {SORT_UNSORTED_ROWS.map((row, i) => (
                      <tr key={row.belnr}>
                        <Td highlight={isSplitGroupRow(SORT_UNSORTED_ROWS, i)}>{row.bukrs}</Td>
                        <Td highlight={isSplitGroupRow(SORT_UNSORTED_ROWS, i)}>{row.belnr}</Td>
                        <Td highlight={isSplitGroupRow(SORT_UNSORTED_ROWS, i)}>{row.amount}</Td>
                      </tr>
                    ))}
                  </tbody>
                </SampleTable>
                <SampleTable caption="✅ SORT 後：会社ごとにまとまり変わり目が正しい" variant="ok">
                  <thead>
                    <tr>
                      <Th>会社</Th>
                      <Th>伝票</Th>
                      <Th>金額</Th>
                      <Th>変わり目</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {SORT_SORTED_ROWS.map((row) => (
                      <tr key={row.belnr}>
                        <Td>{row.bukrs}</Td>
                        <Td>{row.belnr}</Td>
                        <Td>{row.amount}</Td>
                        <Td muted={!row.control}>
                          {row.control ? <code>{row.control}</code> : "—"}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </SampleTable>
              </div>
              <Dialog speaker="b">
                先生、さっきまでの命令表や帳票の例は、全部 SORT 済みが前提でしたよね？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。ここでは<strong>並んでいないと何が起きるか</strong>を見ます。並んでいないと「変わり目」が正しく取れず、小計の位置が狂います。
              </Dialog>
              <Dialog speaker="stumble">
                黄色の行は、同じ会社なのにグループが<strong>途中で切れている</strong>状態です。AT制御の前に必ず SORT しましょう。
              </Dialog>
              <Dialog speaker="a">
                先に並べておかないと、同じ会社が飛び飛びになって、さっき見た11行の並びも意味をなくす、ということですね。
              </Dialog>
              <Dialog speaker="teacher">
                その理解で十分です。だから実装では「<code>SORT</code> してから LOOP」と覚えてください。
              </Dialog>
            </>
          ),
        },
        {
          title: "図解：キーの変わり目",
          plainText:
            "図で見る：キーが変わると分岐する\nflowchart：次の行を読む → AT FIRST → AT NEW → 明細 → AT END OF → 繰り返し。\n先生：帳票の表と同じ並び。Bちゃん：見た目→命令→帳票→コード→SORTの順がよい？先生：その通り。応用編へ。",
          content: (
            <>
              <h2>図で見る：キーが変わると分岐する</h2>
              <Figure
                src="image/09-control-break.webp"
                alt="会社コードでSORT済みの行リスト。会社が切り替わる境界線で『AT NEW＝グループ見出し』が上に、『AT END OF＝小計』が下で処理される位置を矢印で示す。先頭にAT FIRST、末尾にAT LAST。"
                caption="SORT済みデータのグループ境界で AT NEW / AT END OF が処理される"
                kind="diagram"
              />
              <MermaidDiagram
                chart={`flowchart TD
  S[次の行を読む] --> F{最初の行?}
  F -->|はい| H1[AT FIRST: 全体見出し]
  F -->|いいえ| N{会社が変わった?}
  H1 --> N
  N -->|はい| H2[AT NEW: グループ見出し]
  N -->|いいえ| W[明細を出力]
  H2 --> W
  W --> E{会社の最終行?}
  E -->|はい| H3[AT END OF: 小計]
  E -->|いいえ| L{データ最終行?}
  H3 --> L
  L -->|はい| H4[AT LAST: 総合計]
  L -->|いいえ| S
  H4 --> S`}
              />
              <Dialog speaker="b">
                先生、<code>AT NEW</code> の見出しが境界の「上」、<code>AT END OF</code> の小計が「下」に来るのはなぜですか？
              </Dialog>
              <Dialog speaker="teacher">
                グループの<strong>始まり</strong>で見出し、<strong>終わり</strong>で小計、と考えると自然です。図のとおり、変わり目をはさんで上に見出し・下に小計が差し込まれます。帳票の表でも同じ並びでしたね。
              </Dialog>
              <Dialog speaker="b">
                先生、基本編は「まず見た目 → 命令の追い方 → 帳票 → コード → SORT」の順でしたが、現場でもこの順で読むとよいですか？
              </Dialog>
              <Dialog speaker="teacher">
                はい。出力イメージを先に持ってからコードを読むと、<code>AT …</code> の意味がぶれにくいです。基本編はここまで。確認テストのあと、<strong>応用編</strong>でフラグや設計のコツに進みましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "まとめ",
          plainText:
            "基本編のまとめ\n手順：①SORT（キー項目を左から）②サプレス or AT制御を選ぶ ③LOOPで処理。\nサプレス＝前行と同じなら消す。AT制御＝変わり目で見出し・小計を足す。\n共通の落とし穴：SORT忘れ・サプレスとATの混同・AT NEWとEND OFの向きの取り違え。\n先生：迷ったら『この行は先頭？会社が切り替わった？会社の最後？最終行？』の4問で追う。",
          content: (
            <>
              <h2>基本編のまとめ</h2>
              <h3>実装の手順（この順で覚える）</h3>
              <ol>
                <li>
                  <strong>SORT</strong> … サプレス対象・AT制御対象のキー項目を、左（上位）から順に並べる
                </li>
                <li>
                  <strong>目的を選ぶ</strong> … 見出しを消すだけならサプレス、見出し・小計を差し込むならAT制御
                </li>
                <li>
                  <strong>LOOP</strong> … 明細は毎行、見出し・小計やサプレスは <code>AT … ENDAT.</code> のブロックで処理
                </li>
              </ol>
              <SampleTable caption="サプレスとAT制御の違い（混同しやすい点）" variant="default">
                <thead>
                  <tr>
                    <Th>観点</Th>
                    <Th>サプレス</Th>
                    <Th>AT制御</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td>やること</Td>
                    <Td>同じ列の表示を消す</Td>
                    <Td>変わり目で行を追加する（見出し・小計）</Td>
                  </tr>
                  <tr>
                    <Td>変わり目の見つけ方</Td>
                    <Td>
                      <code>AT NEW</code>（ランタイムが自動判定）
                    </Td>
                    <Td>
                      <code>AT NEW</code> / <code>AT END OF</code> など（自動判定）
                    </Td>
                  </tr>
                  <tr>
                    <Td>
                      <code>AT</code> ブロックの中身
                    </Td>
                    <Td>表示用の値を戻す（行数は変わらない）</Td>
                    <Td>見出し・小計を <code>WRITE</code> で足す（行が増える）</Td>
                  </tr>
                  <tr>
                    <Td>典型コード</Td>
                    <Td>
                      <code>AT NEW bukrs. ls_disp-bukrs = ls_out-bukrs. ENDAT.</code>
                    </Td>
                    <Td>
                      <code>AT NEW bukrs. WRITE: / &apos;■&apos;, ls_out-bukrs. ENDAT.</code>
                    </Td>
                  </tr>
                </tbody>
              </SampleTable>
              <Callout variant="warning">
                よくある落とし穴：<strong>SORT を忘れる</strong>／サプレスで小計を出そうとする／<code>AT NEW</code> と{" "}
                <code>AT END OF</code> の向きを取り違える（NEW＝前と違う、END OF＝次と違う）。
              </Callout>
              <Dialog speaker="a">
                先生、サプレスと AT制御、結局どっちを使えばいいか迷ったときの決め手はありますか？
              </Dialog>
              <Dialog speaker="teacher">
                「表示を消したいだけ」ならサプレス、「見出しや小計の行を足したい」なら AT制御です。さらに迷ったら「この行は先頭？会社が切り替わった？会社の最後？データの最終行？」の4問で追うと、発火位置が確認できます。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック（基本編）\nQ1 サプレスの意味は？→ 同じ表示を繰り返さず省くこと\nQ2 AT NEW・AT END OF を正しく使うための前提は？→ 事前にキー項目で SORT しておくこと\nQ3 全体見出しを最初の1回だけ出すには？→ AT FIRST を使う\nQ4 グループの最後の行で小計を出すのに使うのは？→ AT END OF\nQ5 小計を出したいときに適切なのは？→ AT制御（サプレスではない）\n今日のひとこと：制御は難しい呪文ではなく見やすく正しく並べる工夫。続きは応用編へ。",
          content: (
            <>
              <h2>理解度チェック（基本編）</h2>
              <Quiz
                answer={0}
                explanation="サプレスは「同じ表示を繰り返さない」こと。見出しの重複を省いて見やすくします。単なる省略ではなく、読み手がグループ構造を素早く把握するための表示設計という位置づけです。"
                question={<strong>「サプレス」の意味として正しいのは？</strong>}
                options={["同じ表示を繰り返さず省くこと", "データを並べ替えること", "エラーを記録すること"]}
              />
              <Quiz
                answer={2}
                explanation="AT NEW/AT END OF などの制御は、事前に SORT してグループが並んでいることが前提です。並びが崩れていると変わり目判定がずれ、見出しや小計の位置が不正になって帳票の信頼性を落とします。"
                question={<strong>AT NEW・AT END OF を正しく使うための前提は？</strong>}
                options={["NEW-PAGE を入れること", "フラグを必ず立てること", "事前にキー項目で SORT しておくこと"]}
              />
              <Quiz
                answer={0}
                explanation="AT FIRSTはLOOP開始時に1回だけ実行されるため、全体見出しや初期化処理の配置先として適しています。毎行実行される明細出力と分離しておくことで、出力の重複や可読性低下を防げます。"
                question={<strong>全体見出しを「最初の1回だけ」出したい場合に適切なのは？</strong>}
                options={["AT FIRST を使う", "AT END OF を使う", "LOOPの外でSY-SUBRCを確認する"]}
              />
              <Quiz
                answer={1}
                explanation="AT END OF 項目 は、その項目が変わる直前の行（＝グループの最後の行）で実行されます。小計や区切り線の出力に向きます。グループの先頭で見出しを出すのは AT NEW です。"
                question={<strong>グループの最後の行で「小計」を出すのに使うのは？</strong>}
                options={["AT NEW", "AT END OF", "AT FIRST"]}
              />
              <Quiz
                answer={1}
                explanation="小計や総合計は「変わり目で行を足す」処理なので AT制御（AT END OF / AT LAST）が向きます。サプレスは同じ見出しを消すだけで、新しい行は追加しません。"
                question={<strong>会社ごとの小計行を帳票に差し込みたい。適切なのは？</strong>}
                options={["サプレスだけで十分", "AT END OF などの AT制御", "SORT だけで自動的に出る"]}
              />
              <Dialog speaker="closing">
                制御は“難しい呪文”ではなく「見やすく・正しく並べる工夫」。比喩に戻せば必ず分かります。
                続く<strong>応用編</strong>では、フラグ（旗）・<code>SY-SUBRC</code> との使い分け・多重ネストの回避・<code>AT</code> 制御の内部の仕組みを扱います。
              </Dialog>
              <AdvancedLink />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ControlFlowLesson);
