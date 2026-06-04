export const partAFinalProgram = `REPORT create_report_3
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

TYPES: BEGIN OF g_typ_out,
         bukrs     TYPE bkpf-bukrs,
         blart     TYPE bkpf-blart,
         blart_txt TYPE t003t-ltext,
         budat     TYPE bkpf-budat,
         bldat     TYPE bkpf-bldat,
         belnr     TYPE bkpf-belnr,
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
* DATA（グローバル変数）
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

DATA: g_wrk_budat  TYPE bkpf-budat,
      g_start_date TYPE bkpf-budat,
      g_end_date   TYPE bkpf-budat,
      g_hkont_txt  TYPE skat-txt20.

DATA: gv_debit  TYPE bseg-dmbtr,
      gv_credit TYPE bseg-dmbtr.

DATA: gv_pageno TYPE sy-pagno.

*---------------------------------------------------------------------*
* CONSTANTS
*---------------------------------------------------------------------*
CONSTANTS: c_spras   TYPE t003t-spras VALUE 'J',
           c_shkzg_s TYPE bseg-shkzg  VALUE 'S',
           c_shkzg_h TYPE bseg-shkzg  VALUE 'H'.

*---------------------------------------------------------------------*
* PARAMETER
*---------------------------------------------------------------------*
PARAMETERS: p_bukrs TYPE t001-bukrs OBLIGATORY.
SELECT-OPTIONS: s_budat FOR g_wrk_budat OBLIGATORY.

*=====================================================================*
* イベント
*=====================================================================*

*---------------------------------------------------------------------*
* START-OF-SELECTION
*---------------------------------------------------------------------*
START-OF-SELECTION.

  PERFORM f_init_main.      " Ⅰ データ初期化
  PERFORM f_get_data.       " Ⅱ データ抽出

*---------------------------------------------------------------------*
* TOP-OF-PAGE
*---------------------------------------------------------------------*
TOP-OF-PAGE.

  PERFORM f_write_head.     " ヘッダー出力

*---------------------------------------------------------------------*
* END-OF-SELECTION
*---------------------------------------------------------------------*
END-OF-SELECTION.

  PERFORM f_write_list.     " Ⅲ データ出力

*=====================================================================*
* サブルーチン定義
*=====================================================================*

*&--------------------------------------------------------------------*
*& Form F_INIT_MAIN
*&--------------------------------------------------------------------*
*  データ初期化
*---------------------------------------------------------------------*
FORM f_init_main.

* 作業領域・内部テーブルの初期化
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

* 選択条件の日付表示用
  READ TABLE s_budat INDEX 1.
  IF sy-subrc = 0.
    g_start_date = s_budat-low.
    g_end_date   = s_budat-high.
  ENDIF.

ENDFORM.                    " F_INIT_MAIN

*&--------------------------------------------------------------------*
*& Form F_GET_DATA
*&--------------------------------------------------------------------*
*  データ抽出（メイン）
*---------------------------------------------------------------------*
FORM f_get_data.

* (1) 会社コードマスタ情報の取得（勘定科目表・通貨）
  PERFORM f_get_ktopl.

* (2) 全伝票タイプテキストの取得
  PERFORM f_get_blart_text.

* (3) 会計伝票ヘッダ＋明細情報の取得 → 出力用内部テーブルへの格納
  PERFORM f_get_bkpf_and_bseg.

ENDFORM.                    " F_GET_DATA

*&--------------------------------------------------------------------*
*& Form F_GET_KTOPL
*&--------------------------------------------------------------------*
*  会社コードマスタ情報の取得（T001）
*---------------------------------------------------------------------*
FORM f_get_ktopl.

  SELECT SINGLE ktopl
                waers
    INTO CORRESPONDING FIELDS OF gs_t001
    FROM t001
    WHERE bukrs = p_bukrs.

ENDFORM.                    " F_GET_KTOPL

*&--------------------------------------------------------------------*
*& Form F_GET_BLART_TEXT
*&--------------------------------------------------------------------*
*  全伝票タイプテキストの取得（T003T）
*---------------------------------------------------------------------*
FORM f_get_blart_text.

  SELECT blart
         ltext
    INTO TABLE gt_t003t
    FROM t003t
    WHERE spras = c_spras.

ENDFORM.                    " F_GET_BLART_TEXT

*&--------------------------------------------------------------------*
*& Form F_GET_BKPF_AND_BSEG
*&--------------------------------------------------------------------*
*  会計伝票ヘッダ・明細の取得 → 帳票出力用内部テーブルへの格納
*---------------------------------------------------------------------*
FORM f_get_bkpf_and_bseg.

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
      gs_out-hkont_txt = g_hkont_txt.
      gs_out-shkzg     = gs_bseg-shkzg.
      gs_out-dmbtr     = gs_bseg-dmbtr.
      gs_out-sgtxt     = gs_bseg-sgtxt.
      gs_out-waers     = gs_t001-waers.

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

ENDFORM.                    " F_GET_BKPF_AND_BSEG

*&--------------------------------------------------------------------*
*& Form F_WRITE_LIST
*&--------------------------------------------------------------------*
*  データ出力（メイン）
*---------------------------------------------------------------------*
FORM f_write_list.

* (1) ソート処理
  PERFORM f_proc_sort.

* (2) 明細出力処理
  PERFORM f_proc_write.

ENDFORM.                    " F_WRITE_LIST

*&--------------------------------------------------------------------*
*& Form F_PROC_SORT
*&--------------------------------------------------------------------*
*  ソート処理
*---------------------------------------------------------------------*
FORM f_proc_sort.

  SORT gt_out BY blart budat bldat belnr usnam buzei.

ENDFORM.                    " F_PROC_SORT

*&--------------------------------------------------------------------*
*& Form F_PROC_WRITE
*&--------------------------------------------------------------------*
*  明細出力処理（LOOP + サプレス）
*---------------------------------------------------------------------*
FORM f_proc_write.

* ローカル変数
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

*   借方・貸方判定
    CLEAR: gv_debit, gv_credit.
    IF gs_out-shkzg = c_shkzg_s.
      gv_debit = gs_out-dmbtr.
    ELSEIF gs_out-shkzg = c_shkzg_h.
      gv_credit = gs_out-dmbtr.
    ENDIF.

*   作業領域・表示フラグの初期化
    CLEAR: lv_blart, lv_blart_txt,
           lv_budat_c, lv_bldat_c,
           lv_belnr, lv_usnam,
           lv_show_blart, lv_show_budat,
           lv_show_bldat, lv_show_belnr,
           lv_show_usnam.

*   コントロールレベル判定
    AT NEW blart.
      NEW-PAGE.
      lv_show_blart = abap_true.
    ENDAT.
    AT NEW budat.
      lv_show_budat = abap_true.
    ENDAT.
    AT NEW bldat.
      lv_show_bldat = abap_true.
    ENDAT.
    AT NEW belnr.
      lv_show_belnr = abap_true.
    ENDAT.
    AT NEW usnam.
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

*   表示値の設定
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
    WRITE: /1   lv_blart,
            4   lv_blart_txt,
            18  lv_budat_c,
            30  lv_bldat_c,
            42  lv_belnr,
            54  lv_usnam,
            68  gs_out-buzei,
            73  gs_out-hkont,
            85  gs_out-hkont_txt,
            106(14) gv_debit  CURRENCY gs_out-waers RIGHT-JUSTIFIED,
            122(14) gv_credit CURRENCY gs_out-waers RIGHT-JUSTIFIED,
            139 gs_out-sgtxt.

*   ページ番号の保持
    gv_pageno = sy-pagno.

  ENDLOOP.

ENDFORM.                    " F_PROC_WRITE

*&--------------------------------------------------------------------*
*& Form F_WRITE_HEAD
*&--------------------------------------------------------------------*
*  ヘッダー出力（TOP-OF-PAGE から呼び出し）
*---------------------------------------------------------------------*
FORM f_write_head.

  WRITE: /1   'PGMID:' NO-GAP,
          9   sy-cprog,
          155 'DATE:' NO-GAP,
          160(9) sy-datum USING EDIT MASK '____/__/__' RIGHT-JUSTIFIED,
         /1   'USER:' NO-GAP,
          9   sy-uname,
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

  WRITE: /1   TEXT-001,
          18  TEXT-002,
          30  TEXT-003,
          42  TEXT-004,
          54  TEXT-005,
          68  TEXT-006,
          73  TEXT-007,
          106(14) TEXT-008 RIGHT-JUSTIFIED,
          122(14) TEXT-009 RIGHT-JUSTIFIED,
          139 TEXT-010.

  ULINE.

ENDFORM.                    " F_WRITE_HEAD`;
