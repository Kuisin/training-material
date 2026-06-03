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
  LessonLinkButton,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "補足B — iPaaS・ETLツール入門：MuleSoft・Boomi・データパイプライン",
  meta: "補足 · 20分",
};

export default function IntegrationToolsLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-history-compare", "51-integration-tools", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "補足B — iPaaS・ETLツール入門：MuleSoft・Boomi・データパイプライン\nこの補足では本編の第5章で登場したiPaaS・ETLツールの主要製品（MuleSoft・Boomi・Azure Data Factory等）を詳しく解説します。「ERPを汚さないための境界設計」を担うこれらのツールの仕組みと選択基準を学びます。\n⏱ 20分 / 📶 補足 / 🏷 連携ツール\nこの補足で学ぶこと\n・iPaaS（Integration Platform as a Service）とは何か\n・MuleSoft Anypoint Platform の仕組みと強み\n・Dell Boomi の特徴とローコード連携\n・Azure Data Factory・AWS Glue・Google Cloud Dataflow の比較\n・dbt（data build tool）：ELT変換の現代標準\n・Kafka：イベント駆動型連携の基盤",
          content: (
            <>
              <hgroup>
                <h1>iPaaS・ETLツール入門：MuleSoft・Boomi・データパイプライン</h1>
                <p>
                  ERPのコアを汚さず、柔軟にシステムをつなぐ「境界設計」を担うツール群を学びます。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "20分" },
                  { icon: "📶", text: "補足" },
                  { icon: "🏷", text: "連携ツール" },
                ]}
              />
              <h3>この補足で学ぶこと</h3>
              <ul>
                <li>iPaaS（Integration Platform as a Service）とは何か</li>
                <li>MuleSoft Anypoint Platform の仕組みと強み</li>
                <li>Dell Boomi の特徴とローコード連携</li>
                <li>主要クラウドのデータ連携サービス比較</li>
                <li>dbt（data build tool）：ELT変換の現代標準</li>
                <li>Kafka：イベント駆動型連携の基盤</li>
              </ul>
              <Callout variant="note">
                この補足は第5章「ERPとデータプラットフォームの連携設計」の理解を深めるための追加コンテンツです。本編を先に読むことを推奨します。
              </Callout>
              <LessonLinkButton
                courseSlug="sap-history-compare"
                lessonFile="04-integration-design"
                slide={8}
                label="本編第5章: API・メッセージング・iPaaS"
                variant="back"
                className="mt-4"
              />
            </>
          ),
        },
        {
          title: "iPaaS とは",
          plainText:
            "iPaaS（Integration Platform as a Service）とは\niPaaSとは、複数のアプリケーション・システム間のデータ連携・変換・ルーティングをクラウドサービスとして提供するプラットフォームです。自社でミドルウェアサーバーを構築する代わりに、iPaaSを使うことで迅速にシステム間連携を実現できます。\niPaaSが担う4つの役割：①データのマッピング（SAPの顧客コードをSalesforceの顧客コードに変換等）、②変換（日付フォーマット・通貨単位の統一等）、③ルーティング（条件に応じて送り先を変える）、④オーケストレーション（複数システムへの処理順序の管理）。\n代表的製品：MuleSoft（Salesforce傘下）・Dell Boomi（Boomi）・Azure Integration Services・AWS Step Functions・Google Cloud Integration Connectors。\n先生：iPaaSの最大の価値は「ERPのコアを汚さないための境界線（インターフェース層）を作る」ことです。変換ロジックとルーティングロジックをERP本体に入れず、iPaaSに集中させることでERPのClean Coreが守られます。\nBちゃん：全国各地からの荷物（データ）を受け付け、仕分けして、それぞれの宛先（システム）に配達する郵便局みたいな存在ですね。",
          content: (
            <>
              <h2>iPaaS：システム間連携のオーケストレーター</h2>
              <p>
                <strong>iPaaS（Integration Platform as a Service）</strong>は、複数システム間のデータ連携・変換・ルーティングをクラウドサービスとして提供するプラットフォームです。
              </p>
              <Figure
                src="image/51-ipaas-concept.webp"
                alt="iPaaSのハブ構成図。中央にiPaaSのボックス（MuleSoft等）。左側からSAP・Salesforce・Oracle・社内レガシーシステムが矢印でiPaaSに接続。右側からSnowflake・外部パートナーシステム・モバイルアプリがiPaaSと双方向で接続。iPaaS内に「マッピング・変換・ルーティング・オーケストレーション」のラベル。各コネクションに異なるプロトコル（OData・REST・SOAP・ファイル）のラベル。"
                caption="iPaaSは複数システムの「ハブ」として、データのマッピング・変換・ルーティングを一元管理する"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                iPaaSの最大の価値は「ERPのコアを汚さないための境界線（インターフェース層）を作る」ことです。変換ロジックをERP本体に入れず、iPaaSに集中させることでERPのClean Coreが守られます。
              </Dialog>
              <Dialog speaker="b">
                全国各地からの荷物（データ）を受け付け、仕分けして、それぞれの宛先（システム）に配達する郵便局みたいな存在ですね。
              </Dialog>
              <Dialog speaker="a">
                APIゲートウェイとiPaaSの違いはどこですか？APIゲートウェイは「入口の管理」、iPaaSは「仕分けと変換まで含めた物流全体の管理」という感じでしょうか。
              </Dialog>
              <Dialog speaker="teacher">
                良い質問です。APIゲートウェイはリクエストの認証・レート制限・ルーティングの制御が主な役割。iPaaSはデータのマッピング・変換・複数システムへのオーケストレーションまで担います。より「上流工程」を含む概念です。
              </Dialog>
            </>
          ),
        },
        {
          title: "MuleSoft とは",
          plainText:
            "MuleSoft Anypoint Platform：API主導のエンタープライズ連携\nMuleSoftは2006年に創業、2018年にSalesforceが64億ドルで買収したiPaaS製品です。「API主導の連携（API-led Connectivity）」を設計思想の中核に置いています。\nAPI-led Connectivity（3層モデル）：システムAPI（SAPのOData等、システムのリソースに直接アクセス）→プロセスAPI（複数システムAPIを組み合わせてビジネスロジックを実装）→エクスペリエンスAPI（モバイル・Web等のフロントエンドが呼び出す）の3層でAPIを設計する。\nAnnypoint Platform：MuleSoftの統合プラットフォーム。Anypoint Studio（IDE）・Anypoint Exchange（APIカタログ）・Anypoint Monitoring・Runtime Engine（Mule）で構成。\nSAP連携における強み：SAP向けコネクタ（SAP ERP・S/4HANA OData API・IDocs・BAPI）が豊富。SalesforceとSAPのデータ統合において最も実績が多いiPaaS製品の一つ。\n先生：MuleSoftがSalesforce傘下にある強みは、CRM（Sales Cloud）とSAP（バックオフィス）を連携させる案件で圧倒的な親和性を持つことです。例：SalesforceのリードをSAPの顧客マスタに変換するシナリオ。",
          content: (
            <>
              <h2>MuleSoft：API主導のエンタープライズ連携</h2>
              <InfoPanel
                title="MuleSoftのAPI-led Connectivity（3層モデル）"
                variant="reference"
                lead="再利用可能なAPIを3層に分けて設計することで、ERPコアを守りながら柔軟な連携を実現します。"
              >
                <ul>
                  <li>
                    <strong>システムAPI（System API）</strong>：個々のシステム（SAP・Salesforce等）のリソースに直接アクセスするAPI。認証・セキュリティを担う。例：SAP顧客マスタ取得API
                  </li>
                  <li>
                    <strong>プロセスAPI（Process API）</strong>：複数のシステムAPIを組み合わせてビジネスロジックを実装するAPI。例：「新規顧客作成」＝SalesforceにリードをPOST＋SAPに顧客マスタを作成
                  </li>
                  <li>
                    <strong>エクスペリエンスAPI（Experience API）</strong>：モバイル・Web・Teamsなどフロントエンドが呼び出す最上位API。デバイス・チャネルに最適化した形で提供
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                MuleSoftがSalesforce傘下にある強みは、CRM（Sales Cloud）とSAP（バックオフィス）を連携させる案件で圧倒的な親和性を持つことです。例えばSalesforceのリードをSAPの顧客マスタに変換するシナリオがその典型です。
              </Dialog>
              <Dialog speaker="a">
                API-led Connectivityの3層設計は「再利用性の確保」が核心ですね。システムAPIを一度作れば、プロセスAPIもエクスペリエンスAPIも使いまわせる。変更が必要な場合も影響範囲が小さい。
              </Dialog>
            </>
          ),
        },
        {
          title: "Dell Boomi とその他のiPaaS",
          plainText:
            "Dell Boomi とその他の主要iPaaS製品\nDell Boomi（現Boomi）：2000年創業、2010年にDellが買収、2021年にDellが売却しBoomiとして独立。ローコードのビジュアルインターフェースで設定主体の連携が可能で、Salesforce・SAP・Workdayなど数百のコネクタを持つ。中堅企業向けに評価が高い。\nAzure Integration Services：Microsoft Azureのネイティブ連携スタック。Logic Apps（ローコード連携）・API Management（APIゲートウェイ）・Service Bus（メッセージング）・Event Grid（イベント配信）で構成。Microsoft Dynamics 365やOffice 365との親和性が高い。\nAWS Glue：AWS上でのETL/ELT処理専用のデータ統合サービス。Apache Spark/Python実行環境を提供。大量データの変換・カタログ管理（Glue Data Catalog）に特化。システム間の汎用連携よりデータエンジニアリング向き。\n先生：「どのiPaaSを選ぶか」はクラウドプロバイダーの選定と密接に関係します。Microsoft Azureを主軸にするならAzure Integration Services、SalesforceとSAPを中心にするならMuleSoft、がそれぞれ自然な選択です。",
          content: (
            <>
              <h2>Dell Boomi とその他の主要iPaaS</h2>
              <InfoPanel
                title="主要iPaaS製品の特徴比較"
                variant="reference"
                lead="クラウドプロバイダーの選定と連携シナリオで選択が変わります。"
              >
                <table>
                  <thead>
                    <tr>
                      <th>製品</th>
                      <th>特徴</th>
                      <th>向いているシナリオ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>MuleSoft</td>
                      <td>API-led Connectivity。Salesforce傘下。エンタープライズ向き</td>
                      <td>Salesforce＋SAP連携・大企業のAPI基盤整備</td>
                    </tr>
                    <tr>
                      <td>Dell Boomi</td>
                      <td>ローコードビジュアル設定。数百のコネクタ。中堅企業向き</td>
                      <td>SaaS間連携・Workday・SAP・Salesforceの三つ巴</td>
                    </tr>
                    <tr>
                      <td>Azure Integration Services</td>
                      <td>Azure Native。Logic Apps・Service Bus・Event Grid</td>
                      <td>Microsoft D365・Office365中心のエコシステム</td>
                    </tr>
                    <tr>
                      <td>AWS Glue</td>
                      <td>ETL/ELT専用。Apache Spark実行環境。AWS中心</td>
                      <td>大量データの変換・カタログ。AWSのデータパイプライン</td>
                    </tr>
                    <tr>
                      <td>SAP Integration Suite</td>
                      <td>SAP公式のiPaaS（旧SAP Cloud Platform Integration）。BTP上で提供</td>
                      <td>SAP間連携・SAP＋非SAP連携のSAP認定パス</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                「どのiPaaSを選ぶか」はクラウドプロバイダーの選定と密接に関係します。Microsoft Azureを主軸にするならAzure Integration Services、SalesforceとSAPが中心ならMuleSoft、がそれぞれ自然な選択です。
              </Dialog>
              <Dialog speaker="a">
                SAP Integration Suite（旧SAP CPI）はSAP公式のiPaaSなのでSAPとの連携においてサポートが手厚い反面、非SAP間の連携ではMuleSoftに劣る場合もありますね。
              </Dialog>
            </>
          ),
        },
        {
          title: "dbt と Kafka",
          plainText:
            "dbt と Kafka：現代データパイプラインの2大ツール\ndbt（data build tool）：ELT変換のコード管理ツール。Snowflake・Databricks・BigQuery等のDWH内でSQLを使ってデータ変換（Silver→Gold等）を定義し、バージョン管理（Git）・テスト・ドキュメント生成を自動化する。dbtのモデルはSQLファイルそのもので、エンジニアでなくても読める透明性が高い。「データエンジニアリングのdbt、ビジネスロジックの記述」という位置づけ。\nApache Kafka（2011年 LinkedInで開発、2014年OSS）：「分散メッセージングバス」。生産者（Producer）がイベントを書き込み、消費者（Consumer）が非同期で読み取る仕組み。SAPでは受注確定・出荷完了などの業務イベントをKafkaにパブリッシュし、Snowflake・Databricks・他システムがサブスクライブするパターンが増加。低レイテンシ・高スループット・メッセージの永続化（ログ）が特徴。\n先生：dbtは「変換ロジックをコードとして管理する」ことで再現性と透明性を高めます。KafkaはERPの「イベント」を非同期に下流システムに伝播させることで、システム間の結合を疎にします。両者とも現代のデータエンジニアリングの必須ツールです。",
          content: (
            <>
              <h2>dbt と Kafka：現代データパイプラインの必須ツール</h2>
              <MermaidDiagram
                chart={`flowchart LR
  subgraph ELT["ELT パイプライン（dbt）"]
    SF["Snowflake\nBronze層"]-->|"dbt モデル（SQL）\nバージョン管理済み"| SILVER["Snowflake\nSilver層"]
    SILVER -->|"dbt モデル"| GOLD["Snowflake\nGold層（BI向け）"]
  end

  subgraph EVENT["イベント駆動（Kafka）"]
    S4["SAP S/4HANA\n（受注確定イベント）"] -->|"Publish"| KAFKA["Apache Kafka\n（メッセージバス）"]
    KAFKA -->|"Subscribe"| DB["Databricks\n（ストリーム分析）"]
    KAFKA -->|"Subscribe"| SFDC["Salesforce\n（出荷通知）"]
  end`}
              />
              <InfoPanel
                title="dbt と Kafka のポジション整理"
                variant="reference"
              >
                <ul>
                  <li>
                    <strong>dbt（data build tool）</strong>：DWH内のSQLを使ったデータ変換をコード管理する。変換ロジックのバージョン管理・テスト・ドキュメント自動生成。Silver→Gold変換の定義に最適。ELTの「T（Transform）」を担う
                  </li>
                  <li>
                    <strong>Apache Kafka</strong>：高スループット・低レイテンシの分散メッセージングシステム。ERPの業務イベントを下流に非同期配信。イベント駆動アーキテクチャ（EDA）の核心技術。ManagedサービスはConfluentやAmazon MSKなど
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                dbtは「変換ロジックをコードとして管理する」ことで再現性と透明性を高めます。Kafkaは「ERPのイベントを非同期に下流システムに伝播させる」ことでシステム間の結合を疎にします。
              </Dialog>
              <Dialog speaker="a">
                dbtのモデルはGitで管理されるので、誰が・いつ・どんな変換ロジックを変えたかが全て追跡できる。データカタログとの相性も良いですね。
              </Dialog>
              <Dialog speaker="b">
                Kafkaは「放送局（SAP）が番組（イベント）を放送して、いくつものテレビ（各システム）が好きなタイミングで視聴できる」テレビ放送みたいですね。全員が同じ時間に見なくていい。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 MuleSoftのAPI-led Connectivityにおける「プロセスAPI」の役割として正しいのは？→ 複数のシステムAPIを組み合わせてビジネスロジックを実装するAPI層\nQ2 Apache KafkaをSAPとの連携に使う場合の主な用途として正しいのは？→ 受注確定・出荷完了などの業務イベントを非同期で下流システムに配信するイベント駆動連携\n今日のひとこと：iPaaSとデータパイプラインツールは「ERPの外の世界」を設計するための道具箱です。道具の名前と使い方を知ることで、顧客との技術設計の議論でより的確な提案ができるようになります。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="MuleSoftのAPI-led Connectivityは3層で構成されます。プロセスAPIは複数のシステムAPIを組み合わせてビジネスロジックを実装する中間層です。例えば「新規顧客作成」というビジネスロジックを、SalesforceへのPOSTとSAPへのマスタ作成の2つのシステムAPIを組み合わせて実現するのがプロセスAPIの役割です。"
                question={<strong>MuleSoftのAPI-led Connectivityにおける「プロセスAPI（Process API）」の役割として正しいのは？</strong>}
                options={[
                  "個々のシステム（SAP・Salesforce等）のリソースに直接アクセスするAPI（認証・セキュリティを担う）",
                  "複数のシステムAPIを組み合わせてビジネスロジックを実装するAPI層",
                  "モバイル・WebなどフロントエンドがチャネルごとにカスタマイズするAPI",
                ]}
              />
              <Quiz
                answer={2}
                explanation="Apache KafkaはSAPとの連携において、受注確定・出荷完了・在庫変動などの「業務イベント」をパブリッシュし、Snowflake・Databricks・Salesforceなどの下流システムが非同期でサブスクライブするイベント駆動型連携に最適です。高スループット・低レイテンシ・メッセージの永続化が特徴で、SAP SLTのようなDB複製とは異なる「イベント通知」の用途に使います。"
                question={<strong>Apache KafkaをSAPとの連携に使う場合の主な用途として最も正しいのは？</strong>}
                options={[
                  "SAPのフルテーブルデータを夜間に一括転送する",
                  "SAPのUIをKafka経由でブラウザに表示する",
                  "受注確定・出荷完了などの業務イベントを非同期で下流システムに配信するイベント駆動連携",
                ]}
              />
              <Dialog speaker="closing">
                iPaaSとデータパイプラインツールは「ERPの外の世界」を設計するための道具箱です。道具の名前と使い方を知ることで、顧客との技術設計の議論でより的確な提案ができるようになります。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(IntegrationToolsLesson);
