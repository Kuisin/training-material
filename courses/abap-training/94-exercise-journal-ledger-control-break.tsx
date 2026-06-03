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
  lessonChrome,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "特別演習③ — 伝票見出しをまとめる（コントロールレベル出力）",
  meta: "特別 · 45分",
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

function formatAmount(n: number): string {
  return n.toLocaleString("ja-JP");
}

interface DemoLine {
  blart: string;
  blartTxt: string;
  budat: string;
  bldat: string;
  belnr: string;
  usnam: string;
  buzei: string;
  hkont: string;
  hkontTxt: string;
  debit?: number;
  credit?: number;
  sgtxt?: string;
}

function sortDemoLinesForReport3(lines: DemoLine[]): DemoLine[] {
  return [...lines].sort(
    (a, b) =>
      a.blart.localeCompare(b.blart) ||
      a.budat.localeCompare(b.budat) ||
      a.bldat.localeCompare(b.bldat) ||
      a.belnr.localeCompare(b.belnr) ||
      a.usnam.localeCompare(b.usnam) ||
      a.buzei.localeCompare(b.buzei),
  );
}

function sortDemoLinesForReport3A(lines: DemoLine[]): DemoLine[] {
  return [...lines].sort(
    (a, b) =>
      a.blart.localeCompare(b.blart) ||
      a.budat.localeCompare(b.budat) ||
      a.belnr.localeCompare(b.belnr) ||
      a.usnam.localeCompare(b.usnam) ||
      a.buzei.localeCompare(b.buzei),
  );
}

/** SORT 順の左側を含めて変わったか（ABAP の AT NEW ＝ f および左の項目が変わった行） */
function atNewInHierarchy(
  levelIndex: number,
  line: DemoLine,
  prev: DemoLine | undefined,
): boolean {
  if (!prev) return true;
  const keys: (keyof Pick<DemoLine, "blart" | "budat" | "bldat" | "belnr" | "usnam">)[] = [
    "blart",
    "budat",
    "bldat",
    "belnr",
    "usnam",
  ];
  for (let i = 0; i <= levelIndex; i++) {
    if (line[keys[i]] !== prev[keys[i]]) return true;
  }
  return false;
}

function appendHeaderCells(
  cells: ReportCell[],
  lv: {
    blart: string;
    blartTxt: string;
    budat: string;
    bldat: string;
    belnr: string;
    usnam: string;
  },
): void {
  cells.push({ col: 1, text: lv.blart });
  cells.push({ col: 4, text: lv.blartTxt });
  cells.push({ col: 18, text: lv.budat });
  cells.push({ col: 30, text: lv.bldat });
  cells.push({ col: 42, text: lv.belnr });
  cells.push({ col: 54, text: lv.usnam });
}

function appendDetailCells(cells: ReportCell[], line: DemoLine): void {
  cells.push({ col: 68, text: line.buzei });
  cells.push({ col: 73, text: line.hkont });
  cells.push({ col: 85, text: line.hkontTxt });
  cells.push({
    col: 106,
    text: line.debit ? formatAmount(line.debit) : "",
    width: 14,
    align: "right",
  });
  cells.push({
    col: 122,
    text: line.credit ? formatAmount(line.credit) : "",
    width: 14,
    align: "right",
  });
  cells.push({ col: 139, text: line.sgtxt ?? "" });
}

const DEMO_LINES: DemoLine[] = [
  {
    blart: "SA",
    blartTxt: "G/L伝票",
    budat: "2025/01/15",
    bldat: "2025/01/15",
    belnr: "1900000123",
    usnam: "YAMADA",
    buzei: "001",
    hkont: "41000000",
    hkontTxt: "売上高",
    debit: 120000,
    sgtxt: "1月分売上",
  },
  {
    blart: "SA",
    blartTxt: "G/L伝票",
    budat: "2025/01/15",
    bldat: "2025/01/15",
    belnr: "1900000123",
    usnam: "YAMADA",
    buzei: "002",
    hkont: "11201000",
    hkontTxt: "売掛金",
    credit: 120000,
  },
  {
    blart: "SA",
    blartTxt: "G/L伝票",
    budat: "2025/01/15",
    bldat: "2025/01/20",
    belnr: "1900000130",
    usnam: "SUZUKI",
    buzei: "001",
    hkont: "60000000",
    hkontTxt: "仕入高",
    debit: 80000,
    sgtxt: "1月分仕入",
  },
  {
    blart: "SA",
    blartTxt: "G/L伝票",
    budat: "2025/01/20",
    bldat: "2025/01/20",
    belnr: "1900000135",
    usnam: "SUZUKI",
    buzei: "002",
    hkont: "21100000",
    hkontTxt: "買掛金",
    credit: 80000,
  },
];

const COLUMN_HEADER_ROW: ReportRow = {
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
};

/** 演習②相当 — 見出し列を毎行そのまま出力 */
function buildRowsBefore(lines: DemoLine[]): ReportRow[] {
  const rows: ReportRow[] = [COLUMN_HEADER_ROW, { kind: "uline" }];
  sortDemoLinesForReport3(lines).forEach((line) => {
    const cells: ReportCell[] = [];
    appendHeaderCells(cells, {
      blart: line.blart,
      blartTxt: line.blartTxt,
      budat: line.budat,
      bldat: line.bldat,
      belnr: line.belnr,
      usnam: line.usnam,
    });
    appendDetailCells(cells, line);
    rows.push({ kind: "cells", cells });
  });
  return rows;
}

/**
 * create_report_3（FINAL_PROGRAM）の END-OF-SELECTION ループと同じロジックで帳票行を生成。
 * AT NEW は SORT 順の左側を含めて発火（段階的サプレス）。改ページはプレビューでは省略。
 */
function buildRowsFromCreateReport3(lines: DemoLine[]): ReportRow[] {
  const sorted = sortDemoLinesForReport3(lines);
  const rows: ReportRow[] = [COLUMN_HEADER_ROW, { kind: "uline" }];
  let prev: DemoLine | undefined;
  const gvPageno = 1;
  const syPagno = 1;

  for (const line of sorted) {
    let lvShowBlart = atNewInHierarchy(0, line, prev);
    let lvShowBudat = atNewInHierarchy(1, line, prev);
    let lvShowBldat = atNewInHierarchy(2, line, prev);
    let lvShowBelnr = atNewInHierarchy(3, line, prev);
    let lvShowUsnam = atNewInHierarchy(4, line, prev);

    if (syPagno !== gvPageno) {
      lvShowBlart = true;
      lvShowBudat = true;
      lvShowBldat = true;
      lvShowBelnr = true;
      lvShowUsnam = true;
    }

    const cells: ReportCell[] = [];
    appendHeaderCells(cells, {
      blart: lvShowBlart ? line.blart : "",
      blartTxt: lvShowBlart ? line.blartTxt : "",
      budat: lvShowBudat ? line.budat : "",
      bldat: lvShowBldat ? line.bldat : "",
      belnr: lvShowBelnr ? line.belnr : "",
      usnam: lvShowUsnam ? line.usnam : "",
    });
    appendDetailCells(cells, line);
    rows.push({ kind: "cells", cells });
    prev = line;
  }

  return rows;
}

const BEFORE_ROWS = buildRowsBefore(DEMO_LINES);
const AFTER_ROWS_C = buildRowsFromCreateReport3(DEMO_LINES);

/** create_report_3_a — AT NEW usnam 1本で blart〜usnam をまとめてサプレス */
function buildRowsFromCreateReport3A(lines: DemoLine[]): ReportRow[] {
  const sorted = sortDemoLinesForReport3A(lines);
  const rows: ReportRow[] = [COLUMN_HEADER_ROW, { kind: "uline" }];
  let prev: DemoLine | undefined;

  for (const line of sorted) {
    const lvShowUsnam = !prev || line.usnam !== prev.usnam;
    const cells: ReportCell[] = [];
    appendHeaderCells(cells, {
      blart: lvShowUsnam ? line.blart : "",
      blartTxt: lvShowUsnam ? line.blartTxt : "",
      budat: lvShowUsnam ? line.budat : "",
      bldat: lvShowUsnam ? line.bldat : "",
      belnr: lvShowUsnam ? line.belnr : "",
      usnam: lvShowUsnam ? line.usnam : "",
    });
    appendDetailCells(cells, line);
    rows.push({ kind: "cells", cells });
    prev = line;
  }

  return rows;
}

const AFTER_ROWS_A = buildRowsFromCreateReport3A(DEMO_LINES);


const PROGRAM_A = `REPORT create_report_3_a
  NO STANDARD PAGE HEADING
  LINE-SIZE 200
  LINE-COUNT 58.

*---------------------------------------------------------------------*
* TYPES
*---------------------------------------------------------------------*
TYPES: BEGIN OF g_typ_bkpf,         " 会計伝票ヘッダ（BKPF）
         bukrs TYPE bkpf-bukrs,     " 会社コード
         blart TYPE bkpf-blart,     " 伝票タイプ
         budat TYPE bkpf-budat,     " 転記日付
         bldat TYPE bkpf-bldat,     " 伝票日付
         belnr TYPE bkpf-belnr,     " 伝票番号
         usnam TYPE bkpf-usnam,     " ユーザ（入力者ID）
         gjahr TYPE bkpf-gjahr,     " 会計年度
       END OF g_typ_bkpf.

TYPES: BEGIN OF g_typ_bseg,         " 会計伝票明細（BSEG）
         bukrs TYPE bseg-bukrs,     " 会社コード
         belnr TYPE bseg-belnr,     " 伝票番号
         gjahr TYPE bseg-gjahr,     " 会計年度
         buzei TYPE bseg-buzei,     " 明細番号
         hkont TYPE bseg-hkont,     " 勘定
         shkzg TYPE bseg-shkzg,     " 借方/貸方区分
         dmbtr TYPE bseg-dmbtr,     " 金額
         sgtxt TYPE bseg-sgtxt,     " 摘要
       END OF g_typ_bseg.

TYPES: BEGIN OF g_typ_t001,         " 会社コードマスタ（T001）
         ktopl TYPE t001-ktopl,     " 勘定科目表
         waers TYPE t001-waers,     " 通貨
       END OF g_typ_t001.

TYPES: BEGIN OF g_typ_t003t,        " 伝票タイプテキスト（T003T）
         blart TYPE t003t-blart,    " 伝票タイプ
         ltext TYPE t003t-ltext,    " 伝票タイプ名
       END OF g_typ_t003t.

TYPES: BEGIN OF g_typ_out,          " 帳票出力用（見出しの左右順＝サプレスの階層）
         bukrs     TYPE bkpf-bukrs,     " 会社コード
         blart     TYPE bkpf-blart,     " 伝票タイプ
         blart_txt TYPE t003t-ltext,    " 伝票タイプ名
         budat     TYPE bkpf-budat,     " 転記日付 ★ belnrより前に移動
         bldat     TYPE bkpf-bldat,     " 伝票日付 ★
         belnr     TYPE bkpf-belnr,     " 伝票番号 ★ budat/bldatの後ろへ
         usnam     TYPE bkpf-usnam,     " ユーザ（入力者ID）
         gjahr     TYPE bkpf-gjahr,     " 会計年度
         buzei     TYPE bseg-buzei,     " 明細番号
         hkont     TYPE bseg-hkont,     " 勘定
         hkont_txt TYPE skat-txt20,     " 勘定名
         shkzg     TYPE bseg-shkzg,     " 借方/貸方区分
         dmbtr     TYPE bseg-dmbtr,     " 金額
         sgtxt     TYPE bseg-sgtxt,     " 摘要
         waers     TYPE t001-waers,     " 通貨
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
      gt_out   TYPE STANDARD TABLE OF g_typ_out,
      gs_out   TYPE g_typ_out.

DATA: g_wrk_budat  TYPE bkpf-budat,  " 転記日付（選択画面の作業用）
      g_start_date TYPE bkpf-budat,  " 転記日付 From（帳票表示用）
      g_end_date   TYPE bkpf-budat,  " 転記日付 To
      g_hkont_txt  TYPE skat-txt20. " 勘定名（取得用）

DATA: gv_debit  TYPE bseg-dmbtr,  " 借方金額（出力用）
      gv_credit TYPE bseg-dmbtr. " 貸方金額（出力用）


DATA: lv_blart     TYPE bkpf-blart,    " 伝票タイプ（表示用・Aパート）
      lv_blart_txt TYPE t003t-ltext,  " 伝票タイプ名（表示用・Aパート）
      lv_budat_c   TYPE c LENGTH 10,  " 転記日付（文字・空欄可・Aパート）
      lv_bldat_c   TYPE c LENGTH 10,  " 伝票日付（文字・空欄可・Aパート）
      lv_belnr     TYPE bkpf-belnr,   " 伝票番号（表示用・Aパート）
      lv_usnam     TYPE bkpf-usnam,   " ユーザ（表示用・Aパート）
      lv_show_usnam TYPE abap_bool. " ユーザ列とその左の見出し列を出すか（Aパート）

*---------------------------------------------------------------------*
* CONSTANTS
*---------------------------------------------------------------------*
CONSTANTS: c_spras   TYPE t003t-spras VALUE 'J',  " 言語（日本語）
           c_shkzg_s TYPE bseg-shkzg VALUE 'S',  " 借方
           c_shkzg_h TYPE bseg-shkzg VALUE 'H'.  " 貸方

*---------------------------------------------------------------------*
* PARAMETER
*---------------------------------------------------------------------*
PARAMETERS: p_bukrs TYPE t001-bukrs OBLIGATORY.       " 会社コード
SELECT-OPTIONS: s_budat FOR g_wrk_budat OBLIGATORY. " 転記日付

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
  gs_out,
  g_start_date,
  g_end_date,
  g_hkont_txt.

  REFRESH: gt_bkpf,
  gt_bseg,
  gt_t003t,
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

* (4) 帳票出力用内部テーブルへの格納
  LOOP AT gt_bkpf INTO gs_bkpf.

*   4-① 伝票タイプテキストの格納
    READ TABLE gt_t003t INTO gs_t003t
    WITH KEY blart = gs_bkpf-blart.
    IF sy-subrc <> 0.
      CLEAR gs_t003t.
    ENDIF.

*   4-② 会計伝票明細情報の取得
    CLEAR gs_bseg.
    REFRESH gt_bseg.

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
    WHERE bukrs = gs_bkpf-bukrs
    AND belnr = gs_bkpf-belnr
    AND gjahr = gs_bkpf-gjahr.

    LOOP AT gt_bseg INTO gs_bseg.

*     4-③ 勘定コードテキストの取得
      CLEAR g_hkont_txt.

      SELECT SINGLE txt20
      INTO g_hkont_txt
      FROM skat
      WHERE spras = c_spras
      AND ktopl = gs_t001-ktopl
      AND saknr = gs_bseg-hkont.

      IF sy-subrc <> 0.
        CLEAR g_hkont_txt.
      ENDIF.

*     4-④ 帳票出力用内部テーブルへの格納
      CLEAR gs_out.

      gs_out-bukrs     = gs_bkpf-bukrs.     " 会社コード
      gs_out-blart     = gs_bkpf-blart.     " 伝票タイプ
      gs_out-blart_txt = gs_t003t-ltext.    " 伝票タイプ名
      gs_out-belnr     = gs_bkpf-belnr.     " 伝票番号
      gs_out-budat     = gs_bkpf-budat.     " 転記日付
      gs_out-bldat     = gs_bkpf-bldat.     " 伝票日付
      gs_out-usnam     = gs_bkpf-usnam.     " ユーザ
      gs_out-gjahr     = gs_bkpf-gjahr.     " 会計年度
      gs_out-buzei     = gs_bseg-buzei.     " 明細番号
      gs_out-hkont     = gs_bseg-hkont.     " 勘定
      gs_out-hkont_txt = g_hkont_txt.      " 勘定名
      gs_out-shkzg     = gs_bseg-shkzg.     " 借方/貸方区分
      gs_out-dmbtr     = gs_bseg-dmbtr.     " 金額
      gs_out-sgtxt     = gs_bseg-sgtxt.     " 摘要
      gs_out-waers     = gs_t001-waers.     " 通貨

      APPEND gs_out TO gt_out.

*     4-⑤ 作業領域の初期化
      CLEAR: gs_bseg,
      gs_out.

    ENDLOOP.

*   4-⑥ 作業領域・内部テーブルの初期化
    CLEAR: gs_bkpf,
    gs_t003t.
    REFRESH gt_bseg.

  ENDLOOP.

  IF gt_out IS INITIAL.
    MESSAGE s000(z01) WITH '対象データは登録されていません'.
    LEAVE LIST-PROCESSING.
  ENDIF.

*---------------------------------------------------------------------*
* 2. データ出力
* (1) ソート処理
*---------------------------------------------------------------------*
  SORT gt_out BY blart budat belnr usnam buzei.  " 演習②＋usnam（AT NEW usnam 用）

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
         /80(20) '仕訳日記帳 演習3' CENTERED,
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

  WRITE: /1   TEXT-001,                    " 伝票タイプ
          18  TEXT-002,                    " 転記日付
          30  TEXT-003,                    " 伝票日付
          42  TEXT-004,                    " 伝票番号
          54  TEXT-005,                    " ユーザ
          68  TEXT-006,                    " 明細
          73  TEXT-007,                    " 勘定
          106(14) TEXT-008 RIGHT-JUSTIFIED, " 借方金額
          122(14) TEXT-009 RIGHT-JUSTIFIED, " 貸方金額
          139 TEXT-010.                    " 摘要

  ULINE.

*---------------------------------------------------------------------*
* END-OF-SELECTION
*---------------------------------------------------------------------*

END-OF-SELECTION.

  LOOP AT gt_out INTO gs_out.

*   借方・貸方判定
    CLEAR: gv_debit, gv_credit.
    IF gs_out-shkzg = c_shkzg_s.       " 借方
      gv_debit = gs_out-dmbtr.
    ELSEIF gs_out-shkzg = c_shkzg_h.   " 貸方
      gv_credit = gs_out-dmbtr.
    ENDIF.

*   Aパート：見出し列（伝票タイプ〜ユーザ）をリセット
    CLEAR: lv_blart, lv_blart_txt, lv_budat_c, lv_bldat_c, lv_belnr, lv_usnam,
           lv_show_usnam.

*   Aパート：ユーザが変わった行だけ旗を立てる
    AT NEW usnam.
      lv_show_usnam = abap_true.
    ENDAT.

*   旗が立ったときだけ値をセット（ユーザ列とその左の見出し列すべて）
    IF lv_show_usnam = abap_true.
      lv_blart     = gs_out-blart.
      lv_blart_txt = gs_out-blart_txt.
      WRITE gs_out-budat TO lv_budat_c USING EDIT MASK '____/__/__'.
      WRITE gs_out-bldat TO lv_bldat_c USING EDIT MASK '____/__/__'.
      lv_belnr = gs_out-belnr.
      lv_usnam = gs_out-usnam.
    ENDIF.

*   出力（伝票タイプ〜ユーザは lv_*。明細列は gs_out）
    WRITE: /1   lv_blart,                                  " 伝票タイプ
            4   lv_blart_txt,                              " 伝票タイプ名
            18  lv_budat_c,                                " 転記日付
            30  lv_bldat_c,                                " 伝票日付
            42  lv_belnr,                                  " 伝票番号
            54  lv_usnam,                                  " ユーザ
            68  gs_out-buzei,                              " 明細番号
            73  gs_out-hkont,                              " 勘定
            85  gs_out-hkont_txt,                          " 勘定名
            106(14) gv_debit  CURRENCY gs_out-waers RIGHT-JUSTIFIED, " 借方金額
            122(14) gv_credit CURRENCY gs_out-waers RIGHT-JUSTIFIED, " 貸方金額
            139 gs_out-sgtxt.                               " 摘要

  ENDLOOP.`;


const PROGRAM_B = `REPORT create_report_3_b
  NO STANDARD PAGE HEADING
  LINE-SIZE 200
  LINE-COUNT 58.

*---------------------------------------------------------------------*
* TYPES
*---------------------------------------------------------------------*
TYPES: BEGIN OF g_typ_bkpf,         " 会計伝票ヘッダ（BKPF）
         bukrs TYPE bkpf-bukrs,     " 会社コード
         blart TYPE bkpf-blart,     " 伝票タイプ
         budat TYPE bkpf-budat,     " 転記日付
         bldat TYPE bkpf-bldat,     " 伝票日付
         belnr TYPE bkpf-belnr,     " 伝票番号
         usnam TYPE bkpf-usnam,     " ユーザ（入力者ID）
         gjahr TYPE bkpf-gjahr,     " 会計年度
       END OF g_typ_bkpf.

TYPES: BEGIN OF g_typ_bseg,         " 会計伝票明細（BSEG）
         bukrs TYPE bseg-bukrs,     " 会社コード
         belnr TYPE bseg-belnr,     " 伝票番号
         gjahr TYPE bseg-gjahr,     " 会計年度
         buzei TYPE bseg-buzei,     " 明細番号
         hkont TYPE bseg-hkont,     " 勘定
         shkzg TYPE bseg-shkzg,     " 借方/貸方区分
         dmbtr TYPE bseg-dmbtr,     " 金額
         sgtxt TYPE bseg-sgtxt,     " 摘要
       END OF g_typ_bseg.

TYPES: BEGIN OF g_typ_t001,         " 会社コードマスタ（T001）
         ktopl TYPE t001-ktopl,     " 勘定科目表
         waers TYPE t001-waers,     " 通貨
       END OF g_typ_t001.

TYPES: BEGIN OF g_typ_t003t,        " 伝票タイプテキスト（T003T）
         blart TYPE t003t-blart,    " 伝票タイプ
         ltext TYPE t003t-ltext,    " 伝票タイプ名
       END OF g_typ_t003t.

TYPES: BEGIN OF g_typ_out,          " 帳票出力用（見出しの左右順＝サプレスの階層）
         bukrs     TYPE bkpf-bukrs,     " 会社コード
         blart     TYPE bkpf-blart,     " 伝票タイプ
         blart_txt TYPE t003t-ltext,    " 伝票タイプ名
         budat     TYPE bkpf-budat,     " 転記日付 ★ belnrより前に移動
         bldat     TYPE bkpf-bldat,     " 伝票日付 ★
         belnr     TYPE bkpf-belnr,     " 伝票番号 ★ budat/bldatの後ろへ
         usnam     TYPE bkpf-usnam,     " ユーザ（入力者ID）
         gjahr     TYPE bkpf-gjahr,     " 会計年度
         buzei     TYPE bseg-buzei,     " 明細番号
         hkont     TYPE bseg-hkont,     " 勘定
         hkont_txt TYPE skat-txt20,     " 勘定名
         shkzg     TYPE bseg-shkzg,     " 借方/貸方区分
         dmbtr     TYPE bseg-dmbtr,     " 金額
         sgtxt     TYPE bseg-sgtxt,     " 摘要
         waers     TYPE t001-waers,     " 通貨
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
      gt_out   TYPE STANDARD TABLE OF g_typ_out,
      gs_out   TYPE g_typ_out.

DATA: g_wrk_budat  TYPE bkpf-budat,  " 転記日付（選択画面の作業用）
      g_start_date TYPE bkpf-budat,  " 転記日付 From（帳票表示用）
      g_end_date   TYPE bkpf-budat,  " 転記日付 To
      g_hkont_txt  TYPE skat-txt20. " 勘定名（取得用）

DATA: gv_debit  TYPE bseg-dmbtr,  " 借方金額（出力用）
      gv_credit TYPE bseg-dmbtr. " 貸方金額（出力用）


DATA: lv_blart     TYPE bkpf-blart,    " 伝票タイプ（表示用・Aパート）
      lv_blart_txt TYPE t003t-ltext,  " 伝票タイプ名（表示用・Aパート）
      lv_budat_c   TYPE c LENGTH 10,  " 転記日付（文字・空欄可・Aパート）
      lv_bldat_c   TYPE c LENGTH 10,  " 伝票日付（文字・空欄可・Aパート）
      lv_belnr     TYPE bkpf-belnr,   " 伝票番号（表示用・Aパート）
      lv_usnam     TYPE bkpf-usnam,   " ユーザ（表示用・Aパート）
      lv_show_usnam TYPE abap_bool. " ユーザ列とその左の見出し列を出すか（Aパート）

DATA: lv_show_blart TYPE abap_bool, " 改ページ再表示用（Bパート・Cで値セットに拡張）
      lv_show_budat TYPE abap_bool,
      lv_show_bldat TYPE abap_bool,
      lv_show_belnr TYPE abap_bool.

DATA: gv_pageno TYPE sy-pagno.     " 直前行のページ番号（Bパート）

*---------------------------------------------------------------------*
* CONSTANTS
*---------------------------------------------------------------------*
CONSTANTS: c_spras   TYPE t003t-spras VALUE 'J',  " 言語（日本語）
           c_shkzg_s TYPE bseg-shkzg VALUE 'S',  " 借方
           c_shkzg_h TYPE bseg-shkzg VALUE 'H'.  " 貸方

*---------------------------------------------------------------------*
* PARAMETER
*---------------------------------------------------------------------*
PARAMETERS: p_bukrs TYPE t001-bukrs OBLIGATORY.       " 会社コード
SELECT-OPTIONS: s_budat FOR g_wrk_budat OBLIGATORY. " 転記日付

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
  gs_out,
  g_start_date,
  g_end_date,
  g_hkont_txt.

  REFRESH: gt_bkpf,
  gt_bseg,
  gt_t003t,
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

* (4) 帳票出力用内部テーブルへの格納
  LOOP AT gt_bkpf INTO gs_bkpf.

*   4-① 伝票タイプテキストの格納
    READ TABLE gt_t003t INTO gs_t003t
    WITH KEY blart = gs_bkpf-blart.
    IF sy-subrc <> 0.
      CLEAR gs_t003t.
    ENDIF.

*   4-② 会計伝票明細情報の取得
    CLEAR gs_bseg.
    REFRESH gt_bseg.

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
    WHERE bukrs = gs_bkpf-bukrs
    AND belnr = gs_bkpf-belnr
    AND gjahr = gs_bkpf-gjahr.

    LOOP AT gt_bseg INTO gs_bseg.

*     4-③ 勘定コードテキストの取得
      CLEAR g_hkont_txt.

      SELECT SINGLE txt20
      INTO g_hkont_txt
      FROM skat
      WHERE spras = c_spras
      AND ktopl = gs_t001-ktopl
      AND saknr = gs_bseg-hkont.

      IF sy-subrc <> 0.
        CLEAR g_hkont_txt.
      ENDIF.

*     4-④ 帳票出力用内部テーブルへの格納
      CLEAR gs_out.

      gs_out-bukrs     = gs_bkpf-bukrs.     " 会社コード
      gs_out-blart     = gs_bkpf-blart.     " 伝票タイプ
      gs_out-blart_txt = gs_t003t-ltext.    " 伝票タイプ名
      gs_out-belnr     = gs_bkpf-belnr.     " 伝票番号
      gs_out-budat     = gs_bkpf-budat.     " 転記日付
      gs_out-bldat     = gs_bkpf-bldat.     " 伝票日付
      gs_out-usnam     = gs_bkpf-usnam.     " ユーザ
      gs_out-gjahr     = gs_bkpf-gjahr.     " 会計年度
      gs_out-buzei     = gs_bseg-buzei.     " 明細番号
      gs_out-hkont     = gs_bseg-hkont.     " 勘定
      gs_out-hkont_txt = g_hkont_txt.      " 勘定名
      gs_out-shkzg     = gs_bseg-shkzg.     " 借方/貸方区分
      gs_out-dmbtr     = gs_bseg-dmbtr.     " 金額
      gs_out-sgtxt     = gs_bseg-sgtxt.     " 摘要
      gs_out-waers     = gs_t001-waers.     " 通貨

      APPEND gs_out TO gt_out.

*     4-⑤ 作業領域の初期化
      CLEAR: gs_bseg,
      gs_out.

    ENDLOOP.

*   4-⑥ 作業領域・内部テーブルの初期化
    CLEAR: gs_bkpf,
    gs_t003t.
    REFRESH gt_bseg.

  ENDLOOP.

  IF gt_out IS INITIAL.
    MESSAGE s000(z01) WITH '対象データは登録されていません'.
    LEAVE LIST-PROCESSING.
  ENDIF.

*---------------------------------------------------------------------*
* 2. データ出力
* (1) ソート処理
*---------------------------------------------------------------------*
  SORT gt_out BY blart budat bldat belnr usnam buzei.  " 伝票タイプ→転記日付→伝票日付→伝票番号→ユーザ→明細

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
         /80(20) '仕訳日記帳 演習3' CENTERED,
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

  WRITE: /1   TEXT-001,                    " 伝票タイプ
          18  TEXT-002,                    " 転記日付
          30  TEXT-003,                    " 伝票日付
          42  TEXT-004,                    " 伝票番号
          54  TEXT-005,                    " ユーザ
          68  TEXT-006,                    " 明細
          73  TEXT-007,                    " 勘定
          106(14) TEXT-008 RIGHT-JUSTIFIED, " 借方金額
          122(14) TEXT-009 RIGHT-JUSTIFIED, " 貸方金額
          139 TEXT-010.                    " 摘要

  ULINE.

*---------------------------------------------------------------------*
* END-OF-SELECTION
*---------------------------------------------------------------------*

END-OF-SELECTION.

  LOOP AT gt_out INTO gs_out.

*   借方・貸方判定
    CLEAR: gv_debit, gv_credit.
    IF gs_out-shkzg = c_shkzg_s.       " 借方
      gv_debit = gs_out-dmbtr.
    ELSEIF gs_out-shkzg = c_shkzg_h.   " 貸方
      gv_credit = gs_out-dmbtr.
    ENDIF.

*   Aパート：見出し列（伝票タイプ〜ユーザ）をリセット
    CLEAR: lv_blart, lv_blart_txt, lv_budat_c, lv_bldat_c, lv_belnr, lv_usnam,
           lv_show_usnam,
           lv_show_blart, lv_show_budat, lv_show_bldat, lv_show_belnr.

*   Bパート：伝票タイプが変わったら改ページ
    AT NEW blart.
      NEW-PAGE.
      lv_show_blart = abap_true.
    ENDAT.

*   Aパート：ユーザが変わった行だけ旗を立てる
    AT NEW usnam.
      lv_show_usnam = abap_true.
    ENDAT.

*   Bパート：溢れ改ページ → 見出し列をすべて再表示
    RESERVE 1 LINES.

    IF sy-pagno <> gv_pageno.
      lv_show_blart = abap_true.
      lv_show_budat = abap_true.
      lv_show_bldat = abap_true.
      lv_show_belnr = abap_true.
      lv_show_usnam = abap_true.
    ENDIF.

*   旗が立ったときだけ値をセット（ユーザ列とその左の見出し列すべて）
    IF lv_show_usnam = abap_true.
      lv_blart     = gs_out-blart.
      lv_blart_txt = gs_out-blart_txt.
      WRITE gs_out-budat TO lv_budat_c USING EDIT MASK '____/__/__'.
      WRITE gs_out-bldat TO lv_bldat_c USING EDIT MASK '____/__/__'.
      lv_belnr = gs_out-belnr.
      lv_usnam = gs_out-usnam.
    ENDIF.

*   出力（伝票タイプ〜ユーザは lv_*。明細列は gs_out）
    WRITE: /1   lv_blart,                                  " 伝票タイプ
            4   lv_blart_txt,                              " 伝票タイプ名
            18  lv_budat_c,                                " 転記日付
            30  lv_bldat_c,                                " 伝票日付
            42  lv_belnr,                                  " 伝票番号
            54  lv_usnam,                                  " ユーザ
            68  gs_out-buzei,                              " 明細番号
            73  gs_out-hkont,                              " 勘定
            85  gs_out-hkont_txt,                          " 勘定名
            106(14) gv_debit  CURRENCY gs_out-waers RIGHT-JUSTIFIED, " 借方金額
            122(14) gv_credit CURRENCY gs_out-waers RIGHT-JUSTIFIED, " 貸方金額
            139 gs_out-sgtxt.                               " 摘要

    gv_pageno = sy-pagno.

  ENDLOOP.`;

const FINAL_PROGRAM = `REPORT create_report_3
  NO STANDARD PAGE HEADING
  LINE-SIZE 200
  LINE-COUNT 58.

*---------------------------------------------------------------------*
* TYPES
*---------------------------------------------------------------------*
TYPES: BEGIN OF g_typ_bkpf,         " 会計伝票ヘッダ（BKPF）
         bukrs TYPE bkpf-bukrs,     " 会社コード
         blart TYPE bkpf-blart,     " 伝票タイプ
         budat TYPE bkpf-budat,     " 転記日付
         bldat TYPE bkpf-bldat,     " 伝票日付
         belnr TYPE bkpf-belnr,     " 伝票番号
         usnam TYPE bkpf-usnam,     " ユーザ（入力者ID）
         gjahr TYPE bkpf-gjahr,     " 会計年度
       END OF g_typ_bkpf.

TYPES: BEGIN OF g_typ_bseg,         " 会計伝票明細（BSEG）
         bukrs TYPE bseg-bukrs,     " 会社コード
         belnr TYPE bseg-belnr,     " 伝票番号
         gjahr TYPE bseg-gjahr,     " 会計年度
         buzei TYPE bseg-buzei,     " 明細番号
         hkont TYPE bseg-hkont,     " 勘定
         shkzg TYPE bseg-shkzg,     " 借方/貸方区分
         dmbtr TYPE bseg-dmbtr,     " 金額
         sgtxt TYPE bseg-sgtxt,     " 摘要
       END OF g_typ_bseg.

TYPES: BEGIN OF g_typ_t001,         " 会社コードマスタ（T001）
         ktopl TYPE t001-ktopl,     " 勘定科目表
         waers TYPE t001-waers,     " 通貨
       END OF g_typ_t001.

TYPES: BEGIN OF g_typ_t003t,        " 伝票タイプテキスト（T003T）
         blart TYPE t003t-blart,    " 伝票タイプ
         ltext TYPE t003t-ltext,    " 伝票タイプ名
       END OF g_typ_t003t.

TYPES: BEGIN OF g_typ_out,          " 帳票出力用（見出しの左右順＝サプレスの階層）
         bukrs     TYPE bkpf-bukrs,     " 会社コード
         blart     TYPE bkpf-blart,     " 伝票タイプ
         blart_txt TYPE t003t-ltext,    " 伝票タイプ名
         budat     TYPE bkpf-budat,     " 転記日付 ★ belnrより前に移動
         bldat     TYPE bkpf-bldat,     " 伝票日付 ★
         belnr     TYPE bkpf-belnr,     " 伝票番号 ★ budat/bldatの後ろへ
         usnam     TYPE bkpf-usnam,     " ユーザ（入力者ID）
         gjahr     TYPE bkpf-gjahr,     " 会計年度
         buzei     TYPE bseg-buzei,     " 明細番号
         hkont     TYPE bseg-hkont,     " 勘定
         hkont_txt TYPE skat-txt20,     " 勘定名
         shkzg     TYPE bseg-shkzg,     " 借方/貸方区分
         dmbtr     TYPE bseg-dmbtr,     " 金額
         sgtxt     TYPE bseg-sgtxt,     " 摘要
         waers     TYPE t001-waers,     " 通貨
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
      gt_out   TYPE STANDARD TABLE OF g_typ_out,
      gs_out   TYPE g_typ_out.

DATA: g_wrk_budat  TYPE bkpf-budat,  " 転記日付（選択画面の作業用）
      g_start_date TYPE bkpf-budat,  " 転記日付 From（帳票表示用）
      g_end_date   TYPE bkpf-budat,  " 転記日付 To
      g_hkont_txt  TYPE skat-txt20. " 勘定名（取得用）

DATA: gv_debit  TYPE bseg-dmbtr,  " 借方金額（出力用）
      gv_credit TYPE bseg-dmbtr. " 貸方金額（出力用）


DATA: lv_force     TYPE abap_bool,    " 未使用
      lv_blart     TYPE bkpf-blart,    " 伝票タイプ（表示用）
      lv_blart_txt TYPE t003t-ltext,  " 伝票タイプ名（表示用）
      lv_budat_c   TYPE c LENGTH 10,  " 転記日付（文字・空欄可）
      lv_bldat_c   TYPE c LENGTH 10,  " 伝票日付（文字・空欄可）
      lv_belnr     TYPE bkpf-belnr,   " 伝票番号（表示用）
      lv_usnam     TYPE bkpf-usnam.   " ユーザ（表示用）

DATA: lv_show_blart TYPE abap_bool, " 伝票タイプを出すか
      lv_show_budat TYPE abap_bool, " 転記日付を出すか
      lv_show_bldat TYPE abap_bool, " 伝票日付を出すか
      lv_show_belnr TYPE abap_bool, " 伝票番号を出すか
      lv_show_usnam TYPE abap_bool. " ユーザを出すか

DATA: gv_pageno TYPE sy-pagno.     " 直前行のページ番号

*---------------------------------------------------------------------*
* CONSTANTS
*---------------------------------------------------------------------*
CONSTANTS: c_spras   TYPE t003t-spras VALUE 'J',  " 言語（日本語）
           c_shkzg_s TYPE bseg-shkzg VALUE 'S',  " 借方
           c_shkzg_h TYPE bseg-shkzg VALUE 'H'.  " 貸方

*---------------------------------------------------------------------*
* PARAMETER
*---------------------------------------------------------------------*
PARAMETERS: p_bukrs TYPE t001-bukrs OBLIGATORY.       " 会社コード
SELECT-OPTIONS: s_budat FOR g_wrk_budat OBLIGATORY. " 転記日付

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
  gs_out,
  g_start_date,
  g_end_date,
  g_hkont_txt.

  REFRESH: gt_bkpf,
  gt_bseg,
  gt_t003t,
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

* (4) 帳票出力用内部テーブルへの格納
  LOOP AT gt_bkpf INTO gs_bkpf.

*   4-① 伝票タイプテキストの格納
    READ TABLE gt_t003t INTO gs_t003t
    WITH KEY blart = gs_bkpf-blart.
    IF sy-subrc <> 0.
      CLEAR gs_t003t.
    ENDIF.

*   4-② 会計伝票明細情報の取得
    CLEAR gs_bseg.
    REFRESH gt_bseg.

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
    WHERE bukrs = gs_bkpf-bukrs
    AND belnr = gs_bkpf-belnr
    AND gjahr = gs_bkpf-gjahr.

    LOOP AT gt_bseg INTO gs_bseg.

*     4-③ 勘定コードテキストの取得
      CLEAR g_hkont_txt.

      SELECT SINGLE txt20
      INTO g_hkont_txt
      FROM skat
      WHERE spras = c_spras
      AND ktopl = gs_t001-ktopl
      AND saknr = gs_bseg-hkont.

      IF sy-subrc <> 0.
        CLEAR g_hkont_txt.
      ENDIF.

*     4-④ 帳票出力用内部テーブルへの格納
      CLEAR gs_out.

      gs_out-bukrs     = gs_bkpf-bukrs.     " 会社コード
      gs_out-blart     = gs_bkpf-blart.     " 伝票タイプ
      gs_out-blart_txt = gs_t003t-ltext.    " 伝票タイプ名
      gs_out-belnr     = gs_bkpf-belnr.     " 伝票番号
      gs_out-budat     = gs_bkpf-budat.     " 転記日付
      gs_out-bldat     = gs_bkpf-bldat.     " 伝票日付
      gs_out-usnam     = gs_bkpf-usnam.     " ユーザ
      gs_out-gjahr     = gs_bkpf-gjahr.     " 会計年度
      gs_out-buzei     = gs_bseg-buzei.     " 明細番号
      gs_out-hkont     = gs_bseg-hkont.     " 勘定
      gs_out-hkont_txt = g_hkont_txt.      " 勘定名
      gs_out-shkzg     = gs_bseg-shkzg.     " 借方/貸方区分
      gs_out-dmbtr     = gs_bseg-dmbtr.     " 金額
      gs_out-sgtxt     = gs_bseg-sgtxt.     " 摘要
      gs_out-waers     = gs_t001-waers.     " 通貨

      APPEND gs_out TO gt_out.

*     4-⑤ 作業領域の初期化
      CLEAR: gs_bseg,
      gs_out.

    ENDLOOP.

*   4-⑥ 作業領域・内部テーブルの初期化
    CLEAR: gs_bkpf,
    gs_t003t.
    REFRESH gt_bseg.

  ENDLOOP.

  IF gt_out IS INITIAL.
    MESSAGE s000(z01) WITH '対象データは登録されていません'.
    LEAVE LIST-PROCESSING.
  ENDIF.

*---------------------------------------------------------------------*
* 2. データ出力
* (1) ソート処理
*---------------------------------------------------------------------*
  SORT gt_out BY blart budat bldat belnr usnam buzei.  " 伝票タイプ→転記日付→伝票日付→伝票番号→ユーザ→明細

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
         /80(20) '仕訳日記帳 演習3' CENTERED,
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

  WRITE: /1   TEXT-001,                    " 伝票タイプ
          18  TEXT-002,                    " 転記日付
          30  TEXT-003,                    " 伝票日付
          42  TEXT-004,                    " 伝票番号
          54  TEXT-005,                    " ユーザ
          68  TEXT-006,                    " 明細
          73  TEXT-007,                    " 勘定
          106(14) TEXT-008 RIGHT-JUSTIFIED, " 借方金額
          122(14) TEXT-009 RIGHT-JUSTIFIED, " 貸方金額
          139 TEXT-010.                    " 摘要

  ULINE.

*---------------------------------------------------------------------*
* END-OF-SELECTION
*---------------------------------------------------------------------*

END-OF-SELECTION.

  LOOP AT gt_out INTO gs_out.

*   借方・貸方判定
    CLEAR: gv_debit, gv_credit.
    IF gs_out-shkzg = c_shkzg_s.       " 借方
      gv_debit = gs_out-dmbtr.
    ELSEIF gs_out-shkzg = c_shkzg_h.   " 貸方
      gv_credit = gs_out-dmbtr.
    ENDIF.

*   作業領域・表示フラグの初期化
    CLEAR: lv_blart, lv_blart_txt, lv_budat_c, lv_bldat_c, lv_belnr, lv_usnam,
    lv_show_blart, lv_show_budat, lv_show_bldat, lv_show_belnr, lv_show_usnam.

*   コントロールレベル判定（上位項目が変われば下位も自動的に再表示される）
    AT NEW blart.  " 伝票タイプが変わった行
      NEW-PAGE.    " 改ページ
      lv_show_blart = abap_true.
    ENDAT.
    AT NEW budat.  " 転記日付が変わった行
      lv_show_budat = abap_true.
    ENDAT.
    AT NEW bldat.  " 伝票日付が変わった行
      lv_show_bldat = abap_true.
    ENDAT.
    AT NEW belnr.  " 伝票番号が変わった行
      lv_show_belnr = abap_true.
    ENDAT.
    AT NEW usnam.  " ユーザが変わった行
      lv_show_usnam = abap_true.
    ENDAT.

*   改ページ判定（改ページ時は全項目を再表示）
    RESERVE 1 LINES.

    IF sy-pagno <> gv_pageno.
      lv_show_blart = abap_true.
      lv_show_budat = abap_true.
      lv_show_bldat = abap_true.
      lv_show_belnr = abap_true.
      lv_show_usnam = abap_true.
    ENDIF.

*   表示値の設定（フラグが立っている項目のみ値をセット）
    IF lv_show_blart = abap_true.
      lv_blart     = gs_out-blart.
      lv_blart_txt = gs_out-blart_txt.
    ENDIF.
    IF lv_show_budat = abap_true.
      WRITE gs_out-budat TO lv_budat_c USING EDIT MASK '____/__/__'.
    ENDIF.
    IF lv_show_bldat = abap_true.
      WRITE gs_out-bldat TO lv_bldat_c USING EDIT MASK '____/__/__'.
    ENDIF.
    IF lv_show_belnr = abap_true.
      lv_belnr = gs_out-belnr.
    ENDIF.
    IF lv_show_usnam = abap_true.
      lv_usnam = gs_out-usnam.
    ENDIF.

*   出力
    WRITE: /1   lv_blart,                              " 伝票タイプ
            4   lv_blart_txt,                          " 伝票タイプ名
            18  lv_budat_c,                            " 転記日付
            30  lv_bldat_c,                            " 伝票日付
            42  lv_belnr,                              " 伝票番号
            54  lv_usnam,                              " ユーザ
            68  gs_out-buzei,                          " 明細番号
            73  gs_out-hkont,                          " 勘定
            85  gs_out-hkont_txt,                      " 勘定名
            106(14) gv_debit  CURRENCY gs_out-waers RIGHT-JUSTIFIED, " 借方金額
            122(14) gv_credit CURRENCY gs_out-waers RIGHT-JUSTIFIED, " 貸方金額
            139 gs_out-sgtxt.                           " 摘要

*   ページ番号の保持
    gv_pageno = sy-pagno.

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

function ReferenceLinks() {
  return (
    <div className="mt-4 flex flex-wrap justify-end gap-2">
      <LessonLinkButton
        courseSlug="abap-training"
        lessonFile="93-exercise-journal-ledger-detail"
        slide={15}
        label="演習②: 完成コード（土台）"
        variant="back"
      />
      <LessonLinkButton
        courseSlug="abap-training"
        lessonFile="09-control-flow"
        slide={4}
        label="第9章: サプレス（重複表示を省く）"
        variant="back"
      />
      <LessonLinkButton
        courseSlug="abap-training"
        lessonFile="09-control-flow"
        slide={5}
        label="第9章: AT 制御（変わり目で処理）"
        variant="back"
      />
    </div>
  );
}

export default function ExerciseJournalLedgerControlBreakLesson() {
  return (
    <Lesson
      chrome={lessonChrome(
        "abap-training",
        "94-exercise-journal-ledger-control-break",
        lessonMeta.title
      )}
      slides={[
        {
          title: "概要（A・B・C構成）",
          plainText:
            "特別演習③ — 伝票見出しをまとめる（コントロールレベル出力）\n演習②の明細帳票を土台に、見出し列を変わり目だけ出す。A：AT NEW usnam＋lv_show_usnamで伝票タイプ〜ユーザを同じ条件でサプレス。B：改ページ。C：各見出し列ごとのAT NEW（完成形）。\n重複説明を避けるため、サプレス・AT制御は第9章、土台コードは演習②へリンク。",
          content: (
            <>
              <hgroup>
                <h1>特別演習③ — 伝票見出しをまとめる（コントロールレベル出力）</h1>
                <p>
                  演習②（明細・金額つき仕訳日記帳）を土台に、
                  <strong>伝票タイプ〜入力者ID</strong>を「変わり目だけ」出して見やすくします。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "45分" },
                  { icon: "📶", text: "特別演習" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <h3>このレッスンは3部構成です</h3>
              <ul>
                <li>
                  <strong>A：サプレスのロジック</strong> … <code>AT NEW usnam</code> と <code>lv_show_usnam</code> の<strong>型</strong>を学びます。A では<strong>ユーザ列とその左（伝票タイプ〜伝票番号）</strong>を、同じ旗1本でまとめてサプレスします。
                </li>
                <li>
                  <strong>B：改ページ</strong> … 伝票タイプが変わったら <code>NEW-PAGE</code>、ページが変わったら見出し列（全列）を再表示（<code>RESERVE</code>・<code>sy-pagno</code>）。
                </li>
                <li>
                  <strong>C：完成コード（任意）</strong> … もっと学びたい人向け。見出し列<strong>ごと</strong>に <code>AT NEW</code> を置く完成形（階層サプレス）を組み立てます。
                </li>
              </ul>
              <Callout variant="note">
                各パートの末尾に<strong>完成コード全文</strong>があります（A-⑤ / B-⑤ / C-⑦）。
                SE38 に貼って段階的に動かせます。
              </Callout>
              <Callout variant="tip">
                <strong>重複説明はしません。</strong> 土台のコード（型・取得・結合・出力）は<strong>演習②</strong>、
                サプレスと <code>AT NEW</code> の基礎は<strong>第9章</strong>で学んだ前提です。
                必要に応じて下のボタンから参照してください（同じ説明を繰り返さないための導線です）。
              </Callout>
              <ReferenceLinks />
              <Dialog speaker="teacher">
                演習②までで「明細を1行ずつ並べた帳票」は作れました。今回はそこに<strong>1つだけ</strong>機能を足します。
                <br />
                伝票単位で同じ値（伝票タイプ・日付・伝票番号・ユーザ）を、毎行ベタ書きしないようにする工夫です。
              </Dialog>
              <Dialog speaker="b">
                演習②の帳票、同じ伝票番号が縦にずらっと並んでいて、目が滑りました…。
                <br />
                あれを整えるんですね。
              </Dialog>
              <Dialog speaker="a">
                第9章でやった「サプレス」と「AT NEW」を、実際の帳票に当てはめる回、という理解で合っていますか？
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。
                <br />
                新しい呪文は増えません。<strong>既に知っている部品の組み合わせ</strong>です。
                <br />
                まずは「何を直したいのか」を、Before / After で見てみましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "A-① ねらい（Before / After）",
          plainText:
            "A-① ねらい。演習②は見出し列を明細ごとに繰り返す。AパートではAT NEW usnam＋lv_show_usnamで、ユーザ列とその左（伝票タイプ〜伝票番号）を同じ条件でサプレスする型を学ぶ。\nCパートでは見出し列ごとにAT NEWを置く完成形（階層サプレス）。明細・勘定・金額・摘要は毎行そのまま。",
          content: (
            <>
              <h2>A-① 何を直したいのか</h2>
              <p>
                演習②の帳票は、見出し列（伝票タイプ・日付・伝票番号・<strong>ユーザ</strong>など）を
                明細1行ごとに毎回出力します。同じ伝票に明細が2行あれば、同じ値が2回並びます。
              </p>
              <ReportPreview
                caption="❌ Before（演習②）— 同じ伝票の値が毎行くり返される"
                rows={BEFORE_ROWS}
              />
              <p>
                <strong>A パート</strong>では、サプレスの<strong>型</strong>を身につけるため、
                <strong>ユーザ（<code>usnam</code>）が変わった行</strong>だけ、
                <strong>ユーザ列とその左の見出し列（伝票タイプ〜伝票番号）</strong>をまとめて出します。
                旗は <code>lv_show_usnam</code> 1本だけです。
              </p>
              <ReportPreview
                caption="✅ After（A パート）— 伝票タイプ〜ユーザを同じ条件でサプレス"
                rows={AFTER_ROWS_A}
              />
              <Callout variant="note">
                <strong>C パートの完成形</strong>は、見出し列<strong>ごと</strong>に <code>AT NEW</code> を置く
                <strong>段階的サプレス</strong>です（下のプレビューは <code>create_report_3</code> のループから生成。
                例：転記日付だけ変わった行では、左の列は空欄のまま転記日付以降だけ再表示されます）。
              </Callout>
              <ReportPreview
                caption="🎯 完成形（C パート）— create_report_3 のループから生成"
                rows={AFTER_ROWS_C}
              />
              <Dialog speaker="b">
                After の方、すっきり読めます！
                <br />
                伝票のかたまりが目で追えますね。
              </Dialog>
              <Dialog speaker="a">
                データ自体（<code>gt_out</code>）は同じで、<strong>出すか／空欄にするか</strong>だけを変えるんですね。
              </Dialog>
              <Dialog speaker="teacher">
                そこが大事なポイント。元データは1行も削りません。<strong>表示の出し分け</strong>だけです。
                <br />
                では「変わり目をどう見つけるか」を次で。これも新顔ではありません。
              </Dialog>
            </>
          ),
        },
        {
          title: "A-② 変わり目を AT NEW usnam でつかむ",
          plainText:
            "A-② 変わり目の検知。第9章のAT NEW usnam を使う。SORT済みgt_outをLOOPし、ユーザが変わった先頭行だけ lv_show_usnam を立てる。\nこの旗1本で、ユーザ列とその左（伝票タイプ〜伝票番号）の出し分けもまとめて制御する（A-③）。Cパートでは blart/budat/bldat/belnr もそれぞれ AT NEW を置く。",
          content: (
            <>
              <h2>A-② 「変わり目」は <code>AT NEW usnam</code> でつかむ</h2>
              <p>
                第9章で学んだ <code>AT NEW 項目</code> は、<strong>SORT 済み</strong>のテーブルを{" "}
                <code>LOOP</code> したとき、「その項目が変わった最初の行」だけで処理が走る仕組みでした。
                <strong>A パート</strong>では <code>AT NEW usnam</code> で旗を立て、
                その旗で<strong>ユーザ列とその左の見出し列</strong>をまとめて制御します。
              </p>
              <CodeBlock
                language="ABAP"
                code={`LOOP AT gt_out INTO gs_out.
  AT NEW usnam.
    lv_show_usnam = abap_true.   " ユーザが変わった行だけ旗を立てる
  ENDAT.
  " … 旗が立ったときだけ lv_blart〜lv_usnam をセット → WRITE …
ENDLOOP.`}
              />
              <InfoPanel
                title="AT NEW の復習（詳しくは第9章）"
                variant="reference"
                lead="A では lv_show_usnam 1本で blart〜usnam を制御。C パートでは列ごとに AT NEW を置きます。"
              >
                <ul>
                  <li>
                    <code>AT NEW usnam</code> … 前行と比べて <code>usnam</code> が変わった<strong>先頭行</strong>だけ発火。
                  </li>
                  <li>
                    だから事前の <code>SORT</code> が前提（A パートは{" "}
                    <code>blart budat belnr usnam buzei</code>。C パートで <code>bldat</code> を足します）。
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="a">
                1列だけでも、「変わった行だけ処理が走る」という型は同じですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通り。A では<strong>型</strong>に集中します。
                <br />
                次は「旗を立てて、外で値をセットする」流れを、<code>lv_blart</code>〜<code>lv_usnam</code> で固めましょう。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "A-③ フラグで見出し列の「出す / 出さない」を決める",
          plainText:
            "A-③ フラグ（lv_show_usnam）。AT NEW usnam の中では lv_show_usnam を立てるだけ。値は ENDAT の外で。\nループ先頭で lv_blart〜lv_usnam / lv_show_usnam を CLEAR → AT NEW usnam → IF lv_show_usnam で blart〜usnam を lv_* にセット。\n改ページはBパート。列ごとの AT NEW はCパート。",
          content: (
            <>
              <h2>A-③ 伝票タイプ〜ユーザ——旗1本でまとめて制御</h2>
              <p>
                <code>AT NEW usnam</code> では値を読まず、<strong>表示フラグ</strong>{" "}
                <code>lv_show_usnam</code> だけを <code>abap_true</code> にします。
                旗が立った行では、<strong>ユーザ列とその左の見出し列</strong>すべてに値をセットします。
              </p>
              <CodeBlock
                language="ABAP"
                code={`" ① ループ先頭で見出し列をリセット
CLEAR: lv_blart, lv_blart_txt, lv_budat_c, lv_bldat_c, lv_belnr, lv_usnam,
       lv_show_usnam.

" ② 変わり目だけ旗を立てる（値は読まない）
AT NEW usnam.
  lv_show_usnam = abap_true.
ENDAT.

" ③ 旗が立ったときだけ、ENDAT の外で値をセット
IF lv_show_usnam = abap_true.
  lv_blart     = gs_out-blart.
  lv_blart_txt = gs_out-blart_txt.
  WRITE gs_out-budat TO lv_budat_c USING EDIT MASK '____/__/__'.
  WRITE gs_out-bldat TO lv_bldat_c USING EDIT MASK '____/__/__'.
  lv_belnr = gs_out-belnr.
  lv_usnam = gs_out-usnam.
ENDIF.

" ④ WRITE では lv_blart〜lv_usnam を出力（空なら空欄）`}
              />
              <Callout variant="warning">
                <strong>なぜ中で値を読まないのか</strong>：<code>AT NEW … ENDAT</code> の<strong>内側</strong>では、
                ABAP がその制御項目より<strong>右側の作業領域を <code>*</code> で埋める</strong>仕様があります。
                だから「中では旗だけ」「値は外で」が定石です。
              </Callout>
              <Callout variant="note">
                C パートでは <code>lv_show_usnam</code> 1本ではなく、
                <strong>列ごと</strong>に <code>lv_show_blart</code> などの旗と <code>AT NEW</code> を置く
                <strong>階層サプレス</strong>に進みます。
              </Callout>
              <Dialog speaker="b">
                <code>lv_show_usnam</code> 1本で blart〜usnam をまとめて制御する型がはっきりしましたね。
              </Dialog>
              <Dialog speaker="teacher">
                それが A パートのゴールです。
                <br />
                改ページは<strong>B パート</strong>、列ごとの <code>AT NEW</code> は<strong>C パート</strong>で足します。
              </Dialog>
            </>
          ),
        },
        {
          title: "A-④ 出力ループ 全体フロー（伝票タイプ〜ユーザ）",
          plainText:
            "A-④ END-OF-SELECTIONのLOOP流れ（Aパート）。\n①借方/貸方振り分け ②lv_blart〜lv_usnam/lv_show_usnamをCLEAR ③AT NEW usnamで旗 ④旗が立ったらblart〜usnamをセット ⑤WRITE。\n改ページはBパート。列ごとのAT NEWはCパート。",
          content: (
            <>
              <h2>A-④ 出力ループの流れ（1行ぶん・伝票タイプ〜ユーザ）</h2>
              <p>
                A パートで学んだ部品を <code>LOOP</code> に並べると、1行あたり次の順番になります。
                <strong>ユーザ列とその左の見出し列</strong>が対象です。
              </p>
              <MermaidDiagram
                chart={`flowchart TD
  S[gt_out を1行読む] --> D[借方/貸方を振り分け]
  D --> C["lv_blart〜lv_usnam / lv_show_usnam を CLEAR"]
  C --> AN["AT NEW usnam → lv_show_usnam = abap_true"]
  AN --> V["lv_show_usnam なら blart〜usnam に値セット"]
  V --> W[WRITE で1行出力]
  W --> S`}
              />
              <InfoPanel title="A パートで身につけた型" variant="reference">
                <ul>
                  <li>
                    <strong><code>AT NEW usnam</code></strong> … ユーザが変わった行だけ旗を立てる（第9章）
                  </li>
                  <li>
                    <strong><code>lv_show_usnam</code></strong> … 伝票タイプ〜ユーザをまとめて出すかの旗
                  </li>
                  <li>
                    <strong><code>lv_blart</code>〜<code>lv_usnam</code></strong> … 出すときだけ値を入れる箱。空なら帳票も空欄
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="a">
                「リセット → 旗立て → 値セット → 出力」のリズムが掴めました。
              </Dialog>
              <Dialog speaker="teacher">
                この型を B（改ページ）と C（列ごとの <code>AT NEW</code>）に広げていきます。
                <br />
                まず B パートで改ページを押さえてから、C で<strong>完成形</strong>のコードを組み立てましょう。
                <br />
                A パートだけの全文は<strong>A-⑤</strong>で確認できます。
              </Dialog>
            </>
          ),
        },
        {
          title: "A-⑤ Aパート完成コード（全文）",
          plainText:
            "A-⑤ Aパート完成コード全文 create_report_3_a。lv_show_usnam 1本で伝票タイプ〜ユーザを同じ条件でサプレス。改ページ・列ごとのAT NEWは含まない。全文はRevealで開く。",
          content: (
            <>
              <h2>A-⑤ Aパート完成コード（全文）</h2>
              <p>
                A パートで学んだ<strong>伝票タイプ〜ユーザのサプレス</strong>を実装したプログラムです。
                <code>lv_show_usnam</code> 1本で、ユーザ列とその左の見出し列をまとめて制御します。
              </p>
              <InfoPanel title="A パートの範囲" variant="reference">
                <ul>
                  <li>
                    <code>AT NEW usnam</code> ＋ <code>lv_show_usnam</code> / <code>lv_blart</code>〜<code>lv_usnam</code>（A-②〜A-④）
                  </li>
                  <li>
                    <code>SORT gt_out BY blart budat belnr usnam buzei</code> … <code>AT NEW usnam</code> 用
                  </li>
                  <li>
                    改ページ（<code>NEW-PAGE</code> / <code>RESERVE</code> / <code>gv_pageno</code>）は<strong>含まない</strong>
                  </li>
                  <li>
                    列ごとの <code>AT NEW</code>（<code>lv_show_blart</code> など）は<strong>C パート</strong>で追加
                  </li>
                </ul>
              </InfoPanel>
              <Reveal label="Aパート完成コード（全体）を見る">
                <CodeBlock language="ABAP" code={PROGRAM_A} />
              </Reveal>
              <Dialog speaker="teacher">
                次の B パートでは、このコードに改ページ処理を足していきます。
              </Dialog>
            </>
          ),
        },
        {
          title: "B-① 伝票タイプが変わったら NEW-PAGE",
          plainText:
            "B-① 伝票タイプが変わったら改ページ。AT NEW blart の中で NEW-PAGE を実行し、タイプごとに帳票を区切る。\nNEW-PAGE は『表示するか』の旗 lv_show_blart とは別物。旗は溢れ改ページの再表示でも立つため、外で IF lv_show_blart … NEW-PAGE とはしない。\n意図的な区切り＝AT NEW blart の中、見出しの再表示＝RESERVE と sy-pagno 比較（B-②）。",
          content: (
            <>
              <h2>B-① 伝票タイプが変わったら <code>NEW-PAGE</code></h2>
              <p>
                A パートの出力ループに <code>AT NEW blart</code> を追加し、その中に<strong>改ページ命令</strong>を置きます。
                伝票タイプ（<code>blart</code>）が変わった行は、<strong>新しいページの先頭</strong>から始めます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`AT NEW blart.
  NEW-PAGE.              " 伝票タイプが変わったときだけ（意図的な区切り）
  lv_show_blart = abap_true.
ENDAT.`}
              />
              <Callout variant="note">
                <code>NEW-PAGE</code> 命令そのものは<strong>第7章</strong>で学びました。
                ここでは「<code>AT NEW blart</code> の<strong>中</strong>に置く」と覚えてください。
              </Callout>
              <Callout variant="warning">
                <strong><code>lv_show_blart</code> で <code>NEW-PAGE</code> しない理由</strong>
                <ul className="mt-2">
                  <li>
                    <code>lv_show_blart</code> は「見出しを<strong>出すか</strong>」の旗。立つ理由は2つ：
                    <code>AT NEW blart</code>（タイプが変わった）と{" "}
                    <code>IF sy-pagno &lt;&gt; gv_pageno</code>（溢れ改ページ後の再表示）
                  </li>
                  <li>
                    外で <code>IF lv_show_blart … NEW-PAGE</code> すると、2番目でも改ページしてしまう
                    → タイプは同じなのに余計な空白ページ
                  </li>
                  <li>
                    改ページの<strong>意図</strong>ごとに場所を分ける：<code>NEW-PAGE</code> は <code>AT NEW blart</code> の中だけ
                  </li>
                </ul>
              </Callout>
              <CodeBlock
                language="ABAP"
                code={`" ✗ こう書かない
IF lv_show_blart = abap_true.
  NEW-PAGE.    " ← 溢れ改ページの再表示行でも発火してしまう
ENDIF.

" ✓ 改ページの意図ごとに場所を分ける
AT NEW blart.
  NEW-PAGE.              " タイプが変わったときだけ
  lv_show_blart = abap_true.
ENDAT.`}
              />
              <Dialog speaker="a">
                タイプが変わったときだけ区切る、という<strong>意図</strong>がはっきりしますね。
              </Dialog>
              <Dialog speaker="teacher">
                その通り。次は「同じタイプのままページだけ変わった」とき——サプレスした見出しをどう戻すか——です。
              </Dialog>
            </>
          ),
        },
        {
          title: "B-② 新ページでは見出し列をすべて再表示",
          plainText:
            "B-② 新ページでは見出し列（blart〜usnam）をすべて再表示。サプレスだけだと同じ伝票の続きが新ページ先頭に来たとき見出しが空欄になる。\nRESERVE 1 LINES で行が収まるか先に判定→収まらなければ改ページ（sy-pagno が進む）。\nIF sy-pagno <> gv_pageno なら lv_show_* をすべて abap_true にして全列の値を出し直す。WRITE の後に gv_pageno = sy-pagno で直前行のページを控える。",
          content: (
            <>
              <h2>B-② 新ページでは、見出し列を<strong>すべて</strong>出し直す</h2>
              <p>
                サプレスだけだと困る場面があります。<strong>同じ伝票がページをまたいだ</strong>とき、
                新ページの先頭行は「変わり目ではない」ので見出し（伝票タイプ〜ユーザ）が空欄になり、何の伝票か分からなくなります。
              </p>
              <p>
                要件：<strong>ページが変わった行では、見出し列（blart〜usnam）の値をすべて再表示</strong>する。
                明細列（明細番号・勘定・金額・摘要）は毎行そのまま出します。
              </p>
              <CodeBlock
                language="ABAP"
                code={`RESERVE 1 LINES.            " 入らなければ先に改ページ（sy-pagno が進む）

IF sy-pagno <> gv_pageno.      " 直前行とページが違う＝改ページした
  lv_show_blart = abap_true.   " 見出し列の旗をすべて立てる
  lv_show_budat = abap_true.
  lv_show_bldat = abap_true.
  lv_show_belnr = abap_true.
  lv_show_usnam = abap_true.
ENDIF.

" … 旗が立った項目だけ値セット → WRITE …

gv_pageno = sy-pagno.          " ループ末尾：今行のページを控え（次行の比較用）`}
              />
              <InfoPanel title="2つの部品の役割" variant="breakdown">
                <ul>
                  <li>
                    <code>RESERVE n LINES.</code> … 「あと n 行ぶん入るか？」を判定。入らなければ<strong>その場で改ページ</strong>。
                    <code>WRITE</code> の<strong>前</strong>に置くと <code>sy-pagno</code> が先に正しい値になる。
                  </li>
                  <li>
                    <code>gv_pageno</code> … 直前に出力した行のページ番号の<strong>控え</strong>。
                    ループ<strong>先頭付近で読み</strong>、<strong>末尾で更新</strong>（B-③）。
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="note">
                ここでフラグ方式が効きます。<code>AT NEW</code> が立てた旗に、改ページ判定が「全部立てる」を<strong>上書き</strong>するだけ。
                値セットと <code>WRITE</code> は1か所のままで、両方の事情をきれいに合流できます。
              </Callout>
              <Dialog speaker="b">
                「変わり目だから出す」と「ページが変わったから<strong>全部</strong>出す」の2つの理由が、同じ旗に集まるんですね。
                <br />
                それなら <code>NEW-PAGE</code> も <code>AT NEW</code> の外に出して、
                <code>IF lv_show_blart = abap_true.</code> のときだけ実行すれば、旗の管理が1か所にまとまりませんか？
              </Dialog>
              <Dialog speaker="teacher">
                惜しい発想ですが、<strong>それは避けましょう</strong>（詳しくは B-①）。
                <code>lv_show_blart</code> は「見出しを<strong>出すか</strong>」の旗で、溢れ改ページの再表示でも立ちます。
                <code>NEW-PAGE</code> は「タイプが<strong>変わったら区切る</strong>」命令——意味が違います。
              </Dialog>
              <Dialog speaker="a">
                <code>RESERVE</code> を <code>WRITE</code> の前に置くのが効くんですね。
                <br />
                先に改ページしておくから、ページ番号の比較が正しくなる。
              </Dialog>
              <Dialog speaker="teacher">
                その順番が命です。次のスライドで <code>gv_pageno</code> の「読む位置」と「更新する位置」を確認しましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "B-③ ページ番号は「読む位置」と「更新する位置」が違う",
          plainText:
            "B-③ gv_pageno を読む位置と更新する位置が違う理由。gv_pageno は『直前に出力した行のページ番号』。\nループ先頭付近で読む（IF sy-pagno <> gv_pageno）＝これから出す行が前の行と別ページかを判定。RESERVE で先に改ページを確定させてから比較する。\nループ末尾で更新（gv_pageno = sy-pagno）＝今出した行のページを控え、次の行の比較材料にする。\n先頭で更新すると改ページ判定が効かなくなる。読む→書く→更新が定石。",
          content: (
            <>
              <h2>B-③ なぜ「読む位置」と「更新する位置」が離れているのか</h2>
              <p>
                B-② のコードでは、<code>gv_pageno</code> は<strong>ループの先頭付近で読み（比較）</strong>、
                <strong>ループの末尾で更新</strong>しています。離れた場所に書くのには、はっきりした理由があります。
              </p>
              <p>
                ポイントは <code>gv_pageno</code> の正体です。これは
                <strong>「直前に出力した行のページ番号」</strong>を覚えておく控えです。
              </p>
              <CodeBlock
                language="ABAP"
                code={`END-OF-SELECTION.
  LOOP AT gt_out INTO gs_out.
    " ... 振り分け・初期化・AT NEW ...

    RESERVE 1 LINES.            " 入らなければ先に改ページ（sy-pagno が進む）

*   ◀ 読む（比較）：いま出す行は「前の行」と別ページ？
    IF sy-pagno <> gv_pageno.
      " → 改ページした。見出し列を全部出し直す（B-②）
    ENDIF.

    " ... 値セット ...
    WRITE: / lv_blart, ... .    " ← この行を出力（このページに乗る）

*   ▶ 更新：いま出した行のページを控える（次の行の比較材料にする）
    gv_pageno = sy-pagno.
  ENDLOOP.`}
              />
              <InfoPanel title="読む位置・更新位置それぞれの意味" variant="breakdown">
                <ul>
                  <li>
                    <strong>先頭付近で読む（比較）</strong> … 「これから出す行」が「前に出した行」と同じページかを判定。
                    比較は<strong>出力の前</strong>。<code>RESERVE</code> で先に改ページを確定させてから（B-②）。
                  </li>
                  <li>
                    <strong>末尾で更新</strong> … 「いま出した行」のページ番号を記録。これが
                    <strong>次の行にとっての「前の行のページ」</strong>になる。更新は<strong>出力の後</strong>。
                  </li>
                </ul>
              </InfoPanel>
              <InfoPanel title="3行のトレース（2ページ目へまたぐ例）" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>行</th>
                      <th>RESERVE後 sy-pagno</th>
                      <th>比較時 gv_pageno（前の行）</th>
                      <th>判定</th>
                      <th>出力後 gv_pageno</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1行目</td>
                      <td>1</td>
                      <td>0（初期値）</td>
                      <td>0 ≠ 1 → 見出し再表示</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td>2行目（同ページ）</td>
                      <td>1</td>
                      <td>1</td>
                      <td>1 = 1 → そのまま（サプレス）</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td>3行目（改ページ）</td>
                      <td>2</td>
                      <td>1</td>
                      <td>1 ≠ 2 → 見出し再表示</td>
                      <td>2</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="warning">
                もし<strong>先頭でいきなり</strong> <code>gv_pageno = sy-pagno</code> と更新してしまうと、
                比較の時点で常に <code>sy-pagno = gv_pageno</code> になり、改ページしても差が出ません。
              </Callout>
              <Dialog speaker="teacher">
                「前と比べてから、自分が次の“前”になる」。これは前後比較の定石です。
                <br />
                順番は「<code>RESERVE</code> → 判定 → 値セット → <code>WRITE</code> → <code>gv_pageno</code> 保持」を固定してください。
              </Dialog>
            </>
          ),
        },
        {
          title: "B-④ 改ページ処理の3か所（まとめ）",
          plainText:
            "B-④ 改ページは3か所で役割が違う。NEW-PAGE＝AT NEW blart の中、タイプが変わったときの意図的な区切り。\nRESERVE 1 LINES＝AT NEW の外、行がページに収まらないときの溢れ改ページ。\nIF sy-pagno <> gv_pageno＝AT NEW の外、ページが変わったあと見出し列をすべて再表示（NEW-PAGE は呼ばない）。\nB の要点を押さえたら C で create_report_3 を部品ごとに組み立てる。",
          content: (
            <>
              <h2>B-④ 改ページ処理は3か所——役割を混ぜない</h2>
              <InfoPanel title="改ページは3か所で役割が違う" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>処理</th>
                      <th>置く場所</th>
                      <th>いつ動くか</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>NEW-PAGE</code></td>
                      <td><code>AT NEW blart</code> の<strong>中</strong></td>
                      <td>伝票タイプが変わったとき（意図的な区切り）</td>
                    </tr>
                    <tr>
                      <td><code>RESERVE 1 LINES</code></td>
                      <td><code>AT NEW</code> の<strong>外</strong></td>
                      <td>行がページに収まらないとき（溢れ改ページ）</td>
                    </tr>
                    <tr>
                      <td><code>IF sy-pagno &lt;&gt; gv_pageno</code></td>
                      <td><code>AT NEW</code> の<strong>外</strong></td>
                      <td>ページが変わったあと、見出し列を<strong>すべて再表示</strong>（<code>NEW-PAGE</code> は呼ばない）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <MermaidDiagram
                chart={`flowchart TD
  AN["AT NEW blart → NEW-PAGE + 旗"] --> R[RESERVE 1 LINES]
  R --> P{"sy-pagno ≠ gv_pageno?"}
  P -->|はい| ALL[見出しの旗を全部 ON]
  P -->|いいえ| V
  ALL --> V[旗が立った列だけ値セット]
  V --> W[WRITE]
  W --> K[gv_pageno = sy-pagno]`}
              />
              <Callout variant="warning">
                <strong>順番が命</strong>：<code>RESERVE</code> → 判定 → 値セット → <code>WRITE</code> →{" "}
                <code>gv_pageno</code> 保持。詳しい理由は B-②・B-③ を参照してください。
              </Callout>
              <Dialog speaker="a">
                B パートは改ページまわりだけに絞れて、頭がすっきりしました。
              </Dialog>
              <Dialog speaker="teacher">
                では C パートで、A のサプレスと B の改ページを<strong>実プログラム</strong>{" "}
                <code>create_report_3</code> に載せていきましょう。
                <br />
                A＋B までの全文は<strong>B-⑤</strong>で確認できます。
                <br />
                （C パートは<strong>もっと学びたい人向け</strong>の追加内容です。B までで区切っても構いません。）
              </Dialog>
            </>
          ),
        },
        {
          title: "B-⑤ Bパート完成コード（全文）",
          plainText:
            "B-⑤ Bパート完成コード全文 create_report_3_b。Aの伝票タイプ〜ユーザサプレス（lv_show_usnam 1本）＋Bの改ページ。全文はRevealで開く。Cパートはもっと学びたい人向けの追加（任意）。",
          content: (
            <>
              <h2>B-⑤ Bパート完成コード（全文）</h2>
              <p>
                A パートの<strong>伝票タイプ〜ユーザのサプレス</strong>に、B パートの<strong>改ページ処理</strong>を足したプログラムです。
                見出し列は <code>lv_show_usnam</code> 1本で制御し、溢れ改ページ時は <code>lv_show_*</code> をすべて ON にして再表示します。
              </p>
              <InfoPanel title="B パートで足した箇所" variant="reference">
                <ul>
                  <li>
                    <code>AT NEW blart</code> の中で <code>NEW-PAGE</code>（B-①）
                  </li>
                  <li>
                    <code>RESERVE 1 LINES</code> → <code>IF sy-pagno &lt;&gt; gv_pageno</code>（B-②）
                  </li>
                  <li>
                    ループ末尾の <code>gv_pageno = sy-pagno</code>（B-③）
                  </li>
                  <li>
                    <code>SORT gt_out BY blart budat bldat belnr usnam buzei</code> … <code>AT NEW blart</code> 用
                  </li>
                </ul>
              </InfoPanel>
              <Reveal label="Bパート完成コード（全体）を見る">
                <CodeBlock language="ABAP" code={PROGRAM_B} />
              </Reveal>
              <Callout variant="tip">
                <strong>B パートここまでで演習の本体は完了です。</strong>
                <br />
                C パートは、列ごとの <code>AT NEW</code>（階層サプレス）や完成形{" "}
                <code>create_report_3</code> を<strong>もっと学びたい人向け</strong>の追加内容です。
                時間がない場合や、A＋B で十分な場合は、ここで区切って構いません。
              </Callout>
              <Dialog speaker="teacher">
                余力があれば C パートへ進んでください。列ごとに <code>AT NEW</code> を分ける完成形の組み立て方を確認できます。
              </Dialog>
            </>
          ),
        },
        {
          title: "C-① 完成コードの地図",
          plainText:
            "C-① 完成コードの地図。完成形 create_report_3 の出力イメージを先に確認。CパートはA・Bのロジックを実プログラムとして上から組み立てる。\n演習②と同じ部分と今回足す部分（g_typ_outの並び替え／表示用の変数・フラグ／END-OF-SELECTIONの変わり目処理）を地図にする。\n足すのは大きく2か所：宣言（型・変数）と出力ループ。",
          content: (
            <>
              <h2>C-① — 演習②に何を足すか</h2>
              <p>
                C パートでは、A・B で理解したロジックを実際のプログラム{" "}
                <code>create_report_3</code> として<strong>上から順に</strong>組み立てます。
                コードに入る前に、<strong>完成形の出力</strong>を確認しておきましょう。
              </p>
              <ReportPreview
                caption="🎯 完成形の出力（create_report_3）— 見出し列は段階的にサプレス、明細列は毎行"
                rows={AFTER_ROWS_C}
              />
              <Callout variant="note">
                上のプレビューは、完成コード <code>create_report_3</code> の{" "}
                <code>END-OF-SELECTION</code> ループ（<code>SORT</code> → <code>AT NEW</code> ×5 → 旗 →{" "}
                <code>lv_*</code> → <code>WRITE</code>）と<strong>同じロジック</strong>で生成しています。
              </Callout>
              <p>
                見出し列は<strong>段階的</strong>にサプレスされます。左の列が同じなら空欄のまま、
                変わった列<strong>以降</strong>だけ値が出ます（例：3行目は伝票日付・伝票番号・ユーザ、
                4行目は転記日付が変わったので転記日付〜伝票番号まで再表示）。
                明細・勘定・金額・摘要は毎行そのままです。
                <br />
                この帳票を作るために「演習②と同じ部分」と「今回足す部分」を、次の地図で押さえます。
              </p>
              <InfoPanel title="演習②と同じ／今回足す（部位マップ）" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>部位</th>
                      <th>演習②と同じ？</th>
                      <th>今回の追加（どこで解説）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>TYPES（型）</td>
                      <td>ほぼ同じ</td>
                      <td><code>g_typ_out</code> の項目順を入れ替え（C-②）</td>
                    </tr>
                    <tr>
                      <td>DATA（変数）</td>
                      <td>追加あり</td>
                      <td>表示用の作業領域・フラグ・<code>gv_pageno</code>（C-②）</td>
                    </tr>
                    <tr>
                      <td>データ抽出</td>
                      <td>同じ考え方</td>
                      <td>変更なし（取得・結合は演習②）（C-③）</td>
                    </tr>
                    <tr>
                      <td>SORT</td>
                      <td>ほぼ同じ</td>
                      <td>並び順を構造体に合わせる（C-③）</td>
                    </tr>
                    <tr>
                      <td>TOP-OF-PAGE</td>
                      <td>同じ</td>
                      <td>変更なし（C-④）</td>
                    </tr>
                    <tr>
                      <td>END-OF-SELECTION</td>
                      <td>1行ずつ <code>WRITE</code></td>
                      <td>変わり目処理を追加（C-⑤・C-⑥）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                足すのは大きく<strong>2か所だけ</strong>です。①宣言（型と変数）、②出力ループ（<code>END-OF-SELECTION</code>）。
                <br />
                それ以外は演習②のままだと分かると、ぐっと読みやすくなります。
              </Dialog>
              <Dialog speaker="b">
                地図があると「どこを集中して読めばいいか」が分かって安心します。
              </Dialog>
              <Dialog speaker="a">
                変更が少ない＝影響範囲が狭い、ということでもありますね。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "C-② 宣言を足す（TYPES・DATA）",
          plainText:
            "C-② 宣言の追加。出力ループで使う箱を先に宣言する。\ng_typ_outは項目順を入れ替え（budat/bldatをbelnrの前へ）＝AT NEWの階層づくり。\n表示用 lv_blart〜lv_usnam（見出しを出すときだけ値を入れる箱）、日付は lv_budat_c/lv_bldat_c（c LENGTH 10）で空欄可、lv_show_*（旗）、gv_pageno（改ページ判定用）を追加。\nlv_forceは未使用。",
          content: (
            <>
              <h2>C-② 宣言を足す（TYPES・DATA）</h2>
              <p>
                最初に、出力ループで使う「箱」を宣言します。A パートでは <code>lv_show_usnam</code> 1本で blart〜usnam を制御しましたが、
                完成形では見出し列すべて分の箱と旗をここで宣言します。
              </p>
              <CodeBlock
                language="ABAP"
                code={`" 出力用の構造体：見出しに出す順（左→右）に項目を並べる
TYPES: BEGIN OF g_typ_out,
         bukrs     TYPE bkpf-bukrs,     " 会社コード
         blart     TYPE bkpf-blart,     " 伝票タイプ
         blart_txt TYPE t003t-ltext,    " 伝票タイプ名
         budat     TYPE bkpf-budat,     " 転記日付 ★ belnr より前へ
         bldat     TYPE bkpf-bldat,     " 伝票日付 ★
         belnr     TYPE bkpf-belnr,     " 伝票番号 ★ budat / bldat の後ろへ
         usnam     TYPE bkpf-usnam,     " ユーザ
         "（以降：buzei 明細／hkont 勘定／dmbtr 金額 … 演習②と同じ）
       END OF g_typ_out.

" 見出し表示用の作業領域（演習②には無い）
DATA: lv_blart     TYPE bkpf-blart,    " 伝票タイプ
      lv_blart_txt TYPE t003t-ltext,  " 伝票タイプ名
      lv_budat_c   TYPE c LENGTH 10,  " 転記日付（文字・空欄可）
      lv_bldat_c   TYPE c LENGTH 10,  " 伝票日付（文字・空欄可）
      lv_belnr     TYPE bkpf-belnr,   " 伝票番号
      lv_usnam     TYPE bkpf-usnam.   " ユーザ

" 表示フラグ（この行で出すか）
DATA: lv_show_blart TYPE abap_bool,  " 伝票タイプ
      lv_show_budat TYPE abap_bool,  " 転記日付
      lv_show_bldat TYPE abap_bool,  " 伝票日付
      lv_show_belnr TYPE abap_bool,  " 伝票番号
      lv_show_usnam TYPE abap_bool.  " ユーザ

" 改ページ判定用（直前行のページ番号の控え）
DATA: gv_pageno TYPE sy-pagno.`}
              />
              <InfoPanel title="なぜこの宣言が必要か" variant="breakdown">
                <ul>
                  <li>
                    <code>g_typ_out</code> の並び替え … <code>AT NEW</code> の階層を作るため（C-②・C-③）。
                    <code>SORT</code> の並びと必ず一致させます。
                  </li>
                  <li>
                    <code>lv_blart … lv_usnam</code> … 「出すときだけ値を入れる」見出し用の箱。A では <code>lv_show_usnam</code> 1本でまとめて使用。
                  </li>
                  <li>
                    <code>lv_budat_c / lv_bldat_c</code>（<code>c LENGTH 10</code>）… 日付を<strong>空欄にできる</strong>よう文字で持つ（C-⑥）。
                  </li>
                  <li>
                    <code>lv_show_*</code> … 「この行で見出しを出すか」の旗。A では <code>lv_show_usnam</code> だけ使用（A-③）。
                  </li>
                  <li>
                    <code>gv_pageno</code> … 直前行のページ番号の控え。改ページ判定に使う（B-②・B-③）。
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="note">
                完成コードには <code>lv_force</code> という宣言もありますが、今回は<strong>未使用</strong>です。
                実務ではこうした使わない宣言は消して構いません（動作には影響しません）。
              </Callout>
              <Dialog speaker="a">
                箱の名前を見ただけで役割が分かりますね。
                <br />
                <code>lv_show_*</code> が旗、<code>_c</code> が文字の日付。
              </Dialog>
              <Dialog speaker="teacher">
                命名で意図が伝わるのは良いコードです。
                <br />
                ここで宣言した箱を、後の出力ループで順番に使っていきます。
              </Dialog>
            </>
          ),
        },
        {
          title: "C-③ データを取って並べ替える",
          plainText:
            "C-③ データ抽出とSORT。取得・結合は演習②と同じ考え方（会社マスタ→伝票タイプ→BKPF→明細BSEG→勘定名SKAT→gt_out）。この版は伝票ごとにBSEGをSELECT、明細ごとにSKATをSELECT SINGLE。\n重要なのはSORT gt_out BY blart budat bldat belnr usnam buzei。サプレスの階層（構造体の項目順）と必ず一致させる。bldat/usnamを足したのもこのため。\n取得方法の善し悪しは性能の話で今回の主題ではない。",
          content: (
            <>
              <h2>C-③ データを取って、並べ替える</h2>
              <p>
                データの取得と結合は演習②と<strong>同じ考え方</strong>です（会社マスタ → 伝票タイプ → BKPF →
                明細 BSEG → 勘定名 SKAT → <code>gt_out</code> へ格納）。ここでは詳しく繰り返さず、要点と
                <strong>並べ替え</strong>だけを確認します。
              </p>
              <CodeBlock
                language="ABAP"
                code={`" 取得・結合は演習②と同じ流れ（この版は伝票ごと・明細ごとに SELECT）
LOOP AT gt_bkpf INTO gs_bkpf.
  READ TABLE gt_t003t INTO gs_t003t WITH KEY blart = gs_bkpf-blart.

  SELECT ... FROM bseg                 " 伝票単位で明細を取得
    WHERE bukrs = gs_bkpf-bukrs        " 会社コード
      AND belnr = gs_bkpf-belnr        " 伝票番号
      AND gjahr = gs_bkpf-gjahr.       " 会計年度

  LOOP AT gt_bseg INTO gs_bseg.
    SELECT SINGLE txt20 INTO g_hkont_txt FROM skat ...  " 明細単位で勘定名
    "（gs_out へ各項目を MOVE して APPEND）
    APPEND gs_out TO gt_out.
  ENDLOOP.
ENDLOOP.

" ★ サプレスの階層に合わせて並べ替え（構造体の項目順と一致させる）
SORT gt_out BY blart budat bldat belnr usnam buzei.  " 伝票タイプ→…→ユーザ→明細`}
              />
              <InfoPanel title="ここで効く追加は SORT だけ" variant="breakdown">
                <ul>
                  <li>
                    <strong>取得・結合</strong> … 演習②と同じ（詳細は下のリンク）。
                    この版は <code>FOR ALL ENTRIES</code> ではなく、伝票ごとに <code>BSEG</code>、明細ごとに{" "}
                    <code>SKAT</code> を <code>SELECT SINGLE</code> しています。
                  </li>
                  <li>
                    <code>SORT gt_out BY blart budat bldat belnr usnam buzei</code> … サプレスの階層（＝
                    <code>g_typ_out</code> の項目順）と<strong>必ず一致</strong>させます（C-②・C-③）。
                    <code>bldat</code> を <code>budat</code> の後ろに足したのもこのためです。
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="warning">
                取得方法（<code>FOR ALL ENTRIES</code> か ループ内 <code>SELECT</code> か）は<strong>性能</strong>の話で、
                今回の主題ではありません。サプレスにとって重要なのは <code>SORT</code> の並び順です。
              </Callout>
              <Dialog speaker="b">
                取り方はいくつかあるけど、サプレス的には「正しい順で並んでいること」が命なんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通り。
                <br />
                <code>SORT</code> の順番が構造体の項目順とずれると、<code>AT NEW</code> が想定通りに発火しません。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "C-④ ページ上部の見出し（TOP-OF-PAGE）",
          plainText:
            "C-④ TOP-OF-PAGE。演習②と同じで、ページ上部（システム情報・会社コード・列見出し）を出す。列見出しは TEXT-001〜TEXT-010。\nTOP-OF-PAGEは各ページ先頭で自動実行されるので列タイトルは毎ページ出る。一方、明細行内の伝票見出し（blart〜usnamの値）はサプレスで消えるため、伝票がページをまたぐと新ページ先頭で空になる。これをC-⑥の改ページ再表示で補う。",
          content: (
            <>
              <h2>C-④ ページ上部の見出し（TOP-OF-PAGE）</h2>
              <p>
                <code>TOP-OF-PAGE</code> は演習②と同じで、ページ上部（システム情報・会社コード・列見出し）を出します。
                列見出しは <code>TEXT-001</code>〜<code>TEXT-010</code>（テキストエレメント）です。
              </p>
              <CodeBlock
                language="ABAP"
                code={`TOP-OF-PAGE.
  WRITE: /1 'PGMID:' NO-GAP, 9 sy-cprog, ... .   " 演習②と同じヘッダ
  " ... 会社コード・転記日付 ...
  WRITE: /1 TEXT-001, 18 TEXT-002, 30 TEXT-003, 42 TEXT-004,
          54 TEXT-005, 68 TEXT-006, 73 TEXT-007,
          106(14) TEXT-008 RIGHT-JUSTIFIED,
          122(14) TEXT-009 RIGHT-JUSTIFIED,
          139 TEXT-010.
  ULINE.`}
              />
              <InfoPanel title="列タイトルと『行内の見出し』は別物" variant="reference">
                <ul>
                  <li>
                    <code>TOP-OF-PAGE</code> は<strong>各ページの先頭</strong>で自動的に走る。だから
                    列タイトル（伝票タイプ・転記日付…）は<strong>毎ページ</strong>出ます。
                  </li>
                  <li>
                    一方、明細行の中に出す<strong>伝票見出しの値</strong>（<code>blart</code>〜<code>usnam</code>）はサプレスで消えます。
                    → 同じ伝票がページをまたぐと、新ページ先頭で値が空欄になる。これを <strong>C-⑥</strong>（B-②の実装）で補います。
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="note">
                <code>TEXT-001</code>〜<code>TEXT-010</code> の登録は、演習②の「テキストエレメント」スライドを参照してください。
              </Callout>
              <Dialog speaker="a">
                列の「タイトル」は毎ページ出るけど、行の中の「伝票の見出し（値）」は別物なんですね。
              </Dialog>
              <Dialog speaker="teacher">
                そこが今回の肝です。
                <br />
                タイトル行は <code>TOP-OF-PAGE</code>、行内の見出し値は{" "}
                <code>END-OF-SELECTION</code> のサプレスが担当します。
              </Dialog>
            </>
          ),
        },
        {
          title: "C-⑤ 出力ループ前半（振り分け・初期化・旗立て）",
          plainText:
            "C-⑤ END-OF-SELECTIONのLOOP前半。1行ぶんを前半（この行）と後半（C-⑥）に分けて読む。\n(1)借方・貸方の振り分け（演習②と同じ、毎行CLEARしてからshkzgで振り分け）。(2)作業領域・フラグを毎行CLEAR（前の行の値や旗が残らないように）。(3)AT NEW×5で変わり目の項目だけ旗を立てる（AT NEW blartではNEW-PAGEも。中では値を読まない）。",
          content: (
            <>
              <h2>C-⑤ 出力ループ前半（振り分け・初期化・旗立て）</h2>
              <p>
                ここからが今回の主役、<code>END-OF-SELECTION</code> の <code>LOOP</code> です。
                A パートでは <code>AT NEW usnam</code> と <code>lv_show_usnam</code> 1本で blart〜usnam を制御しましたが、完成形では見出し5項目すべてに列ごとの <code>AT NEW</code> を置きます。
                1行ぶんを前半（このスライド）と後半（C-⑥）に分けて読みます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`END-OF-SELECTION.
  LOOP AT gt_out INTO gs_out.

*   (1) 借方・貸方の振り分け（演習②と同じ）
    CLEAR: gv_debit, gv_credit.
    IF gs_out-shkzg = c_shkzg_s.       " 借方
      gv_debit = gs_out-dmbtr.
    ELSEIF gs_out-shkzg = c_shkzg_h.   " 貸方
      gv_credit = gs_out-dmbtr.
    ENDIF.

*   (2) 毎行：作業領域と表示フラグをリセット
    CLEAR: lv_blart, lv_blart_txt, lv_budat_c, lv_bldat_c, lv_belnr, lv_usnam,
    lv_show_blart, lv_show_budat, lv_show_bldat, lv_show_belnr, lv_show_usnam.

*   (3) 変わり目の項目だけ旗を立てる（A-③ の型を blart 〜 usnam に拡張。中では値を読まない）
    AT NEW blart.
      NEW-PAGE.    " 改ページ
      lv_show_blart = abap_true.
    ENDAT.         " 伝票タイプ
    AT NEW budat. lv_show_budat = abap_true. ENDAT.  " 転記日付
    AT NEW bldat. lv_show_bldat = abap_true. ENDAT.  " 伝票日付
    AT NEW belnr. lv_show_belnr = abap_true. ENDAT.  " 伝票番号
    AT NEW usnam. lv_show_usnam = abap_true. ENDAT.  " ユーザ`}
              />
              <InfoPanel title="前半の3ステップと理由" variant="breakdown">
                <ul>
                  <li>
                    <strong>(1) 振り分け</strong> … 演習②と同じ。毎行 <code>CLEAR</code> してから <code>shkzg</code> で借方／貸方へ。
                  </li>
                  <li>
                    <strong>(2) リセット</strong> … 毎行リセットしないと、前の行の見出し値や旗が残ってしまう。
                  </li>
                  <li>
                    <strong>(3) 旗立て</strong> … <code>AT NEW</code> を5つ並べ、変わり目の項目だけ旗を立てる。
                    <code>AT NEW blart</code> では <code>NEW-PAGE</code> も入れて伝票タイプごとに改ページ（B-①）。
                    中では値を読まない（A-③の <code>*</code> 埋め回避）。
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="note">
                A パートの <code>AT NEW usnam</code> / <code>lv_show_usnam</code> と<strong>同じ型</strong>を、
                <code>blart</code> / <code>budat</code> / <code>bldat</code> / <code>belnr</code> に項目ごとに足しています。
              </Callout>
              <Dialog speaker="b">
                (2) のリセットを忘れたら、前の行の見出しがずっと残っちゃいそうですね。
              </Dialog>
              <Dialog speaker="a">
                <code>AT NEW</code> を5つ並べるだけで「上位が変われば下位も」になるのが効いてますね（C-③）。
              </Dialog>
              <Dialog speaker="teacher">
                並び順（C-②・C-③）が効くのはここです。
                <br />
                旗は<strong>立てるだけ</strong>、値は後半でまとめて入れます。
              </Dialog>
            </>
          ),
        },
        {
          title: "C-⑥ 出力ループ後半（改ページ・値セット・出力）",
          plainText:
            "C-⑥ END-OF-SELECTIONのLOOP後半。(4)RESERVE 1 LINESで先に改ページを起こし、sy-pagno≠gv_pagenoなら旗を全部立てる（B-②）。(5)旗が立った項目だけ値をセット、日付はWRITE…TO…USING EDIT MASKで文字に整形（C-②・C-⑥）。(6)WRITEで出力（見出し列はlv_*、明細列はgs_out）。(7)gv_pageno=sy-pagnoで今行のページ番号を控える。\n順番が命：RESERVE→判定→値セット→WRITE→gv_pageno。",
          content: (
            <>
              <h2>C-⑥ 出力ループ後半（改ページ・値セット・出力）</h2>
              <CodeBlock
                language="ABAP"
                code={`*   (4) 改ページしたら見出しを全部出し直す（B-②）
    RESERVE 1 LINES.
    IF sy-pagno <> gv_pageno.
      lv_show_blart = abap_true.
      lv_show_budat = abap_true.
      lv_show_bldat = abap_true.
      lv_show_belnr = abap_true.
      lv_show_usnam = abap_true.
    ENDIF.

*   (5) 旗が立った項目だけ値をセット（日付は文字へ整形 → C-②）
    IF lv_show_blart = abap_true.
      lv_blart     = gs_out-blart.      " 伝票タイプ
      lv_blart_txt = gs_out-blart_txt.  " 伝票タイプ名
    ENDIF.
    IF lv_show_budat = abap_true.
      WRITE gs_out-budat TO lv_budat_c USING EDIT MASK '____/__/__'.  " 転記日付
    ENDIF.
    IF lv_show_bldat = abap_true.
      WRITE gs_out-bldat TO lv_bldat_c USING EDIT MASK '____/__/__'.  " 伝票日付
    ENDIF.
    IF lv_show_belnr = abap_true.
      lv_belnr = gs_out-belnr.          " 伝票番号
    ENDIF.
    IF lv_show_usnam = abap_true.
      lv_usnam = gs_out-usnam.          " ユーザ
    ENDIF.

*   (6) 出力（見出し列は lv_*、明細列は gs_out をそのまま）
    WRITE: /1 lv_blart, 4 lv_blart_txt, 18 lv_budat_c, 30 lv_bldat_c,
            42 lv_belnr, 54 lv_usnam,
            68 gs_out-buzei, 73 gs_out-hkont, 85 gs_out-hkont_txt,
            106(14) gv_debit  CURRENCY gs_out-waers RIGHT-JUSTIFIED,  " 借方金額
            122(14) gv_credit CURRENCY gs_out-waers RIGHT-JUSTIFIED, " 貸方金額
            139 gs_out-sgtxt.                                           " 摘要

*   (7) 今行のページ番号を控える（次行の比較用）
    gv_pageno = sy-pagno.
  ENDLOOP.`}
              />
              <InfoPanel title="後半の4ステップと理由" variant="breakdown">
                <ul>
                  <li>
                    <strong>(4) 改ページ判定</strong> … <code>RESERVE</code> で先に改ページを起こし、
                    <code>sy-pagno ≠ gv_pageno</code> なら旗を全部立てる（B-②）。
                  </li>
                  <li>
                    <strong>(5) 値セット</strong> … 旗が立った項目だけ値を入れる。日付は{" "}
                    <code>WRITE … TO … USING EDIT MASK</code> で文字に整形（C-②）。
                  </li>
                  <li>
                    <strong>(6) 出力</strong> … 見出し列は <code>lv_*</code>、明細列は <code>gs_out</code> をそのまま。
                  </li>
                  <li>
                    <strong>(7) ページ番号の保持</strong> … 今行の <code>sy-pagno</code> を控え、次行の比較に使う。
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="warning">
                <strong>順番が命</strong>です。<code>RESERVE</code> → 判定 → 値セット → <code>WRITE</code> →{" "}
                <code>gv_pageno</code> 保持 の順を崩さないでください（B-②・B-③・B-④）。
              </Callout>
              <BreakPointCheck
                insert={`    IF sy-pagno <> gv_pageno.
      lv_show_blart = abap_true.
      " ... 残りの旗も abap_true ...
    ENDIF.
    BREAK-POINT.        " ★値セットの直前で確認`}
                ask={
                  <>
                    同じ伝票の2行目で <code>lv_show_*</code> がすべて空（旗なし）で、
                    伝票が変わった行では <code>blart</code>〜<code>usnam</code> の旗が立っていますか？
                  </>
                }
                reveal={
                  <ul>
                    <li>
                      伝票の<strong>先頭行</strong> … <code>lv_show_blart</code>〜<code>usnam</code> が{" "}
                      <code>abap_true</code> → 見出しを出力
                    </li>
                    <li>
                      同じ伝票の<strong>2行目</strong> … すべて空 → <code>lv_*</code> が空欄のまま → 帳票でも空欄
                    </li>
                    <li>
                      <strong>改ページ直後</strong> … <code>sy-pagno</code> が進み全部 <code>abap_true</code> → 見出しを再表示
                    </li>
                  </ul>
                }
              />
              <Dialog speaker="b">
                デバッガで旗の立ち方を見ると、After の帳票がなぜああなるか腑に落ちます。
              </Dialog>
              <Dialog speaker="teacher">
                旗 → 値 → 出力の流れを目で確認できれば完璧です。
                <br />
                最後に全文を通して読みましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "C-⑦ Cパート完成コード（全文）",
          plainText:
            "C-⑦ Cパート完成コード全文 create_report_3。A（usnamサプレス）＋B（改ページ）＋C（全見出し列のサプレス・日付文字化）を統合した最終版。部品の意味（C-①〜C-⑥）を踏まえ全文を通読。Revealで開く。TEXT-001等はSE38で登録。",
          content: (
            <>
              <h2>C-⑦ Cパート完成コード（全文）</h2>
              <p>
                A（ユーザ列サプレス）・B（改ページ）・C（全見出し列のサプレスと日付整形）を
                <strong>1本に統合</strong>した最終プログラム <code>create_report_3</code> です。
                部品ごとの意味は C-①〜C-⑥ で確認済みなので、ここでは<strong>全文を通して</strong>
                上から下への流れ（宣言 → 抽出 → <code>SORT</code> → <code>TOP-OF-PAGE</code> →{" "}
                <code>END-OF-SELECTION</code> の変わり目処理）を確認します。
              </p>
              <Callout variant="note">
                列見出しの <code>TEXT-001</code>〜<code>TEXT-010</code> は、SE38 の <strong>Text elements</strong> に登録してから実行します
                （登録手順と文言は演習②の「テキストエレメント」スライドを参照）。
              </Callout>
              <InfoPanel title="演習②から増えた箇所だけ拾うと" variant="breakdown">
                <ul>
                  <li>
                    <code>g_typ_out</code> の項目順：<code>budat / bldat</code> を <code>belnr</code> より前へ
                  </li>
                  <li>
                    出力用の作業領域とフラグ：<code>lv_blart … lv_usnam</code>、<code>lv_show_*</code>、<code>gv_pageno</code>
                  </li>
                  <li>
                    <code>SORT gt_out BY blart budat bldat belnr usnam buzei</code>（構造体の並びと一致）
                  </li>
                  <li>
                    <code>END-OF-SELECTION</code> の中：<code>AT NEW blart</code> で <code>NEW-PAGE</code> ＋ <code>AT NEW</code> ×5 ＋{" "}
                    <code>RESERVE</code> ＋ 改ページ再表示 ＋ フラグ判定で値セット
                  </li>
                </ul>
              </InfoPanel>
              <p>
                SE38 に貼り付けて動かす前に、C-②〜C-⑥ で追った部分と見比べると理解が深まります。
                いきなり全文を暗記する必要はありません。
              </p>
              <Reveal label="Cパート完成コード（全体）を見る">
                <CodeBlock language="ABAP" code={FINAL_PROGRAM} />
              </Reveal>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "理解度チェック",
          plainText:
            "理解度チェック\nQ1 g_typ_outでbudat/bldatをbelnrより前へ移した狙い→ AT NEWはその項目＋左の項目の変化で発火するため、構造体の並び順＝サプレスの階層になるから\nQ2 AT NEWの中で値を読まずフラグだけ立てる理由→ 内側では制御項目より右の作業領域が'*'で埋まる仕様があり誤った値を読む恐れがあるから\nQ3 RESERVE 1 LINESをWRITEの前に置く理由→ 先に改ページを起こしてsy-pagnoを確定させ、見出し再表示の判定を正しくするため",
          content: (
            <>
              <h2>理解度チェック</h2>
              <p>
                演習③の要点を3問で確認します。迷ったら C パートの該当スライド（C-②・C-⑤・C-⑥）や B パート（改ページ）、第9章に戻って復習してください。
              </p>
              <LessonQuiz
                answer={1}
                question={
                  <strong>
                    <code>g_typ_out</code> で <code>budat / bldat</code> を <code>belnr</code> より前に移動した狙いは？
                  </strong>
                }
                options={[
                  "SELECT の取得が速くなるから",
                  "AT NEW は『その項目＋左の項目』の変化で発火するため、構造体の並び順＝サプレスの階層になるから",
                  "WRITE の列番号を変えなくて済むから",
                ]}
                explanation="AT NEW f は f か左側の項目が変わると発火します。構造体（と SORT）の並び順がそのまま『上位→下位』の階層になるため、見出しに出したい順（blart→budat→bldat→belnr→usnam）へ並べ替えます。これで上位が変われば下位も自動で再表示されます。"
              />
              <LessonQuiz
                answer={2}
                question={
                  <strong>
                    <code>AT NEW … ENDAT</code> の中で値を読まず、フラグだけ立てる主な理由は？
                  </strong>
                }
                options={[
                  "ABAP では AT NEW の中で代入ができないから",
                  "フラグの方がメモリを使わないから",
                  "AT NEW の内側では制御項目より右の作業領域が '*' で埋まる仕様があり、誤った値を読む恐れがあるから",
                ]}
                explanation="AT NEW … ENDAT の内側では、制御項目より右側のフィールドが '*'（数値はゼロ）で埋められます。そのため中で gs_out の値を読むのは危険で、『中では旗だけ・値は ENDAT の外で』が定石です。"
              />
              <LessonQuiz
                answer={0}
                question={
                  <strong>
                    改ページ対応で <code>RESERVE 1 LINES.</code> を <code>WRITE</code> の前に置くのはなぜ？
                  </strong>
                }
                options={[
                  "先に改ページを起こして sy-pagno を確定させ、見出し再表示の判定を正しくするため",
                  "1行ぶんのメモリを確保するため",
                  "ULINE を自動で引くため",
                ]}
                explanation="RESERVE は『あと n 行入るか』を判定し、入らなければその場で改ページします。WRITE の前に置くことで sy-pagno が先に進み、gv_pageno との比較で『ページが変わった→見出しを出し直す』を1行ずれずに判定できます。"
              />
              <Dialog speaker="closing">
                お疲れさまでした。演習③で足したのは「変わり目だけ見出しを出す」サプレスと、その<strong>改ページ対応</strong>だけ。
                <br />
                新しい命令ではなく、第9章の <code>AT NEW</code>・サプレスと、演習②の帳票を<strong>組み合わせた</strong>ものでした。
                <br />
                迷ったら「構造体の並び＝SORT＝見出しの左右」と「中では旗・値は外」を思い出してください。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ExerciseJournalLedgerControlBreakLesson);
