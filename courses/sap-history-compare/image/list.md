# sap-history-compare — Image List

All figures used across the course. Each entry includes the file name, type (concept / diagram), the lesson + slide it appears in, alt text, and an English image-generation prompt.

---

## 00-introduction.tsx

### 00-hardware-history.webp
- **Kind:** diagram
- **Slide:** ハードウェア史がERPを作った
- **Alt text:** ハードウェア進化の年表図。左端「1990年代：RAM 1GB = $1,000,000・HDDがボトルネック」、中央「2000年代：正規化・夜間バッチが最適解」、右端「2010年代：大容量RAM量産・NVMe SSD・S/4HANA登場」。各時代ごとのシステム構成アイコン（サーバー・DB・バッチ処理）。コストと速度の対比を矢印で表現。
- **Image prompt:** Timeline diagram showing ERP hardware evolution across three eras (1990s, 2000s, 2010s). Left: expensive RAM + HDD bottleneck era with server icons. Center: normalization + nightly batch era. Right: large RAM + NVMe SSD + in-memory era. Cost vs speed comparison with arrows. Flat vector style, light background, no text labels, 16:9 ratio.

### 00-sor-soi.webp
- **Kind:** diagram
- **Slide:** SoR・SoI・SSOTの整理
- **Alt text:** SoR・SoI・SSOTの関係図。左ボックス「SoR（System of Record）：SAP S/4HANA、信頼できる取引データの源泉」。右ボックス「SoI（System of Insight）：Snowflake・Databricks、分析・集計・予測」。上部に「SSOT（Single Source of Truth）：全社が参照する唯一の正解」のラベルで両者を包含。SoRからSoIへのETL/ELT矢印。
- **Image prompt:** Architecture diagram showing relationship between SoR (System of Record), SoI (System of Insight), and SSOT (Single Source of Truth). Left box labeled SoR with database/ERP icon, right box labeled SoI with analytics/chart icon, outer wrapper labeled SSOT. ETL/ELT arrow flowing left to right. Flat vector, light background, no text, 16:9 ratio.

---

## 01-hardware-evolution.tsx

### 01-normalization.webp
- **Kind:** diagram
- **Slide:** 極限の正規化
- **Alt text:** データベース正規化の構造図。上段に非正規化テーブル（受注・顧客・製品の重複データ）、下段に第3正規形（受注テーブル・顧客テーブル・製品テーブルを外部キーで結合）。上段→下段の矢印に「正規化（Normalization）」ラベル。下段のJOIN操作を示す矢印。HDDのアイコンとI/Oコストの増加を示すグラフ。
- **Image prompt:** Database normalization diagram. Top: denormalized table with duplicate columns and warning icon. Bottom: three separate normalized tables (orders, customers, products) connected by foreign key arrows. Arrow from top to bottom labeled "Normalization". JOIN operation shown with curved arrows between tables. HDD icon with rising I/O cost bar chart. Flat vector, light background, no text, 16:9 ratio.

### 01-hardware-breakthrough.webp
- **Kind:** concept
- **Slide:** 2010年代のブレイクスルー
- **Alt text:** 2010年代ハードウェア革新のコンセプト図。左から右に「大容量DRAM（コスト1/100）」「NVMe SSD（I/O速度100倍）」「マルチコアCPU（並列処理）」の3つのアイコンが横に並び、中央下の「SAP HANA In-Memory DB」ボックスに向けて矢印が収束。HANA ボックスから「リアルタイム分析」「Universal Journal」「HTAP」の3つの成果が放射状に出る。
- **Image prompt:** Concept illustration of 2010s hardware breakthrough enabling in-memory databases. Three hardware icons (large DRAM chip, NVMe SSD, multi-core CPU) with downward arrows converging into a central "In-Memory DB" cylinder icon. From the database, three outcome arrows radiate out: real-time analytics, unified journal, HTAP. Clean flat vector style, light gradient background, no text, 16:9 ratio.

### 01-row-vs-column.webp
- **Kind:** diagram
- **Slide:** 列指向DBとHTAP
- **Alt text:** 行指向DBと列指向DBの対比図。左パネル「行指向（Row Store）：OLTP向き。1行ずつ連続格納。INSERT/UPDATE高速。全列スキャンでI/O増」、右パネル「列指向（Column Store）：OLAP向き。列ごとに連続格納。集計クエリ高速・圧縮率高。1行のINSERTは低速」。中央に「HTAP（SAP HANA）：両方を同時実現」のラベルと双方向矢印。
- **Image prompt:** Side-by-side comparison diagram of row store vs column store databases. Left panel shows row-oriented storage layout with OLTP label and fast INSERT/UPDATE icons. Right panel shows column-oriented storage with OLAP label and fast aggregation/compression icons. Center: "HTAP" bridge label with bidirectional arrows. Color-coded cells show data arrangement difference. Flat vector, light background, no text, 16:9 ratio.

---

## 02-erp-vendors.tsx

### 02-vendor-origins.webp
- **Kind:** concept
- **Slide:** 「出自」という視点
- **Alt text:** ERPベンダー3社の出自を示すコンセプト図。左「SAP（1972年・ドイツ）：製造業の業務プロセス設計から生まれたERP」の工場アイコン付きボックス。中央「Oracle（1977年・シリコンバレー）：データベース技術とM&A戦略で拡大」のデータベースアイコン付きボックス。右「Microsoft（Dynamics 365）：Office・Azure・AIエコシステムで拡大」のOffice/クラウドアイコン付きボックス。各ボックスの下に「強み：プロセス中心」「強み：財務・EPM」「強み：UI/AI統合」のラベル。
- **Image prompt:** Concept illustration showing three ERP vendor origins. Left: SAP box with factory/manufacturing icon representing German engineering roots. Center: Oracle box with database cylinder icon representing technology and acquisition growth. Right: Microsoft box with cloud/office icon representing ecosystem integration. Each box has a distinct color (blue for SAP, red for Oracle, teal for Microsoft). Arrows showing evolution timeline beneath each. Flat vector, light background, no text, 16:9 ratio.

### 02-vendor-comparison.webp
- **Kind:** diagram
- **Slide:** 3社比較：選択の判断軸
- **Alt text:** SAP・Oracle・Microsoft 3社比較マトリクス図。縦軸「強みの軸」、横軸に3社のロゴ相当のアイコン。評価行：コアERP（製造・調達・財務）、クラウド対応、BI・分析、AI統合、Officeとの連携、TCO。各セルに◎/○/△のスコアアイコン（SAP：コアERP◎、Oracle：財務・EPM◎、Microsoft：Office/AI◎）。
- **Image prompt:** Comparison matrix diagram for three ERP vendors (represented by abstract icons in blue, red, teal). Rows represent evaluation criteria: Core ERP, Cloud readiness, BI/Analytics, AI integration, Productivity suite integration, TCO. Cells contain score indicators (full circle, half circle, empty circle). Each vendor column has a distinct color. Flat vector, light background, no text labels, 16:9 ratio.

---

## 03-hybrid-architecture.tsx

### 03-compute-storage-separation.webp
- **Kind:** diagram
- **Slide:** コンピュートとストレージの分離
- **Alt text:** コンピュートとストレージ分離のアーキテクチャ図。下段「共有ストレージ層（S3/Azure Data Lake）」の大きな水平バー。上段に複数の独立した「コンピュートクラスター（仮想ウェアハウス）」が浮かんでいる形。各クラスターから下のストレージへ双方向矢印。左クラスター「財務分析」、中央「マーケティング分析」、右「ML・予測モデル」のラベル。クラスターを増減させるスケールアップ/スケールアウトの矢印。
- **Image prompt:** Architecture diagram showing compute-storage separation. Bottom: wide horizontal bar representing shared cloud object storage (S3/Data Lake). Top: three independent compute clusters floating above storage, connected by bidirectional arrows. Each cluster has a different icon (finance, marketing, ML). Scale-up and scale-out arrows around clusters. Storage bar shows data files. Flat vector, light background, no text, 16:9 ratio.

### 03-sor-soi-detail.webp
- **Kind:** diagram
- **Slide:** SoRとSoIの役割分担
- **Alt text:** SoRとSoIの詳細役割分担図。左半分「SoR（SAP S/4HANA）：リアルタイム取引・ACID保証・法的コンプライアンス・Universal Journal」のERP画面イメージアイコン。右半分「SoI（Snowflake・Databricks）：大量データ分析・ML・BI・Cross-ERP統合」の分析ダッシュボードアイコン。中央の境界線にCDC/ETL/ELTの矢印（SoR→SoI方向）。境界線上に「Single Source of Truth の境界」のラベル。
- **Image prompt:** Detailed role separation diagram for SoR and SoI. Left half: ERP/transaction system with ACID, compliance, real-time transaction icons. Right half: analytics platform with charts, ML model, BI dashboard icons. Center boundary line with CDC/ETL arrows flowing left to right. Clear visual separation between operational (left) and analytical (right) zones. Flat vector, light background, no text, 16:9 ratio.

---

## 04-integration-design.tsx

### 04-etl-vs-elt.webp
- **Kind:** diagram
- **Slide:** ETL vs ELT
- **Alt text:** ETLとELTのプロセス比較図。上段「ETL（Extract → Transform → Load）」：SAPからデータ抽出→中間サーバーで変換（マッピング・集計）→DWHにLoad。下段「ELT（Extract → Load → Transform）」：SAPからデータ抽出→DWH（Snowflake等）に生データをLoad→DWH内でTransform（dbt等）。2つのフローを並べて変換場所の違いを強調。上段の「変換」ボックスをオレンジ（旧来）、下段の「変換」ボックスを青（現代DWH内）で色分け。
- **Image prompt:** Process comparison diagram showing ETL vs ELT pipelines. Top row: Extract box → Transform box (orange, outside DWH) → Load box → DWH icon. Bottom row: Extract box → Load box → DWH icon → Transform box (blue, inside DWH). Source system icons on left (ERP/database), destination icons on right. Color distinction emphasizes where transformation happens. Flat vector, light background, no text, 16:9 ratio.

### 04-integration-tools.webp
- **Kind:** diagram
- **Slide:** API・メッセージング・iPaaS
- **Alt text:** 3種類のSAP連携パターン比較図。左列「API連携（OData/REST）：低レイテンシ・同期・少量データ」。中央列「メッセージング（Kafka/Service Bus）：非同期・イベント駆動・高スループット」。右列「iPaaS（MuleSoft/Boomi）：変換・ルーティング・オーケストレーション」。各列の上にSAP S/4HANAのアイコン、下に連携先システム（Snowflake・Salesforce・外部API）のアイコン。各列の矢印スタイルが異なる（API：直接矢印、Kafka：波形矢印、iPaaS：ハブ経由矢印）。
- **Image prompt:** Three-column comparison diagram of SAP integration patterns. Left column: API (synchronous direct arrow, low latency). Center column: Messaging/Event bus (wavy async arrows, high throughput). Right column: iPaaS hub (transform/route symbols, orchestration). SAP source icon at top of each column, destination systems (analytics, CRM, external) at bottom. Different arrow styles per column. Flat vector, light background, no text, 16:9 ratio.

---

## 05-governance-cost.tsx

### 05-three-lenses.webp
- **Kind:** diagram
- **Slide:** 3つの評価レンズ
- **Alt text:** アーキテクチャ選定の3レンズ図。中央に「アーキテクチャ選定」の六角形。六角形の3辺から3つのレンズ（楕円形）が伸びる。左上「プロセス統合度：業務フローがERPに深く依存しているか」。右上「データ特性：リアルタイム性・データ量・多様性」。下「運用・コスト：内製能力・TCO・ベンダーロックイン許容度」。各レンズに代表的な問いかけのアイコン（チェックリスト・データベース・コイン）。
- **Image prompt:** Architecture selection framework diagram. Center hexagon representing the decision point. Three lens-shaped ellipses extending from it: top-left (process integration depth, workflow icon), top-right (data characteristics, database/speed icon), bottom (operational cost and TCO, coin/budget icon). Each lens has a distinct color. Decision arrows flowing from lenses to center. Flat vector, light background, no text, 16:9 ratio.

### 05-mdm-concept.webp
- **Kind:** diagram
- **Slide:** MDMとデータガバナンス
- **Alt text:** MDMとデータガバナンスの全体像図。中央「MDM Hub（SAP S/4HANA）」のボックス。上から「データオーナー（ビジネス部門）」のアイコンが承認矢印を出す。左から「データスチュワード（日常管理）」のアイコンがデータ品質チェック矢印を出す。右から「データカストディアン（IT管理）」のアイコンがセキュリティ矢印を出す。下部に「データカタログ（Collibra/Purview）」「データリネージ」「DQ5次元スコア」のボックスが横並び。全体を囲む枠に「データガバナンスフレームワーク」のラベル。
- **Image prompt:** MDM and data governance overview diagram. Center: MDM Hub box. Top: business owner icon with approval arrow. Left: data steward icon with quality check arrow. Right: IT custodian icon with security shield arrow. Bottom row: three boxes representing data catalog, data lineage, and DQ scoring. Outer frame enclosing all elements representing governance framework. Flat vector, light background, no text, 16:9 ratio.

---

## 50-modern-data-platforms.tsx

### 50-snowflake-architecture.webp
- **Kind:** diagram
- **Slide:** Snowflakeの仕組み
- **Alt text:** Snowflakeの3層アーキテクチャ図。最下層「クラウドストレージ層（S3/Azure Blob/GCS）：マイクロパーティション（各最大500MB）に分割されたデータファイル群」。中間層「コンピュート層（仮想ウェアハウス）：複数の独立した仮想ウェアハウスが並んで浮かんでいる（Warehouse-A・B・C）」。最上層「サービス層（クエリ最適化・認証・メタデータ管理）」。各層を矩形の帯で表現し、ストレージとコンピュートの分離を強調。
- **Image prompt:** Snowflake three-layer architecture diagram. Bottom layer: cloud storage band with micro-partition file icons arranged in a grid. Middle layer: multiple independent virtual warehouse cubes floating above storage, connected by arrows. Top layer: service layer with query optimizer and metadata icons. Layers clearly separated with distinct colors (storage=gray, compute=blue, services=teal). Flat vector, light background, no text, 16:9 ratio.

---

## 51-integration-tools.tsx

### 51-ipaas-concept.webp
- **Kind:** diagram
- **Slide:** iPaaS とは
- **Alt text:** iPaaSのハブ構成図。中央にiPaaSのボックス（MuleSoft等）。左側からSAP・Salesforce・Oracle・社内レガシーシステムが矢印でiPaaSに接続。右側からSnowflake・外部パートナーシステム・モバイルアプリがiPaaSと双方向で接続。iPaaS内に「マッピング・変換・ルーティング・オーケストレーション」の機能ブロック。各コネクションに異なるプロトコル（OData・REST・SOAP・ファイル）のアイコン。
- **Image prompt:** iPaaS hub-and-spoke architecture diagram. Center: iPaaS platform box with four internal function blocks (mapping, transformation, routing, orchestration). Left side: four source system icons (ERP, CRM, legacy, database) with arrows pointing to center. Right side: three destination icons (data warehouse, partner system, mobile app) with bidirectional arrows. Different connector protocol icons on each link. Flat vector, light background, no text, 16:9 ratio.

---

## 52-data-governance-terms.tsx

### 52-mdm-golden-record.webp
- **Kind:** diagram
- **Slide:** MDM（マスターデータ管理）とは
- **Alt text:** MDMゴールデンレコードの概念図。中央に大きな「MDM Hub（SAP S/4HANA）」のボックスと「ゴールデンレコード」のラベル。左側から「CRM（Salesforce）の顧客ID: A001」「旧ERPの顧客コード: CUST-99」「ECサイトの会員番号: U5521」という3つの矢印がMDM Hubに向かって収束。MDM Hubから右側に「Snowflake（分析用）」「Dynamics 365（サービス管理）」「BIレポート」の3つへ矢印が分岐。中央のHub内に「名寄せ・統合・品質チェック」の機能ブロック。
- **Image prompt:** MDM golden record concept diagram. Left side: three source system icons with different customer IDs (CRM, legacy ERP, e-commerce) connected by converging arrows to central MDM Hub box. Hub contains deduplication and quality check icons. Right side: three destination system icons (data warehouse, service system, BI report) with diverging arrows from hub. Star/gold badge icon on the golden record. Flat vector, light background, no text, 16:9 ratio.

### 52-data-governance-roles.webp
- **Kind:** diagram
- **Slide:** データスチュワードシップ
- **Alt text:** データガバナンスの役割階層図。上段に「データオーナー（Data Owner）：財務部長・販売部長等のビジネス責任者」のボックス（紺色）。中段に「データスチュワード（Data Steward）：マスターデータ管理担当・DQ改善担当」のボックス（青色）。下段に「データカストディアン（Data Custodian）：SAP Basis・Snowflake管理者・DBAdmin」のボックス（水色）。3つのボックスを囲む点線で「データガバナンス委員会（Data Governance Council）」のラベル。右側に「ビジネス責任 ↕ IT実務責任」の縦軸。
- **Image prompt:** Three-tier data governance roles diagram. Top box (dark navy): Data Owner with business executive icon and decision/authority symbols. Middle box (medium blue): Data Steward with data quality check and catalog icons. Bottom box (light blue): Data Custodian with server/security icons. Vertical responsibility axis on right side (business top, IT bottom). Dashed outer boundary box representing governance council. Hierarchical arrows between tiers. Flat vector, light background, no text, 16:9 ratio.

---

*Total images: 17 (2 per lesson × 6 main chapters + 1 for 50 + 1 for 51 + 2 for 52)*
