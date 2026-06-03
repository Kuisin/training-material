import {
  Lesson,
  Callout,
  Dialog,
  InfoPanel,
  Quiz,
  MermaidDiagram,
  Figure,
  LessonMeta,
  LessonLinkButton,
  lessonChrome,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "補足 — データベースとBI/分析ツールの世界",
  meta: "補足 · 20分",
};

export default function DatabaseAndBiToolsLesson() {
  return (
    <Lesson
      chrome={lessonChrome("sap-basic", "53-database-and-bi-tools", lessonMeta.title)}
      slides={[
        {
          title: "概要",
          plainText:
            "補足 — データベースとBI/分析ツールの世界\n第2章（HANAデータベース）や第7章（Embedded Analytics）では、Oracle・PostgreSQL・Tableau・Power BIなどの外部ツールが比較対象として登場しました。この補足でそれぞれの製品を詳しく解説します。\n⏱ 20分 / 📶 初学者 / 🏷 外部ツール補足\nこの補足で学ぶこと\n・Oracle・PostgreSQL・MySQL：主要RDBMSの概要\n・Tableau・Power BI：BIツールとは何か\n・Amazon Redshift・Snowflake：DWH（データウェアハウス）プラットフォーム\n・これらとSAP HANAの違いと関係",
          content: (
            <>
              <hgroup>
                <h1>補足 — データベースとBI/分析ツールの世界</h1>
                <p>第2・7章で比較対象として登場した外部DBとBIツールを詳しく見ます。</p>
              </hgroup>
              <LessonMeta
                items={[
                  { icon: "⏱", text: "20分" },
                  { icon: "📶", text: "初学者" },
                  { icon: "🏷", text: "外部ツール補足" },
                ]}
              />
              <h3>この補足で学ぶこと</h3>
              <ul>
                <li>Oracle・PostgreSQL・MySQL：主要RDBMSの概要と使い分け</li>
                <li>Tableau・Power BI：BIツールとは何か</li>
                <li>Amazon Redshift・Snowflake：DWHクラウドプラットフォーム</li>
                <li>これらとSAP HANAとの違い・関係</li>
              </ul>
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <LessonLinkButton
                  courseSlug="sap-basic"
                  lessonFile="02-hana-database"
                  slide={3}
                  label="本編第2章: 従来DBとの比較"
                  variant="back"
                />
                <LessonLinkButton
                  courseSlug="sap-basic"
                  lessonFile="07-fiori-analytics"
                  slide={8}
                  label="本編第7章: Embedded Analytics"
                  variant="back"
                />
              </div>
            </>
          ),
        },
        {
          title: "RDBMSとは何か",
          plainText:
            "RDBMSとは何か（おさらい）\nRDBMS（Relational Database Management System：関係データベース管理システム）は、データを表（テーブル）で管理し、SQL（Structured Query Language）で操作するシステムの総称です。企業の基幹システムのほぼ全てがRDBMSの上で動いています。\n主なRDBMS：Oracle Database・Microsoft SQL Server・PostgreSQL・MySQL・IBM Db2など。\nSAPとの関係：旧SAP（R/3・ECC）はOracle・MS SQL Server・IBM Db2・MaxDB等の汎用RDBMSの上で動いていました。S/4HANAではHANAが唯一の対応DBになりました。\n先生：「RDBMSを選ぶ」という時代から「SAPならHANAしか選べない」時代へ変わった。これはSAPのアーキテクチャの大きな転換です。\nAくん：HANAに最適化された機能（カラム型・インメモリ）をフル活用するために、他のDBでは動かないようにしたわけですね。",
          content: (
            <>
              <h2>RDBMSとは何か（おさらい）</h2>
              <p>
                <strong>RDBMS（Relational Database Management System）</strong>は、データを表（テーブル）で管理し、
                SQLで操作するシステムの総称です。企業システムの大部分がRDBMSの上で動いています。
              </p>
              <InfoPanel title="主要RDBMS比較" variant="reference">
                <table>
                  <thead>
                    <tr><th>製品名</th><th>提供元</th><th>特徴</th><th>利用シーン</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Oracle Database</td><td>Oracle（米）</td><td>高い信頼性・機能の豊富さ</td><td>大企業の基幹系</td></tr>
                    <tr><td>Microsoft SQL Server</td><td>Microsoft（米）</td><td>Windows環境との親和性</td><td>中〜大企業、.NETシステム</td></tr>
                    <tr><td>PostgreSQL</td><td>オープンソース</td><td>高機能・無料・拡張性</td><td>Web系・クラウドネイティブ</td></tr>
                    <tr><td>MySQL</td><td>Oracle（旧Sun）</td><td>軽量・普及度が高い</td><td>Webアプリ・中小規模</td></tr>
                    <tr><td>SAP HANA</td><td>SAP（独）</td><td>インメモリ・カラム型・HTAP</td><td>SAP S/4HANA専用</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                旧SAPはOracle・MS SQL Server等の汎用RDBMSの上で動いていました。S/4HANAではHANAが唯一の対応DBになりました。これはSAPのアーキテクチャの大きな転換です。
              </Dialog>
              <Dialog speaker="a">
                HANAに最適化された機能（カラム型・インメモリ）をフル活用するために、他のDBでは動かないようにしたわけですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "Oracle Databaseとは",
          plainText:
            "Oracle Database（オラクル データベース）\nOracleは1979年に商用化された世界最古かつ最大のエンタープライズRDBMSです。Larry Ellisonが創業したOracle Corporationが開発。世界中の大企業・金融機関・政府機関の基幹システムで使われています。\n主な特徴：RAC（Real Application Clusters）による高可用性、強力な行ロック機能、豊富なセキュリティ機能、PL/SQLというOracle独自の手続き型SQL拡張。\nSAPとの関係：長年SAPの最も多く使われるデータベースでした。S/4HANAへの移行に際して多くの企業がOracleからHANAへのデータ移行を実施しています。ただしOracleはERP（Oracle ERP Cloud）もERP分野でSAPと直接競合します。\n先生：Oracleは「DBベンダー」であり「ERPベンダー」でもあります。SAPの競合であり、かつてはSAPのDB基盤でもあった、という複雑な関係です。",
          content: (
            <>
              <h2>Oracle Database（オラクル データベース）</h2>
              <p>
                Oracleは1979年商用化、世界最大のエンタープライズ向けRDBMSです。
                大企業・金融・政府機関の基幹システムで広く使用されています。
              </p>
              <Callout variant="note">
                <strong>PL/SQL とは</strong>：Oracle独自の手続き型SQL拡張言語。通常のSQLにIF文・ループ・変数・例外処理などプログラミング要素を加えたもの。SAPのABAPに相当するOracle側の開発言語と考えることができます。
              </Callout>
              <Dialog speaker="teacher">
                OracleはDBベンダーであり、Oracle ERP CloudというERPでSAPと直接競合するERPベンダーでもあります。かつてはSAPのDB基盤として最多採用されていた「パートナー兼競合」という複雑な関係です。
              </Dialog>
              <Dialog speaker="b">
                同じ会社がDBも作って、ERPも作っているんですね。それでSAPとは仲間でもあり競合でもある。
              </Dialog>
              <Dialog speaker="a">
                S/4HANAへの移行でOracleからHANAに乗り換えると、OracleのDB売上が減る。Oracleが自社ERPを積極的に推進する動機の一つでもありそうです。
              </Dialog>
            </>
          ),
        },
        {
          title: "PostgreSQL / MySQLとは",
          plainText:
            "PostgreSQL と MySQL：オープンソースRDBMS\nPostgreSQL（ポストグレスキューエル）：1996年リリースのオープンソースRDBMS。無料で使え、高機能・高信頼性・拡張性が特徴。近年はクラウドネイティブな開発（AWSのAurora PostgreSQL等）で広く採用。Web系スタートアップからエンタープライズまで普及。\nMySQL（マイエスキューエル）：1995年リリース、現在はOracleが所有するオープンソースRDBMS。軽量で高速。WordPressなどのWebアプリに広く使われ、世界で最も普及したRDBMSの一つ。\nSAPとの関係：旧SAPはMaxDB（SAP独自のMySQL派生DB）とも連携していた。PostgreSQL・MySQLはSAP S/4HANAのDBとしては使用不可（HANAのみ対応）。ただし、BTPや周辺システムでは使われることがある。\nBちゃん：PostgreSQLは「無料で使えるOracleに近い機能のDB」というイメージでしょうか。",
          content: (
            <>
              <h2>PostgreSQL と MySQL：オープンソースRDBMS</h2>
              <InfoPanel title="PostgreSQL vs MySQL" variant="reference">
                <table>
                  <thead>
                    <tr><th>項目</th><th>PostgreSQL</th><th>MySQL</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>コスト</td><td>無料（オープンソース）</td><td>無料（コミュニティ版）</td></tr>
                    <tr><td>特徴</td><td>高機能・高信頼性・拡張性</td><td>軽量・高速・普及度高い</td></tr>
                    <tr><td>主な用途</td><td>クラウドネイティブ、エンタープライズ</td><td>Webアプリ、中小規模システム</td></tr>
                    <tr><td>SQLの標準準拠</td><td>高い</td><td>中程度</td></tr>
                    <tr><td>SAP S/4HANA対応</td><td>不可（HANAのみ）</td><td>不可（HANAのみ）</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="b">
                PostgreSQLは「無料で使えるOracleに近い機能のDB」というイメージでしょうか。
              </Dialog>
              <Dialog speaker="teacher">
                ほぼその通りです。クラウド時代に入ってAWSのAurora・AzureのFlexible Server・Google Cloud SQLなどがPostgreSQLベースを採用しており、クラウドDBの標準的な選択肢の一つになっています。
              </Dialog>
            </>
          ),
        },
        {
          title: "BIツールとは",
          plainText:
            "BIツール（Business Intelligence Tools）とは何か\nBIツールはデータを可視化・分析するソフトウェアです。データベースやDWHからデータを接続し、グラフ・ダッシュボード・レポートを作成します。非エンジニアでもドラッグ＆ドロップでデータ分析できる「セルフサービスBI」が現代の主流です。\n主なBIツール：Tableau（タブロー）、Microsoft Power BI（パワーBI）、Looker（Google）、Qlik Sense。\nSAPとの関係：従来、ERPのデータをDWHに移してBIツールで分析するのが標準でした。第7章で学んだ「Embedded Analytics」はこのBIツールが不要になるアプローチです（HANAが直接集計するため）。ただし複雑な分析や既存BI環境との統合のためにBIツールと併用するケースも多い。",
          content: (
            <>
              <h2>BIツール（Business Intelligence Tools）とは何か</h2>
              <p>
                BIツールはデータを<strong>可視化・分析する</strong>ソフトウェアです。
                非エンジニアでもドラッグ＆ドロップでダッシュボードを作れる「セルフサービスBI」が主流です。
              </p>
              <MermaidDiagram
                chart={`flowchart LR
  A["ERP\n（SAP S/4HANA）"] -->|"データ抽出"| B["DWH\n（データ倉庫）"]
  B -->|"接続"| C["BIツール\n（Tableau/Power BI）"]
  C --> D["ダッシュボード\n・レポート"]
  A -->|"Embedded Analytics\n（直接分析）"| D`}
              />
              <Callout variant="tip">
                <strong>従来フロー vs Embedded Analytics</strong>
                <ul>
                  <li><strong>従来</strong>：ERP → DWH転送（夜間バッチ）→ BIツール → レポート（1日遅れ）</li>
                  <li><strong>Embedded Analytics</strong>：ERP画面上でHANAが直接集計 → リアルタイムレポート</li>
                </ul>
              </Callout>
              <Dialog speaker="teacher">
                Embedded Analyticsが成熟した今でも、複雑な分析・既存のBI環境・非SAP系データとの統合のために、TableauやPower BIをSAPと組み合わせるケースは多くあります。
              </Dialog>
            </>
          ),
        },
        {
          title: "Tableau / Power BIとは",
          plainText:
            "Tableau と Power BI：2大BIツール\nTableau（タブロー）：2003年創業、2019年にSalesforceが買収。データ可視化に特化し、美しいグラフと直感的な操作で人気。大企業・コンサルタント・データアナリストに広く採用。有料ライセンス（Tableau Creator / Explorer / Viewer）。\nMicrosoft Power BI（パワーBI）：MicrosoftのBIツール。Office 365との高い親和性、Desktop版は無料で利用可能。SQLServer・Excel・SharePointなどMicrosoft製品との連携が得意。中堅〜大企業で急速に普及。\n価格競争面：Power BIはMicrosoft 365ライセンスに含まれるプランがあり、コストメリットが大きい。Tableauは高機能だがライセンス費用が高い。\nSAPとの関係：SAP Analytics Cloud（SAC）がSAP製のBIツール。しかし既存のTableau/Power BI環境を維持しながらSAP Embedded Analyticsも使う「ハイブリッド分析」を採用する企業が多い。",
          content: (
            <>
              <h2>Tableau と Power BI：2大BIツール</h2>
              <InfoPanel title="Tableau vs Power BI vs SAP Analytics Cloud" variant="reference">
                <table>
                  <thead>
                    <tr><th>製品</th><th>提供元</th><th>強み</th><th>弱み</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Tableau</td><td>Salesforce</td><td>高い表現力・美しいグラフ</td><td>ライセンス費用が高い</td></tr>
                    <tr><td>Power BI</td><td>Microsoft</td><td>M365との統合・低コスト</td><td>複雑な可視化は苦手な場合も</td></tr>
                    <tr><td>SAP Analytics Cloud</td><td>SAP</td><td>SAP S/4HANAとの直接連携</td><td>SAP以外のデータ連携が課題</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Figure
                src="image/53-bi-tools.webp"
                alt="BIツールの選択肢を示す比較図。左：TableauのロゴとSalesforce親会社のアイコン（美しいグラフのサンプル）。中央：Power BIのロゴとMicrosoftアイコン（Excel・Teams等との統合を示す矢印）。右：SAP Analytics CloudのロゴとSAP S/4HANAへの直接接続矢印。各製品の特徴を一言ラベルで表示。"
                caption="3大BIツール：Tableau（表現力）、Power BI（コスト・M365連携）、SAC（SAP統合）"
                kind="diagram"
              />
              <Dialog speaker="b">
                会社でPower BIを使っているのですが、Microsoft 365に含まれているから追加費用なしで使えているんですね。
              </Dialog>
              <Dialog speaker="teacher">
                その通りです。コスト面でPower BIを選ぶ企業は多い。ただし高度な可視化や複雑なデータ操作ではTableauが強みを発揮します。
              </Dialog>
            </>
          ),
        },
        {
          title: "DWHプラットフォーム：Redshift / Snowflakeとは",
          plainText:
            "クラウドDWHプラットフォーム：Amazon Redshift と Snowflake\nDWH（Data Warehouse）は分析専用に最適化されたデータ倉庫です。ERPや複数のSaaSからデータを収集・統合して、BIツールでの分析基盤とします。\nAmazon Redshift（レッドシフト）：AWSが提供するクラウドDWHサービス。2012年リリース。カラム型ストレージを採用。大規模データの分析に強い。\nSnowflake（スノーフレーク）：2012年創業のクラウドDWH専業企業。マルチクラウド対応（AWS/Azure/GCP全て）。コンピュートとストレージの分離という革新的なアーキテクチャで急速に普及。\nSAPとの関係：HANAのHTAPにより「DWHは不要」という方向性を出しているものの、非SAP系データの統合や大規模なデータレイク構築にはRedshiftやSnowflakeを使うケースが多い。\n先生：現実のエンタープライズ環境では、SAP HANA + Snowflake/Redshift + Power BI/Tableau という組み合わせがよく見られます。",
          content: (
            <>
              <h2>クラウドDWH：Amazon Redshift と Snowflake</h2>
              <p>
                <strong>DWH（Data Warehouse）</strong>は、複数のシステムからデータを収集・統合して分析専用に最適化したデータ倉庫です。
                BIツールへのデータ供給源として機能します。
              </p>
              <InfoPanel title="主要クラウドDWHプラットフォーム" variant="reference">
                <table>
                  <thead>
                    <tr><th>製品</th><th>提供元</th><th>特徴</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Amazon Redshift</td><td>AWS</td><td>AWSエコシステムとの統合・大規模データ</td></tr>
                    <tr><td>Snowflake</td><td>Snowflake Inc.</td><td>マルチクラウド・コンピュート/ストレージ分離</td></tr>
                    <tr><td>Google BigQuery</td><td>Google</td><td>サーバーレス・ML機能との統合</td></tr>
                    <tr><td>Azure Synapse Analytics</td><td>Microsoft</td><td>Azure/Power BI/SQLとの統合</td></tr>
                  </tbody>
                </table>
              </InfoPanel>
              <Dialog speaker="teacher">
                現実のエンタープライズ環境では、SAP HANA + Snowflake/Redshift + Power BI/Tableau という組み合わせが見られます。HANAがリアルタイム業務分析、DWHが横断データ統合・長期保管、BIツールがビジュアライゼーションを担当します。
              </Dialog>
              <Dialog speaker="a">
                「HANAがあればDWHは不要」はSAP内データに限った話で、他システムのデータも統合するにはDWHが必要ということですね。
              </Dialog>
            </>
          ),
        },
        {
          title: "対話で整理",
          plainText:
            "対話で整理\n先生：この補足で押さえるべき核は「エコシステムの多様性」です。SAPはERPとDBとBI、全てをSAP製品で完結させようとする方向性を持ちつつも、現実の企業環境ではOracle・PostgreSQL・Tableau・Snowflakeなど多様なツールと共存しています。\nAくん：技術的な整理でいえば、RDBMSは「どこにデータを保存するか」、BIツールは「データをどう見るか」、DWHは「どこに分析用データを集めるか」。HANAはRDBMSとDWHの境界を崩した革新的な存在です。\nBちゃん：SalesforceがCRMで、WorkdayがHRで、TableauがBIで、それぞれ専門家がいる世界なんですね。SAPはその中で「業務処理の基幹」を担いながら、API・統合ツールで他のシステムとつながっている。そういう全体像が見えてきました。",
          content: (
            <>
              <h2>対話で整理</h2>
              <Dialog speaker="teacher">
                この補足で押さえるべき核は「エコシステムの多様性」です。SAPはERP・DB・BIの全てをSAP製品で完結させようとしつつも、現実の企業環境ではOracle・PostgreSQL・Tableau・Snowflakeなど多様なツールと共存しています。
              </Dialog>
              <Dialog speaker="a">
                技術的な整理でいえば、RDBMSは「どこにデータを保存するか」、BIツールは「データをどう見るか」、DWHは「どこに分析用データを集めるか」。HANAはRDBMSとDWHの境界を崩した革新的な存在です。
              </Dialog>
              <Dialog speaker="b">
                SalesforceがCRMで、WorkdayがHRで、TableauがBIで、それぞれ専門家がいる世界なんですね。SAPはその中で「業務処理の基幹」を担いながら、APIで他のシステムとつながっている。全体像が見えてきました。
              </Dialog>
            </>
          ),
        },
        {
          title: "確認テスト",
          plainText:
            "理解度チェック\nQ1 SAP S/4HANAが対応しているデータベースは？→ SAP HANA のみ（Oracle・PostgreSQL等は非対応）\nQ2 TableauとPower BIの主な違いは？→ Tableauは高い表現力・ライセンス費用高め、Power BIはMicrosoft 365との統合・低コストが特徴\n今日のひとこと：DBもBIもDWHも、それぞれ専門ツールがある広い世界です。SAPという軸を持ちながら、このエコシステム全体を俯瞰できるようになりましょう。",
          content: (
            <>
              <h2>理解度チェック</h2>
              <Quiz
                answer={2}
                explanation="SAP S/4HANAはSAP HANAデータベース専用に設計されています。R/3やECCの時代は Oracle・MS SQL Server・IBM Db2など複数のDBに対応していましたが、S/4HANAでは HANAのインメモリ・カラム型機能を最大限活用するため HANAのみが対応DBとなりました。"
                question={<strong>SAP S/4HANA が対応しているデータベースは？</strong>}
                options={[
                  "Oracle DatabaseとSAP HANAの2択から選べる",
                  "PostgreSQL・Oracle・HANAの3つから選べる",
                  "SAP HANA のみ対応（Oracle・PostgreSQL等は非対応）",
                ]}
              />
              <Quiz
                answer={0}
                explanation="Tableauは高い表現力と美しいグラフで人気ですが、ライセンス費用が高めです。Power BIはMicrosoft 365との統合性が高く、M365ライセンスに含まれるプランがあるため、コスト面で優位なケースが多い。SAP Analytics CloudはSAP S/4HANAとの直接連携が最も強みです。"
                question={<strong>Power BIがTableauと比較したときの主なメリットはどれ？</strong>}
                options={[
                  "Microsoft 365との統合が高く、コスト面でメリットがある",
                  "SAP S/4HANAとの直接連携が最も強い",
                  "データ可視化の表現力が最も豊富",
                ]}
              />
              <Dialog speaker="closing">
                DBもBIもDWHも、それぞれ専門ツールがある広い世界です。SAPという軸を持ちながら、このエコシステム全体を俯瞰できるようになりましょう。
              </Dialog>
            </>
          ),
        },
      ]}
    />
  );
}

mountLesson(DatabaseAndBiToolsLesson);
