import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CodeBlock,
  Quiz,
  MermaidDiagram,
  InfoPanel,
  LessonMeta,
  LessonLinkButton,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "ファイル出力 — PCへのダウンロードとデータ整形",
  meta: "初学者 · 20分",
};

export default function FileOutputLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-training", "19-file-output", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "ファイル出力\n帳票画面で見た結果を、PC上のファイル（Excelなど）として保存する方法を学びます。\n⏱ 20分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・画面出力（WRITE）とファイル出力の違い\n・WRITE ... TO ... によるデータ整形\n・ファイル保存ダイアログ（保存先の選択）\n・GUI_DOWNLOAD によるPCへのダウンロード",
          content: (
            <>
              <hgroup>
                <h1>ファイル出力</h1>
                <p>帳票画面で見た結果を、PC 上のファイル（Excel など）として保存する方法を学びます。</p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "20分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>画面出力（<code>WRITE</code>）とファイル出力の違い</li>
                <li>
                  <code>WRITE ... TO ...</code> によるデータ整形
                </li>
                <li>ファイル保存ダイアログ（保存先の選択）</li>
                <li>
                  <code>GUI_DOWNLOAD</code> による PC へのダウンロード
                </li>
                <li>
                  SE41 による GUI ステータス／タイトルの登録（ボタン表示の前提）
                </li>
              </ul>
              <Callout variant="note">
                サーバ上のファイルを<strong>読み込む</strong>処理（<code>OPEN DATASET</code> など）は
                追加コンテンツ「ファイル連携とバッチ」（第15章相当）で扱います。
                本章は<strong>出力・ダウンロード</strong>に集中します。
              </Callout>
            </>
          ),
        },
        {
          title: "画面出力とファイル出力",
          plainText:
            "画面出力とファイル出力\nWRITE＝SAP画面（リスト）へ表示。GUI_DOWNLOAD＝ユーザーのPCへファイル保存。\n流れ：内部テーブル→整形→GUI_DOWNLOAD→PC上のファイル。\n実務では帳票画面にダウンロードボタンを足し、AT USER-COMMANDで書き出し処理を呼ぶ。",
          content: (
            <>
              <h2>画面出力とファイル出力</h2>
              <InfoPanel title="2つの出力先" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>種類</th>
                      <th>命令（例）</th>
                      <th>出力先</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>画面出力</td>
                      <td>
                        <code>WRITE</code>
                      </td>
                      <td>SAP のリスト画面</td>
                    </tr>
                    <tr>
                      <td>ファイル出力</td>
                      <td>
                        <code>GUI_DOWNLOAD</code>
                      </td>
                      <td>ユーザーの PC（Excel など）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <MermaidDiagram
                chart={`flowchart LR
  T[(内部テーブル)] --> F[WRITE TO で整形]
  F --> D[GUI_DOWNLOAD]
  D --> P[PC上のファイル]`}
              />
              <Dialog speaker="b">
                画面で見える帳票を、そのまま Excel に落としたい、という要望が多いんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。画面の <code>WRITE</code> とファイル出力は<strong>別の経路</strong>です。
                内部テーブルのデータを一度整形してから、<code>GUI_DOWNLOAD</code> で PC に渡します。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="07-output-report"
                slide={1}
                label="第7章: 画面出力（WRITE）を復習する"
                variant="back"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "データ整形（WRITE TO）",
          plainText:
            "データ整形\nGUI_DOWNLOADに渡す前に、日付・金額などを見やすい文字列に変換する。\nWRITE gs_out-budat TO lv_budat_c USING EDIT MASK '____/__/__'。\nWRITE gs_out-dmbtr TO lv_dmbtr_c CURRENCY gs_out-waers。CONDENSEで空白を詰める。\nダウンロード用の型は全項目文字型にするのが定石。",
          content: (
            <>
              <h2>データ整形（<code>WRITE ... TO ...</code>）</h2>
              <p>
                <code>GUI_DOWNLOAD</code> に渡す前に、日付・金額などを<strong>見やすい文字列</strong>に変換します。
                数値型・日付型のまま渡すと、Excel 側で書式が崩れやすいためです。
              </p>
              <CodeBlock
                language="ABAP"
                code={`DATA: lv_budat_c TYPE c LENGTH 10,
        lv_dmbtr_c TYPE c LENGTH 16.

" 日付 → ____/__/__ 形式の文字列
WRITE gs_out-budat TO lv_budat_c USING EDIT MASK '____/__/__'.
ls_dl-budat = lv_budat_c.

" 金額 → 通貨編集済みの文字列
WRITE gs_out-dmbtr TO lv_dmbtr_c CURRENCY gs_out-waers.
CONDENSE lv_dmbtr_c.
ls_dl-dmbtr = lv_dmbtr_c.`}
              />
              <Callout variant="tip">
                ダウンロード用の行型（例：<code>g_typ_dl</code>）は、<strong>全項目を文字型</strong>にしておくと
                整形結果をそのまま詰めやすくなります。
              </Callout>
              <Dialog speaker="a">
                画面の <code>WRITE</code> と同じ整形命令を、文字変数に向けて使うイメージですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "ファイル保存ダイアログ",
          plainText:
            "ファイル保存ダイアログ\nCL_GUI_FRONTEND_SERVICES=>FILE_SAVE_DIALOG で保存先を選ぶ。\n選択画面のパラメータ p_file と AT SELECTION-SCREEN ON VALUE-REQUEST を組み合わせる。\nPERFORM f_get_filename として FORM に分けると読みやすい。",
          content: (
            <>
              <h2>ファイル保存ダイアログ</h2>
              <p>
                保存先のパスは、<strong>ファイル保存ダイアログ</strong>でユーザーに選んでもらいます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`DATA lv_path TYPE string.

CALL METHOD cl_gui_frontend_services=>file_save_dialog
  EXPORTING
    default_extension = 'xls'
    default_file_name = 'journal_ledger'
  CHANGING
    filename          = lv_path
  EXCEPTIONS
    OTHERS            = 1.

IF sy-subrc = 0.
  p_file = lv_path.
ENDIF.`}
              />
              <p>選択画面との組み合わせ：</p>
              <CodeBlock
                language="ABAP"
                code={`PARAMETERS p_file TYPE string LOWER CASE.

AT SELECTION-SCREEN ON VALUE-REQUEST FOR p_file.
  PERFORM f_get_filename.`}
              />
              <Dialog speaker="teacher">
                ダイアログ表示は <code>FORM f_get_filename</code> に分け、
                <code>AT SELECTION-SCREEN ON VALUE-REQUEST</code> から呼ぶのが定番です。
              </Dialog>
            </>
          ),
        },
        {
          title: "GUI_DOWNLOAD",
          plainText:
            "GUI_DOWNLOAD\nCALL FUNCTION 'GUI_DOWNLOAD' で内部テーブルをPCへ書き出す。\nfilename＝保存先パス、filetype='DAT'、write_field_separator='X'（タブ区切り）でExcelが列に分かれて開ける。\nTABLES data_tab＝データ行、fieldnames＝列見出し行。sy-subrc=0で成功。",
          content: (
            <>
              <h2>
                <code>GUI_DOWNLOAD</code>
              </h2>
              <p>整形済みの内部テーブルを、PC 上のファイルとして書き出します。</p>
              <CodeBlock
                language="ABAP"
                code={`CALL FUNCTION 'GUI_DOWNLOAD'
  EXPORTING
    filename                = p_file
    filetype                = 'DAT'
    write_field_separator   = 'X'    " タブ区切り
  TABLES
    data_tab                = lt_dl
    fieldnames              = lt_fname
  EXCEPTIONS
    OTHERS                  = 1.

IF sy-subrc = 0.
  MESSAGE 'ダウンロードが完了しました' TYPE 'S'.
ELSE.
  MESSAGE 'ダウンロードに失敗しました' TYPE 'E'.
ENDIF.`}
              />
              <InfoPanel title="主要パラメータ" variant="breakdown">
                <ul>
                  <li>
                    <strong>
                      <code>filename</code>
                    </strong>{" "}
                    … 保存先のフルパス（<code>p_file</code> など）
                  </li>
                  <li>
                    <strong>
                      <code>filetype = &apos;DAT&apos;</code>
                    </strong>{" "}
                    … テキスト形式（Excel で開ける）
                  </li>
                  <li>
                    <strong>
                      <code>write_field_separator = &apos;X&apos;</code>
                    </strong>{" "}
                    … タブ区切り（列が分かれて Excel で開ける）
                  </li>
                  <li>
                    <strong>
                      <code>data_tab</code>
                    </strong>{" "}
                    … データ行の内部テーブル
                  </li>
                  <li>
                    <strong>
                      <code>fieldnames</code>
                    </strong>{" "}
                    … 1行目の列見出し
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="warning">
                書き出し前に <code>p_file</code> が空でないか確認してください。
                未指定のまま <code>GUI_DOWNLOAD</code> を呼ぶとエラーになります。
              </Callout>
            </>
          ),
        },
        {
          title: "ボタンからダウンロードまで",
          plainText:
            "ボタンからダウンロードまで\nSET PF-STATUS / SET TITLEBAR で帳票画面にボタンを出す。\n注意：コードだけでは動きません。S0010（ステータス）と T0010（タイトル）は SE41（メニューペインタ）で手動登録して初めて有効。\nAT USER-COMMAND で sy-ucomm を判定し、DL なら PERFORM f_download。\nf_download の流れ：パスチェック→ヘッダ行→データ整形→GUI_DOWNLOAD。",
          content: (
            <>
              <h2>ボタンからダウンロードまで</h2>
              <MermaidDiagram
                chart={`flowchart TD
  B[ダウンロードボタン DL] --> U[AT USER-COMMAND]
  U --> C{sy-ucomm = 'DL'?}
  C -->|はい| F[PERFORM f_download]
  F --> V{p_file 指定済み?}
  V -->|いいえ| M[メッセージして RETURN]
  V -->|はい| H[ヘッダ行 lt_fname を組み立て]
  H --> L[gt_out をループして lt_dl に整形]
  L --> G[GUI_DOWNLOAD]`}
              />
              <CodeBlock
                language="ABAP"
                code={`START-OF-SELECTION.
  SET PF-STATUS 'S0010'.
  SET TITLEBAR 'T0010'.
  PERFORM f_get_data.

AT USER-COMMAND.
  CASE sy-ucomm.
    WHEN 'DL'.
      PERFORM f_download.
  ENDCASE.`}
              />
              <Callout variant="warning">
                <strong>注意：</strong>コードだけでは動きません。
                <code>S0010</code>（ステータス）と <code>T0010</code>（タイトル）は、
                <strong>SE41</strong>（メニューペインタ）で手動登録して初めて有効になります。
                手順は次のスライドで説明します。
              </Callout>
              <Dialog speaker="teacher">
                イベント（<code>AT USER-COMMAND</code>）は振り分けだけ、
                実処理は <code>FORM f_download</code> に集める——第10章の構造化の考え方と同じです。
              </Dialog>
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <LessonLinkButton
                  courseSlug="abap-training"
                  lessonFile="10-modularization"
                  slide={8}
                  label="第10章: FORM/PERFORM を復習する"
                />
                <LessonLinkButton
                  courseSlug="abap-training"
                  lessonFile="96-exercise-journal-ledger-download"
                  slide={1}
                  label="特別演習④ Part B: 実装例へ"
                />
              </div>
            </>
          ),
        },
        {
          title: "SE41でステータス／タイトルを登録",
          plainText:
            "SE41でのGUIステータス登録（必須）\nコードだけでは動かない。S0010（ステータス）と T0010（タイトル）を SE41（メニューペインタ）で手動登録する。\n① T0010：SE41→プログラム名入力→表題（タイトル）登録→表題コード T0010・表題を入力→保存→有効化。\n② S0010：SE41→SAPMSSY0 の STLI を自プログラムへコピー→S0010。機能キー（例F5）に DL・ダウンロードを割当。APツールバーに DL を追加→保存→有効化。\nBちゃん：登録したのに動かない？→有効化を忘れない！保存だけでは反映されない。\nコード＋SE41 の両方でひとつの機能。",
          content: (
            <>
              <h2>SE41 でステータス／タイトルを登録</h2>
              <p>
                <code>SET PF-STATUS &apos;S0010&apos;</code> や <code>SET TITLEBAR &apos;T0010&apos;</code> は、
                「その名前の定義を使う」という<strong>指定</strong>にすぎません。
                定義そのものは <strong>SE41（メニューペインタ）</strong> で作ります。
              </p>
              <Callout variant="warning">
                <strong>注意：</strong>コードだけでは動きません。
                <code>S0010</code>（ステータス）と <code>T0010</code>（タイトル）は、
                SE41 で手動登録して初めて有効になります。
              </Callout>
              <MermaidDiagram
                chart={`flowchart LR
  C[ABAPコード<br/>SET PF-STATUS / SET TITLEBAR] --> R{SE41で登録済み?}
  R -->|いいえ| X[ボタンもタイトルも出ない]
  R -->|はい| O[帳票画面にボタンとタイトルが表示]`}
              />
              <h3>① GUIタイトル T0010</h3>
              <InfoPanel title="手順：表題（タイトル）の登録" variant="reference">
                <ol>
                  <li>
                    トランザクション <strong>SE41</strong> を起動する
                  </li>
                  <li>
                    <strong>プログラム名</strong>（自分のレポート名）を入力する
                  </li>
                  <li>
                    サブオブジェクトで<strong>「表題（タイトル）」→「登録」</strong>を選ぶ
                  </li>
                  <li>
                    表題コード <code>T0010</code>、表題（例：<strong>仕訳日記帳</strong>）を入力して<strong>保存</strong>
                  </li>
                  <li>
                    <strong>有効化</strong>する（保存だけでは実行時に反映されない）
                  </li>
                </ol>
              </InfoPanel>
              <h3>② GUIステータス S0010</h3>
              <InfoPanel title="手順：ステータス（ボタン）の登録" variant="reference">
                <ol>
                  <li>
                    SE41 で、プログラム <code>SAPMSSY0</code> のステータス <code>STLI</code> を
                    <strong>自プログラムへコピー</strong>する（リスト表示用の標準ボタンが揃った状態から始められる）
                  </li>
                  <li>
                    コピー先ステータス名：<code>S0010</code>
                  </li>
                  <li>
                    <strong>機能キー</strong>を展開 → 任意選定可能キー（例：<code>F5</code>）に割り当てる
                    <ul>
                      <li>
                        機能コード：<code>DL</code>
                      </li>
                      <li>
                        機能名：<strong>ダウンロード</strong>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>APツールバー</strong>の空きスロットに <code>DL</code> を追加する（左上にボタンが表示される）
                  </li>
                  <li>
                    <strong>保存</strong>する
                  </li>
                  <li>
                    <strong>有効化</strong>する（ここを忘れるとボタンが出ない）
                  </li>
                </ol>
              </InfoPanel>
              <Callout variant="note">
                <code>SAPMSSY0</code> の <code>STLI</code> は「リスト表示用」の標準ステータスです。
                戻る・終了などの標準ボタンが揃った状態から <code>DL</code> を足せます。
              </Callout>
              <Callout variant="tip">
                登録が完了すると、帳票結果画面の<strong>左上ツールバーに「ダウンロード」ボタン</strong>が現れます。
                押下すると <code>AT USER-COMMAND</code> で <code>sy-ucomm = &apos;DL&apos;</code> となり、
                <code>PERFORM f_download</code> が呼ばれます。
              </Callout>
              <Dialog speaker="b">
                先生、SE41 も登録したのに動かないんですけど…。
              </Dialog>
              <Dialog speaker="teacher">
                保存だけで終わっていませんか？<strong>有効化を忘れていませんか？</strong><br />
                表題もステータスも、保存のあと必ず有効化しないと実行時に反映されません。
                SE38 のプログラム本体と同じで、「保存した＝動く」ではありません。
              </Dialog>
              <Callout variant="warning">
                SE41 でも SE38 と同じで、<strong>保存だけでは動きません</strong>。
                表題（<code>T0010</code>）もステータス（<code>S0010</code>）も、
                登録のあと必ず<strong>有効化</strong>してください。
              </Callout>
              <Dialog speaker="b">
                あ、保存ボタンを押しただけで満足してました…。有効化までやらないとダメなんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。<strong>コード ＋ SE41 登録 ＋ 有効化</strong>の3つがそろって、
                初めてボタンとタイトルが表示されます。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="96-exercise-journal-ledger-download"
                slide={7}
                label="特別演習④ Part B: SE41 登録の実践（B-⑦）"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "読込との整理",
          plainText:
            "読込と出力の整理\n読込（サーバ）＝OPEN DATASET・FILE_GET_NAME・第15章。\n出力（PC）＝GUI_DOWNLOAD・FILE_SAVE_DIALOG・本章。\n会計伝票登録では取込（読込）→検証→BAPI→履歴。照会レポートでは画面表示→ダウンロード。",
          content: (
            <>
              <h2>読込と出力の整理</h2>
              <InfoPanel title="ファイル操作の2方向" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>方向</th>
                      <th>典型命令</th>
                      <th>参照</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>読込（サーバ上のファイル → SAP）</td>
                      <td>
                        <code>OPEN DATASET</code> / <code>READ DATASET</code>
                      </td>
                      <td>ファイル連携とバッチ</td>
                    </tr>
                    <tr>
                      <td>出力（SAP → ユーザーの PC）</td>
                      <td>
                        <code>GUI_DOWNLOAD</code>
                      </td>
                      <td>本章</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="a">
                会計伝票登録は「外部ファイルを読んで SAP に書く」、仕訳日記帳は「SAP から PC に書き出す」。
                方向が逆ですね。
              </Dialog>
              <Dialog speaker="teacher">
                その理解で OK です。命令も設計も別物なので、混同しないように整理しておきましょう。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="15-files-jobs-and-batch"
                slide={1}
                label="ファイル連携とバッチ: 読込の詳細へ"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 GUI_DOWNLOADの前にデータを文字型に整形する理由→ Excelで書式が崩れにくくするため\nQ2 Excelが列に分けて開けるタブ区切りにする指定→ filetype='DAT' と write_field_separator='X'\nQ3 保存先パスを選ぶ方法→ FILE_SAVE_DIALOG\nQ4 帳票画面にDLボタンを出すために必須→ SE41でS0010を登録しDLをAPツールバーに追加",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="GUI_DOWNLOAD は文字列として渡したデータをそのままファイルに書き出します。日付や金額を WRITE ... TO ... で整形してから渡すと、Excel 側で見やすい形式になります。"
                question={
                  <strong>
                    <code>GUI_DOWNLOAD</code> の前にデータを文字型に整形する主な理由は？
                  </strong>
                }
                options={[
                  "SAP の画面出力を速くするため",
                  "Excel などで書式が崩れにくくするため",
                  "サーバ上のファイルを読みやすくするため",
                ]}
              />
              <Quiz
                answer={2}
                explanation="filetype='DAT' と write_field_separator='X' を指定すると、タブ区切りのテキストファイルになり、Excel が列に分けて開けます。"
                question={<strong>Excel が列に分けて開けるファイルにするための指定は？</strong>}
                options={[
                  "filetype = 'BIN' のみ",
                  "write_field_separator なし",
                  "filetype = 'DAT' と write_field_separator = 'X'",
                ]}
              />
              <Quiz
                answer={0}
                explanation="CL_GUI_FRONTEND_SERVICES=>FILE_SAVE_DIALOG でユーザーに保存先を選んでもらいます。選択画面の VALUE-REQUEST と組み合わせるのが一般的です。"
                question={<strong>保存先ファイルパスをユーザーに選ばせる方法は？</strong>}
                options={[
                  "CL_GUI_FRONTEND_SERVICES=>FILE_SAVE_DIALOG",
                  "OPEN DATASET FOR OUTPUT",
                  "WRITE TO のみ",
                ]}
              />
              <Quiz
                answer={1}
                explanation="SET PF-STATUS 'S0010' は「S0010 というステータスを使う」という指定にすぎません。S0010 の中身（どのボタンを出すか）と機能コード DL は、SE41 でステータスを登録し APツールバーに DL を追加して初めて有効になります。T0010 も SE41 で登録します。登録後は保存だけでなく有効化も忘れずに。"
                question={<strong>帳票画面に DL ボタンを出すために必須の作業は？</strong>}
                options={[
                  "SET PF-STATUS 'S0010' をコードに書くだけでよい",
                  "SE41 で GUI ステータス S0010 を登録し、機能コード DL を APツールバーに追加する",
                  "GUI_DOWNLOAD を呼べば自動でボタンが出る",
                ]}
              />
              <Dialog speaker="closing">
                ファイル出力は「整形 → 保存先選択 → GUI_DOWNLOAD」、ボタン表示は「コード ＋ SE41 登録 ＋ 有効化」のセットで覚えましょう。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(FileOutputLesson);
