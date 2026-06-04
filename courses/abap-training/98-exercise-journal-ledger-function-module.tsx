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
import { partCFinalProgram } from "./journal-ledger-part-c-program";
import { partDFinalProgram } from "./journal-ledger-part-d-program";

export const lessonMeta = {
  title: "特別演習④ Part D — Excelダウンロードと汎用モジュール",
  meta: "特別 · 45分",
};

/** 出発点：Part C 完成コード create_report_5（97-exercise C-⑤ と同一・全文） */
const START_PROGRAM = partCFinalProgram;

/** Part D 完成形：create_report_6 全文 */
const FINAL_PROGRAM = partDFinalProgram;

function ReferenceLinks() {
  return (
    <div className="mt-4 flex flex-wrap justify-end gap-2">
      <LessonLinkButton
        courseSlug="abap-training"
        lessonFile="97-exercise-journal-ledger-screen-check"
        slide={5}
        label="Part C: C-⑤ 完成コード（create_report_5）"
        variant="back"
      />
      <LessonLinkButton
        courseSlug="abap-training"
        lessonFile="96-exercise-journal-ledger-download"
        slide={5}
        label="Part B: GUIボタン設定"
        variant="back"
      />
      <LessonLinkButton
        courseSlug="abap-training"
        lessonFile="19-file-output"
        slide={7}
        label="第19章: GUI_DOWNLOAD"
        variant="back"
      />
    </div>
  );
}

export default function ExerciseJournalLedgerFunctionModuleLesson() {
  return (
    <Lesson
      chrome={lessonChrome(
        "abap-training",
        "98-exercise-journal-ledger-function-module",
        lessonMeta.title
      )}
      slides={[
        {
          title: "概要（Part D：Excelダウンロード）",
          plainText:
            "特別演習④ Part D — Excelダウンロードと汎用モジュール\nPart C の create_report_5 を出発点に、Part B で用意した DL ボタンにダウンロード処理を接続する。\n追加: p_file / g_typ_dl / AT USER-COMMAND / f_select_file / GUI_DOWNLOAD（f_call_download 経由）。",
          content: (
            <>
              <hgroup>
                <h1>特別演習④ Part D — Excelダウンロードと汎用モジュール</h1>
                <p>
                  Part C の <code>create_report_5</code> をコピーして <code>create_report_6</code> とし、
                  Part B で表示した<strong>DL ボタン</strong>に、帳票データを Excel ファイルとして保存する処理を接続します。
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
                <strong>Part B → Part D の流れ</strong>
                <ul className="mt-2">
                  <li>
                    Part B … <code>SET PF-STATUS</code> + SE41 で DL ボタンを<strong>表示</strong>
                  </li>
                  <li>
                    Part D … <code>AT USER-COMMAND</code> + <code>GUI_DOWNLOAD</code> で
                    <strong>押下時にファイル保存</strong>
                  </li>
                </ul>
              </Callout>
              <h3>このパートで足すもの</h3>
              <ul>
                <li>
                  選択画面の <code>p_file</code> とダウンロード用型 <code>g_typ_dl</code>（D-③）
                </li>
                <li>
                  <code>AT USER-COMMAND</code> で Part B の DL ボタンを受け取る（D-④）
                </li>
                <li>
                  <code>f_select_file</code>（ファイル保存ダイアログ）（D-⑤）
                </li>
                <li>
                  <code>f_download</code> ほか、<code>GUI_DOWNLOAD</code> を呼ぶ FORM 群（D-⑥〜D-⑨）
                </li>
              </ul>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "D-① 出発点：Part C の create_report_5 をコピー",
          plainText:
            "D-① 出発点。Part C 完成版 create_report_5 全文をコピーして create_report_6 とする。含む: f_init_main/f_check_parameters/f_handle_no_data、butxt、Part B の SET PF-STATUS。ダウンロード処理は Part D で追加。",
          content: (
            <>
              <h2>D-① ここからコピーして始めてください</h2>
              <p>
                下のコードは <strong>Part C の完成版</strong> <code>create_report_5</code> です。
                これを<strong>そのままコピー</strong>して SE38 に貼り、新規プログラム{" "}
                <code>create_report_6</code> として Part D の出発点にしてください。
              </p>
              <InfoPanel title="出発点に含まれる処理（そのまま残す）" variant="reference">
                <ul>
                  <li>
                    Part B … <code>SET PF-STATUS</code> / <code>SET TITLEBAR</code>（DL ボタン表示）
                  </li>
                  <li>
                    Part C … <code>f_init_main</code> / <code>f_check_parameters</code> /{" "}
                    <code>f_handle_no_data</code> / <code>butxt</code>
                  </li>
                </ul>
              </InfoPanel>
              <Reveal label="出発点コード（Part C 完成版 create_report_5・全文）を見る">
                <CodeBlock language="ABAP" code={START_PROGRAM} />
              </Reveal>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "D-② ダウンロード用の型とファイルパス",
          plainText:
            "D-② g_typ_dl は全項目文字型（日付・金額の整形用）。g_typ_dl_tab、gt_dl_header/gt_dl_item、p_file パラメータ、c_on 定数を追加。",
          content: (
            <>
              <h2>D-② 型とファイルパスを足す</h2>
              <p>
                Excel 出力用に<strong>全項目を文字型</strong>にした <code>g_typ_dl</code> を定義し、
                選択画面に保存先パス <code>p_file</code> を追加します。
              </p>
              <CodeBlock
                language="ABAP"
                code={`*>>> ダウンロード用構造（文字型でExcel出力を整形）
TYPES: BEGIN OF g_typ_dl,
         bukrs     TYPE c LENGTH 10,
         butxt     TYPE c LENGTH 25,
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

TYPES g_typ_dl_tab TYPE STANDARD TABLE OF g_typ_dl WITH DEFAULT KEY.

*>>> DATA に追加
      gt_dl_header TYPE g_typ_dl_tab,
      gt_dl_item   TYPE g_typ_dl_tab.

*>>> CONSTANTS に追加
           c_on TYPE c VALUE 'X'.

*>>> 選択画面に追加
PARAMETERS: p_file TYPE string LOWER CASE.`}
              />
              <InfoPanel title="なぜ全項目を文字型にするのか" variant="breakdown">
                <ul>
                  <li>
                    日付 … <code>____/__/__</code> 形式に整形して Excel に出したい
                  </li>
                  <li>
                    金額 … 通貨編集した<strong>見やすい文字列</strong>で出したい
                  </li>
                </ul>
              </InfoPanel>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "D-③ Part B の DL ボタンに処理を接続",
          plainText:
            "D-③ AT USER-COMMAND。CASE sy-ucomm WHEN 'DL' で PERFORM f_download。Part B の SET PF-STATUS + SE41 で表示したボタンの機能コード DL をここで受け取る。",
          content: (
            <>
              <h2>D-③ DL ボタン押下を受け取る</h2>
              <p>
                Part B で SE41 に登録した機能コード <code>DL</code> が押されると、
                <code>AT USER-COMMAND</code> が走り <code>sy-ucomm</code> に <code>&apos;DL&apos;</code> が入ります。
              </p>
              <CodeBlock
                language="ABAP"
                code={`AT USER-COMMAND.
  CASE sy-ucomm.
    WHEN 'DL'.              " Part B で SE41 登録した機能コード
      PERFORM f_download.
  ENDCASE.`}
              />
              <InfoPanel title="Part B との接続" variant="breakdown">
                <ul>
                  <li>
                    Part B … <code>SET PF-STATUS c_gui_status</code> で <code>S0010</code> を指定 →
                    SE41 で登録した DL ボタンが<strong>表示</strong>される
                  </li>
                  <li>
                    Part D … <code>AT USER-COMMAND</code> で <code>sy-ucomm = &apos;DL&apos;</code> を
                    <strong>処理</strong>する
                  </li>
                </ul>
              </InfoPanel>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "D-④ f_select_file（ファイル保存ダイアログ）",
          plainText:
            "D-④ f_select_file。AT SELECTION-SCREEN ON VALUE-REQUEST FOR p_file。CL_GUI_FRONTEND_SERVICES=>FILE_SAVE_DIALOG で保存先を取得。",
          content: (
            <>
              <h2>D-④ ファイル選択（f_select_file）</h2>
              <CodeBlock
                language="ABAP"
                code={`AT SELECTION-SCREEN ON VALUE-REQUEST FOR p_file.
  PERFORM f_select_file.

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
      filename          = lv_filename
      path              = lv_path
      fullpath          = lv_fullpath
    EXCEPTIONS
      OTHERS            = 4.

  IF sy-subrc = 0.
    p_file = lv_fullpath.
  ENDIF.

ENDFORM.`}
              />
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "D-⑤ 汎用モジュールとは",
          plainText:
            "D-⑤ 汎用モジュール。FORM との違いは他プログラムからも呼べること。GUI_DOWNLOAD がファイルダウンロードの代表例。f_call_download に包んで呼ぶ。",
          content: (
            <>
              <h2>D-⑤ 汎用モジュール（Function Module）とは</h2>
              <InfoPanel title="FORM との違い" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>FORM（サブルーチン）</th>
                      <th>汎用モジュール</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>呼び出し元</td>
                      <td>同じプログラム内のみ</td>
                      <td>他プログラムからも可能</td>
                    </tr>
                    <tr>
                      <td>代表例</td>
                      <td><code>f_get_data</code></td>
                      <td><code>GUI_DOWNLOAD</code></td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="warning">
                使用前に <strong>SE37</strong> で IMPORT / EXPORT / TABLES / EXCEPTIONS を確認してください。
              </Callout>
              <Dialog speaker="teacher">
                実務では <code>GUI_DOWNLOAD</code> を <code>f_call_download</code> という FORM に包み、
                ファイル名や <code>append</code> の指定を 1 箇所にまとめます。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "D-⑥ f_create_header / f_create_item",
          plainText:
            "D-⑥ データ整形。f_create_header は g_typ_dl の 1 行に列見出し。f_create_item は gt_out をループし日付・金額を文字型に整形。",
          content: (
            <>
              <h2>D-⑥ ヘッダ行とデータ行の構築</h2>
              <p>
                ヘッダ行も <code>g_typ_dl</code> の 1 行として組み立て、
                同じ <code>GUI_DOWNLOAD</code> 呼び出しで書き出します。
              </p>
              <CodeBlock
                language="ABAP"
                code={`FORM f_create_header.
  DATA: ls_dl TYPE g_typ_dl.
  REFRESH gt_dl_header.
  CLEAR ls_dl.
  ls_dl-bukrs     = '会社コード'.
  ls_dl-butxt     = '会社名'.
  ls_dl-blart     = '伝票タイプ'.
  " … 他の列見出し …
  ls_dl-waers     = '通貨'.
  APPEND ls_dl TO gt_dl_header.
ENDFORM.

FORM f_create_item.
  " gt_out をループし、日付は WRITE ... USING EDIT MASK、
  " 金額は WRITE ... CURRENCY + CONDENSE で g_typ_dl に詰める
ENDFORM.`}
              />
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "D-⑦ f_call_download（GUI_DOWNLOAD）",
          plainText:
            "D-⑦ f_call_download。CALL FUNCTION GUI_DOWNLOAD を FORM に集約。filetype ASC、write_field_separator X。ヘッダは append 空白、明細は append X。",
          content: (
            <>
              <h2>D-⑦ 汎用モジュール呼び出し（f_call_download）</h2>
              <MermaidDiagram
                chart={`flowchart TD
  DL["f_download"] --> CH["f_create_header"]
  CH --> CD1["f_call_download\\nappend = ' '"]
  CD1 --> CI["f_create_item"]
  CI --> CD2["f_call_download\\nappend = 'X'"]
  CD1 --> FM["CALL FUNCTION 'GUI_DOWNLOAD'"]
  CD2 --> FM`}
              />
              <CodeBlock
                language="ABAP"
                code={`FORM f_call_download USING    pv_append TYPE c
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
      OTHERS                = 22.

ENDFORM.`}
              />
              <Callout variant="warning">
                <code>CHANGING pt_data TYPE g_typ_dl_tab</code> を使ってください（
                <code>STRUCTURE g_typ_dl</code> はローカル型では使えません）。
              </Callout>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "D-⑧ f_download（統括処理）",
          plainText:
            "D-⑧ f_download 統括。パスチェック後、f_create_header→f_call_download（ヘッダ）→f_create_item→f_call_download（明細）。sy-subrc で成功/失敗メッセージ。",
          content: (
            <>
              <h2>D-⑧ ダウンロード処理の統括（f_download）</h2>
              <CodeBlock
                language="ABAP"
                code={`FORM f_download.

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

ENDFORM.`}
              />
              <Callout variant="warning">
                アプリ言語が日本語以外だと Excel の日本語が文字化けすることがあります。
                本演習では<strong>日本語</strong>でログオンして実行してください。
              </Callout>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "D-⑨ Part D 完成コード（全文）",
          plainText:
            "D-⑨ create_report_6 完成全文。Part C の処理を維持し、p_file/g_typ_dl/AT USER-COMMAND/f_select_file/f_download 群を追加。Part B の DL ボタンで Excel ダウンロードが動作する。",
          content: (
            <>
              <h2>D-⑨ Part D 完成コード（全文）</h2>
              <InfoPanel title="Part C から足した箇所" variant="breakdown">
                <ul>
                  <li>
                    型 … <code>g_typ_dl</code> / <code>g_typ_dl_tab</code>、DATA …{" "}
                    <code>gt_dl_header</code> / <code>gt_dl_item</code>
                  </li>
                  <li>
                    パラメータ … <code>p_file</code>、定数 … <code>c_on</code>
                  </li>
                  <li>
                    イベント … <code>AT SELECTION-SCREEN ON VALUE-REQUEST</code> /{" "}
                    <code>AT USER-COMMAND</code>
                  </li>
                  <li>
                    FORM … <code>f_select_file</code> / <code>f_download</code> /{" "}
                    <code>f_create_header</code> / <code>f_create_item</code> /{" "}
                    <code>f_call_download</code>
                  </li>
                </ul>
              </InfoPanel>
              <Reveal label="Part D 完成コード（create_report_6・全文）を見る">
                <CodeBlock language="ABAP" code={FINAL_PROGRAM} />
              </Reveal>
              <Dialog speaker="closing">
                Part D では Part B の DL ボタンに「選択 → パス取得 → 整形 → 書き出し」を接続しました。
                汎用モジュール <code>GUI_DOWNLOAD</code> の呼び出しは <code>f_call_download</code> に集約されています。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "理解度チェック",
          plainText:
            "理解度チェック\nQ1 DL ボタン押下を受け取るイベント→ AT USER-COMMAND\nQ2 ファイルダウンロード FM→ GUI_DOWNLOAD\nQ3 ファイル選択 FORM→ f_select_file",
          content: (
            <>
              <h2>理解度チェック</h2>
              <LessonQuiz
                answer={2}
                question={
                  <strong>
                    Part B で表示した DL ボタンが押されたとき、処理を受け取るイベントは？
                  </strong>
                }
                options={["AT SELECTION-SCREEN", "START-OF-SELECTION", "AT USER-COMMAND"]}
                explanation="ツールバーボタン押下は AT USER-COMMAND で受け取り、sy-ucomm に機能コード（'DL'）が入ります。"
              />
              <LessonQuiz
                answer={1}
                question={
                  <strong>
                    SAP 標準の「ファイルダウンロード」汎用モジュールはどれ？
                  </strong>
                }
                options={["GUI_UPLOAD", "GUI_DOWNLOAD", "BAPI_ACC_DOCUMENT_POST"]}
                explanation="GUI_DOWNLOAD は内部テーブルの内容を PC 上のファイルへ書き出す汎用モジュールです。"
              />
              <LessonQuiz
                answer={2}
                question={
                  <strong>
                    保存先パスをファイル保存ダイアログで選ぶ FORM は？
                  </strong>
                }
                options={["f_create_header", "f_call_download", "f_select_file"]}
                explanation="AT SELECTION-SCREEN ON VALUE-REQUEST FOR p_file から f_select_file が呼ばれ、FILE_SAVE_DIALOG でパスを取得します。"
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ExerciseJournalLedgerFunctionModuleLesson);
