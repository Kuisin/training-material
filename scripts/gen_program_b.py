from pathlib import Path

path = Path(__file__).resolve().parents[1] / "courses/abap-training/s3-exercise-journal-ledger-control-break.tsx"
text = path.read_text(encoding="utf-8")
start = text.index("const FINAL_PROGRAM = `") + len("const FINAL_PROGRAM = `")
end = text.index("`;", start)
final = text[start:end]

pb = final.replace("REPORT create_report_3", "REPORT create_report_3_b", 1)

old_data = """DATA: lv_force     TYPE abap_bool,    " 未使用
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

DATA: gv_pageno TYPE sy-pagno.     " 直前行のページ番号"""

new_data = """DATA: lv_blart     TYPE bkpf-blart,    " 伝票タイプ（表示用・Aパート）
      lv_blart_txt TYPE t003t-ltext,  " 伝票タイプ名（表示用・Aパート）
      lv_budat_c   TYPE c LENGTH 10,  " 転記日付（文字・空欄可・Aパート）
      lv_bldat_c   TYPE c LENGTH 10,  " 伝票日付（文字・空欄可・Aパート）
      lv_belnr     TYPE bkpf-belnr,   " 伝票番号（表示用・Aパート）
      lv_usnam     TYPE bkpf-usnam,   " ユーザ（表示用・Aパート）
      lv_show_usnam TYPE abap_bool. " ユーザ列とその左の見出し列を出すか（Aパート）

DATA: lv_show_blart TYPE abap_bool, " 改ページ再表示用（Bパート）
      lv_show_budat TYPE abap_bool,
      lv_show_bldat TYPE abap_bool,
      lv_show_belnr TYPE abap_bool.

DATA: gv_pageno TYPE sy-pagno.     " 直前行のページ番号（Bパート）"""

if old_data not in pb:
    raise SystemExit("old_data not found in FINAL_PROGRAM")

pb = pb.replace(old_data, new_data)

loop_start = pb.index("END-OF-SELECTION.")
loop_end = pb.index("  ENDLOOP.", loop_start) + len("  ENDLOOP.")
new_loop = """END-OF-SELECTION.

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

  ENDLOOP."""

pb = pb[:loop_start] + new_loop + pb[loop_end:]

b_start = text.index("const PROGRAM_B = `") + len("const PROGRAM_B = `")
b_end = text.index("`;", b_start)
text = text[:b_start] + pb + text[b_end:]
path.write_text(text, encoding="utf-8")
print("OK", len(pb))
