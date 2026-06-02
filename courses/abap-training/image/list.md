# 画像リスト（ABAP研修）

このフォルダ（`courses/abap-training/image/`）に、下記のファイル名で画像を置くと、各レッスンの該当スライドに自動で表示されます。
画像が無い間は、スライド上に「準備中」のプレースホルダ（ファイル名＋説明）が出ます。

## 使い方・ルール

- **原画（保持用）**: `courses/abap-training/image/originals/<ファイル名>.png` — リポジトリに残す。サイトには出さない。
- **配信用**: `courses/abap-training/image/<ファイル名>.webp` — `pnpm run optimize:images` で原画から生成。
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

## 00 なぜABAPを学ぶのか

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `00-house-reform.png` | concept | 完成品でも手直し | 完成した家（標準SAP）に棚を足す等のリフォーム＝追加開発 |
| `00-sap-gap.png` | diagram | 標準と自社のすき間 | 標準SAPの円＋外側の“すき間”をアドオンで埋める |

**`00-house-reform.png`**（concept）
```
Flat, clean vector illustration, light background, beginner-friendly. A nice,
already-built house (represents the standard SAP package) on the left. On the
right, the same house being lightly remodeled to fit its residents: adding a
shelf, changing a doorway. Friendly tone, soft palette (blue/grey/warm wood).
Shows "complete product, but still customized". No text. 16:9.
```

**`00-sap-gap.png`**（diagram）
```
Minimal flat technical diagram, white background. A large circle labelled as the
coverage of "standard SAP" filling most of the area. Around its edge, a few small
puzzle-piece-shaped gaps representing company-specific needs. Matching puzzle
pieces (labelled "add-on") drop into those gaps to fill them. Blue/grey palette,
clean, lots of whitespace, minimal/English placeholder text. 16:9.
```

---

## 01 研修全体マップ

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `01-roadmap.png` | concept | 研修マップ | 3区間の道のり：前半(照会)→後半(登録)→仕上げ(適切な書き方) |
| `01-inquiry-vs-posting.png` | diagram | 照会と登録 | 照会＝読むだけ／登録＝書き込む の対比 |

**`01-roadmap.png`**（concept）
```
Flat vector "journey map" illustration, left to right, light background. A gently
rising path divided into three stages with simple milestone markers: Stage 1
"read / inquiry" (a magnifying glass over a ledger), Stage 2 "write / posting" (a
pen writing into a ledger), Stage 3 "polish / good programming" (a gear with a
sparkle). Friendly, beginner-friendly, blue/green palette. Minimal text. 16:9.
```

**`01-inquiry-vs-posting.png`**（diagram）
```
Two-panel flat diagram, white background, divided by a center line. LEFT panel
"inquiry": a person looking at a ledger through a magnifying glass; data is
unchanged (a small "read-only" eye icon). RIGHT panel "posting": a person writing
a new row into the ledger with a pen; a small "saved/record" icon. Clean flat
vector, blue (left) and amber (right) accents, minimal text. 16:9.
```

---

## 02 仕訳日記帳と会計伝票

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `02-household-book.png` | concept | 家計簿のたとえ | 家計簿のノート（日付・項目・金額）＝会社の会計台帳 |
| `02-header-detail.png` | diagram | ヘッダと明細 | 伝票1枚＝ヘッダ1ブロック＋明細の複数行 |

**`02-household-book.png`**（concept）
```
Flat vector illustration, light background, beginner-friendly. An open household
account notebook with simple rows of "date / item / amount". Next to it, a larger
company ledger book with the same row structure, showing they are the same idea
at different scale. Warm, friendly palette. Minimal/English placeholder text. 16:9.
```

**`02-header-detail.png`**（diagram）
```
Minimal flat diagram of a single accounting document (voucher), white background.
TOP: one "header" block containing date / company / document number. BELOW it:
several "line item" rows, each with account and amount. A bracket shows "1 header,
many line items". Clean flat vector, blue/grey palette, lots of whitespace,
minimal text. 4:3.
```

---

## 03 はじめてのレポートプログラム

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `03-variable-box.png` | concept | 変数 | ラベル(lv_name)を貼った箱、中身が入れ替わる＝変数 |
| `03-var-vs-const.png` | diagram | 定数 | 開く箱(変数)と鍵付きの箱(定数)の対比 |

**`03-variable-box.png`**（concept）
```
Flat vector illustration, light background, beginner-friendly. A box / tupperware
container with a label reading "lv_name". An arrow shows its contents being
swapped from one name card to another, while the labelled container stays the
same. Conveys "a variable = a named box whose contents can change". Soft palette,
minimal text. 16:9.
```

**`03-var-vs-const.png`**（diagram）
```
Minimal flat diagram, white background, two boxes side by side. LEFT box: open
lid, contents being swapped (labelled "variable / DATA"). RIGHT box: closed lid
with a small padlock, contents fixed (labelled "constant / CONSTANTS"). Clean flat
vector, blue/grey palette, minimal/English placeholder text. 16:9.
```

---

## 04 入力を受け取る

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `04-search-form.png` | concept | 検索フォームのたとえ | 通販風の検索フォーム＝プログラムの入口 |
| `04-param-vs-selopt.png` | diagram | SELECT-OPTIONS（範囲） | 単一欄(PARAMETERS) vs From/To欄(SELECT-OPTIONS) |

**`04-search-form.png`**（concept）
```
Flat vector illustration of an online-shop-style search form, light background.
Shows a single input field "company code", a range input "date From – To", and a
"Search" button. Friendly, clean, conveys "the entry point of a program is a
search form". Blue/grey palette, minimal/English placeholder text. 16:9.
```

**`04-param-vs-selopt.png`**（diagram）
```
Minimal flat comparison diagram, white background. LEFT: a single input field with
a single point marked on a small number line (labelled "PARAMETERS / one value").
RIGHT: two input fields "From" and "To" with a highlighted interval on a number
line (labelled "SELECT-OPTIONS / range"). Point vs interval contrast. Clean flat
vector, blue/amber accents, minimal text. 16:9.
```

---

## 05 データを扱う基本（pilot・実装済み）

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `05-shelf-desk.png` | concept | たとえ：棚と机 | 棚（内部テーブル＝複数行）から机（作業領域＝1行）へ1枚取り出す |
| `05-structure-vs-table.png` | diagram | 1行と複数行 | 構造（1行）と内部テーブル（同形の行が複数）の対比 |
| `05-loop-flow.png` | diagram | 1件ずつ：LOOP | 棚の行を上から順に机へ出して1行ずつ処理 |
| `05-table-vs-db.png` | concept | DBとの違い | DB＝永続の倉庫／内部テーブル＝一時の作業台 |

### 生成プロンプト

**`05-shelf-desk.png`** （concept）
```
Flat, clean vector illustration for a beginner programming lesson, soft rounded
shapes, light background. LEFT: a tidy office shelf filled with many identical
paper documents standing in rows (represents a database table with many rows).
RIGHT: a wooden desk with ONE single sheet of paper taken out and laid open on
it (represents the current working row). A friendly curved arrow goes from the
shelf to the desk showing one sheet being moved. Palette: blue, soft grey,
warm wood tone. No text. 16:9.
```

**`05-structure-vs-table.png`** （diagram）
```
Minimal technical diagram, flat vector, white background, thin rounded borders.
LEFT: a single horizontal record card divided into a few columns (label it as a
single row / structure). RIGHT: the SAME column layout stacked as multiple rows
forming a small table. Dotted guide lines showing the columns line up between the
two. Blue and grey palette, clean and modern, plenty of whitespace. Leave room
for Japanese labels to be added later (keep text minimal/English placeholder).
4:3.
```

**`05-loop-flow.png`** （diagram）
```
Three-step flat diagram (like a comic strip, left to right) for a programming
loop. A shelf/stack of rows numbered 1,2,3 on the left. In each step, the next
row is highlighted and an arrow moves it to a small desk on the right where a
gear/processing icon acts on it. Shows iteration: row1 -> process, row2 ->
process, row3 -> process. Clean flat vector, blue/green accents, white
background, minimal text. 16:9.
```

**`05-table-vs-db.png`** （concept）
```
Flat vector concept illustration, light background. LEFT: a sturdy, large
warehouse with shelves and a database-cylinder icon (permanent storage,
"warehouse"). RIGHT: a temporary work desk with a loose stack of papers spread
out (temporary working table). An icon showing the desk being cleared while the
warehouse stays unchanged. Friendly, beginner-friendly, blue and grey palette,
soft shadows. No Japanese text. 16:9.
```

---

## 06 データベースから取得する

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `06-warehouse-pick.png` | concept | 倉庫のたとえ | 倉庫番が条件に合う箱だけピックして運ぶ |
| `06-bkpf-bseg.png` | diagram | 会計の主な表 | BKPF(ヘッダ)とBSEG(明細)が伝票番号で連結、T001/T003Tは辞書 |

**`06-warehouse-pick.png`**（concept）
```
Flat vector illustration, light background. A large warehouse full of shelves of
identical boxes. A warehouse worker reads a small note (a "WHERE condition") and
picks only the matching boxes onto a cart, leaving the rest. Conveys "SELECT =
ask for only the boxes that match the condition". Friendly, blue/grey palette,
minimal text. 16:9.
```

**`06-bkpf-bseg.png`**（diagram）
```
Minimal flat database relationship diagram, white background. A "BKPF (header)"
table with one row per document on top, linked by a "document number" key to a
"BSEG (line items)" table below that has several rows per document. To the side,
two small lookup tables "T001 (company master)" and "T003T (document type text)"
shown as dictionaries. Clean flat vector, blue/grey palette, minimal text. 16:9.
```

---

## 07 出力をつくる

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `07-messy-vs-clean.png` | concept | 見にくい議事録のたとえ | 詰まった一覧 vs 整った帳票の before/after |
| `07-aligned-columns.png` | diagram | 出力のコード例 | WRITEの桁位置(20/40)で列がそろう様子 |

**`07-messy-vs-clean.png`**（concept）
```
Flat vector before/after comparison, light background. LEFT: a cramped list of
numbers and text with no headers, no separators, hard to read ("before"). RIGHT:
the same data organized with a title, a separator line, blank spacing, and aligned
columns ("after"). Conveys "same data, formatting makes it usable". Blue/grey
palette, minimal text. 16:9.
```

**`07-aligned-columns.png`**（diagram）
```
Minimal flat diagram showing column alignment by character position. A ruler /
column scale across the top marking positions 1, 20, 40. A header row and several
detail rows where "document no." starts at position 1, "date" at 20, "amount" at
40, all vertically aligned. Clean flat vector, blue/grey palette, monospace feel,
minimal text. 16:9.
```

---

## 08 複数データをまとめる

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `08-receipt-organize.png` | concept | 領収書整理のたとえ | バラバラのヘッダ/明細カードを1行ずつにまとめる |
| `08-header-detail-join.png` | diagram | 図解：取得→対応付け→蓄積 | lt_bkpf+lt_bsegから1行組み立て→APPENDでlt_outへ |

**`08-receipt-organize.png`**（concept）
```
Flat vector illustration, light background. LEFT: scattered cards — "store info"
(header) cards and "item list" (detail) cards lying around in a mess. RIGHT: the
same information matched and merged into a tidy table where each row is meaningful
on its own. Conveys "combine header + detail into one readable list". Friendly,
blue/grey palette, minimal text. 16:9.
```

**`08-header-detail-join.png`**（diagram）
```
Minimal flat diagram, white background. Two source tables on the left: "lt_bkpf
(header rows)" and "lt_bseg (detail rows)". Arrows flow into a single assembled
row "ls_out" in the middle (some fields via MOVE-CORRESPONDING, one field via
direct assignment). Then an APPEND arrow stacks rows into "lt_out (output table)"
on the right. Clean flat vector, blue/grey palette, minimal text. 16:9.
```

---

## 09 制御の考え方

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `09-suppress.png` | concept | サプレスのたとえ | 見出し(東京都)の繰り返し vs 先頭1回だけの対比 |
| `09-control-break.png` | diagram | 図解：キーの変わり目 | SORT済みのグループ境界でAT NEW/AT END OFが発火 |

**`09-suppress.png`**（concept）
```
Flat vector before/after comparison, light background. LEFT: a list where the
group label "Tokyo" is repeated on every single row (redundant). RIGHT: the same
list where "Tokyo" appears only once at the top of the group and the rows below
show just the names. Conveys "suppress = don't repeat the same heading". Blue/grey
palette, minimal text. 16:9.
```

**`09-control-break.png`**（diagram）
```
Minimal flat diagram, white background. A vertical list of rows already sorted by
"company code", with clear group boundaries. At each boundary, an arrow on the top
labelled "AT NEW = group header" and an arrow on the bottom labelled "AT END OF =
subtotal". A marker at the very top "AT FIRST" and at the very bottom "AT LAST".
Clean flat vector, blue/green accents, minimal text. 16:9.
```

---

## 10 プログラムを分かりやすくする

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `10-chapters.png` | concept | 手順書のたとえ | 見出しなしの長い手順書 vs 章立てされた手順書 |
| `10-usingvs-changing.png` | diagram | FORMとPERFORM | USING＝一方向／CHANGING＝往復の引数の向き |
| `10-gui-modules.png` | concept | GUI・イベント・DL | メインから画面表示／イベント／DLの3サブルーチンへ分岐 |

**`10-chapters.png`**（concept）
```
Flat vector before/after illustration, light background. LEFT: one long, dense
instruction manual with no headings, hard to navigate. RIGHT: the same content
split into clear chapters ("prepare", "main work", "clean up") with headings,
easy to find things. Conveys "split long code into named parts". Blue/grey
palette, minimal text. 16:9.
```

**`10-usingvs-changing.png`**（diagram）
```
Minimal flat diagram, white background. A subroutine drawn as a box. TOP: a single
one-way arrow into the box labelled "USING (pass in only)". BOTTOM: a two-way
arrow into and back out of the box labelled "CHANGING (pass in and get result
back)". Clean flat vector, blue/grey palette, minimal text. 16:9.
```

**`10-gui-modules.png`**（concept）
```
Flat vector illustration, light background, beginner-friendly training material.
LEFT: a simplified application window with a few fields and two buttons (execute,
download). CENTER: a "Main program" block. RIGHT: three separate rounded module
boxes branching out with arrows labelled "PERFORM": (1) monitor icon "display
screen", (2) click/hand icon "event handler", (3) download arrow "file download".
Conveys "split GUI display, button events, and download into separate
subroutines". Blue/grey/green/amber accents, clean, minimal English labels. 16:9.
```

---

## 11 会計伝票登録へ進む

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `11-draft-vs-final.png` | concept | メモと正式台帳のたとえ | 鉛筆の下書き(照会) vs ペンの清書+押印(登録) |
| `11-bapi-gate.png` | diagram | BAPIはなぜ必要か | 直接INSERT(危険)とBAPI公式窓口(安全)の対比 |

**`11-draft-vs-final.png`**（concept）
```
Flat vector illustration, light background. LEFT: a pencil writing an erasable
draft memo (casual, can be undone) = "inquiry". RIGHT: a pen writing into an
official ledger and stamping it with a seal (permanent record) = "posting".
Conveys the difference in weight/responsibility. Blue (left) / amber (right)
accents, minimal text. 16:9.
```

**`11-bapi-gate.png`**（diagram）
```
Minimal flat comparison diagram, white background. LEFT (marked with a red ✕): an
arrow trying to INSERT directly into several document tables, causing inconsistency
(warning icon). RIGHT (marked with a green ✓): the same data passing through a
single official gate labelled "BAPI", which performs checks and updates related
tables consistently. Clean flat vector, red vs green accents, minimal text. 16:9.
```

---

## 12 実務っぽい観点

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `12-renovation-blueprint.png` | concept | 増改築のたとえ | 図面を確認してから壁に手を入れる改修 |
| `12-investigate-pipeline.png` | diagram | 最初に見る3点 | 入力→取得→加工→出力を調査の地図として虫めがねで見る |

**`12-renovation-blueprint.png`**（concept）
```
Flat vector illustration, light background. A worker doing home renovation who
first spreads out and reads a blueprint before touching a wall. A subtle hint that
ignoring the blueprint could cut a hidden water pipe. Conveys "understand the
current state before modifying". Friendly, blue/grey palette, minimal text. 16:9.
```

**`12-investigate-pipeline.png`**（diagram）
```
Minimal flat diagram, white background. The pipeline "input → fetch → process →
output" drawn left to right, with a magnifying glass hovering over it. Small
callouts on input / fetch / output indicating "check what changes here" — used as
an investigation map for spec changes. Clean flat vector, blue/grey palette,
minimal text. 16:9.
```

---

## 13 適切なプログラミング

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `13-shortcut-traffic.png` | concept | 近道のたとえ | 詰まった近道 vs 流れる本道（データ量増で渋滞） |
| `13-roundtrip.png` | diagram | 図解：往復を減らす | LOOP内SELECT(往復多) vs まとめ取得+メモリ照合(往復少) |

**`13-shortcut-traffic.png`**（concept）
```
Flat vector illustration, light background. LEFT: a narrow "shortcut" road jammed
with cars in a traffic jam (looks fast but clogs up). RIGHT: a wide main road
flowing smoothly. Conveys "a quick hack becomes a bottleneck as data grows".
Friendly, blue/grey palette, minimal text. 16:9.
```

**`13-roundtrip.png`**（diagram）
```
Minimal flat comparison diagram, white background. LEFT ("bad"): a LOOP making
many repeated round-trip arrows to a database/warehouse (one per row). RIGHT
("good"): a single round-trip that fetches everything once into an internal table
(a desk), then matches in memory with no further DB trips. Contrast the number of
arrows. Clean flat vector, red vs green accents, minimal text. 16:9.
```

---

## 14 SAP開発ツール

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `14-debug-flow.png` | diagram | デバッグの基本 | ブレークポイント→/h→F5/F6→変数確認の流れ |
| `14-history-check.png` | diagram | 履歴の確認 | SE16N(結果)・ST22(エラー)・バージョン管理(変更)の3入口 |

**`14-debug-flow.png`**（diagram）
```
Minimal flat flowchart, white background, left to right. Step 1: ABAP editor with a
breakpoint dot on a line number. Step 2: command field showing "/h" to start the
debugger. Step 3: debugger with F5/F6 step buttons highlighted. Step 4: variables
window showing sy-subrc and an internal table row. Clean flat vector, blue/grey
palette, minimal English labels. 16:9.
```

**`14-history-check.png`**（diagram）
```
Minimal flat diagram, white background, three columns or panels. LEFT: "SE16N" with
a table browse icon and rows showing OK/NG status and document numbers (registration
result check). CENTER: "ST22" with a warning/dump icon (runtime error history).
RIGHT: "Version management" with stacked document versions and a user/timestamp
(program change history). Arrows from a central "investigate" magnifying glass.
Clean flat vector, blue/grey/amber accents, minimal text. 16:9.
```
