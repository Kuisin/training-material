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
  InfoPanel,
  horizontalLineClasses,
  horizontalLineBorderColor,
  mountLesson,
} from "../../src/lesson";
import type { ReactNode } from "react";
import { cn } from "../../src/lib/cn";

export const lessonMeta = {
  title: "制御の考え方",
  meta: "初学者 · 30分",
};

const SUPPRESS_SAMPLE_ROWS = [
  { prefecture: "東京都", name: "田中" },
  { prefecture: "東京都", name: "佐藤" },
  { prefecture: "東京都", name: "鈴木" },
  { prefecture: "大阪府", name: "山田" },
  { prefecture: "大阪府", name: "伊藤" },
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

export default function ControlFlowLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-taining", "09-control-flow", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "制御の考え方\n同じ見出しを繰り返さない「サプレス」、キーの変わり目で処理を分ける制御を学びます。\n⏱ 30分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・サプレス（＝同じ表示を繰り返さないこと）の考え方\n・並びの「変わり目」で処理する制御（AT FIRST / AT LAST / AT NEW / AT END OF）\n・フラグ（旗）を使った状態の管理と、多重ネストを避ける意識",
          content: (
            <>
              <hgroup>
                <h1>制御の考え方</h1>
                <p>同じ見出しを繰り返さない「サプレス」、キーの変わり目で処理を分ける制御を学びます。</p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "30分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>サプレス（＝同じ表示を繰り返さないこと）の考え方</li>
                <li>並びの「変わり目」で処理する制御（<code>AT FIRST</code> / <code>AT LAST</code> / <code>AT NEW</code> / <code>AT END OF</code>）</li>
                <li>フラグ（旗）を使った状態の管理と、多重ネストを避ける意識</li>
              </ul>
              <Dialog speaker="teacher">
                この章は少し言葉が難しく見えます。でも中身は「見やすく・正しく並べる工夫」だけ。一つずつ、たとえに戻しながら進めましょう。
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
              {/* <Figure
                src="image/09-suppress.png"
                alt="左：各行に『東京都』が繰り返し書かれた冗長なリスト。右：先頭の1回だけ『東京都』を表示し、以降は省いて名前だけ並ぶ見やすいリスト。before/afterの対比。"
                caption="サプレス：繰り返す見出し（東京都）を先頭1回だけにして見やすくする"
                kind="concept"
              /> */}
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
              <Dialog speaker="teacher">
                用語は難しそうでも、中身は「重複する見出しを省いて見やすくする」だけ。日常でも自然にやっていることです。
              </Dialog>
              <Dialog speaker="b">
                時刻表で「9時台」とまとめて、分だけ並べるのと同じですね。あれなら分かります！
              </Dialog>
              <Dialog speaker="a">
                データの目線で言うと「直前の行と同じ値なら出さない」という判定ですね。
              </Dialog>
              <Dialog speaker="teacher">
                まさにそれです。その「変わったかどうか」を見るのが、次に出てくる制御の考え方につながります。
              </Dialog>
            </>
          ),
        },
        {
          title: "変わり目で処理する",
          plainText:
            "「変わり目」をきっかけに処理する\n並べ替えたデータを上から見ると、グループの変わり目がある。そこで小計や見出しを出す。\nAT FIRST：いちばん最初に1回（全体の見出しなど）\nAT NEW 項目：その項目が変わった最初の行（グループ見出し）\nAT END OF 項目：その項目が変わる直前の行（小計など）\nAT LAST：いちばん最後に1回（総合計など）\nつまずき：これらは事前に SORT してあることが前提。並んでいないと変わり目が正しく取れない。",
          content: (
            <>
              <h2>「変わり目」をきっかけに処理する</h2>
              <p>並べ替えたデータを上から見ていくと、グループの「変わり目」があります。そこで小計を出したり、見出しを出したりします。</p>
              <ul>
                <li><code>AT FIRST</code>：いちばん最初に1回（全体の見出しなど）</li>
                <li><code>AT NEW 項目</code>：その項目が変わった最初の行（グループ見出し）</li>
                <li><code>AT END OF 項目</code>：その項目が変わる直前の行（小計など）</li>
                <li><code>AT LAST</code>：いちばん最後に1回（総合計など）</li>
              </ul>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                会社コード（<code>bukrs</code>）で<strong>並べ替えていない</strong>と、同じ会社の行が離れ、
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
              <Dialog speaker="stumble">
                これらは<strong>事前に SORT してある</strong>ことが前提。並んでいないと「変わり目」が正しく取れません。
              </Dialog>
              <Dialog speaker="b">
                先に並べておかないと、同じ会社が飛び飛びになって小計がぐちゃぐちゃになる、ということですか？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。だから「SORT してから制御」。順番がこの章の生命線です。
              </Dialog>
            </>
          ),
        },
        {
          title: "制御のコード例",
          plainText:
            "LOOP の中に制御ブロックを置く\nSORT lt_out BY bukrs.\nLOOP AT lt_out INTO ls_out.\n  AT FIRST. WRITE: / '会社別 一覧'. ENDAT.\n  AT NEW bukrs. WRITE: / '■ 会社:', ls_out-bukrs. ENDAT.\n  WRITE: / ls_out-belnr, ls_out-amount.\n  AT END OF bukrs. WRITE: / '  小計 …'. ENDAT.\n  AT LAST. WRITE: / '== 総合計 ==' . ENDAT.\nENDLOOP.\nAくん：LOOPを回しながら最初／グループ頭／グループ末／最後にフックを掛けるんですね。構造がきれい。",
          content: (
            <>
              <h2>LOOP の中に制御ブロックを置く</h2>
              <CodeBlock
                language="ABAP"
                code={`SORT lt_out BY bukrs.
LOOP AT lt_out INTO ls_out.
  AT FIRST.        WRITE: / '会社別 一覧'.        ENDAT.
  AT NEW bukrs.    WRITE: / '■ 会社:', ls_out-bukrs. ENDAT.

  WRITE: / ls_out-belnr, ls_out-amount.

  AT END OF bukrs. WRITE: / '  小計 …'.          ENDAT.
  AT LAST.         WRITE: / '== 総合計 ==' .       ENDAT.
ENDLOOP.`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>SORT lt_out BY bukrs.</code> … 会社コード順に並べ替え（<code>AT NEW</code> / <code>AT END OF</code> の前提）
                </li>
                <li>
                  <code>AT FIRST.</code> … 全データの最初の行だけで処理する → 全体見出し
                </li>
                <li>
                  <code>AT NEW bukrs.</code> … 会社コードが変わった行だけで処理する → グループ見出し
                </li>
                <li>
                  <code>WRITE: / ls_out-belnr, ls_out-amount.</code> … 毎行の明細出力（いつも通り）
                </li>
                <li>
                  <code>AT END OF bukrs.</code> … その会社の最後の行だけで処理する → 小計
                </li>
                <li>
                  <code>AT LAST.</code> … 全データの最後の行だけで処理する → 総合計
                </li>
              </ul>
              <Dialog speaker="a">
                LOOP を回しながら「最初／グループ頭／グループ末／最後」にフックを掛けるんですね。構造がきれい。
              </Dialog>
              <Dialog speaker="teacher">
                いい言葉です。まさに「フック（引っ掛け）」。明細の出力はいつも通り、その前後に見出しや小計のフックを差し込む、という読み方をしてください。
              </Dialog>
            </>
          ),
        },
        {
          title: "図解：キーの変わり目",
          plainText:
            "図で見る：キーが変わると分岐する\nflowchart：次の行を読む → 最初の行?(AT FIRST全体見出し) → 会社が変わった?(AT NEWグループ見出し) → 明細出力 → 会社の最終行?(AT END OF小計) → 繰り返し\nこの並びの判定を、SORT済みの前提で行う。",
          content: (
            <>
              <h2>図で見る：キーが変わると分岐する</h2>
              <Figure
                src="image/09-control-break.png"
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
  E -->|いいえ| S
  H3 --> S`}
              />
            </>
          ),
        },
        {
          title: "フラグ（旗）",
          plainText:
            "フラグ ＝ 状態を覚えておく旗\nフラグは「ある状態が起きたか」を覚えておく小さな箱（多くは 'X' か空）。例：1件でもエラーがあったかを覚えておき最後にまとめて判断。\nDATA lv_error TYPE flag.\nLOOP AT lt_in INTO ls_in. IF ls_in-amount < 0. lv_error = 'X'. ENDIF. ENDLOOP.\nIF lv_error = 'X'. MESSAGE 'エラーが含まれています' TYPE 'I'. ENDIF.\nInfoPanel：フラグは1回以上起きたかだけ分かる。件数・該当行など詳細が必要ならカウンタや別テーブルを検討。\nBちゃん：あとで思い出すための付箋みたいなものですね。立てておいて最後に見る。",
          content: (
            <>
              <h2>フラグ ＝ 状態を覚えておく旗</h2>
              <p>フラグは「ある状態が起きたか」を覚えておく小さな箱（多くは <code>'X'</code> か空）。例：「1件でもエラーがあったか」を覚えておき、最後にまとめて判断します。</p>
              <CodeBlock
                language="ABAP"
                code={`DATA lv_error TYPE flag.        " 旗（'X' で立てる）

LOOP AT lt_in INTO ls_in.
  IF ls_in-amount < 0.
    lv_error = 'X'.            " エラーの旗を立てる
  ENDIF.
ENDLOOP.

IF lv_error = 'X'.
  MESSAGE 'エラーが含まれています' TYPE 'I'.
ENDIF.`}
              />
              <h3>1行ずつ読む</h3>
              <ul>
                <li>
                  <code>DATA lv_error TYPE flag.</code> … フラグ用の変数。空＝旗なし、<code>&apos;X&apos;</code>＝旗あり
                </li>
                <li>
                  <code>IF ls_in-amount &lt; 0.</code> … 金額がマイナスならエラー条件
                </li>
                <li>
                  <code>lv_error = &apos;X&apos;.</code> … 1件でも該当すれば旗を立てる（下ろさない限り立ったまま）
                </li>
                <li>
                  <code>IF lv_error = &apos;X&apos;.</code> … ループ後に旗を確認し、エラーがあったかまとめて判断
                </li>
              </ul>
              <Dialog speaker="b">
                「あとで思い出すための付箋」みたいなものですね。立てておいて、最後に見る。
              </Dialog>
              <Dialog speaker="a">
                一度立てたら下ろさない限り立ったまま。だから「1件でも起きたか」を覚えるのに向くんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その理解で完璧です。旗は「起きた事実」を後ろまで運ぶ仕組み。ループを抜けた後の判断に使います。
              </Dialog>
              <InfoPanel
                title="フラグで分かること・分からないこと"
                variant="reference"
                lead="フラグは「1回以上起きたかどうか」だけを覚えられます。それで足りない場面もあります。"
              >
                <ul>
                  <li>
                    <strong>分かること</strong> … エラーが1件でもあったか（はい／いいえ）
                  </li>
                  <li>
                    <strong>分からないこと</strong> … 何件エラーがあったか、どの行か、どんな種類か
                  </li>
                </ul>
                <p className="mb-2 mt-4 font-semibold">より詳しく知りたいとき</p>
                <ul>
                  <li>
                    <strong>件数が欲しい</strong> … カウンタ変数（例：<code>lv_error_cnt</code>）を用意し、該当するたびに{" "}
                    <code>lv_error_cnt = lv_error_cnt + 1.</code> する
                  </li>
                  <li>
                    <strong>該当行を残したい</strong> … エラー行だけ別の内部テーブルに{" "}
                    <code>APPEND</code> しておく
                  </li>
                  <li>
                    <strong>その場で行番号を知らせたい</strong> … ループの中でメッセージを出す（旗だけに頼らない）
                  </li>
                </ul>
              </InfoPanel>
            </>
          ),
        },
        {
          title: "SY-SUBRCだけでは足りない時",
          plainText:
            "「取れた／取れない」だけでは足りない場面\nSY-SUBRC は1回の処理の成否を表すだけ。全体を通して見たときの状態（複数件のうち1件でも問題があったか等）は、自分でフラグを使って覚えておく必要がある。\n先生：1回ごとの成否＝SY-SUBRC、流れ全体の状態＝フラグ。役割が違うので両方使う。\nこの章のABAPキーワード：AT FIRST / AT NEW / AT END OF / AT LAST / フラグ。",
          content: (
            <>
              <h2>「取れた／取れない」だけでは足りない場面</h2>
              <p><code>SY-SUBRC</code> は1回の処理の成否を表すだけ。「全体を通して見たときの状態（複数件のうち1件でも問題があったか等）」は、自分でフラグを使って覚えておく必要があります。</p>
              <Dialog speaker="teacher">
                1回ごとの成否＝<code>SY-SUBRC</code>、流れ全体の状態＝<strong>フラグ</strong>。役割が違うので両方使います。
              </Dialog>
              <Callout variant="tip">
                この章のABAPキーワード：<code>AT FIRST</code> / <code>AT NEW</code> / <code>AT END OF</code> / <code>AT LAST</code> / フラグ。
              </Callout>
            </>
          ),
        },
        {
          title: "多重ネストを避ける",
          plainText:
            "入れ子を深くしすぎない\nIF の中に IF、さらにその中に IF…と深くなると読めなくなる。条件を整理したり早めに CONTINUE で抜けたりして浅く保つ。\nつまずき：とりあえず IF を足すを繰り返すと3ヶ月後に誰も読めないコードに。→ 深くなったら分け方を見直すサイン。\nAくん：ネストの深さは複雑さのメーターだと思えば良いんですね。浅いほど健全。",
          content: (
            <>
              <h2>入れ子を深くしすぎない</h2>
              <p><code>IF</code> の中に <code>IF</code>、さらにその中に <code>IF</code>…と深くなると、読めなくなります。条件を整理したり、早めに <code>CONTINUE</code> で抜けたりして、浅く保ちましょう。</p>
              <Dialog speaker="stumble">
                「とりあえず IF を足す」を繰り返すと、3ヶ月後に誰も読めないコードに。→ 深くなったら「分け方を見直すサイン」です。
              </Dialog>
              <Dialog speaker="a">
                ネストの深さは“複雑さのメーター”だと思えば良いんですね。浅いほど健全。
              </Dialog>
              <Dialog speaker="teacher">
                いいまとめです。深くなってきたら、条件を先に判定して抜ける／処理を分ける、を検討してください。次章の「分かりやすくする」にもつながります。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：LOOP中の変わり目を捕まえて表示や集計を制御する考え方を身につける章。AT FIRST/AT NEW/AT END OF/AT LASTは並び順が正しいときに初めて意味を持つ。\nAくん：制御文の理解だけでは不十分で、事前SORTを含めて1セットの設計。1回ごとの成否はSY-SUBRC、全体状態はフラグで管理すると責務分離ができる。\nBちゃん：サプレスは難しい言葉に見えたけど同じ見出しを省いて見やすくする工夫だと分かりました。ネストが深くなったら処理の分け方を見直します。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章は、LOOP中の「変わり目」を捕まえて表示や集計を制御する考え方を身につける章です。AT FIRST / AT NEW / AT END OF / AT LASTは、並び順が正しいときに初めて意味を持ちます。
              </Dialog>
              <Dialog speaker="a">
                つまり制御文の理解だけでは不十分で、事前SORTを含めて1セットの設計なんですね。さらに1回ごとの成否はSY-SUBRC、全体状態はフラグで管理すると責務分離ができる。
              </Dialog>
              <Dialog speaker="b">
                サプレスは難しい言葉に見えたけど、同じ見出しを省いて見やすくする工夫だと分かりました。条件を増やしすぎてネストが深くなったら、処理の分け方を見直します。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 サプレスの意味は？→ 同じ表示を繰り返さず省くこと\nQ2 AT NEW・AT END OF を正しく使うための前提は？→ 事前にキー項目で SORT しておくこと\nQ3 1件でもエラーがあったかを覚えるのに向くのは？→ フラグ（旗）を使う\nQ4 全体見出しを最初の1回だけ出すには？→ AT FIRST を使う\n今日のひとこと：制御は難しい呪文ではなく見やすく正しく並べる工夫。比喩に戻せば必ず分かります。",
          content: (
            <>
              <h2>理解度チェック</h2>
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
                answer={1}
                explanation="フラグは流れ全体の状態（1件でも問題があったか等）を覚えておく旗。1回ごとの成否を表す SY-SUBRC とは役割が違います。"
                question={<strong>「複数件のうち1件でもエラーがあったか」を覚えておくのに向くのは？</strong>}
                options={["SY-SUBRC を見るだけ", "フラグ（旗）を使う", "ULINE を引く"]}
              />
              <Quiz
                answer={0}
                explanation="AT FIRSTはLOOP開始時に1回だけ実行されるため、全体見出しや初期化処理の配置先として適しています。毎行実行される明細出力と分離しておくことで、出力の重複や可読性低下を防げます。"
                question={<strong>全体見出しを「最初の1回だけ」出したい場合に適切なのは？</strong>}
                options={["AT FIRST を使う", "AT END OF を使う", "LOOPの外でSY-SUBRCを確認する"]}
              />
              <Dialog speaker="closing">
                制御は“難しい呪文”ではなく「見やすく・正しく並べる工夫」。比喩に戻せば必ず分かります。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ControlFlowLesson);
