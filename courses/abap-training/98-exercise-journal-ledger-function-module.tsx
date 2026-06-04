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
  title: "特別演習④ Part D — 汎用モジュールの活用",
  meta: "特別 · 30分",
};

/** 出発点：Part C 完成コード create_report_5 */
const START_PROGRAM = partCFinalProgram;

/** Part D 完成形：create_report_6 全文（ダウンロード処理の分割・GUI_DOWNLOAD 分離） */
const FINAL_PROGRAM = partDFinalProgram;

function ReferenceLinks() {
  return (
    <div className="mt-4 flex flex-wrap justify-end gap-2">
      <LessonLinkButton
        courseSlug="abap-training"
        lessonFile="97-exercise-journal-ledger-screen-check"
        slide={5}
        label="Part C: 完成コード（create_report_5）"
        variant="back"
      />
      <LessonLinkButton
        courseSlug="abap-training"
        lessonFile="19-file-output"
        slide={7}
        label="第19章: GUI_DOWNLOAD"
        variant="back"
      />
      <LessonLinkButton
        courseSlug="abap-training"
        lessonFile="96-exercise-journal-ledger-download"
        slide={6}
        label="Part B: ダウンロード基礎"
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
          title: "概要（Part D：汎用モジュールの活用）",
          plainText:
            "特別演習④ Part D — 汎用モジュールの活用\nPart C の create_report_5 を出発点に、ダウンロード処理を f_create_header / f_create_item / f_call_download に分割し、GUI_DOWNLOAD を再利用可能な形に整える。\nFILE_SAVE_DIALOG は f_select_file に改名。",
          content: (
            <>
              <hgroup>
                <h1>特別演習④ Part D — 汎用モジュールの活用</h1>
                <p>
                  Part C の <code>create_report_5</code> をコピーして <code>create_report_6</code> とし、
                  構造図どおり<strong>ダウンロード処理を分割</strong>します。
                  汎用モジュール <code>GUI_DOWNLOAD</code> の呼び出しは <code>f_call_download</code> に集約します。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "30分" },
                  { icon: "📶", text: "特別演習" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <Callout variant="note">
                <strong>構造図のイベントと FORM</strong>
                <table className="mt-2 w-full text-sm">
                  <thead>
                    <tr>
                      <th>イベント</th>
                      <th>FORM</th>
                      <th>処理</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>INITIALIZATION</code></td>
                      <td><code>f_init_main</code></td>
                      <td>Ⅰ データ初期化</td>
                    </tr>
                    <tr>
                      <td><code>AT SELECTION-SCREEN</code></td>
                      <td><code>f_check_parameters</code></td>
                      <td>Ⅰ 存在性チェック</td>
                    </tr>
                    <tr>
                      <td><code>AT SELECTION-SCREEN ON VALUE-REQUEST</code></td>
                      <td><code>f_select_file</code></td>
                      <td>ファイル保存ダイアログ</td>
                    </tr>
                    <tr>
                      <td><code>START-OF-SELECTION</code></td>
                      <td><code>f_get_data</code></td>
                      <td>Ⅰ－１ データ抽出</td>
                    </tr>
                    <tr>
                      <td><code>AT USER-COMMAND</code></td>
                      <td><code>f_download</code></td>
                      <td>
                        <code>f_create_header</code> → <code>f_call_download</code>（ヘッダ）→{" "}
                        <code>f_create_item</code> → <code>f_call_download</code>（明細）
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Callout>
              <h3>このパートで変えるもの</h3>
              <ul>
                <li>
                  Part B/C の一体型 <code>f_download</code> を、<strong>4 つの FORM</strong>に分割
                </li>
                <li>
                  <code>f_get_filename</code> → <code>f_select_file</code>（役割は同じ・名前を設計書に合わせる）
                </li>
                <li>
                  <code>GUI_DOWNLOAD</code> を <code>f_call_download</code> に集約（ヘッダ・明細で 2 回呼ぶ）
                </li>
                <li>
                  ヘッダ行は <code>fieldnames</code> ではなく、<code>g_typ_dl</code> の 1 行として出力
                </li>
              </ul>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "D-① 出発点：Part C の create_report_5 をコピー",
          plainText:
            "D-① 出発点。Part C 完成版 create_report_5 をそのままコピーして SE38 に貼り、create_report_6 として Part D の出発点にする。ダウンロードは Part B からの一体型 f_download のまま。以降のスライドで分割する。",
          content: (
            <>
              <h2>D-① ここからコピーして始めてください</h2>
              <p>
                下のコードは <strong>Part C の完成版</strong> <code>create_report_5</code> そのものです。
                これを<strong>そのままコピー</strong>して SE38 に貼り付け、新規プログラム{" "}
                <code>create_report_6</code> として<strong>このパートの出発点</strong>にしてください。
              </p>
              <Callout variant="tip">
                Part C では <code>f_download</code> の中にヘッダ組み立て・データ整形・
                <code>GUI_DOWNLOAD</code> がすべて入っています。Part D ではこの塊を分解します。
              </Callout>
              <Reveal label="出発点コード（Part C 完成版 create_report_5）を見る">
                <CodeBlock language="ABAP" code={START_PROGRAM} />
              </Reveal>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "D-② 汎用モジュールとは",
          plainText:
            "D-② 汎用モジュール。FORM との違いは他プログラムからも呼べること。GUI_DOWNLOAD / GUI_UPLOAD が代表例。メリットは再利用性、注意点はパラメータ固定化と SE37 での仕様確認。",
          content: (
            <>
              <h2>D-② 汎用モジュール（Function Module）とは</h2>
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
                      <td>定義場所</td>
                      <td>プログラム内</td>
                      <td>SE37 で登録</td>
                    </tr>
                    <tr>
                      <td>代表例</td>
                      <td><code>f_get_data</code></td>
                      <td><code>GUI_DOWNLOAD</code></td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <h3>SAP 標準の例</h3>
              <ul>
                <li><code>GUI_DOWNLOAD</code> … 内部テーブルを PC 上のファイルへ書き出す</li>
                <li><code>GUI_UPLOAD</code> … PC 上のファイルを SAP へ取り込む</li>
                <li><code>CONVERSION_EXIT_ALPHA_INPUT</code> … ゼロ埋め（例：1 → 00001）</li>
              </ul>
              <Callout variant="warning">
                使用前に <strong>SE37</strong> で IMPORT / EXPORT / TABLES / EXCEPTIONS を必ず確認してください。
                パラメータ名の typo は実行時エラーになります。
              </Callout>
              <Dialog speaker="teacher">
                実務では <code>GUI_DOWNLOAD</code> だけを直書きせず、
                <code>f_call_download</code> のような FORM に包むことが多いです。
                ファイル名や <code>append</code> の指定を 1 箇所にまとめられます。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "D-③ f_select_file（F4 ヘルプ）",
          plainText:
            "D-③ f_select_file。AT SELECTION-SCREEN ON VALUE-REQUEST FOR p_file で PERFORM f_select_file。CL_GUI_FRONTEND_SERVICES=>FILE_SAVE_DIALOG で保存先を取得。Part B/C の f_get_filename を改名するだけ。",
          content: (
            <>
              <h2>D-③ ファイル選択（f_select_file）</h2>
              <p>
                構造図では <code>F_SELECT_FILE</code> です。Part B/C の <code>f_get_filename</code> と
                <strong>処理内容は同じ</strong>で、名前だけ設計書に合わせて変更します。
              </p>
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
              <Callout variant="tip">
                実務標準は「選択画面の <code>p_file</code> → F4 でダイアログ → パス取得 → 出力」の流れを
                FORM に分離することです。
              </Callout>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "D-④ f_create_header / f_create_item",
          plainText:
            "D-④ データ整形の分割。f_create_header は g_typ_dl の 1 行に列見出しをセット。f_create_item は gt_out をループし日付は WRITE TO、金額は CURRENCY + CONDENSE。伝票番号はゼロ埋め不要（生値）。",
          content: (
            <>
              <h2>D-④ ヘッダ行とデータ行の構築</h2>
              <p>
                Part B/C では <code>fieldnames</code> パラメータでヘッダを渡していました。
                Part D では<strong>ヘッダも <code>g_typ_dl</code> の 1 行</strong>として組み立て、
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

ENDFORM.

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

    ls_dl-belnr = gs_out-belnr.    " ダウンロード時はゼロ埋め不要
    ls_dl-usnam = gs_out-usnam.
    ls_dl-gjahr = gs_out-gjahr.
    ls_dl-buzei = gs_out-buzei.
    ls_dl-hkont = gs_out-hkont.
    ls_dl-hkont_txt = gs_out-hkont_txt.
    ls_dl-shkzg = gs_out-shkzg.

    WRITE gs_out-dmbtr TO lv_dmbtr_c CURRENCY gs_out-waers.
    CONDENSE lv_dmbtr_c.
    ls_dl-dmbtr = lv_dmbtr_c.

    ls_dl-sgtxt = gs_out-sgtxt.
    ls_dl-waers = gs_out-waers.

    APPEND ls_dl TO gt_dl_item.

  ENDLOOP.

ENDFORM.`}
              />
              <Callout variant="note">
                帳票表示では伝票番号をゼロ埋めすることがありますが、
                ダウンロードファイルでは<strong>生の値で問題ありません</strong>（設計書の注記どおり）。
              </Callout>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "D-⑤ f_call_download（GUI_DOWNLOAD）",
          plainText:
            "D-⑤ f_call_download。CALL FUNCTION GUI_DOWNLOAD を FORM に集約。filetype ASC、write_field_separator X。ヘッダは append 空白、明細は append X で 2 回呼ぶ。",
          content: (
            <>
              <h2>D-⑤ 汎用モジュール呼び出し（f_call_download）</h2>
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
                <code>TABLES pt_data STRUCTURE g_typ_dl</code> は<strong>使えません</strong>。
                <code>STRUCTURE</code> は DDIC 構造向けで、<code>TYPES</code> で定義したローカル型は認識されず
                「Field &apos;G_TYP_DL&apos; is unknown」になります。
                <code>CHANGING pt_data TYPE g_typ_dl_tab</code> を使ってください。
              </Callout>
              <InfoPanel title="2 回呼ぶ理由" variant="breakdown">
                <ol>
                  <li>
                    <strong>1 回目（<code>append = &apos; &apos;</code>）</strong> … ヘッダ行で新規ファイルを作成
                  </li>
                  <li>
                    <strong>2 回目（<code>append = &apos;X&apos;</code>）</strong> … 明細行を同ファイルに追記
                  </li>
                </ol>
              </InfoPanel>
              <Callout variant="tip">
                Part B では <code>fieldnames</code> を使い 1 回の呼び出しで済ませていました。
                Part D では<strong>「整形」と「書き出し」を分離</strong>する設計です。
                どちらも実務で使われます。
              </Callout>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "D-⑥ f_download（統括処理）",
          plainText:
            "D-⑥ f_download 統括。パスチェック後、f_create_header→f_call_download（ヘッダ）→f_create_item→f_call_download（明細）の順。sy-subrc で成功/失敗メッセージ。",
          content: (
            <>
              <h2>D-⑥ ダウンロードボタン押下時の流れ（f_download）</h2>
              <CodeBlock
                language="ABAP"
                code={`AT USER-COMMAND.
  CASE sy-ucomm.
    WHEN 'DL'.
      PERFORM f_download.
  ENDCASE.

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

ENDFORM.`}
              />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                TYPES に <code>g_typ_dl_tab TYPE STANDARD TABLE OF g_typ_dl</code> を追加し、
                グローバル DATA に <code>gt_dl_header</code> / <code>gt_dl_item</code>（いずれも{" "}
                <code>TYPE g_typ_dl_tab</code>）を宣言してください。
                Part D では <code>g_typ_fname</code> は不要になります。
              </p>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "D-⑦ Part D 完成コード（差分まとめ）",
          plainText:
            "D-⑦ create_report_6 完成。f_get_filename→f_select_file。f_download 分割。g_typ_fname 削除、gt_dl_header/gt_dl_item 追加。GUI_DOWNLOAD は f_call_download に集約。",
          content: (
            <>
              <h2>D-⑦ Part D 完成コード（差分まとめ）</h2>
              <InfoPanel title="Part C から変えた箇所だけ" variant="breakdown">
                <ul>
                  <li>
                    プログラム名 … <code>create_report_5</code> → <code>create_report_6</code>
                  </li>
                  <li>
                    <code>f_get_filename</code> → <code>f_select_file</code>（処理内容は同じ）
                  </li>
                  <li>
                    一体型 <code>f_download</code> を <code>f_create_header</code> /{" "}
                    <code>f_create_item</code> / <code>f_call_download</code> に分割
                  </li>
                  <li>
                    <code>g_typ_fname</code> を削除し、ヘッダは <code>gt_dl_header</code>（<code>g_typ_dl</code>{" "}
                    1 行）で出力
                  </li>
                  <li>
                    <code>GUI_DOWNLOAD</code> … <code>filetype = &apos;ASC&apos;</code>、
                    ヘッダ・明細で 2 回呼び出し（<code>append</code> で制御）
                  </li>
                  <li>
                    帳票・抽出・チェック関連の FORM は Part C のまま
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="tip">
                <strong>コピーして完成形にする：</strong>下の「Part D 完成コード（全文）」を開き、
                全文を SE38 に貼り付けてください。
              </Callout>
              <Reveal label="Part D 完成コード（create_report_6）を見る">
                <CodeBlock language="ABAP" code={FINAL_PROGRAM} />
              </Reveal>
              <Dialog speaker="closing">
                Part D では「選択 → パス取得 → 整形 → 書き出し」の流れを FORM で分離し、
                汎用モジュール <code>GUI_DOWNLOAD</code> の呼び出しを 1 箇所にまとめました。
                修正時は <code>f_call_download</code> だけ見ればよくなります。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "理解度チェック",
          plainText:
            "理解度チェック\nQ1 汎用モジュールの例→ GUI_DOWNLOAD\nQ2 ヘッダ追記の append→ 空白（新規）\nQ3 ファイル選択 FORM→ f_select_file",
          content: (
            <>
              <h2>理解度チェック</h2>
              <LessonQuiz
                answer={1}
                question={
                  <strong>
                    SAP 標準の「ファイルダウンロード」汎用モジュールはどれ？
                  </strong>
                }
                options={["GUI_UPLOAD", "GUI_DOWNLOAD", "BAPI_ACC_DOCUMENT_POST"]}
                explanation="GUI_DOWNLOAD は内部テーブルの内容を PC 上のファイルへ書き出す汎用モジュールです。GUI_UPLOAD は逆方向（取込）です。"
              />
              <LessonQuiz
                answer={0}
                question={
                  <strong>
                    ヘッダ行を新規ファイルとして書き出すとき、<code>GUI_DOWNLOAD</code> の{" "}
                    <code>append</code> には何を渡す？
                  </strong>
                }
                options={["空白（&apos; &apos;）", "'X'", "'ASC'"]}
                explanation="append = 空白で新規作成、append = 'X' で既存ファイルに追記します。明細行は 2 回目に 'X' を渡します。"
              />
              <LessonQuiz
                answer={2}
                question={
                  <strong>
                    構造図の <code>F_SELECT_FILE</code> に相当する FORM は？
                  </strong>
                }
                options={["f_create_header", "f_call_download", "f_select_file"]}
                explanation="AT SELECTION-SCREEN ON VALUE-REQUEST FOR p_file から呼ばれ、FILE_SAVE_DIALOG で保存先パスを取得します。"
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ExerciseJournalLedgerFunctionModuleLesson);
