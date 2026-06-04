import { partCFinalProgram } from "./journal-ledger-part-c-program";

const downloadForms = `*&--------------------------------------------------------------------*
*& Form F_SELECT_FILE（ファイル保存ダイアログ）
*&--------------------------------------------------------------------*
FORM f_select_file.

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

ENDFORM.                    " F_SELECT_FILE

*&--------------------------------------------------------------------*
*& Form F_DOWNLOAD（ダウンロード処理の統括）
*&--------------------------------------------------------------------*
FORM f_download.

  DATA: lv_subrc TYPE sy-subrc.

  IF p_file IS INITIAL.
    MESSAGE s000(z01) WITH '出力ファイルパスを指定してください'.
    RETURN.
  ENDIF.

  PERFORM f_create_header.
  PERFORM f_call_download USING ' ' CHANGING gt_dl_header.
  lv_subrc = sy-subrc.

  IF lv_subrc = 0.
    PERFORM f_create_item.
    PERFORM f_call_download USING 'X' CHANGING gt_dl_item.
    lv_subrc = sy-subrc.
  ENDIF.

  IF lv_subrc = 0.
    MESSAGE s000(z01) WITH 'ダウンロードが完了しました'.
  ELSE.
    MESSAGE s000(z01) WITH 'ダウンロードに失敗しました'.
  ENDIF.

ENDFORM.                    " F_DOWNLOAD

*&--------------------------------------------------------------------*
*& Form F_CREATE_HEADER（ダウンロード用ヘッダ行の構築）
*&--------------------------------------------------------------------*
FORM f_create_header.

  DATA: ls_dl TYPE g_typ_dl.

  REFRESH gt_dl_header.
  CLEAR ls_dl.

  ls_dl-bukrs     = '会社コード'.
  ls_dl-butxt     = '会社名'.
  ls_dl-blart     = '伝票タイプ'.
  ls_dl-blart_txt = '伝票タイプテキスト'.
  ls_dl-budat     = '転記日付'.
  ls_dl-bldat     = '証憑日付'.
  ls_dl-belnr     = '伝票番号'.
  ls_dl-usnam     = 'ユーザ名'.
  ls_dl-gjahr     = '会計年度'.
  ls_dl-buzei     = '明細番号'.
  ls_dl-hkont     = '勘定コード'.
  ls_dl-hkont_txt = '勘定コードテキスト'.
  ls_dl-shkzg     = '借方/貸方'.
  ls_dl-dmbtr     = '金額'.
  ls_dl-sgtxt     = '明細テキスト'.
  ls_dl-waers     = '通貨'.

  APPEND ls_dl TO gt_dl_header.

ENDFORM.                    " F_CREATE_HEADER

*&--------------------------------------------------------------------*
*& Form F_CREATE_ITEM（ダウンロード用データ行の構築）
*&--------------------------------------------------------------------*
FORM f_create_item.

  DATA: ls_dl       TYPE g_typ_dl,
        lv_budat_c  TYPE c LENGTH 10,
        lv_bldat_c  TYPE c LENGTH 10,
        lv_dmbtr_c  TYPE c LENGTH 16.

  REFRESH gt_dl_item.

  LOOP AT gt_out INTO gs_out.

    CLEAR: ls_dl, lv_budat_c, lv_bldat_c, lv_dmbtr_c.

    ls_dl-bukrs     = gs_out-bukrs.
    ls_dl-butxt     = gs_t001-butxt.
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

    ls_dl-sgtxt = gs_out-sgtxt.
    ls_dl-waers = gs_out-waers.

    APPEND ls_dl TO gt_dl_item.

  ENDLOOP.

ENDFORM.                    " F_CREATE_ITEM

*&--------------------------------------------------------------------*
*& Form F_CALL_DOWNLOAD（GUI_DOWNLOAD 汎用モジュール呼び出し）
*&--------------------------------------------------------------------*
FORM f_call_download USING    pv_append TYPE c
                     CHANGING pt_data   TYPE g_typ_dl_tab.

  CALL FUNCTION 'GUI_DOWNLOAD'
    EXPORTING
      filename              = p_file
      filetype              = 'ASC'
      append                = pv_append
      write_field_separator = c_on
    TABLES
      data_tab              = pt_data
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

ENDFORM.                    " F_CALL_DOWNLOAD`;

/**
 * Part C 完成コードを Part D（create_report_6）完成形へ変換する。
 * 98-exercise の D-⑦ 全文表示用。
 */
export function buildPartDFinalProgram(): string {
  let code = partCFinalProgram.replace(
    "REPORT create_report_5",
    "REPORT create_report_6"
  );

  code = code.replace(
    `*>>> 追加: フィールド名構造（Excelヘッダ行用）
TYPES: BEGIN OF g_typ_fname,
         name TYPE c LENGTH 60,
       END OF g_typ_fname.

`,
    ""
  );

  code = code.replace(
    `       END OF g_typ_dl.

*---------------------------------------------------------------------*
* DATA（グローバル変数）`,
    `       END OF g_typ_dl.

TYPES g_typ_dl_tab TYPE STANDARD TABLE OF g_typ_dl WITH DEFAULT KEY.

*---------------------------------------------------------------------*
* DATA（グローバル変数）`
  );

  code = code.replace(
    `      gt_out   TYPE STANDARD TABLE OF g_typ_out,
      gs_out   TYPE g_typ_out.`,
    `      gt_out   TYPE STANDARD TABLE OF g_typ_out,
      gs_out   TYPE g_typ_out,
      gt_dl_header TYPE g_typ_dl_tab,
      gt_dl_item   TYPE g_typ_dl_tab.`
  );

  code = code.replace(
    `* AT SELECTION-SCREEN ON VALUE-REQUEST（ファイル保存ダイアログ）
*---------------------------------------------------------------------*
AT SELECTION-SCREEN ON VALUE-REQUEST FOR p_file.
  PERFORM f_get_filename.`,
    `* AT SELECTION-SCREEN ON VALUE-REQUEST（ファイル保存ダイアログ）
*---------------------------------------------------------------------*
AT SELECTION-SCREEN ON VALUE-REQUEST FOR p_file.
  PERFORM f_select_file.`
  );

  code = code.replace(
    /\*&--------------------------------------------------------------------\*\r?\n\*& Form F_GET_FILENAME[\s\S]*?ENDFORM\.                    " F_GET_FILENAME\r?\n\r?\n\*&--------------------------------------------------------------------\*\r?\n\*& Form F_DOWNLOAD[\s\S]*?ENDFORM\.                    " F_DOWNLOAD/,
    downloadForms
  );

  return code;
}

export const partDFinalProgram = buildPartDFinalProgram();
