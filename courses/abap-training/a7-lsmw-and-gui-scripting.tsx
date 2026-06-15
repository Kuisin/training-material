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
  title: "LSMWとSAP GUI Scripting — 画面操作の自動化",
  meta: "初学者 · 40分",
};

export default function LsmwAndGuiScriptingLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-training", "a7-lsmw-and-gui-scripting", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "LSMWとSAP GUI Scripting\n画面操作を自動化する2つの代表的な手段。LSMWはSAP内のマイグレーション向けツール、GUI ScriptingはPC上のSAP GUI操作をスクリプト化する。\n⏱ 40分 / 📶 初学者 / 🏷 ABAP研修\nこの章で学ぶこと\n・LSMWとGUI Scriptingの位置づけ（BDC・BAPIとの関係）\n・それぞれのメリット・デメリット\n・LSMWの基本手順（オブジェクト作成〜実行）\n・GUI Scriptingの有効化・記録・VBSの基本\n・用途に応じた選び方",
          content: (
            <>
              <hgroup>
                <h1>LSMW と SAP GUI Scripting</h1>
                <p>
                  SAP にデータを<strong>画面経由で大量登録</strong>したり、
                  <strong>定型操作を自動化</strong>したりする場面で登場する2つの手段を整理します。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "40分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "ABAP研修" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>
                  <strong>LSMW</strong>（Legacy System Migration Workbench）と<strong>SAP GUI Scripting</strong>の位置づけ
                </li>
                <li>それぞれの<strong>メリット・デメリット</strong></li>
                <li>
                  LSMW の基本手順（<code>LSMW</code> トランザクションでのオブジェクト作成〜実行）
                </li>
                <li>GUI Scripting の有効化・記録・VBS（Visual Basic Script）の基本</li>
                <li>BDC・BAPI と並べたときの<strong>選び方</strong></li>
              </ul>
              <Callout variant="note">
                本章は「画面を踏む自動化」の<strong>実務ツール</strong>に焦点を当てます。
                BDC の概念や <code>CALL TRANSACTION</code> の書き方は第14章、BAPI は第15章で扱います。
              </Callout>
            </>
          ),
        },
        {
          title: "位置づけ",
          plainText:
            "画面自動化の選択肢\nBAPI=公式API（新規優先）。BDC=ABAP内で画面再生。LSMW=SAP標準のマイグレーション向けウィザード。GUI Scripting=PC上のSAP GUI操作をVBS等で記録・再生。\nflowchart：外部データ→BAPI/BDC/LSMW/GUI Scripting→SAP画面→DB",
          content: (
            <>
              <h2>画面自動化の選択肢</h2>
              <p>
                SAP にデータを登録する方法は複数あります。
                本章の2つは、いずれも<strong>標準画面の操作を自動化する</strong>系統に属します。
              </p>
              <InfoPanel title="4つの代表的な手段" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>手段</th>
                      <th>概要</th>
                      <th>主な利用者</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>BAPI</strong>
                      </td>
                      <td>SAP が提供する公式 API（例: 会計伝票登録）</td>
                      <td>ABAP 開発者</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>BDC</strong>
                      </td>
                      <td>画面操作を BDCDATA として ABAP から再生</td>
                      <td>ABAP 開発者</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>LSMW</strong>
                      </td>
                      <td>マイグレーション向けの SAP 標準ウィザード（BDC 等を内部利用）</td>
                      <td>機能コンサル・キーユーザー</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>GUI Scripting</strong>
                      </td>
                      <td>PC 上の SAP GUI 操作を VBS 等で記録・再生</td>
                      <td>キーユーザー・業務担当</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <MermaidDiagram
                chart={`flowchart LR
  D[外部データ / Excel] --> C{手段の選択}
  C -->|新規開発| BAPI[BAPI]
  C -->|ABAP連携| BDC[BDC / CALL TRANSACTION]
  C -->|移行・一括| LSMW[LSMW]
  C -->|PC操作の定型化| GS[GUI Scripting]
  BAPI --> S[SAP 画面 / ロジック]
  BDC --> S
  LSMW --> S
  GS --> S
  S --> DB[(データベース)]`}
              />
              <Dialog speaker="teacher">
                新規の IF 開発では <strong>BAPI が第一候補</strong>です。
                LSMW と GUI Scripting は「ABAP を書かずに画面を踏みたい」「移行期の一括登録」など、
                <strong>開発以外の現場</strong>でもよく使われます。保守設計書に名前が出てきたら、本章の整理が役立ちます。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="14-files-jobs-and-batch"
                slide={5}
                label="第14章: BDC の概念を復習する"
                variant="back"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "LSMWとは",
          plainText:
            "LSMW（Legacy System Migration Workbench）\n旧システムからSAPへデータを移行・一括登録するためのSAP標準ツール。トランザクション LSMW。ウィザード形式でオブジェクトを作成し、ファイル読込→変換→画面登録を実行。\n主なインポート方法：標準/ダイレクト入力、BDC、IDoc など。",
          content: (
            <>
              <h2>
                LSMW（Legacy System Migration Workbench）とは
              </h2>
              <p>
                <strong>LSMW</strong> は、旧システムや Excel から SAP へデータを
                <strong>一括移行・登録</strong>するための SAP 標準ツールです。
                トランザクション <code>LSMW</code> から利用します。
              </p>
              <InfoPanel title="LSMW の主な構成" variant="reference">
                <ul>
                  <li>
                    <strong>プロジェクト / サブプロジェクト / オブジェクト</strong> … 作業単位の階層
                  </li>
                  <li>
                    <strong>インポート方法</strong> … データの取り込み方（後述）
                  </li>
                  <li>
                    <strong>ソース構造・ソースフィールド</strong> … 取込ファイルの列定義
                  </li>
                  <li>
                    <strong>構造関係・フィールドマッピング</strong> … SAP 側項目への対応付け
                  </li>
                  <li>
                    <strong>固定値・変換・条件</strong> … 補完・変換ルール
                  </li>
                  <li>
                    <strong>ファイル読込 → データ読込 → 変換 → 実行</strong> … 実行フェーズ
                  </li>
                </ul>
              </InfoPanel>
              <InfoPanel title="よく使うインポート方法" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>方法</th>
                      <th>内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>標準 / ダイレクト入力</td>
                      <td>標準プログラムやダイレクト入力でテーブル等に書き込む</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>バッチ入力（BDC）</strong>
                      </td>
                      <td>画面操作を記録し、一括で再生（実務で最も多いパターンの一つ）</td>
                    </tr>
                    <tr>
                      <td>IDoc</td>
                      <td>中間ドキュメント経由で連携</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="tip">
                LSMW は名前のとおり<strong>移行（Migration）</strong>向けに設計されていますが、
                マスタの初期登録や大量の伝票登録など、<strong>画面ベースの一括処理</strong>全般に使われます。
              </Callout>
            </>
          ),
        },
        {
          title: "LSMWのメリット・デメリット",
          plainText:
            "LSMWのメリット：ABAP不要で設定中心、再利用・再実行しやすい、移行ドキュメントとして残る、BDC記録をGUIで管理。\nデメリット：画面変更に弱い、大規模・複雑な変換は向かない、S/4移行でLTMC等に置き換えられる場面、実行時間・エラー分析が重い。",
          content: (
            <>
              <h2>LSMW のメリット・デメリット</h2>
              <InfoPanel title="メリット" variant="reference">
                <ul>
                  <li>
                    <strong>ABAP を書かずに</strong>、設定とウィザード操作で一括登録ができる
                  </li>
                  <li>
                    オブジェクト単位で<strong>再利用・再実行</strong>しやすい（移行テスト → 本番の繰り返し）
                  </li>
                  <li>
                    ソース構造・マッピング・変換ルールが LSMW 内に残り、<strong>作業手順のドキュメント</strong>になる
                  </li>
                  <li>
                    BDC 記録を GUI で管理でき、<code>SM35</code> 単体より<strong>移行プロジェクト向けに整理</strong>しやすい
                  </li>
                  <li>キーユーザー・機能コンサルが主担当になりやすい（開発リソースを節約）</li>
                </ul>
              </InfoPanel>
              <InfoPanel title="デメリット" variant="reference">
                <ul>
                  <li>
                    <strong>画面レイアウト変更</strong>（フィールド追加・タブ変更）でマッピングや BDC 記録が<strong>壊れやすい</strong>
                  </li>
                  <li>
                    複雑なビジネスロジックや多段階の検証は、LSMW だけでは<strong>表現しきれない</strong>ことが多い
                  </li>
                  <li>
                    S/4HANA 移行では <strong>LTMC</strong>（Migration Cockpit）等に置き換えられる場面がある（エディション・バージョン依存）
                  </li>
                  <li>
                    大量データ実行時は<strong>時間がかかる</strong>。エラー行の特定・再実行設計が必要
                  </li>
                  <li>
                    本番運用の<strong>定常 IF</strong> としては、BAPI / 本格 ABAP 連携のほうが保守しやすいことが多い
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="b">
                Excel から得意先マスタを数百件入れたい、という依頼が来たら LSMW ですか？
              </Dialog>
              <Dialog speaker="teacher">
                <strong>移行・初期登録の一時作業</strong>なら LSMW は有力候補です。
                ただし定常的に毎日ファイル連携するなら、第14章のファイル連携 + BAPI のほうが向いています。
                「一時か定常か」で判断しましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "LSMWの使い方（準備）",
          plainText:
            "LSMWの使い方 — 準備\n1 LSMW起動 2 プロジェクト/サブプロジェクト/オブジェクト作成 3 インポート方法選択（BDCが多い）4 ソース構造・フィールド定義 5 構造関係・マッピング 6 固定値・変換・条件\n事前に登録対象トランザクション・ファイル形式・テストデータを用意。",
          content: (
            <>
              <h2>LSMW の使い方 — 準備とオブジェクト定義</h2>
              <p>
                以下は<strong>BDC 方式</strong>を例にした典型的な手順です。
                実際の画面ラベルは SAP バージョンで多少異なりますが、流れは共通です。
              </p>
              <Callout variant="warning">
                本番実行前に必ず<strong>開発 / テスト環境</strong>で試し、
                件数が多い場合は<strong>分割実行</strong>（例: 100件ずつ）から始めてください。
              </Callout>
              <ol>
                <li>
                  <strong>
                    <code>LSMW</code> を起動する
                  </strong>
                </li>
                <li>
                  <strong>プロジェクト階層を作成する</strong>
                  <InstructionSubsteps>
                    <li>
                      <strong>プロジェクト</strong> … 移行単位（例: FI マスタ移行）
                    </li>
                    <li>
                      <strong>サブプロジェクト</strong> … オブジェクトのグループ
                    </li>
                    <li>
                      <strong>オブジェクト</strong> … 1 種類の登録処理（例: 得意先登録 XD01）
                    </li>
                  </InstructionSubsteps>
                </li>
                <li>
                  <strong>実行ステップを表示し、各ステップを設定する</strong>
                  <KeyValueTable
                    labelHeader="ステップ（例）"
                    valueHeader="内容"
                    rows={[
                      { label: "インポート方法", value: "バッチ入力（画面）を選択" },
                      { label: "ソース構造", value: "取込ファイルのレコード形式（1 行 = 1 レコード等）" },
                      { label: "ソースフィールド", value: "ファイルの列名・長さ・型" },
                      { label: "構造関係", value: "ソース → SAP 構造（BDC 記録）の対応" },
                      { label: "フィールドマッピング", value: "ファイル列 → 画面項目" },
                      { label: "固定値・変換・条件", value: "共通値の設定、日付変換、条件分岐" },
                    ]}
                  />
                </li>
              </ol>
              <MermaidDiagram
                chart={`flowchart TD
  A[LSMW 起動] --> B[オブジェクト作成]
  B --> C[インポート方法: BDC]
  C --> D[ソース構造・フィールド定義]
  D --> E[構造関係・マッピング]
  E --> F[固定値・変換・条件]
  F --> G[ファイル読込]
  G --> H[データ読込]
  H --> I[変換]
  I --> J[実行]`}
              />
              <Callout variant="tip">
                事前に用意するもの: <strong>登録対象のトランザクション</strong>（例: <code>XD01</code>）、
                <strong>サンプルファイル</strong>（Excel → テキスト化）、<strong>テスト用 1〜3 件</strong>の正解データ。
              </Callout>
            </>
          ),
        },
        {
          title: "LSMWの使い方（BDC記録〜実行）",
          plainText:
            "LSMW — BDC記録と実行\n構造関係でBDC記録：対象トランザクションを1件手入力で記録→LSMWが画面項目を取得。ファイル読込→データ読込→変換→実行。エラーはログとSM35で確認。再実行はエラー行だけ抽出。",
          content: (
            <>
              <h2>LSMW の使い方 — BDC 記録と実行</h2>
              <ol start={4}>
                <li>
                  <strong>BDC 記録（構造関係の設定）</strong>
                  <InstructionSubsteps>
                    <li>インポート方法で「バッチ入力（画面）」を選んだ場合、対象トランザクションを指定</li>
                    <li>
                      <strong>1 件分</strong>を手入力で登録し、画面操作を記録（第14章の <code>SM35</code> 記録と同系統）
                    </li>
                    <li>記録結果から、LSMW が SAP 側の<strong>構造・フィールド</strong>を取得</li>
                  </InstructionSubsteps>
                </li>
                <li>
                  <strong>フィールドマッピング</strong>
                  <InstructionSubsteps>
                    <li>ソースファイルの列を、記録された画面項目に<strong>ドラッグ＆ドロップまたは割当</strong></li>
                    <li>固定値（例: 会社コード）や変換ルール（日付形式など）を設定</li>
                  </InstructionSubsteps>
                </li>
                <li>
                  <strong>実行フェーズ</strong>
                  <InstructionSubsteps>
                    <li>
                      <strong>ファイル読込</strong> … テキストファイル等を指定
                    </li>
                    <li>
                      <strong>データ読込</strong> … LSMW 内部テーブルへ取込
                    </li>
                    <li>
                      <strong>変換</strong> … マッピング・ルールを適用
                    </li>
                    <li>
                      <strong>実行</strong> … バックグラウンドまたはフォアグラウンドで BDC 実行
                    </li>
                  </InstructionSubsteps>
                </li>
                <li>
                  <strong>結果確認</strong>
                  <InstructionSubsteps>
                    <li>LSMW の実行ログで<strong>成功 / エラー件数</strong>を確認</li>
                    <li>
                      詳細は <code>SM35</code>（バッチ入力セッション）や <code>SE16N</code> で登録結果を照会
                    </li>
                    <li>エラー行はログから特定し、ファイル修正後に<strong>再実行</strong></li>
                  </InstructionSubsteps>
                </li>
              </ol>
              <InfoPanel title="実行モードの目安" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>モード</th>
                      <th>用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>表示（エラー時停止）</td>
                      <td>初回テスト・原因調査</td>
                    </tr>
                    <tr>
                      <td>バックグラウンド</td>
                      <td>件数が多い本番実行</td>
                    </tr>
                    <tr>
                      <td>エラー時のみ表示</td>
                      <td>テスト後の量産実行</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                LSMW の実行ログと <code>SM35</code> は<strong>セットで見る</strong>習慣をつけましょう。
                「LSMW 上は成功なのにデータがおかしい」は、マッピングミスや部分登録のサインです。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="15-document-posting"
                slide={6}
                label="第15章: BAPI との使い分けを確認"
                variant="back"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "GUI Scriptingとは",
          plainText:
            "SAP GUI Scripting\nSAP GUI for Windowsが提供する、画面上のボタン・フィールド操作をCOM経由で自動化する仕組み。VBS（Visual Basic Script）で記録・再生。サーバ側ABAPではなくクライアントPC上で動く。",
          content: (
            <>
              <h2>SAP GUI Scripting とは</h2>
              <p>
                <strong>SAP GUI Scripting</strong> は、PC 上の <strong>SAP GUI for Windows</strong> の操作
                （ボタンクリック、テキスト入力、タブ移動など）を<strong>スクリプトで自動化</strong>する機能です。
                記録されるスクリプトは多くの場合 <strong>VBS</strong>（Visual Basic Script）形式です。
              </p>
              <InfoPanel title="LSMW / BDC との違い" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>観点</th>
                      <th>LSMW / BDC</th>
                      <th>GUI Scripting</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>実行場所</td>
                      <td>SAP サーバ側（ABAP / バッチ入力）</td>
                      <td>ユーザーの PC（SAP GUI クライアント）</td>
                    </tr>
                    <tr>
                      <td>主な利用者</td>
                      <td>移行担当・ABAP 開発者</td>
                      <td>キーユーザー・業務担当・一部開発者</td>
                    </tr>
                    <tr>
                      <td>データソース</td>
                      <td>ファイル一括（LSMW）/ ABAP 内部テーブル（BDC）</td>
                      <td>Excel 連携、ループ処理をスクリプトに記述</td>
                    </tr>
                    <tr>
                      <td>夜間バッチ</td>
                      <td>向いている（ジョブ化可能）</td>
                      <td>PC が起動している必要あり（向かない）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Callout variant="note">
                GUI Scripting は<strong>クライアント PC 上</strong>で SAP GUI を操作します。
                サーバ側の ABAP ジョブとは独立しているため、
                「PC がログインしたまま」「SAP GUI が起動している」ことが前提になります。
              </Callout>
            </>
          ),
        },
        {
          title: "GUI Scriptingのメリット・デメリット",
          plainText:
            "GUI Scriptingメリット：記録ですぐ試せる、ABAP不要、Excel連携しやすい、定型業務のRPA的利用。\nデメリット：PC依存・セキュリティ制限、SAP GUI/画面変更に弱い、サーバジョブ不可、本番定常IF向きでない、権限設定が必要。",
          content: (
            <>
              <h2>SAP GUI Scripting のメリット・デメリット</h2>
              <InfoPanel title="メリット" variant="reference">
                <ul>
                  <li>
                    SAP GUI の<strong>Script Recording</strong>で操作を記録し、すぐに試せる（学習コストが低い）
                  </li>
                  <li>
                    ABAP 開発なしで、<strong>定型の画面操作</strong>（毎日同じ照会 → Excel 出力など）を自動化できる
                  </li>
                  <li>
                    Excel VBA や VBS から SAP GUI を操作する<strong>RPA 的な連携</strong>が可能
                  </li>
                  <li>
                    少量データの<strong>繰り返し登録</strong>や、移行テストの補助に向く
                  </li>
                  <li>キーユーザーが自分でスクリプトをメンテしやすい</li>
                </ul>
              </InfoPanel>
              <InfoPanel title="デメリット" variant="reference">
                <ul>
                  <li>
                    <strong>セキュリティポリシー</strong>で無効化されている環境が多い（Basis 設定が必要）
                  </li>
                  <li>
                    SAP GUI のバージョンアップ・画面変更で<strong>スクリプトが動かなくなる</strong>
                  </li>
                  <li>
                    <strong>サーバ側ジョブ化不可</strong> … PC が起動・ログオンしている必要がある
                  </li>
                  <li>
                    大量データ処理は<strong>遅く不安定</strong>になりやすい（画面描画の待ち時間に依存）
                  </li>
                  <li>
                    本番の<strong>定常 IF</strong> や監査要件の厳しい処理には向かない（ログ・再実行設計が弱い）
                  </li>
                  <li>
                    複数ユーザー・Citrix 環境では<strong>設定・権限の調整</strong>が複雑
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                GUI Scripting は「<strong>手作業の延長</strong>」と捉えてください。
                便利ですが、<strong>本番の基幹 IF の本体</strong>にするのはリスクが高いです。
                定常連携は BAPI + ジョブ、GUI Scripting は<strong>補助・プロトタイプ</strong>と割り切ると安全です。
              </Dialog>
            </>
          ),
        },
        {
          title: "GUI Scriptingの使い方（有効化）",
          plainText:
            "GUI Scripting有効化\n1 サーバ側：RZ11 gui_scripting_enabled 等 2 クライアント：SAP GUIオプションでスクリプting有効 3 Script Recording and Playbackを有効化。\nセキュリティ上、本番は制限されることが多い。Basis担当と調整。",
          content: (
            <>
              <h2>GUI Scripting の使い方 — 有効化</h2>
              <p>
                Scripting は<strong>サーバ・クライアント両方</strong>で許可が必要です。
                環境によってパラメータ名や設定画面が異なるため、<strong>Basis 担当</strong>と必ず確認してください。
              </p>
              <Callout variant="warning">
                多くの本番環境では<strong>セキュリティ上 Scripting が無効</strong>です。
                勝手に有効化せず、プロジェクトのセキュリティ方針に従いましょう。
              </Callout>
              <ol>
                <li>
                  <strong>サーバ側の許可（Basis）</strong>
                  <InstructionSubsteps>
                    <li>
                      トランザクション <code>RZ11</code> 等でパラメータ{" "}
                      <code>sapgui/user_scripting</code>（名称は環境により <code>gui_scripting</code> 系）を確認
                    </li>
                    <li>
                      値を <code>TRUE</code> に設定（<strong>再起動やポリシー承認</strong>が必要な場合あり）
                    </li>
                    <li>ユーザープロファイルやロールで Scripting を許可する設定がある場合もある</li>
                  </InstructionSubsteps>
                </li>
                <li>
                  <strong>クライアント側（SAP GUI for Windows）</strong>
                  <InstructionSubsteps>
                    <li>SAP GUI を起動 → <strong>オプション</strong>（設定）を開く</li>
                    <li>
                      <strong>スクリプト作成および実行</strong>（Scripting）を有効化
                    </li>
                    <li>
                      <strong>Script Recording and Playback</strong> を有効にする
                    </li>
                    <li>SAP GUI を<strong>再起動</strong>して反映</li>
                  </InstructionSubsteps>
                </li>
                <li>
                  <strong>動作確認</strong>
                  <InstructionSubsteps>
                    <li>
                      メニュー <strong>ヘルプ → 設定 / 情報 → スクリプト</strong> 付近に Recording 項目が表示されるか確認
                    </li>
                    <li>簡単なトランザクション（例: <code>SE16N</code>）で記録テスト</li>
                  </InstructionSubsteps>
                </li>
              </ol>
            </>
          ),
        },
        {
          title: "GUI Scriptingの使い方（記録とVBS）",
          plainText:
            "GUI Scripting — 記録とVBS\nScript Recordingで操作記録→VBS保存→編集（待ち時間・ループ・Excel読込）→再生。session.findByIdで画面要素を指定。WScript.Sleepで待機。\n注意：ハードコードされたIDは画面変更で壊れる。エラー処理を足す。",
          content: (
            <>
              <h2>GUI Scripting の使い方 — 記録と VBS</h2>
              <ol>
                <li>
                  <strong>操作を記録する</strong>
                  <InstructionSubsteps>
                    <li>SAP GUI メニューから <strong>Script Recording</strong> を開始</li>
                    <li>自動化したい操作を<strong>手動で1回</strong>実行（例: ログオン → トランザクション → 入力 → 保存）</li>
                    <li>記録を停止し、<strong>VBS ファイルとして保存</strong></li>
                  </InstructionSubsteps>
                </li>
                <li>
                  <strong>スクリプトを編集する</strong>
                  <InstructionSubsteps>
                    <li>固定値を変数化（会社コード、日付など）</li>
                    <li>
                      <code>WScript.Sleep</code> で<strong>待ち時間</strong>を追加（画面描画の遅延対策）
                    </li>
                    <li>Excel から読み込むループを追加（大量件数向け）</li>
                    <li>エラー時に停止する処理を追加</li>
                  </InstructionSubsteps>
                </li>
                <li>
                  <strong>スクリプトを実行する</strong>
                  <InstructionSubsteps>
                    <li>保存した <code>.vbs</code> をダブルクリック、または <strong>Script Playback</strong> から実行</li>
                    <li>SAP GUI が起動・ログオン済みであることを確認</li>
                  </InstructionSubsteps>
                </li>
              </ol>
              <p>記録された VBS のイメージ（抜粋・簡略化）:</p>
              <CodeBlock
                language="VBScript"
                code={`' SAP GUI Scripting — 記録結果のイメージ（抜粋）
Set SapGuiAuto = GetObject("SAPGUI")
Set application = SapGuiAuto.GetScriptingEngine
Set connection = application.Children(0)
Set session = connection.Children(0)

' トランザクションコード入力
session.findById("wnd[0]/tbar[0]/okcd").text = "FB03"
session.findById("wnd[0]").sendVKey 0

WScript.Sleep 500  ' 画面表示待ち（手動追加が一般的）

' フィールド入力の例
session.findById("wnd[0]/usr/ctxtBKPF-BUKRS").text = "1000"
session.findById("wnd[0]/usr/ctxtBKPF-BELNR").text = "0000000001"
session.findById("wnd[0]/usr/ctxtBKPF-GJAHR").text = "2024"
session.findById("wnd[0]").sendVKey 0`}
              />
              <InfoPanel title="スクリプトメンテのポイント" variant="reference">
                <ul>
                  <li>
                    <code>findById("wnd[0]/usr/...")</code> の ID は<strong>画面変更で変わる</strong>ため、壊れたら再記録が必要
                  </li>
                  <li>
                    <code>sendVKey 0</code> は Enter キー相当。ボタンは <code>press</code> メソッド
                  </li>
                  <li>待ち時間不足は「次の項目が見つからない」エラーの典型原因</li>
                  <li>本番データを試す前に、<strong>テスト環境・1 件</strong>で必ず確認</li>
                </ul>
              </InfoPanel>
              <Callout variant="tip">
                Excel マクロ（VBA）から SAP GUI Scripting を呼び出すパターンもよく見ます。
                「Excel の行をループ → SAP に1行ずつ入力」は GUI Scripting の典型的な使い方です。
              </Callout>
            </>
          ),
        },
        {
          title: "選び方",
          plainText:
            "選び方の指針\n定常IF・夜間バッチ→BAPI+ジョブ。移行・一括・ABAP不要→LSMW。PC上の定型操作・少量→GUI Scripting。既存ABAP内→BDC。\n比較表とフローチャート。",
          content: (
            <>
              <h2>用途に応じた選び方</h2>
              <InfoPanel title="判断の早見表" variant="reference">
                <table>
                  <thead>
                    <tr>
                      <th>シナリオ</th>
                      <th>第一候補</th>
                      <th>補足</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>定常 IF（毎日ファイル連携）</td>
                      <td>
                        <strong>BAPI</strong> + ファイル連携 + ジョブ
                      </td>
                      <td>第14章・第15章の構成</td>
                    </tr>
                    <tr>
                      <td>移行・初期登録（数千件・一時作業）</td>
                      <td>
                        <strong>LSMW</strong>
                      </td>
                      <td>BDC 方式が一般的</td>
                    </tr>
                    <tr>
                      <td>ABAP プログラム内で画面踏襲</td>
                      <td>
                        <strong>BDC</strong>
                      </td>
                      <td>
                        <code>CALL TRANSACTION</code>
                      </td>
                    </tr>
                    <tr>
                      <td>キーユーザーの定型 PC 操作（少量）</td>
                      <td>
                        <strong>GUI Scripting</strong>
                      </td>
                      <td>本番 IF 本体には非推奨</td>
                    </tr>
                    <tr>
                      <td>会計伝票など API が用意されている</td>
                      <td>
                        <strong>BAPI</strong>
                      </td>
                      <td>画面自動化より優先</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <MermaidDiagram
                chart={`flowchart TD
  Q[画面経由でデータを入れたい] --> Q1{定常 IF?}
  Q1 -->|はい| BAPI[BAPI + ジョブ]
  Q1 -->|いいえ・移行| Q2{ABAP 開発できる?}
  Q2 -->|はい| BDC[BDC / CALL TRANSACTION]
  Q2 -->|いいえ| LSMW[LSMW]
  Q --> Q3{PC 上の手操作をそのまま自動化?}
  Q3 -->|少量・補助| GS[GUI Scripting]
  Q3 -->|大量・夜間| BAPI`}
              />
              <Dialog speaker="teacher">
                設計書に「LSMW で登録」と書いてあっても、
                中身は BDC 記録であることがほとんどです。
                逆に「GUI Scripting で IF」と書いてあったら、
                <strong>運用リスク（PC 依存・夜間不可）</strong>を確認するクセをつけましょう。
              </Dialog>
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="14-files-jobs-and-batch"
                slide={1}
                label="第14章: ファイル連携とバッチ"
                variant="back"
                className="mb-2"
              />
              <LessonLinkButton
                courseSlug="abap-training"
                lessonFile="15-document-posting"
                slide={6}
                label="第15章: 会計伝票登録（BAPI）"
                variant="back"
                className="mb-4"
              />
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 LSMWの主用途→移行・一括登録 Q2 GUI Scriptingの実行場所→クライアントPC Q3 定常IF→BAPI Q4 LSMW/BDC/GUI Scriptingの弱点→画面変更に弱い",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="LSMW（Legacy System Migration Workbench）は、旧システムやファイルから SAP へデータを一括移行・登録するための SAP 標準ツールです。トランザクション LSMW から利用します。"
                question={<strong>LSMW の主な用途として最も適切なのは？</strong>}
                options={[
                  "PC 上の SAP GUI 操作を VBS で記録する",
                  "移行・一括登録（ファイルから画面経由で SAP に登録）",
                  "データベースを SQL で直接更新する",
                ]}
              />
              <Quiz
                answer={2}
                explanation="GUI Scripting は SAP GUI for Windows 上で動作し、ユーザーの PC 上で画面操作を自動化します。サーバ側の ABAP ジョブとは別物です。"
                question={<strong>SAP GUI Scripting のスクリプトは主にどこで実行される？</strong>}
                options={[
                  "SAP アプリケーションサーバ上",
                  "バックグラウンドジョブ（SM36）のみ",
                  "ユーザーの PC（SAP GUI クライアント）上",
                ]}
              />
              <Quiz
                answer={0}
                explanation="定常的な IF（毎日のファイル連携・夜間バッチ）は、BAPI と ABAP プログラム + ジョブの構成が保守・監査の面で一般的です。LSMW や GUI Scripting は一時作業・補助向けです。"
                question={<strong>定常 IF（毎日の自動連携）の第一候補として推奨されるのは？</strong>}
                options={[
                  "BAPI + ファイル連携 + バックグラウンドジョブ",
                  "GUI Scripting の VBS を PC で毎日実行",
                  "LSMW を毎日手動で実行",
                ]}
              />
              <Quiz
                answer={1}
                explanation="LSMW（内部 BDC）、BDC、GUI Scripting はいずれも画面操作に依存するため、SAP の画面レイアウト変更で壊れやすいという共通の弱点があります。BAPI は公式 API のため比較的安定します。"
                question={
                  <strong>LSMW・BDC・GUI Scripting に共通する弱点は？</strong>
                }
                options={[
                  "ABAP を書かないと使えない",
                  "SAP 画面の変更に弱く、壊れやすい",
                  "サーバ側でしか実行できない",
                ]}
              />
              <Quiz
                answer={2}
                explanation="GUI Scripting を使うには、サーバ側パラメータ（例: sapgui/user_scripting）と SAP GUI クライアント側の Scripting 有効化の両方が必要です。多くの本番環境ではセキュリティ上無効化されています。"
                question={<strong>SAP GUI Scripting を利用する前に必要なことは？</strong>}
                options={[
                  "SE38 でプログラムを有効化するだけ",
                  "LSMW オブジェクトを作成するだけ",
                  "サーバ・クライアント両方で Scripting が許可されていること（Basis 設定）",
                ]}
              />
              <Dialog speaker="closing">
                LSMW と GUI Scripting は「画面を踏む自動化」の<strong>現場向けツール</strong>です。
                定常 IF は BAPI、移行は LSMW、PC 定型作業の補助は GUI Scripting、
                という<strong>使い分け</strong>を頭に入れておきましょう。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(LsmwAndGuiScriptingLesson);
