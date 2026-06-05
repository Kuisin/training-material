import {
  Lesson,
  Callout,
  Dialog,
  CodeBlock,
  InfoPanel,
  Reveal,
  LessonQuiz,
  MermaidDiagram,
  LessonMeta,
  LessonLinkButton,
  SapErdDiagram,
  lessonChrome,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "特別演習② — 明細・金額つき仕訳日記帳を作る",
  meta: "特別 · 60分",
};

/** ABAP WRITE の列番号 → 画面上の位置（1列 = CH px） */
const CH = 8;
const LINE_SIZE = 200;

interface ReportCell {
  col: number;
  text: string;
  width?: number;
  align?: "left" | "right";
}

type ReportRow = { kind: "cells"; cells: ReportCell[] } | { kind: "uline" };

function ReportPreview({ rows, caption }: { rows: ReportRow[]; caption?: string }) {
  return (
    <figure className="not-prose my-4">
      {caption ? (
        <figcaption className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          {caption}
        </figcaption>
      ) : null}
      <div className="overflow-x-auto rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-900">
        <div
          className="relative font-mono text-[11px] leading-6 text-slate-800 dark:text-slate-100"
          style={{ width: LINE_SIZE * CH }}
        >
          {rows.map((row, i) => {
            if (row.kind === "uline") {
              return (
                <div
                  key={i}
                  className="border-b border-slate-400 dark:border-slate-500"
                  style={{ width: LINE_SIZE * CH, height: 24 }}
                />
              );
            }
            return (
              <div key={i} className="relative h-6">
                {row.cells.map((cell, j) => (
                  <span
                    key={j}
                    className="absolute top-0 whitespace-pre"
                    style={{
                      left: (cell.col - 1) * CH,
                      width: cell.width ? cell.width * CH : undefined,
                      textAlign: cell.align ?? "left",
                    }}
                  >
                    {cell.text}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        1列 = {CH}px（<code>LINE-SIZE 200</code> → 幅 {LINE_SIZE * CH}px）
      </p>
    </figure>
  );
}

const PREVIEW_HEADER_ROWS: ReportRow[] = [
  {
    kind: "cells",
    cells: [
      { col: 1, text: "PGMID:" },
      { col: 9, text: "CREATE_REPORT_2" },
      { col: 155, text: "DATE:" },
      { col: 160, text: "2026/06/01", width: 9, align: "right" },
    ],
  },
  {
    kind: "cells",
    cells: [
      { col: 1, text: "USER:" },
      { col: 9, text: "YAMADA" },
      { col: 155, text: "TIME:" },
      { col: 160, text: "135400", width: 9 },
    ],
  },
  {
    kind: "cells",
    cells: [{ col: 80, text: "仕訳日記帳 演習2", width: 20 }],
  },
  {
    kind: "cells",
    cells: [
      { col: 155, text: "PAGE:" },
      { col: 160, text: "1", width: 9 },
    ],
  },
  { kind: "cells", cells: [] },
  {
    kind: "cells",
    cells: [
      { col: 1, text: "会社コード:" },
      { col: 13, text: "1000" },
    ],
  },
  {
    kind: "cells",
    cells: [
      { col: 1, text: "転記日付:" },
      { col: 13, text: "2025/01/01" },
      { col: 25, text: "～" },
      { col: 29, text: "2025/01/31" },
    ],
  },
  { kind: "cells", cells: [] },
  { kind: "cells", cells: [] },
  {
    kind: "cells",
    cells: [
      { col: 1, text: "伝票タイプ" },
      { col: 18, text: "転記日付" },
      { col: 30, text: "伝票日付" },
      { col: 42, text: "伝票番号" },
      { col: 54, text: "ユーザ" },
      { col: 68, text: "明細" },
      { col: 73, text: "勘定" },
      { col: 106, text: "借方金額", width: 14, align: "right" },
      { col: 122, text: "貸方金額", width: 14, align: "right" },
      { col: 139, text: "摘要" },
    ],
  },
  { kind: "uline" },
];

function formatAmount(n: number): string {
  return n.toLocaleString("ja-JP");
}

const PREVIEW_DETAIL_ROWS: ReportRow[] = [
  {
    kind: "cells",
    cells: [
      { col: 1, text: "SA" },
      { col: 4, text: "G/L伝票" },
      { col: 18, text: "2025/01/15" },
      { col: 30, text: "2025/01/15" },
      { col: 42, text: "1900000123" },
      { col: 54, text: "YAMADA" },
      { col: 68, text: "001" },
      { col: 73, text: "41000000" },
      { col: 85, text: "売上高" },
      { col: 106, text: formatAmount(120000), width: 14, align: "right" },
      { col: 122, text: "", width: 14, align: "right" },
      { col: 139, text: "1月分売上" },
    ],
  },
  {
    kind: "cells",
    cells: [
      { col: 1, text: "SA" },
      { col: 4, text: "G/L伝票" },
      { col: 18, text: "2025/01/15" },
      { col: 30, text: "2025/01/15" },
      { col: 42, text: "1900000123" },
      { col: 54, text: "YAMADA" },
      { col: 68, text: "002" },
      { col: 73, text: "11201000" },
      { col: 85, text: "売掛金" },
      { col: 106, text: "", width: 14, align: "right" },
      { col: 122, text: formatAmount(120000), width: 14, align: "right" },
      { col: 139, text: "" },
    ],
  },
];

const FINAL_PROGRAM = `REPORT create_report_2
  NO STANDARD PAGE HEADING
  LINE-SIZE 200
  LINE-COUNT 58.

*---------------------------------------------------------------------*
* TYPES
*---------------------------------------------------------------------*
TYPES: BEGIN OF g_typ_bkpf,
         bukrs TYPE bkpf-bukrs,
         blart TYPE bkpf-blart,
         budat TYPE bkpf-budat,
         bldat TYPE bkpf-bldat,
         belnr TYPE bkpf-belnr,
         usnam TYPE bkpf-usnam,
         gjahr TYPE bkpf-gjahr,
       END OF g_typ_bkpf.

TYPES: BEGIN OF g_typ_bseg,
         bukrs TYPE bseg-bukrs,
         belnr TYPE bseg-belnr,
         gjahr TYPE bseg-gjahr,
         buzei TYPE bseg-buzei,
         hkont TYPE bseg-hkont,
         shkzg TYPE bseg-shkzg,
         dmbtr TYPE bseg-dmbtr,
         sgtxt TYPE bseg-sgtxt,
       END OF g_typ_bseg.

TYPES: BEGIN OF g_typ_t001,
         ktopl TYPE t001-ktopl,
         waers TYPE t001-waers,
       END OF g_typ_t001.

TYPES: BEGIN OF g_typ_t003t,
         blart TYPE t003t-blart,
         ltext TYPE t003t-ltext,
       END OF g_typ_t003t.

TYPES: BEGIN OF g_typ_skat,
         saknr TYPE skat-saknr,
         txt20 TYPE skat-txt20,
       END OF g_typ_skat.

TYPES: BEGIN OF g_typ_out,
         bukrs     TYPE bkpf-bukrs,
         blart     TYPE bkpf-blart,
         blart_txt TYPE t003t-ltext,
         belnr     TYPE bkpf-belnr,
         budat     TYPE bkpf-budat,
         bldat     TYPE bkpf-bldat,
         usnam     TYPE bkpf-usnam,
         gjahr     TYPE bkpf-gjahr,
         buzei     TYPE bseg-buzei,
         hkont     TYPE bseg-hkont,
         hkont_txt TYPE skat-txt20,
         shkzg     TYPE bseg-shkzg,
         dmbtr     TYPE bseg-dmbtr,
         sgtxt     TYPE bseg-sgtxt,
         waers     TYPE t001-waers,
       END OF g_typ_out.

*---------------------------------------------------------------------*
* DATA
*---------------------------------------------------------------------*
DATA: gt_bkpf  TYPE STANDARD TABLE OF g_typ_bkpf,
      gs_bkpf  TYPE g_typ_bkpf,
      gt_bseg  TYPE STANDARD TABLE OF g_typ_bseg,
      gs_bseg  TYPE g_typ_bseg,
      gs_t001  TYPE g_typ_t001,
      gt_t003t TYPE STANDARD TABLE OF g_typ_t003t,
      gs_t003t TYPE g_typ_t003t,
      gt_skat  TYPE STANDARD TABLE OF g_typ_skat,
      gs_skat  TYPE g_typ_skat,
      gt_out   TYPE STANDARD TABLE OF g_typ_out,
      gs_out   TYPE g_typ_out.

DATA: g_wrk_budat  TYPE bkpf-budat,
      g_start_date TYPE bkpf-budat,
      g_end_date   TYPE bkpf-budat.

DATA: gv_debit  TYPE bseg-dmbtr,
      gv_credit TYPE bseg-dmbtr.

*---------------------------------------------------------------------*
* CONSTANTS
*---------------------------------------------------------------------*
CONSTANTS: c_spras   TYPE t003t-spras VALUE 'J',
           c_shkzg_s TYPE bseg-shkzg VALUE 'S',
           c_shkzg_h TYPE bseg-shkzg VALUE 'H'.

*---------------------------------------------------------------------*
* PARAMETER
*---------------------------------------------------------------------*
PARAMETERS: p_bukrs TYPE t001-bukrs OBLIGATORY.
SELECT-OPTIONS: s_budat FOR g_wrk_budat OBLIGATORY.

*---------------------------------------------------------------------*
* START-OF-SELECTION
*---------------------------------------------------------------------*
START-OF-SELECTION.

*---------------------------------------------------------------------*
* Ⅰ データ初期化
*---------------------------------------------------------------------*
  CLEAR: gs_bkpf,
  gs_bseg,
  gs_t001,
  gs_t003t,
  gs_skat,
  gs_out,
  g_start_date,
  g_end_date.

  REFRESH: gt_bkpf,
  gt_bseg,
  gt_t003t,
  gt_skat,
  gt_out.

*---------------------------------------------------------------------*
* 選択条件の日付表示用
*---------------------------------------------------------------------*
  READ TABLE s_budat INDEX 1.
  IF sy-subrc = 0.
    g_start_date = s_budat-low.
    g_end_date   = s_budat-high.
  ENDIF.

*---------------------------------------------------------------------*
* Ⅱ 主処理
* 1. データ抽出
*---------------------------------------------------------------------*

* (1) 会社コードマスタ情報の取得
  SELECT SINGLE ktopl
  waers
  INTO CORRESPONDING FIELDS OF gs_t001
  FROM t001
  WHERE bukrs = p_bukrs.

* (2) 全伝票タイプテキストの取得
  SELECT blart
  ltext
  INTO TABLE gt_t003t
  FROM t003t
  WHERE spras = c_spras.

* (3) 会計伝票ヘッダ情報の取得
  SELECT bukrs
  blart
  budat
  bldat
  belnr
  usnam
  gjahr
  INTO TABLE gt_bkpf
  FROM bkpf
  WHERE bukrs = p_bukrs
  AND budat IN s_budat.

  IF gt_bkpf IS INITIAL.
    MESSAGE s000(z01) WITH '対象データは登録されていません'.
    LEAVE LIST-PROCESSING.
  ENDIF.

* (4a) ヘッダに属する明細を一括取得（内部テーブル）
  IF gt_bkpf IS NOT INITIAL.
    SELECT bukrs
    belnr
    gjahr
    buzei
    hkont
    shkzg
    dmbtr
    sgtxt
    INTO TABLE gt_bseg
    FROM bseg
    FOR ALL ENTRIES IN gt_bkpf
    WHERE bukrs = gt_bkpf-bukrs
    AND belnr = gt_bkpf-belnr
    AND gjahr = gt_bkpf-gjahr.
  ENDIF.

* (4b) 明細に登場する勘定名を一括取得（内部テーブル）
  IF gt_bseg IS NOT INITIAL.
    SELECT saknr
    txt20
    INTO TABLE gt_skat
    FROM skat
    FOR ALL ENTRIES IN gt_bseg
    WHERE spras = c_spras
    AND ktopl = gs_t001-ktopl
    AND saknr = gt_bseg-hkont.
  ENDIF.

* (4) 帳票出力用内部テーブルへの格納
  LOOP AT gt_bkpf INTO gs_bkpf.

*   4-① 伝票タイプテキストの格納
    READ TABLE gt_t003t INTO gs_t003t
    WITH KEY blart = gs_bkpf-blart.
    IF sy-subrc <> 0.
      CLEAR gs_t003t.
    ENDIF.

    LOOP AT gt_bseg INTO gs_bseg
      WHERE bukrs = gs_bkpf-bukrs
        AND belnr = gs_bkpf-belnr
        AND gjahr = gs_bkpf-gjahr.

*     4-② 勘定コードテキストの格納（内部テーブルから）
      READ TABLE gt_skat INTO gs_skat
        WITH KEY saknr = gs_bseg-hkont.
      IF sy-subrc <> 0.
        CLEAR gs_skat.
      ENDIF.

*     4-③ 帳票出力用内部テーブルへの格納
      CLEAR gs_out.

      gs_out-bukrs     = gs_bkpf-bukrs.
      gs_out-blart     = gs_bkpf-blart.
      gs_out-blart_txt = gs_t003t-ltext.
      gs_out-belnr     = gs_bkpf-belnr.
      gs_out-budat     = gs_bkpf-budat.
      gs_out-bldat     = gs_bkpf-bldat.
      gs_out-usnam     = gs_bkpf-usnam.
      gs_out-gjahr     = gs_bkpf-gjahr.
      gs_out-buzei     = gs_bseg-buzei.
      gs_out-hkont     = gs_bseg-hkont.
      gs_out-hkont_txt = gs_skat-txt20.
      gs_out-shkzg     = gs_bseg-shkzg.
      gs_out-dmbtr     = gs_bseg-dmbtr.
      gs_out-sgtxt     = gs_bseg-sgtxt.
      gs_out-waers     = gs_t001-waers.

      APPEND gs_out TO gt_out.

*     4-④ 作業領域の初期化
      CLEAR: gs_bseg,
      gs_out,
      gs_skat.

    ENDLOOP.

*   4-⑤ 作業領域の初期化
    CLEAR: gs_bkpf,
    gs_t003t.

  ENDLOOP.

  IF gt_out IS INITIAL.
    MESSAGE s000(z01) WITH '対象データは登録されていません'.
    LEAVE LIST-PROCESSING.
  ENDIF.

*---------------------------------------------------------------------*
* 2. データ出力
* (1) ソート処理
*---------------------------------------------------------------------*
  SORT gt_out BY blart budat belnr buzei.

*---------------------------------------------------------------------*
* TOP-OF-PAGE
*---------------------------------------------------------------------*
TOP-OF-PAGE.

  WRITE: /1   'PGMID:' NO-GAP,
          9  sy-cprog,
          155 'DATE:' NO-GAP,
          160(9) sy-datum  USING EDIT MASK '____/__/__' RIGHT-JUSTIFIED,
         /1   'USER:' NO-GAP,
          9  sy-uname,
          155 'TIME:' NO-GAP,
          160(9) sy-uzeit RIGHT-JUSTIFIED,
         /80(20) '仕訳日記帳 演習2' CENTERED,
          155 'PAGE:' NO-GAP,
          160(9) sy-pagno NO-SIGN RIGHT-JUSTIFIED.

  SKIP.

  WRITE: /1  '会社コード:',
          13 p_bukrs,
         /1  '転記日付:',
          13 g_start_date USING EDIT MASK '____/__/__'.


  IF g_end_date IS NOT INITIAL.
    WRITE: 25 '～',
           29 g_end_date USING EDIT MASK '____/__/__'.
  ENDIF.

  SKIP 2.

  WRITE: /1   TEXT-c01,
          18  TEXT-c02,
          30  TEXT-c03,
          42  TEXT-c04,
          54  TEXT-c05,
          68  TEXT-c06,
          73  TEXT-c07,
          106(14) TEXT-c08 RIGHT-JUSTIFIED,
          122(14) TEXT-c09 RIGHT-JUSTIFIED,
          139 TEXT-c10.

  ULINE.

*---------------------------------------------------------------------*
* END-OF-SELECTION
*---------------------------------------------------------------------*

END-OF-SELECTION.

  LOOP AT gt_out INTO gs_out.

* 借方・貸方判定
    CLEAR: gv_debit, gv_credit.


    IF gs_out-shkzg = c_shkzg_s.
      gv_debit = gs_out-dmbtr.
    ELSEIF gs_out-shkzg = c_shkzg_h.
      gv_credit = gs_out-dmbtr.
    ENDIF.


    WRITE: /1   gs_out-blart,
            4   gs_out-blart_txt,
            18  gs_out-budat USING EDIT MASK '____/__/__',
            30  gs_out-bldat USING EDIT MASK '____/__/__',
            42  gs_out-belnr,
            54  gs_out-usnam,
            68  gs_out-buzei,
            73  gs_out-hkont,
            85  gs_out-hkont_txt,
            106(14) gv_debit  CURRENCY gs_out-waers RIGHT-JUSTIFIED, "借方金額
            122(14) gv_credit CURRENCY gs_out-waers RIGHT-JUSTIFIED, "貸方金額
            139 gs_out-sgtxt. "摘要

  ENDLOOP.`;

function BreakPointCheck({
  insert,
  ask,
  reveal,
}: {
  insert: string;
  ask: React.ReactNode;
  reveal: React.ReactNode;
}) {
  return (
    <>
      <Callout variant="note">
        <strong>🔴 ブレークポイントで確認</strong>
        <br />
        次の <code>BREAK-POINT.</code> を一時的に差し込んで実行し、デバッガで変数の中身を確認します。
      </Callout>
      <CodeBlock language="ABAP" code={insert} />
      <Dialog speaker="teacher">{ask}</Dialog>
      <Reveal label="期待される結果を見る">
        <InfoPanel title="デバッガで見えるはず" variant="reference">
          {reveal}
        </InfoPanel>
      </Reveal>
    </>
  );
}

export default function ExerciseJournalLedgerDetailLesson() {
  return (
    <Lesson
      chrome={lessonChrome(
        "abap-training",
        "s2-exercise-journal-ledger-detail",
        lessonMeta.title
      )}
      slides={[
        {
          title: "演習の概要",
          plainText:
            "特別演習② — 明細・金額つき仕訳日記帳を作る\n演習1（BKPFヘッダのみ）から発展。ゴールは明細行・勘定名・借方/貸方2列・通貨付き金額。進め方は1スライドずつコードを書き、BREAK-POINTで確認。いきなり完成コードを覚えなくてよい。",
          content: (
            <>
              <hgroup>
                <h1>特別演習② — 明細・金額つき仕訳日記帳を作る</h1>
                <p>
                  会計伝票の<strong>ヘッダ（BKPF）</strong>と<strong>明細（BSEG）</strong>をつなぎ、
                  会計担当者が読みやすい<strong>仕訳日記帳</strong>を画面に出すレポートを作ります。
                  プログラム名の例は <code>create_report_2</code> です（SE38 で任意の Z 名を付けて構いません）。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "60分" },
                  { icon: "⭐", text: "特別演習②" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <Dialog speaker="teacher">
                この演習は「難しいコードを一気に書く」ものではありません。
                <strong>1スライド＝1かたまりの処理</strong>を追加し、その都度デバッガで中身を見る進め方です。
                分からなくなったら、つまずきポイントのスライドに戻ってください。
              </Dialog>
              <Callout variant="tip">
                前提：演習①（特別演習 — 仕訳日記帳プログラムを作る）で、BKPF だけを一覧に出せること。
                まだの方は、先に演習①を完了してから取り組むと安心です。
              </Callout>
              <h3>演習①と演習②の違い（やさしい対比）</h3>
              <InfoPanel title="何が増えるか" variant="breakdown">
                <table>
                  <thead>
                    <tr>
                      <th>観点</th>
                      <th>演習①</th>
                      <th>演習②（今回）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1行の意味</td>
                      <td>伝票ヘッダ1件＝リスト1行</td>
                      <td>
                        <strong>明細1件＝リスト1行</strong>（同じ伝票番号が複数行出る）
                      </td>
                    </tr>
                    <tr>
                      <td>主なテーブル</td>
                      <td>BKPF のみ</td>
                      <td>BKPF ＋ BSEG ＋ マスタ（T001 / T003T / SKAT）</td>
                    </tr>
                    <tr>
                      <td>金額の出し方</td>
                      <td>なし（またはヘッダのみ）</td>
                      <td>借方列・貸方列に分け、会社の通貨で表示</td>
                    </tr>
                    <tr>
                      <td>作業用の箱</td>
                      <td>ヘッダ用内部テーブル</td>
                      <td>
                        <code>gt_out</code> … 帳票1行分の形にそろえた一覧
                      </td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <h3>今日のゴール（チェックリスト）</h3>
              <ul>
                <li>会社コード・転記日付の範囲で伝票を絞り込める</li>
                <li>伝票タイプ名・勘定名などの<strong>テキスト</strong>が一覧に付く</li>
                <li>借方金額・貸方金額が<strong>別の列</strong>に、読みやすく並ぶ</li>
                <li>該当データが0件のとき、空の帳票を出さずメッセージで止まる</li>
              </ul>
              <Dialog speaker="b">
                テーブル名が5つも出てきて、最初は圧倒されそうです…
              </Dialog>
              <Dialog speaker="a">
                覚えるのは役割だけで大丈夫です。「会社の設定」「伝票の表紙」「伝票の中身」「名前の辞書」。次のスライドで1つずつ説明があります。
              </Dialog>
              <Dialog speaker="teacher">
                最後まで一人で完璧に書けなくても問題ありません。
                完成コードは資料に載せてあるので、<strong>動くものを見ながら</strong>「なぜこの順番か」を理解するのが目的です。
              </Dialog>
              <Callout variant="note">
                今回の演習は<strong>データの構造を理解する</strong>ことが主目的です。
                そのため <code>SELECT</code> で表ごとに取得し、<code>LOOP</code> と <code>READ TABLE</code> でキー結合する型を使います（
                SQL <code>JOIN</code> は最後の発展スライドで紹介します）。
              </Callout>
            </>
          ),
        },
        {
          title: "全体像",
          plainText:
            "全体像 — 利用者が選択画面で会社・日付を入力して実行するところから図示。並列OKは会社設定と伝票タイプ名表。順番固定は掃除→伝票取得→1件ずつ明細を拾う→並べ替え→画面表示。",
          content: (
            <>
              <h2>全体像 — データの流れ</h2>
              <p>
                流れは<strong>「あなたが条件を入れる」</strong>ところから始まります。
                実行（F8）のあと、SAP がデータを集めて、最後に仕訳日記帳を画面に出します。
              </p>
              <Callout variant="note">
                図の見方：枠のタイトルが<strong>「並列OK」</strong>の部分は、どちらを先に書いてもよい処理です。
                <strong>「順番どおり」</strong>の部分は、上から順に進める必要があり、入れ替えできません。
              </Callout>
              <MermaidDiagram
                chart={`flowchart TD
  subgraph userStep ["STEP 0 利用者がすること"]
    direction TB
    screen["選択画面が表示される"]
    inp1["会社コードを入力<br/>p_bukrs"]
    inp2["転記日付の範囲を入力<br/>s_budat"]
    f8["実行ボタン F8"]
    screen --> inp1
    screen --> inp2
    inp1 --> f8
    inp2 --> f8
  end

  subgraph sapStart ["STEP 1 SAPがプログラムを動かし始める"]
    init["前回のデータを消す<br/>CLEAR / REFRESH"]
    saveDate["入力した日付を控える<br/>帳票ヘッダ表示用"]
    f8 --> init
    init --> saveDate
  end

  subgraph parallel ["並列OK — どちらを先に読んでもよい"]
    direction LR
    t001["会社の設定を1件読む<br/>T001 → gs_t001"]
    t003t["伝票タイプの名前表を読む<br/>T003T → gt_t003t"]
  end

  saveDate --> t001
  saveDate --> t003t

  ready["2つの準備が終わった"]

  t001 --> ready
  t003t --> ready

  subgraph sequential ["順番どおり — 前が終わるまで次へ進めない"]
    direction TB
    bkpf["条件に合う伝票の表紙を読む<br/>BKPF → gt_bkpf"]
    zero1{"伝票は0件?"}
    stop1["メッセージして終了"]
    loopHead["伝票を1件ずつ処理"]
    stepA["伝票タイプの日本語名を当てる"]
    stepB["明細を一括取得<br/>BSEG → gt_bseg"]
    stepC["勘定名を一括取得<br/>SKAT → gt_skat"]
    stepD["伝票LOOP→明細LOOP<br/>READ TABLE で結合"]
    zero2{"明細は0件?"}
    stop2["メッセージして終了"]
    sort["一覧の並び順を整える<br/>SORT gt_out"]
    ready --> bkpf
    bkpf --> zero1
    zero1 -->|はい| stop1
    zero1 -->|いいえ| stepB
    stepB --> stepC --> loopHead
    loopHead --> stepA --> stepD
    stepD --> zero2
    zero2 -->|はい| stop2
    zero2 -->|いいえ| sort
  end

  subgraph display ["STEP 最後 画面に出す"]
    direction LR
    top["各ページの見出し<br/>TOP-OF-PAGE"]
    list["明細の行を印刷<br/>END-OF-SELECTION"]
  end

  sort --> top
  sort --> list`}
              />
              <h3>3行で覚える全体の流れ</h3>
              <ol>
                <li>
                  <strong>入力</strong> … 会社・日付を入れて実行
                </li>
                <li>
                  <strong>準備＋収集</strong> … 辞書と伝票を読み、1明細＝1行の一覧（
                  <code>gt_out</code>）を作る
                </li>
                <li>
                  <strong>表示</strong> … 並べ替えてから、仕訳日記帳を画面に出す
                </li>
              </ol>
              <InfoPanel title="図とプログラムの対応（初学者向け）" variant="breakdown">
                <table>
                  <thead>
                    <tr>
                      <th>図の言葉</th>
                      <th>コードでいうと</th>
                      <th>並列？</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>会社コード・転記日付を入力</td>
                      <td>
                        <code>PARAMETERS</code> / <code>SELECT-OPTIONS</code>
                      </td>
                      <td>—（あなたが先に行う）</td>
                    </tr>
                    <tr>
                      <td>前回のデータを消す</td>
                      <td>
                        <code>CLEAR</code> / <code>REFRESH</code>
                      </td>
                      <td>順番どおり（いちばん最初）</td>
                    </tr>
                    <tr>
                      <td>会社の設定／伝票タイプの名前表</td>
                      <td>
                        T001 / T003T の <code>SELECT</code>
                      </td>
                      <td>
                        <strong>並列OK</strong>
                      </td>
                    </tr>
                    <tr>
                      <td>伝票の表紙を読む</td>
                      <td>
                        BKPF の <code>SELECT</code>
                      </td>
                      <td>順番どおり（入力した会社・日付を使う）</td>
                    </tr>
                    <tr>
                      <td>伝票→明細→勘定名→1行追加</td>
                      <td>
                        <code>FOR ALL ENTRIES</code> で一括取得 → 入れ子 <code>LOOP</code> と{" "}
                        <code>READ TABLE</code>
                      </td>
                      <td>順番どおり（結合の型を崩さない）</td>
                    </tr>
                    <tr>
                      <td>並べ替え→画面</td>
                      <td>
                        <code>SORT</code> → <code>WRITE</code>
                      </td>
                      <td>順番どおり（一覧ができてから）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="b">
                図が「自分が F8 を押す」ところから始まっているので、何のために動いているか分かりやすいです。
              </Dialog>
              <Dialog speaker="a">
                並列OKは「2つの辞書を先に揃える」、順番どおりは「伝票を開いてから中身を見る」、と対応していますね。
              </Dialog>
              <Dialog speaker="teacher">
                プログラムは<strong>上から1行ずつ</strong>動きます。「並列OK」は、T001 のブロックと T003T
                のブロックを、ソース上で入れ替えてもよい、という意味です。
                結合は<strong>先に BSEG・SKAT を内部テーブルへ</strong>載せ、LOOP 内は <code>READ TABLE</code> だけ。
                この順番を崩さないでください。
              </Dialog>
              <h3>たとえ話：伝票＝領収書の束</h3>
              <Dialog speaker="teacher">
                <strong>BKPF</strong> は「領収書の表紙」（いつ・誰が・伝票番号）。
                <strong>BSEG</strong> は「表紙の中の明細行」（勘定・金額・借方か貸方か）。
                仕訳日記帳は、表紙の情報を<strong>明細の行ごとに繰り返し写した一覧</strong>だと思ってください。
              </Dialog>
              <InfoPanel title="使うテーブル（役割を先に覚える）" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>テーブル</th>
                      <th>何のデータ？</th>
                      <th>いつ使う？</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>T001</strong>
                      </td>
                      <td>
                        会社コードの設定（勘定表 <code>ktopl</code>、通貨 <code>waers</code>）
                      </td>
                      <td>最初に1回だけ読む（会社ごとのルール）</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>T003T</strong>
                      </td>
                      <td>
                        伝票タイプコード → 日本語名（例 SA → G/L伝票）
                      </td>
                      <td>まとめて読み、ループ内で <code>READ TABLE</code></td>
                    </tr>
                    <tr>
                      <td>
                        <strong>BKPF</strong>
                      </td>
                      <td>会計伝票ヘッダ（表紙）</td>
                      <td>会社・転記日付で一括取得</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>BSEG</strong>
                      </td>
                      <td>会計伝票明細（中身の行）</td>
                      <td>
                        <code>FOR ALL ENTRIES</code> で一括取得 → <code>gt_bseg</code>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>SKAT</strong>
                      </td>
                      <td>勘定科目の名称</td>
                      <td>
                        <code>FOR ALL ENTRIES</code> で一括取得 → <code>READ TABLE</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <h3>処理ブロックの順番（ABAP の流れ）</h3>
              <ol>
                <li>
                  <strong>プログラムの先頭</strong> … 型・変数・選択画面（実行前から書いてある）
                </li>
                <li>
                  <strong>START-OF-SELECTION</strong> … 実行ボタンを押したあと、データ取得・結合・ソート
                </li>
                <li>
                  <strong>TOP-OF-PAGE</strong> … リストの各ページの「上段」（タイトル・見出し）
                </li>
                <li>
                  <strong>END-OF-SELECTION</strong> … 明細行を1行ずつ <code>WRITE</code>
                </li>
              </ol>
              <Dialog speaker="b">
                演習①では伝票が1行ずつ出たのに、今回は同じ伝票番号が何行も出てきそうで不安です…
              </Dialog>
              <Dialog speaker="teacher">
                それで正しい理解に近づいています。今回は<strong>明細1行＝リスト1行</strong>です。
                表紙の「転記日付」「伝票番号」は、同じ伝票の明細行それぞれに同じ値が載ります（Excel で行をコピーしたイメージ）。
              </Dialog>
              <Dialog speaker="a">
                だから <code>gt_bkpf</code> が5件でも、明細が合計20行なら <code>gt_out</code> は20行、と数えればよいですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "型・定数・変数",
          plainText:
            "型・定数・変数 — g_typ_bkpf/bseg/t001/t003t/out と gt_out。CONSTANTS c_spras/c_shkzg_s/c_shkzg_h。gv_debit/gv_credit は出力用。",
          content: (
            <>
              <h2>型・定数・変数 — 入れ物を用意する</h2>
              <p>
                プログラムのいちばん上で、<strong>「どんな形のデータを扱うか」</strong>を宣言します。
                DBから取ったままでは帳票に出しにくいので、最後に<strong>帳票1行分の形</strong>（
                <code>g_typ_out</code>）を決めておきます。
              </p>
              <h3>5つの型 — それぞれ何用？</h3>
              <InfoPanel title="TYPES の役割分担" variant="breakdown">
                <ul>
                  <li>
                    <code>g_typ_bkpf</code> … BKPF から取ったヘッダ項目だけ（作業用）
                  </li>
                  <li>
                    <code>g_typ_bseg</code> … BSEG から取った明細項目だけ（<code>gt_bseg</code>）
                  </li>
                  <li>
                    <code>g_typ_skat</code> … SKAT から取った勘定コードと名称（<code>gt_skat</code>）
                  </li>
                  <li>
                    <code>g_typ_t001</code> … 会社マスタ（勘定表・通貨）1件分
                  </li>
                  <li>
                    <code>g_typ_t003t</code> … 伝票タイプのコードとテキスト1行分
                  </li>
                  <li>
                    <code>g_typ_out</code> … <strong>帳票に出す1行</strong>（ヘッダ＋明細＋テキスト＋通貨を全部入れた形）
                  </li>
                </ul>
              </InfoPanel>
              <CodeBlock
                language="ABAP"
                code={`TYPES: BEGIN OF g_typ_out,
         bukrs     TYPE bkpf-bukrs,
         blart     TYPE bkpf-blart,
         blart_txt TYPE t003t-ltext,
         belnr     TYPE bkpf-belnr,
         ...
         hkont_txt TYPE skat-txt20,
         shkzg     TYPE bseg-shkzg,
         dmbtr     TYPE bseg-dmbtr,
         waers     TYPE t001-waers,
       END OF g_typ_out.

CONSTANTS: c_spras   TYPE t003t-spras VALUE 'J',
           c_shkzg_s TYPE bseg-shkzg VALUE 'S',
           c_shkzg_h TYPE bseg-shkzg VALUE 'H'.

DATA: gt_out TYPE STANDARD TABLE OF g_typ_out,
      gv_debit  TYPE bseg-dmbtr,
      gv_credit TYPE bseg-dmbtr.`}
              />
              <h3>定数（CONSTANTS）を使う理由</h3>
              <ul>
                <li>
                  <code>c_spras = 'J'</code> … 日本語のテキストを読むため（ログオン言語と合わせる）
                </li>
                <li>
                  <code>c_shkzg_s = 'S'</code> … 借方（Soll）の印
                </li>
                <li>
                  <code>c_shkzg_h = 'H'</code> … 貸方（Haben）の印
                </li>
              </ul>
              <p>
                プログラム中に <code>&apos;S&apos;</code> と直書きすると、後で typo（
                <code>&apos;5&apos;</code> など）しやすいので、定数にまとめます。
              </p>
              <h3>出力直前だけ使う変数</h3>
              <p>
                <code>gv_debit</code> / <code>gv_credit</code> は、明細1行を出力するときに「借方列用」「貸方列用」に金額を分けて入れる<strong>一時的な入れ物</strong>です。
                ループの先頭で毎回 <code>CLEAR</code> します。
              </p>
              <Dialog speaker="b">
                型が5つもあって、どれに何を入れるか最初は混乱しそうです。
              </Dialog>
              <Dialog speaker="a">
                最後に帳票が読むのは <code>gt_out</code> だけ、と覚えれば大丈夫です。それ以外は「DBから一旦受け取る箱」です。
              </Dialog>
              <Dialog speaker="teacher">
                <code>TYPE bkpf-bukrs</code> のように書くと、桁数や型が SAP 標準と必ず一致します。自分で「文字10桁」などと決める必要はありません。
              </Dialog>
            </>
          ),
        },
        {
          title: "入力と初期化",
          plainText:
            "入力と初期化 — PARAMETERS p_bukrs、SELECT-OPTIONS s_budat。START-OF-SELECTION先頭でCLEAR/REFRESH。READ TABLE s_budatで表示用日付範囲を退避。",
          content: (
            <>
              <h2>入力画面と初期化</h2>
              <p>
                利用者が実行前に入力する画面と、実行直後の「掃除」です。第4章で学んだ{" "}
                <code>PARAMETERS</code>（1つの値）と <code>SELECT-OPTIONS</code>（範囲）をそのまま使います。
              </p>
              <CodeBlock
                language="ABAP"
                code={`PARAMETERS: p_bukrs TYPE t001-bukrs OBLIGATORY.
SELECT-OPTIONS: s_budat FOR g_wrk_budat OBLIGATORY.

START-OF-SELECTION.
  CLEAR: gs_bkpf, gs_bseg, gs_t001, gs_t003t, gs_out,
         g_start_date, g_end_date.
  REFRESH: gt_bkpf, gt_bseg, gt_t003t, gt_skat, gt_out.

  READ TABLE s_budat INDEX 1.
  IF sy-subrc = 0.
    g_start_date = s_budat-low.
    g_end_date   = s_budat-high.
  ENDIF.`}
              />
              <InfoPanel title="入力欄の意味" variant="breakdown">
                <ul>
                  <li>
                    <code>p_bukrs</code> … どの会社の伝票か（1社だけ → PARAMETERS）
                  </li>
                  <li>
                    <code>s_budat</code> … 転記日付の From〜To（範囲 → SELECT-OPTIONS）
                  </li>
                  <li>
                    <code>OBLIGATORY</code> … 空のまま実行できない（必須）
                  </li>
                </ul>
              </InfoPanel>
              <InfoPanel title="CLEAR と REFRESH の違い" variant="reference">
                <ul>
                  <li>
                    <code>CLEAR gs_xxx</code> … <strong>1行分</strong>の作業領域を空にする
                  </li>
                  <li>
                    <code>REFRESH gt_xxx</code> … <strong>複数行入りの箱</strong>（内部テーブル）を0行にする
                  </li>
                </ul>
                <p className="mt-2 text-sm">
                  2回目以降の実行で行数が倍になるときは、<code>REFRESH gt_out</code> を忘れていないか確認してください。
                </p>
              </InfoPanel>
              <Dialog speaker="teacher">
                <code>g_start_date</code> / <code>g_end_date</code> は、帳票ヘッダに「転記日付 2025/01/01 ～ 2025/01/31」と<strong>見せるためだけ</strong>に退避します。
                SELECT の条件は <code>s_budat</code> をそのまま使い、別変数は必須ではありませんが、見出し用に分けている例です。
              </Dialog>
              <Dialog speaker="b">
                実行するたびに最初に掃除するんですね。前のデータが混ざるのを防ぐためですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "① マスタ取得",
          plainText:
            "① マスタ取得 — T001は1件。T003Tはspras='J'で全伝票タイプ（帳票に出ない型も含む＝研修用簡略化）。\nB：出ない伝票タイプまで取るの？→ 件数少・BKPF前・READ TABLEで足りる。絞るならBKPF後にFAE。\nWHERE IN：s_budatはSELECT-OPTIONS用。複合キーはFOR ALL ENTRIESが定番。",
          content: (
            <>
              <h2>① マスタ取得 — T001 と T003T</h2>
              <p>
                伝票本体を読む<strong>前に</strong>、会社の設定と「伝票タイプの日本語名一覧」を用意します。
                ここで失敗すると、あとから勘定名や通貨が取れません。
              </p>
              <h3>（1）T001 — 会社コードマスタを1件だけ</h3>
              <p>
                <code>SELECT SINGLE</code> は「条件に合う行が1件だけ欲しい」ときに使います。会社コードは1社指定なので、
                <code>ktopl</code>（どの勘定表を使うか）と <code>waers</code>（表示通貨）が取れます。
              </p>
              <h3>（2）T003T — 伝票タイプのテキストをまとめて</h3>
              <p>
                伝票タイプは種類が多いので、<strong>先に全部読んで内部テーブルに入れ</strong>、あとで{" "}
                <code>READ TABLE</code> します（ループのたびに DB に行かないため）。
              </p>
              <CodeBlock
                language="ABAP"
                code={`  SELECT SINGLE ktopl waers
    INTO CORRESPONDING FIELDS OF gs_t001
    FROM t001
    WHERE bukrs = p_bukrs.

  SELECT blart ltext
    INTO TABLE gt_t003t
    FROM t003t
    WHERE spras = c_spras.`}
              />
              <Dialog speaker="a">
                T003T も SKAT も「辞書」を先に内部テーブルへ載せ、LOOP 内は <code>READ TABLE</code> だけ、ですね。
                第8章の型と同じです。
              </Dialog>
              <InfoPanel
                title="補足：T003T は「必要以上」に見える取得"
                variant="reference"
                lead={
                  <>
                    この演習では T003T を <code>WHERE spras = c_spras</code> だけで取り、
                    <strong>帳票に1件も出ない伝票タイプ</strong>の文言も含めます。意図的な簡略化です。
                  </>
                }
              >
                <ul>
                  <li>
                    <strong>なぜ絞らない？</strong> … ① この時点では BKPF 未取得で、必要な <code>blart</code> 一覧がまだ分からない
                    ② 伝票タイプマスタは<strong>件数が少ない</strong>（数十行程度）③ LOOP 内 <code>READ TABLE</code> はメモリ照合で軽い
                    ④ 研修コードを読みやすく保つ
                  </li>
                  <li>
                    <strong>より絞る書き方</strong> … BKPF 取得<strong>後</strong>に、
                    <code>FOR ALL ENTRIES IN gt_bkpf WHERE blart = gt_bkpf-blart</code> で T003T だけ取る（第8章の型）
                  </li>
                  <li>
                    T001 は <code>SELECT SINGLE</code> で会社1件だけ。必要以上ではありません
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="b">
                <code>WHERE blart IN ( &apos;SA&apos;, &apos;KR&apos;, ... )</code> みたいに書けば、
                出てくるタイプだけ取れませんか？
              </Dialog>
              <Dialog speaker="teacher">
                少数なら可能ですが、<strong>実行前に blart 一覧が分からない</strong>ので IN リストを手で書けません。
                BKPF を先に取れば FAE で自動絞り込みできます。順番の問題です。
              </Dialog>
              <BreakPointCheck
                insert={`  SELECT blart ltext INTO TABLE gt_t003t FROM t003t WHERE spras = c_spras.
  BREAK-POINT.        " ★確認用`}
                ask={
                  <>
                    <code>gs_t001-waers</code> に会社の通貨（例 <code>JPY</code>）が入り、
                    <code>gt_t003t</code> に伝票タイプのテキストが複数行入っていますか？
                  </>
                }
                reveal={
                  <ul>
                    <li>
                      <code>gs_t001-ktopl</code> … 勘定表（SKAT 参照に使用）
                    </li>
                    <li>
                      <code>gt_t003t</code> … 日本語（<code>c_spras = J</code>）の伝票タイプ文言
                    </li>
                  </ul>
                }
              />
            </>
          ),
        },
        {
          title: "② BKPF取得",
          plainText:
            "② BKPF取得 — bukrs + budat IN s_budat（ユーザー指定範囲＝帳票対象。必要以上ではない）。0件ならMESSAGE+LEAVE。",
          content: (
            <>
              <h2>② BKPF取得と0件チェック</h2>
              <p>
                いよいよ「表紙」の一覧を取ります。条件は、入力した<strong>会社コード</strong>と
                <strong>転記日付の範囲</strong>です。
              </p>
              <InfoPanel title="② BKPF取得 — 主な項目（論理名・物理名）" variant="breakdown">
                <ul>
                  <li>
                    伝票番号 … <code>belnr</code>（明細とつなぐ鍵）
                  </li>
                  <li>
                    会計年度 … <code>gjahr</code>（明細とつなぐ鍵・忘れやすい）
                  </li>
                  <li>
                    伝票タイプ … <code>blart</code>（T003T の <code>ltext</code> で名称化）
                  </li>
                  <li>
                    転記日付 … <code>budat</code>（一覧に表示）
                  </li>
                  <li>
                    会社コード … <code>bukrs</code>
                  </li>
                </ul>
              </InfoPanel>
              <CodeBlock
                language="ABAP"
                code={`  SELECT bukrs blart budat bldat belnr usnam gjahr
    INTO TABLE gt_bkpf
    FROM bkpf
    WHERE bukrs = p_bukrs
      AND budat IN s_budat.

  IF gt_bkpf IS INITIAL.
    MESSAGE s000(z01) WITH '対象データは登録されていません'.
    LEAVE LIST-PROCESSING.
  ENDIF.`}
              />
              <h3>0件のときの動き</h3>
              <p>
                <code>gt_bkpf IS INITIAL</code> は「内部テーブルが空（0行）」という意味です。
                このときはメッセージを出したあと、<code>LEAVE LIST-PROCESSING.</code> で
                <strong>リスト出力をやめて選択画面に戻ります</strong>。空の帳票だけ出して終わらせないのがポイントです。
              </p>
              <Callout variant="warning">
                ヘッダが0件なら、その伝票にぶら下がる明細（BSEG）もありません。ここで止めれば、無駄なループや空の一覧を防げます。
              </Callout>
              <InfoPanel title="BKPF は必要以上？" variant="reference">
                <p>
                  <code>budat IN s_budat</code> は第4章の <strong>SELECT-OPTIONS</strong> をそのまま使った絞り込みです。
                  ユーザーが指定した会社・転記日付の範囲＝<strong>この帳票の対象</strong>なので、取得過多ではありません。
                </p>
                <p className="mt-2 text-sm">
                  第8章では「明細を先に取り、伝票キーだけヘッダ取得」と順序を変えてさらに絞る例もありました。
                  この演習は「日付範囲の伝票一覧」が目的なので、BKPF を先に範囲取得する設計です。
                </p>
              </InfoPanel>
              <Dialog speaker="b">
                メッセージは出るのに、からっぽのリストが出ることがあったんですが…
              </Dialog>
              <Dialog speaker="teacher">
                多くは <code>LEAVE LIST-PROCESSING.</code> の書き忘れです。メッセージとセットで覚えてください。
              </Dialog>
              <BreakPointCheck
                insert={`  " SELECT ... INTO TABLE gt_bkpf の直後
  BREAK-POINT.`}
                ask={<>該当伝票がある条件で <code>gt_bkpf</code> の件数は期待どおりですか？</>}
                reveal={
                  <ul>
                    <li>該当あり … 1件以上のヘッダ行</li>
                    <li>該当なし … <code>LEAVE LIST-PROCESSING</code> でリスト処理終了</li>
                  </ul>
                }
              />
            </>
          ),
        },
        {
          title: "③ BSEG・SKAT取得",
          plainText:
            "③ BSEG・SKAT取得 — FAE取得。論理名「勘定コード」＝物理名 hkont/saknr。\nB：WHERE INじゃダメ？→ 複合キーはFAE。次スライドで結合。",
          content: (
            <>
              <h2>③ BSEG・SKAT取得 — DB から内部テーブルへ</h2>
              <p>
                BKPF（表紙）が取れたら、<strong>LOOP の前</strong>に明細（BSEG）と勘定名（SKAT）を DB から一括取得します。
                ここは「<strong>取得</strong>」だけ。まだ <code>gt_out</code> には書きません。結合は次のスライドです。
              </p>
              <InfoPanel title="このスライドでやること（コメント 4-a・4-b）" variant="reference">
                <ol>
                  <li>
                    <strong>4-a</strong> … <code>gt_bkpf</code> の伝票キーに合う BSEG だけ <code>gt_bseg</code> へ（
                    <code>FOR ALL ENTRIES</code>）
                  </li>
                  <li>
                    <strong>4-b</strong> … <code>gt_bseg</code> に登場する勘定だけ SKAT を <code>gt_skat</code> へ（
                    <code>IF gt_bseg IS NOT INITIAL</code> でガード）
                  </li>
                </ol>
              </InfoPanel>
              <CodeBlock
                language="ABAP"
                code={`  IF gt_bkpf IS NOT INITIAL.
    SELECT bukrs belnr gjahr buzei hkont shkzg dmbtr sgtxt
      INTO TABLE gt_bseg FROM bseg
      FOR ALL ENTRIES IN gt_bkpf
      WHERE bukrs = gt_bkpf-bukrs
        AND belnr = gt_bkpf-belnr
        AND gjahr = gt_bkpf-gjahr.
  ENDIF.

  IF gt_bseg IS NOT INITIAL.
    SELECT saknr txt20
      INTO TABLE gt_skat FROM skat
      FOR ALL ENTRIES IN gt_bseg
      WHERE spras = c_spras
        AND ktopl = gs_t001-ktopl
        AND saknr = gt_bseg-hkont.
  ENDIF.`}
              />
              <InfoPanel
                title="論理名と物理名 — 表ごとに名前が違う（取得）"
                variant="reference"
                lead={
                  <>
                    <strong>論理名</strong>＝画面上・業務で使う意味（例：勘定コード）。
                    <strong>物理名</strong>＝ABAP コードに書くフィールド名（例：<code>hkont</code>）。
                    論理名が同じでも、テーブルによって物理名が異なることがあります。
                  </>
                }
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="pb-2 text-left font-semibold">論理名</th>
                      <th className="pb-2 text-left font-semibold">BSEG（明細）</th>
                      <th className="pb-2 text-left font-semibold">SKAT（勘定マスタ）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1">勘定コード</td>
                      <td className="py-1">
                        <code>hkont</code>
                      </td>
                      <td className="py-1">
                        <code>saknr</code>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1">勘定科目テキスト（名称）</td>
                      <td className="py-1">—</td>
                      <td className="py-1">
                        <code>txt20</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-2 text-sm">
                  SKAT 取得の <code>WHERE saknr = gt_bseg-hkont</code> は、
                  論理名どおり「<strong>勘定コード</strong>同士をつなぐ」式です。
                  物理名は左 <code>saknr</code>（SKAT 側）・右 <code>hkont</code>（BSEG 側）と<strong>表ごとに違う</strong>。ここが初学者のつまずきどころです。
                </p>
                <p className="mt-2 text-sm">
                  参考：伝票キー（会社コード <code>bukrs</code>・伝票番号 <code>belnr</code>・会計年度 <code>gjahr</code>）は
                  BKPF と BSEG で<strong>論理名も物理名も同名</strong>。対照的にわかりやすい例です。
                </p>
              </InfoPanel>
              <Dialog speaker="b">
                論理名は同じ「勘定コード」なのに、なんで <code>hkont = hkont</code> じゃなくて <code>saknr = hkont</code> なんですか？
              </Dialog>
              <Dialog speaker="teacher">
                値は同じ「41000000」でも、<strong>どの表の列か</strong>で物理名が決まります。
                論理名（意味）は同じ、物理名（コード上の名前）だけ BSEG が <code>hkont</code>、SKAT が <code>saknr</code>。DDIC の設計です。
              </Dialog>
              <InfoPanel title="取得量の整理" variant="reference">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="pb-2 text-left font-semibold">テーブル</th>
                      <th className="pb-2 text-left font-semibold">絞り方</th>
                      <th className="pb-2 text-left font-semibold">必要以上？</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1">BSEG</td>
                      <td className="py-1">
                        <code>FOR ALL ENTRIES IN gt_bkpf</code>（3キー）
                      </td>
                      <td className="py-1">× ヘッダに属する明細だけ</td>
                    </tr>
                    <tr>
                      <td className="py-1">SKAT</td>
                      <td className="py-1">
                        <code>FOR ALL ENTRIES IN gt_bseg</code>（勘定コード：<code>saknr = hkont</code>）
                      </td>
                      <td className="py-1">× 明細に出る勘定だけ</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <InfoPanel
                title="WHERE ... IN ... と FOR ALL ENTRIES"
                variant="reference"
                lead="BSEG の鍵は bukrs＋belnr＋gjahr の3項目。内部テーブルから絞る定番は FOR ALL ENTRIES です。"
              >
                <ul>
                  <li>
                    <code>budat IN s_budat</code> … ② で使った<strong>SELECT-OPTIONS 専用</strong>の <code>IN</code>（第4章）
                  </li>
                  <li>
                    複合キーを内部テーブルから渡す … <code>FOR ALL ENTRIES IN gt_bkpf</code> ＋ 空チェック
                  </li>
                </ul>
              </InfoPanel>
              <BreakPointCheck
                insert={`  " SELECT INTO TABLE gt_bseg / gt_skat の直後
  BREAK-POINT.`}
                ask={
                  <>
                    <code>gt_bseg</code> に明細行、<code>gt_skat</code> に勘定名が入っていますか？
                    論理名「勘定コード」は、明細 <code>hkont</code> と SKAT <code>saknr</code> が対応していますか？
                  </>
                }
                reveal={
                  <ul>
                    <li>
                      <code>gt_bseg</code> … 対象伝票の明細行（0件なら結合後も空になりうる）
                    </li>
                    <li>
                      <code>gt_skat</code> … 明細の勘定コード（<code>hkont</code>）に対応する <code>saknr</code> 行
                    </li>
                  </ul>
                }
              />
              <Callout variant="tip">
                取得が終わったら、次のスライド「④ データ結合」で <code>READ TABLE</code> により内部テーブル同士をつなぎます。
              </Callout>
              <LessonLinkButton
                courseSlug="abap-taining"
                lessonFile="08-combine-data"
                slide={8}
                label="第8章: 必要なデータだけ取得（FOR ALL ENTRIES）"
                variant="back"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "④ データ結合",
          plainText:
            "④ データ結合 — 対応表で論理名→物理名を確認してREAD TABLE。勘定コード：hkont↔saknr。勘定名：txt20→hkont_txt。",
          content: (
            <>
              <h2>④ データ結合 — 内部テーブル同士をつなぐ</h2>
              <p>
                ①②③ で DB から載せた内部テーブルを、<strong>メモリ上だけ</strong>でつなぎ、帳票1行（
                <code>gs_out</code>）に組み立てます。ここから DB への <code>SELECT</code> は出てきません。
              </p>
              <InfoPanel title="結合の流れ（コメント 4-①〜4-⑤）" variant="reference">
                <ol>
                  <li>
                    <strong>外側 LOOP</strong> … <code>gt_bkpf</code> の伝票を1件ずつ
                  </li>
                  <li>
                    <strong>4-①</strong> … <code>READ TABLE gt_t003t</code> … <code>blart = blart</code>（名前が同じ）
                  </li>
                  <li>
                    <strong>内側 LOOP</strong> … <code>gt_bseg</code> から同じ伝票キーの明細だけ（<code>WHERE</code>）
                  </li>
                  <li>
                    <strong>4-②</strong> … <code>READ TABLE gt_skat</code> … 勘定コード（<code>saknr = hkont</code>、物理名が違う）
                  </li>
                  <li>
                    <strong>4-③④</strong> … <code>gs_out</code> へ代入 → <code>APPEND</code> → <code>CLEAR</code>
                  </li>
                </ol>
              </InfoPanel>
              <InfoPanel
                title="論理名と物理名 — 結合（READ TABLE）の対応表"
                variant="reference"
                lead={
                  <>
                    <strong>論理名</strong>で「何をつなぐか」を把握し、コードでは<strong>物理名</strong>を書きます。
                    WITH KEY は「左＝探す側の物理名、右＝手元の物理名」です。
                  </>
                }
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="pb-2 text-left font-semibold">論理名</th>
                      <th className="pb-2 text-left font-semibold">コード</th>
                      <th className="pb-2 text-left font-semibold">物理名（左 ↔ 右）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1">伝票タイプ ↔ 伝票タイプ名</td>
                      <td className="py-1">
                        <code>READ TABLE gt_t003t</code> … <code>blart = gs_bkpf-blart</code>
                      </td>
                      <td className="py-1">
                        <code>blart</code> ↔ <code>blart</code>（同名）→ 名称は <code>ltext</code>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1">
                        会社コード・伝票番号・会計年度
                        <br />
                        （伝票 ↔ 明細）
                      </td>
                      <td className="py-1">
                        <code>LOOP AT gt_bseg WHERE</code> <code>bukrs belnr gjahr</code>
                      </td>
                      <td className="py-1">
                        <code>bukrs</code>・<code>belnr</code>・<code>gjahr</code> とも<strong>同名</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1">勘定コード ↔ 勘定コード</td>
                      <td className="py-1">
                        <code>READ TABLE gt_skat</code> … <code>saknr = gs_bseg-hkont</code>
                      </td>
                      <td className="py-1">
                        <code>saknr</code> ↔ <code>hkont</code>（<strong>論理名は同じ、物理名が違う</strong>）
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1">勘定名 → 帳票の勘定列</td>
                      <td className="py-1">
                        <code>gs_out-hkont_txt = gs_skat-txt20</code>
                      </td>
                      <td className="py-1">
                        <code>txt20</code> → <code>hkont_txt</code>（出力用に物理名を載せ替え）
                      </td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="b">
                <code>READ TABLE gt_skat WITH KEY saknr = gs_bseg-hkont</code> の行で、
                論理名は「勘定コード同士」なのに、物理名が <code>saknr</code> と <code>hkont</code> で意味不明でした…。
              </Dialog>
              <Dialog speaker="teacher">
                対応表の「論理名」列を見てからコードを読むと楽です。
                <strong>左辺</strong>＝探す表（SKAT）の物理名 <code>saknr</code>、
                <strong>右辺</strong>＝手元（明細）の物理名 <code>hkont</code>。
                ③ の SELECT でも同じ対応。取得も結合もルールは同じです。
              </Dialog>
              <h3>例：LOOP ＋ READ TABLE</h3>
              <CodeBlock
                language="ABAP"
                code={`  LOOP AT gt_bkpf INTO gs_bkpf.
    READ TABLE gt_t003t INTO gs_t003t WITH KEY blart = gs_bkpf-blart.
    IF sy-subrc <> 0. CLEAR gs_t003t. ENDIF.

    LOOP AT gt_bseg INTO gs_bseg
      WHERE bukrs = gs_bkpf-bukrs
        AND belnr = gs_bkpf-belnr
        AND gjahr = gs_bkpf-gjahr.

      READ TABLE gt_skat INTO gs_skat WITH KEY saknr = gs_bseg-hkont.
      IF sy-subrc <> 0. CLEAR gs_skat. ENDIF.

      gs_out-hkont     = gs_bseg-hkont.
      gs_out-hkont_txt = gs_skat-txt20.
      " … 他項目を代入 → APPEND gt_out → CLEAR
    ENDLOOP.
  ENDLOOP.`}
              />
              <h3>なぜ MOVE-CORRESPONDING ではなく、1項目ずつ代入？</h3>
              <p>
                ヘッダ・明細・テキストは<strong>別テーブル</strong>から来ます。論理名が同じ「勘定名」でも
                物理名は <code>txt20</code> → <code>hkont_txt</code> のように<strong>出力用に載せ替え</strong>が必要です。
                初学者は1項目ずつ書いた方がデバッガで追いやすいです。
              </p>
              <h3>ループ後にもう一度 0件チェック</h3>
              <p>
                ヘッダはあったが明細が1行も無い、などの場合 <code>gt_out</code> が空のままになります。
                メッセージ＋<code>LEAVE LIST-PROCESSING</code> で空の帳票を出さないようにします。
              </p>
              <Callout variant="note">
                内側の <code>LOOP AT gt_bseg WHERE ...</code> もメモリ上の照合です（DB 往復なし）。
                テキストが見つからなくても <code>CLEAR</code> して続行。コードは出るが名称だけ空、という現場向けの動きです。
              </Callout>
              <Dialog speaker="stumble">
                BSEG の <code>WHERE</code> で <code>gjahr</code> を忘れると、別年度の明細が混ざったり、1件も取れないことがあります。
              </Dialog>
              <Dialog speaker="a">
                鍵は3つセット：<code>bukrs</code>・<code>belnr</code>・<code>gjahr</code>。ヘッダからコピーする癖をつけます。
              </Dialog>
              <BreakPointCheck
                insert={`      APPEND gs_out TO gt_out.
      BREAK-POINT.        " ★1明細ごとに確認`}
                ask={
                  <>
                    <code>gs_out</code> にヘッダ＋明細＋テキスト＋<code>waers</code>{" "}
                    が揃っていますか？ <code>gt_out</code> の行数は明細数と一致しますか？
                  </>
                }
                reveal={
                  <ul>
                    <li>1伝票に明細3行あれば、<code>gt_out</code> に3行（ヘッダ項目は各行に繰り返し）</li>
                    <li>
                      SKAT にない勘定は <code>hkont_txt</code> が空（エラーにはしない）
                    </li>
                  </ul>
                }
              />
            </>
          ),
        },
        {
          title: "出力① ヘッダ",
          plainText:
            "出力① — SORT gt_out BY blart budat belnr buzei。TOP-OF-PAGE でシステム値・タイトル・条件・見出し行。列位置は WRITE の第1引数で指定。",
          content: (
            <>
              <h2>出力① ヘッダとソート</h2>
              <p>
                データの準備が終わったら、<strong>並べ替え</strong>してから、リストの「各ページの上段」を定義します。
                明細本体は次のスライド（<code>END-OF-SELECTION</code>）で出します。
              </p>
              <h3>ソート（SORT）の意味</h3>
              <p>
                <code>SORT gt_out BY blart budat belnr buzei.</code> は、
                伝票タイプ → 転記日付 → 伝票番号 → 明細番号の順に並べ替えます。
                DB から取った順序は保証されないため、出力前に必ず意図した順に整えます。
              </p>
              <h3>TOP-OF-PAGE の3つのブロック</h3>
              <ol>
                <li>
                  <strong>システム情報</strong> … プログラム名・ユーザ・日付・時刻・ページ（<code>sy-</code> 系）
                </li>
                <li>
                  <strong>検索条件の表示</strong> … 会社コード、転記日付（To が空なら「～ To」は出さない）
                </li>
                <li>
                  <strong>列見出し</strong> … 伝票タイプ・借方金額・貸方金額など + <code>ULINE</code> で下線
                </li>
              </ol>
              <Callout variant="note">
                列見出しは完成コードでは <code>TEXT-c01</code>〜<code>TEXT-c10</code> を使います（<strong>c</strong> ＝ Column／列）。
                SE38 の{" "}
                <strong>Text elements</strong> に下表の文言を登録してから実行してください（未登録だと ID がそのまま表示されます）。
              </Callout>
              <CodeBlock
                language="ABAP"
                code={`  SORT gt_out BY blart budat belnr buzei.

TOP-OF-PAGE.
  WRITE: /1   'PGMID:' NO-GAP, 9 sy-cprog,
          155 'DATE:' NO-GAP, 160(9) sy-datum USING EDIT MASK '____/__/__' RIGHT-JUSTIFIED,
         /1   'USER:' NO-GAP, 9 sy-uname,
          155 'TIME:' NO-GAP, 160(9) sy-uzeit RIGHT-JUSTIFIED,
         /80(20) '仕訳日記帳 演習2' CENTERED,
          155 'PAGE:' NO-GAP, 160(9) sy-pagno NO-SIGN RIGHT-JUSTIFIED.
  " ... 会社コード・転記日付 ...
  WRITE: /1   TEXT-c01, 18 TEXT-c02, 30 TEXT-c03, 42 TEXT-c04,
          54 TEXT-c05, 68 TEXT-c06, 73 TEXT-c07,
          106(14) TEXT-c08 RIGHT-JUSTIFIED,
          122(14) TEXT-c09 RIGHT-JUSTIFIED,
          139 TEXT-c10.
  ULINE.`}
              />
              <ReportPreview
                caption="デモ出力（ヘッダ・見出し）— WRITE の列番号どおりに配置"
                rows={PREVIEW_HEADER_ROWS}
              />
              <InfoPanel title="WRITE の数字の読み方（例）" variant="breakdown">
                <ul>
                  <li>
                    <code>/1 &apos;PGMID:&apos;</code> … 改行して、1列目から「PGMID:」
                  </li>
                  <li>
                    <code>9 sy-cprog</code> … 9列目からプログラム名（<code>NO-GAP</code> で直前と詰める）
                  </li>
                  <li>
                    <code>/80(20) &apos;仕訳日記帳 演習2&apos; CENTERED</code> … 80列目から幅20の中央寄せ
                  </li>
                  <li>
                    <code>160(9) sy-datum ... RIGHT-JUSTIFIED</code> … 幅9の右寄せ（日付用）
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="b">
                数字がたくさん並んでいて最初は意味が分からなかったですが、デモを見ると「列の開始位置」なんですね。
              </Dialog>
              <Dialog speaker="teacher">
                見出し行と明細行で<strong>同じ列番号</strong>を使うと、縦の線がそろって読みやすくなります。1つずれていると全体が崩れます。
              </Dialog>
            </>
          ),
        },
        {
          title: "出力② 明細",
          plainText:
            "出力② — END-OF-SELECTION で LOOP AT gt_out。shkzg=S なら gv_debit、H なら gv_credit。WRITE で CURRENCY gs_out-waers。列 106/122 は借方/貸方。",
          content: (
            <>
              <h2>出力② 明細と借方／貸方</h2>
              <p>
                <code>END-OF-SELECTION</code> は、データ準備が終わったあとに実行される「本体の出力」ブロックです。
                <code>gt_out</code> を1行ずつ読み、画面の1行として <code>WRITE</code> します。
              </p>
              <h3>借方・貸方を2列に分ける理由</h3>
              <p>
                明細（BSEG）には金額（<code>dmbtr</code>）と<strong>借方/貸方の印</strong>（<code>shkzg</code>）があります。
                仕訳日記帳では、会計の見慣れた形にするため、
              </p>
              <ul>
                <li>
                  <code>shkzg = S</code>（借方）のとき → <strong>借方金額列</strong>だけに金額
                </li>
                <li>
                  <code>shkzg = H</code>（貸方）のとき → <strong>貸方金額列</strong>だけに金額
                </li>
              </ul>
              <p>
                そのために、出力直前に <code>gv_debit</code> / <code>gv_credit</code> に振り分けます。
                <strong>ループの先頭で必ず CLEAR</strong> しないと、前の行の金額が残って両方に出てしまいます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`END-OF-SELECTION.
  LOOP AT gt_out INTO gs_out.
    CLEAR: gv_debit, gv_credit.
    IF gs_out-shkzg = c_shkzg_s.
      gv_debit = gs_out-dmbtr.
    ELSEIF gs_out-shkzg = c_shkzg_h.
      gv_credit = gs_out-dmbtr.
    ENDIF.
    WRITE: /1  gs_out-blart,
            4  gs_out-blart_txt,
            ...
            106(14) gv_debit  CURRENCY gs_out-waers RIGHT-JUSTIFIED,
            122(14) gv_credit CURRENCY gs_out-waers RIGHT-JUSTIFIED,
            139 gs_out-sgtxt.
  ENDLOOP.`}
              />
              <InfoPanel title="CURRENCY gs_out-waers とは" variant="breakdown">
                <p>
                  金額の後ろに付ける通貨（円・ドルなど）を、会社マスタ（T001）から取った <code>waers</code> で指定します。
                  固定で <code>JPY</code> と書かず、会社コードが変わっても正しく表示できるようにしています。
                </p>
              </InfoPanel>
              <ReportPreview
                caption="デモ出力（明細2行）— 借方 col 106 / 貸方 col 122（幅14・右寄せ）"
                rows={PREVIEW_DETAIL_ROWS}
              />
              <BreakPointCheck
                insert={`    IF gs_out-shkzg = c_shkzg_s.
      gv_debit = gs_out-dmbtr.
    BREAK-POINT.        " ★借方行で確認`}
                ask={
                  <>
                    借方行（<code>shkzg = S</code>）で <code>gv_debit</code>{" "}
                    だけに金額が入り、<code>gv_credit</code> は空ですか？
                  </>
                }
                reveal={
                  <ul>
                    <li>
                      <code>S</code>（借方）… <code>gv_debit</code> に <code>dmbtr</code>
                    </li>
                    <li>
                      <code>H</code>（貸方）… <code>gv_credit</code> に <code>dmbtr</code>
                    </li>
                    <li>通貨は <code>gs_out-waers</code>（T001 から）を <code>CURRENCY</code> に指定</li>
                  </ul>
                }
              />
            </>
          ),
        },
        {
          title: "つまずきポイント",
          plainText:
            "つまずきやすいところ（初心者向け）\nつまずき：ヘッダ1行=リスト1行と思う→明細1行=リスト1行。gjahr忘れ。借方貸方の入れ替え。0件なのに空帳票。列番号ずれ。REFRESH忘れで行が倍になる。\nAくん：gt_outの行数は明細数、shkzgで借方か貸方か決める。\nBちゃん：WRITEの数字は列の開始位置。つまずきはデバッガでgt_outとgv_debit/creditを見れば切り分けできる。",
          content: (
            <>
              <h2>つまずきやすいところ（初心者向け）</h2>
              <p>
                ここでは「よくある勘違い」と「確認のしかた」を、Aくん・Bちゃんのやりとりで整理します。
                エラーが出なくても、<strong>件数や列がおかしい</strong>ときは、この順番でデバッガを見てください。
              </p>
              <Callout variant="note">
                <strong>デバッガの基本</strong>：<code>BREAK-POINT.</code> で止まったら、変数一覧で{" "}
                <code>gt_out</code>・<code>gs_out</code>・<code>gv_debit</code> をダブルクリックして中身を開きます。
                F8 で次の行へ進みます。
              </Callout>

              <h3>① 行の数・中身がおかしい</h3>
              <Dialog speaker="stumble">
                演習①の感覚のまま「伝票ヘッダ1件＝帳票1行」と思う → 明細が複数ある伝票は、帳票でも<strong>明細の数だけ行</strong>が必要です。
              </Dialog>
              <Dialog speaker="b">
                <code>gt_bkpf</code> が5件なのに、帳票は20行くらい出た。最初はバグかと思いました。
              </Dialog>
              <Dialog speaker="a">
                それは自然です。<code>gt_out</code> の行数は「明細の合計」です。デバッガで{" "}
                <code>gt_out</code> を開き、同じ <code>belnr</code> が複数行あるかを見ると安心できます。
              </Dialog>
              <Dialog speaker="teacher">
                確認のコツ：<code>gt_bkpf</code> の行数 ≠ <code>gt_out</code> の行数、が普通です。
                同じ伝票番号が何行か並んでいれば、結合はうまくいっています。
              </Dialog>

              <h3>② 明細が取れない・別の伝票の明細が混ざる</h3>
              <Dialog speaker="stumble">
                BSEG の <code>WHERE</code> で <code>gjahr</code> を入れ忘れる → ヘッダと明細がつながらず、0件や変な行になります。
              </Dialog>
              <Dialog speaker="b">
                <code>belnr</code> だけ同じだと足りないんですね。年度もセットで覚えます。
              </Dialog>
              <Dialog speaker="teacher">
                <code>gt_bseg</code> の <code>WHERE</code> には <code>gs_bkpf-bukrs</code>・<code>gs_bkpf-belnr</code>・
                <code>gs_bkpf-gjahr</code> の3つをセットで写すと安全です。SKAT は <code>gt_skat</code> から{" "}
                <code>READ TABLE</code> します。
              </Dialog>

              <h3>③ 借方・貸方の列がおかしい</h3>
              <Dialog speaker="stumble">
                <code>shkzg</code> の S / H と、借方列・貸方列の対応を間違える → 両方に金額が出る、または左右が逆になります。
              </Dialog>
              <Dialog speaker="a">
                出力の直前で <code>gv_debit</code> / <code>gv_credit</code> を{" "}
                <code>CLEAR</code> してから、<code>c_shkzg_s</code> なら借方だけに入れる、と順番を固定するとミスが減ります。
              </Dialog>
              <Dialog speaker="b">
                ブレークポイントで <code>gs_out-shkzg</code> と <code>gv_debit</code>{" "}
                を見比べると、「S なのに貸方に入ってない？」がすぐ分かりました。
              </Dialog>

              <h3>④ 0件なのに空の帳票が出る</h3>
              <Dialog speaker="stumble">
                <code>MESSAGE</code> だけ書いて <code>LEAVE LIST-PROCESSING.</code>{" "}
                を忘れる → メッセージは出るのに、空のリストが表示されたままになります。
              </Dialog>
              <Dialog speaker="a">
                <code>gt_bkpf IS INITIAL</code> と <code>gt_out IS INITIAL</code> の{" "}
                <strong>2か所</strong>で同じセット（メッセージ＋終了）を書くのがポイントです。
              </Dialog>

              <h3>⑤ 列がずれる・金額の見え方がおかしい</h3>
              <Dialog speaker="stumble">
                <code>WRITE</code> の数字（1, 18, 106…）は「何文字目から書くか」。1つずれると、見出しとデータが全部ずれます。
              </Dialog>
              <Dialog speaker="b">
                このページのデモ出力みたいに、列番号と位置を並べて見ると、コードの数字の意味が分かりやすかったです。
              </Dialog>
              <Dialog speaker="stumble">
                金額に <code>CURRENCY</code> を付け忘れる、または <code>waers</code>{" "}
                が空 → 金額が ##### になったり、桁が変になります。T001 から取った{" "}
                <code>gs_out-waers</code> を指定します。
              </Dialog>

              <h3>⑥ 2回目の実行で行が倍になる</h3>
              <Dialog speaker="stumble">
                開始時の <code>REFRESH gt_out</code> を忘れる → 前回のデータに追記され、行数がどんどん増えます。
              </Dialog>
              <Dialog speaker="b">
                「件数がおかしい」と思ったら、まず <code>REFRESH</code>{" "}
                を疑う、と覚えておきます。
              </Dialog>

              <Dialog speaker="teacher">
                つまずいたら、次の3点をこの順で見てください。(1) <code>gt_out</code>{" "}
                の行数と1行の中身 (2) <code>shkzg</code> と <code>gv_debit</code>/
                <code>gv_credit</code> (3) WRITE の列番号と見出しの一致。ここが合っていれば、あとは微調整です。
              </Dialog>
              <InfoPanel title="初心者向けチェックリスト" variant="reference">
                <ol>
                  <li>選択画面で会社・日付を入れたか</li>
                  <li>
                    <code>gt_bkpf</code> に行があるか（0件ならメッセージで戻るはず）
                  </li>
                  <li>
                    <code>gt_out</code> の行数は「明細の合計」になっているか
                  </li>
                  <li>借方行では貸方列が空、貸方行では借方列が空か</li>
                  <li>見出しとデータの列が縦にそろっているか</li>
                </ol>
              </InfoPanel>
              <Callout variant="tip">
                演習①のプログラムと並べて見ると、「どこから明細処理が増えたか」がはっきりします。全文を暗記する必要はありません。
              </Callout>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理（質問しながら）\nB：難しかった…→ ①②取得→③BSEG/SKAT→④結合→出力。\nB：saknr=hkont？→ 論理名は同じ勘定コード、物理名だけ表ごとに違う。\nB：伝票5件なのに行20？→ 明細1行＝リスト1行。\nB：借方/貸方が両方→ CLEARしてからshkzg判定。",
          content: (
            <>
              <h2>対話で整理：質問しながら情報を並べる</h2>
              <p>
                演習②はステップが多く、最初は「何から手を付ければ…」と感じた方も多いはずです。
                ここでは<strong>疑問をそのまま質問</strong>しながら、頭の中を整理します。
              </p>
              <Dialog speaker="teacher">
                完璧に暗記できなくて大丈夫です。「なぜこの順番か」が言えることがゴール。
                分からないところは、遠慮なく質問してください。
              </Dialog>

              <h3>① 全体像</h3>
              <Dialog speaker="b">
                正直、いちばん難しかったです…。この演習って、<strong>結局何をしている</strong>プログラムなんですか？
              </Dialog>
              <Dialog speaker="teacher">
                一言で言うと、<strong>複数テーブルの情報を1行ずつそろえて、仕訳日記帳を画面に出す</strong>ことです。
                <br />
                ① マスタ（T001/T003T）→ ② 伝票（BKPF）→ ③ BSEG/SKAT<strong>取得</strong><br />
                ④ 内部テーブル<strong>結合</strong>（<code>gt_out</code>）→ ⑤ 借方/貸方に分けて<strong>WRITE</strong><br />
                取得（③）と結合（④）はスライドも分かれている、と覚えてください。
              </Dialog>

              <h3>② 行の数え方</h3>
              <Dialog speaker="b">
                <code>gt_bkpf</code> が5件なのに、帳票は20行くらい出ました。バグ…ですか？
              </Dialog>
              <Dialog speaker="a">
                それは正常です。演習①は「伝票1件＝1行」でしたが、演習②は<strong>明細1行＝リスト1行</strong>。
                同じ伝票番号が複数行並ぶ＝表紙の情報を明細の数だけ繰り返し写している、と理解すると安心です。
              </Dialog>
              <Dialog speaker="teacher">
                デバッガで <code>gt_out</code> を開き、同じ <code>belnr</code> が何行あるか見る。結合の確認の定番です。
              </Dialog>

              <h3>③ 取得と④ 結合（別スライド）</h3>
              <Dialog speaker="b">
                伝票ループの<strong>中で</strong> BSEG を <code>SELECT</code> した方が、コードの流れは追いやすそうなんですけど…ダメなんですか？
              </Dialog>
              <Dialog speaker="teacher">
                書くときは楽ですが、本番では DB 往復が件数分増えます。③ で <code>FOR ALL ENTRIES</code> 取得、④ で{" "}
                <code>READ TABLE</code> 結合。<strong>取得と結合はスライドも分け</strong>たほうが頭の中が整理しやすいです。
              </Dialog>
              <Dialog speaker="b">
                <code>READ TABLE gt_skat WITH KEY saknr = gs_bseg-hkont</code> って、
                論理名は同じ「勘定コード」なのに物理名が違うのに <code>=</code> でつなぐの、いちばん混乱しました。
              </Dialog>
              <Dialog speaker="teacher">
                値は同じ勘定コード（例 41000000）。論理名は同じ、物理名だけ BSEG が <code>hkont</code>、SKAT が <code>saknr</code>。
                ④ の対応表（論理名・物理名）を見返してください。
              </Dialog>
              <Dialog speaker="b">
                T003T だけ、帳票に出ない伝票タイプまで取ってるの、気になりました…。
              </Dialog>
              <Dialog speaker="teacher">
                件数が少なく、BKPF より先に取る簡略化。① の InfoPanel に整理してあります。
              </Dialog>

              <h3>⑤ 出力・借方/貸方</h3>
              <Dialog speaker="b">
                借方と貸方、<strong>両方に金額</strong>が出ちゃったことがあって…。どこを見ればいいですか？
              </Dialog>
              <Dialog speaker="teacher">
                出力の直前で <code>gv_debit</code> / <code>gv_credit</code> を<strong>毎回 CLEAR</strong> してから、
                <code>shkzg = &apos;S&apos;</code> なら借方だけ、<code>&apos;H&apos;</code> なら貸方だけに入れる。この順番を固定してください。
                ブレークポイントで <code>gs_out-shkzg</code> と列106・122を見比べると早いです。
              </Dialog>
              <Dialog speaker="b">
                <code>WRITE</code> の 1, 18, 106… という数字、最初は魔法みたいでした。
              </Dialog>
              <Dialog speaker="a">
                「<strong>何文字目から書くか</strong>」です。デモ出力（ReportPreview）とコードを<strong>横に並べて</strong>見ると、
                見出しとデータの列がずれていないか確認しやすいです。
              </Dialog>

              <h3>⑥ 品質の土台</h3>
              <Dialog speaker="b">
                0件のとき、メッセージは出るのに空のリストが残る、ってありましたよね…。
              </Dialog>
              <Dialog speaker="teacher">
                <code>MESSAGE</code> だけでは不十分で、<code>LEAVE LIST-PROCESSING.</code> がセット。
                <code>gt_bkpf IS INITIAL</code> と <code>gt_out IS INITIAL</code> の<strong>2か所</strong>で同じ対応を書きます。
                あわせて <code>FOR ALL ENTRIES</code> の前の <code>IS NOT INITIAL</code> も、第8章で習った空チェックです。
              </Dialog>

              <InfoPanel title="この演習で覚えておく流れ（質問の答えを1枚に）" variant="reference">
                <ol>
                  <li>
                    <strong>入力</strong> … 会社・転記日付（<code>PARAMETERS</code> / <code>SELECT-OPTIONS</code>）
                  </li>
                  <li>
                    <strong>①② 取得</strong> … T001 / T003T / BKPF
                  </li>
                  <li>
                    <strong>③ 取得</strong> … BSEG・SKAT（<code>FOR ALL ENTRIES</code>。勘定コード：<code>saknr = hkont</code>）
                  </li>
                  <li>
                    <strong>④ 結合</strong> … 伝票 LOOP → 明細 LOOP → <code>READ TABLE</code>（論理名→物理名の対応表）→{" "}
                    <code>APPEND gt_out</code>
                  </li>
                  <li>
                    <strong>出力</strong> … <code>SORT</code> → <code>TOP-OF-PAGE</code> → 借方/貸方 CLEAR → <code>WRITE</code>
                  </li>
                  <li>
                    <strong>数え方</strong> … <code>gt_out</code> の行数 ＝ 明細の合計（≠ 伝票件数）
                  </li>
                  <li>
                    <strong>仕上げ（任意）</strong> … 列見出しを <code>TEXT-c01</code> などに（多言語も同じ ID）
                  </li>
                </ol>
              </InfoPanel>

              <Dialog speaker="b">
                全部を一発で書けなかった自分でも、質問しながら整理すると「部品」に分けて見えてきました。
                完成コードは<strong>地図</strong>として見返せばいい、ですね？
              </Dialog>
              <Dialog speaker="teacher">
                その理解で十分です。入口の条件・0件チェック・<code>gjahr</code>・借方/貸方の CLEAR。
                ここが崩れると後ろが全部おかしくなるので、つまずいたら<strong>前半から</strong>デバッガを当ててください。
                演習①と並べて「どこから明細が増えたか」を見るのもおすすめです。
              </Dialog>
              <Callout variant="tip">
                <strong>難しく感じたら、次の3つだけ口に出してみてください</strong>
                <br />
                ① 明細1行＝リスト1行　② 取得は LOOP の前、結合は内部テーブル　③ 出力前に借方/貸方を CLEAR
              </Callout>
            </>
          ),
        },
        {
          title: "単体テスト",
          plainText:
            "単体テスト — 部品ごとに1条件ずつ変えて確認。必須、0件、借方/貸方、テキスト欠落、通貨。",
          content: (
            <>
              <h2>単体テスト — 部品ごとに確かめる</h2>
              <p>
                <strong>単体テスト</strong>は、プログラム全体ではなく<strong>部品1つずつ</strong>を検証します。
                「一度に条件をいくつも変える」と、どれが効いたか分からなくなるので、
                <strong>1回の実行で確認することを1つ</strong>に絞ってください。
              </p>
              <Dialog speaker="teacher">
                例：借方/貸方だけ見たい → 該当伝票が少ない日付範囲で実行し、1行ずつ列106・122を目視する。
              </Dialog>
              <div className="not-prose my-4 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800">
                      <th className="border border-slate-300 px-3 py-2 text-left dark:border-slate-600">
                        観点
                      </th>
                      <th className="border border-slate-300 px-3 py-2 text-left dark:border-slate-600">
                        操作
                      </th>
                      <th className="border border-slate-300 px-3 py-2 text-left dark:border-slate-600">
                        期待結果
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        必須
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        会社・日付を空で実行
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        <code>OBLIGATORY</code> で実行不可
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        BKPF 0件
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        該当なしの日付範囲
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        メッセージ後、選択画面へ戻る
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        借方/貸方
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        <code>shkzg</code> が S / H の行
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        借方列または貸方列のどちらか一方のみに金額
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        テキスト欠落
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        SKAT 未登録の勘定
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        勘定コードは出る、名称は空でも処理継続
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        通貨
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        会社 1000 など
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        T001 の <code>waers</code> で金額フォーマット
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ),
        },
        {
          title: "機能テスト",
          plainText:
            "機能テスト — 正常系、境界値、改ページ、異常系、マスタ未登録。",
          content: (
            <>
              <h2>機能テスト — 通しで確かめる</h2>
              <p>
                <strong>機能テスト</strong>は、利用者が実際に使う流れどおりに<strong>最初から最後まで</strong>実行し、
                入力→一覧→メッセージまでが仕様どおりかを見ます。単体テストで部品がOKでも、つないだときにだけ起きる不具合があります。
              </p>
              <Dialog speaker="b">
                単体では借方/貸方は合っていたのに、通しで実行したら列がずれていた、ということもありそうですね。
              </Dialog>
              <Dialog speaker="a">
                だから最後に、実在データで1回フル実行して、ヘッダ・見出し・明細・改ページまで目視するのが大事です。
              </Dialog>
              <div className="not-prose my-4 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800">
                      <th className="border border-slate-300 px-3 py-2 text-left dark:border-slate-600">
                        シナリオ
                      </th>
                      <th className="border border-slate-300 px-3 py-2 text-left dark:border-slate-600">
                        条件
                      </th>
                      <th className="border border-slate-300 px-3 py-2 text-left dark:border-slate-600">
                        期待結果
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        正常系
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        実在の会社・日付・複数伝票
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        伝票タイプ順→日付→番号→明細で並び、借方/貸方が整合
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        境界値
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        範囲の From/To ちょうど・1件のみ
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        取りこぼし・余分な行がない
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        改ページ
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        58行超
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        各ページに <code>TOP-OF-PAGE</code> が出る
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        To 日付なし
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        <code>g_end_date</code> が空
                      </td>
                      <td className="border border-slate-300 px-3 py-2 dark:border-slate-600">
                        ヘッダに「～ To」行が出ない
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Callout variant="warning">
                列位置（1, 18, 106, 122…）のずれ、借方/貸方の入れ替わりは目視でも必ず確認してください。
              </Callout>
            </>
          ),
        },
        {
          title: "完成コード",
          plainText:
            "完成コード — create_report_2 全文。ReportPreview でレイアウト確認。クイズ: 借方/貸方の判定。",
          content: (
            <>
              <h2>完成コードと理解度チェック</h2>
              <p>
                ここまでのスライドで追いかけてきた処理が、1本のプログラムにまとまったものが完成コードです。
                下のプレビューは <code>WRITE</code> の列番号に合わせたデモ出力です。
              </p>
              <InfoPanel title="完成コードを読むときの順番" variant="breakdown">
                <ol>
                  <li>先頭 … 型・変数・選択画面（いつもある「宣言」）</li>
                  <li>
                    <code>START-OF-SELECTION</code> … 初期化 → ①② マスタ/BKPF → ③ BSEG/SKAT 取得 → ④ 内部テーブル結合 → ソート
                  </li>
                  <li>
                    <code>TOP-OF-PAGE</code> … ページヘッダと列見出し
                  </li>
                  <li>
                    <code>END-OF-SELECTION</code> … 明細の LOOP と借方/貸方の WRITE
                  </li>
                </ol>
              </InfoPanel>
              <p>
                SE38 に貼り付けて動かす前に、スライドごとに書いた部分と見比べると理解が深まります。
                いきなり全文を暗記する必要はありません。
              </p>
              <ReportPreview
                caption="完成イメージ（ヘッダ＋明細）"
                rows={[...PREVIEW_HEADER_ROWS, ...PREVIEW_DETAIL_ROWS]}
              />
              <Reveal label="完成コード（全体）を見る">
                <CodeBlock language="ABAP" code={FINAL_PROGRAM} />
              </Reveal>
              <LessonQuiz
                answer={0}
                explanation="shkzg = S（c_shkzg_s）のとき借方 gv_debit に dmbtr を入れ、H のとき貸方 gv_credit に入れます。WRITE では列106と122に分けて出力します。"
                question={<strong>明細の借方金額列に値が入るのは shkzg がどのとき？</strong>}
                options={["S（借方）", "H（貸方）", "どちらでも両方"]}
              />
            </>
          ),
        },
        {
          title: "テキストエレメント",
          plainText:
            "任意の仕上げ — TEXT-c** / '文言'(id)。c=列・p=ページ・t=タイトル・m=メッセージ。\n多言語：IDは共通、文言だけ言語ごとにテキストプール登録。ログオン言語で自動切替。\nBちゃん：英語ユーザ用にプログラム複製しなくていい？\n先生：ソースは同じ。Text symbols を言語別にメンテするだけ。",
          content: (
            <>
              <h2>ラベルをテキストエレメントへ（任意の仕上げ）</h2>
              <p>
                演習の各ステップでは、まず<strong>ロジックと列位置</strong>に集中するため、見出しをプログラムに直書きしても構いません。
                完成コードでは列見出しを <code>TEXT-c01</code>〜<code>TEXT-c10</code> に切り替え、
                SE38 の Text elements に文言を登録します。PGMID や DATE などの固定ラベルは、必要に応じて第4章の{" "}
                <code>&apos;文言&apos;(id)</code> 形式（<code>p01</code> など）へ移せます。
              </p>
              <Callout variant="note">
                <strong>ID の命名（3文字・先頭1文字＝意味）</strong>
                <br />
                <code>c**</code> … <strong>C</strong>olumn（帳票の<strong>列見出し</strong>）c01〜c10<br />
                <code>p**</code> … <strong>P</strong>age（ページヘッダの固定ラベル）p01〜<br />
                <code>t**</code> … <strong>T</strong>itle（帳票タイトル）<br />
                <code>m**</code> … <strong>M</strong>essage（メッセージ文言）
              </Callout>
              <Dialog speaker="teacher">
                変えるのは<strong>表示する文字列だけ</strong>です。<code>LOOP</code> や <code>shkzg</code>{" "}
                の判定、列番号（1, 18, 73, 106…）はそのままで構いません。
              </Dialog>
              <Dialog speaker="b">
                ソースに日本語がたくさんあると緊張するので、後からテキストプールに逃がせるのは助かります。
              </Dialog>
              <p>
                書き方の詳しい手順（SE38 の開き方・有効化の順番）は、次のリンク先のスライドで丁寧に説明しています。
              </p>
              <InfoPanel title="TEXT-c01〜c10（列見出し・完成コード用）" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>列</th>
                      <th>登録する文言</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>TEXT-c01</code>
                      </td>
                      <td>1</td>
                      <td>伝票タイプ</td>
                    </tr>
                    <tr>
                      <td>
                        <code>TEXT-c02</code>
                      </td>
                      <td>18</td>
                      <td>転記日付</td>
                    </tr>
                    <tr>
                      <td>
                        <code>TEXT-c03</code>
                      </td>
                      <td>30</td>
                      <td>伝票日付</td>
                    </tr>
                    <tr>
                      <td>
                        <code>TEXT-c04</code>
                      </td>
                      <td>42</td>
                      <td>伝票番号</td>
                    </tr>
                    <tr>
                      <td>
                        <code>TEXT-c05</code>
                      </td>
                      <td>54</td>
                      <td>ユーザ</td>
                    </tr>
                    <tr>
                      <td>
                        <code>TEXT-c06</code>
                      </td>
                      <td>68</td>
                      <td>明細</td>
                    </tr>
                    <tr>
                      <td>
                        <code>TEXT-c07</code>
                      </td>
                      <td>73</td>
                      <td>勘定</td>
                    </tr>
                    <tr>
                      <td>
                        <code>TEXT-c08</code>
                      </td>
                      <td>106</td>
                      <td>借方金額</td>
                    </tr>
                    <tr>
                      <td>
                        <code>TEXT-c09</code>
                      </td>
                      <td>122</td>
                      <td>貸方金額</td>
                    </tr>
                    <tr>
                      <td>
                        <code>TEXT-c10</code>
                      </td>
                      <td>139</td>
                      <td>摘要</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <InfoPanel title="その他のテキストシンボル（p / t / m 系）" variant="reference">
                <ul>
                  <li>
                    <code>p01</code> … PGMID:、<code>p02</code> … USER:、<code>p03</code> … DATE: などページヘッダの固定ラベル
                  </li>
                  <li>
                    <code>t01</code> … 仕訳日記帳 演習2（タイトル）
                  </li>
                  <li>
                    <code>m01</code> … 対象データは登録されていません（メッセージ）
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="b">
                英語でログオンするユーザ向けに、プログラムを複製しなくてもいいんですか？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。ソースは <code>TEXT-c01</code> のまま、SE38 の Text symbols に英語行を追加するだけ。
                第4章でも触れた「名前札（ID）は共通、中身（文言）だけ言語別」。実務の多言語対応の基本です。
              </Dialog>
              <h3>Before → After（例）</h3>
              <CodeBlock
                language="ABAP"
                code={`" Before（演習中）
  WRITE: /1 'PGMID:' NO-GAP, 9 sy-cprog.
  MESSAGE s000(z01) WITH '対象データは登録されていません'.

" After（テキストシンボル登録後）
  WRITE: /1 'PGMID:'(p01) NO-GAP, 9 sy-cprog.
  MESSAGE s000(z01) WITH '対象データは登録されていません'(m01).

" 見出し（完成コードと同じ列位置・c 系 ID）
  WRITE: /1 TEXT-c01, 18 TEXT-c02, 30 TEXT-c03, 42 TEXT-c04,
          54 TEXT-c05, 68 TEXT-c06, 73 TEXT-c07,
          106(14) TEXT-c08 RIGHT-JUSTIFIED,
          122(14) TEXT-c09 RIGHT-JUSTIFIED,
          139 TEXT-c10.`}
              />
              <Callout variant="tip">
                引用符内の文字列は<strong>未登録時のフォールバック</strong>
                です。SE38 で Text symbols に登録・有効化すると、そちらの文言が使われます。選択画面の{" "}
                <code>p_bukrs</code> / <code>s_budat</code> ラベルは{" "}
                <strong>Selection texts</strong> タブで編集できます。
              </Callout>
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <LessonLinkButton
                  courseSlug="abap-training"
                  lessonFile="04-selection-screen"
                  slide={5}
                  label="第4章: テキストシンボルの概念"
                  variant="back"
                />
                <LessonLinkButton
                  courseSlug="abap-training"
                  lessonFile="04-selection-screen"
                  slide={6}
                  label="第4章: メンテ画面の手順"
                  variant="back"
                />
                <LessonLinkButton
                  courseSlug="abap-training"
                  lessonFile="a1-sap-development-tools"
                  slide={3}
                  label="追加: テキストエレメント画面"
                  variant="back"
                />
                <LessonLinkButton
                  courseSlug="abap-training"
                  lessonFile="a1-sap-development-tools"
                  slide={2}
                  label="追加: SE38の開発サイクル"
                  variant="back"
                />
                <InfoPanel
                  title="複数言語対応も同じ仕組み"
                  variant="reference"
                  lead={
                    <>
                      <code>TEXT-c01</code> や <code>p01</code> などの<strong> ID は言語共通</strong>です。
                      表示文言だけ、テキストプールに<strong>言語ごと</strong>登録します。プログラムのロジックは1本のままです。
                    </>
                  }
                >
                  <ul>
                    <li>
                      利用者の<strong>ログオン言語</strong>（<code>sy-langu</code>）に合った翻訳行が、実行時に自動で選ばれます
                    </li>
                    <li>
                      例：<code>TEXT-c01</code> に 日本語「伝票タイプ」／英語「Document Type」を別々に登録。ソースは{" "}
                      <code>TEXT-c01</code> の1行だけ
                    </li>
                    <li>
                      帳票見出し … <strong>Text symbols</strong> タブ　／　選択画面ラベル …{" "}
                      <strong>Selection texts</strong> タブ（どちらも言語別にメンテ）
                    </li>
                    <li>
                      演習中の <code>c_spras = &apos;J&apos;</code>（T003T を日本語で取る）と同じ発想。
                      <strong>「どの言語の文言を使うか」はキーで決める</strong>だけです
                    </li>
                    <li>
                      文言修正・翻訳追加だけなら<strong>プログラム改修不要</strong>（テキストプールの更新＋有効化）
                    </li>
                  </ul>
                </InfoPanel>
              </div>
            </>
          ),
        },
        {
          title: "テーブル関連図（ERD）",
          plainText:
            "テーブル関連図（ERD）\n演習で使う5テーブル（T001 / T003T / BKPF / BSEG / SKAT）のキー項目と外部キー線を1枚で確認。各列は『日本語名（列コード）』で表示。\n関連：BKPF 1―多 BSEG（BUKRS+BELNR+GJAHR）／T001 1―多 BKPF（BUKRS）・SKAT（KTOPL）／T003T 1―多 BKPF（BLART）／SKAT 1―多 BSEG（SAKNR=HKONT）\n先生：線を追うと FOR ALL ENTRIES と READ TABLE で結合するキーが分かる。",
          content: (
            <>
              <h2>テーブル関連図（ERD）</h2>
              <p>
                この演習で読み書きする<strong>5テーブル</strong>のキー項目とつながりを、ER 図でまとめました。
                各列は<strong>日本語名（列コード）</strong>で表示し、鍵アイコン付きの列が主キーです。
                図に載せているのは<strong>演習の型・SELECT で使う列だけ</strong>です。
                ドラッグ・ズームで全体をたどれます（
                <a href="https://github.com/CNimmo16/react-erd" target="_blank" rel="noreferrer">
                  react-erd
                </a>
                ）。
              </p>
              <SapErdDiagram variant="journalLedger" height={560} />
              <InfoPanel title="演習コードとの対応" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>ER 図の線</th>
                      <th>プログラムでの結合</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>BKPF</code> → <code>BSEG</code>
                      </td>
                      <td>
                        <code>FOR ALL ENTRIES IN gt_bkpf</code>（<code>BUKRS</code> / <code>BELNR</code> /{" "}
                        <code>GJAHR</code>）
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>T001</code> → <code>BKPF</code>
                      </td>
                      <td>
                        選択画面の <code>p_bukrs</code> で <code>WHERE bukrs = p_bukrs</code>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>T003T</code> → <code>BKPF</code>
                      </td>
                      <td>
                        ループ内 <code>READ TABLE gt_t003t WITH KEY blart = gs_bkpf-blart</code>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>SKAT</code> → <code>BSEG</code>
                      </td>
                      <td>
                        <code>FOR ALL ENTRIES IN gt_bseg</code> ＋ <code>ktopl = gs_t001-ktopl</code> ／ ループ内{" "}
                        <code>READ TABLE gt_skat WITH KEY saknr = gs_bseg-hkont</code>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <code>T001</code> → <code>SKAT</code>
                      </td>
                      <td>
                        <code>gs_t001-ktopl</code> を SKAT 取得条件に使用（会社ごとの勘定表）
                      </td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="tip">
                図の右上「全画面」で拡大表示できます。詳しい項目の意味は{" "}
                <LessonLinkButton
                  courseSlug="abap-taining"
                  lessonFile="a2-frequently-used-tables"
                  slide={3}
                  label="第17章: よく使うテーブル早見表"
                  variant="back"
                  className="inline-flex"
                />{" "}
                も参照してください。
              </Callout>
              <Dialog speaker="teacher">
                ER 図は<strong>「どのキーで結合するか」</strong>の地図です。
                <code>FOR ALL ENTRIES</code> は図の線に沿って一括取得し、
                <code>READ TABLE</code> はループ内で辞書（T003T / SKAT）を当てはめる。この2パターンが演習の核心です。
              </Dialog>
              <Callout variant="tip">
                今回の演習は<strong>データの構造を理解する</strong>ことが目的のため、
                <code>SELECT</code> で表ごとに取得し、<code>LOOP</code> と <code>READ TABLE</code> で結合する型を採用しています。
                次のスライドの <code>JOIN</code> は<strong>任意の発展</strong>です。
              </Callout>
            </>
          ),
        },
        {
          title: "【発展】SQL JOIN で結合する",
          plainText:
            "【発展】SQL JOIN で結合する\n今回の演習は構造理解が目的のため SELECT＋LOOP＋READ TABLE を採用。JOIN は提出不要の発展。INNER JOIN で BKPF＋BSEG を1回にまとめる例。T003T・SKAT は LEFT OUTER JOIN または別取得。\nA：JOIN の方が短くない？→ 構造が見えにくくなる。まず表ごとの箱とキー、余力で JOIN を読めるように。",
          content: (
            <>
              <h2>【発展】SQL <code>JOIN</code> で結合する</h2>
              <p>
                今回の演習②は、帳票を最短で作ることより<strong>データの構造を理解する</strong>ことを目的にしています。
                そのため <code>SELECT</code> で<strong>表ごと</strong>に内部テーブルへ載せ、
                <code>LOOP</code> と <code>READ TABLE</code> で<strong>どのキーでつながるか</strong>を追える型を正解ルートにしました。
              </p>
              <Callout variant="note">
                <strong>演習では JOIN を使いません。</strong>
                ヘッダ・明細・マスタが別の「箱」であること、伝票キーと勘定コードの対応が、
                デバッガと ER 図で見えることがゴールです。以下は<strong>提出不要の発展</strong>。既存コードを読むときの参考です。
              </Callout>
              <h3>BKPF ＋ BSEG を 1 回の SELECT にまとめる</h3>
              <p>
                ER 図の <code>BKPF</code> → <code>BSEG</code>（<code>bukrs</code> / <code>belnr</code> / <code>gjahr</code>
                ）は、<code>INNER JOIN</code> で次のように書けます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`" 発展例：ヘッダ＋明細を DB 側で結合（研修用の簡略イメージ）
TYPES: BEGIN OF g_typ_join,
         bukrs TYPE bkpf-bukrs,
         blart TYPE bkpf-blart,
         budat TYPE bkpf-budat,
         bldat TYPE bkpf-bldat,
         belnr TYPE bkpf-belnr,
         usnam TYPE bkpf-usnam,
         gjahr TYPE bkpf-gjahr,
         buzei TYPE bseg-buzei,
         hkont TYPE bseg-hkont,
         shkzg TYPE bseg-shkzg,
         dmbtr TYPE bseg-dmbtr,
         sgtxt TYPE bseg-sgtxt,
       END OF g_typ_join.

DATA: gt_join TYPE STANDARD TABLE OF g_typ_join.

SELECT bkpf~bukrs
       bkpf~blart
       bkpf~budat
       bkpf~bldat
       bkpf~belnr
       bkpf~usnam
       bkpf~gjahr
       bseg~buzei
       bseg~hkont
       bseg~shkzg
       bseg~dmbtr
       bseg~sgtxt
  FROM bkpf
  INNER JOIN bseg ON bkpf~bukrs = bseg~bukrs
                 AND bkpf~belnr = bseg~belnr
                 AND bkpf~gjahr = bseg~gjahr
  INTO TABLE gt_join
  WHERE bkpf~bukrs = p_bukrs
    AND bkpf~budat IN s_budat.`}
              />
              <InfoPanel title="演習の型との対応" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>演習でやったこと</th>
                      <th>JOIN でのイメージ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        BKPF を <code>SELECT</code> → BSEG を <code>FOR ALL ENTRIES IN gt_bkpf</code>
                      </td>
                      <td>
                        <code>INNER JOIN bseg ON</code> 3キー（会社・伝票番号・年度）
                      </td>
                    </tr>
                    <tr>
                      <td>
                        入れ子 <code>LOOP AT gt_bseg WHERE</code> 伝票キー一致
                      </td>
                      <td>
                        JOIN 済みの <code>gt_join</code> は<strong>明細1行＝1行</strong>（ループは1段で済む）
                      </td>
                    </tr>
                    <tr>
                      <td>
                        T003T / SKAT は <code>READ TABLE</code>
                      </td>
                      <td>
                        別 <code>SELECT</code> のまま、または <code>LEFT OUTER JOIN</code> で名称列を同時取得（下記）
                      </td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <h3>マスタ名称を JOIN に含める場合</h3>
              <p>
                伝票タイプ名（T003T）や勘定名（SKAT）は、キーが揃っていれば <code>LEFT OUTER JOIN</code> で付けられます。
                マスタに行がないときも明細は残したいので <strong>LEFT</strong>（内部結合だけだと行が落ちる）にします。
              </p>
              <CodeBlock
                language="ABAP"
                code={`" 発展例：名称まで含める（列は必要分だけ。型定義は別途）
SELECT bkpf~blart
       t003t~ltext
       bseg~hkont
       skat~txt20
       ...
  FROM bkpf
  INNER JOIN bseg ON bkpf~bukrs = bseg~bukrs
                 AND bkpf~belnr = bseg~belnr
                 AND bkpf~gjahr = bseg~gjahr
  LEFT OUTER JOIN t003t ON t003t~blart = bkpf~blart
                       AND t003t~spras = c_spras
  LEFT OUTER JOIN skat ON skat~saknr = bseg~hkont
                      AND skat~ktopl = gs_t001-ktopl
                      AND skat~spras = c_spras
  INTO TABLE ...
  WHERE bkpf~bukrs = p_bukrs
    AND bkpf~budat IN s_budat.`}
              />
              <InfoPanel
                title="なぜ演習では LOOP と SELECT か"
                variant="reference"
                lead="今回は「構造を理解する」研修。JOIN で一括取得すると、表の境目とキーの対応がコード上で見えにくくなります。"
              >
                <ul>
                  <li>
                    <strong>表ごとの箱が見える</strong> … <code>gt_bkpf</code>（表紙）・<code>gt_bseg</code>（明細）・
                    <code>gt_skat</code>（名称）が別々。ER 図のブロックと1対1で対応する
                  </li>
                  <li>
                    <strong>キーでつなぐ体験</strong> … <code>FOR ALL ENTRIES</code> と入れ子 <code>LOOP</code>、
                    <code>READ TABLE WITH KEY</code> で「どの列が線になるか」を手で追える
                  </li>
                  <li>
                    <strong>段階的にデバッグできる</strong> … 各 <code>SELECT</code> の直後に{" "}
                    <code>BREAK-POINT</code> し、取得→結合→出力の順で中身を確認できる（この演習の進め方）
                  </li>
                  <li>
                    <strong>JOIN はあとで</strong> … 構造が身についたあと、発展として{" "}
                    <code>INNER JOIN</code> が「同じ線を SQL で書いたもの」と読めると十分（第13章）
                  </li>
                  <li>
                    <strong>実務でも似た型は多い</strong> … 帳票の借方・貸方振り分けなどは、
                    <code>gt_out</code> を <code>LOOP</code> で組み立てる方が追いやすい（第8章）
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="a">
                <code>JOIN</code> 1本の方がコードは短そうですが、なんでわざわざ <code>LOOP</code> なんですか？
              </Dialog>
              <Dialog speaker="teacher">
                今回の目的は<strong>帳票を最短で出すこと</strong>ではなく、
                <strong>ヘッダ・明細・マスタの構造とキー</strong>を理解することです。
                <code>SELECT</code> と <code>LOOP</code> なら、表ごとの箱と ER 図の線が対応して見えます。
                <code>JOIN</code> はあとで「同じ結合の別写法」として読めれば OK です。
              </Dialog>
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <LessonLinkButton
                  courseSlug="abap-taining"
                  lessonFile="08-combine-data"
                  slide={8}
                  label="第8章: 結合の流れ（LOOP + READ TABLE）"
                  variant="back"
                />
                <LessonLinkButton
                  courseSlug="abap-taining"
                  lessonFile="16-good-programming"
                  slide={9}
                  label="第13章: SELECT の JOIN 技法"
                  variant="back"
                />
              </div>
              <Dialog speaker="closing">
                お疲れさまでした。演習②では <code>SELECT</code> と <code>LOOP</code> で、
                <strong>伝票・明細・マスタの構造</strong>と<strong>借方・貸方の出力</strong>を体験しました。
                発展の <code>JOIN</code> は構造が固まってからで十分です。次も「表ごとの箱→キーでつなぐ」を意識してください。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ExerciseJournalLedgerDetailLesson);
