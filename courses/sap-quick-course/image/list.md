# 画像リスト（SAP 構造とサービス紹介）

このフォルダ（`courses/sap-products-services/image/`）に、下記のファイル名で画像を置くと、各レッスンの該当スライドに自動で表示されます。
画像が無い間は、スライド上に「準備中」のプレースホルダ（ファイル名＋説明）が出ます。

## 使い方・ルール

- **置き場所**: `courses/sap-products-services/image/<ファイル名>`
- **参照**: スライド側は `<Figure src="image/<ファイル名>" … />`（埋め込み済み・編集不要）
- **形式**: WebP 推奨（PNG 原本があれば `originals/` に置けばデプロイ対象外）。横長 16:9〜4:3、長辺 1600px 程度。
- **文字**: 図中に日本語ラベルを入れる場合、画像生成AIは日本語が苦手なため、
  - 技術図（diagram）は **Figma / draw.io / PowerPoint 等で作成**するのを推奨。
  - 概念イラスト（concept）は生成AIで作り、必要ならラベルを後から重ねる。
- **トーン**: 初学者向け・やわらかい・クリーン。青／緑／橙／グレー基調。
- `kind="concept"`＝比喩イラスト、`kind="diagram"`＝構成図（枠バッジが変わるだけ）。
- 会話キャラクター（先生／Aくん／Bちゃん）の立ち絵は全コース共通で `public/characters/` を参照（このフォルダではない）。

---

## 00 SAP ERP とは


| ファイル名                         | 種別      | 使用スライド | 内容（alt）                   |
| ----------------------------- | ------- | ------ | ------------------------- |
| `00-integrated-platform.webp` | concept | 概要     | バラバラの業務システムが1つの基盤に統合される様子 |


`**00-integrated-platform.webp`**（concept）

```
Flat, clean vector illustration, light background, beginner-friendly. LEFT: several
separate disconnected boxes labelled like "accounting", "sales", "purchasing",
"HR" floating apart (siloed legacy systems). RIGHT: the same functions plugged
into ONE unified platform/hub, connected by clean lines, with a small "DX / cloud"
sparkle above. Conveys "SAP ERP = one integrated platform that connects business
areas". Blue and teal palette, soft shadows, no Japanese text. 16:9.
```

---

## 01 コース全体像


| ファイル名                | 種別      | 使用スライド | 内容（alt）                            |
| -------------------- | ------- | ------ | ---------------------------------- |
| `01-course-map.webp` | concept | 学習の流れ  | 三層→モジュール→クラウド→標準化→拡張→E2E→復習の道のりマップ |


`**01-course-map.webp**`（concept）

```
Flat vector "route map" illustration, left to right, light background. A friendly
winding path with labelled milestone pins in order: "3 layers" → "S/4 modules" →
"cloud products" → "Fit to Standard" → "extensions / BTP" → "end-to-end" →
"review". Small map/compass motif. Conveys a learning journey. Blue/green palette,
minimal English placeholder text. 16:9.
```

---

## 02 三層構造


| ファイル名                  | 種別      | 使用スライド | 内容（alt）                                      |
| ---------------------- | ------- | ------ | -------------------------------------------- |
| `02-three-layers.webp` | diagram | 全体図    | 業務層(モジュール)／データ層(HANA)／システム層(Fiori→S/4→DB)の3段 |


`**02-three-layers.webp**`（diagram）

```
Minimal flat technical diagram, white background, three stacked horizontal layers
with thin rounded borders. TOP layer "Business (modules: FI, CO, SD, MM, PP)".
MIDDLE layer "Data (SAP HANA — one integrated database)". BOTTOM/SIDE "System
(Fiori UI → S/4HANA app → HANA DB)". Arrows showing business results flowing down
into HANA, and Fiori→S/4→DB on the system side. Blue/grey palette, lots of
whitespace, minimal English labels. 16:9.
```

---

## 03 S/4HANA とモジュール


| ファイル名                | 種別      | 使用スライド  | 内容（alt）                                     |
| -------------------- | ------- | ------- | ------------------------------------------- |
| `03-module-map.webp` | concept | モジュール一覧 | S/4HANAコアを中心に、FI/CO/SD/MM/PPなどの部屋が並ぶ建物のイメージ |


`**03-module-map.webp**`（concept）

```
Flat vector illustration, light background. A single building (or hub) labelled
"S/4HANA" at the center, surrounded by clearly separated rooms/tiles each
representing a module: FI (finance), CO (controlling), SD (sales), MM (purchasing),
PP (production), QM, EWM. Each tile has a simple icon. Conveys "one ERP core,
many business modules". Friendly, blue/teal palette, minimal English labels. 16:9.
```

---

## 04 クラウド製品


| ファイル名                     | 種別      | 使用スライド   | 内容（alt）                                                |
| ------------------------- | ------- | -------- | ------------------------------------------------------ |
| `04-cloud-landscape.webp` | diagram | SaaSとBTP | S/4コア＋SaaS(Ariba/Concur/SF)＋BTP＋SACがCloud Connectorで接続 |


`**04-cloud-landscape.webp**`（diagram）

```
Minimal flat landscape diagram, white background. CENTER: "S/4HANA core (private
cloud)". A "Cloud Connector" gateway on its edge connects via a secure tunnel to a
PUBLIC side containing: SaaS apps (Ariba, Concur, SuccessFactors), "BTP" platform,
and "SAP Analytics Cloud". Clean lines, padlock icon on the tunnel. Blue/grey/teal
palette, minimal English labels, plenty of whitespace. 16:9.
```

---

## 05 標準化（Fit to Standard）


| ファイル名                     | 種別      | 使用スライド | 内容（alt）                          |
| ------------------------- | ------- | ------ | -------------------------------- |
| `05-fit-to-standard.webp` | concept | コンセプト  | 既製スーツ(標準)に体を合わせる vs 全身オーダーメイドの対比 |


`**05-fit-to-standard.webp**`（concept）

```
Flat vector before/after illustration, light background. LEFT: a person getting a
fully custom, expensive tailor-made suit with lots of pins and effort (labelled
"custom everything — costly, hard to update"). RIGHT: a person happily wearing a
well-fitting ready-made standard suit with only tiny adjustments (labelled "fit to
standard — fast, easy to update"). Conveys "adapt the business to the standard
process". Friendly, blue/amber accents, minimal English text. 16:9.
```

---

## 06 差別化と拡張（Clean Core）


| ファイル名                | 種別      | 使用スライド | 内容（alt）                                       |
| -------------------- | ------- | ------ | --------------------------------------------- |
| `06-clean-core.webp` | diagram | 拡張の2種類 | 標準のまま保つコアの周りに In-App 拡張と Side-by-Side(BTP) 拡張 |


`**06-clean-core.webp**`（diagram）

```
Minimal flat diagram, white background. CENTER: a clean, untouched core labelled
"S/4HANA (Clean Core — kept standard)" drawn as a tidy sealed box. Around it, two
extension zones: "In-App" attached close to the core (small icons: UI tweak, extra
field, custom report) and "Side-by-Side (BTP)" sitting outside, connected by a
line (icons: API integration, AI, custom app, RPA). Conveys "keep the core clean,
extend around it". Blue/green palette, minimal English labels. 16:9.
```

---

## 07 エンドツーエンド


| ファイル名                | 種別      | 使用スライド | 内容（alt）                                 |
| -------------------- | ------- | ------ | --------------------------------------- |
| `07-end-to-end.webp` | diagram | 4段階    | フロント(顧客/サプライヤ)→S/4コア→BTP拡張→外部SaaSの一本の流れ |


`**07-end-to-end.webp**`（diagram）

```
Minimal flat left-to-right pipeline diagram, white background, four connected
stages with arrows: 1) "Front" (customers / suppliers icons), 2) "ERP core —
S/4HANA" (gears / business processing), 3) "Extension — BTP" (AI / integration),
4) "External SaaS" (Ariba, Concur, SuccessFactors). One clean horizontal flow.
Blue/teal palette, minimal English labels, generous whitespace. 16:9.
```

---

## 08 総仕上げ


| ファイル名                 | 種別      | 使用スライド | 内容（alt）                                  |
| --------------------- | ------- | ------ | ---------------------------------------- |
| `08-big-picture.webp` | concept | 一枚絵    | 戦略(標準化/Clean Core/クラウド)＋三層＋E2Eを1枚にまとめた地図 |


`**08-big-picture.webp**`（concept）

```
Flat vector "one-page summary map" illustration, light background. Three grouped
zones combined into a single tidy poster: (a) "Strategy" (Fit to Standard, Clean
Core + extensions, RISE/GROW cloud), (b) "Three layers" (Business / Data-HANA /
System-Fiori-S4-DB), (c) "End-to-end" (Front → S/4 core → BTP → SaaS). Connected
with light arrows into a coherent whole. Friendly, blue/green/teal palette,
minimal English labels. 16:9.
```

