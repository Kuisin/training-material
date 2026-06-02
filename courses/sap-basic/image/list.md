# 画像リスト（SAP S/4HANA基礎コース）

このフォルダ（`courses/sap-basic/image/`）に、下記のファイル名で画像を置くと、各レッスンの該当スライドに自動で表示されます。
画像が無い間は、スライド上に「準備中」のプレースホルダ（ファイル名＋説明）が出ます。

## 使い方・ルール

- **原画（保持用）**: `courses/sap-basic/image/originals/<ファイル名>.png` — リポジトリに残す。サイトには出さない。
- **配信用**: `courses/sap-basic/image/<ファイル名>.webp` — `pnpm run optimize:images` で原画から生成。
- **参照**: スライドは `<Figure src="image/<ファイル名>.webp" … />`（拡張子 `.webp`）
- **推奨形式（原画）**: PNG（透過可）/ 横長 16:9〜4:3。SVG も可。
- **文字**: 図中に日本語ラベルを入れる場合、画像生成AIは日本語が苦手なため:
  - 技術図（diagram）は **Figma / draw.io / PowerPoint 等で作成**するのを推奨。
  - 概念イラスト（concept）は生成AIで作り、必要なら後からラベルを上に重ねる。
- **トーン**: 初学者向け・やわらかい・クリーン。配色はスライドに合わせて青/緑/橙/グレー基調。
- `kind="concept"` ＝ 比喩イラスト、`kind="diagram"` ＝ 構成図（枠バッジが変わるだけ）。
- **会話アバター**（先生・Aくん・Bちゃん）は `public/characters/*.webp` を共通利用。この `list.md` には載せない。

---

## 00 はじめに — ERPとは何か、SAPとは何か

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `00-erp-overview.png` | diagram | ERPとは何か | 各部門サイロから中央ERP DBへの統合対比図 |
| `00-sap-world.png` | concept | SAPとは何か | 世界地図＋SAPのグローバルな存在感 |

**`00-erp-overview.png`**（diagram）
```
Minimal flat technical diagram, white background, 16:9. LEFT side: four
separate departmental "silos" (Sales, Factory, Accounting, HR) each with
their own small database cylinder, no connections between them — isolated
islands. RIGHT side: one large central ERP database in the middle with
all four departments connected to it by two-way arrows. A horizontal
arrow or divider separates left from right showing "before" vs "after".
Blue/grey flat vector, clean, lots of whitespace. English placeholder
labels only. Leave space for Japanese labels to be overlaid.
```

**`00-sap-world.png`**（concept）
```
Flat clean concept illustration, soft background, 16:9. A simplified world
map (flat projection) with the SAP logo or a stylized "S" floating above it.
Small icons representing manufacturing, finance, retail, healthcare, and
public sector are spread across different continents. A subtle stat label
area (e.g. "80%+ Fortune 500") in a badge. Palette: blue, grey, light teal.
No dense text. Friendly and modern.
```

---

## 01 なぜERPが必要か — データサイロと統合の価値

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `01-data-silo.png` | concept | データサイロの問題 | 孤立した部門の島々・紙が空を飛ぶ無駄な転記 |
| `01-single-source-of-truth.png` | diagram | Single Source of Truth | 中央DB＋全部門が同じデータを参照する統合図 |

**`01-data-silo.png`**（concept）
```
Flat friendly illustration, light background, 16:9. Four small islands
(representing company departments: Sales, Manufacturing, Accounting, HR)
floating separately in water or air. Each island has its own small computer
or file cabinet but NO bridges connecting them. Paper documents fly between
islands but some fall into the water, representing wasted transcription and
data loss. Warm, slightly humorous tone. Blue/grey/warm palette.
No Japanese text. Minimal labels.
```

**`01-single-source-of-truth.png`**（diagram）
```
Minimal flat technical diagram, white background, 16:9. A large central
database cylinder in the middle labeled "ERP" with a star or crown icon
(representing the "single source of truth"). Four department blocks (Sales,
Manufacturing, Accounting, HR) connected to the central DB by clean
two-way arrows. All arrows converge on the center showing unified access.
Blue, green, and grey palette, clean, lots of whitespace.
English placeholder labels only.
```

---

## 02 SAP S/4HANAとHANAデータベース — インメモリとカラム型の革新

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `02-inmemory-computing.png` | concept | インメモリコンピューティング | ディスクI/O（亀）vsRAMインメモリ処理（ロケット）の速度対比 |
| `02-column-vs-row.png` | diagram | カラム型とロー型の違い | 行指向（全行読み）vs列指向（集計列のみ読み）の比較 |

**`02-inmemory-computing.png`**（concept）
```
Flat clean concept illustration, light background, 16:9. LEFT side: a
traditional disk drive (HDD) with a long curving arrow going to a RAM
chip, a slow tortoise icon beside it. RIGHT side: data stored directly
in a RAM chip with a rocket icon, showing instant processing. A lightning
bolt divides the two sides. Labels: "Traditional DB (slow)" and "In-Memory
(fast)" in English. Blue, grey, amber palette. Friendly, beginner-level.
```

**`02-column-vs-row.png`**（diagram）
```
Minimal flat technical diagram, white background, 16:9. TWO side-by-side
data tables showing the same dataset. LEFT: "Row-oriented" — rows are
highlighted and stored together; to sum a column you read ALL rows
(large highlighted scan area shown in light red/orange). RIGHT:
"Column-oriented" — only one column is highlighted and read for the
same sum (small highlighted scan area in bright green). Blue/grey palette
with red/green highlights for contrast. English placeholder column labels.
Clean, minimal, lots of whitespace.
```

---

## 03 コアモジュールとデータ連動 — ERPの業務カバレッジ

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `03-module-overview.png` | diagram | モジュール全体図 | S/4HANAコアDB＋周囲にSD・MM・PP・FI・CO・HRモジュール |
| `03-automatic-journal.png` | diagram | 自動仕訳のメカニズム | 工場での原材料消費→SAP画面に会計伝票が自動生成される対比 |

**`03-module-overview.png`**（diagram）
```
Minimal flat technical diagram, white background, 16:9. A large central
"SAP S/4HANA Core DB" cylinder in the middle. Six module boxes arranged
in a circle around it, connected by two-way arrows: SD (Sales), MM
(Procurement/Inventory), PP (Production), FI (Finance), CO (Controlling),
HR (Human Resources). Each box has a small relevant icon (shopping cart,
factory, coins, people, etc.). Clean flat vector, blue/grey with subtle
color coding per module. English labels.
```

**`03-automatic-journal.png`**（diagram）
```
Minimal flat diagram split into two panels, white background, 16:9.
LEFT panel: a factory floor worker pulling raw materials from a warehouse
shelf (physical goods movement icon). A large arrow points RIGHT. RIGHT
panel: a simplified SAP screen showing an auto-generated accounting
document with two line items: "Debit: Material Cost" and "Credit: Raw
Material Inventory". A lightning bolt or "automatic" badge between the
two panels. Blue/grey/green palette. Clean, minimal text in English.
```

---

## 04 アーキテクチャ比較 — Best of BreedとS/4HANAによるガバナンス

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `04-best-of-breed.png` | diagram | Best of Breed vs ERP | 複数SaaSのAPI接続（複雑）vs 単一SAPボックス（シンプル）の対比 |
| `04-global-governance.png` | diagram | グローバルガバナンス | 世界地図上の本社＋子会社がS/4HANAに集約される統合図 |

**`04-best-of-breed.png`**（diagram）
```
Minimal flat comparison diagram, white background, 16:9. LEFT panel
"Best of Breed": three separate SaaS product boxes (e.g., CRM, HR, Finance)
connected by thin API arrow lines, with a question mark or tangle icon
in the middle showing complexity and potential breaks. RIGHT panel
"ERP (SAP S/4HANA)": one large unified box containing all three functions
seamlessly. A divider separates the two. Red/amber tones for the complex
left side, clean blue/green for the unified right side. English labels.
```

**`04-global-governance.png`**（diagram）
```
Minimal flat world map diagram, white background, 16:9. A simplified world
map (outline only) showing headquarters in Japan and subsidiary icons in
the US, Germany, China, and India. All are connected to a central "SAP
S/4HANA" box with clean arrows. A shared "Master Data" badge (customer,
product icons) floats above the center, indicating common data across
all locations. Blue/grey/teal palette. English labels only.
```

---

## 05 ERP導入・移行プロジェクト — Fit to StandardとGreenfield/Brownfield

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `05-fit-to-standard.png` | concept | Fit to Standardの考え方 | 業務プロセスをSAPの型に合わせる発想の転換図 |
| `05-greenfield-brownfield.png` | concept | Greenfield vs Brownfield | 更地に新築（Greenfield）vs 既存ビルの改装（Brownfield）の対比 |

**`05-fit-to-standard.png`**（concept）
```
Flat vector concept illustration, light background, 16:9. TWO scenarios
side by side. LEFT (marked with a warning icon): an irregular, jagged
"business process" shape trying to force a clean rectangular "SAP system"
box to deform — many arrows and adapters, messy, labeled "add-on heavy".
RIGHT (marked with a checkmark): the same business process shape being
gently reshaped / simplified to match the clean rectangular SAP standard
— smooth, labeled "Fit to Standard". Blue/grey/amber palette. Minimal
English text.
```

**`05-greenfield-brownfield.png`**（concept）
```
Flat clean concept illustration, light background, 16:9. TWO construction
scenes side by side. LEFT "Greenfield": an empty lot with a fresh new
building (SAP S/4HANA) being constructed from scratch, with a shovel and
blueprint. RIGHT "Brownfield": an existing older building (SAP R/3 era)
being renovated from the inside — scaffolding inside, workers with
conversion tools, same outer shell but upgraded interior. Clear labels
"New build" and "Renovation". Blue/grey/amber palette. Friendly tone.
```

---

## 06 Clean CoreとSAP BTP — モダン拡張アーキテクチャ

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `06-clean-core-concept.png` | concept | クリーンコアの概念 | S/4HANAコアに直接触れず、外部BTPでAPI拡張する構造 |
| `06-btp-architecture.png` | diagram | BTPアーキテクチャ3層 | S/4HANAコア＋API接続層＋BTP拡張層の3層構造図 |

**`06-clean-core-concept.png`**（concept）
```
Flat clean concept illustration, light background, 16:9. In the center: a
crystal-clear glass "clean room" or protected core labeled "SAP S/4HANA
Core" with a "do not touch" or "protected" icon (X badge on direct
modifications). Outside the glass: a separate "BTP Extension" box connected
to the core via a thin clean "API" pipe/connector (checkmark on extensions).
The metaphor is "touch the outside, not the core". Blue/teal/grey palette.
Minimal English labels.
```

**`06-btp-architecture.png`**（diagram）
```
Minimal flat three-layer architecture diagram, white background, 16:9.
BOTTOM layer: "SAP S/4HANA Core" (on-premise or cloud box, database icon).
MIDDLE layer: "API / OData" connection layer (thin arrows going both ways).
TOP layer: "SAP BTP Cloud Platform" containing extension apps, Fiori app
icons, and a data pipeline icon. Clean two-way arrows connecting each layer.
Blue/grey palette, structured, lots of whitespace. English labels only.
```

---

## 07 SAP FioriとEmbedded Analytics — UIの進化とリアルタイム分析

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `07-fiori-ui.png` | diagram | SAP GUI vs SAP Fiori | 左：旧来の複雑なGUI画面。右：Fioriのモダンなタイルダッシュボード対比 |
| `07-embedded-analytics.png` | diagram | Embedded Analytics vs 従来分析フロー | 左：多段階バッチフロー（時間ラグ）。右：ERP内リアルタイム分析（即時） |

**`07-fiori-ui.png`**（diagram）
```
Minimal flat side-by-side UI comparison diagram, white background, 16:9.
LEFT side "SAP GUI (old)": a desktop window with dense rows of small text,
many tabs, tiny font, complex input form — visually overwhelming.
RIGHT side "SAP Fiori (new)": a clean Launchpad with colorful tile cards
(representing apps), a simple header bar, large readable text, and a small
phone/tablet silhouette showing responsiveness. A divider between left and
right. Grey/muted tones for the old UI; clean blue/white/green for Fiori.
English labels only.
```

**`07-embedded-analytics.png`**（diagram）
```
Minimal flat comparison diagram, white background, 16:9. LEFT side
"Traditional Analytics": a horizontal pipeline with boxes: ERP → Batch
Extract → DWH → BI Tool → Report. Small clock icons between each step
showing time delays. Muted/grey tones. RIGHT side "Embedded Analytics":
ERP box (with HANA lightning bolt inside) directly outputting a bar chart
and dashboard → Fiori screen. A lightning bolt or "instant" badge. Bright
blue/green tones for the right side. English labels only. Clear visual
contrast in speed.
```

---

## 50 IT用語集 — ERPを理解するためのIT基礎

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `50-api-concept.png` | concept | APIとは | レストランのウェイター（API）がお客（クライアント）とキッチン（サーバー）を仲介する図 |
| `50-cloud-layers.png` | diagram | クラウドの3層 | IaaS（最下層）→PaaS（中間）→SaaS（最上層）の積み木タワー図 |

**`50-api-concept.png`**（concept）
```
Flat friendly concept illustration of a restaurant scene, light background,
16:9. LEFT: a customer (representing a "client system") sits at a table
and passes a small order slip to a waiter. CENTER: the waiter (representing
"API") stands between the customer and the kitchen, holding the order.
RIGHT: a kitchen (representing a "server system") receives the order and
sends back a plate of food (the "response") via the waiter. Arrows labeled
"Request" (customer to waiter) and "Response" (waiter back to customer).
Warm, friendly tone. Blue/amber/green palette. English labels only.
```

**`50-cloud-layers.png`**（diagram）
```
Minimal flat three-layer tower diagram, white background, 16:9. A stacked
block tower with three sections from bottom to top:
BOTTOM layer (IaaS): server rack, network switch, storage disk icons.
MIDDLE layer (PaaS): OS gears, middleware, development environment icons
(code brackets).
TOP layer (SaaS): browser icon, email app icon, ERP/business app icon.
Each layer labeled clearly. A dotted line showing the boundary between
"cloud provider manages" and "user manages" — shifting up from IaaS to
SaaS. Blue/grey/green palette. Clean, educational, minimal. English labels.
```

---

## 51 クラウド基礎 — クラウドとオンプレミスのエンタープライズ比較

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `51-cloud-vs-onpremise.png` | concept | オンプレミス vs クラウド | 左：自社ビル地下のサーバーラック（所有）。右：クラウドプロバイダーのDCへの接続（利用） |
| `51-saas-paas-iaas.png` | diagram | ビルの3フロア構造でIaaS/PaaS/SaaSを理解 | 地下IaaS→1階PaaS→2階SaaSの区分マーク付き3フロア構造図 |

**`51-cloud-vs-onpremise.png`**（concept）
```
Flat clean concept illustration, light background, 16:9. TWO scenes side
by side. LEFT "On-Premise": a company building cross-section showing a
basement server room with physical server racks; an IT person with tools
is managing them. Label: "Own & Operate". RIGHT "Cloud": a simple office
building with a person working at a laptop; an internet cloud icon
(wi-fi/cloud symbol) connects via a dotted line to a remote data center
building labeled "Cloud Provider". Label: "Use & Pay". Blue/grey palette
for left; teal/green for right. Minimal English text.
```

**`51-saas-paas-iaas.png`**（diagram）
```
Minimal flat three-floor building cross-section diagram, white background,
16:9. The building shows three floors:
BASEMENT (IaaS): physical server racks, network cables, storage icon.
GROUND FLOOR (PaaS): OS gear icon, database cylinder, development
environment icon (code brackets).
UPPER FLOOR (SaaS): application icons (email, accounting, ERP logo),
business user icon.
Each floor has a bracket on the right showing "Cloud provides" vs "User
manages" division — the cloud-managed portion grows from basement to top.
A small SAP S/4HANA Cloud badge on the top floor. Blue/grey/green palette.
English labels only. Clean and structured.
```

---

## 52 補足③ — 主要外部SaaSツール解説

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `52-saas-ecosystem.png` | diagram | SAP S/4HANAと外部SaaSの関係まとめ | 競合・補完・統合ツールの3カテゴリでSaaSを分類した関係図 |

**`52-saas-ecosystem.png`**（diagram — Figma/draw.io推奨）
```
Ecosystem map diagram, white background, 16:9.
CENTER: large rounded rectangle labeled "SAP S/4HANA" with an ERP icon.
LEFT zone (light red background, label "Compete / Overlap"): three boxes —
  Workday (HR/Finance), NetSuite (Mid-market ERP), Oracle ERP Cloud.
  Each box has a small icon placeholder and product name.
RIGHT zone (light green background, label "Complement / Co-exist"): four boxes —
  Salesforce (CRM), ServiceNow (ITSM), Tableau (BI), Power BI (BI).
BOTTOM zone (light blue background, label "Integration Middleware"): two
  connector-shaped hexagons — MuleSoft, SAP Integration Suite.
Arrows between center and each zone showing relationship direction.
Clean corporate whiteboard style. English labels only.
```

---

## 53 補足④ — データベースとBI/分析ツール

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `53-bi-tools.png` | diagram | Tableau・Power BI・SACの3製品比較 | 3つのBIツールの特徴を並べた比較カードレイアウト |

**`53-bi-tools.png`**（diagram — Figma/draw.io推奨）
```
3-column product comparison card layout, 16:9, white background.
CARD 1 (Tableau — orange accent border): Bar chart icon at top. Key facts listed:
  - Owner: Salesforce
  - Strength: Best-in-class visualization & flexibility
  - Licensing: Premium (per-user)
  - A small sample colorful dashboard mockup (rectangles/charts as placeholder)
CARD 2 (Power BI — yellow/Microsoft blue accent): Dashboard icon at top:
  - Owner: Microsoft
  - Strength: M365 integration, low cost
  - Licensing: Included in M365 / affordable standalone
  - A small clean BI dashboard mockup
CARD 3 (SAP Analytics Cloud — blue SAP accent): SAP icon at top:
  - Owner: SAP
  - Strength: Native direct connection to SAP S/4HANA
  - Licensing: SAP subscription
  - A small SAP-styled KPI tile mockup
All three cards are the same size, clean typography, minimal icons.
English labels only. Figma recommended for clean layout.
```
