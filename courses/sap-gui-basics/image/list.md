# 画像リスト（SAP GUI 基礎）

このフォルダ（`courses/sap-gui-basics/image/`）に、下記のファイル名で画像を置くと、各レッスンの該当スライドに自動で表示されます。
画像が無い間は、スライド上に「準備中」のプレースホルダ（ファイル名＋説明）が出ます。

## 使い方・ルール

- **原画（保持用）**: `courses/sap-gui-basics/image/originals/<ファイル名>.png` — リポジトリに残す。サイトには出さない。
- **配信用**: `courses/sap-gui-basics/image/<ファイル名>.webp` — `pnpm run optimize:images` で原画から生成。
- **参照**: スライドは `<Figure src="image/<ファイル名>.webp" … />`（拡張子 `.webp`）
- **推奨形式（原画）**: PNG（透過可）/ 横長 16:9〜4:3。SVG も可。
- **文字**: 図中に日本語ラベルを入れる場合、画像生成AIは日本語が苦手なため、
  - 技術図（diagram）は **Figma / draw.io / PowerPoint 等で作成**するのを推奨。
  - 概念イラスト（concept）は生成AIで作り、必要なら後からラベルを上に重ねる。
- **トーン**: 初学者向け・やわらかい・クリーン。配色はスライドに合わせて青/緑/橙/グレー基調。
- `kind="concept"`＝比喩イラスト、`kind="diagram"`＝構成図（枠バッジが変わるだけ）。

---

## 共通キャラクター（全レッスン共通・実装済み）

会話（`<Dialog>`）のアバターに使う3人の立ち絵です。
**原画**: `assets/characters/originals/*.png` → **`pnpm run optimize:images`** → `public/characters/*.webp`（配信）。
未配置の間は丸アバター（先／理／文）にフォールバックします。

| 原画（originals） | 配信（public/characters） | 役割 | 配色 | 性格 |
| --- | --- | --- | --- | --- |
| `teacher.png` | `teacher.webp` | 先生 | 青 | 落ち着いた・やさしい講師 |
| `student-a.png` | `student-a.webp` | Aくん | 緑 | 理系・理屈で納得するタイプ |
| `student-b.png` | `student-b.webp` | Bちゃん | 橙 | 文系・PCは苦手・比喩が刺さるタイプ |

- **形式**: 正方形・透過PNG・**円形トリミング前提のバストアップ**・512×512px 程度。
- **重要（統一感）**: 3枚は**同じ絵柄・同じ画風・同じ画角・同じ光**で。下のプロンプトの先頭ブロックを3枚で共通にしてください。

共通スタイル（3枚に必ず付ける）:
```
Clean, friendly flat anime-style corporate character portrait, bust-up,
centered face, simple solid pastel background (will be cropped to a circle),
soft lighting, consistent art style across the set, modern Japanese business
training material look, high quality, no text, no logo.
```

**`teacher.png`**（先生）
```
<共通スタイル> + A calm, kind teacher/mentor in their 30s-40s, business-casual
shirt or light jacket, gentle smile, slim glasses, slight blue accent in
clothing. Reassuring, approachable expression.
```

**`student-a.png`**（Aくん）
```
<共通スタイル> + A young male new-graduate employee, early 20s, neat short hair,
smart-casual shirt, curious and analytical expression (the "logical" type),
green accent in clothing. Looks like he is thinking / nodding in understanding.
```

**`student-b.png`**（Bちゃん）
```
<共通スタイル> + A young female new-graduate employee, early 20s, friendly and a
little unsure expression (not confident with computers, the "humanities" type),
warm orange/amber accent in clothing. Approachable, relatable smile.
```

---

## 00 SAP GUI とは

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `00-gui-why-first.png` | concept | なぜ先に GUI を学ぶのか | 開発者・業務担当者・初心者の3人が同じ SAP GUI 画面の前に立っており、GUI スキルが ABAP 研修・業務トレーニング両方への共通入り口になる構造 |

**`00-gui-why-first.png`**（concept）
```
Flat, clean vector illustration, light background, beginner-friendly corporate
training material. Three different characters (a developer, a business user,
a new-hire) all stand in front of the same SAP GUI screen with the same
interface. A large arrow labelled "common starting point" points to the screen.
Below, two paths branch off: "ABAP development training" and "business
operations training". Conveys "everyone begins here". Blue/green/amber palette,
friendly, no text. 16:9.
```

---

## 01 コース全体像

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `01-roadmap.png` | concept | ロードマップを図で見る | SAP GUI 基礎コースの7章が積み上がるピラミッド型ロードマップ。土台が操作基礎（ログイン・画面構造）、頂点が実務活用 |

**`01-roadmap.png`**（concept）
```
Flat vector "staircase / pyramid" roadmap illustration, left to right and
upward, light background. Seven steps from bottom to top: (1) Login,
(2) Screen layout, (3) Transactions, (4) Navigation, (5) Input & Help,
(6) Shortcuts, (7) Tips & Practice. Each step shows a small icon. The base
is labelled "foundation" and the top "practical use". Friendly, modern,
blue/green palette, minimal English labels. 16:9.
```

---

## 02 ログインと接続

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `02-client-rooms.png` | concept | クライアントとは | マンション断面図。建物全体＝SAP サーバー、各部屋＝クライアント（100・200・300）。同じ建物でも部屋が違えばデータが完全に分離 |

**`02-client-rooms.png`**（concept）
```
Flat vector cross-section illustration of an apartment building, light
background, beginner-friendly. The whole building is labelled "SAP Server".
Three apartments (rooms) are visible: room 100 "Production data", room 200
"Development/Test data", room 300 "QA data". Each room has its own filing
cabinet inside, clearly separated — contents cannot mix. Conveys "same
server, different data environments". Blue/grey palette, soft pastel walls,
no Japanese text. 16:9.
```

---

## 03 画面の見方

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `03-screen-map.png` | diagram | 画面構成の全体像 | SAP GUI 画面の全体構成図。上からタイトルバー・メニューバー・標準ツールバー・コマンド欄・アプリケーションツールバー・作業領域・ステータスバーが色分けされてアノテーション付きで示されている |

**`03-screen-map.png`**（diagram）
```
Minimal flat UI wireframe diagram, white/light background. A desktop application
window divided into horizontal zones from top to bottom, each zone a different
soft colour with a label and bracket: (1) Title Bar, (2) Menu Bar, (3) Standard
Toolbar with icon buttons, (4) Command Field (a narrow input box), (5)
Application Toolbar, (6) Work Area (the large main content zone), (7) Status Bar
at the bottom. Clean lines, flat vector, blue/grey palette, plenty of whitespace.
Recommended Figma or draw.io rather than AI generation for accuracy. 4:3.
```

---

## 04 トランザクション

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `04-tcode-address.png` | concept | トランザクション＝画面の住所 | 電話の内線番号帳。左に T-code リスト（SE38・SE16N・SM37 など）、右に各画面のミニチュア。コードと画面が1対1で対応 |

**`04-tcode-address.png`**（concept）
```
Flat vector illustration, light background. An old-fashioned phone directory /
speed-dial card on the left with extension numbers and short names (SE38, SE16N,
SM37 etc. as placeholder labels). On the right, three small screen thumbnails
representing "ABAP editor", "table viewer", "job list". Lines connect each
extension number to its matching screen. Conveys "a T-code is a direct dial to
a screen". Blue/grey palette, clean, friendly, minimal text. 16:9.
```

---

## 05 画面の移動

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `05-sessions.png` | concept | セッションとは | デスクトップ上に3つの SAP GUI ウィンドウが重なって並んでいる。セッション1＝SE38 開発、セッション2＝SE16N データ確認、セッション3＝業務照会。ブラウザの複数タブに相当 |

**`05-sessions.png`**（concept）
```
Flat vector illustration, light background. A computer desktop showing three
SAP GUI windows slightly offset / stacked like tabs. Each window has a small
label: window 1 "Development (SE38)", window 2 "Data check (SE16N)", window 3
"Business inquiry". An analogy label or arrow hints "like browser tabs". Friendly,
modern, blue/grey/green palette, minimal text. 16:9.
```

---

## 06 入力とヘルプ

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `06-f4-help.png` | diagram | F4 検索ヘルプ | SAP GUI の入力フォームで F4 を押した結果、画面中央にポップアップが開いている。ポップアップには会社コードと会社名の一覧。行を選ぶとフォームの入力欄に値が入る流れを矢印で示す |

**`06-f4-help.png`**（diagram）
```
Minimal flat UI wireframe diagram, white background. An input form with a field
"Company Code" (empty). In the centre, a popup/modal window appears showing a
two-column table: "Code" and "Company Name" with a few rows. One row is
highlighted. A curved arrow leads from the highlighted row back to the "Company
Code" field now filled in. Conveys "F4 = open a value list, pick one, it fills
the field". Clean flat vector, blue/grey palette. Recommended Figma or draw.io.
4:3.
```

---

## 07 ショートカット集

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `07-top5-keys.png` | diagram | まず覚える5つ | キーボードのイラスト。F1・F3・F4・F8・Enter の5キーのみ大きく強調（色付き）、残りはグレーアウト。各キーの下に「Help」「Back」「Search」「Execute」「Confirm」とラベル |

**`07-top5-keys.png`**（diagram）
```
Flat vector keyboard illustration, light background. A standard keyboard where
only five keys are highlighted in a bright accent colour and slightly enlarged:
F1 (labelled "Help"), F3 (labelled "Back"), F4 (labelled "Search"), F8
(labelled "Execute"), Enter (labelled "Confirm"). All other keys are greyed out.
Clean, modern, blue accent for the five keys, grey for the rest. No Japanese
text. 16:9.
```

---

## 08 実務のコツ

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `08-safety-habits.png` | concept | 安全に作業する習慣 | チェックリスト形式の安全確認図。「接続先とクライアントを確認」「本番で試し実行しない」「離席時はログオフ」の3項目にミニイラスト |

**`08-safety-habits.png`**（concept）
```
Flat vector checklist illustration, light background, friendly corporate style.
Three rows, each with a green checkmark icon on the left and a small illustration
on the right: (1) a person pointing at a screen and confirming the environment
label "Check connection & client", (2) a "no" symbol over a "Run" button on a
production environment "No test-run on production", (3) a hand clicking a
"Log off" button as the person walks away from the desk "Log off when leaving".
Blue/green palette, clean, minimal English labels. 16:9.
```
