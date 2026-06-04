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
import { partBFinalProgram } from "./96-exercise-journal-ledger-download";
import { partCFinalProgram } from "./journal-ledger-part-c-program";

export const lessonMeta = {
  title: "特別演習④ Part C — 選択画面の初期化・入力チェックと会社マスタ拡張",
  meta: "特別 · 30分",
};

/** 出発点：Part B 完成コード create_report_4（96-exercise の B-⑧ と同一） */
const START_PROGRAM = partBFinalProgram;

/** Part C 完成形：create_report_5 全文（Part B + 初期化・チェック・butxt） */
const FINAL_PROGRAM = partCFinalProgram;

function ReferenceLinks() {
  return (
    <div className="mt-4 flex flex-wrap justify-end gap-2">
      <LessonLinkButton
        courseSlug="abap-training"
        lessonFile="96-exercise-journal-ledger-download"
        slide={8}
        label="Part B: 完成コード（create_report_4）"
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
        lessonFile="11-document-posting"
        slide={8}
        label="第11章: イベント駆動処理"
        variant="back"
      />
    </div>
  );
}

export default function ExerciseJournalLedgerScreenCheckLesson() {
  return (
    <Lesson
      chrome={lessonChrome(
        "abap-training",
        "97-exercise-journal-ledger-screen-check",
        lessonMeta.title
      )}
      slides={[
        {
          title: "概要（Part C：初期化・入力チェック・マスタ拡張）",
          plainText:
            "特別演習④ Part C — 選択画面の初期化・入力チェックと会社マスタ拡張\nPart B の create_report_4 を出発点に、構造図どおり INITIALIZATION→f_init_main（Ⅰ データ初期化）/ AT SELECTION-SCREEN→f_check_parameters（Ⅰ 存在性チェック）を足す。\nあわせて T001 から butxt 取得と帳票・ダウンロードへの反映。",
          content: (
            <>
              <hgroup>
                <h1>特別演習④ Part C — 選択画面の初期化・入力チェックと会社マスタ拡張</h1>
                <p>
                  Part B の <code>create_report_4</code> をコピーして <code>create_report_5</code> とし、
                  構造図「仕訳日記帳 入力パラメータ」どおり<strong>イベントと FORM の対応</strong>を整えます。
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
                      <td>Ⅰ データ初期化（入力パラメータの初期値）</td>
                    </tr>
                    <tr>
                      <td><code>AT SELECTION-SCREEN</code></td>
                      <td><code>f_check_parameters</code></td>
                      <td>Ⅰ 存在性チェック</td>
                    </tr>
                    <tr>
                      <td><code>START-OF-SELECTION</code></td>
                      <td><code>f_get_data</code></td>
                      <td>Ⅰ－１ データ抽出（T001 の <code>butxt</code> 含む）</td>
                    </tr>
                  </tbody>
                </table>
              </Callout>
              <h3>このパートで足すもの</h3>
              <ul>
                <li>
                  <code>INITIALIZATION</code> → <code>f_init_main</code> … 転記日付を「当月1日〜本日」で初期表示
                </li>
                <li>
                  <code>AT SELECTION-SCREEN</code> → <code>f_check_parameters</code> … 会社コードのマスタ存在・日付範囲
                </li>
                <li>
                  <code>g_typ_t001</code> に <code>butxt</code> を追加し、帳票ヘッダとダウンロード列に反映
                </li>
                <li>
                  Part B で <code>START-OF-SELECTION</code> にあった <code>f_init_main</code> の作業領域クリアは{" "}
                  <code>f_get_data</code> 先頭へ移動
                </li>
              </ul>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "C-① 出発点：Part B の create_report_4 をコピー",
          plainText:
            "C-① 出発点。Part B 完成版 create_report_4 をそのままコピーして SE38 に貼り、create_report_5 として Part C の出発点にする。INITIALIZATION は空枠、AT SELECTION-SCREEN は VALUE-REQUEST のみ。f_get_ktopl は ktopl/waers のみ。以降のスライドで初期化・入力チェック・butxt を足す。",
          content: (
            <>
              <h2>C-① ここからコピーして始めてください</h2>
              <p>
                下のコードは <strong>Part B の完成版</strong> <code>create_report_4</code> そのものです。
                これを<strong>そのままコピー</strong>して SE38 に貼り付け、新規プログラム{" "}
                <code>create_report_5</code> として<strong>このパートの出発点</strong>にしてください。
                以降のスライドでは、選択画面の初期化・入力チェック・会社名の取得を足していきます。
              </p>
              <Callout variant="tip">
                <strong>コピーして始める：</strong>下の「出発点コード（Part B 完成版）を見る」を開き、全文を SE38 の新規プログラム
                <code>create_report_5</code> に貼り付けてから、C-② 以降を読み進めてください。
                Part B をまだ終えていない場合は、Part B の B-⑧（完成コード全文）を使ってください。
              </Callout>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Part B では <code>INITIALIZATION.</code> が<strong>空のまま</strong>残っており、
                入力チェックは <code>f_download</code> 内のファイルパス確認だけです。Part C ではここを仕様どおり整えます。
              </p>
              <Reveal label="出発点コード（Part B 完成版 create_report_4）を見る">
                <CodeBlock language="ABAP" code={START_PROGRAM} />
              </Reveal>
              <Dialog speaker="b">
                Part B で動かした <code>create_report_4</code> と同じコードですね。安心しました。
              </Dialog>
              <Dialog speaker="teacher">
                実務の設計書では「INITIALIZE-SCREEN」「ATTRIBUTE-SCREEN」と書かれていても、
                レポートなら <code>INITIALIZATION</code> と <code>AT SELECTION-SCREEN</code> に読み替えます。
                <br />
                まずは Part B の完成コードをコピーするところから始めましょう。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "C-② INITIALIZATION：f_init_main（Ⅰ データ初期化）",
          plainText:
            "C-② f_init_main。INITIALIZATION で PERFORM f_init_main。s_budat を当月1日〜sy-datum で APPEND。Part B では START-OF-SELECTION にあった同名 FORM の作業領域クリアは f_get_data 先頭へ移す。",
          content: (
            <>
              <h2>C-② データ初期化（f_init_main）</h2>
              <p>
                <code>INITIALIZATION</code> から <code>f_init_main</code> を呼び、
                転記日付の<strong>初期値</strong>をセットします。
              </p>
              <CodeBlock
                language="ABAP"
                code={`INITIALIZATION.
  PERFORM f_init_main.

FORM f_init_main.

  DATA: lv_first TYPE sy-datum.

  CLEAR s_budat[].
  lv_first = sy-datum.
  lv_first+6(2) = '01'.          " 当月1日

  s_budat-sign   = 'I'.
  s_budat-option = 'BT'.
  s_budat-low    = lv_first.
  s_budat-high   = sy-datum.
  APPEND s_budat.

ENDFORM.`}
              />
              <Callout variant="tip">
                Part B まで <code>f_init_main</code> は <code>START-OF-SELECTION</code> で作業領域を{" "}
                <code>CLEAR</code> していました。構造図に合わせ、<strong>同名 FORM は INITIALIZATION 専用</strong>
                （入力パラメータ初期化）にし、クリア処理は <code>f_get_data</code> の先頭へ移します。
              </Callout>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "C-③ AT SELECTION-SCREEN：f_check_parameters（Ⅰ 存在性チェック）",
          plainText:
            "C-③ f_check_parameters。AT SELECTION-SCREEN で PERFORM f_check_parameters。会社コードの T001 存在、転記日付 From≤To を MESSAGE e000 で止める。",
          content: (
            <>
              <h2>C-③ 存在性チェック（f_check_parameters）</h2>
              <p>構造図どおり、実行前に <code>f_check_parameters</code> で入力値を検証します。</p>
              <InfoPanel title="チェック一覧（仕様表の写し）" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>項目</th>
                      <th>チェック内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>会社コード <code>p_bukrs</code></td>
                      <td>必須（OBLIGATORY）＋ T001 に存在すること</td>
                    </tr>
                    <tr>
                      <td>転記日付 <code>s_budat</code></td>
                      <td>必須 ＋ 上限日 ≧ 下限日</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <CodeBlock
                language="ABAP"
                code={`AT SELECTION-SCREEN.
  PERFORM f_check_parameters.

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
  IF sy-subrc = 0
     AND s_budat-high IS NOT INITIAL
     AND s_budat-low  IS NOT INITIAL
     AND s_budat-high < s_budat-low.
    MESSAGE e000(z01) WITH '転記日付の範囲が不正です'.
  ENDIF.

ENDFORM.`}
              />
              <Callout variant="warning">
                <code>MESSAGE ... TYPE 'E'</code>（または <code>e000</code>）は実行を止めます。
                ダウンロード時の <code>s000</code>（情報）とは役割が異なります。
              </Callout>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "C-④ データ抽出 2a：T001 会社名の取得",
          plainText:
            "C-④ g_typ_t001 に butxt 追加。f_get_ktopl の SELECT に butxt を足す。f_write_head で会社コードの横に gs_t001-butxt を表示。g_typ_dl / f_download に会社名列を追加。",
          content: (
            <>
              <h2>C-④ マスタ主要情報の拡張（2a）</h2>
              <p>
                仕様の「2a. 会員マスタのメイン情報取得」に相当するのが、
                ここでは<strong>会社コードマスタ T001 から会社名を追加取得</strong>することです。
              </p>
              <CodeBlock
                language="ABAP"
                code={`*>>> g_typ_t001 に butxt を追加
TYPES: BEGIN OF g_typ_t001,
         ktopl TYPE t001-ktopl,
         waers TYPE t001-waers,
         butxt TYPE t001-butxt,
       END OF g_typ_t001.

FORM f_get_ktopl.
  SELECT SINGLE ktopl waers butxt
    INTO CORRESPONDING FIELDS OF gs_t001
    FROM t001
    WHERE bukrs = p_bukrs.
ENDFORM.

*>>> 帳票ヘッダ（f_write_head）の変更
  WRITE: /1  '会社コード:',
          13 p_bukrs,
          20 gs_t001-butxt.`}
              />
              <MermaidDiagram
                chart={`flowchart TD
  INIT["INITIALIZATION"] --> FIM["PERFORM f_init_main\\nⅠ データ初期化"]
  SCR["選択画面"] --> ASS["AT SELECTION-SCREEN"]
  ASS --> FCP["PERFORM f_check_parameters\\nⅠ 存在性チェック"]
  FCP --> SOS["START-OF-SELECTION"]
  SOS --> FGD["PERFORM f_get_data\\nⅠ－１ データ抽出"]
  FGD --> T001["f_get_ktopl: butxt 取得"]
  INIT --> SCR`}
              />
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "C-⑤ Part C 完成コード（差分まとめ）",
          plainText:
            "C-⑤ create_report_5 完成。INITIALIZATION→f_init_main、AT SELECTION-SCREEN→f_check_parameters。START-OF-SELECTION は f_get_data のみ。g_typ_t001/g_typ_dl の butxt 追加。",
          content: (
            <>
              <h2>C-⑤ Part C 完成コード（差分まとめ）</h2>
              <InfoPanel title="Part B から変えた箇所だけ" variant="breakdown">
                <ul>
                  <li>
                    プログラム名 … <code>create_report_4</code> → <code>create_report_5</code>
                  </li>
                  <li>
                    <code>INITIALIZATION</code> → <code>PERFORM f_init_main</code>（データ初期化）
                  </li>
                  <li>
                    <code>AT SELECTION-SCREEN</code> → <code>PERFORM f_check_parameters</code>（存在性チェック）
                  </li>
                  <li>
                    <code>START-OF-SELECTION</code> … <code>f_init_main</code> を外し <code>f_get_data</code> のみ
                  </li>
                  <li>
                    新規 <code>FORM</code> … <code>f_check_parameters</code>（<code>f_init_main</code> は INITIALIZATION 用に再定義）
                  </li>
                  <li>
                    構造 … <code>g_typ_t001</code> / <code>g_typ_dl</code> に <code>butxt</code>
                  </li>
                  <li>
                    変更 <code>FORM</code> … <code>f_get_ktopl</code> / <code>f_write_head</code> /{" "}
                    <code>f_download</code>（会社名列）
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="tip">
                <strong>コピーして完成形にする：</strong>下の「Part C 完成コード（全文）」を開き、
                全文を SE38 に貼り付けてください（<code>f_download</code> など Part B の FORM もすべて含みます）。
              </Callout>
              <Reveal label="Part C 完成コード（create_report_5）を見る">
                <CodeBlock language="ABAP" code={FINAL_PROGRAM} />
              </Reveal>
              <Dialog speaker="closing">
                Part C では「入口の設計」（初期値・チェック）と「マスタ情報の拡張」を足しました。
                帳票の見た目とダウンロード列が1段リッチになり、Part B のダウンロード機能はそのまま使えます。
                次は Part D でダウンロード処理を分割し、汎用モジュール <code>GUI_DOWNLOAD</code> の呼び出しを整理します。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "理解度チェック",
          plainText:
            "理解度チェック\nQ1 Ⅰ データ初期化の FORM→ f_init_main（INITIALIZATION）\nQ2 存在性チェックの FORM→ f_check_parameters\nQ3 butxt 取得→ START-OF-SELECTION 内 f_get_ktopl",
          content: (
            <>
              <h2>理解度チェック</h2>
              <LessonQuiz
                answer={1}
                question={
                  <strong>構造図の「Ⅰ データ初期化」を担当する FORM と、呼び出すイベントは？</strong>
                }
                options={[
                  "f_check_parameters / AT SELECTION-SCREEN",
                  "f_init_main / INITIALIZATION",
                  "f_get_data / START-OF-SELECTION",
                ]}
                explanation="INITIALIZATION で f_init_main を呼び、選択画面の入力パラメータ（ここでは s_budat の初期値）をセットします。"
              />
              <LessonQuiz
                answer={0}
                question={
                  <strong>構造図の「Ⅰ 存在性チェック」を担当する FORM は？</strong>
                }
                options={[
                  "f_check_parameters",
                  "f_init_main",
                  "f_write_head",
                ]}
                explanation="AT SELECTION-SCREEN で f_check_parameters を呼び、会社コードのマスタ存在などを確認してから実行します。"
              />
              <LessonQuiz
                answer={0}
                question={
                  <strong>
                    <code>butxt</code>（会社名）はいつ T001 から取得する？
                  </strong>
                }
                options={[
                  "START-OF-SELECTION 内の f_get_ktopl（データ抽出フェーズ）",
                  "INITIALIZATION の f_init_main",
                  "AT SELECTION-SCREEN の f_check_parameters",
                ]}
                explanation="f_init_main は入力初期値、f_check_parameters は存在性チェックです。マスタからの本取得は START-OF-SELECTION → f_get_data → f_get_ktopl で行います。"
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ExerciseJournalLedgerScreenCheckLesson);
