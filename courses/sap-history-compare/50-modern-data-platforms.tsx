import {
  Lesson,
  lessonChrome,
  Callout,
  Dialog,
  CharacterIntro,
  InfoPanel,
  Quiz,
  MermaidDiagram,
  Figure,
  LessonMeta,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "補足A — Snowflake・Databricks入門：コンピュート分離の革命",
  meta: "補足 · 20分",
};

export default function ModernDataPlatformsLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-history-compare", "50-modern-data-platforms", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "補足A — Snowflake・Databricks入門：コンピュート分離の革命\nこの補足ではSnowflakeとDatabricksという2大モダンデータプラットフォームの仕組みを、ERP連携の文脈で詳しく学びます。本編で「SoI」として紹介した2つのプラットフォームが、なぜ従来のDWHと根本的に異なるのかを理解します。\n⏱ 20分 / 📶 補足 / 🏷 データプラットフォーム\nこの補足で学ぶこと\n・従来のDWH（SAP BW等）の限界\n・クラウドネイティブDWH（Snowflake）の仕組みとマイクロパーティション\n・Apache SparkとDatabricksの関係\n・Delta Lake：オープンなデータ形式のメリット\n・SnowflakeとDatabricksの使い分けの実際",
          content: (
            <>
              <hgroup>
                <h1>Snowflake・Databricks入門：コンピュート分離の革命</h1>
                <p>
                  なぜSnowflakeとDatabricksがERPのデータ活用において急速に採用されているのか、仕組みから理解します。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "20分" },
                  { icon: "📶", text: "補足" },
                  { icon: "🏷", text: "データプラットフォーム" },
                ]}
              />
              <h3>この補足で学ぶこと</h3>
              <ul>
                <li>従来のDWH（SAP BW 等）の限界</li>
                <li>クラウドネイティブDWH（Snowflake）の仕組みとマイクロパーティション</li>
                <li>Apache Spark と Databricks の関係</li>
                <li>Delta Lake：オープンなデータ形式のメリット</li>
                <li>Snowflake と Databricks の使い分けの実際</li>
              </ul>
              <Callout variant="note">
                この補足は第4章「ハイブリッド・データアーキテクチャ」の理解を深めるための追加コンテンツです。本編を先に読むことを推奨します。
              </Callout>
            </>
          ),
        },
        {
          title: "登場人物",
          plainText:
            "3人の登場人物から\n先生：この補足では、本編で登場したSnowflakeとDatabricksについて、もう少し技術的な仕組みと実務での使い方を掘り下げます。IT用語が多めになりますが、比喩を使いながら進めます。\nAくん：技術的な仕組みに興味があります。コンピュートとストレージの分離が実際にどう実装されているのか知りたいです。\nBちゃん：「Snowflakeって何？」と聞かれたときに説明できるレベルの理解が欲しいです。比喩でお願いします。",
          content: (
            <>
              <h2>3人の登場人物から</h2>
              <CharacterIntro speaker="teacher">
                この補足では、本編で登場したSnowflakeとDatabricksについて、もう少し技術的な仕組みと実務での使い方を掘り下げます。IT用語が多めになりますが、比喩を使いながら進めます。
              </CharacterIntro>
              <CharacterIntro speaker="a">
                技術的な仕組みに興味があります。コンピュートとストレージの分離が実際にどう実装されているのか知りたいです。
              </CharacterIntro>
              <CharacterIntro speaker="b">
                「Snowflakeって何？」と聞かれたときに説明できるレベルの理解が欲しいです。比喩でお願いします。
              </CharacterIntro>
              <Dialog speaker="teacher">
                では、まず従来のDWH（SAP BW等）の限界から見ていきましょう。
              </Dialog>
            </>
          ),
        },
        {
          title: "従来 DWH の限界",
          plainText:
            "従来のDWH（SAP BW等）の限界\nSAP BW（Business Warehouse）は1990年代後半に登場した、SAP公式のDWH製品です。SAP ERPのデータを集めてBWのInfoCubeやDSOに格納し、BEXクエリやSAP AnalyticsCloudでレポート・分析を提供します。\n従来DWHの3つの限界：①スケールコスト。コンピュートとストレージが密結合で、データが増えるとハードウェアを丸ごと増設する必要がある。②柔軟性の欠如。事前に定義されたスキーマ（InfoObject・InfoCube）に合わないデータは扱えない。IoTや非構造化データが急増する現代には対応しにくい。③SQL以外の処理。機械学習・Python・Sparkなどの高度な分析が標準でできない。\n先生：SAP BWは「SAPのデータを構造化してBIレポートにする」という用途では今でも強力なツールです。しかし大量のIoTデータやAIワークロードには向かない。そのギャップを埋めるために、Snowflake・Databricksとの併用が増えています。",
          content: (
            <>
              <h2>従来のDWH（SAP BW等）の限界</h2>
              <InfoPanel
                title="SAP BW とモダンデータプラットフォームの比較"
                variant="reference"
                lead="SAP BWは今でも強力ですが、現代の大量・多様なデータに対する限界があります。"
              >
                <table>
                  <thead>
                    <tr>
                      <th>観点</th>
                      <th>SAP BW（従来DWH）</th>
                      <th>Snowflake / Databricks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>スケール方法</td>
                      <td>ハードウェアごと増設（高コスト・計画が必要）</td>
                      <td>クリック一つでスケールアップ/ダウン</td>
                    </tr>
                    <tr>
                      <td>データ形式</td>
                      <td>事前定義スキーマ（InfoObject/InfoCube）に依存</td>
                      <td>半構造・非構造化データも扱える</td>
                    </tr>
                    <tr>
                      <td>AI/ML対応</td>
                      <td>標準では限定的</td>
                      <td>Python・Spark・MLフレームワーク対応</td>
                    </tr>
                    <tr>
                      <td>コスト形態</td>
                      <td>ライセンス＋ハードウェア（CapEx）</td>
                      <td>使用分だけ課金（OpEx）</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                SAP BWは「SAPデータを構造化してBIレポートにする」という用途では今でも強力なツールです。しかし大量のIoTデータやAIワークロードには向かない。そのギャップをSnowflake・Databricksとの併用で埋めるアーキテクチャが増えています。
              </Dialog>
              <Dialog speaker="a">
                SAP BWとSnowflakeを「並行して使う」構成も現実にあるわけですね。S/4HANAのSSOT→BWで定型BIレポート、同時にSnowflakeで探索的分析・AI。
              </Dialog>
            </>
          ),
        },
        {
          title: "Snowflake の仕組み",
          plainText:
            "Snowflake の仕組み：マイクロパーティションとバーチャルウェアハウス\nSnowflakeは2012年創業のクラウドネイティブDWHです。「コンピュートとストレージの完全分離」を設計の中核に置いています。\nストレージ層：データはSnowflakeが管理する圧縮・暗号化された「マイクロパーティション」という単位でクラウドストレージ（S3等）に保管されます。マイクロパーティション（〜16MB圧縮後）は列指向に格納されるため集計クエリが高速。\nコンピュート層：「バーチャルウェアハウス（Virtual Warehouse）」という仮想コンピュートクラスタをオンデマンドで起動。複数のバーチャルウェアハウスを同時起動して並行クエリが可能。使い終わったら停止で課金も止まる。\nメタデータ層：どのパーティションにどのデータがあるかを管理するサービス。これにより「小さいパーティションだけスキャンする」という最適化が自動で行われる。\n先生：Snowflakeの革新性は「同時に複数のチームが独立して重いクエリを走らせても、ストレージを共有しながら互いに干渉しない」設計にあります。\nBちゃん：図書館（ストレージ）は共有で、読書用の席（バーチャルウェアハウス）は各チームが借りて使うイメージですね。",
          content: (
            <>
              <h2>Snowflake の仕組み：マイクロパーティションとバーチャルウェアハウス</h2>
              <Figure
                src="image/50-snowflake-architecture.webp"
                alt="Snowflakeの3層アーキテクチャ図。上層（コンピュート層）：複数のバーチャルウェアハウス（VW1・VW2・VW3）が独立して並行稼働。中層（メタデータ層）：クラウドサービス。各バーチャルウェアハウスからの接続を管理。下層（ストレージ層）：マイクロパーティション（小さな列指向の圧縮ブロック）が格納されたS3などのオブジェクトストレージ。コンピュートとストレージが分離されており、スケール可能なことを示す。"
                caption="Snowflakeの3層設計：ストレージを共有しながら複数のコンピュートが独立して動ける"
                kind="diagram"
              />
              <Dialog speaker="teacher">
                Snowflakeの革新性は「同時に複数のチームが独立して重いクエリを走らせても、ストレージを共有しながら互いに干渉しない」設計にあります。従来のDWHでは重いクエリが他のユーザーに影響しました。
              </Dialog>
              <Dialog speaker="b">
                図書館（ストレージ）は全員が共有で、読書用の席（バーチャルウェアハウス）は各チームが借りて使うイメージですね。席が足りなくなったら増やせる。
              </Dialog>
              <Dialog speaker="a">
                マイクロパーティションの自動クラスタリングによって、WHERE条件に合うパーティションだけスキャンする「プルーニング」が可能になり、大量データでも高速クエリが実現できるんですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "Databricks と Apache Spark",
          plainText:
            "Databricks と Apache Spark：大規模分散処理の基盤\nApache Spark（2009年 UCバークレー発）：大量のデータを複数のマシン（クラスタ）に分散して並列処理するフレームワーク。MapReduceよりメモリを活用するため高速。Python（PySpark）・SQL・R・Scalaで記述できる。現在のビッグデータ・AI/ML基盤の主要技術。\nDatabricks（2013年 Apache Spark創始者らが設立）：Apache SparkをマネージドサービスとしてクラウドAWS/Azure/GCPで提供。Notebookインターフェースでデータサイエンティストが直感的に操作できる。MLflow（機械学習モデル管理）・Unity Catalog（ガバナンス）等を統合。\nDelta Lake：Databricksが主導するオープンなデータ形式。Apache Parquet形式の上にトランザクション管理（ACIDプロパティ）を加えたもの。DWHに近い信頼性（変更履歴・ロールバック）とデータレイクの柔軟性を統合した「レイクハウス」を実現。\n先生：SnowflakeがSQL中心のBIアナリスト向けなら、DatabricksはPython/Sparkを使うデータサイエンティスト・MLエンジニア向けです。近年は両者の機能が重なりつつあり、選択は組織のスキルセットと主要ワークロードで決まります。",
          content: (
            <>
              <h2>Databricks と Apache Spark：大規模分散処理の基盤</h2>
              <InfoPanel
                title="Apache Spark と Databricks の関係"
                variant="reference"
                lead="Databricks は Apache Spark の「マネージドサービス＋エコシステム」です。"
              >
                <ul>
                  <li>
                    <strong>Apache Spark</strong>：オープンソースの大規模分散処理フレームワーク。Python（PySpark）・SQL・Scalaで記述。メモリ活用型の並列処理でMapReduceより高速
                  </li>
                  <li>
                    <strong>Databricks</strong>：Sparkのマネージドサービス。クラスタの自動スケーリング・Notebookインターフェース・MLflow（ML実験管理）・Unity Catalog（ガバナンス）を統合
                  </li>
                  <li>
                    <strong>Delta Lake</strong>：Parquetフォーマット上にACIDトランザクションを追加。データの変更履歴（Time Travel）・スキーマ強制・Upsert（更新＋挿入）が可能。DWHの信頼性とデータレイクの柔軟性を統合（レイクハウスアーキテクチャ）
                  </li>
                </ul>
              </InfoPanel>
              <Dialog speaker="teacher">
                SnowflakeがSQL中心のBIアナリスト向けなら、DatabricksはPython/Sparkを使うデータサイエンティスト・MLエンジニア向けです。近年は両者の機能が重なりつつあり、選択は組織のスキルセットと主要ワークロードで決まります。
              </Dialog>
              <Dialog speaker="a">
                Delta LakeのTime Travel機能は面白いですね。「3日前の状態のデータを見る」「誤ってDELETEしたデータをロールバックする」というワークロードがデータレイクで可能になる。
              </Dialog>
              <Dialog speaker="b">
                Databricksは「大量のデータをPythonで料理する大型厨房」で、Snowflakeは「SQLで綺麗に整理されたデータをBIで見るセルフサービスビュッフェ」というイメージかな。
              </Dialog>
            </>
          ),
        },
        {
          title: "SAP との連携パターン",
          plainText:
            "SAP と Snowflake / Databricks の連携パターン\nSAP→Snowflake連携の代表的な方法：SAP SLT（リアルタイムCDC複製）・ODP経由のELT（Fivetran・dbt等）・SAP Datasphere（SAP公式のデータ統合・連携基盤）経由のフェデレーション。\nSAP→Databricks連携：SAP SLT経由のリアルタイム複製・DatabricksのAutoLoader（S3等へのファイル着地を自動検知してDelta Lakeにロード）・Spark用SAPコネクタ（ABAP SDK for Spark等）。\n典型的なアーキテクチャパターン：S/4HANA（SoR：ACDOCA・在庫・受注データ）→SLT/ODP→Snowflake（Silver/Gold：BIレポート・財務分析）＋Databricks（AIモデル：需要予測・異常検知）\n先生：SAP Datasphereは最近SAPが力を入れているデータ統合・連携・仮想化プラットフォームです。S/4HANAのデータをDatasphere経由でSnowflakeやDatabricksに提供する構成が、SAP公式の推奨に近くなっています。\nAくん：SAP公認の連携経路（Datasphere経由）を使うとSAPサポートが得られやすいですが、SLT直接連携の方がシンプルな場合もある。要件次第の設計判断ですね。",
          content: (
            <>
              <h2>SAP と Snowflake / Databricks の連携パターン</h2>
              <MermaidDiagram
                chart={`flowchart TD
  S4["SAP S/4HANA\n（ACDOCA・LIKP・VBAK等）"]
  SLT["SAP SLT\n（リアルタイムCDC）"]
  DS["SAP Datasphere\n（SAP公式データ連携基盤）"]
  ODP["ODP / CDS View\n（Delta抽出）"]

  S4 -->|"ログベースCDC"| SLT
  S4 --> DS
  S4 --> ODP

  SLT -->|"リアルタイム複製"| SF["Snowflake\n（BIレポート・財務分析）"]
  SLT -->|"リアルタイム複製"| DB["Databricks\n（AI/ML・需要予測）"]
  DS -->|"フェデレーション/複製"| SF
  ODP -->|"ELT（Fivetran/dbt等）"| SF`}
              />
              <Dialog speaker="teacher">
                SAP Datasphereは最近SAPが力を入れているデータ統合・連携・仮想化プラットフォームです。S/4HANAのデータをDatasphere経由でSnowflakeやDatabricksに提供する構成が、SAP公式の推奨に近くなっています。
              </Dialog>
              <Dialog speaker="a">
                SAP公認経路（Datasphere）を使うとSAPサポートが得られやすいですが、SLT直接連携の方がシンプルな場合もある。要件・運用体制次第の設計判断ですね。
              </Dialog>
              <Dialog speaker="b">
                SAP側からSnowflakeへの「公式の橋（Datasphere）」と「抜け道（SLT直結）」があるイメージ。公式の橋は安心だけど工事費が高い、抜け道は速いけど自己責任みたいな。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 SnowflakeとDatabricksの大まかな使い分けとして最も正しいのは？→ Snowflake：SQL中心のBIアナリスト向けDWH、Databricks：Python/SparkのデータサイエンティストとAI/MLワークロード向け\nQ2 Databricksが提唱するDelta Lakeの特徴として正しいのは？→ Parquetフォーマット上にACIDトランザクション（変更履歴・ロールバック）を追加し、DWHの信頼性とデータレイクの柔軟性を統合したオープン形式\n今日のひとこと：SnowflakeとDatabricksはどちらも「ERPの外でデータを活かすためのプラットフォーム」です。どちらを選ぶかより、なぜそれを選ぶかを説明できることが重要です。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={0}
                explanation="Snowflakeは主にSQL中心でBIアナリストが直感的にデータウェアハウスとして活用するプラットフォームです。一方DatabricksはApache SparkをベースにPythonやRでAI/ML・ストリーミング分析ができるデータサイエンティスト向けです。近年は両者の機能が重なりつつありますが、組織のスキルセットと主要ワークロードで選択します。"
                question={<strong>SnowflakeとDatabricksの大まかな使い分けとして最も正しいのは？</strong>}
                options={[
                  "Snowflake：SQL中心のBIアナリスト向けDWH、Databricks：Python/SparkのデータサイエンティストとAI/MLワークロード向け",
                  "Snowflake：AI/MLワークロード専用、Databricks：SQLのみのDWH専用",
                  "Snowflake：SAP公式認定、Databricks：Microsoft専用",
                ]}
              />
              <Dialog speaker="closing">
                SnowflakeとDatabricksはどちらも「ERPの外でデータを活かすためのプラットフォーム」です。どちらを選ぶかより「なぜそれを選ぶか」を説明できることが重要です。補足コンテンツ全体を通じ、本編の理解が一層深まれば嬉しいです。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(ModernDataPlatformsLesson);
