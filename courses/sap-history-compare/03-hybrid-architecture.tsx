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
  title: "第4章 — 現代の最適解「ハイブリッド・データアーキテクチャ」",
  meta: "中級 · 25分",
};

export default function HybridArchitectureLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-history-compare", "03-hybrid-architecture", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "第4章 — 現代の最適解「ハイブリッド・データアーキテクチャ」\nなぜSAPやOracleの機能だけですべてを完結させてはいけないのか。この章ではERP単体の限界と、Snowflake/Databricksなどのモダンデータプラットフォームとの組み合わせが「現代の最適解」となる理由を学びます。\n⏱ 25分 / 📶 中級 / 🏷 ERP比較\nこの章で学ぶこと\n・コンピュートとストレージの分離という新しいパラダイム\n・Snowflake/Databricksとは何か、なぜ注目されるのか\n・SoR（ERP）とSoI（データプラットフォーム）の役割分担\n・コンポーザブルERP（適材適所の組み合わせ）の考え方\n・「全部ERPに詰め込まない」理由：コスト・硬直化・バージョンアップ阻害",
          content: (
            <>
              <hgroup>
                <h1>現代の最適解「ハイブリッド・データアーキテクチャ」</h1>
                <p>
                  ERPは万能ではありません。SoR（ERP）とSoI（データプラットフォーム）を分けることが、現代のデータ戦略の核心です。
                </p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "25分" },
                  { icon: "📶", text: "中級" },
                  { icon: "🏷", text: "ERP比較" },
                ]}
              />
              <h3>この章で学ぶこと</h3>
              <ul>
                <li>コンピュートとストレージの分離という新しいパラダイム</li>
                <li>Snowflake / Databricks とは何か、なぜ注目されるのか</li>
                <li>SoR（ERP）と SoI（データプラットフォーム）の役割分担</li>
                <li>コンポーザブルERP（適材適所の組み合わせ）の考え方</li>
                <li>「全部ERPに詰め込まない」3つの理由：コスト・硬直化・バージョンアップ阻害</li>
              </ul>
            </>
          ),
        },
        {
          title: "ERPだけで完結できない理由",
          plainText:
            "なぜSAP/Oracle機能だけですべてを完結させてはいけないのか\nERPは強力なシステムですが、全てのデータ・分析ニーズを満たすことは設計上の無理があります。理由は主に3つです。\n①コスト：SAPのHANA DBはインメモリのため、ビッグデータ（テラバイト以上）をERPに溜め込むとメモリコストが爆発的に増加します。\n②硬直化：IoTセンサーデータ・SNSデータ・非構造化データをERPのスキーマに押し込もうとすると、業務システムが汚染されます。\n③バージョンアップ阻害：ERPコアに深くカスタマイズした分析ロジックを埋め込むと、SAPのバージョンアップ（S/4HANAへの移行）が困難になります。\n先生：ERPのコアは「業務の正確な記録・実行」に徹するべきです。「データから何を見つけるか」という探索的分析は、専用の分析基盤に任せる方が、コストも柔軟性も優れています。\nAくん：SoR（ERP）とSoI（データプラットフォーム）の役割分担、という整理がここで生きてきますね。",
          content: (
            <>
              <h2>なぜSAP/Oracle機能だけですべてを完結させてはいけないのか</h2>
              <Callout variant="warning">
                <strong>ERPに全てを詰め込む「モノリス型」の3つのリスク</strong>
                <ol>
                  <li><strong>コスト爆発</strong>：HANA インメモリにビッグデータを溜めるとメモリコストが急増</li>
                  <li><strong>硬直化</strong>：IoT・非構造化データをERPスキーマに押し込むと業務システムが汚染される</li>
                  <li><strong>バージョンアップ阻害</strong>：分析ロジックをERPコアに埋め込むとアップグレードが困難に</li>
                </ol>
              </Callout>
              <Dialog speaker="teacher">
                ERPのコアは「業務の正確な記録・実行」に徹するべきです。「データから何を見つけるか」という探索的分析は、専用の分析基盤に任せる方がコストも柔軟性も優れています。
              </Dialog>
              <Dialog speaker="a">
                SoR（ERP）とSoI（データプラットフォーム）の役割分担、という整理がここで生きてきますね。コアを守るために外に出す、という発想。
              </Dialog>
              <Dialog speaker="b">
                自社の社食（ERP）で全員分の食事を作ろうとするのではなく、大量のデータ料理は外部の専門ケータリング（データプラットフォーム）に任せる感じですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "コンピュートとストレージの分離",
          plainText:
            "コンピュートとストレージの分離：クラウド時代の新パラダイム\nSAP S/4HANA（HANA DB）はインメモリDB：計算（コンピュート）と保存（ストレージ）が密結合しています。データをメモリに乗せたまま計算するため超高速ですが、データが増えると高価なメモリを増設し続ける必要があります。\nSnowflake/Databricksなどのモダンデータプラットフォームはコンピュートとストレージを完全分離：安価なクラウドオブジェクトストレージ（S3等）にテラバイト〜ペタバイル級データを保管。分析が必要なときだけコンピュートリソースを動的に立ち上げる。使っていない時間は課金されない。\n先生：これは「電気を使っていないときは止める」という従量課金モデルです。HANAがずっとオンの照明なら、クラウドデータプラットフォームはセンサーで点灯する省エネ照明です。\nAくん：ストレージとコンピュートを分離できるのはクラウドのオブジェクトストレージの登場と、高速ネットワーク（帯域の増大）があって初めて可能になったアーキテクチャですね。",
          content: (
            <>
              <h2>コンピュートとストレージの分離：クラウド時代の新パラダイム</h2>
              <Figure
                src="image/03-compute-storage-separation.webp"
                alt="左側（密結合型：HANA DB）：メモリ（コンピュート＋ストレージ一体）のブロックが積み重なり、データ増加に伴いメモリブロックが増加してコストが上昇する様子。右側（分離型：Snowflake等）：下にS3などのオブジェクトストレージ（安価な大量保管）があり、上に分析時のみ動くコンピュートクラスタが分離して描かれている。中央に「コスト差」の矢印。"
                caption="密結合型（HANA）は超高速だがスケールコストが高い。分離型（Snowflake等）はスケールしやすく低コスト"
                kind="diagram"
              />
              <InfoPanel
                title="密結合型 vs 分離型の比較"
                variant="reference"
              >
                <table>
                  <thead>
                    <tr>
                      <th>観点</th>
                      <th>密結合型（SAP HANA）</th>
                      <th>分離型（Snowflake / Databricks）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>速度</td>
                      <td>超高速（インメモリ処理）</td>
                      <td>高速（ただし大規模データの分析に特化）</td>
                    </tr>
                    <tr>
                      <td>スケールコスト</td>
                      <td>高価なメモリを増設 → 急増リスク</td>
                      <td>安価なオブジェクトストレージ。コンピュートは使用分のみ</td>
                    </tr>
                    <tr>
                      <td>データ量</td>
                      <td>数TB〜数十TB（メモリサイズに依存）</td>
                      <td>ペタバイル級も低コストで扱える</td>
                    </tr>
                    <tr>
                      <td>向いている用途</td>
                      <td>OLTPトランザクション・リアルタイム会計集計</td>
                      <td>大規模分析・AI/ML・長期履歴探索・外部データとの統合</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                HANAが「ずっとオンの照明」なら、クラウドデータプラットフォームは「センサーで必要なときだけ点灯する省エネ照明」です。常に点灯の必要のないデータ分析には後者が経済合理的です。
              </Dialog>
              <Dialog speaker="a">
                ストレージとコンピュートを分離できるのはクラウドのオブジェクトストレージと高速ネットワークの普及があって初めて可能になったアーキテクチャですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "Snowflake と Databricks",
          plainText:
            "Snowflake と Databricks：モダンデータプラットフォームの2大勢力\nSnowflake（2012年創業）：クラウドネイティブなデータウェアハウス（DWH）サービス。SQL中心。BI・レポーティング・データシェアリングに強い。「データクラウド」構想で、企業間のデータ共有も可能。\nDatabricks（2013年創業）：オープンソースのApache Sparkを商業化したデータプラットフォーム。Python/SQLに対応しAI/MLワークロードに強い。Delta Lakeというオープンなデータ形式が特徴。\n先生：Snowflakeは「誰でも使えるSQL中心のDWH」としてBIアナリストに人気、DatabricksはPythonや機械学習を使うデータサイエンティストに人気、という棲み分けが大まかにあります。両者は近年機能が重なりつつあります。\nAくん：SAPとの連携という観点では、SAP SLTやODPでS/4HANAのデータをSnowflakeやDatabricksにリアルタイム複製するアーキテクチャが増えていますね。\nBちゃん：SAPが「事実の記録係」で、SnowflakeかDatabricksが「その事実を分析して将来を予測する役割」、というチームワークですね。",
          content: (
            <>
              <h2>Snowflake と Databricks：モダンデータプラットフォームの2大勢力</h2>
              <InfoPanel
                title="Snowflake vs Databricks"
                variant="reference"
                lead="どちらも「ERP からデータを受け取る SoI」として活用されますが、得意なワークロードが異なります。"
              >
                <table>
                  <thead>
                    <tr>
                      <th>観点</th>
                      <th>Snowflake</th>
                      <th>Databricks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>主要用途</td>
                      <td>DWH・BI・レポーティング・データシェアリング</td>
                      <td>データ処理・AI/ML・ストリーミング分析</td>
                    </tr>
                    <tr>
                      <td>主要言語</td>
                      <td>SQL中心</td>
                      <td>Python / SQL / R（Spark）</td>
                    </tr>
                    <tr>
                      <td>強いユーザー層</td>
                      <td>BIアナリスト・データエンジニア</td>
                      <td>データサイエンティスト・MLエンジニア</td>
                    </tr>
                    <tr>
                      <td>データ形式</td>
                      <td>独自のマイクロパーティション形式</td>
                      <td>Delta Lake（Apache Parquetベースのオープン形式）</td>
                    </tr>
                    <tr>
                      <td>SAP連携</td>
                      <td>SAP Datasphere連携・S/4HANAからのETL/ELT</td>
                      <td>SAP SLT・ODP経由のリアルタイム複製</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                大まかな棲み分けは「Snowflake＝SQL中心のBIアナリスト向けDWH」、「Databricks＝Python・ML中心のデータサイエンティスト向け」ですが、近年は両者の機能が重なりつつあります。
              </Dialog>
              <Dialog speaker="a">
                SAPとの連携では、SAP SLTやODPでS/4HANAのデータをSnowflakeやDatabricksにリアルタイム複製するアーキテクチャが増えていますね。
              </Dialog>
              <Dialog speaker="b">
                SAPが「事実の記録係」で、SnowflakeかDatabricksが「その事実を分析して将来を予測する役割」、というチームワークですね。それぞれの得意分野を活かしている。
              </Dialog>
              <LessonLinkButton
                courseSlug="sap-history-compare"
                lessonFile="50-modern-data-platforms"
                slide={4}
                label="補足A: Snowflake・Databricks の仕組み"
                className="mt-4"
              />
            </>
          ),
        },
        {
          title: "SoR と SoI の役割分担",
          plainText:
            "SoR と SoI の役割分担：何をどのシステムに任せるか\nSoR（System of Record）：SAP/Oracle などのERP。財務数値の正確性・受発注の実行・リアルタイムな一次集計に徹する。ここのデータは「監査に耐える正確な事実」であることが最重要。\nSoI（System of Insight）：Snowflake / Databricks などのデータプラットフォーム。ERPデータに外部市場データ・Webログ・センサーデータ・SNSデータを統合し、AI/ML による需要予測や高度な予実管理を行う。ここでは「スピードと柔軟性」が最重要。\n先生：この切り分けの本質は「責任の所在の明確化」です。SoRは「正確さの最後の砦」、SoIは「価値の最大化の実験場」という役割分担です。実験で失敗しても、SoRの数字は正しいままです。\nAくん：SoIでの失敗がSoRのデータを汚染しないための設計が重要、ということですね。データパイプラインの方向性（SoR→SoIの一方向）がその設計を担う。",
          content: (
            <>
              <h2>SoR と SoI の役割分担：何をどのシステムに任せるか</h2>
              <Figure
                src="image/03-sor-soi-detail.webp"
                alt="2層のアーキテクチャ図。上層（SoR：ERP層）：SAPとOracleのアイコン、「財務・購買・在庫・受注」のラベル、「監査に耐える正確な事実」の注記。下層（SoI：データプラットフォーム層）：Snowflake・Databricksのアイコン、「AI/ML・需要予測・高度分析」のラベル、「スピードと柔軟性」の注記。両層の間にデータパイプライン矢印（SoR→SoI一方向）。外部データ（IoT・Web・マーケット）がSoI層に入ってくる矢印。"
                caption="SoRは正確さの砦、SoIは価値創造の実験場。パイプラインはSoR→SoI一方向で設計する"
                kind="diagram"
              />
              <InfoPanel
                title="SoR と SoI：何を任せるかのガイドライン"
                variant="reference"
              >
                <table>
                  <thead>
                    <tr>
                      <th>データ・機能</th>
                      <th>SoR（ERP）</th>
                      <th>SoI（データプラットフォーム）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>会計仕訳・財務諸表</td>
                      <td>◎ 主戦場</td>
                      <td>△ 参照・集計のみ</td>
                    </tr>
                    <tr>
                      <td>受発注・在庫引当</td>
                      <td>◎ 実行はERP</td>
                      <td>○ 在庫予測・需要予測に活用</td>
                    </tr>
                    <tr>
                      <td>長期履歴データ（5年以上）</td>
                      <td>△ コストが高い</td>
                      <td>◎ 安価なストレージで保管</td>
                    </tr>
                    <tr>
                      <td>IoT・センサーデータ</td>
                      <td>× ERPのスキーマに馴染まない</td>
                      <td>◎ 大量の非構造化データを扱える</td>
                    </tr>
                    <tr>
                      <td>AI/ML モデル・需要予測</td>
                      <td>× ERPには向かない</td>
                      <td>◎ 主戦場</td>
                    </tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                この切り分けの本質は「責任の所在の明確化」です。SoRは「正確さの最後の砦」、SoIは「価値の最大化の実験場」という役割分担です。実験で失敗しても、SoRの数字は正しいままです。
              </Dialog>
              <Dialog speaker="a">
                SoIでの失敗がSoRのデータを汚染しないための設計が重要。データパイプラインの方向性（SoR→SoIの一方向）がその安全弁になるんですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "コンポーザブルERP",
          plainText:
            "コンポーザブルERP：ERP単体ではなくエコシステムで設計する\nコンポーザブルERP（Composable ERP）とは、ERPをモジュール群として捉え、最も優れた製品を各領域で選択して組み合わせる設計思想です。\n典型的な現代のコンポーザブル構成例：SAP S/4HANA（コア財務・生産・購買） ＋ Oracle EPM（管理会計・予実） ＋ Salesforce（CRM） ＋ Snowflake（ビッグデータ分析） ＋ SAP BTP（拡張・統合）\n先生：「ERPにすべてのデータを詰め込む」という発想は過去のものです。コアERPはSoRとして正確なデータの守護者に徹し、周辺エコシステムが各領域の最善を担う構成が現代の最適解です。\nBちゃん：オーケストラみたいですね。弦楽器（SAP）・管楽器（Oracle EPM）・打楽器（Snowflake）がそれぞれのパートを演じ、指揮者（アーキテクト）がまとめる。\nAくん：その設計の肝は「どこがSSOT（単一の真実の情報源）かを一意に定めること」と「システム間の疎結合な連携設計」ですね。",
          content: (
            <>
              <h2>コンポーザブルERP：ERP単体ではなくエコシステムで設計する</h2>
              <MermaidDiagram
                chart={`flowchart TD
  Core["SAP S/4HANA<br/>（SoR：コア財務・生産・購買）"]
  EPM["Oracle EPM<br/>（管理会計・予実）"]
  CRM["Salesforce<br/>（CRM・フロントオフィス）"]
  DP["Snowflake / Databricks<br/>（SoI：ビッグデータ分析・AI/ML）"]
  INT["SAP BTP / iPaaS<br/>（統合・拡張レイヤ）"]

  Core --> INT
  Core -->|"SLT/ETL"| DP
  CRM --> INT
  INT --> EPM
  INT --> DP`}
              />
              <Callout variant="tip">
                <strong>コンポーザブルERPの設計原則</strong>
                <ol>
                  <li>コアERPをSoRとして守る（Clean Core）</li>
                  <li>各領域に最善の製品を選ぶ（Best of Breed）</li>
                  <li>疎結合な連携設計でシステム間依存を最小化する</li>
                  <li>SSOTとなるシステムを明確に定め、競合するマスタを持たない</li>
                </ol>
              </Callout>
              <Dialog speaker="b">
                オーケストラみたいですね。弦楽器（SAP）・管楽器（Oracle EPM）・打楽器（Snowflake）がそれぞれのパートを演じ、指揮者（アーキテクト）がまとめる。
              </Dialog>
              <Dialog speaker="teacher">
                その比喩はぴったりです。そして指揮者（アーキテクト）の腕前が音楽の質を決めます。どのシステムに何を担わせるかの設計判断が、全体の価値を左右します。
              </Dialog>
              <Dialog speaker="a">
                設計の肝は「どこがSSOT（単一の真実の情報源）かを一意に定めること」と「システム間の疎結合な連携設計」ですね。疎結合であれば片方を変えても他方に影響しない。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：この章の核心は「ERPは万能ではなく、適切な役割に特化させることが最適解」という視点です。HANA DBはOLTPとリアルタイム一次集計に超高速ですが、テラバイル級のビッグデータ分析にはコスト的に不利です。Snowflake/Databricksのコンピュート分離型アーキテクチャは、大規模データ分析のコストパフォーマンスで圧倒的です。\nAくん：SoR（ERP）とSoI（データプラットフォーム）の切り分け、そしてコンポーザブルERPの考え方が整理できました。各システムの「役割の定義」を先にすることで、選定基準が自然と決まりますね。\nBちゃん：「全部SAPに」ではなく「SAPには何をやらせて、何を外に出すか」を考える視点が身についた気がします。食材の調達（ERP・SoR）と料理（SoI・分析）を専門に分ける感じで、それぞれのプロに任せる方がクオリティが上がります。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この章の核心は「ERPは万能ではなく、適切な役割に特化させることが最適解」という視点です。HANA DBはOLTPとリアルタイム一次集計に超高速ですが、テラバイル級のビッグデータ分析にはコスト的に不利です。Snowflake/Databricksのコンピュート分離型アーキテクチャは、大規模データ分析でコストパフォーマンスが圧倒的です。
              </Dialog>
              <Dialog speaker="a">
                SoRとSoIの切り分け、そしてコンポーザブルERPの考え方が整理できました。各システムの「役割の定義」を先にすることで、選定基準が自然と決まりますね。
              </Dialog>
              <Dialog speaker="b">
                「全部SAPに」ではなく「SAPには何をやらせて、何を外に出すか」を考える視点が身についた気がします。食材の調達（ERP・SoR）と料理（SoI・分析）を専門家に分けると、それぞれのクオリティが上がりますね。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 SnowflakeのようなモダンデータプラットフォームがSAP HANAよりビッグデータ分析でコスト優位にある根拠は？→ コンピュートとストレージを完全分離し、安価なオブジェクトストレージにデータを保管、分析時のみコンピュートを使用分だけ立ち上げるため\nQ2 コンポーザブルERP設計で「SoR（ERPのコア）に徹する」べき業務として最も適切なのは？→ 会計仕訳の記録・受発注の実行・在庫引当などの業務トランザクション\n今日のひとこと：「ERPに全部入れる」時代は終わりました。SoRとSoIを分けて設計できる人材が、現代のERPコンサルタントとして求められる一歩先の価値です。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={1}
                explanation="Snowflakeなどのモダンデータプラットフォームはコンピュートとストレージを完全分離しています。データはAmazon S3などの安価なオブジェクトストレージに保管し、分析が必要なときだけコンピュートリソースを動的に立ち上げます。使っていない時間は課金されないため、テラバイル級データでもHANAインメモリと比べてコストが大幅に低くなります。"
                question={<strong>SnowflakeのようなモダンデータプラットフォームがSAP HANAよりビッグデータ分析でコスト優位にある主な根拠は？</strong>}
                options={[
                  "Snowflakeのハードウェアがより高性能だから",
                  "コンピュートとストレージを分離し、安価なオブジェクトストレージに保管して分析時のみコンピュートを使用分だけ立ち上げるから",
                  "Snowflakeは無料で利用できるオープンソースソフトウェアだから",
                ]}
              />
              <Quiz
                answer={0}
                explanation="SoR（System of Record）であるERPのコアは、業務トランザクションの正確な記録・実行に徹するべきです。会計仕訳・受発注・在庫引当はSoRの典型的な役割です。一方、需要予測・AI/ML・長期履歴分析・IoTデータ統合はSoI（データプラットフォーム）に任せることがコスト・柔軟性の両面で優れています。"
                question={<strong>コンポーザブルERP設計で「SoR（ERPのコア）に徹する」べき業務として最も適切なのは？</strong>}
                options={[
                  "会計仕訳の記録・受発注の実行・在庫引当などの業務トランザクション",
                  "AIによる需要予測モデルのトレーニング",
                  "IoTセンサーデータの長期保管と探索的分析",
                ]}
              />
              <Dialog speaker="closing">
                「ERPに全部入れる」時代は終わりました。SoRとSoIを分けて設計できる人材が、現代のERPコンサルタントとして求められる一歩先の価値です。次章ではその「分けた後の連携」の実装を学びます。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(HybridArchitectureLesson);
