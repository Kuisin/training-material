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
  title: "ファイル連携とバッチ — 論理ファイル・ジョブ・BDC",
  meta: "初学者 · 25分",
};

export default function FilesJobsAndBatchLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-training", "14-files-jobs-and-batch", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "ファイル連携とバッチ\n請求データの取込・夜間処理・画面登録の自動化など、FI/ERP連携で頻出する仕組みを整理します。\n⏱ 25分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・論理パス・論理ファイルと物理パスの関係\n・サーバファイルの参照・アップロード・ダウンロード\n・バックグラウンドジョブの作成と確認\n・バッチインプット（BDC）の考え方",
          content: (
            <>
              <hgroup>
                <h1>ファイル連携とバッチ</h1>
                <p>
                  請求データの取込・夜間処理・画面登録の自動化など、
                  FI/ERP 連携で頻出する仕組みを整理します。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "25分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>論理パス・論理ファイルと物理パスの関係</li>
                <li>サーバファイルの参照・アップロード・ダウンロード（<code>AL11</code> / <code>CG3Y</code> / <code>CG3Z</code>）</li>
                <li>
                  <code>OPEN DATASET</code> / <code>READ DATASET</code> による行読込と分解（<code>SPLIT</code>）
                </li>
                <li>バックグラウンドジョブの作成と確認（<code>SM36</code> / <code>SM37</code>）</li>
                <li>バッチインプット（BDC）の考え方</li>
              </ul>
            </>
          ),
        },
        {
          title: "論理ファイルの概念",
          plainText:
            "論理ファイルの概念\n論理パス＝環境に依存しない抽象パス。物理パス＝OS上の実際のディレクトリ。論理ファイル＝プログラムが使う名前→FILE設定で物理に結びつく。\nflowchart：ABAP(論理名) → FILE設定 → 物理パス → サーバ上のファイル",
          content: (
            <>
              <h2>論理ファイルの概念</h2>
              <p>
                ABAP からファイルを扱うとき、プログラムは通常<strong>論理ファイル名</strong>だけを指定します。
                実際のフォルダ（物理パス）は、SAP の設定で結びつけます。環境（開発・本番）が変わってもプログラムを直さずに済むのが利点です。
              </p>
              <InfoPanel title="用語の対応" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>種類</th>
                      <th>内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>論理パス</td>
                      <td>ディレクトリの抽象名（例: インターフェース用フォルダ）</td>
                    </tr>
                    <tr>
                      <td>物理パス</td>
                      <td>サーバ OS 上の実際のパス</td>
                    </tr>
                    <tr>
                      <td>論理ファイル</td>
                      <td>プログラムが指定するファイル名 → 設定により物理ファイルへ解決</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <MermaidDiagram
                chart={`flowchart LR
  A[ABAP プログラム] -->|論理ファイル名| B[FILE 設定]
  B --> C[物理パス]
  C --> D[サーバ上のファイル]`}
              />
              <Dialog speaker="b">
                住所の「部署名」だけ書いて、実際の部屋番号は総務が管理している、みたいなイメージですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "FILE設定",
          plainText:
            "FILE（論理ファイル）の設定\n手順：①論理パス定義 ②物理パス割当 ③論理ファイル定義。Basis/設定担当と連携することが多い。\nABAPでは FILE_GET_NAME で論理名から物理パスを取得してから OPEN DATASET 等を使う。",
          content: (
            <>
              <h2>
                <code>FILE</code> トランザクションでの設定
              </h2>
              <p>論理と物理を結びつける設定は、おおむね次の順で行います（権限・運用はプロジェクトにより異なります）。</p>
              <ol>
                <li>
                  <strong>論理パス</strong>を定義（インターフェース用ディレクトリの論理名）
                </li>
                <li>
                  <strong>物理パス</strong>を論理パスに割り当て（開発・本番でパスが違う場合もここで吸収）
                </li>
                <li>
                  <strong>論理ファイル</strong>を定義（プログラムが使うファイル名と形式）
                </li>
              </ol>
              <Callout variant="note">
                設定変更は Basis や設定担当と連携することが多いです。開発者は「どの論理名を使うか」を設計書で把握しておく、が実務でのスタンスです。
              </Callout>
              <CodeBlock
                language="ABAP"
                code={`DATA lv_path TYPE string.

CALL FUNCTION 'FILE_GET_NAME'
  EXPORTING
    logical_filename = 'ZIF_DATA_IN'
  CHANGING
    physical_filename = lv_path.

" lv_path を使って OPEN DATASET 等で読み書き`}
              />
              <Dialog speaker="a">
                プログラムは論理名だけ持ち、パス解決は <code>FILE_GET_NAME</code> に任せる。環境差分をここで吸収する設計ですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "OPEN DATASETで読む",
          plainText:
            "OPEN DATASETで読む\nFILE_GET_NAMEで物理パス取得→OPEN FOR INPUT→READ DATASETで1行ずつ→CLOSE。TEXT MODE ENCODING UTF-8がCSV/テキストで一般的。DOループ＋sy-subrc<>0でEXITが定番。\nBちゃん：SELECTと何が違うの？なぜOPEN/CLOSEが要るの？\n先生：読む相手が違う。SELECT＝DBの表、LOOP＝内部テーブル、ここはサーバ上のテキストファイル＝行が並んだ1本のファイル。ファイルは開く→1行ずつ読む→閉じる。本のしおりのように順に進み、最後まで読むとREADのsy-subrcが0以外＝ファイル終端の合図。\n用語メモ：IN TEXT MODE ENCODING UTF-8＝テキストとして・文字コードUTF-8で読む指定。\nAくん：読む対象で命令が決まる。表→SELECT／内部テーブル→LOOP／ファイル→OPEN/READ/CLOSE。",
          content: (
            <>
              <h2>
                <code>OPEN DATASET</code> でサーバファイルを読む
              </h2>
              <p>
                論理ファイル名から物理パスを得たあと、ABAP は次の<strong>3ステップ</strong>で1行ずつ読みます。
                会計伝票登録 IF の「ファイル読込」に相当する処理です。
              </p>
              <MermaidDiagram
                chart={`flowchart LR
  O[OPEN DATASET] --> R[READ DATASET]
  R --> P[行の処理]
  P --> R
  P --> C[CLOSE DATASET]`}
              />
              <CodeBlock
                language="ABAP"
                code={`DATA lv_path TYPE string.
DATA lv_line TYPE string.

CALL FUNCTION 'FILE_GET_NAME'
  EXPORTING logical_filename = 'ZIF_DATA_IN'
  CHANGING  physical_filename = lv_path.

OPEN DATASET lv_path
  FOR INPUT
  IN TEXT MODE
  ENCODING UTF-8.

DO.
  READ DATASET lv_path INTO lv_line.
  IF sy-subrc <> 0.
    EXIT.  " ファイル終端
  ENDIF.

  " ここで SPLIT や検証・登録へ

ENDDO.

CLOSE DATASET lv_path.`}
              />
              <Dialog speaker="teacher">
                物理パスをプログラムに直書きしない。<code>FILE_GET_NAME</code> とセットで覚えると、
                開発・本番の切り替えが楽になります。
              </Dialog>
              <Dialog speaker="b">
                <code>SELECT</code> と何が違うの？ なぜ <code>OPEN</code> や <code>CLOSE</code> が要るんですか？
              </Dialog>
              <Dialog speaker="teacher">
                読む<strong>相手</strong>が違うんです。<code>SELECT</code> は DB の<strong>表</strong>を読み、
                <code>LOOP</code> は<strong>内部テーブル</strong>を読みます。ここで読むのは
                サーバ上の<strong>テキストファイル</strong>＝行が並んだ1本のファイルです。
                ファイルは「開く → 1行ずつ読む → 閉じる」が基本動作。本のしおりのように先頭から順に進み、
                最後まで読むと <code>READ</code> の <code>sy-subrc</code> が0以外になる＝ファイル終端の合図です。
                だから <code>OPEN</code> で開き、読み終わったら <code>CLOSE</code> で閉じる、がセットになります。
              </Dialog>
              <Callout variant="note">
                用語メモ：<code>IN TEXT MODE ENCODING UTF-8</code>＝ファイルを<strong>テキストとして</strong>、
                <strong>文字コード UTF-8</strong> で読む指定です。区切り文字や文字コードは設計書で確認します。
              </Callout>
              <Dialog speaker="a">
                「読む対象」で命令が決まるんですね。表＝<code>SELECT</code>、内部テーブル＝<code>LOOP</code>、
                ファイル＝<code>OPEN</code> / <code>READ</code> / <code>CLOSE</code>。対象が違えば道具も違う、と整理しました。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="15-document-posting"
                slide={10}
                label="次へ: 会計伝票登録（BAPI・ロック）"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "行の分解",
          plainText:
            "行データの分解\nCSVなどは1行をSPLITで項目に分ける。区切り文字（カンマ・タブ）は設計書で確認。分解後に内部テーブルやBAPI用構造へMOVE。",
          content: (
            <>
              <h2>行データの分解（<code>SPLIT</code>）</h2>
              <p>
                外部ファイルの1行は、しばしば<strong>区切り文字</strong>で連結された文字列です。
                <code>SPLIT</code> で項目に分け、検証や BAPI 用データ作成へ渡します。
              </p>
              <CodeBlock
                language="ABAP"
                code={`DATA: lv_a TYPE string,
        lv_b TYPE string,
        lv_c TYPE string.

SPLIT lv_line AT ',' INTO lv_a lv_b lv_c.

" 項目数が可変のときは INTO TABLE 句を使う設計もある`}
              />
              <Callout variant="tip">
                区切り文字・文字コード・ヘッダ行の有無は<strong>設計書</strong>で確認します。
              </Callout>
            </>
          ),
        },
        {
          title: "ファイルフォーマット設計",
          plainText:
            "ファイルフォーマット設計 — 設計書の読み方\n連携ファイルは設計書で形式が定義される。区切り文字（カンマ・タブ）・文字コード（UTF-8等）・ヘッダ行の有無・項目順・固定長か可変長かを確認する。\n1行の項目数とABAP側の受け皿（構造体・変数）が一致しているかが読み取りの要点。",
          content: (
            <>
              <h2>ファイルフォーマット設計 — 設計書の読み方</h2>
              <p>
                外部システムから渡されるファイルは、<strong>設計書のレイアウト定義</strong>に従います。
                プログラムを書く前に、次の項目が読み取れるかを確認します。
              </p>
              <InfoPanel title="設計書で確認する項目" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>項目</th>
                      <th>確認内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>区切り文字</td>
                      <td>カンマ・タブ・パイプなど（<code>SPLIT</code> の <code>AT</code> 句に対応）</td>
                    </tr>
                    <tr>
                      <td>文字コード</td>
                      <td>UTF-8 / Shift_JIS など（<code>OPEN DATASET</code> の <code>ENCODING</code>）</td>
                    </tr>
                    <tr>
                      <td>ヘッダ行</td>
                      <td>1行目をスキップするか、データ行から読むか</td>
                    </tr>
                    <tr>
                      <td>項目順・桁数</td>
                      <td>固定長か可変長か、何列目が何の業務項目か</td>
                    </tr>
                    <tr>
                      <td>日付・金額の形式</td>
                      <td><code>YYYYMMDD</code> か <code>YYYY-MM-DD</code> か、小数点の扱い</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                設計書の表を見て「1行を <code>SPLIT</code> したあと、何列目をどの変数に入れるか」が説明できる状態が目標です。
                形式が曖昧なまま読み込むと、検証や BAPI 登録の段階で初めて不整合が出ます。
              </Dialog>
              <Callout variant="note">
                ジョブや BDC の操作手順の細部は、手を動かす演習は別資料で扱います。ここでは<strong>設計の型が読める</strong>ことを重視します。
              </Callout>
            </>
          ),
        },
        {
          title: "サーバファイル操作",
          plainText:
            "サーバファイル操作（GUI）\nAL11：サーバ上のディレクトリ・ファイル一覧を確認。CG3Z：PC→サーバアップロード（バイナリモードが一般的）。CG3Y：サーバ→PCダウンロード。\n業務：連携ファイルの配置確認・テストデータの投入・結果ファイルの取得。",
          content: (
            <>
              <h2>サーバファイル操作（GUI）</h2>
              <p>
                プログラム以外にも、トランザクションからファイルを扱う場面があります。
                連携テストや障害調査でよく使います。
              </p>
              <ul>
                <li>
                  <code>AL11</code> … アプリケーションサーバ上のディレクトリ・ファイルを<strong>参照</strong>（置き場所の確認）
                </li>
                <li>
                  <code>CG3Z</code> … ローカル PC → SAP サーバへ<strong>アップロード</strong>（バイナリモードが一般的）
                </li>
                <li>
                  <code>CG3Y</code> … SAP サーバ → ローカル PC へ<strong>ダウンロード</strong>
                </li>
              </ul>
              <MermaidDiagram
                chart={`flowchart LR
  PC[ローカル PC] -->|CG3Z アップロード| SRV[SAP サーバ]
  SRV -->|CG3Y ダウンロード| PC
  SRV -->|AL11 参照| OPS[運用・調査]`}
              />
              <Dialog speaker="teacher">
                ファイル連携の「外部ファイル → 検証 → 登録」フローでは、取込<strong>前</strong>にサーバへファイルを置く工程があります。
                その置き場所を <code>AL11</code> で確認する、というつながりです。
              </Dialog>
            </>
          ),
        },
        {
          title: "バックグラウンドジョブ",
          plainText:
            "バックグラウンドジョブ\n大量データや夜間処理は、対話実行ではなくバックグラウンド（バッチ）で動かす。SE38から簡易起動、SM36で詳細定義（スケジュール・優先度）、SM37で一覧・ログ確認。\nBちゃん：対話実行とバックグラウンドの違いは？スプールって？\n先生：対話実行＝画面を見ながら実行・終わるまで待つ／バックグラウンド＝裏で実行・画面を占有しない・夜間や大量向き。スプール＝バッチの出力（帳票・結果）が貯まる場所（SM37で確認）。",
          content: (
            <>
              <h2>バックグラウンドジョブ</h2>
              <p>
                処理時間が長いレポートや、夜間の一括処理は、画面を占有しない<strong>バックグラウンドジョブ</strong>として実行します。
              </p>
              <InfoPanel title="作成・確認" variant="reference">
                <ul>
                  <li>
                    <code>SE38</code> … 実行 → バックグラウンド（手軽な起動）
                  </li>
                  <li>
                    <code>SM36</code> … ジョブの詳細定義（開始日時・優先度など）。運用ではこちらが一般的
                  </li>
                  <li>
                    <code>SM37</code> … ジョブ一覧・実行結果・スプール・ログの確認
                  </li>
                </ul>
              </InfoPanel>
              <MermaidDiagram
                chart={`flowchart LR
  A[プログラム] --> B{実行方法}
  B -->|対話| C[画面で待つ]
  B -->|バックグラウンド| D[SM36 / SE38]
  D --> E[SM37 で結果確認]`}
              />
              <Dialog speaker="a">
                会計の夜間バッチや大量の取込後処理は、ほぼ必ずジョブとしてスケジュールされますね。
              </Dialog>
              <Dialog speaker="b">
                対話実行とバックグラウンドは、何が違うんですか？ スプールってよく聞きます。
              </Dialog>
              <Dialog speaker="teacher">
                <strong>対話実行</strong>は画面を見ながら実行し、終わるまで待ちます。
                <strong>バックグラウンド</strong>は裏で実行し、画面を占有しません。夜間や大量処理向きです。
                <strong>スプール</strong>は、バッチの出力（帳票・結果）が貯まる場所のこと。
                <code>SM37</code> でジョブと一緒に確認できます。
              </Dialog>
            </>
          ),
        },
        {
          title: "バッチインプット",
          plainText:
            "バッチインプット（BDC）\n画面操作をデータ化して自動再生する仕組み。SM35で記録→BDCテーブル→ABAPでCALL TRANSACTION等。\nBDCDATA：PROGRAM DYNPRO FNAM FVAL。SY-SUBRCで成否判定。\nBちゃん：画面操作をデータにするってどういうこと？\n先生：自動操縦・台本のイメージ。BDC＝人が画面で行うキー入力・操作を台本（データ）に記録し、プログラムが台本どおりに自動で画面を操作する仕組み。DYNPRO＝画面番号、FNAM＝入力する欄の名前、FVAL＝その欄に入れる値。\nAくん：BDCとBAPIの使い分けは？\n先生：BAPI＝SAPが用意した正式な登録の入口（推奨）、BDC＝正式な入口が無い／使えないとき人の画面操作を真似て登録する代替。新規はBAPI優先。",
          content: (
            <>
              <h2>バッチインプット（BDC）</h2>
              <p>
                <strong>バッチインプット</strong>（BDC = Batch Data Communication）は、
                本来手で入力する画面操作を、データとして記録し、プログラムから<strong>自動再生</strong>する仕組みです。
                標準トランザクションで登録する処理（伝票登録など）を、API が無い・使わない場合の選択肢として残っています。
              </p>
              <p>おおまかな流れは次のとおりです（詳細はプロジェクト標準に従います）。</p>
              <ol>
                <li>
                  <code>SM35</code> などで画面操作を<strong>記録</strong>し、BDC 用のデータ構造を得る
                </li>
                <li>ABAP 内で内部テーブル（BDCDATA）に画面・項目・値を並べる</li>
                <li>
                  <code>CALL TRANSACTION</code> などで再生し、<code>SY-SUBRC</code> で成否を判定する
                </li>
              </ol>
              <InfoPanel title="BDCDATA の主な項目" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>項目</th>
                      <th>内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <code>PROGRAM</code>
                      </td>
                      <td>画面のプログラム名</td>
                    </tr>
                    <tr>
                      <td>
                        <code>DYNPRO</code>
                      </td>
                      <td>画面番号</td>
                    </tr>
                    <tr>
                      <td>
                        <code>FNAM</code>
                      </td>
                      <td>フィールド名</td>
                    </tr>
                    <tr>
                      <td>
                        <code>FVAL</code>
                      </td>
                      <td>入力値</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="b">
                「画面操作をデータにする」ってどういうことですか？
              </Dialog>
              <Dialog speaker="teacher">
                <strong>自動操縦</strong>や<strong>台本</strong>をイメージしてください。BDC は、人が画面で行う
                キー入力や操作（どの画面で・どの欄に・何を入れるか）を<strong>台本（データ）</strong>に記録しておき、
                プログラムがその台本どおりに自動で画面を操作する仕組みです。
                台本の中身が <code>BDCDATA</code> で、<code>DYNPRO</code>＝画面番号、
                <code>FNAM</code>＝入力する欄の名前、<code>FVAL</code>＝その欄に入れる値、を1行ずつ並べたものです。
              </Dialog>
              <Dialog speaker="a">
                BDC と BAPI は、どう使い分けるんですか？
              </Dialog>
              <Dialog speaker="teacher">
                <strong>BAPI</strong> は SAP が用意した<strong>正式な登録の入口</strong>（API）で、新規開発では推奨です。
                <strong>BDC</strong> は、正式な入口が無い・使えないときに、人の画面操作を真似て登録する<strong>代替手段</strong>。
                新規はまず BAPI を優先し、BDC は標準画面をそのまま踏む必要がある場面で使う、と覚えてください。
              </Dialog>
              <Callout variant="warning">
                新規開発では <strong>BAPI</strong>（会計伝票登録の章）が優先されることが多いです。BDC はレガシー保守・標準画面をそのまま踏む必要がある場面で登場します。
              </Callout>
            </>
          ),
        },
        {
          title: "CALL TRANSACTION",
          plainText:
            "CALL TRANSACTION\nCALL TRANSACTION 'トランザクションコード'. SY-SUBRC = 0 なら成功のことが多い（メッセージも併せて確認）。\nBDCテーブルを渡して画面登録を実行する典型的なパターン。",
          content: (
            <>
              <h2>
                <code>CALL TRANSACTION</code>
              </h2>
              <p>
                BDC データを渡して、指定したトランザクションを実行する典型的な書き方です。
                トランザクションコードは<strong>業務で使う画面のコード</strong>（例: 伝票登録系）です。
              </p>
              <CodeBlock
                language="ABAP"
                code={`CALL TRANSACTION 'FB01'
  USING gt_bdcdata
  MODE 'N'
  UPDATE 'S'
  MESSAGES INTO gt_messages.

IF sy-subrc <> 0.
  " エラー処理（メッセージテーブルを確認）
ENDIF.`}
              />
              <Dialog speaker="teacher">
                成功・失敗は <code>SY-SUBRC</code> だけでなく、<code>MESSAGES</code> に蓄積されたメッセージも必ず確認します。
                会計登録では「一部だけ登録された」状態がいちばん危険なので、設計書の例外方針とセットで考えます。
              </Dialog>
            </>
          ),
        },
        {
          title: "実務でのつながり",
          plainText:
            "実務でのつながり\nファイル連携（請求・伝票データ）→ 論理ファイル・ジョブ。画面登録の自動化 → BDC または BAPI。夜間処理 → SM36/SM37。\n会計伝票登録の知識と組み合わせて理解する。",
          content: (
            <>
              <h2>実務でのつながり</h2>
              <p>FI/ERP 系の ABAP 業務では、次のように章がつながります。</p>
              <ul>
                <li>
                  <strong>ファイル連携</strong> … 論理ファイル + <code>FILE_GET_NAME</code> + サーバ上の配置（<code>AL11</code> / <code>CG3Z</code>）
                </li>
                <li>
                  <strong>大量・夜間処理</strong> … バックグラウンドジョブ（<code>SM36</code> / <code>SM37</code>）
                </li>
                <li>
                  <strong>画面経由の登録</strong> … 可能なら BAPI、必要に応じて BDC
                </li>
              </ul>
              <MermaidDiagram
                chart={`flowchart TB
  subgraph file [ファイル連携]
    F1[外部ファイル] --> F2[サーバ配置 AL11/CG3Z]
    F2 --> F3[OPEN/READ/CLOSE]
    F3 --> F4[SPLIT 分解]
  end
  subgraph reg [登録]
    R1[検証] --> R2[ロック]
    R2 --> R3[BAPI + RETURN]
    R3 --> R4[COMMIT/ROLLBACK]
    R4 --> R5[履歴]
    R5 --> R6[DEQUEUE]
  end
  file --> reg`}
              />
              <Dialog speaker="teacher">
                開発では各パーツを分けて作ることもありますが、本番では<strong>読込から登録・履歴まで1本のフロー</strong>としてつながります。
                設計書を読むときは「ファイルか・ジョブか・登録か」を意識すると迷いません。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="15-document-posting"
                slide={4}
                label="次へ: 会計伝票登録（BAPI・ロック）"
                variant="back"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 論理ファイルの利点は？→ 環境が変わってもプログラムの論理名は同じ\nQ2 ジョブ結果確認は？→ SM37\nQ3 BDCの位置づけは？→ 画面操作をデータ化して自動実行\n今日のひとこと：連携は論理名・ジョブ・登録の3層で読むと設計書がすっきり見える。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={0}
                explanation="論理ファイル名はプログラム側で固定し、物理パスは FILE 設定で環境ごとに切り替えます。本番移行時に ABAP を書き換えなくて済むのが主な利点です。"
                question={<strong>論理ファイルを使う主な利点は？</strong>}
                options={[
                  "環境が変わってもプログラムは同じ論理名を使える",
                  "物理パスをプログラムに直書きしたほうが安全",
                  "GUI でファイル操作できなくなる",
                ]}
              />
              <Quiz
                answer={2}
                explanation="SM37 はジョブの実行状況・ログ・スプールを確認する画面です。SM36 は定義、SE38 からは簡易起動です。"
                question={<strong>バックグラウンドジョブの実行結果を確認するトランザクションは？</strong>}
                options={["SE38", "FILE", "SM37"]}
              />
              <Quiz
                answer={1}
                explanation="BDC は画面入力を BDCDATA として再生する方式です。新規では BAPI が優先されることが多く、BDC は保守・標準画面踏襲などで使われます。"
                question={<strong>バッチインプット（BDC）の説明として正しいのは？</strong>}
                options={[
                  "データベースを直接 UPDATE するだけの仕組み",
                  "画面操作をデータ化して自動実行する仕組み",
                  "ファイルを PC にだけ保存する仕組み",
                ]}
              />
              <Quiz
                answer={0}
                explanation="サーバ上のテキストファイルは OPEN → READ（ループ）→ CLOSE の順で読みます。READ で sy-subrc <> 0 になったらファイル終端としてループを抜けるのが定番です。"
                question={<strong>サーバファイルを1行ずつ読む基本的な順序は？</strong>}
                options={[
                  "OPEN DATASET → READ DATASET（ループ）→ CLOSE DATASET",
                  "CLOSE DATASET → READ DATASET → OPEN DATASET",
                  "SELECT だけでファイル全文を取得する",
                ]}
              />
              <Dialog speaker="closing">
                連携は「論理名・ジョブ・登録」の3層で読むと、設計書がすっきり見えてきます。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="15-document-posting"
                slide={4}
                label="次へ: 会計伝票登録（BAPI・ロック）"
                className="mb-4 mt-4"
              />
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(FilesJobsAndBatchLesson);
