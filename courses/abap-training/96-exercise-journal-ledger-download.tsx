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
import { partBFinalProgram } from "./journal-ledger-part-b-program";

export const lessonMeta = {
  title: "特別演習④ Part B — GUIステータスとボタン設定",
  meta: "特別 · 25分",
};

/** 他レッスンから参照する Part B 完成コード */
export { partBFinalProgram };

const START_PROGRAM = partAFinalProgram;
const FINAL_PROGRAM = partBFinalProgram;

function ReferenceLinks() {
  return (
    <div className="mt-4 flex flex-wrap justify-end gap-2">
      <LessonLinkButton
        courseSlug="abap-training"
        lessonFile="19-file-output"
        slide={2}
        label="ファイル出力: GUI設定手順（全体像）"
      />
      <LessonLinkButton
        courseSlug="abap-training"
        lessonFile="95-exercise-journal-ledger-modularization"
        slide={9}
        label="Part A: 構造化の完成コード（出発点）"
        variant="back"
      />
      <LessonLinkButton
        courseSlug="abap-training"
        lessonFile="98-exercise-journal-ledger-function-module"
        slide={1}
        label="Part D: ダウンロード処理（次のステップ）"
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
          title: "概要（Part B：GUIステータスとボタン設定）",
          plainText:
            "特別演習④ Part B — GUIステータスとボタン設定\nPart A で構造化した create_report_3 を出発点に、帳票画面に「ダウンロード」ボタンを表示する GUI 設定を足す。\n主な追加: 定数 c_gui_status / c_gui_title、START-OF-SELECTION での SET PF-STATUS / SET TITLEBAR、SE41 での S0010・T0010 登録。\nボタン押下時の処理（AT USER-COMMAND / ファイル出力）は Part D で実装する。",
          content: (
            <>
              <hgroup>
                <h1>特別演習④ Part B — GUIステータスとボタン設定</h1>
                <p>
                  Part A で構造化した <code>create_report_3</code> を出発点に、帳票画面の左上に
                  <strong>「ダウンロード」ボタン</strong>を<strong>表示できる状態</strong>にします。
                  このパートでは<strong>ボタンの見た目と GUI 設定</strong>まで。押したときの処理は Part D です。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "25分" },
                  { icon: "📶", text: "特別演習" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <Callout variant="note">
                <strong>Part B と Part D の分担</strong>
                <ul className="mt-2">
                  <li>
                    <strong>Part B（このパート）</strong> … <code>SET PF-STATUS</code> /{" "}
                    <code>SET TITLEBAR</code> と SE41 登録でボタンを<strong>画面に出す</strong>
                  </li>
                  <li>
                    <strong>Part D</strong> … <code>AT USER-COMMAND</code> と{" "}
                    <code>GUI_DOWNLOAD</code> でボタン押下時に<strong>ファイルを保存する</strong>
                  </li>
                </ul>
              </Callout>
              <h3>このパートで足すもの</h3>
              <ul>
                <li>
                  定数 <code>c_gui_status</code>（<code>S0010</code>）と{" "}
                  <code>c_gui_title</code>（<code>T0010</code>）（B-③）
                </li>
                <li>
                  <code>START-OF-SELECTION</code> 先頭の <code>SET PF-STATUS</code> /{" "}
                  <code>SET TITLEBAR</code>（B-③）
                </li>
                <li>
                  SE41 でステータス <code>S0010</code> に機能コード <code>DL</code> を登録（B-④）
                </li>
              </ul>
              <ReferenceLinks />
              <Dialog speaker="teacher">
                Part A までで帳票は完成しました。次は画面に<strong>ツールバーボタン</strong>を足します。
                まずは「ボタンが見える状態」を作り、実際のダウンロード処理は Part D に回します。
              </Dialog>
            </>
          ),
        },
        {
          title: "B-① 出発点：Part A の構造化コード",
          plainText:
            "B-① 出発点。Part A で構造化した create_report_3（FORM/PERFORM 版）をそのまま使う。\nPart B では新規プログラム create_report_4 としてコピーし、GUI ステータス／タイトルの定数と SET 文だけを足していく。",
          content: (
            <>
              <h2>B-① 出発点は Part A の完成コード</h2>
              <p>
                下のコードは <strong>Part A の完成版</strong> <code>create_report_3</code>（構造化済み）です。
                Part B では、これを新規プログラム <code>create_report_4</code> としてコピーし、
                <strong>GUI 設定だけ</strong>を足していきます。
              </p>
              <Reveal label="出発点コード（Part A 構造化版）を見る">
                <CodeBlock language="ABAP" code={START_PROGRAM} />
              </Reveal>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "B-② 全体像：GUI ボタンを出すまで",
          plainText:
            "B-② 全体像。Part B で追加するのは定数2つと START-OF-SELECTION 先頭の SET 文2行。SE41 で S0010 に DL ボタン、T0010 に表題を登録。\nAT USER-COMMAND や GUI_DOWNLOAD は Part D の範囲。",
          content: (
            <>
              <h2>B-② どこに何を足すか（全体像）</h2>
              <p>
                Part B でコードに足すのは<strong>定数 2 つ</strong>と<strong>SET 文 2 行</strong>だけです。
                ボタンの中身（押下時の処理）は Part D で接続します。
              </p>
              <MermaidDiagram
                chart={`flowchart TD
  SOS["START-OF-SELECTION"] --> STATUS["SET PF-STATUS c_gui_status\\nSET TITLEBAR c_gui_title（Part B で追加）"]
  SOS --> EXIST["PERFORM f_init_main / f_get_data\\n（Part A のまま）"]
  SE41["SE41: S0010 に DL ボタン登録\\nT0010 に表題登録（Part B で必須）"]
  STATUS --> BTN["帳票画面に DL ボタン表示"]
  SE41 --> BTN
  BTN -.->|"Part D"| UC["AT USER-COMMAND → f_download"]`}
              />
              <InfoPanel title="Part B / Part D の分担" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>処理</th>
                      <th>パート</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>SET PF-STATUS</code> / <code>SET TITLEBAR</code>
                      </td>
                      <td>Part B</td>
                    </tr>
                    <tr>
                      <td>SE41 で <code>S0010</code> / <code>T0010</code> 登録</td>
                      <td>Part B</td>
                    </tr>
                    <tr>
                      <td>
                        <code>AT USER-COMMAND</code> / <code>f_download</code> /{" "}
                        <code>GUI_DOWNLOAD</code>
                      </td>
                      <td>Part D</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="warning">
                <strong>コードだけではボタンは出ません。</strong>機能コード <code>DL</code> は SE41 で{" "}
                <code>S0010</code> に登録して初めて表示されます。
              </Callout>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "B-③ 定数と SET PF-STATUS / SET TITLEBAR",
          plainText:
            "B-③ 定数 c_gui_status（S0010）・c_gui_title（T0010）を CONSTANTS に追加。START-OF-SELECTION の先頭で SET PF-STATUS と SET TITLEBAR を呼ぶ。既存の PERFORM f_init_main / f_get_data はそのまま。",
          content: (
            <>
              <h2>B-③ 定数と GUI 設定</h2>
              <p>
                帳票画面に独自ツールバーを出すには、<code>START-OF-SELECTION</code> の<strong>先頭</strong>で
                ステータスとタイトルをセットします。値は定数で宣言しておきます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`CONSTANTS: c_spras       TYPE t003t-spras VALUE 'J',
           c_shkzg_s    TYPE bseg-shkzg  VALUE 'S',
           c_shkzg_h    TYPE bseg-shkzg  VALUE 'H',
           c_gui_status TYPE sy-pfkey    VALUE 'S0010', " GUI_STATUS
           c_gui_title  TYPE c LENGTH 20 VALUE 'T0010'. " GUI_TITLE`}
              />
              <CodeBlock
                language="ABAP"
                code={`START-OF-SELECTION.

*>>> 追加: GUIステータス・タイトルの設定
  SET PF-STATUS c_gui_status.   " ツールバー（DL ボタンを含む）
  SET TITLEBAR  c_gui_title.    " 画面タイトル「仕訳日記帳 演習4」

  PERFORM f_init_main.      " Ⅰ データ初期化（既存）
  PERFORM f_get_data.       " Ⅱ データ抽出（既存）`}
              />
              <InfoPanel title="2つの SET 文の役割" variant="breakdown">
                <ul>
                  <li>
                    <code>SET PF-STATUS c_gui_status</code> … どんなボタンを出すかを決める
                    （SE41 で <code>S0010</code> を登録）
                  </li>
                  <li>
                    <code>SET TITLEBAR c_gui_title</code> … 画面のタイトルを決める（SE41 で{" "}
                    <code>T0010</code> を登録）
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="note">
                ボタンが押されたときの処理（<code>AT USER-COMMAND</code> で <code>sy-ucomm = &apos;DL&apos;</code>
                を受け取る）は<strong>Part D</strong>で実装します。Part B ではボタンを<strong>表示する</strong>ところまでです。
              </Callout>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "B-④ SE41 登録（必須）",
          plainText:
            "B-④ SE41 登録。T0010 の表題を『仕訳日記帳 演習4』、S0010 に DL ボタンを AP ツールバーに追加。保存と有効化を忘れない。詳細手順は追加コンテンツ「ファイル出力」参照。",
          content: (
            <>
              <h2>B-④ SE41 登録（必須）</h2>
              <p>
                <code>S0010</code>（ステータス）と <code>T0010</code>（タイトル）の SE41 登録手順は、
                追加コンテンツ<strong>「ファイル出力」</strong>で詳しく説明しています。
              </p>
              <InfoPanel title="本演習での設定値" variant="reference">
                <ul>
                  <li>
                    表題コード <code>T0010</code> … 表題：<strong>仕訳日記帳 演習4</strong>
                  </li>
                  <li>
                    ステータス <code>S0010</code> … 機能コード <code>DL</code>（ダウンロード）を AP ツールバーに追加
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="warning">
                コードだけでは動きません。SE41 で登録したあとは、<strong>保存と有効化</strong>まで完了してください。
                この時点では DL ボタンを押しても<strong>何も起きません</strong>（Part D で処理を接続します）。
              </Callout>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="19-file-output"
                slide={4}
                label="ファイル出力: GUI設定手順（PF-STATUS）"
                className="mb-4"
              />
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "B-⑤ Part B 完成コード（全文）",
          plainText:
            "B-⑤ Part B 完成コード create_report_4。Part A に定数 c_gui_status/c_gui_title と START-OF-SELECTION 先頭の SET 文を足した完成形。ダウンロード処理は含まない。SE41 登録後、帳票画面に DL ボタンが表示される。",
          content: (
            <>
              <h2>B-⑤ Part B 完成コード（全文）</h2>
              <p>
                Part A の <code>create_report_3</code> に、Part B の GUI 設定だけを足した
                <strong>完成版</strong> <code>create_report_4</code> です。
              </p>
              <InfoPanel title="Part A から足した箇所だけ" variant="breakdown">
                <ul>
                  <li>
                    定数 <code>c_gui_status</code> / <code>c_gui_title</code>（B-③）
                  </li>
                  <li>
                    <code>START-OF-SELECTION</code> 先頭の <code>SET PF-STATUS</code> /{" "}
                    <code>SET TITLEBAR</code>（B-③）
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="note">
                実行前に SE41 で <code>S0010</code> / <code>T0010</code> を登録し（B-④）、
                列見出し <code>TEXT-001</code>〜<code>TEXT-010</code> を SE38 の <strong>Text elements</strong> に
                登録しておきます（演習③・Part A と同じ）。
              </Callout>
              <Reveal label="Part B 完成コード（create_report_4・全体）を見る">
                <CodeBlock language="ABAP" code={FINAL_PROGRAM} />
              </Reveal>
              <Dialog speaker="teacher">
                これで Part B は完成です。帳票画面に DL ボタンが表示されます。
                <br />
                次は Part C で選択画面の初期化・入力チェックを整え、Part D でボタンにダウンロード処理を接続します。
              </Dialog>
              <ReferenceLinks />
            </>
          ),
        },
        {
          title: "理解度チェック",
          plainText:
            "理解度チェック\nQ1 SET PF-STATUS の役割→ 帳票画面に出すボタン（GUIステータス）を指定する\nQ2 DL ボタンを出すために必須の作業→ SE41 で S0010 に DL を登録\nQ3 ボタン押下時の処理を実装するパート→ Part D",
          content: (
            <>
              <h2>理解度チェック</h2>
              <p>Part B の要点を3問で確認します。</p>
              <LessonQuiz
                answer={1}
                question={
                  <strong>
                    <code>SET PF-STATUS c_gui_status</code> の役割は？
                  </strong>
                }
                options={[
                  "選択画面の入力チェックを行う",
                  "帳票画面に表示するボタン（GUIステータス）を指定する",
                  "ファイルを PC にダウンロードする",
                ]}
                explanation="SET PF-STATUS は「どの GUI ステータス（ツールバー定義）を使うか」を指定します。S0010 の中身（DL ボタンなど）は SE41 で登録します。"
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
                  "特になし。SET PF-STATUS を書けば自動でボタンが出る",
                  "SE38 の Text elements に DL を登録する",
                  "SE41 で GUIステータス S0010 を登録し、機能コード DL を APツールバーに追加する",
                ]}
                explanation="SET PF-STATUS は「S0010 を使う」という指定にすぎません。DL ボタンは SE41 で S0010 に登録して初めて表示されます。"
              />
              <LessonQuiz
                answer={2}
                question={
                  <strong>
                    DL ボタン押下時に <code>GUI_DOWNLOAD</code> でファイルを保存する処理は、どのパートで実装する？
                  </strong>
                }
                options={["Part B", "Part C", "Part D"]}
                explanation="Part B はボタンの表示（GUI 設定）まで。Part C は選択画面の初期化・入力チェック。Part D で AT USER-COMMAND とダウンロード処理を足します。"
              />
              <Dialog speaker="closing">
                お疲れさまでした。Part B では<strong>GUI ステータスとボタン表示</strong>までを整えました。
                コードと SE41 の登録は<strong>セット</strong>——これを忘れないでください。
                ダウンロード機能は Part D で接続します。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ExerciseJournalLedgerDownloadLesson);
