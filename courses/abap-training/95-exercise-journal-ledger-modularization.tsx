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
import { partAFinalProgram } from "./journal-ledger-part-a-program";

export const lessonMeta = {
  title: "特別演習④ Part A — プログラムの構造化（FORM/PERFORM）",
  meta: "特別 · 45分",
};

/**
 * 出発点：演習③（特別演習③）の完成コード create_report_3。
 * 学習者はこれをコピーして、Aパートでこのコードを FORM 構造へリファクタリングする。
 * （94-exercise-journal-ledger-control-break.tsx の FINAL_PROGRAM と同一）
 */
const START_PROGRAM = `REPORT create_report_3
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


DATA: lv_blart     TYPE bkpf-blart,    " 伝票タイプ（表示用）
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

/** Part A 完成形（journal-ledger-part-a-program.ts と同一） */
const STRUCTURED_PROGRAM = partAFinalProgram;

export { partAFinalProgram };

function ReferenceLinks() {
  return (
    <div className="mt-4 flex flex-wrap justify-end gap-2">
      <LessonLinkButton
        courseSlug="abap-training"
        lessonFile="94-exercise-journal-ledger-control-break"
        slide={20}
        label="演習③: 完成コード（出発点）"
        variant="back"
      />
      <LessonLinkButton
        courseSlug="abap-training"
        lessonFile="10-modularization"
        slide={3}
        label="第10章: FORM/PERFORM"
        variant="back"
      />
      <LessonLinkButton
        courseSlug="abap-training"
        lessonFile="10-modularization"
        slide={6}
        label="第10章: 変数のスコープ"
        variant="back"
      />
    </div>
  );
}

export default function ExerciseJournalLedgerModularizationLesson() {
  return (
    <Lesson
      chrome={lessonChrome(
        "abap-training",
        "95-exercise-journal-ledger-modularization",
        lessonMeta.title
      )}
      slides={[
        {
          title: "概要（Part A：プログラムの構造化）",
          plainText:
            "特別演習④ Part A — プログラムの構造化（FORM/PERFORM）\n演習③の完成コード create_report_3 を出発点に、処理を FORM に切り出して読みやすく直す（リファクタリング）。動きは1ミリも変えない。\nまず create_report_3 をコピーして SE38 に貼り、そこから構造化を始める。第10章 FORM/PERFORM・スコープが前提。",
          content: (
            <>
              <hgroup>
                <h1>特別演習④ Part A — プログラムの構造化</h1>
                <p>
                  演習③で完成した <code>create_report_3</code> を出発点に、
                  処理を <strong>FORM</strong> へ切り出して読みやすく整えます（リファクタリング）。
                  <strong>動き（出力）は1ミリも変えません。</strong>
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "45分" },
                  { icon: "📶", text: "特別演習" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <Callout variant="note">
                <strong>特別演習④は複数パートに分かれています。</strong>
                この <strong>Part A</strong> のテーマは「<strong>プログラムの構造化</strong>」です。
                Part B 以降（GUIステータス・ボタン設定、Part D のダウンロード処理など）は、この構造化が土台になります。
              </Callout>
              <h3>このパートでやること</h3>
              <ul>
                <li>
                  演習③の完成コード <code>create_report_3</code> を<strong>コピーして出発点</strong>にする（A-①）
                </li>
                <li>
                  「データ抽出」「データ出力」をイベントから <code>FORM</code> へ切り出す（A-③〜A-⑥）
                </li>
                <li>
                  出力ループだけで使う <code>lv_*</code> を <code>FORM</code> 内の<strong>ローカル変数</strong>へ移す（A-⑦）
                </li>
              </ul>
              <Callout variant="tip">
                <strong>重複説明はしません。</strong>
                <code>FORM</code> / <code>PERFORM</code> と変数の<strong>スコープ</strong>（グローバル／ローカル）は
                <strong>第10章</strong>で学んだ前提です。帳票の中身（型・取得・サプレス・改ページ）は
                <strong>演習③</strong>で完成済みです。必要に応じて下のボタンから参照してください。
              </Callout>
              <ReferenceLinks />
              <Dialog speaker="teacher">
                演習③までで「動く帳票プログラム」は完成しました。今回は<strong>機能は足しません</strong>。
                <br />
                同じ動きのまま、<strong>後から読みやすく・直しやすく</strong>するのが目的です。これを「リファクタリング」と呼びます。
              </Dialog>
              <Dialog speaker="b">
                <code>create_report_3</code>、上から下まで一本道で長かったです…。どこに何があるか探すのが大変でした。
              </Dialog>
              <Dialog speaker="a">
                第10章でやった <code>FORM</code> と <code>PERFORM</code> を、実際の帳票プログラムに当てはめる回ですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。新しい呪文は増えません。<strong>既に知っている部品の組み合わせ</strong>です。
                <br />
                まずは出発点のコードをコピーするところから始めましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "A-① 出発点：演習③の完成コードをコピー",
          plainText:
            "A-① 出発点。ここに貼ってある create_report_3 は演習③の完成コードそのもの。これをコピーして SE38 に貼り、出発点にする。\n以降のスライドでは、このコードを上から FORM に切り出していく。動き（出力結果）は最後まで変えない。",
          content: (
            <>
              <h2>A-① ここからコピーして始めてください</h2>
              <p>
                下のコードは<strong>演習③の完成コード</strong> <code>create_report_3</code> そのものです。
                これを<strong>そのままコピー</strong>して SE38 に貼り付け、<strong>このパートの出発点</strong>にしてください。
                以降のスライドでは、このコードを上から順に <code>FORM</code> へ切り出していきます。
              </p>
              <Callout variant="tip">
                <strong>コピーして始める：</strong>下の「出発点コード（全体）を見る」を開き、全文を SE38 の新規プログラム
                <code> create_report_3</code> に貼り付けてから、A-② 以降を読み進めてください。
              </Callout>
              <Reveal label="出発点コード（演習③完成版）を見る">
                <CodeBlock language="ABAP" code={START_PROGRAM} />
              </Reveal>
              <Dialog speaker="b">
                これ、演習③で動かしたコードと同じものですね。安心しました。
              </Dialog>
              <Dialog speaker="teacher">
                そうです。<strong>動くコードを出発点</strong>にするのがリファクタリングの基本です。
                <br />
                壊さずに形だけ整える——だから「動きは変えない」が合言葉になります。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "A-② なぜ構造化するのか（Before / After）",
          plainText:
            "A-② なぜ構造化するのか。Before：START-OF-SELECTION の中に初期化・抽出・出力が一本道で続き、長くて読みにくい。\nAfter：処理のかたまりごとに FORM へ切り出し、イベントは PERFORM を並べるだけ。読みやすい・直しやすい・再利用できる。\n出力結果は完全に同じ。変えるのは構造だけ。",
          content: (
            <>
              <h2>A-② なぜ構造化するのか</h2>
              <p>
                出発点の <code>create_report_3</code> は、<code>START-OF-SELECTION</code> の中に
                「初期化 → 取得 → 結合 → ソート」が<strong>一本道</strong>でずらりと続きます。
                動きは正しくても、<strong>どこに何があるか</strong>を探すのが大変です。
              </p>
              <div className="not-prose my-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-rose-300 bg-rose-50 p-4 dark:border-rose-700 dark:bg-rose-950/40">
                  <p className="mb-2 text-sm font-semibold text-rose-700 dark:text-rose-300">
                    ❌ Before（演習③）— 一本道
                  </p>
                  <pre className="overflow-x-auto font-mono text-[11px] leading-5 text-slate-800 dark:text-slate-100">{`START-OF-SELECTION.
  CLEAR: ...           " 初期化
  REFRESH: ...
  READ TABLE s_budat ...
  SELECT SINGLE ...    " T001
  SELECT ... t003t
  SELECT ... bkpf
  LOOP AT gt_bkpf ...  " 結合
    SELECT ... bseg
    LOOP AT gt_bseg ...
      SELECT SINGLE ... skat
      ...
    ENDLOOP.
  ENDLOOP.
  SORT gt_out ...      " 並べ替え`}</pre>
                </div>
                <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-700 dark:bg-emerald-950/40">
                  <p className="mb-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    ✅ After（Part A）— FORM に分割
                  </p>
                  <pre className="overflow-x-auto font-mono text-[11px] leading-5 text-slate-800 dark:text-slate-100">{`START-OF-SELECTION.
  PERFORM f_init_main.   " Ⅰ 初期化
  PERFORM f_get_data.    " Ⅱ 抽出

TOP-OF-PAGE.
  PERFORM f_write_head.  " ヘッダー

END-OF-SELECTION.
  PERFORM f_write_list.  " Ⅲ 出力

" 詳細は FORM 定義側へ`}</pre>
                </div>
              </div>
              <InfoPanel title="構造化で得られる3つの良いこと（第10章）" variant="reference">
                <ul>
                  <li>
                    <strong>読みやすい</strong> … イベントは <code>PERFORM</code> の並びになり、「何をする処理か」が名前で分かる
                  </li>
                  <li>
                    <strong>直しやすい</strong> … 直す箇所がその <code>FORM</code> に閉じる（影響範囲が狭い）
                  </li>
                  <li>
                    <strong>育てやすい</strong> … Part B（GUIボタン）や Part D（ダウンロード）を足すとき、<code>FORM</code> を追加しやすい
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="note">
                <strong>出力結果は完全に同じです。</strong>変えるのは<strong>構造（並べ方）</strong>だけ。
                リファクタリングの前後で帳票が変わってはいけません。
              </Callout>
              <Dialog speaker="a">
                イベントの中身が <code>PERFORM</code> の一覧になるんですね。目次みたいで分かりやすい。
              </Dialog>
              <Dialog speaker="teacher">
                まさに目次です。全体像をその「目次」で先に掴みましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "A-③ 構造の全体像（FORM ツリー）",
          plainText:
            "A-③ 構造の全体像。START-OF-SELECTION→f_init_main（初期化）/ f_get_data（抽出）。f_get_data の中で f_get_ktopl（T001）/ f_get_blart_text（T003T）/ f_get_bkpf_and_bseg（BKPF/BSEG→gt_out）。\nTOP-OF-PAGE→f_write_head（ヘッダー）。END-OF-SELECTION→f_write_list（出力）。f_write_list の中で f_proc_sort（ソート）/ f_proc_write（明細出力・サプレス）。\nイベントは PERFORM を呼ぶだけ、実処理は FORM に集める。",
          content: (
            <>
              <h2>A-③ 構造の全体像（どの FORM が何をするか）</h2>
              <p>
                Part A で作る構造の全体像です。<strong>イベント</strong>（<code>START-OF-SELECTION</code> など）は
                <code>PERFORM</code> を呼ぶだけにし、<strong>実際の処理</strong>は <code>FORM</code> に集めます。
              </p>
              <MermaidDiagram
                chart={`flowchart TD
  SOS["START-OF-SELECTION"] --> INIT["PERFORM f_init_main（Ⅰ 初期化）"]
  SOS --> GET["PERFORM f_get_data（Ⅱ 抽出）"]
  GET --> KTOPL["f_get_ktopl（T001 取得）"]
  GET --> BLART["f_get_blart_text（T003T 取得）"]
  GET --> BKPF["f_get_bkpf_and_bseg（BKPF/BSEG → gt_out）"]

  TOP["TOP-OF-PAGE"] --> HEAD["PERFORM f_write_head（ヘッダー）"]

  EOS["END-OF-SELECTION"] --> LIST["PERFORM f_write_list（Ⅲ 出力）"]
  LIST --> SORT["f_proc_sort（ソート）"]
  LIST --> WRITE["f_proc_write（明細出力・サプレス）"]`}
              />
              <InfoPanel title="FORM の役割一覧" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>FORM</th>
                      <th>役割</th>
                      <th>呼び出し元</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>f_init_main</code></td>
                      <td>作業領域・内部テーブルの初期化、日付の控え</td>
                      <td><code>START-OF-SELECTION</code></td>
                    </tr>
                    <tr>
                      <td><code>f_get_data</code></td>
                      <td>抽出のまとめ役（下の3つを順に呼ぶ）</td>
                      <td><code>START-OF-SELECTION</code></td>
                    </tr>
                    <tr>
                      <td><code>f_get_ktopl</code></td>
                      <td>会社コードマスタ（T001）の取得</td>
                      <td><code>f_get_data</code></td>
                    </tr>
                    <tr>
                      <td><code>f_get_blart_text</code></td>
                      <td>伝票タイプテキスト（T003T）の取得</td>
                      <td><code>f_get_data</code></td>
                    </tr>
                    <tr>
                      <td><code>f_get_bkpf_and_bseg</code></td>
                      <td>ヘッダ・明細の取得 → <code>gt_out</code> へ結合</td>
                      <td><code>f_get_data</code></td>
                    </tr>
                    <tr>
                      <td><code>f_write_head</code></td>
                      <td>ページ上部の見出し出力</td>
                      <td><code>TOP-OF-PAGE</code></td>
                    </tr>
                    <tr>
                      <td><code>f_write_list</code></td>
                      <td>出力のまとめ役（ソート＋明細出力）</td>
                      <td><code>END-OF-SELECTION</code></td>
                    </tr>
                    <tr>
                      <td><code>f_proc_sort</code></td>
                      <td><code>gt_out</code> の並べ替え</td>
                      <td><code>f_write_list</code></td>
                    </tr>
                    <tr>
                      <td><code>f_proc_write</code></td>
                      <td>明細出力ループ（サプレス・改ページ）</td>
                      <td><code>f_write_list</code></td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="b">
                <code>f_get_data</code> が「まとめ役」で、その中でさらに細かい <code>FORM</code> を呼ぶんですね。
              </Dialog>
              <Dialog speaker="teacher">
                はい。<strong>まとめ役の FORM</strong> と <strong>実作業の FORM</strong> を分けると、
                上から読むだけで処理の流れが分かります。次はイベント側を組み立てます。
              </Dialog>
            </>
          ),
        },
        {
          title: "A-④ イベントを PERFORM だけにする",
          plainText:
            "A-④ イベントの責務分離。START-OF-SELECTION は PERFORM f_init_main と f_get_data の2行だけ。TOP-OF-PAGE は PERFORM f_write_head。END-OF-SELECTION は PERFORM f_write_list。\n各イベントは「いつ動くか」を表すだけにして、中身は FORM へ追い出す。これでイベントが目次になる。",
          content: (
            <>
              <h2>A-④ イベントを「目次」にする</h2>
              <p>
                まずイベントの中身を空にして、<code>PERFORM</code> を並べるだけにします。
                各イベントは「<strong>いつ動くか</strong>」だけを表し、処理の中身は <code>FORM</code> に追い出します。
              </p>
              <CodeBlock
                language="ABAP"
                code={`START-OF-SELECTION.
  PERFORM f_init_main.      " Ⅰ データ初期化
  PERFORM f_get_data.       " Ⅱ データ抽出

TOP-OF-PAGE.
  PERFORM f_write_head.     " ヘッダー出力

END-OF-SELECTION.
  PERFORM f_write_list.     " Ⅲ データ出力`}
              />
              <InfoPanel title="イベントごとの責務（役割）" variant="breakdown">
                <ul>
                  <li>
                    <code>START-OF-SELECTION</code> … <strong>初期化 → 抽出</strong>（<code>f_init_main</code> → <code>f_get_data</code>）
                  </li>
                  <li>
                    <code>TOP-OF-PAGE</code> … <strong>ページ上部の見出し</strong>（<code>f_write_head</code>）。各ページ先頭で自動的に走る
                  </li>
                  <li>
                    <code>END-OF-SELECTION</code> … <strong>明細の出力</strong>（<code>f_write_list</code>）
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="note">
                <code>FORM</code> の<strong>定義位置</strong>は <code>END-OF-SELECTION</code> などのイベントブロックより
                <strong>後ろ</strong>にまとめて書きます（<code>PERFORM</code> は前方・後方どちらの <code>FORM</code> も呼べます）。
              </Callout>
              <Dialog speaker="a">
                <code>START-OF-SELECTION</code> が2行になりました。何をするプログラムか一目で分かりますね。
              </Dialog>
              <Dialog speaker="teacher">
                これが構造化の効果です。次は、追い出した中身を <code>FORM</code> として書いていきます。
                まずは「抽出」側から。
              </Dialog>
            </>
          ),
        },
        {
          title: "A-⑤ 抽出を FORM に切り出す",
          plainText:
            "A-⑤ 抽出側の FORM。f_init_main に CLEAR/REFRESH と日付の控えを入れる。f_get_data はまとめ役で f_get_ktopl・f_get_blart_text・f_get_bkpf_and_bseg を順に PERFORM。\n各 SELECT はそのまま該当 FORM へ移すだけ（中身は演習③と同じ）。f_get_bkpf_and_bseg に LOOP 結合・SKAT 取得・gt_out への APPEND・データ無し判定を入れる。",
          content: (
            <>
              <h2>A-⑤ 抽出（初期化・取得・結合）を FORM へ</h2>
              <p>
                出発点コードの「Ⅰ データ初期化」「Ⅱ データ抽出」を、対応する <code>FORM</code> に
                <strong>そのまま移します</strong>。中身は演習③と同じで、置き場所を変えるだけです。
              </p>
              <CodeBlock
                language="ABAP"
                code={`FORM f_init_main.
* 作業領域・内部テーブルの初期化（出発点の CLEAR / REFRESH をそのまま）
  CLEAR:   gs_bkpf, gs_bseg, gs_t001, gs_t003t, gs_out,
           g_start_date, g_end_date, g_hkont_txt.
  REFRESH: gt_bkpf, gt_bseg, gt_t003t, gt_out.

* 選択条件の日付表示用
  READ TABLE s_budat INDEX 1.
  IF sy-subrc = 0.
    g_start_date = s_budat-low.
    g_end_date   = s_budat-high.
  ENDIF.
ENDFORM.

FORM f_get_data.
  PERFORM f_get_ktopl.          " (1) T001
  PERFORM f_get_blart_text.     " (2) T003T
  PERFORM f_get_bkpf_and_bseg.  " (3) BKPF/BSEG → gt_out
ENDFORM.`}
              />
              <p>
                <code>f_get_data</code> は<strong>まとめ役</strong>です。実際の <code>SELECT</code> は、
                下の3つの <code>FORM</code> に分けて移します。
              </p>
              <CodeBlock
                language="ABAP"
                code={`FORM f_get_ktopl.              " 会社コードマスタ（勘定科目表・通貨）
  SELECT SINGLE ktopl waers
    INTO CORRESPONDING FIELDS OF gs_t001
    FROM t001 WHERE bukrs = p_bukrs.
ENDFORM.

FORM f_get_blart_text.         " 全伝票タイプテキスト
  SELECT blart ltext
    INTO TABLE gt_t003t
    FROM t003t WHERE spras = c_spras.
ENDFORM.

FORM f_get_bkpf_and_bseg.      " ヘッダ＋明細 → gt_out へ結合
  SELECT ... FROM bkpf WHERE bukrs = p_bukrs AND budat IN s_budat.
  " IF gt_bkpf IS INITIAL → メッセージして LEAVE LIST-PROCESSING
  LOOP AT gt_bkpf INTO gs_bkpf.
    READ TABLE gt_t003t ...      " 伝票タイプ名
    SELECT ... FROM bseg ...     " 伝票ごとの明細
    LOOP AT gt_bseg INTO gs_bseg.
      SELECT SINGLE txt20 ... FROM skat ...   " 勘定名
      " gs_out へ MOVE して APPEND
    ENDLOOP.
  ENDLOOP.
  " IF gt_out IS INITIAL → メッセージして LEAVE LIST-PROCESSING
ENDFORM.`}
              />
              <Callout variant="warning">
                <strong>SORT は抽出には入れません。</strong>出発点では <code>START-OF-SELECTION</code> の末尾にあった
                <code>SORT gt_out</code> は、<strong>出力側</strong>（<code>f_proc_sort</code>）へ移します（A-⑥）。
                並べ替えは「出力の準備」だからです。
              </Callout>
              <Dialog speaker="b">
                <code>SELECT</code> の中身は何も変えず、<code>FORM</code> の<strong>箱に入れ直す</strong>だけなんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通り。だから動きは変わりません。次は出力側を切り出しましょう。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "A-⑥ 出力を FORM に切り出す",
          plainText:
            "A-⑥ 出力側の FORM。f_write_list はまとめ役で f_proc_sort（SORT）と f_proc_write（明細出力ループ）を順に呼ぶ。\nf_proc_sort には START-OF-SELECTION 末尾から移した SORT gt_out BY blart budat bldat belnr usnam buzei を入れる。f_proc_write には END-OF-SELECTION の LOOP（借方貸方判定・AT NEW・改ページ・WRITE）をそのまま移す。\nf_write_head には TOP-OF-PAGE の WRITE 群を移す。",
          content: (
            <>
              <h2>A-⑥ 出力（ソート・明細・ヘッダー）を FORM へ</h2>
              <p>
                出力は<strong>まとめ役</strong> <code>f_write_list</code> の下に、
                <code>f_proc_sort</code>（並べ替え）と <code>f_proc_write</code>（明細出力）を置きます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`FORM f_write_list.
  PERFORM f_proc_sort.    " (1) ソート処理
  PERFORM f_proc_write.   " (2) 明細出力処理
ENDFORM.

FORM f_proc_sort.
* 出発点では START-OF-SELECTION の末尾にあった SORT をここへ移動
  SORT gt_out BY blart budat bldat belnr usnam buzei.
ENDFORM.`}
              />
              <p>
                <code>f_proc_write</code> には、出発点の <code>END-OF-SELECTION</code> の
                <code>LOOP</code>（借方/貸方判定・<code>AT NEW</code>・改ページ・<code>WRITE</code>）を
                <strong>まるごと</strong>移します（サプレス・改ページのロジックは演習③のまま）。
              </p>
              <CodeBlock
                language="ABAP"
                code={`FORM f_proc_write.
  " ▼ 出力ループだけで使う lv_* はここでローカル宣言（A-⑦）
  LOOP AT gt_out INTO gs_out.
    " 借方・貸方判定 → CLEAR → AT NEW ×5 → RESERVE → 改ページ判定
    " → フラグで値セット → WRITE → gv_pageno = sy-pagno
  ENDLOOP.
ENDFORM.

FORM f_write_head.
* 出発点の TOP-OF-PAGE の WRITE 群（PGMID/USER/会社コード/列見出し）をそのまま
  WRITE: /1 'PGMID:' NO-GAP, 9 sy-cprog, ... .
  " ... 会社コード・転記日付 ...
  WRITE: /1 TEXT-001, 18 TEXT-002, ... 139 TEXT-010.
  ULINE.
ENDFORM.`}
              />
              <Callout variant="note">
                <code>f_proc_write</code> の中の<strong>ロジックは演習③と同一</strong>です。
                サプレス（<code>AT NEW</code> ＋フラグ）や改ページ（<code>RESERVE</code> ＋ <code>sy-pagno</code>）の
                考え方は演習③で学習済みなので、ここでは繰り返しません。
              </Callout>
              <Dialog speaker="a">
                <code>SORT</code> が <code>f_proc_sort</code> に移って、「出力の準備」だと役割がはっきりしました。
              </Dialog>
              <Dialog speaker="teacher">
                いいですね。あと1つ、<code>f_proc_write</code> の中だけで使う変数を<strong>ローカル</strong>に整理します。
                これが構造化の仕上げです。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "A-⑦ ローカル変数に整理する（スコープ）",
          plainText:
            "A-⑦ スコープの整理。出発点では lv_blart〜lv_usnam・lv_show_* がプログラム冒頭のグローバル DATA に宣言されていた。これらは f_proc_write の中でしか使わないので、FORM 内の DATA に移してローカル変数にする。\nFORM 内で宣言した変数は、その FORM の中だけで生きてループ終了で消える（第10章）。一方 gt_out・gs_out・gv_pageno・gv_debit/gv_credit は複数 FORM で共有するのでグローバルのまま。",
          content: (
            <>
              <h2>A-⑦ 「その FORM だけで使う変数」はローカルへ</h2>
              <p>
                出発点では、表示用の <code>lv_blart</code>〜<code>lv_usnam</code> や旗 <code>lv_show_*</code> が
                <strong>プログラム冒頭のグローバル <code>DATA</code></strong> に宣言されていました。
                これらは <code>f_proc_write</code> の<strong>中だけ</strong>で使うので、
                <code>FORM</code> 内の <code>DATA</code> に移して<strong>ローカル変数</strong>にします（第10章）。
              </p>
              <CodeBlock
                language="ABAP"
                code={`FORM f_proc_write.

* ▼ この FORM の中だけで使う変数 → ローカル宣言
  DATA: lv_blart     TYPE bkpf-blart,
        lv_blart_txt TYPE t003t-ltext,
        lv_budat_c   TYPE c LENGTH 10,
        lv_bldat_c   TYPE c LENGTH 10,
        lv_belnr     TYPE bkpf-belnr,
        lv_usnam     TYPE bkpf-usnam.

  DATA: lv_show_blart TYPE abap_bool,
        lv_show_budat TYPE abap_bool,
        lv_show_bldat TYPE abap_bool,
        lv_show_belnr TYPE abap_bool,
        lv_show_usnam TYPE abap_bool.

  LOOP AT gt_out INTO gs_out.
    " ... 出力ロジック（演習③と同じ）...
  ENDLOOP.

ENDFORM.`}
              />
              <InfoPanel title="グローバルに残す / ローカルに移す（スコープの判断）" variant="breakdown">
                <ul>
                  <li>
                    <strong>ローカルへ移す</strong> … <code>lv_blart</code>〜<code>lv_usnam</code>、<code>lv_show_*</code>
                    （<code>f_proc_write</code> の中でしか使わない表示用の箱・旗）
                  </li>
                  <li>
                    <strong>グローバルに残す</strong> … <code>gt_out</code> / <code>gs_out</code>（抽出と出力で共有）、
                    <code>gv_pageno</code>（改ページ判定で行をまたいで保持）、<code>gv_debit</code> / <code>gv_credit</code>
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="note">
                <strong>ローカル変数の効果：</strong><code>FORM</code> 内で宣言した変数は、その <code>FORM</code> の中だけで生き、
                処理が終われば消えます。<strong>「どこで使う変数か」が宣言場所で分かる</strong>ので、読み手の負担が減ります。
              </Callout>
              <Callout variant="warning">
                <code>gv_pageno</code> を<strong>ローカルにしてはいけません</strong>。改ページ判定は「直前行のページ番号」を
                <strong>行をまたいで</strong>覚えておく必要があり、<code>FORM</code> を抜けても保持されるグローバルが適切です。
              </Callout>
              <Dialog speaker="b">
                「その <code>FORM</code> でしか使わない」かどうかが、グローバルとローカルの分かれ目なんですね。
              </Dialog>
              <Dialog speaker="a">
                <code>gv_pageno</code> みたいに<strong>行をまたいで覚える</strong>ものはグローバル、と覚えます。
              </Dialog>
              <Dialog speaker="teacher">
                その判断ができれば構造化は卒業です。最後に全文を通して読みましょう。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "A-⑧ Part A 完成コード（全文）",
          plainText:
            "A-⑧ Part A 完成コード全文 create_report_3（構造化版）。イベントは PERFORM のみ、処理は FORM へ分割、lv_* は f_proc_write のローカル変数、SORT は f_proc_sort。出力結果は演習③と同じ。Reveal で全文を開いて出発点コードと見比べる。次は Part B（GUIステータスとボタン設定）。",
          content: (
            <>
              <h2>A-⑧ Part A 完成コード（全文）</h2>
              <p>
                演習③の <code>create_report_3</code> を、特別演習④ Part A「プログラムの構造化」に従って
                <code>FORM</code> 構造へリファクタリングした<strong>完成版</strong>です。
                <strong>出力結果は演習③と完全に同じ</strong>で、変えたのは構造だけです。
              </p>
              <InfoPanel title="出発点から変えた箇所だけ拾うと" variant="breakdown">
                <ul>
                  <li>
                    イベント（<code>START-OF-SELECTION</code> など）は <code>PERFORM</code> の並びだけにした（A-④）
                  </li>
                  <li>
                    抽出を <code>f_init_main</code> / <code>f_get_data</code> →{" "}
                    <code>f_get_ktopl</code> / <code>f_get_blart_text</code> / <code>f_get_bkpf_and_bseg</code> に分割（A-⑤）
                  </li>
                  <li>
                    出力を <code>f_write_list</code> → <code>f_proc_sort</code> / <code>f_proc_write</code>、
                    ヘッダーを <code>f_write_head</code> に分割（A-⑥）
                  </li>
                  <li>
                    <code>SORT</code> を <code>START-OF-SELECTION</code> 末尾から <code>f_proc_sort</code> へ移動（A-⑥）
                  </li>
                  <li>
                    <code>lv_blart</code>〜<code>lv_usnam</code> / <code>lv_show_*</code> を{" "}
                    <code>f_proc_write</code> の<strong>ローカル変数</strong>へ移動（A-⑦）
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="note">
                列見出しの <code>TEXT-001</code>〜<code>TEXT-010</code> は、演習③と同じく SE38 の
                <strong>Text elements</strong> に登録してから実行します。
              </Callout>
              <Reveal label="Part A 完成コード（構造化版・全体）を見る">
                <CodeBlock language="ABAP" code={STRUCTURED_PROGRAM} />
              </Reveal>
              <Callout variant="tip">
                <strong>確認のコツ：</strong>A-① の出発点コードと、この完成版を並べて見比べてください。
                <strong>同じ処理が FORM に移っただけ</strong>だと分かれば成功です。実行して、演習③と
                <strong>同じ帳票</strong>が出ることも確かめましょう。
              </Callout>
              <Dialog speaker="teacher">
                これで Part A（プログラムの構造化）は完了です。
                <br />
                この構造が土台になり、<strong>Part B</strong> 以降で「GUIステータスの追加」や
                「ダウンロード処理」を、新しい <code>FORM</code> として足していきます。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "理解度チェック",
          plainText:
            "理解度チェック\nQ1 リファクタリングで変えてはいけないもの→ プログラムの動き（出力結果）。構造だけ整える\nQ2 lv_blart〜lv_usnam を f_proc_write のローカル変数にできる理由→ その FORM の中だけで使う変数だから。FORM 内宣言は中だけで生きて終了で消える\nQ3 gv_pageno をグローバルのまま残す理由→ 直前行のページ番号を行をまたいで保持する必要があり、FORM を抜けても値を保つグローバルが適切だから",
          content: (
            <>
              <h2>理解度チェック</h2>
              <p>
                Part A の要点を3問で確認します。迷ったら A-②（目的）・A-⑦（スコープ）や第10章に戻って復習してください。
              </p>
              <LessonQuiz
                answer={1}
                question={
                  <strong>
                    今回のリファクタリング（プログラムの構造化）で、<strong>変えてはいけない</strong>ものは？
                  </strong>
                }
                options={[
                  "変数の名前",
                  "プログラムの動き（出力結果）。整えるのは構造だけ",
                  "FORM の数",
                ]}
                explanation="リファクタリングは「動きを変えずに、内部の構造を読みやすく整える」作業です。FORM への分割や変数のスコープは変えますが、実行して出る帳票（出力結果）は演習③と完全に同じでなければなりません。"
              />
              <LessonQuiz
                answer={2}
                question={
                  <strong>
                    <code>lv_blart</code>〜<code>lv_usnam</code> を <code>f_proc_write</code> の
                    <strong>ローカル変数</strong>にできるのはなぜ？
                  </strong>
                }
                options={[
                  "ローカル変数の方が実行が速いから",
                  "グローバルには文字型の変数を置けないから",
                  "これらは f_proc_write の中だけで使う変数で、FORM 内で宣言した変数はその FORM の中だけで生きるから",
                ]}
                explanation="FORM 内で DATA 宣言した変数は、その FORM の中だけで有効（ローカルスコープ）で、処理が終われば消えます。lv_blart〜lv_usnam や lv_show_* は f_proc_write の出力ループでしか使わないため、ローカルに移すと「どこで使う変数か」が明確になります。"
              />
              <LessonQuiz
                answer={0}
                question={
                  <strong>
                    <code>gv_pageno</code> を<strong>グローバルのまま</strong>残すのはなぜ？
                  </strong>
                }
                options={[
                  "直前行のページ番号を行をまたいで保持する必要があり、FORM を抜けても値を保つグローバルが適切だから",
                  "sy-pagno がグローバル変数だから合わせる必要がある",
                  "グローバルにしないとコンパイルエラーになるから",
                ]}
                explanation="改ページ判定は「直前に出力した行のページ番号」と今の sy-pagno を比較します。この控えはループの行をまたいで保持する必要があるため、FORM を抜けても消えないグローバル変数が適切です。ローカルにすると毎回初期化され、判定が成り立ちません。"
              />
              <Dialog speaker="closing">
                お疲れさまでした。Part A で行ったのは「動きはそのまま、構造だけ整える」リファクタリングでした。
                <br />
                新しい命令は使わず、第10章の <code>FORM</code> / <code>PERFORM</code>・スコープと、演習③の完成コードを
                <strong>組み合わせた</strong>だけです。
                <br />
                この土台の上に、Part B で GUI ボタンを表示し、Part D でダウンロード処理を足していきましょう。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ExerciseJournalLedgerModularizationLesson);
