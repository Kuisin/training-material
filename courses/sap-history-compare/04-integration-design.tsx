import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  InfoPanel,
  Quiz,
  MermaidDiagram,
  Figure,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "第5章 — ERPとデータプラットフォームの連携設計",
  meta: "中級 · 30分",
};

export default function IntegrationDesignLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-history-compare", "04-integration-design", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "第5章 — ERPとデータプラットフォームの連携設計\nSoR（ERP）とSoI（データプラットフォーム）を分けて設計することにした後、「実際にどうつなぐか」が次の問いです。この章では連携の方式（ETL/ELT/CDC）・SAP固有の仕組み（SLT/ODP）・APIとiPaaSの使い分け・メダリオンアーキテクチャを学びます。\n⏱ 30分 / 📶 中級 / 🏷 ERP比較\nこの章で学ぶこと\n・SAP SLT（SAP Landscape Transformation）によるリアルタイム複製\n・ODP（Operational Data Provisioning）の仕組みとDelta更新\n・ETL vs ELT：変換をどこで行うかの設計判断\n・CDC（Change Data Capture）：差分追跡で負荷を最小化\n・レイテンシと整合性の設計トレードオフ\n・API・メッセージング・iPaaSの使い分け\n・メダリオンアーキテクチャ（Bronze/Silver/Gold）",
          content: (
            <>
              <hgroup>
                <h1>ERPとデータプラットフォームの連携設計</h1>
                <p>
                  SoRとSoIを分けた後、「どうつなぐか」が設計の要です。ETL・ELT・CDC・APIの使い分けと、SAP固有の連携ツールを学びます。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "30分" },
                  { icon: "📶", text: "中級" },
                  { icon: "🏷", text: "ERP比較" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>SAP SLT によるリアルタイム複製の仕組み</li>
                <li>ODP（Operational Data Provisioning）と Delta 更新の考え方</li>
                <li>ETL vs ELT：変換をどこで行うかの設計判断</li>
                <li>CDC（Change Data Capture）：差分追跡で基幹の負荷とレイテンシを最小化</li>
                <li>API・メッセージング・iPaaS の使い分け</li>
                <li>メダリオンアーキテクチャ（Bronze / Silver / Gold）</li>
              </ul>
            </>
          ),
        },
        {
          title: "SAP SLT とは",
          plainText:
            "SAP SLT（SAP Landscape Transformation Replication Server）\nSAP SLT は、SAP S/4HANA（またはECC）から外部の分析基盤（Snowflake・Databricks・SAP HANA Cloud等）へ、データベーステーブル単位でリアルタイムに複製する仕組みです。\n仕組み：SLTはSAPのアプリケーションサーバー上または別サーバーで動作し、SAPデータベースのトリガーベースまたはログベースでデータ変更を検知。変更があったレコードのみをターゲット（データプラットフォーム）に即時複製します。\n主な特徴：初回の一括ロード（Initial Load）後、差分だけをリアルタイムで同期するため、基幹への負荷が低い。SAPの100以上のテーブルを同時複製可能。\n先生：SLTは「SAP公式のリアルタイムデータ複製ツール」です。SAP側での認定があり、S/4HANAとの相性が高い。Snowflake連携もSAPが公式にサポートするようになっています。\nAくん：ログベースの複製はCDC（Change Data Capture）の考え方ですね。変更があったときだけ転送するので、大量の全件スキャンが不要。",
          content: (
            <>
              <h2>SAP SLT：リアルタイムテーブル複製の仕組み</h2>
              <p>
                <strong>SAP SLT（SAP Landscape Transformation Replication Server）</strong>は、SAP DBのテーブルを外部の分析基盤にリアルタイムで複製するSAP公式ツールです。
              </p>
              <MermaidDiagram
                chart={`flowchart LR
  SAP["SAP S/4HANA\n（HANA DB）"] -->|"ログ/トリガー\nベース変更検知"| SLT["SAP SLT\n（複製サーバー）"]
  SLT -->|"初回：一括ロード\n以後：差分複製（リアルタイム）"| DW["Snowflake /\nDatabricks"]
  SAP -->|"通常業務は\n影響なし"| BIZ["業務ユーザー"]
  DW --> BI["BIツール\nAI/MLモデル"]`}
              />
              <Callout variant="tip">
                <strong>SLT の主な特徴</strong>
                <ul>
                  <li>SAP公式ツール（SAP認定済み）。SAP HANA・S/4HANA・ECCに対応</li>
                  <li>初回の一括ロード後、差分のみをリアルタイム同期（基幹への負荷が低い）</li>
                  <li>100以上のテーブルを同時複製可能</li>
                  <li>SnowflakeとのSAP公式連携もサポート</li>
                </ul>
              </Callout>
              <Dialog speaker="teacher">
                SLTは「SAP公式のリアルタイムデータ複製ツール」です。SAP側での認定があり、S/4HANAとの相性が高い。Snowflake連携もSAPが公式にサポートするようになっています。
              </Dialog>
              <Dialog speaker="a">
                ログベースの複製はCDC（Change Data Capture）の考え方ですね。変更があったときだけ転送するので、大量の全件スキャンが不要になる。
              </Dialog>
            </>
          ),
        },
        {
          title: "ODP とは",
          plainText:
            "ODP（Operational Data Provisioning）：抽出オブジェクトとDelta更新\nODP は SAP S/4HANA に組み込まれたデータ抽出フレームワークです。業務データを「抽出オブジェクト」という単位で定義し、外部ツールから呼び出せる標準インターフェースを提供します。\nDelta更新（Delta Extraction）：前回抽出以降に変更があったレコードのみを取得する仕組みです。毎回全件を抽出する「フル抽出」より負荷が低く、リアルタイム性が高まります。\nODPの主な抽出元：DataSource（FI・CO・SD・PPなどのモジュール標準）、CDS View（S/4HANAの新APIレイヤ）、InfoProvider（BW：Business Warehouse との連携）\n先生：ODPは「いつ・どのデータを・どの粒度で出すか」を設計するための枠組みです。Delta更新の仕組みを理解しておくと、データパイプライン設計の議論で即戦力になれます。\nBちゃん：新聞を毎日全部送るのではなく、昨日から変わったページだけを送る仕組み、というイメージですね。",
          content: (
            <>
              <h2>ODP：抽出オブジェクトとDelta更新の考え方</h2>
              <p>
                <strong>ODP（Operational Data Provisioning）</strong>はSAP S/4HANAに組み込まれたデータ抽出フレームワークで、「差分（Delta）更新」による効率的なデータ連携を実現します。
              </p>
              <InfoPanel
                title="ODP の主な抽出オブジェクト種別"
                variant="reference"
                lead="どの抽出元を使うかは連携用途と対象データによって異なります。"
              >
                <ul>
                  <li>
                    <strong>DataSource</strong>：FI（財務）・CO（管理会計）・SD（販売）などのモジュール標準抽出オブジェクト。SAP BW連携の基本
                  </li>
                  <li>
                    <strong>CDS View</strong>（Core Data Services）：S/4HANA の新しいAPIレイヤ。OData APIでのリアルタイム参照も可能
                  </li>
                  <li>
                    <strong>InfoProvider / InfoObject</strong>：SAP BW（Business Warehouse）のデータモデルと連携する際に使用
                  </li>
                </ul>
              </InfoPanel>
              <Callout variant="note">
                <strong>フル抽出 vs Delta更新の違い</strong>
                <ul>
                  <li><strong>フル抽出（Full Load）</strong>：対象テーブルの全レコードを毎回抽出。初回ロードや月次の整合性チェックに使用。負荷が高い</li>
                  <li><strong>Delta更新（Delta Extraction）</strong>：前回抽出以降に変更（更新・追加・削除）があったレコードのみを取得。負荷が低くリアルタイム性が高い</li>
                </ul>
              </Callout>
              <Dialog speaker="teacher">
                ODPは「いつ・どのデータを・どの粒度で出すか」を設計するための枠組みです。Delta更新の仕組みを理解しておくと、データパイプライン設計の議論で即戦力になれます。
              </Dialog>
              <Dialog speaker="b">
                新聞を毎日全部送るのではなく、昨日から変わったページだけを送る仕組みというイメージですね。通信コストが大幅に下がる。
              </Dialog>
            </>
          ),
        },
        {
          title: "ETL vs ELT",
          plainText:
            "ETL vs ELT：変換をどこで行うかの設計判断\nETL（Extract → Transform → Load）：古典型。中間サーバーでデータを変換してからDWHに投入する。変換ロジックが中間サーバーに集中するため保守しやすいが、変換のためのサーバーとコストが必要。R/3時代の鉄板パターン。\nELT（Extract → Load → Transform）：モダン型。生データをまずデータレイク/ウェアハウスに投入し、DWH内のSQL/Sparkで変換する。DWHの処理能力を活用できるため、中間サーバーが不要。Snowflake・Databricksはこのパターンに適している。\n先生：ETLは「洗ってから入れる」、ELTは「まず入れてから洗う」です。モダンなクラウドDWHは大量データの変換処理が得意なので、ELTの方がシンプルかつスケーラブルな場合が多いです。\nAくん：ELTではDWH内にSQL変換ロジックが蓄積されるため、dbt（data build tool）のようなツールで変換ロジックを管理するのが現代の標準ですね。\nBちゃん：ETLは食材を下ごしらえしてから料理するコック（中間サーバー）、ELTは食材ごとそのまま大型厨房（DWH）に持ち込んで大型設備で一気に調理する感じですね。",
          content: (
            <>
              <h2>ETL vs ELT：変換をどこで行うかの設計判断</h2>
              <Figure
                src="image/04-etl-vs-elt.webp"
                alt="ETLとELTの処理フロー比較図。上段（ETL）：SAP→中間変換サーバー（Transformステップ）→DWH。変換サーバーのボックスが別途存在し追加コストを示す注記。下段（ELT）：SAP→DWH（Loadがまず実行）→DWH内でTransform（SQLやSpark）。変換がDWH内完結で矢印がシンプルになっている。"
                caption="ETL（変換→投入）はR/3時代の古典型、ELT（投入→変換）はモダンDWH向きの現代型"
                kind="diagram"
              />
              <InfoPanel
                title="ETL vs ELT 比較"
                variant="reference"
              >
                <table>
                  <thead>
                    <tr>
                      <th>観点</th>
                      <th>ETL（古典型）</th>
                      <th>ELT（モダン型）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>変換タイミング</td>
                      <td>DWHに入れる前（中間サーバーで変換）</td>
                      <td>DWHに入れた後（DWH内で変換）</td>
                    </tr>
                    <tr>
                      <td>インフラ</td>
                      <td>中間変換サーバーが必要</td>
                      <td>DWHの処理能力を活用。別サーバー不要</td>
                    </tr>
                    <tr>
                      <td>スケーラビリティ</td>
                      <td>中間サーバーがボトルネックになりやすい</td>
                      <td>DWHのスケールに依存。クラウドDWHで高スケール</td>
                    </tr>
                    <tr>
                      <td>向いている用途</td>
                      <td>レガシー連携・変換ロジックを中央集権で管理したい場合</td>
                      <td>Snowflake/Databricksとの連携・大量データ・dbt活用</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                ETLは「洗ってから入れる」、ELTは「まず入れてから洗う」です。モダンなクラウドDWHは大量データの変換処理が得意なのでELTの方がシンプルかつスケーラブルな場合が多いです。
              </Dialog>
              <Dialog speaker="a">
                ELTではDWH内にSQL変換ロジックが蓄積されるため、dbt（data build tool）のようなツールで変換ロジックをコードとして管理するのが現代の標準ですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "CDC とは",
          plainText:
            "CDC（Change Data Capture）：差分だけを追跡する技術\nCDC（Change Data Capture）とは、データベースの変更（INSERT・UPDATE・DELETE）を検知し、変更があったレコードのみをリアルタイムで下流システムに送る技術です。\nなぜ重要か：フルスキャン（全件取得）は基幹システムに高い負荷をかけます。CDCは変更のみを追跡するため、基幹への影響が極めて低い。1秒以内の低レイテンシでデータを連携できます。\nCDCの実装方式：ログベース（DBのトランザクションログを読む）・トリガーベース（DB更新時にトリガーが発火）・タイムスタンプベース（更新日時列を比較）。ログベースが最も負荷が低く高信頼性。\nSAP SLTもログベースCDCを採用しています。\n先生：CDCはイベント駆動アーキテクチャ（EDA：Event-Driven Architecture）の前提技術でもあります。「何かが変わった」というイベントを検知して、下流に通知するパターンはマイクロサービスや連携設計の基本です。\nAくん：CDCはSAP SLTのような製品として実装されているケースと、KafkaなどのメッセージングミドルウェアにDebeziumなどのCDCコネクタを使うケースがありますね。",
          content: (
            <>
              <h2>CDC：差分だけを追跡してリアルタイム連携を実現する</h2>
              <p>
                <strong>CDC（Change Data Capture）</strong>はDBの変更（INSERT/UPDATE/DELETE）を検知し、変更レコードのみをリアルタイムで下流に送る技術です。フルスキャンと比べて基幹への負荷が極めて低くなります。
              </p>
              <InfoPanel
                title="CDC の3つの実装方式"
                variant="reference"
                lead="ログベースが最も負荷が低く、SAP SLTもこの方式を採用しています。"
              >
                <ul>
                  <li>
                    <strong>ログベース</strong>：DBのトランザクションログ（Redo Log等）を読んで変更を検知。基幹DBへの追加負荷がほぼゼロ。SAP SLT・Debezium等がこの方式。最も推奨
                  </li>
                  <li>
                    <strong>トリガーベース</strong>：DB更新時にトリガーを発火させ変更を検知。実装がシンプルだが、トリガー自体がDB負荷になる
                  </li>
                  <li>
                    <strong>タイムスタンプベース</strong>：更新日時列（MDAT・UDATE等）を比較して変更レコードを特定。最もシンプルだが削除検知ができない
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                CDCはイベント駆動アーキテクチャ（EDA）の前提技術でもあります。「何かが変わった」というイベントを検知して下流に通知するパターンは、マイクロサービスや連携設計の基本です。
              </Dialog>
              <Dialog speaker="a">
                CDCはSAP SLTのような製品として実装されているケースと、KafkaなどのメッセージングミドルウェアにDebeziumなどのCDCコネクタを組み合わせるケースがありますね。
              </Dialog>
              <Dialog speaker="b">
                差分だけを送るから「全ての段ボールを毎日数える」のではなく「減った段ボールだけ報告する」物流の報告システムみたいですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "レイテンシと整合性のトレードオフ",
          plainText:
            "レイテンシと整合性の設計判断：何を秒単位で、何を日次で\n全てのデータを「リアルタイム連携」にする必要はありません。要件に応じて連携の頻度（レイテンシ）を設計します。\n秒単位（リアルタイム）が必要な領域：在庫状況のダッシュボード（欠品を即時把握）、売上速報（今日の売上をリアルタイム確認）、IoTセンサーの異常検知、顧客注文確認などオンライン操作の結果。\n日次で足りる領域：経営層向け月次P&L集計、長期トレンド分析、コスト計算・原価分析、夜間バッチが残る領域（大量履歴の初回投入等）。\n先生：リアルタイム連携はコストが高い（SLT・Kafkaのインフラ・運用コスト）。日次で足りる要件にリアルタイムを当てるのは無駄です。「どのデータが何秒以内に必要か」をビジネス側から引き出すことがアーキテクト設計の第一歩です。\nAくん：SLAとレイテンシ要件をビジネスオーナーと合意してから技術選定する、という順序が重要ですね。技術先行で決めると後でミスマッチが起きる。",
          content: (
            <>
              <h2>レイテンシと整合性：何を秒単位で、何を日次で</h2>
              <InfoPanel
                title="レイテンシ要件による連携方式の選択"
                variant="reference"
                lead="「全部リアルタイム」はコスト過剰。要件と対価のバランスを設計します。"
              >
                <table>
                  <thead>
                    <tr>
                      <th>レイテンシ要件</th>
                      <th>対象データの例</th>
                      <th>推奨連携方式</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>秒単位〜分単位（リアルタイム）</td>
                      <td>在庫ダッシュボード・売上速報・IoTアラート</td>
                      <td>SAP SLT（CDC）・Kafka・ストリーミング</td>
                    </tr>
                    <tr>
                      <td>時間単位（ニアリアルタイム）</td>
                      <td>受注残集計・出荷予定確認</td>
                      <td>ODP（Delta抽出）・増分ロード</td>
                    </tr>
                    <tr>
                      <td>日次（夜間バッチ）</td>
                      <td>月次P&L・コスト計算・長期トレンド</td>
                      <td>夜間フルロード・バッチETL</td>
                    </tr>
                    <tr>
                      <td>月次（一括）</td>
                      <td>大量履歴の初回投入・アーカイブ</td>
                      <td>フルエクスポート・ファイル転送</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                リアルタイム連携はコストが高い。「どのデータが何秒以内に必要か」をビジネス側から引き出すことがアーキテクト設計の第一歩です。技術先行で「全部リアルタイム」にすると予算超過します。
              </Dialog>
              <Dialog speaker="a">
                SLAとレイテンシ要件をビジネスオーナーと合意してから技術選定する、という順序が重要ですね。技術先行で決めると後でミスマッチが起きる。
              </Dialog>
              <Dialog speaker="b">
                「今すぐ知りたいか」「明日でいいか」「月末でいいか」で手段が変わる。当日配達・翌日配達・通常便のような物流の区分けみたいですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "API・メッセージング・iPaaS",
          plainText:
            "API・メッセージング・iPaaSの使い分け\nAPI（OData/REST）：トランザクション単位・マスタ参照向け。受注1件の登録、顧客マスタの参照などに適する。ボリュームが大きい分析用途には不向き（1件ずつ取得するため大量データには遅い）。\nメッセージング（キュー・イベントバス）：受注確定・出荷完了など「業務イベント」を他システムへ非同期で通知する。イベント発生時に即座にパブリッシュし、受け取り側は非同期で処理できる。Kafka・Azure Service Bus・Amazon SQS等。\niPaaS（Integration Platform as a Service）：複数システム間のデータマッピング・変換・ルーティングを担うクラウドサービス。MuleSoft・Boomi・Azure Integration Servicesなど。ERPのコアを「汚さない」ための境界設計を担う。\n先生：用途の判断軸は「件数」と「方向性」です。少件数の双方向はAPI、大量の一方向はバルク連携/CDC、イベント通知は非同期メッセージング、複数システムの橋渡しはiPaaS、というイメージです。",
          content: (
            <>
              <h2>API・メッセージング・iPaaSの使い分け</h2>
              <Figure
                src="image/04-integration-tools.webp"
                alt="連携ツールの使い分けを示すフロー図。左側にSAP S/4HANA。中央上：OData/REST APIへの矢印（少件数・双方向・マスタ参照に使用）。中央下：メッセージングバス（Kafka等）への矢印（受注完了等のイベント通知に使用）。右上：外部ERPへのAPI連携。右下：データプラットフォーム（Snowflake）へのバルク連携。iPaaS（MuleSoft等）が複数の矢印を束ねるミドルウェアとして中央に配置。"
                caption="連携ツールの選択は「件数×方向性×同期/非同期」で判断する"
                kind="diagram"
              />
              <InfoPanel
                title="連携ツールの使い分けガイド"
                variant="reference"
              >
                <table>
                  <thead>
                    <tr>
                      <th>ツール</th>
                      <th>向いている用途</th>
                      <th>向いていない用途</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>OData / REST API</td>
                      <td>1件のトランザクション登録・マスタ参照・双方向同期</td>
                      <td>大量データの一括取得・分析用バルク連携</td>
                    </tr>
                    <tr>
                      <td>メッセージング（Kafka等）</td>
                      <td>業務イベントの非同期通知（受注確定・出荷完了等）</td>
                      <td>複雑な変換ロジック・マスタ同期</td>
                    </tr>
                    <tr>
                      <td>iPaaS（MuleSoft・Boomi等）</td>
                      <td>複数システムのデータマッピング・ルーティング・オーケストレーション</td>
                      <td>超大量データのバルク転送（別途バルク連携が適切）</td>
                    </tr>
                    <tr>
                      <td>バルク連携（SLT・ODP・ETL）</td>
                      <td>大量データの一括・増分転送</td>
                      <td>件数が少なくリアルタイム性が重要なケース（API向き）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                用途の判断軸は「件数」と「方向性」です。少件数の双方向はAPI、大量の一方向はバルク連携/CDC、イベント通知は非同期メッセージング、複数システムの橋渡しはiPaaS。
              </Dialog>
              <Dialog speaker="a">
                iPaaSはERPのコアを汚さないための「境界」を担うという役割が重要ですね。ERPの外にマッピングロジックを持つことでクリーンコアを守れる。
              </Dialog>
            </>
          ),
        },
        {
          title: "メダリオンアーキテクチャ",
          plainText:
            "メダリオンアーキテクチャ（Bronze/Silver/Gold）\nSnowflakeやDatabricksなどのデータプラットフォームでよく使われるデータ管理パターンです。データの品質を段階的に高める「3層構造」を定義します。\nBronze層（生データ層）：SAPやERPから受け取った生データをそのまま保管。変換なし。変更履歴の保持が目的。「何が届いたか」の証跡。\nSilver層（クレンジング済みデータ層）：重複排除・型変換・コード統一など基本的なクレンジングを実施。複数ソースのデータを統合した標準モデル。分析エンジニアが主に作業する層。\nGold層（ビジネス向け集計層）：BIダッシュボードやAIモデルに直接提供できる形に集計・加工済みのデータ。会計伝票・受注明細はGoldに近い層に。IoT・ログはBronzeから始まる典型。\n先生：メダリオンアーキテクチャの価値は「データの信頼性レベルを可視化する」ことです。「このレポートはGoldのデータを使っているから信頼できる」という会話が自然に生まれます。\nAくん：dbtはSilver→Gold変換をSQLで管理するのに適したツールですね。変換ロジックをコードとして管理できる。",
          content: (
            <>
              <h2>メダリオンアーキテクチャ：データ品質を段階的に高める3層構造</h2>
              <MermaidDiagram
                chart={`flowchart LR
  SAP["SAP S/4HANA\n（SoR）"] -->|"SLT / ODP / ETL"| B["🥉 Bronze層\n（生データ）\n変換なし・変更履歴保持"]
  B -->|"重複排除・型変換\nコード統一（dbt等）"| S["🥈 Silver層\n（クレンジング済み）\n標準モデル・複数ソース統合"]
  S -->|"ビジネスロジック適用\n集計・KPI計算"| G["🥇 Gold層\n（ビジネス向け）\nBI・AI/MLに直接提供"]
  EXT["外部データ\n（IoT・市場・Web）"] -->|"Bronze直接投入"| B`}
              />
              <InfoPanel
                title="Bronze / Silver / Gold の役割と典型的なデータ"
                variant="reference"
              >
                <table>
                  <thead>
                    <tr>
                      <th>層</th>
                      <th>目的</th>
                      <th>SAPデータの例</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>🥉 Bronze</td>
                      <td>生データ保管。変換なし。証跡</td>
                      <td>ACDOCA全件ダンプ・変更ログ・IoTデータ</td>
                    </tr>
                    <tr>
                      <td>🥈 Silver</td>
                      <td>クレンジング・標準化・複数ソース統合</td>
                      <td>会社コード統一・通貨変換済み財務データ</td>
                    </tr>
                    <tr>
                      <td>🥇 Gold</td>
                      <td>BI・AI/ML向けに集計・KPI計算済み</td>
                      <td>部門別P&L・製品別粗利・在庫回転率</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                メダリオンアーキテクチャの価値は「データの信頼性レベルを可視化する」ことです。「このレポートはGoldのデータを使っているから信頼できる」という会話が自然に生まれます。
              </Dialog>
              <Dialog speaker="a">
                dbtはSilver→Gold変換をSQLで管理するのに適したツールですね。変換ロジックをコードとして管理できるためバージョン管理も可能になる。
              </Dialog>
              <Dialog speaker="b">
                料理に例えると、Bronze＝食材のまま（生）、Silver＝下ごしらえ済み（切って洗った）、Gold＝完成した料理（すぐ食べられる）ですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：この章の核心は「SoRとSoIをつなぐ方法は一つではなく、要件に応じて選ぶ」ということです。SAP SLT（リアルタイム複製）・ODP（Delta抽出）・ETL/ELT・CDC・API・メッセージング・iPaaS—それぞれ適したシナリオが異なります。そしてデータプラットフォーム内ではメダリオンアーキテクチャで品質を段階的に管理します。\nAくん：レイテンシ要件をビジネス側と合意することが最初のステップ、というのが刺さりました。「全部リアルタイム」という要求に対して、コストと価値のトレードオフを説明できるアーキテクトが求められますね。\nBちゃん：ETLとELTの違い、CDCの仕組み、メダリオンの3層—最初は難しく感じましたが、それぞれ「何を解決するための工夫か」という目線で見ると整理できました。全部「コストを下げてスピードを上げる」ための工夫なんですね。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章の核心は「SoRとSoIをつなぐ方法は一つではなく、要件に応じて選ぶ」ということです。SAP SLT・ODP・ETL/ELT・CDC・API・メッセージング・iPaaS—それぞれ適したシナリオが異なります。そしてデータプラットフォーム内ではメダリオンアーキテクチャで品質を段階的に管理します。
              </Dialog>
              <Dialog speaker="a">
                レイテンシ要件をビジネス側と合意することが最初のステップ、というのが刺さりました。「全部リアルタイム」という要求に対して、コストと価値のトレードオフを説明できるアーキテクトが求められますね。
              </Dialog>
              <Dialog speaker="b">
                ETLとELTの違い、CDCの仕組み、メダリオンの3層—最初は難しく感じましたが、それぞれ「何を解決するための工夫か」という目線で見ると整理できました。全部「コストを下げてスピードを上げる」ための工夫なんですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 SAP SLTが採用するCDC（Change Data Capture）方式として最も正しい説明は？→ データベースのトランザクションログを読んで変更を検知し、変更があったレコードのみを下流に転送する\nQ2 メダリオンアーキテクチャの「Silver層」の役割として最も正しいのは？→ 重複排除・型変換・コード統一などの基本的なクレンジングを行い、複数ソースを統合した標準モデルを提供する\n今日のひとこと：「どの技術を使うか」より「なぜその技術を選ぶか」を説明できることが、設計者としての力です。レイテンシ・コスト・整合性という3つのトレードオフを常に意識して選択しましょう。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={0}
                explanation="SAP SLTはログベースCDCを採用しています。DBのトランザクションログ（Redo Log等）を読んで変更レコードを検知し、変更があったデータのみをターゲットに転送します。トリガーベースと比べてDB本体への追加負荷がほぼゼロで、高スループットなリアルタイム複製が可能です。"
                question={<strong>SAP SLTが採用するCDC（Change Data Capture）方式として最も正しい説明は？</strong>}
                options={[
                  "データベースのトランザクションログを読んで変更を検知し、変更レコードのみを下流に転送する（ログベースCDC）",
                  "定期的に全テーブルをスキャンして前回との差分を比較する",
                  "DWH側からAPIを呼び出してデータを取得するプル型連携",
                ]}
              />
              <Quiz
                answer={1}
                explanation="メダリオンアーキテクチャのSilver層は、Bronze層の生データに対して重複排除・型変換・コード統一・複数ソースの統合などの基本的なクレンジング処理を行い、標準モデルを構築します。BI・AI/ML向けの最終集計（Gold層）の前の中間工程として、データの信頼性を高める役割を担います。"
                question={<strong>メダリオンアーキテクチャの「Silver層」の役割として最も正しいのは？</strong>}
                options={[
                  "SAPから受け取った生データをそのまま保管し変換は行わない",
                  "重複排除・型変換・コード統一などのクレンジングを行い複数ソースを統合した標準モデルを提供する",
                  "BIダッシュボードやAIモデルに直接提供できる形に集計・加工済みのデータを保管する",
                ]}
              />
              <Dialog speaker="closing">
                「どの技術を使うか」より「なぜその技術を選ぶか」を説明できることが設計者としての力です。レイテンシ・コスト・整合性という3つのトレードオフを常に意識して選択しましょう。次章では選定・ガバナンス・コストの総合的な評価軸を学びます。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(IntegrationDesignLesson);
