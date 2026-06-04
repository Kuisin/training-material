import { partAFinalProgram } from "./journal-ledger-part-a-program";

/**
 * Part A 完成コードを Part B（create_report_4）へ変換する。
 * Part B では GUI ステータス／タイトルのみ追加（ボタン押下時の処理は Part D）。
 */
export function buildPartBFinalProgram(): string {
  let code = partAFinalProgram.replace(
    "REPORT create_report_3",
    "REPORT create_report_4"
  );

  code = code.replace(
    `CONSTANTS: c_spras   TYPE t003t-spras VALUE 'J',
           c_shkzg_s TYPE bseg-shkzg  VALUE 'S',
           c_shkzg_h TYPE bseg-shkzg  VALUE 'H'.`,
    `CONSTANTS: c_spras       TYPE t003t-spras VALUE 'J',   " 言語キー
           c_shkzg_s    TYPE bseg-shkzg  VALUE 'S',   " 借方
           c_shkzg_h    TYPE bseg-shkzg  VALUE 'H',   " 貸方
           c_gui_status TYPE sy-pfkey    VALUE 'S0010', " GUI_STATUS
           c_gui_title  TYPE c LENGTH 20 VALUE 'T0010'. " GUI_TITLE`
  );

  code = code.replace(
    `START-OF-SELECTION.

  PERFORM f_init_main.      " Ⅰ データ初期化
  PERFORM f_get_data.       " Ⅱ データ抽出`,
    `START-OF-SELECTION.

*>>> 追加: GUIステータス・タイトルの設定
  SET PF-STATUS c_gui_status.
  SET TITLEBAR  c_gui_title.

  PERFORM f_init_main.      " Ⅰ データ初期化
  PERFORM f_get_data.       " Ⅱ データ抽出`
  );

  return code;
}

export const partBFinalProgram = buildPartBFinalProgram();
