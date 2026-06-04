import { partBFinalProgram } from "./96-exercise-journal-ledger-download";

/**
 * Part B 完成コードを Part C（create_report_5）完成形へ変換する。
 * 97-exercise の C-⑤ 全文表示用。
 */
export function buildPartCFinalProgram(): string {
  let code = partBFinalProgram.replace(
    "REPORT create_report_4",
    "REPORT create_report_5"
  );

  code = code.replace(
    `TYPES: BEGIN OF g_typ_t001,
         ktopl TYPE t001-ktopl,
         waers TYPE t001-waers,
       END OF g_typ_t001.`,
    `TYPES: BEGIN OF g_typ_t001,
         ktopl TYPE t001-ktopl,
         waers TYPE t001-waers,
         butxt TYPE t001-butxt,
       END OF g_typ_t001.`
  );

  code = code.replace(
    `TYPES: BEGIN OF g_typ_dl,
         bukrs     TYPE c LENGTH 10,
         blart     TYPE c LENGTH 5,`,
    `TYPES: BEGIN OF g_typ_dl,
         bukrs     TYPE c LENGTH 10,
         butxt     TYPE c LENGTH 25,
         blart     TYPE c LENGTH 5,`
  );

  code = code.replace(
    `*---------------------------------------------------------------------*
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
  SET PF-STATUS c_gui_status.
  SET TITLEBAR  c_gui_title.

  PERFORM f_init_main.      " Ⅰ データ初期化
  PERFORM f_get_data.       " Ⅱ データ抽出`,
    `*---------------------------------------------------------------------*
* INITIALIZATION（Ⅰ データ初期化）
*---------------------------------------------------------------------*
INITIALIZATION.
  PERFORM f_init_main.

*---------------------------------------------------------------------*
* AT SELECTION-SCREEN（Ⅰ 存在性チェック）
*---------------------------------------------------------------------*
AT SELECTION-SCREEN.
  PERFORM f_check_parameters.

*---------------------------------------------------------------------*
* AT SELECTION-SCREEN ON VALUE-REQUEST（ファイル保存ダイアログ）
*---------------------------------------------------------------------*
AT SELECTION-SCREEN ON VALUE-REQUEST FOR p_file.
  PERFORM f_get_filename.

*---------------------------------------------------------------------*
* START-OF-SELECTION
*---------------------------------------------------------------------*
START-OF-SELECTION.

*>>> GUIステータス・タイトルの設定
  SET PF-STATUS c_gui_status.
  SET TITLEBAR  c_gui_title.

  PERFORM f_get_data.       " Ⅰ－１ データ抽出`
  );

  code = code.replace(
    `*&--------------------------------------------------------------------*
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

ENDFORM.                    " F_INIT_MAIN`,
    `*&--------------------------------------------------------------------*
*& Form F_INIT_MAIN（INITIALIZATION: Ⅰ データ初期化）
*&--------------------------------------------------------------------*
FORM f_init_main.

  DATA: lv_first TYPE sy-datum.

  CLEAR s_budat[].
  lv_first = sy-datum.
  lv_first+6(2) = '01'.

  s_budat-sign   = 'I'.
  s_budat-option = 'BT'.
  s_budat-low    = lv_first.
  s_budat-high   = sy-datum.
  APPEND s_budat.

ENDFORM.                    " F_INIT_MAIN

*&--------------------------------------------------------------------*
*& Form F_CHECK_PARAMETERS（AT SELECTION-SCREEN: Ⅰ 存在性チェック）
*&--------------------------------------------------------------------*
FORM f_check_parameters.

  DATA: lv_bukrs TYPE t001-bukrs.

  SELECT SINGLE bukrs
    INTO lv_bukrs
    FROM t001
    WHERE bukrs = p_bukrs.

  IF sy-subrc <> 0.
    MESSAGE e000(z01) WITH '会社コードがマスタに存在しません'.
  ENDIF.

  READ TABLE s_budat INDEX 1.
  IF sy-subrc = 0.
    IF s_budat-high IS NOT INITIAL
       AND s_budat-low  IS NOT INITIAL
       AND s_budat-high < s_budat-low.
      MESSAGE e000(z01) WITH '転記日付の範囲が不正です'.
    ENDIF.
  ENDIF.

ENDFORM.                    " F_CHECK_PARAMETERS

*&--------------------------------------------------------------------*
*& Form F_HANDLE_NO_DATA（Ⅰ－１－(3) 対象データなし）
*&--------------------------------------------------------------------*
FORM f_handle_no_data.

  SET CURSOR FIELD 'P_BUKRS'.
  MESSAGE e000(z01) WITH '対象データは登録されていません'.

ENDFORM.                    " F_HANDLE_NO_DATA`
  );

  code = code.replace(
    `  IF gt_bkpf IS INITIAL.
    MESSAGE s000(z01) WITH '対象データは登録されていません'.
    LEAVE LIST-PROCESSING.
  ENDIF.`,
    `  IF gt_bkpf IS INITIAL.
    PERFORM f_handle_no_data.
  ENDIF.`
  );

  code = code.replace(
    `  IF gt_out IS INITIAL.
    MESSAGE s000(z01) WITH '対象データは登録されていません'.
    LEAVE LIST-PROCESSING.
  ENDIF.`,
    `  IF gt_out IS INITIAL.
    PERFORM f_handle_no_data.
  ENDIF.`
  );

  code = code.replace(
    `FORM f_get_data.

  PERFORM f_get_ktopl.`,
    `FORM f_get_data.

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

  PERFORM f_get_ktopl.`
  );

  code = code.replace(
    `FORM f_get_ktopl.

  SELECT SINGLE ktopl
                waers
    INTO CORRESPONDING FIELDS OF gs_t001
    FROM t001
    WHERE bukrs = p_bukrs.

ENDFORM.                    " F_GET_KTOPL`,
    `FORM f_get_ktopl.

  SELECT SINGLE ktopl
                waers
                butxt
    INTO CORRESPONDING FIELDS OF gs_t001
    FROM t001
    WHERE bukrs = p_bukrs.

  IF sy-subrc <> 0.
    CLEAR gs_t001.
  ENDIF.

ENDFORM.                    " F_GET_KTOPL`
  );

  code = code.replace(
    `  WRITE: /1  '会社コード:',
          13 p_bukrs,
         /1  '転記日付:',`,
    `  WRITE: /1  '会社コード:',
          13 p_bukrs,
          20 gs_t001-butxt,
         /1  '転記日付:',`
  );

  code = code.replace(
    `  ls_fname-name = '会社コード'.         APPEND ls_fname TO lt_fname.
  ls_fname-name = '伝票タイプ'.         APPEND ls_fname TO lt_fname.`,
    `  ls_fname-name = '会社コード'.         APPEND ls_fname TO lt_fname.
  ls_fname-name = '会社名'.             APPEND ls_fname TO lt_fname.
  ls_fname-name = '伝票タイプ'.         APPEND ls_fname TO lt_fname.`
  );

  code = code.replace(
    `    ls_dl-bukrs     = gs_out-bukrs.
    ls_dl-blart     = gs_out-blart.`,
    `    ls_dl-bukrs     = gs_out-bukrs.
    ls_dl-butxt     = gs_t001-butxt.
    ls_dl-blart     = gs_out-blart.`
  );

  return code;
}

export const partCFinalProgram = buildPartCFinalProgram();
