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
  title: "特別演習④ Part B — GUIステータスとExcelダウンロード",
  meta: "特別 · 45分",
};

/**
 * 出発点：Part A の構造化済みコード create_report_3（FORM/PERFORM 版）。
 * Part B では、この構造の上に「ファイルパスの選択画面」「ファイル保存ダイアログ」
 * 「GUIステータス／タイトル」「AT USER-COMMAND」「GUI_DOWNLOAD」を FORM として足す。
 */
const START_PROGRAM = `REPORT create_report_3
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

START-OF-SELECTION.
  PERFORM f_init_main.      " Ⅰ データ初期化
  PERFORM f_get_data.       " Ⅱ データ抽出

TOP-OF-PAGE.
  PERFORM f_write_head.     " ヘッダー出力

END-OF-SELECTION.
  PERFORM f_write_list.     " Ⅲ データ出力

*=====================================================================*
* サブルーチン定義（f_init_main / f_get_data / f_get_ktopl /
*   f_get_blart_text / f_get_bkpf_and_bseg / f_write_list /
*   f_proc_sort / f_proc_write / f_write_head）
* ※ Part A 完成版そのまま。詳細は Part A の完成コードを参照。
*=====================================================================*`;

/**
 * 特別演習④ Part B 完成形：Part A の構造の上に、選択画面のファイルパス・
 * ファイル保存ダイアログ・GUIステータス／タイトル・AT USER-COMMAND・
 * GUI_DOWNLOAD（タブ区切り .xls）を足した完成コード create_report_4。
 */
const FINAL_PROGRAM = `REPORT create_report_4
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

*>>> 追加: ダウンロード用構造（文字型でExcel出力を整形）
TYPES: BEGIN OF g_typ_dl,
         bukrs     TYPE c LENGTH 10,
         blart     TYPE c LENGTH 5,
         blart_txt TYPE c LENGTH 30,
         budat     TYPE c LENGTH 10,
         bldat     TYPE c LENGTH 10,
         belnr     TYPE c LENGTH 10,
         usnam     TYPE c LENGTH 12,
         gjahr     TYPE c LENGTH 4,
         buzei     TYPE c LENGTH 5,
         hkont     TYPE c LENGTH 10,
         hkont_txt TYPE c LENGTH 20,
         shkzg     TYPE c LENGTH 2,
         dmbtr     TYPE c LENGTH 16,
         sgtxt     TYPE c LENGTH 50,
         waers     TYPE c LENGTH 5,
       END OF g_typ_dl.

*>>> 追加: フィールド名構造（Excelヘッダ行用）
TYPES: BEGIN OF g_typ_fname,
         name TYPE c LENGTH 60,
       END OF g_typ_fname.

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

*>>> 追加: 出力ファイルパス
PARAMETERS: p_file TYPE string LOWER CASE.

*=====================================================================*
* イベント
*=====================================================================*

*---------------------------------------------------------------------*
* INITIALIZATION（追加）
*---------------------------------------------------------------------*
INITIALIZATION.

*---------------------------------------------------------------------*
* AT SELECTION-SCREEN ON VALUE-REQUEST（追加: ファイル保存ダイアログ）
*---------------------------------------------------------------------*
AT SELECTION-SCREEN ON VALUE-REQUEST FOR p_file.
  PERFORM f_get_filename.

*---------------------------------------------------------------------*
* START-OF-SELECTION
*---------------------------------------------------------------------*
START-OF-SELECTION.

*>>> 追加: GUIステータス・タイトルの設定
  SET PF-STATUS 'S0010'.
  SET TITLEBAR  'T0010'.

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

*---------------------------------------------------------------------*
* AT USER-COMMAND（追加: ダウンロードボタン処理）
*---------------------------------------------------------------------*
AT USER-COMMAND.
  CASE sy-ucomm.
    WHEN 'DL'.
      PERFORM f_download.
  ENDCASE.

*=====================================================================*
* サブルーチン定義
*=====================================================================*

*&--------------------------------------------------------------------*
*& Form F_INIT_MAIN
*&--------------------------------------------------------------------*
*  データ初期化
*---------------------------------------------------------------------*
FORM f_init_main.

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

  READ TABLE s_budat INDEX 1.
  IF sy-subrc = 0.
    g_start_date = s_budat-low.
    g_end_date   = s_budat-high.
  ENDIF.

ENDFORM.                    " F_INIT_MAIN

*&--------------------------------------------------------------------*
*& Form F_GET_DATA
*&--------------------------------------------------------------------*
FORM f_get_data.

  PERFORM f_get_ktopl.
  PERFORM f_get_blart_text.
  PERFORM f_get_bkpf_and_bseg.

ENDFORM.                    " F_GET_DATA

*&--------------------------------------------------------------------*
*& Form F_GET_KTOPL
*&--------------------------------------------------------------------*
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
FORM f_get_bkpf_and_bseg.

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

  LOOP AT gt_bkpf INTO gs_bkpf.

    READ TABLE gt_t003t INTO gs_t003t
      WITH KEY blart = gs_bkpf-blart.
    IF sy-subrc <> 0.
      CLEAR gs_t003t.
    ENDIF.

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

      CLEAR: gs_bseg,
             gs_out.

    ENDLOOP.

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
FORM f_write_list.

  PERFORM f_proc_sort.
  PERFORM f_proc_write.

ENDFORM.                    " F_WRITE_LIST

*&--------------------------------------------------------------------*
*& Form F_PROC_SORT
*&--------------------------------------------------------------------*
FORM f_proc_sort.

  SORT gt_out BY blart budat bldat belnr usnam buzei.

ENDFORM.                    " F_PROC_SORT

*&--------------------------------------------------------------------*
*& Form F_PROC_WRITE
*&--------------------------------------------------------------------*
FORM f_proc_write.

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

    CLEAR: gv_debit, gv_credit.
    IF gs_out-shkzg = c_shkzg_s.
      gv_debit = gs_out-dmbtr.
    ELSEIF gs_out-shkzg = c_shkzg_h.
      gv_credit = gs_out-dmbtr.
    ENDIF.

    CLEAR: lv_blart, lv_blart_txt,
           lv_budat_c, lv_bldat_c,
           lv_belnr, lv_usnam,
           lv_show_blart, lv_show_budat,
           lv_show_bldat, lv_show_belnr,
           lv_show_usnam.

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

    RESERVE 1 LINES.

    IF sy-pagno <> gv_pageno.
      lv_show_blart = abap_true.
      lv_show_budat = abap_true.
      lv_show_bldat = abap_true.
      lv_show_belnr = abap_true.
      lv_show_usnam = abap_true.
    ENDIF.

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

    gv_pageno = sy-pagno.

  ENDLOOP.

ENDFORM.                    " F_PROC_WRITE

*&--------------------------------------------------------------------*
*& Form F_WRITE_HEAD
*&--------------------------------------------------------------------*
FORM f_write_head.

  WRITE: /1   'PGMID:' NO-GAP,
          9   sy-cprog,
          155 'DATE:' NO-GAP,
          160(9) sy-datum USING EDIT MASK '____/__/__' RIGHT-JUSTIFIED,
         /1   'USER:' NO-GAP,
          9   sy-uname,
          155 'TIME:' NO-GAP,
          160(9) sy-uzeit RIGHT-JUSTIFIED,
         /80(20) '仕訳日記帳 演習4' CENTERED,
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

ENDFORM.                    " F_WRITE_HEAD

*&--------------------------------------------------------------------*
*& Form F_GET_FILENAME（追加: ファイル保存ダイアログ）
*&--------------------------------------------------------------------*
FORM f_get_filename.

  DATA: lv_filename TYPE string,
        lv_path     TYPE string,
        lv_fullpath TYPE string.

  CALL METHOD cl_gui_frontend_services=>file_save_dialog
    EXPORTING
      window_title      = 'ダウンロード先の選択'
      default_extension = 'xls'
      default_file_name = '仕訳日記帳.xls'
    CHANGING
      filename             = lv_filename
      path                 = lv_path
      fullpath             = lv_fullpath
    EXCEPTIONS
      cntl_error           = 1
      error_no_gui         = 2
      not_supported_by_gui = 3
      OTHERS               = 4.

  IF sy-subrc = 0.
    p_file = lv_fullpath.
  ENDIF.

ENDFORM.                    " F_GET_FILENAME

*&--------------------------------------------------------------------*
*& Form F_DOWNLOAD（追加: Excelダウンロード処理）
*&--------------------------------------------------------------------*
FORM f_download.

  DATA: lt_dl    TYPE STANDARD TABLE OF g_typ_dl,
        ls_dl    TYPE g_typ_dl,
        lt_fname TYPE STANDARD TABLE OF g_typ_fname,
        ls_fname TYPE g_typ_fname.

  DATA: lv_budat_c TYPE c LENGTH 10,
        lv_bldat_c TYPE c LENGTH 10,
        lv_dmbtr_c TYPE c LENGTH 16.

* ファイルパスチェック
  IF p_file IS INITIAL.
    MESSAGE s000(z01) WITH '出力ファイルパスを指定してください'.
    RETURN.
  ENDIF.

* ヘッダ行（Excelの列名）の構築
  CLEAR ls_fname.
  ls_fname-name = '会社コード'.         APPEND ls_fname TO lt_fname.
  ls_fname-name = '伝票タイプ'.         APPEND ls_fname TO lt_fname.
  ls_fname-name = '伝票タイプテキスト'. APPEND ls_fname TO lt_fname.
  ls_fname-name = '転記日付'.           APPEND ls_fname TO lt_fname.
  ls_fname-name = '証憑日付'.           APPEND ls_fname TO lt_fname.
  ls_fname-name = '伝票番号'.           APPEND ls_fname TO lt_fname.
  ls_fname-name = 'ユーザ名'.           APPEND ls_fname TO lt_fname.
  ls_fname-name = '会計年度'.           APPEND ls_fname TO lt_fname.
  ls_fname-name = '明細番号'.           APPEND ls_fname TO lt_fname.
  ls_fname-name = '勘定コード'.         APPEND ls_fname TO lt_fname.
  ls_fname-name = '勘定コードテキスト'. APPEND ls_fname TO lt_fname.
  ls_fname-name = '借方/貸方'.          APPEND ls_fname TO lt_fname.
  ls_fname-name = '金額'.               APPEND ls_fname TO lt_fname.
  ls_fname-name = '明細テキスト'.       APPEND ls_fname TO lt_fname.
  ls_fname-name = '通貨'.               APPEND ls_fname TO lt_fname.

* データ行の構築
  LOOP AT gt_out INTO gs_out.

    CLEAR: ls_dl, lv_budat_c, lv_bldat_c, lv_dmbtr_c.

    ls_dl-bukrs     = gs_out-bukrs.
    ls_dl-blart     = gs_out-blart.
    ls_dl-blart_txt = gs_out-blart_txt.

    WRITE gs_out-budat TO lv_budat_c USING EDIT MASK '____/__/__'.
    ls_dl-budat = lv_budat_c.

    WRITE gs_out-bldat TO lv_bldat_c USING EDIT MASK '____/__/__'.
    ls_dl-bldat = lv_bldat_c.

    ls_dl-belnr     = gs_out-belnr.
    ls_dl-usnam     = gs_out-usnam.
    ls_dl-gjahr     = gs_out-gjahr.
    ls_dl-buzei     = gs_out-buzei.
    ls_dl-hkont     = gs_out-hkont.
    ls_dl-hkont_txt = gs_out-hkont_txt.
    ls_dl-shkzg     = gs_out-shkzg.

    WRITE gs_out-dmbtr TO lv_dmbtr_c CURRENCY gs_out-waers.
    CONDENSE lv_dmbtr_c.
    ls_dl-dmbtr = lv_dmbtr_c.

    ls_dl-sgtxt     = gs_out-sgtxt.
    ls_dl-waers     = gs_out-waers.

    APPEND ls_dl TO lt_dl.

  ENDLOOP.

* GUI_DOWNLOAD でExcelファイルとしてダウンロード
  CALL FUNCTION 'GUI_DOWNLOAD'
    EXPORTING
      filename                = p_file
      filetype                = 'DAT'
      write_field_separator   = 'X'
    TABLES
      data_tab                = lt_dl
      fieldnames              = lt_fname
    EXCEPTIONS
      file_write_error        = 1
      no_batch                = 2
      gui_refuse_filetransfer = 3
      invalid_type            = 4
      no_authority            = 5
      unknown_error           = 6
      header_not_allowed      = 7
      separator_not_allowed   = 8
      filesize_not_allowed    = 9
      header_too_long         = 10
      dp_error_create         = 11
      dp_error_send           = 12
      dp_error_write          = 13
      unknown_dp_error        = 14
      access_denied           = 15
      dp_out_of_memory        = 16
      disk_full               = 17
      dp_timeout              = 18
      file_not_found          = 19
      dataprovider_exception  = 20
      control_flush_error     = 21
      OTHERS                  = 22.

  IF sy-subrc = 0.
    MESSAGE s000(z01) WITH 'ダウンロードが完了しました'.
  ELSE.
    MESSAGE s000(z01) WITH 'ダウンロードに失敗しました'.
  ENDIF.

ENDFORM.                    " F_DOWNLOAD`;

function ReferenceLinks() {
  return (
    <div className="mt-4 flex flex-wrap justify-end gap-2">
      <LessonLinkButton
        courseSlug="abap-training"
        lessonFile="95-exercise-journal-ledger-modularization"
        slide={9}
        label="Part A: 構造化の完成コード（出発点）"
        variant="back"
      />
      <LessonLinkButton
        courseSlug="abap-training"
        lessonFile="04-selection-screen"
        slide={1}
        label="第4章: 選択画面"
        variant="back"
      />
      <LessonLinkButton
        courseSlug="abap-training"
        lessonFile="15-files-jobs-and-batch"
        slide={1}
        label="第15章: ファイル連携"
        variant="back"
      />
    </div>
  );
}

export default function ExerciseJournalLedgerDownloadLesson() {
  return (
    <Lesson
      chrome={lessonChrome(
        "abap-training",
        "96-exercise-journal-ledger-download",
        lessonMeta.title
      )}
      slides={[
        {
          title: "概要（Part B：GUIステータスとダウンロード）",
          plainText:
            "特別演習④ Part B — GUIステータスとExcelダウンロード\nPart A で構造化した create_report_3 を出発点に、帳票画面に「ダウンロード」ボタンを足し、結果をタブ区切り .xls（Excelで開ける形式）として保存できるようにする。\n主な追加: 選択画面の出力ファイルパス p_file / ファイル保存ダイアログ / GUIステータス S0010・タイトル T0010 / AT USER-COMMAND の DL 処理 / GUI_DOWNLOAD。SE41 でのステータス登録が必須。",
          content: (
            <>
              <hgroup>
                <h1>特別演習④ Part B — GUIステータスとExcelダウンロード</h1>
                <p>
                  Part A で構造化した <code>create_report_3</code> を出発点に、帳票画面の左上に
                  <strong>「ダウンロード」ボタン</strong>を足します。ボタンを押すと、帳票データを
                  <strong>タブ区切りの .xls ファイル</strong>（Excel で直接開ける形式）として保存できます。
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
                <strong>このパートは Part A の続きです。</strong>
                Part A（プログラムの構造化）で <code>FORM</code> に分かれた土台があるので、
                追加機能を<strong>新しい <code>FORM</code> として足すだけ</strong>で済みます。
                まだの方は先に Part A を完了してください。
              </Callout>
              <h3>このパートで足すもの</h3>
              <ul>
                <li>
                  選択画面に<strong>出力ファイルパス</strong> <code>p_file</code> を追加（B-③）
                </li>
                <li>
                  <code>AT SELECTION-SCREEN ON VALUE-REQUEST</code> で
                  <strong>ファイル保存ダイアログ</strong>を表示（B-④）
                </li>
                <li>
                  <strong>GUIステータス／タイトル</strong>（<code>SET PF-STATUS</code> /{" "}
                  <code>SET TITLEBAR</code>）の設定（B-⑤）
                </li>
                <li>
                  <code>AT USER-COMMAND</code> で<strong>ダウンロードボタン</strong>（機能コード{" "}
                  <code>DL</code>）を処理（B-⑤）
                </li>
                <li>
                  <code>GUI_DOWNLOAD</code> で<strong>タブ区切り .xls</strong> として Excel ダウンロード（B-⑥）
                </li>
              </ul>
              <ReferenceLinks />
              <Dialog speaker="teacher">
                Part A までで「読みやすい帳票プログラム」ができました。今回は<strong>機能を1つ足します</strong>。
                <br />
                画面に出した結果を、ボタン1つで <strong>Excel に落とせる</strong>ようにします。実務でとても喜ばれる機能です。
              </Dialog>
              <Dialog speaker="b">
                画面で見るだけじゃなく、ファイルに保存できるんですね！どこから手をつけるんですか？
              </Dialog>
              <Dialog speaker="teacher">
                まず<strong>「どこに保存するか」を選ぶ欄</strong>を選択画面に足し、次に<strong>ボタン</strong>を用意し、
                最後に<strong>書き出し処理</strong>を書きます。順番に見ていきましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "B-① 出発点：Part A の構造化コード",
          plainText:
            "B-① 出発点。Part A で構造化した create_report_3（FORM/PERFORM 版）をそのまま使う。イベントは PERFORM の並び、処理は FORM に分かれている。\nPart B では新規プログラム create_report_4 として、この構造の上に追加 FORM（f_get_filename / f_download）と新しいイベント（INITIALIZATION / AT SELECTION-SCREEN ON VALUE-REQUEST / AT USER-COMMAND）を足していく。",
          content: (
            <>
              <h2>B-① 出発点は Part A の完成コード</h2>
              <p>
                下のコードは <strong>Part A の完成版</strong> <code>create_report_3</code>（構造化済み）です。
                Part B では、これを新規プログラム <code>create_report_4</code> としてコピーし、
                <strong>新しい <code>FORM</code> とイベント</strong>を足していきます。
              </p>
              <Callout variant="tip">
                <strong>なぜ構造化が効くのか：</strong>抽出・出力がすでに <code>FORM</code> に分かれているので、
                ダウンロード処理は <code>f_download</code> という<strong>独立した箱</strong>として足すだけ。
                既存の処理にはほとんど触りません。
              </Callout>
              <Reveal label="出発点コード（Part A 構造化版）を見る">
                <CodeBlock language="ABAP" code={START_PROGRAM} />
              </Reveal>
              <Dialog speaker="a">
                <code>FORM</code> に分かれているから、足す場所が分かりやすいですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通り。これが Part A をやっておく理由です。では全体像から確認しましょう。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "B-② 全体像：何を足すか",
          plainText:
            "B-② 全体像。追加するイベントは3つ：INITIALIZATION（初期化用の枠）、AT SELECTION-SCREEN ON VALUE-REQUEST FOR p_file（ファイル選択ボタン押下時に f_get_filename を呼ぶ）、AT USER-COMMAND（ツールバーのボタン押下を CASE sy-ucomm で振り分け、DL なら f_download）。\nSTART-OF-SELECTION の先頭に SET PF-STATUS 'S0010' と SET TITLEBAR 'T0010' を追加。追加する FORM は f_get_filename（ファイル保存ダイアログ）と f_download（GUI_DOWNLOAD）。追加する型は g_typ_dl（ダウンロード用・文字型）と g_typ_fname（ヘッダ行用）。",
          content: (
            <>
              <h2>B-② どこに何を足すか（全体像）</h2>
              <p>
                追加するのは<strong>イベント3つ</strong>・<strong><code>FORM</code> 2つ</strong>・
                <strong>型2つ</strong>・<strong>パラメータ1つ</strong>だけです。既存の処理はそのままです。
              </p>
              <MermaidDiagram
                chart={`flowchart TD
  INIT["INITIALIZATION（追加）"]
  VR["AT SELECTION-SCREEN<br/>ON VALUE-REQUEST FOR p_file（追加）"] --> GETF["PERFORM f_get_filename<br/>（ファイル保存ダイアログ）"]
  SOS["START-OF-SELECTION"] --> STATUS["SET PF-STATUS 'S0010'<br/>SET TITLEBAR 'T0010'（追加）"]
  SOS --> EXIST["PERFORM f_init_main / f_get_data<br/>（既存）"]
  UC["AT USER-COMMAND（追加）"] --> CASE["CASE sy-ucomm → WHEN 'DL'"]
  CASE --> DL["PERFORM f_download<br/>（GUI_DOWNLOAD）"]`}
              />
              <InfoPanel title="追加する部品の一覧" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>種類</th>
                      <th>名前</th>
                      <th>役割</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>パラメータ</td>
                      <td><code>p_file</code></td>
                      <td>出力ファイルパス（保存先）</td>
                    </tr>
                    <tr>
                      <td>型</td>
                      <td><code>g_typ_dl</code></td>
                      <td>ダウンロード用の行（全項目を文字型に整形）</td>
                    </tr>
                    <tr>
                      <td>型</td>
                      <td><code>g_typ_fname</code></td>
                      <td>Excel の見出し行（列名）用</td>
                    </tr>
                    <tr>
                      <td>イベント</td>
                      <td><code>AT SELECTION-SCREEN ON VALUE-REQUEST</code></td>
                      <td>ファイル欄の「選択」ボタン押下でダイアログ表示</td>
                    </tr>
                    <tr>
                      <td>イベント</td>
                      <td><code>AT USER-COMMAND</code></td>
                      <td>ツールバーのボタン押下を振り分け（<code>DL</code>）</td>
                    </tr>
                    <tr>
                      <td>FORM</td>
                      <td><code>f_get_filename</code></td>
                      <td>ファイル保存ダイアログの表示</td>
                    </tr>
                    <tr>
                      <td>FORM</td>
                      <td><code>f_download</code></td>
                      <td>整形して <code>GUI_DOWNLOAD</code> で書き出し</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="warning">
                <strong>コードだけでは動きません。</strong>ボタン（機能コード <code>DL</code>）とタイトルは、
                <strong>SE41</strong> で <code>S0010</code> / <code>T0010</code> を登録して初めて表示されます（B-⑦）。
              </Callout>
              <Dialog speaker="b">
                足すものが整理されていると安心します。型を2つ足すのは何のためですか？
              </Dialog>
              <Dialog speaker="teacher">
                次のスライドで説明します。<strong>Excel に綺麗に出すため</strong>の準備です。
              </Dialog>
            </>
          ),
        },
        {
          title: "B-③ ダウンロード用の型とファイルパスを追加",
          plainText:
            "B-③ 追加する型とパラメータ。g_typ_dl はダウンロード用の行で、全項目を文字型（TYPE c LENGTH n）にする。理由：日付は ____/__/__ 形式、金額は通貨編集済みの見やすい文字列として Excel に出したいから。数値型のまま出すと書式が崩れる。\ng_typ_fname は name（C LENGTH 60）1項目だけの型で、Excel の1行目（列名）に使う。\nパラメータ p_file TYPE string LOWER CASE を選択画面に追加し、保存先パスを受け取る。LOWER CASE で小文字パスもそのまま保持する。",
          content: (
            <>
              <h2>B-③ 型2つとファイルパスを足す</h2>
              <p>
                まず、ダウンロード用の型を <code>TYPES</code> の最後に足します。
                <strong>全項目を文字型</strong>にするのがポイントです。
              </p>
              <CodeBlock
                language="ABAP"
                code={`*>>> ダウンロード用構造（文字型でExcel出力を整形）
TYPES: BEGIN OF g_typ_dl,
         bukrs     TYPE c LENGTH 10,
         blart     TYPE c LENGTH 5,
         blart_txt TYPE c LENGTH 30,
         budat     TYPE c LENGTH 10,   " ____/__/__ で整形して入れる
         bldat     TYPE c LENGTH 10,
         belnr     TYPE c LENGTH 10,
         usnam     TYPE c LENGTH 12,
         gjahr     TYPE c LENGTH 4,
         buzei     TYPE c LENGTH 5,
         hkont     TYPE c LENGTH 10,
         hkont_txt TYPE c LENGTH 20,
         shkzg     TYPE c LENGTH 2,
         dmbtr     TYPE c LENGTH 16,   " 通貨編集した金額を文字で入れる
         sgtxt     TYPE c LENGTH 50,
         waers     TYPE c LENGTH 5,
       END OF g_typ_dl.

*>>> フィールド名構造（Excelヘッダ行用）
TYPES: BEGIN OF g_typ_fname,
         name TYPE c LENGTH 60,
       END OF g_typ_fname.`}
              />
              <InfoPanel title="なぜ全項目を文字型にするのか" variant="breakdown">
                <ul>
                  <li>
                    <strong>日付</strong> … <code>budat</code> / <code>bldat</code> を{" "}
                    <code>____/__/__</code> 形式に整えて出したい
                  </li>
                  <li>
                    <strong>金額</strong> … <code>dmbtr</code> を通貨編集（桁区切りなど）した
                    <strong>見やすい文字列</strong>で出したい
                  </li>
                  <li>
                    数値型・日付型のまま <code>GUI_DOWNLOAD</code> に渡すと、Excel 側で書式が崩れやすい
                  </li>
                </ul>
              </InfoPanel>
              <p>次に、選択画面に<strong>保存先パス</strong>のパラメータを足します。</p>
              <CodeBlock
                language="ABAP"
                code={`PARAMETERS: p_bukrs TYPE t001-bukrs OBLIGATORY.
SELECT-OPTIONS: s_budat FOR g_wrk_budat OBLIGATORY.

*>>> 追加: 出力ファイルパス
PARAMETERS: p_file TYPE string LOWER CASE.`}
              />
              <Callout variant="note">
                <code>LOWER CASE</code> を付けると、入力した<strong>小文字をそのまま保持</strong>します
                （既定では大文字に変換されます）。Windows のパスは大小を区別しませんが、
                見た目どおりに扱うため付けておきます。
              </Callout>
              <Dialog speaker="a">
                <code>g_typ_fname</code> は <code>name</code> 1項目だけなんですね。
              </Dialog>
              <Dialog speaker="teacher">
                はい。これは Excel の<strong>1行目（列名）</strong>に使います。
                次は、そのファイルパスを「ダイアログで選ぶ」仕組みを足します。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "B-④ ファイル保存ダイアログ",
          plainText:
            "B-④ ファイル保存ダイアログ。INITIALIZATION イベントを追加（今は枠だけ）。AT SELECTION-SCREEN ON VALUE-REQUEST FOR p_file を追加し、p_file 欄の選択（F4）ボタンが押されたら f_get_filename を呼ぶ。\nf_get_filename では cl_gui_frontend_services=>file_save_dialog メソッドで保存ダイアログを開く。EXPORTING に window_title・default_extension='xls'・default_file_name='仕訳日記帳.xls'、CHANGING に filename/path/fullpath。sy-subrc=0 なら p_file = lv_fullpath を入れる。",
          content: (
            <>
              <h2>B-④ パスを「ダイアログで選ぶ」</h2>
              <p>
                ファイルパスは手で打たせず、<strong>保存ダイアログ</strong>で選ばせます。
                <code>p_file</code> 欄の選択ボタン（F4）が押されたときに動くイベントを足します。
              </p>
              <CodeBlock
                language="ABAP"
                code={`INITIALIZATION.

AT SELECTION-SCREEN ON VALUE-REQUEST FOR p_file.
  PERFORM f_get_filename.`}
              />
              <p>呼ばれる <code>f_get_filename</code> は、標準クラスのメソッドでダイアログを開きます。</p>
              <CodeBlock
                language="ABAP"
                code={`FORM f_get_filename.

  DATA: lv_filename TYPE string,
        lv_path     TYPE string,
        lv_fullpath TYPE string.

  CALL METHOD cl_gui_frontend_services=>file_save_dialog
    EXPORTING
      window_title      = 'ダウンロード先の選択'
      default_extension = 'xls'
      default_file_name = '仕訳日記帳.xls'
    CHANGING
      filename             = lv_filename
      path                 = lv_path
      fullpath             = lv_fullpath
    EXCEPTIONS
      cntl_error           = 1
      error_no_gui         = 2
      not_supported_by_gui = 3
      OTHERS               = 4.

  IF sy-subrc = 0.
    p_file = lv_fullpath.   " 選んだフルパスを選択画面へ戻す
  ENDIF.

ENDFORM.`}
              />
              <InfoPanel title="file_save_dialog の主な引数" variant="breakdown">
                <ul>
                  <li>
                    <code>window_title</code> … ダイアログのタイトル
                  </li>
                  <li>
                    <code>default_extension = 'xls'</code> … 既定の拡張子
                  </li>
                  <li>
                    <code>default_file_name</code> … 既定のファイル名（<code>仕訳日記帳.xls</code>）
                  </li>
                  <li>
                    <code>fullpath</code> … ユーザが選んだ<strong>フォルダ＋ファイル名</strong>。これを{" "}
                    <code>p_file</code> に戻す
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="note">
                <code>AT SELECTION-SCREEN ON VALUE-REQUEST FOR p_file</code> は、その項目で
                <strong>F4（入力ヘルプ）</strong>が押されたときに走るイベントです。
                ここでダイアログを開き、選ばれたパスを <code>p_file</code> に入れて画面に表示します。
              </Callout>
              <Dialog speaker="b">
                <code>sy-subrc = 0</code> のときだけ入れるのは、キャンセルされたら何もしないためですね。
              </Dialog>
              <Dialog speaker="teacher">
                そうです。キャンセル時に空で上書きしない配慮です。次はボタンの仕組みを足します。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "B-⑤ GUIステータスとボタン処理",
          plainText:
            "B-⑤ GUIステータスとボタン処理。START-OF-SELECTION の先頭に SET PF-STATUS 'S0010'（ツールバー・ボタンの定義）と SET TITLEBAR 'T0010'（画面タイトル）を足す。これで帳票画面に独自ツールバーが付く。\nボタンが押されたときの処理は AT USER-COMMAND で受ける。CASE sy-ucomm で機能コードを判定し、WHEN 'DL' のとき PERFORM f_download を呼ぶ。sy-ucomm には押されたボタンの機能コードが入る。",
          content: (
            <>
              <h2>B-⑤ ボタンを表示して、押下を受け取る</h2>
              <p>
                帳票画面に独自ツールバーを出すには、<code>START-OF-SELECTION</code> の<strong>先頭</strong>で
                ステータスとタイトルをセットします。
              </p>
              <CodeBlock
                language="ABAP"
                code={`START-OF-SELECTION.

*>>> GUIステータス・タイトルの設定
  SET PF-STATUS 'S0010'.   " ツールバー（DL ボタンを含む）
  SET TITLEBAR  'T0010'.   " 画面タイトル「仕訳日記帳 演習4」

  PERFORM f_init_main.      " Ⅰ データ初期化（既存）
  PERFORM f_get_data.       " Ⅱ データ抽出（既存）`}
              />
              <p>ボタンが押されたときの処理は、<code>AT USER-COMMAND</code> で受け取ります。</p>
              <CodeBlock
                language="ABAP"
                code={`AT USER-COMMAND.
  CASE sy-ucomm.
    WHEN 'DL'.              " ダウンロードボタンの機能コード
      PERFORM f_download.
  ENDCASE.`}
              />
              <InfoPanel title="2つの仕組みの役割" variant="breakdown">
                <ul>
                  <li>
                    <code>SET PF-STATUS 'S0010'</code> … どんなボタンを出すかを決める
                    （SE41 で登録したステータス）
                  </li>
                  <li>
                    <code>SET TITLEBAR 'T0010'</code> … 画面のタイトルを決める（SE41 で登録）
                  </li>
                  <li>
                    <code>AT USER-COMMAND</code> … ボタンが押されると走るイベント。
                    <code>sy-ucomm</code> に<strong>押されたボタンの機能コード</strong>が入る
                  </li>
                  <li>
                    <code>CASE sy-ucomm</code> … 機能コードで処理を振り分ける（<code>DL</code> →{" "}
                    <code>f_download</code>）
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="warning">
                <code>S0010</code> / <code>T0010</code> はコードに書くだけでは存在しません。
                <strong>SE41 で登録（B-⑦）</strong>して初めてボタンとタイトルが表示されます。
              </Callout>
              <Dialog speaker="a">
                押されたボタンの種類が <code>sy-ucomm</code> に入るんですね。ボタンが増えても{" "}
                <code>WHEN</code> を足すだけで対応できそう。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。では押されたときの本体、<code>f_download</code> を作りましょう。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "B-⑥ ダウンロード処理（GUI_DOWNLOAD）",
          plainText:
            "B-⑥ f_download の中身。手順は3つ。(1) p_file が空ならメッセージを出して RETURN。(2) ヘッダ行 lt_fname を組み立てる（会社コード〜通貨の列名を APPEND）。(3) gt_out をループして lt_dl に詰める。日付は WRITE ... USING EDIT MASK で ____/__/__ に、金額は WRITE ... CURRENCY して CONDENSE で詰める。\n最後に CALL FUNCTION 'GUI_DOWNLOAD' に filename=p_file・filetype='DAT'・write_field_separator='X'（タブ区切り）、TABLES に data_tab=lt_dl・fieldnames=lt_fname を渡す。sy-subrc=0 で完了メッセージ、それ以外で失敗メッセージ。",
          content: (
            <>
              <h2>B-⑥ 整形して書き出す</h2>
              <p>
                <code>f_download</code> の流れは<strong>「チェック → ヘッダ行 → データ行 → 書き出し」</strong>です。
                まず保存先が未指定なら止めます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`FORM f_download.

  DATA: lt_dl    TYPE STANDARD TABLE OF g_typ_dl,
        ls_dl    TYPE g_typ_dl,
        lt_fname TYPE STANDARD TABLE OF g_typ_fname,
        ls_fname TYPE g_typ_fname.

  DATA: lv_budat_c TYPE c LENGTH 10,
        lv_bldat_c TYPE c LENGTH 10,
        lv_dmbtr_c TYPE c LENGTH 16.

* (1) ファイルパスチェック
  IF p_file IS INITIAL.
    MESSAGE s000(z01) WITH '出力ファイルパスを指定してください'.
    RETURN.
  ENDIF.`}
              />
              <p>
                次に、Excel の<strong>1行目（列名）</strong>を <code>lt_fname</code> に組み立てます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`* (2) ヘッダ行（Excelの列名）の構築
  CLEAR ls_fname.
  ls_fname-name = '会社コード'.         APPEND ls_fname TO lt_fname.
  ls_fname-name = '伝票タイプ'.         APPEND ls_fname TO lt_fname.
  ls_fname-name = '伝票タイプテキスト'. APPEND ls_fname TO lt_fname.
  " … 転記日付・証憑日付・伝票番号・ユーザ名・会計年度・明細番号 …
  ls_fname-name = '金額'.               APPEND ls_fname TO lt_fname.
  ls_fname-name = '明細テキスト'.       APPEND ls_fname TO lt_fname.
  ls_fname-name = '通貨'.               APPEND ls_fname TO lt_fname.`}
              />
              <p>
                続いて <code>gt_out</code> をループし、<strong>文字型に整形</strong>しながら{" "}
                <code>lt_dl</code> へ詰めます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`* (3) データ行の構築
  LOOP AT gt_out INTO gs_out.

    CLEAR: ls_dl, lv_budat_c, lv_bldat_c, lv_dmbtr_c.

    ls_dl-bukrs     = gs_out-bukrs.
    ls_dl-blart     = gs_out-blart.
    ls_dl-blart_txt = gs_out-blart_txt.

    WRITE gs_out-budat TO lv_budat_c USING EDIT MASK '____/__/__'.
    ls_dl-budat = lv_budat_c.
    WRITE gs_out-bldat TO lv_bldat_c USING EDIT MASK '____/__/__'.
    ls_dl-bldat = lv_bldat_c.

    ls_dl-belnr = gs_out-belnr.
    " … usnam / gjahr / buzei / hkont / hkont_txt / shkzg …

    WRITE gs_out-dmbtr TO lv_dmbtr_c CURRENCY gs_out-waers.
    CONDENSE lv_dmbtr_c.              " 前後の空白を詰める
    ls_dl-dmbtr = lv_dmbtr_c.

    ls_dl-sgtxt = gs_out-sgtxt.
    ls_dl-waers = gs_out-waers.

    APPEND ls_dl TO lt_dl.

  ENDLOOP.`}
              />
              <p>
                最後に <code>GUI_DOWNLOAD</code> で書き出します。タブ区切りにするのが
                <strong>「Excel で開ける .xls」</strong>の肝です。
              </p>
              <CodeBlock
                language="ABAP"
                code={`* (4) GUI_DOWNLOAD でExcelファイルとしてダウンロード
  CALL FUNCTION 'GUI_DOWNLOAD'
    EXPORTING
      filename              = p_file
      filetype              = 'DAT'
      write_field_separator = 'X'   " ← タブ区切り（Excelで列が分かれる）
    TABLES
      data_tab              = lt_dl
      fieldnames            = lt_fname
    EXCEPTIONS
      file_write_error      = 1
      " … 多数の例外 …
      OTHERS                = 22.

  IF sy-subrc = 0.
    MESSAGE s000(z01) WITH 'ダウンロードが完了しました'.
  ELSE.
    MESSAGE s000(z01) WITH 'ダウンロードに失敗しました'.
  ENDIF.

ENDFORM.`}
              />
              <InfoPanel title="GUI_DOWNLOAD のポイント" variant="breakdown">
                <ul>
                  <li>
                    <code>filetype = 'DAT'</code> + <code>write_field_separator = 'X'</code> …{" "}
                    <strong>タブ区切りテキスト</strong>。拡張子 <code>.xls</code> なら Excel が表として開く
                  </li>
                  <li>
                    <code>data_tab = lt_dl</code> … データ本体（文字型に整形済み）
                  </li>
                  <li>
                    <code>fieldnames = lt_fname</code> … <strong>1行目の列名</strong>
                  </li>
                  <li>
                    結果は <code>sy-subrc</code> で判定し、成功／失敗をメッセージで知らせる
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="tip">
                <code>WRITE ... CURRENCY</code> の後の <code>CONDENSE</code> は、通貨編集で入る
                <strong>余分な前後空白を詰める</strong>ためです。これでセルに綺麗に収まります。
              </Callout>
              <Dialog speaker="b">
                日付や金額を一度「文字」に直してから渡す理由が、これで腑に落ちました。
              </Dialog>
              <Dialog speaker="teacher">
                よい理解です。あと一歩、<strong>SE41 でのボタン登録</strong>を忘れると動かないので、次で確認します。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "B-⑦ SE41 でのGUIステータス登録（必須）",
          plainText:
            "B-⑦ SE41 登録手順（必須）。コードだけでは動かないため SE41（メニューペインタ）で手動登録する。\nGUIタイトル T0010：SE41 を起動→プログラム名を入力→サブオブジェクト「表題一覧（タイトル）」。表題コード T0010、表題『仕訳日記帳 演習4』を入力して保存。\nGUIステータス S0010：SE41→プログラム SAPMSSY0 のステータス STLI を自プログラムへコピー→コピー先ステータス名 S0010。機能キーを展開し任意選定可能キー（例 F5）に機能コード DL・機能名『ダウンロード』を割り当てる。APツールバーの空きスロットに DL を追加（左上にボタンが出る）。保存・有効化。\nこれで帳票結果画面の左上に『ダウンロード』ボタンが出て、押すとタブ区切り .xls がダウンロードされる。",
          content: (
            <>
              <h2>B-⑦ SE41 でステータス／タイトルを登録</h2>
              <Callout variant="warning">
                <strong>コードだけでは動きません。</strong>
                <code>S0010</code>（ステータス）と <code>T0010</code>（タイトル）は、
                <strong>SE41（メニューペインタ）</strong>で手動登録して初めて有効になります。
              </Callout>
              <h3>① GUIタイトル T0010</h3>
              <InfoPanel title="手順：表題の登録" variant="reference">
                <ul>
                  <li>SE41 を起動 → <strong>プログラム名</strong>を入力</li>
                  <li>サブオブジェクトで<strong>「表題（タイトル）」</strong>を選ぶ</li>
                  <li>
                    表題コード <code>T0010</code>、表題 <strong>仕訳日記帳 演習4</strong> を入力して保存
                  </li>
                </ul>
              </InfoPanel>
              <h3>② GUIステータス S0010</h3>
              <InfoPanel title="手順：ステータスの登録" variant="reference">
                <ul>
                  <li>
                    SE41 → プログラム <code>SAPMSSY0</code> のステータス <code>STLI</code> を
                    <strong>自プログラムへコピー</strong>
                  </li>
                  <li>コピー先ステータス名： <code>S0010</code></li>
                  <li>
                    <strong>機能キー</strong>を展開 → 任意選定可能キー（例：<code>F5</code>）に
                    <ul>
                      <li>機能コード： <code>DL</code></li>
                      <li>機能名： <strong>ダウンロード</strong></li>
                    </ul>
                  </li>
                  <li>
                    <strong>APツールバー</strong>の空きスロットに <code>DL</code> を追加（左上にボタンが表示される）
                  </li>
                  <li><strong>保存・有効化</strong></li>
                </ul>
              </InfoPanel>
              <Callout variant="note">
                <code>SAPMSSY0</code> の <code>STLI</code> は「リスト表示用」の標準ステータスです。
                これをコピーすると、戻る・終了などの<strong>標準ボタンが揃った状態</strong>から
                <code>DL</code> を足せます。
              </Callout>
              <Callout variant="tip">
                ここまで登録すると、帳票結果画面の<strong>左上ツールバーに「ダウンロード」ボタン</strong>が現れ、
                押下すると <code>p_file</code> に指定したパスへ<strong>タブ区切り .xls</strong>（Excel で直接開ける形式）が
                ダウンロードされます。
              </Callout>
              <Dialog speaker="b">
                プログラムだけ書いてボタンが出ず焦る…というのは、これを忘れているからなんですね。
              </Dialog>
              <Dialog speaker="teacher">
                まさに「あるある」です。<strong>コード＋SE41 の両方</strong>でひとつの機能、と覚えてください。
              </Dialog>
            </>
          ),
        },
        {
          title: "B-⑧ Part B 完成コード（全文）",
          plainText:
            "B-⑧ Part B 完成コード全文 create_report_4。Part A の構造化版に、p_file パラメータ・g_typ_dl/g_typ_fname 型・INITIALIZATION・AT SELECTION-SCREEN ON VALUE-REQUEST→f_get_filename・START-OF-SELECTION 先頭の SET PF-STATUS/SET TITLEBAR・AT USER-COMMAND→f_download・f_get_filename（file_save_dialog）・f_download（GUI_DOWNLOAD）を足した完成形。\n既存の抽出・出力 FORM は Part A のまま。実行前に SE41 で S0010・T0010 を登録し、TEXT-001〜010 を Text elements に登録する。Reveal で全文を開いて確認する。",
          content: (
            <>
              <h2>B-⑧ Part B 完成コード（全文）</h2>
              <p>
                Part A の <code>create_report_3</code> に、Part B の追加部分（型・パラメータ・イベント・<code>FORM</code>）を
                足した<strong>完成版</strong> <code>create_report_4</code> です。
                既存の抽出・出力 <code>FORM</code> は<strong>Part A のまま</strong>です。
              </p>
              <InfoPanel title="Part A から足した箇所だけ拾うと" variant="breakdown">
                <ul>
                  <li>型 <code>g_typ_dl</code> / <code>g_typ_fname</code> を追加（B-③）</li>
                  <li>パラメータ <code>p_file</code> を追加（B-③）</li>
                  <li>
                    <code>INITIALIZATION</code> と{" "}
                    <code>AT SELECTION-SCREEN ON VALUE-REQUEST FOR p_file</code> →{" "}
                    <code>f_get_filename</code> を追加（B-④）
                  </li>
                  <li>
                    <code>START-OF-SELECTION</code> 先頭に <code>SET PF-STATUS 'S0010'</code> /{" "}
                    <code>SET TITLEBAR 'T0010'</code> を追加（B-⑤）
                  </li>
                  <li>
                    <code>AT USER-COMMAND</code> → <code>WHEN 'DL'</code> → <code>f_download</code> を追加（B-⑤）
                  </li>
                  <li>
                    <code>f_get_filename</code>（ダイアログ）・<code>f_download</code>（書き出し）を追加（B-④・B-⑥）
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="note">
                実行前に <strong>SE41</strong> で <code>S0010</code> / <code>T0010</code> を登録し（B-⑦）、
                列見出し <code>TEXT-001</code>〜<code>TEXT-010</code> を SE38 の <strong>Text elements</strong> に
                登録しておきます（演習③・Part A と同じ）。
              </Callout>
              <Reveal label="Part B 完成コード（create_report_4・全体）を見る">
                <CodeBlock language="ABAP" code={FINAL_PROGRAM} />
              </Reveal>
              <Callout variant="tip">
                <strong>確認のコツ：</strong>Part A の完成コードと並べ、<strong>足した部分だけが「＋」で増えている</strong>
                ことを確かめてください。既存の抽出・出力ロジックは1ミリも変えていません。
              </Callout>
              <Dialog speaker="teacher">
                これで Part B（GUIステータスとExcelダウンロード）は完成です。
                <br />
                構造化（Part A）のおかげで、<strong>追加機能を独立した <code>FORM</code> として足すだけ</strong>で
                済みました。これが「育てやすいプログラム」の効果です。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "理解度チェック",
          plainText:
            "理解度チェック\nQ1 ダウンロード用の g_typ_dl を全項目 文字型にする理由→ 日付を ____/__/__、金額を通貨編集した見やすい文字列で Excel に出すため。数値/日付型のままだと書式が崩れる\nQ2 帳票画面に DL ボタンを出すために必須の作業→ SE41 で GUIステータス S0010 を登録し DL を APツールバーに追加する（コードの SET PF-STATUS だけでは出ない）\nQ3 GUI_DOWNLOAD で Excel が列に分けて開ける .xls にするための指定→ filetype='DAT' と write_field_separator='X'（タブ区切り）",
          content: (
            <>
              <h2>理解度チェック</h2>
              <p>Part B の要点を3問で確認します。迷ったら B-③（型）・B-⑦（SE41）・B-⑥（GUI_DOWNLOAD）に戻ってください。</p>
              <LessonQuiz
                answer={1}
                question={
                  <strong>
                    ダウンロード用の <code>g_typ_dl</code> を<strong>全項目 文字型</strong>にするのはなぜ？
                  </strong>
                }
                options={[
                  "文字型のほうがメモリを節約できるから",
                  "日付を ____/__/__、金額を通貨編集した見やすい文字列で Excel に出すため。数値・日付型のままだと書式が崩れやすい",
                  "GUI_DOWNLOAD は文字型しか受け取れないから",
                ]}
                explanation="日付は WRITE ... USING EDIT MASK で ____/__/__ に、金額は WRITE ... CURRENCY で桁区切りなどを整えた文字列にしてから出します。数値型・日付型のまま GUI_DOWNLOAD に渡すと Excel 側で書式が崩れやすいため、表示用に整形した文字列を持つ g_typ_dl を用意します。"
              />
              <LessonQuiz
                answer={2}
                question={
                  <strong>
                    帳票画面の左上に<strong>「ダウンロード」ボタン（DL）</strong>を出すために、
                    コード以外で<strong>必須</strong>の作業は？
                  </strong>
                }
                options={[
                  "特になし。SET PF-STATUS 'S0010' を書けば自動でボタンが出る",
                  "SE38 の Text elements に DL を登録する",
                  "SE41 で GUIステータス S0010 を登録し、機能コード DL を APツールバーに追加する",
                ]}
                explanation="SET PF-STATUS 'S0010' は「S0010 というステータスを使う」という指定にすぎません。S0010 の中身（どのボタンを出すか）と機能コード DL は、SE41 でステータスを登録し APツールバーに DL を追加して初めて有効になります。タイトル T0010 も SE41 で登録します。"
              />
              <LessonQuiz
                answer={0}
                question={
                  <strong>
                    <code>GUI_DOWNLOAD</code> で、Excel が<strong>列に分けて</strong>開ける .xls を作る指定は？
                  </strong>
                }
                options={[
                  "filetype = 'DAT' と write_field_separator = 'X'（タブ区切り）",
                  "filetype = 'BIN'（バイナリ）にする",
                  "filename の拡張子を .xls にすれば区切りは不要",
                ]}
                explanation="filetype = 'DAT' に write_field_separator = 'X' を組み合わせると、各項目がタブで区切られたテキストになります。拡張子を .xls にしておけば Excel がタブ区切りを列の境目として解釈し、表として開きます。拡張子だけ変えても区切り文字がなければ1列にまとまってしまいます。"
              />
              <Dialog speaker="closing">
                お疲れさまでした。Part B では、構造化した土台の上に「選択画面の拡張」「GUIステータス」
                「ファイルダイアログ」「GUI_DOWNLOAD」を<strong>新しい <code>FORM</code> として足す</strong>だけで、
                実務で喜ばれる<strong>Excel ダウンロード</strong>を実現しました。
                <br />
                コードと SE41 の登録は<strong>セットでひとつの機能</strong>——これを忘れないでください。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ExerciseJournalLedgerDownloadLesson);
