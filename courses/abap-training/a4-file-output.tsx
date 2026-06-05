import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CodeBlock,
  Quiz,
  MermaidDiagram,
  InfoPanel,
  KeyValueTable,
  InstructionSubsteps,
  LessonMeta,
  LessonLinkButton,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "ファイル出力 — PCへのダウンロードとデータ整形",
  meta: "初学者 · 30分",
};

export default function FileOutputLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-training", "a4-file-output", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "ファイル出力\n帳票画面で見た結果を、PC上のファイル（Excelなど）として保存する方法を学びます。\n本章は理解しやすいよう SE41 を先に説明（開発中はコードを先に書くこともある）。\n⏱ 30分 / 📶 初学者 / 🏷 ABAP研修",
          content: (
            <>
              <hgroup>
                <h1>ファイル出力</h1>
                <p>帳票画面で見た結果を、PC 上のファイル（Excel など）として保存する方法を学びます。</p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "30分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>画面出力（<code>WRITE</code>）とファイル出力の違い</li>
                <li>SE41 による GUI ステータス／タイトルの登録（ダウンロードボタンの前提）</li>
                <li>
                  <code>SET PF-STATUS</code> / <code>AT USER-COMMAND</code> によるボタン表示と押下処理
                </li>
                <li>ファイル保存ダイアログ（保存先の選択）</li>
                <li>
                  <code>WRITE ... TO ...</code> によるデータ整形
                </li>
                <li>
                  <code>GUI_DOWNLOAD</code> による PC へのダウンロード
                </li>
              </ul>
              <Callout variant="tip">
                本章では理解しやすいよう<strong> SE41 を先に、コードを後に</strong>説明します。
                開発中にコードを先に書くこともありますが、実行してボタンを確認する時点では
                <strong>SE41 の登録・有効化とコードの両方</strong>がそろっている必要があります。
              </Callout>
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
                実務では、<code>SET PF-STATUS</code> を先に書いてから SE41 を整えることもあります。
                大事なのは実行時に<strong>コード側の指定</strong>と<strong>SE41 側の定義</strong>がそろっていることです。
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
          title: "GUI設定の全体像",
          plainText:
            "GUI設定（ダウンロード機能）の全体像\n① TITLEBAR（画面上部タイトル）② PF-STATUS（ダウンロードボタン）③ プログラムに適用 ④ ボタン押下処理。\nTITLEBARとPF-STATUSは完全に別物。SE41で定義し、SET TITLEBAR / SET PF-STATUSで参照。コードとSE41はセット。",
          content: (
            <>
              <h2>GUI 設定（ダウンロード機能）の全体像</h2>
              <p>
                帳票画面に「ダウンロード」ボタンとタイトルを出すには、
                <strong>SE41（メニューペインタ）</strong> で GUI を定義し、
                プログラム側から<strong>名前を指定して使う</strong>必要があります。
              </p>
              <InfoPanel title="4つのステップ（順番の目安）" variant="reference">
                <ol>
                  <li>
                    <strong>① TITLEBAR</strong> … 画面上部のタイトルを作る（例：<code>T0010</code>）
                  </li>
                  <li>
                    <strong>② PF-STATUS</strong> … ダウンロードボタンを作る（例：<code>S0010</code>）
                  </li>
                  <li>
                    <strong>③ プログラムに適用</strong> … <code>SET TITLEBAR</code> /{" "}
                    <code>SET PF-STATUS</code> を記述
                  </li>
                  <li>
                    <strong>④ ボタン押下処理</strong> … <code>AT USER-COMMAND</code> で{" "}
                    <code>DL</code> を受け取る
                  </li>
                </ol>
              </InfoPanel>
              <MermaidDiagram
                chart={`flowchart LR
  C[ABAPコード<br/>SET PF-STATUS / SET TITLEBAR] --> R{SE41で登録済み?}
  R -->|いいえ| X[ボタンもタイトルも出ない]
  R -->|はい| O[帳票画面にボタンとタイトルが表示]`}
              />
              <Callout variant="warning">
                <strong>注意：</strong>コードだけでは動きません。
                <code>S0010</code>（ステータス）と <code>T0010</code>（タイトル）は、
                SE41 で手動登録し、<strong>有効化まで</strong>済ませて初めて反映されます。
              </Callout>
              <InfoPanel title="なぜ2つ設定する？" variant="breakdown">
                <table>
                  <thead>
                    <tr>
                      <th>設定</th>
                      <th>役割</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>TITLEBAR</code>
                      </td>
                      <td>見た目（画面上部のタイトル）</td>
                    </tr>
                    <tr>
                      <td>
                        <code>PF-STATUS</code>
                      </td>
                      <td>操作（ツールバーのボタン）</td>
                    </tr>
                  </tbody>
                </table>
                <p>完全に別物です。片方だけ設定しても、もう片方は出ません。</p>
              </InfoPanel>
              <Dialog speaker="teacher">
                このあと<strong>① TITLEBAR → ② PF-STATUS</strong>の順で、SE41 の操作を1ステップずつ見ていきます。
                開発中はコードを先に書くこともありますが、実行時には<strong>SE41 とコードの両方</strong>がそろっている必要があります。
              </Dialog>
            </>
          ),
        },
        {
          title: "GUI表題（TITLEBAR）の設定",
          plainText:
            "GUI表題 TITLEBAR T0010\nSE41→自分のプログラム→表題一覧→登録→T0010と表題「仕訳日記帳」を入力→保存→有効化。\nプログラム側の SET TITLEBAR は「プログラム反映と押下処理」スライドで説明。",
          content: (
            <>
              <h2>① GUI 表題（TITLEBAR）の設定</h2>
              <p>
                まずは<strong>画面上部のタイトル</strong>を SE41 で作ります。
                表題コード <code>T0010</code>、表題「<strong>仕訳日記帳</strong>」を、本研修で使う標準的な例として説明します。
              </p>
              <ol>
                <li>
                  <strong>SE41 を起動する</strong>
                </li>
                <li>
                  <strong>対象プログラムを指定する</strong>
                  <br />
                  例：<code>ZXXXXX</code>（自分のレポートプログラム名）
                </li>
                <li>
                  <strong>「表題一覧」を選ぶ</strong>
                  <br />
                  サブオブジェクトから <strong>表題一覧</strong> を選択
                </li>
                <li>
                  <strong>「登録」を押下する</strong>
                  <br />
                  新しいタイトル定義を作成する
                </li>
                <li>
                  <strong>表題コードと表題を入力する</strong>
                  <KeyValueTable
                    labelHeader="項目"
                    valueHeader="例"
                    rows={[
                      { label: "表題コード", value: <code>T0010</code> },
                      { label: "表題", value: "仕訳日記帳" },
                    ]}
                  />
                  <Callout variant="note">
                    表題コード <code>T0010</code> と表題「仕訳日記帳」は、本研修で使う<strong>標準的な名前</strong>です。
                    プログラム側の <code>SET TITLEBAR &apos;T0010&apos;</code> と、SE41 の登録内容が
                    <strong>一致していること</strong>が重要です。
                  </Callout>
                </li>
                <li>
                  <strong>保存する</strong>
                  <br />
                  タイトルデータが SE41 上に登録される（この時点では実行時にまだ反映されない）
                </li>
                <li>
                  <strong>有効化する</strong>
                  <br />
                  保存だけでは不十分。有効化して初めて実行時に使える
                </li>
              </ol>
              <Callout variant="note">
                SE41 での登録・有効化が終わったら、プログラム側で <code>SET TITLEBAR &apos;T0010&apos;</code> を書きます。
                記述場所とコードは<strong>「プログラム反映と押下処理」</strong>スライドで説明します。
              </Callout>
            </>
          ),
        },
        {
          title: "GUIステータス（PF-STATUS）の設定",
          plainText:
            "GUIステータス PF-STATUS S0010\nSAPMSSY0/STLIをS0010としてコピー→変更→F5にDL→メニューバー・APツールバーにDL→保存→有効化。\nDLがAT USER-COMMANDのトリガー。配置と有効化を忘れるとボタンが出ない。",
          content: (
            <>
              <h2>② GUI ステータス（PF-STATUS）の設定</h2>
              <p>
                次に<strong>ダウンロードボタン</strong>を SE41 で作ります。
                標準のリスト画面ステータス <code>STLI</code> をコピーして、
                機能コード <code>DL</code> を足すのが定番です。
              </p>
              <ol>
                <li>
                  <strong>SE41 を起動する</strong>（Tr-cd: <code>SE41</code>）
                </li>
                <li>
                  <strong>コピー元の標準ステータスを指定する</strong>
                  <KeyValueTable
                    rows={[
                      { label: "プログラム", value: <code>SAPMSSY0</code> },
                      { label: "ステータス", value: <code>STLI</code> },
                    ]}
                  />
                  <p>
                    <code>STLI</code> はリスト表示用の標準 GUI（戻る・終了などが揃った状態）です。
                  </p>
                </li>
                <li>
                  <strong>STLI を自プログラムへコピーする</strong>
                  <InstructionSubsteps>
                    <li>サブオブジェクトから <strong>ステータス</strong> を選択</li>
                    <li>
                      ステータス <code>STLI</code> を入力 → <strong>ステータス</strong>（Ctrl+F6）を押下
                    </li>
                    <li>
                      コピー先を設定
                      <KeyValueTable
                        rows={[
                          { label: "To プログラム", value: <>自分のプログラム（例：<code>ZXXXXX</code>）</> },
                          { label: "To ステータス", value: <code>S0010</code> },
                        ]}
                      />
                    </li>
                  </InstructionSubsteps>
                </li>
                <li>
                  <strong>変更モードに入る</strong>
                  <InstructionSubsteps>
                    <li>
                      SE41 で自分のプログラム名とステータス <code>S0010</code> を入力
                    </li>
                    <li>
                      <strong>変更</strong> を押下
                    </li>
                  </InstructionSubsteps>
                </li>
                <li>
                  <strong>機能キーを展開する</strong>（F キー設定画面を開く）
                </li>
                <li>
                  <strong>ダウンロード機能を追加する</strong>（例：F5 キー）
                  <KeyValueTable
                    labelHeader="項目"
                    valueHeader="内容"
                    rows={[
                      { label: "機能コード", value: <code>DL</code> },
                      { label: "機能名", value: "ダウンロード" },
                    ]}
                  />
                  <p>
                    この <code>DL</code> が、後で <code>AT USER-COMMAND</code> の{" "}
                    <code>WHEN &apos;DL&apos;</code> と対応します。
                  </p>
                </li>
                <li>
                  <strong>（推奨）DL の詳細設定</strong>
                  <InstructionSubsteps>
                    <li>
                      <code>DL</code> をダブルクリック
                    </li>
                    <li>アイコン・テキスト・ショートカットを設定（見やすくなる）</li>
                  </InstructionSubsteps>
                </li>
                <li>
                  <strong>メニューバーに DL を登録する</strong>
                  <InstructionSubsteps>
                    <li>「一覧」など既存メニュー項目をダブルクリック</li>
                    <li>
                      Code に <code>DL</code> を入力
                    </li>
                  </InstructionSubsteps>
                </li>
                <li>
                  <strong>AP ツールバーに DL を設置する</strong>
                  <InstructionSubsteps>
                    <li>AP ツールバーの空きスロットに <code>DL</code> を入力</li>
                    <li>帳票画面<strong>左上</strong>に「ダウンロード」ボタンが表示される</li>
                  </InstructionSubsteps>
                </li>
                <li>
                  <strong>保存 → 有効化する</strong>
                  <InstructionSubsteps>
                    <li>編集内容を<strong>保存</strong></li>
                    <li>
                      <strong>有効化</strong>する（保存だけでは実行時に反映されない）
                    </li>
                  </InstructionSubsteps>
                </li>
              </ol>
              <Callout variant="warning">
                <strong>メニューバー・AP ツールバーへの配置と有効化を忘れるとボタンが出ません。</strong>
                機能キーに <code>DL</code> を割り当てただけでは足りません。
              </Callout>
            </>
          ),
        },
        {
          title: "プログラム反映と押下処理",
          plainText:
            "プログラムへの反映とボタン押下処理\nSET TITLEBAR 'T0010' / SET PF-STATUS 'S0010' でSE41定義を使う。\nAT USER-COMMAND で sy-ucomm='DL' を判定し PERFORM f_download。\nボタン押下→SY-UCOMM=DL→AT USER-COMMAND→PERFORM の流れ。",
          content: (
            <>
              <h2>③ プログラムに反映する ／ ④ ボタン押下処理</h2>
              <p>
                SE41 で <code>T0010</code> / <code>S0010</code> を登録・有効化したうえで、
                プログラム側では次のコードを書きます。
              </p>
              <h3>③ プログラムに適用</h3>
              <p>
                プログラム側では、SE41 で登録した表題コード・ステータス名を<strong>指定するだけ</strong>です。
                帳票を出す直前（通常は <code>START-OF-SELECTION</code>）に書きます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`START-OF-SELECTION.
  SET TITLEBAR 'T0010'.   " タイトル（SE41 で登録した表題コード）
  SET PF-STATUS 'S0010'.  " ボタン（SE41 で登録したステータス名）
  PERFORM f_get_data.`}
              />
              <Callout variant="tip">
                <strong>結果：</strong>
                <code>SET TITLEBAR</code> により画面上部に「仕訳日記帳」が表示され、
                <code>SET PF-STATUS</code> により左上に「ダウンロード」ボタンが出ます。
              </Callout>
              <Callout variant="note">
                ここでは SE41 で作った定義を<strong>名前で指定して使う</strong>だけです。
                定義そのものは SE41 側にあります。
              </Callout>
              <h3>④ ボタン押下処理</h3>
              <MermaidDiagram
                chart={`flowchart TD
  B[ダウンロードボタン DL] --> U[AT USER-COMMAND]
  U --> S[sy-ucomm = 'DL']
  S --> F[PERFORM f_download]
  F --> V{p_file 指定済み?}
  V -->|いいえ| M[メッセージして RETURN]
  V -->|はい| H[ヘッダ行 lt_fname を組み立て]
  H --> L[gt_out をループして lt_dl に整形]
  L --> G[GUI_DOWNLOAD]`}
              />
              <CodeBlock
                language="ABAP"
                code={`AT USER-COMMAND.
  CASE sy-ucomm.
    WHEN 'DL'.
      PERFORM f_download.
  ENDCASE.`}
              />
              <InfoPanel title="ボタンが動く仕組み" variant="breakdown">
                <ol>
                  <li>ユーザーが「ダウンロード」ボタンを押す</li>
                  <li>
                    <code>sy-ucomm</code> に機能コード <code>DL</code> が入る
                  </li>
                  <li>
                    <code>AT USER-COMMAND</code> が起動する
                  </li>
                  <li>
                    <code>PERFORM f_download</code> でファイル出力処理を実行する
                  </li>
                </ol>
              </InfoPanel>
              <Dialog speaker="teacher">
                イベント（<code>AT USER-COMMAND</code>）は振り分けだけ、
                実処理は <code>FORM f_download</code> に集めます。中身はこのあとのスライドで順に足します。
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
                  lessonFile="s5-exercise-journal-ledger-download"
                  slide={0}
                  label="特別演習④ Part B: 実装例へ"
                />
              </div>
            </>
          ),
        },
        {
          title: "よくあるミス",
          plainText:
            "GUI設定のよくあるミス\nボタンが出ない→APツールバー未配置・有効化忘れ。\n押しても動かない→AT USER-COMMAND未実装。\nタイトルが出ない→SET TITLEBAR未記述。\nDLとDL+スペースの typo に注意。",
          content: (
            <>
              <h2>よくあるミスと確認ポイント</h2>
              <InfoPanel title="症状別チェックリスト" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>症状</th>
                      <th>よくある原因</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>ボタンが出ない</td>
                      <td>
                        <code>DL</code> を AP ツールバーに置いていない／有効化していない
                      </td>
                    </tr>
                    <tr>
                      <td>押しても動かない</td>
                      <td>
                        <code>AT USER-COMMAND</code> が未実装、または <code>WHEN &apos;DL&apos;</code>{" "}
                        の綴り不一致
                      </td>
                    </tr>
                    <tr>
                      <td>タイトルが出ない</td>
                      <td>
                        <code>SET TITLEBAR</code> を書いていない／<code>T0010</code> が SE41 未登録
                      </td>
                    </tr>
                    <tr>
                      <td>GUI が反映されない</td>
                      <td>SE41 で保存したが<strong>有効化</strong>していない</td>
                    </tr>
                    <tr>
                      <td>
                        <code>DL</code> と書いたつもりで動かない
                      </td>
                      <td>
                        <code>DL </code>（末尾スペース）などの typo
                      </td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="b">
                先生、SE41 も①〜④まで終えたのに、ボタンが出ないんですけど…。
              </Dialog>
              <Dialog speaker="teacher">
                よくあるのは<strong>有効化を忘れた</strong>ケースと、
                <strong>AP ツールバーへの配置を忘れた</strong>ケースです。
                保存まで終わっていても、有効化しないと実行時に反映されません。
              </Dialog>
              <Dialog speaker="stumble">
                <code>SET PF-STATUS</code> を書いただけでは足りません。
                SE41 で <code>S0010</code> / <code>T0010</code> を登録し、<strong>有効化まで</strong>済ませる——
                コードと SE41 は<strong>セットでひとつの機能</strong>です。
              </Dialog>
              <Dialog speaker="b">
                あ、保存ボタンを押しただけで満足してました…。有効化までやらないとダメなんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。有効化まで終わったら、<strong>次のスライド以降</strong>で
                ファイル保存ダイアログ → データ整形 → <code>GUI_DOWNLOAD</code> を実装していきましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "ファイル保存ダイアログ",
          plainText:
            "ファイル保存ダイアログ（f_download の①）\nCL_GUI_FRONTEND_SERVICES=>FILE_SAVE_DIALOG で保存先を選ぶ。\nCHANGING の filename＝ファイル名のみ、path＝フォルダ、fullpath＝フォルダ＋ファイル名（GUI_DOWNLOAD に渡す値）。\n選択画面の p_file と AT SELECTION-SCREEN ON VALUE-REQUEST を組み合わせる。",
          content: (
            <>
              <h2>ファイル保存ダイアログ</h2>
              <p>
                <code>f_download</code> の第一要素は、保存先のパスです。
                <strong>ファイル保存ダイアログ</strong>でユーザーに選んでもらいます。
              </p>
              <CodeBlock
                language="ABAP"
                code={`DATA: lv_filename TYPE string,
      lv_path     TYPE string,
      lv_fullpath TYPE string.

CALL METHOD cl_gui_frontend_services=>file_save_dialog
  EXPORTING
    default_extension = 'xls'
    default_file_name = 'journal_ledger'
  CHANGING
    filename          = lv_filename
    path              = lv_path
    fullpath          = lv_fullpath
  EXCEPTIONS
    OTHERS            = 1.

IF sy-subrc = 0.
  p_file = lv_fullpath.
ENDIF.`}
              />
              <InfoPanel title="CHANGING の3つの出力" variant="breakdown">
                <p>
                  ダイアログでユーザーが保存先を選ぶと、<code>CHANGING</code> で受け取った変数に
                  次のように値が入ります（例：デスクトップに <code>journal_ledger.xls</code> を保存した場合）。
                </p>
                <KeyValueTable
                  labelHeader="パラメータ"
                  valueHeader="返る値（例）"
                  rows={[
                    {
                      label: (
                        <>
                          <code>filename</code>
                        </>
                      ),
                      value: (
                        <>
                          ファイル名<strong>のみ</strong>（例：<code>journal_ledger.xls</code>）
                        </>
                      ),
                    },
                    {
                      label: (
                        <>
                          <code>path</code>
                        </>
                      ),
                      value: (
                        <>
                          フォルダ（ディレクトリ）のパス<strong>のみ</strong>（例：
                          <code>C:\Users\Tanaka\Desktop</code>）
                        </>
                      ),
                    },
                    {
                      label: (
                        <>
                          <code>fullpath</code>
                        </>
                      ),
                      value: (
                        <>
                          フォルダ ＋ ファイル名の<strong>フルパス</strong>（例：
                          <code>C:\Users\Tanaka\Desktop\journal_ledger.xls</code>）
                        </>
                      ),
                    },
                  ]}
                />
                <Callout variant="tip">
                  <code>GUI_DOWNLOAD</code> の <code>filename</code> には、
                  <strong>
                    <code>fullpath</code>（フルパス）
                  </strong>
                  を渡します。ファイル名だけ（<code>filename</code>）やフォルダだけ（<code>path</code>）では
                  保存先が特定できません。
                </Callout>
              </InfoPanel>
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
                選んだ結果は <code>lv_fullpath</code> を <code>p_file</code> に入れておけば、
                後続の <code>GUI_DOWNLOAD</code> でそのまま使えます。
              </Dialog>
            </>
          ),
        },
        {
          title: "データ整形（WRITE TO）",
          plainText:
            "データ整形（f_download の②）\nGUI_DOWNLOADに渡す前に、列見出し行 lt_fname とデータ行 lt_dl を組み立てる。\nlt_fname は g_typ_dl の 1 行に列名を詰める。gt_out を LOOP し、日付・金額は WRITE ... TO ... で文字型に変換して APPEND。\nダウンロード用の型は全項目文字型にするのが定石。",
          content: (
            <>
              <h2>データ整形（列見出しとデータ行の組み立て）</h2>
              <p>
                <code>f_download</code> の第二要素は、<code>GUI_DOWNLOAD</code> に渡す
                <strong>列見出し行</strong>（<code>lt_fname</code>）と<strong>データ行</strong>（<code>lt_dl</code>）を
                内部テーブルとして組み立てる処理です。帳票で使っている <code>gt_out</code> をループし、
                日付・金額などは文字型に整形してから詰めます。
              </p>
              <h3>① 列見出し行（<code>lt_fname</code>）</h3>
              <p>
                <code>fieldnames</code> に渡す 1 行目です。ダウンロード用の行型（例：<code>g_typ_dl</code>）の
                各項目に列名を入れて <code>APPEND</code> します。
              </p>
              <CodeBlock
                language="ABAP"
                code={`DATA: ls_fname TYPE g_typ_dl.

REFRESH lt_fname.
CLEAR ls_fname.

ls_fname-bukrs = '会社コード'.
ls_fname-belnr = '伝票番号'.
ls_fname-budat = '転記日付'.
ls_fname-dmbtr = '金額'.
" … 他の列見出し …

APPEND ls_fname TO lt_fname.`}
              />
              <h3>② データ行（<code>LOOP AT gt_out</code> → <code>lt_dl</code>）</h3>
              <p>
                抽出済みの <code>gt_out</code> を 1 行ずつ読み、<code>g_typ_dl</code> 型の作業行{" "}
                <code>ls_dl</code> に詰めて <code>lt_dl</code> へ <code>APPEND</code> します。
                日付・金額は <code>WRITE ... TO ...</code> で文字列に変換します。
              </p>
              <CodeBlock
                language="ABAP"
                code={`DATA: ls_dl      TYPE g_typ_dl,
        lv_budat_c TYPE c LENGTH 10,
        lv_dmbtr_c TYPE c LENGTH 16.

REFRESH lt_dl.

LOOP AT gt_out INTO gs_out.

  CLEAR: ls_dl, lv_budat_c, lv_dmbtr_c.

  ls_dl-bukrs = gs_out-bukrs.
  ls_dl-belnr = gs_out-belnr.

  " 日付 → ____/__/__ 形式の文字列
  WRITE gs_out-budat TO lv_budat_c USING EDIT MASK '____/__/__'.
  ls_dl-budat = lv_budat_c.

  " 金額 → 通貨編集済みの文字列
  WRITE gs_out-dmbtr TO lv_dmbtr_c CURRENCY gs_out-waers.
  CONDENSE lv_dmbtr_c.
  ls_dl-dmbtr = lv_dmbtr_c.

  " … 他の項目も同様に詰める …

  APPEND ls_dl TO lt_dl.

ENDLOOP.`}
              />
              <Callout variant="tip">
                ダウンロード用の行型（例：<code>g_typ_dl</code>）は、<strong>全項目を文字型</strong>にしておくと
                整形結果をそのまま詰めやすくなります。
              </Callout>
              <Dialog speaker="a">
                画面の <code>WRITE</code> と同じ整形命令を、文字変数に向けて使うイメージですね。
                ループの中で 1 行分ずつ <code>ls_dl</code> を組み立てて <code>lt_dl</code> に溜めていくんですね。
              </Dialog>
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <LessonLinkButton
                  courseSlug="abap-training"
                  lessonFile="s7-exercise-journal-ledger-function-module"
                  slide={6}
                  label="特別演習④ Part D: 全項目の実装例へ"
                />
              </div>
            </>
          ),
        },
        {
          title: "GUI_DOWNLOAD",
          plainText:
            "GUI_DOWNLOAD（f_download の③）\nCALL FUNCTION 'GUI_DOWNLOAD' で内部テーブルをPCへ書き出す。\nfilename＝保存先パス、filetype='DAT'、write_field_separator='X'（タブ区切り）でExcelが列に分かれて開ける。\nTABLES data_tab＝データ行、fieldnames＝列見出し行。sy-subrc=0で成功。",
          content: (
            <>
              <h2>
                <code>GUI_DOWNLOAD</code>
              </h2>
              <p>
                <code>f_download</code> の最後は、整形済みの内部テーブルを PC 上のファイルとして書き出します。
              </p>
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
                lessonFile="14-files-jobs-and-batch"
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
                explanation="SET PF-STATUS 'S0010' は「S0010 というステータスを使う」という指定にすぎません。S0010 の中身（機能コード DL の定義、メニューバー・APツールバーへの配置）は SE41 で登録し、有効化も忘れずに。T0010 も SE41 で登録します。"
                question={<strong>帳票画面に DL ボタンを出すために必須の作業は？</strong>}
                options={[
                  "SET PF-STATUS 'S0010' をコードに書くだけでよい",
                  "SE41 で GUI ステータス S0010 を登録し、機能コード DL を APツールバーに追加する",
                  "GUI_DOWNLOAD を呼べば自動でボタンが出る",
                ]}
              />
              <Dialog speaker="closing">
                ファイル出力は「SE41 登録・有効化 ＋ コード（ボタン処理 → 保存先 → 整形 → GUI_DOWNLOAD）」のセットで覚えましょう。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(FileOutputLesson);
