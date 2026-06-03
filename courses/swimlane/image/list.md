# swimlane — Image List

All figures used across the course. Each entry includes: filename (basename), kind, slide title, detailed alt text, and an English image generation prompt.

---

## Lessons 00–04: GUI Editor


---

## 00-introduction

### 00-app-concept.webp
- **kind**: concept
- **slide**: Kai Swimlaneとは
- **alt**: Kai Swimlaneアプリのコンセプト図。左側にテキストエディタのアイコンとDSLテキストが書かれたエリア、右側にカラフルなスイムレーン図のSVGが表示されているエリア。両者が双方向の矢印でつながれており、テキストとビジュアルが同期していることを示す。背景はライトグレー、フラットベクターイラスト。
- **prompt**: Flat vector illustration, light gray background, no text. Left panel shows a code editor with abstract text lines in a monospace font style, right panel shows a colorful swimlane diagram with horizontal lanes and flowchart steps. A large bidirectional arrow connects the two panels symbolizing real-time sync. 16:9 ratio.

---

### 00-gui-interface.webp
- **kind**: diagram
- **slide**: インターフェース全体像
- **alt**: Kai Swimlane GUIエディタの画面全体図。上部にツールバー（テキストモードリンク・Syntaxボタン・テーマ切替・Fileメニュー・Exportボタン）、左側にレーンパネル（役割リストとステップリスト、+ボタン）、右側にカラフルなスイムレーン図のSVGプレビュー。各エリアが色付きの枠で囲まれてラベルが付いている。
- **prompt**: Figma/draw.io recommended. Wireframe-style browser app screenshot. Top bar contains labeled buttons (Syntax, Theme, File, Export). Left sidebar shows a lane list with role names and step items and a + button. Right area shows a colorful swimlane SVG diagram preview. Each region is outlined with colored rectangles and labeled with call-out text. Clean diagrammatic style, light background. No real screenshots — stylized diagram.

---

## 01-roles-and-steps

### 01-lanes-concept.webp
- **kind**: concept
- **slide**: レーンとは何か
- **alt**: スイムレーン図のコンセプト図。プールを上から見た図のように3本の水平レーンが並んでいる。左から「購買担当者」「承認者」「仕入先システム」とラベルが付き、各レーンに丸角四角のステップが配置されている。矢印がレーンをまたいで流れを示している。フラットベクターイラスト、ライトブルー背景。
- **prompt**: Flat vector illustration, light blue background, no text. Three horizontal swim lanes in a pool-like layout, viewed from above. Each lane contains rounded rectangle process steps. Arrows cross between lanes showing workflow direction. Minimalist, clean, colorful lane separators. 16:9 ratio.

---

### 01-role-creation.webp
- **kind**: diagram
- **slide**: レーンの追加
- **alt**: Kai Swimlane GUIエディタのレーン追加操作図。ツールバーのSyntaxボタンを押すとTemplatesパネルが開き、role/block/propのカテゴリが並ぶ。/role/スニペットのカードが選択されており「クリップボードにコピー」ボタンが強調表示されている。その右にはGUIのレーンパネルが表示されており新しいレーンが追加された状態が示されている。
- **prompt**: Figma/draw.io recommended. Step-by-step UI diagram showing: (1) a toolbar button labeled "Syntax" being clicked, (2) a templates panel popup with role/block/prop categories and a card with a copy button highlighted, (3) a lane panel on the right showing a newly added lane row. Arrows indicate the sequence. Clean wireframe style, light background, numbered call-outs.

---

### 01-step-add.webp
- **kind**: diagram
- **slide**: ステップの追加
- **alt**: Kai Swimlane GUIエディタのステップ追加操作図。レーンパネルの+ボタンをクリックするとポップアップメニューが出現し「手順を追加」「条件分岐」「並行処理」などの選択肢が並ぶ。「手順を追加」が選択されており、右側にテキスト入力欄とレーン選択ドロップダウンを含むフォームが表示されている。
- **prompt**: Figma/draw.io recommended. UI interaction diagram showing a "+" button in a lane panel that opens a popup menu with options (step, condition, parallel, section). The "step" option is highlighted. Next to it, a small form dialog with a text input field and a lane dropdown selector. Arrows show the click flow. Clean wireframe style, light background.

---

## 02-flow-control-gui

### 02-flow-types.webp
- **kind**: diagram
- **slide**: フロー制御の種類
- **alt**: Kai Swimlaneのフロー制御4種類を示すダイアグラム図。左から右に4つのミニ図が並ぶ。1つ目はif（菱形から2本の矢印が分岐）、2つ目はfork（バー記号から2本の矢印が並行に出発）、3つ目はsection（破線の枠でステップを囲む）、4つ目はbranch（メインラインの横に支線が伸びる）。各図の下にラベルが付いている。
- **prompt**: Figma/draw.io recommended. Four mini flowchart diagrams in a 1x4 horizontal row, each demonstrating: (1) exclusive gateway diamond splitting into two paths (if), (2) parallel bar splitting into two parallel paths (fork), (3) dashed border box grouping steps (section), (4) main flow line with a side branch extending outward (branch). Labels below each diagram. Clean vector style, light background.

---

### 02-if-branch-gui.webp
- **kind**: diagram
- **slide**: 条件分岐（if）の追加
- **alt**: Kai Swimlane GUIエディタでの条件分岐追加操作図。左のレーンパネルに+ボタンのポップアップが出ており「条件分岐」が選択されている。右のプレビューにはif/elseif/elseの3ケースがカラーバー付きで表示されたスイムレーン図が示されている。各ケースの中にステップが配置されている。
- **prompt**: Figma/draw.io recommended. Left side shows a lane panel popup with "condition" selected. Right side shows an SVG swimlane preview with three colored conditional sections (if/elseif/else) displayed as colored vertical bands, each containing step boxes. Arrows point from left UI to right preview. Clean wireframe diagram style.

---

### 02-fork-gui.webp
- **kind**: diagram
- **slide**: 並行処理（fork）の追加
- **alt**: Kai Swimlane GUIエディタでの並行処理追加操作図。レーンパネルにforkブロックが表示されており、2本の並行パス（and）が上下に並んでいる。右のSVGプレビューには並行処理バー（太い水平線）から2本の矢印が下に分岐し、それぞれのパスにステップが配置され、下部の合流バーで1本に戻る様子が示されている。
- **prompt**: Figma/draw.io recommended. Left panel shows a lane panel with a fork block containing two "and" path items. Right preview shows an SVG swimlane with a thick horizontal synchronization bar splitting into two parallel paths, each with step boxes, joining back at a lower synchronization bar. Classic UML parallel fork notation. Clean diagrammatic style.

---

## 03-step-inspector

### 03-inspector-overview.webp
- **kind**: diagram
- **slide**: インスペクターを開く
- **alt**: Kai Swimlane GUIエディタのインスペクターポップアップの全体図。レーンパネルのステップ名がクリックされており、画面中央にポップアップが開いている。ポップアップ内にlane/text/block/label/desc/remark/remark-desc/props/id/arrowの各フィールドがラベル付きで並んでいる。各フィールドには入力欄があり、いくつかにはサンプル値が入っている。
- **prompt**: Figma/draw.io recommended. A modal/popup dialog in the center of the screen, triggered by a step item click in the left panel (shown with a dotted arrow). The popup contains a vertical list of form fields with labels: lane, text, block, label, desc, remark, remark-desc, props, id, arrow. Some fields have example placeholder values. Clean UI wireframe style, light background.

---

### 03-label-desc.webp
- **kind**: diagram
- **slide**: label と desc
- **alt**: Kai Swimlane 図の左ガター列のアップ図。スイムレーン図の左側に細い列があり、各ステップの行にlabelテキストとdescテキストが縦に並んで表示されている。labelは太字の短いテキスト、descは細字の複数行テキストで下に続く。右側のメイン図のステップボックスと高さが対応している。
- **prompt**: Figma/draw.io recommended. Close-up diagram of the left gutter column of a swimlane diagram. A thin vertical column on the left shows short bold label text and longer smaller desc text for each step row. The right side shows the main swimlane boxes aligned with each row. Horizontal guides show row alignment between gutter and main diagram. Clean technical diagram style, light background.

---

## 04-settings-export

### 04-settings-dialog.webp
- **kind**: diagram
- **slide**: 設定ダイアログ（/page/ 編集）
- **alt**: Kai Swimlane GUIエディタの設定ダイアログのスクリーンショット模式図。タイトル横の歯車アイコンがクリックされており、中央にポップアップが開いている。ポップアップ内にdescription（テキストエリア）、header-left/center/right（3つの入力欄が横に並ぶ）、footer-left/center/right（同様の3欄）が表示されている。各欄にサンプルテキストが入力されている。
- **prompt**: Figma/draw.io recommended. A settings modal dialog popup. A gear/settings icon on the top title bar is highlighted with a click indicator. The modal contains: a multiline textarea labeled "description", three side-by-side input fields labeled "header-left", "header-center", "header-right", and three more labeled "footer-left", "footer-center", "footer-right". Sample placeholder text in each field. Clean UI wireframe style.

---

### 04-themes.webp
- **kind**: concept
- **slide**: テーマの切り替え
- **alt**: Kai Swimlaneの4つのテーマを並べたコンセプト比較図。2×2のグリッドに4つの小さなスイムレーン図が配置されている。左上がbasic（明るいカラフルな彩色）、右上がwashi（くすんだ和風の色彩、茶・緑系）、左下がink（黒のインク線画、背景白）、右下がmono（グレースケール、レーンが灰色のグラデーション）。各テーマ名が下に表示されている。
- **prompt**: Flat vector illustration, white background, no text. A 2x2 grid showing four small swimlane diagram thumbnails. Top-left: bright colorful lane stripes with vivid blue/green/orange steps (basic theme). Top-right: muted earthy tones with brown/olive/moss green lanes (washi theme). Bottom-left: simple black ink line drawing on white, no color fill (ink theme). Bottom-right: grayscale gradient lanes with gray step boxes (mono theme). Each thumbnail has a subtle label area below. 16:9 ratio.

---

## Lessons 05–08: Text Editor Basics (DSL)

各画像の用途・alt テキスト・生成プロンプトを記載しています。

---

## 00-introduction.tsx

### 00-text-editor-ui.webp
- **kind**: diagram（Figma/draw.io 推奨）
- **スライドタイトル**: テキストエディタとは
- **alt**: Kai Swimlaneのテキストエディタ画面。左側にDSLテキストを入力するエディタペインがあり、右側にリアルタイムでスイムレーン図が描画されるプレビューペインが表示されている。上部にフォーマットボタン、テーマ切り替え、エクスポートボタンが並ぶ。
- **AI生成プロンプト**: Split-pane web code editor screenshot mockup. Left pane contains plain-text DSL code in dark theme, right pane shows rendered swimlane flowchart. Top toolbar has Format, Theme, and Export buttons. Flat UI design, 16:9, light background, no real brand logos.

---

### 00-dsl-concept.webp
- **kind**: concept（AI生成推奨）
- **スライドタイトル**: DSLとは何か
- **alt**: 左側にテキスト（DSLのコード）があり、矢印を挟んで右側に完成したスイムレーン図が表示されるイメージ図。テキストが図に変換されるDSLの概念を示す。上にはDSL＝ドメイン固有言語というラベルが付く。
- **AI生成プロンプト**: Flat vector concept illustration. Left side shows text lines representing code (abstract symbols, no real code). Arrow points right. Right side shows a simple flowchart swimlane diagram. Clean light background, 16:9, no text labels, pastel colors.

---

### 00-sections-overview.webp
- **kind**: diagram（Figma/draw.io 推奨）
- **スライドタイトル**: 7つのセクション
- **alt**: Kai Swimlane DSLの7つのセクションを示す構成図。上から順に @kai-swimlane、/title/、/page/、/option/、/role/、/block/、/prop/、/line/、@end と並んでいる。各セクションの役割が右側に短い説明文として記されている。
- **AI生成プロンプト**: Vertical stack diagram showing 8 labeled sections stacked top to bottom inside a rounded rectangle frame. Each section is a horizontal band with a short label on the left. Flat design, neutral colors for each band, light background, 16:9, no brand logos.

---

## 01-title-page-option.tsx

### 01-title-result.webp
- **kind**: diagram（Figma/draw.io 推奨）
- **スライドタイトル**: /title/ セクション
- **alt**: Kai Swimlaneで /title/ セクションに「受注処理フロー」と書いたときのレンダリング結果。図の最上部に大きく「受注処理フロー」というタイトルが表示されている。
- **AI生成プロンプト**: Swimlane diagram mockup with a prominent title heading at the top reading placeholder text. Below it is a simple 2-column swimlane with a few rounded-rect steps. Flat, light background, 16:9, minimal, no real text.

---

### 01-page-layout.webp
- **kind**: diagram（Figma/draw.io 推奨）
- **スライドタイトル**: /page/ — ヘッダーとフッター
- **alt**: Kai Swimlaneのページレイアウト図。図の上部にheader-left（社外秘）、header-center（会社名）、header-right（バージョン）が配置され、図の下部にfooter-left（作成者）、footer-center（管理番号）、footer-right（日付）が表示されている。
- **AI生成プロンプト**: Flat vector diagram showing a document layout wireframe. Top header band has three placeholder text areas (left, center, right). Bottom footer band has three placeholder text areas (left, center, right). Center area has simple swimlane content placeholder. 16:9, light background, no real text.

---

### 01-option-columns.webp
- **kind**: diagram（Figma/draw.io 推奨）
- **スライドタイトル**: /option/ — カラム見出し
- **alt**: Kai Swimlaneの図で左ガター列の見出しに「作業手順」「担当者と内容」、右ガター列の見出しに「備考」「注意事項・エラー対応」と表示されているレンダリング結果。カラム見出しのカスタマイズ例。
- **AI生成プロンプト**: Swimlane diagram mockup with gutter columns. Left gutter column header has two placeholder heading rows. Right gutter column header has two placeholder heading rows. Center has swimlane content. Flat design, light background, 16:9, clear column separation with thin borders.

---

## 02-roles-blocks-props.tsx

### 02-role-lanes.webp
- **kind**: diagram（Figma/draw.io 推奨）
- **スライドタイトル**: /role/ の基本
- **alt**: Kai Swimlaneで3つのロール（営業・経理・システム）を定義したときのレンダリング結果。図の上部に3つの横並びカラムが表示され、それぞれに「営業」「経理」「システム」というラベルが付いている。
- **AI生成プロンプト**: Swimlane diagram with 3 vertical columns, each with a colored header band and a label placeholder. A few rounded rectangle steps are arranged in the columns. Flat design, distinct pastel colors per column, light background, 16:9.

---

### 02-role-styles.webp
- **kind**: concept（AI生成推奨）
- **スライドタイトル**: /role/ — カラーとアイコン
- **alt**: Kai Swimlaneで各ロールにカラーとアイコンを設定したときのイメージ。「営業」カラムは青背景に白文字とユーザーアイコン、「経理」カラムは緑背景に白文字とファイルアイコン、「システム」カラムはデフォルト色に雲の絵文字が表示されている。
- **AI生成プロンプト**: Flat vector concept illustration showing three swimlane column headers side by side. First header: blue background, white person icon, white label. Second header: green background, white document icon, white label. Third header: grey background, cloud emoji, dark label. Clean, 16:9, no real text.

---

### 02-block-shapes.webp
- **kind**: diagram（Figma/draw.io 推奨）
- **スライドタイトル**: /block/ — shapeの種類
- **alt**: Kai Swimlaneで利用できる7種類のブロック形状（rect・rounded・hex・ellipse・cloud・note・subroutine）をそれぞれ表示した比較図。各形状の下にその名前が書かれている。
- **AI生成プロンプト**: Flat vector comparison grid of 7 flowchart node shapes arranged in a row: rectangle, rounded rectangle, hexagon, ellipse, cloud shape, note (folded corner) shape, and subroutine (rectangle with double vertical lines). Light background, each shape in a different pastel color, a short label below each, 16:9.

---

### 02-prop-chips.webp
- **kind**: diagram（Figma/draw.io 推奨）
- **スライドタイトル**: /prop/ とは
- **alt**: Kai Swimlaneのステップにドキュメントチップ（プロップ）が付いている様子。ステップの横に「申請書」「承認書」という小さなチップラベルが表示されている。チップは左右どちら側にも付けられることを示す。
- **AI生成プロンプト**: Swimlane diagram mockup showing two rounded rectangle steps. One step has a small pill/chip label on the right side, another step has two chip labels on the left side. Chips are small colored badges with text placeholders. Flat design, light background, 16:9.

---

## 03-steps.tsx

### 03-step-anatomy.webp
- **kind**: diagram（Figma/draw.io 推奨）
- **スライドタイトル**: ステップの基本構文
- **alt**: Kai Swimlaneのステップ行の構造を示す解説図。[sales: 注文受付] <start> というコード行が示され、角括弧部分が「ロールIDとステップテキスト」、山括弧部分が「ブロックID（任意）」であることを矢印で指示している。
- **AI生成プロンプト**: Flat vector code annotation diagram. A single line of code-like text is shown in a dark code block. Bracket annotations with arrows point to different parts of the line: one arrow labels the bracket section, another labels the angle-bracket section. Clean, 16:9, light background, simple annotation style.

---

### 03-gutter-columns.webp
- **kind**: diagram（Figma/draw.io 推奨）
- **スライドタイトル**: remark と remark-desc
- **alt**: Kai Swimlaneで左ガターと右ガターが両方表示されているレンダリング結果。左ガターにはlabel（ステップ名）とdesc（説明文）が表示され、右ガターにはremark（備考テキスト）が表示されている。中央にはスイムレーン図本体が配置されている。
- **AI生成プロンプト**: Swimlane diagram mockup with three horizontal sections. Left column (narrow) contains step name and description placeholders. Center section contains 2-column swimlane with steps. Right column (narrow) contains remark/note text placeholders. Flat design, light background, 16:9, thin dividing lines between sections.

---

### 03-arrow-styles.webp
- **kind**: diagram（Figma/draw.io 推奨）
- **スライドタイトル**: arrow
- **alt**: Kai Swimlaneで3種類のarrowスタイル（solid=実線、dashed=破線、dotted=短い点線）を比較したレンダリング例。3つのステップが縦に並び、それぞれ異なるスタイルの矢印で接続されている。
- **AI生成プロンプト**: Flat vector comparison diagram showing three vertical flowchart paths side by side. First path: solid arrow line between two rounded rectangles, labeled "solid". Second path: dashed arrow line, labeled "dashed". Third path: dotted arrow line, labeled "dotted". Light background, 16:9, clean minimal style.

---

## Lessons 09–13: Flow Control

画像が無い間は、スライド上に「準備中」のプレースホルダ（ファイル名＋説明）が出ます。

## 使い方・ルール

- **原画（保持用）**: `courses/swimlane-text-flow/image/originals/<ファイル名>.png` — リポジトリに残す。サイトには出さない。
- **配信用**: `courses/swimlane-text-flow/image/<ファイル名>.webp` — `pnpm run optimize:images` で原画から生成。
- **参照**: スライドは `<Figure src="image/<ファイル名>.webp" … />`（拡張子 `.webp`）
- **推奨形式（原画）**: PNG（透過可）/ 横長 16:9〜4:3。SVG も可。
- **文字**: 図中に日本語ラベルを入れる場合、画像生成AIは日本語が苦手なため、
  - 技術図（diagram）は **Figma / draw.io / PowerPoint 等で作成**するのを推奨。
  - 概念イラスト（concept）は生成AIで作り、必要なら後からラベルを上に重ねる。
- **トーン**: 中級者向け・クリーン・技術的。配色はスライドに合わせて青/緑/橙/グレー基調。
- `kind="concept"` ＝ 比喩イラスト（flat vector, light background, no text, 16:9）
- `kind="diagram"` ＝ 構成図（Figma/draw.io 推奨）

---

## 共通キャラクター（全レッスン共通・実装済み）

会話（`<Dialog>`）のアバターに使う3人の立ち絵です。
**原画**: `assets/characters/originals/*.png` → **`pnpm run optimize:images`** → `public/characters/*.webp`（配信）。

| 原画（originals） | 配信（public/characters） | 役割 | 配色 | 性格 |
| --- | --- | --- | --- | --- |
| `teacher.png` | `teacher.webp` | 先生 | 青 | 落ち着いた・やさしい講師 |
| `student-a.png` | `student-a.webp` | Aくん | 緑 | 理系・理屈で納得するタイプ |
| `student-b.png` | `student-b.webp` | Bちゃん | 橙 | 文系・PCは苦手・比喩が刺さるタイプ |

---

## 00 コース概要

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `00-flow-overview.png` | concept | フロー制御とは | 左側に直線リストの単純フロー図、右側に分岐・並行・グループ・支線を組み合わせた複雑なスイムレーン図。フロー制御の有無による表現力の差を示す概念図 |
| `00-flow-types.png` | diagram | 6つの構文の全体像 | 6種類のフロー制御構文をそれぞれ小さなスイムレーン図で示した俯瞰図。ifのデシジョンダイヤモンド、forkのスプリットバー、sectionの点線ボックス、branchの側道、mergeの前方ジャンプ矢印が並ぶ |

**`00-flow-overview.png`**（concept）
```
Flat vector illustration, light background, clean and professional corporate
training style. Left panel: a simple vertical linear list of process steps with
plain arrows (labelled "no flow control"). Right panel: a richer swimlane diagram
with a diamond decision node (branch), a split/join bar (parallel), a dashed
rectangle grouping (section), and a side-path arrow (branch). A bold comparison
arrow between the two panels. Blue/green palette, no Japanese text, 16:9.
```

**`00-flow-types.png`**（diagram）
```
Flat diagram / Figma-style overview layout, light background. Six small swimlane
thumbnail diagrams arranged in a 2×3 or 3×2 grid, each labelled with its
construct name: (1) if — decision diamond with branch arrows, (2) loop — loop-back
arrow from case to diamond, (3) fork — split/join bars with parallel paths,
(4) section — dashed rectangle grouping steps, (5) branch — side path with no
entry arrow merging back, (6) merge — dashed forward-jump arrow to a target step.
Each thumbnail uses a distinct soft accent colour. Recommended Figma or draw.io.
16:9.
```

---

## 01 排他分岐（if / elseif / else / endif）

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `01-if-basic.png` | diagram | 基本構文 | スイムレーン図。「審査結果」デシジョンダイヤモンドから「承認」「保留」「その他」の3本の矢印が出て、それぞれのケースのステップを経てマージダイヤモンドに戻ってくる構造図 |
| `01-if-multi.png` | diagram | elseif と else | スイムレーン図。在庫状況デシジョンから「十分（緑）」「少量（橙）」「ゼロ（赤）」「その他」の4ケースが分岐し、各ケースに複数ステップがある。全パスがマージダイヤモンドで合流する |
| `01-loop.png` | diagram | ループ（[loop]） | スイムレーン図。「API結果」デシジョンダイヤモンドから「成功」「タイムアウト」「サーバーエラー」の3ケースが分岐。タイムアウトとサーバーエラーのケース末尾からデシジョンダイヤモンドへループバック矢印が引かれている |

**`01-if-basic.png`**（diagram）
```
Minimal flat swimlane diagram, white/light background. A horizontal decision
diamond labelled "Decision" at the top. Three arrows leave the diamond going
downward to three separate vertical lanes (columns): "Case A — Approved"
(blue path), "Case B — Hold" (orange path), "Other — Rejected" (red path).
Each lane has one or two rectangular process steps. All paths converge back to
a merge diamond at the bottom. Clean flat vector, Figma/draw.io recommended. 4:3.
```

**`01-if-multi.png`**（diagram）
```
Minimal flat swimlane diagram, white/light background. A decision diamond at
top-centre with four branches going outward to four vertical lanes: green lane
(multiple steps), orange lane (multiple steps), red lane (multiple steps), grey
lane (one step). All four paths converge at a merge diamond at the bottom. Paths
are colour-coded matching their label colour. Recommended Figma or draw.io. 4:3.
```

**`01-loop.png`**（diagram）
```
Minimal flat swimlane diagram, white background. A decision diamond near the top.
Three paths branch out: (1) "Success" — green path, two steps, exits normally to
merge diamond; (2) "Timeout" — orange path, one step, then a curved loop-back
arrow returns to the decision diamond; (3) "Server Error" — red path, one step,
same loop-back arrow. The loop-back arrows are clearly drawn as curved lines with
arrowheads pointing back to the diamond. Recommended Figma or draw.io. 4:3.
```

---

## 02 並行処理（fork / and / endfork）

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `02-fork-concept.png` | concept | forkとは | 左側にifの排他分岐（デシジョンダイヤモンドから3本のうち1本だけ色付き矢印が出る）、右側にforkの並行処理（スプリットバーから3本すべてに色付き矢印が出る）を対比した概念図 |
| `02-fork-colored.png` | diagram | forkの色指定 | スイムレーン図。スプリットバーから4本のパスが出て、青（通知）・緑（在庫）・橙（財務）・グレー（ログ）に色分けされている。各パスに複数ステップがあり、ジョインバーで合流する |
| `02-fork-with-if.png` | diagram | fork内のif | スイムレーン図。スプリットバーから3本のパスが出て、青パスと緑パスの内部にそれぞれデシジョンダイヤモンドがある。各パス内でさらに分岐が起きて、全パスがジョインバーで合流する |

**`02-fork-concept.png`**（concept）
```
Flat vector split-panel illustration, light background, clean. Left panel labelled
"if — exclusive (one path)": a decision diamond with three paths going down, only
ONE path is highlighted (filled colour arrow), the other two are greyed out.
Right panel labelled "fork — parallel (all paths)": a thick horizontal split bar
with three paths going down, ALL THREE paths are highlighted (filled colour
arrows). Blue/green palette, friendly, no Japanese text. 16:9.
```

**`02-fork-colored.png`**（diagram）
```
Minimal flat swimlane diagram, white background. A thick horizontal split bar at
the top. Four vertical path columns extend downward: blue column (2 steps),
green column (3 steps), orange column (2 steps), grey column (1 step). Each
column has its own background colour tint. A thick horizontal join bar at the
bottom connects all four columns. Recommended Figma or draw.io. 4:3.
```

**`02-fork-with-if.png`**（diagram）
```
Minimal flat swimlane diagram, white background. A split bar near the top with
three paths. The first (blue) path contains a small decision diamond with two
sub-branches that re-merge before reaching the join bar. The second (green) path
also contains a small decision diamond. The third (orange) path has only linear
steps. All three paths converge at a join bar at the bottom. Recommended Figma
or draw.io. 4:3.
```

---

## 03 枠（section）と支線（branch）

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `03-section-concept.png` | diagram | sectionとは | スイムレーン図。メインフローが直線的に流れ、3ステップが点線の青いボックス（section）で囲まれている。ボックスの前後でフローが変わっていないことを示す矢印の流れが見える |
| `03-branch-concept.png` | diagram | branchとは | スイムレーン図。メインフローが上から下に流れる中、branchブロックが側道として描かれ、先頭ステップには入力矢印がなく（支線入口）、末尾ステップがend-branch直後のメインステップに矢印で合流している |
| `03-section-vs-branch.png` | diagram | section vs branch 比較 | 左側にsection（点線ボックスがステップを囲み、フローが直線のまま続く）、右側にbranch（側道経路が分岐して入矢なし先頭から始まり、end-branchで合流する）を並べた比較図 |

**`03-section-concept.png`**（diagram）
```
Minimal flat swimlane diagram, white background. A linear vertical flow of steps
with standard connecting arrows. In the middle section, three steps are enclosed
by a dashed rectangular border (the "section box") with a small label tab at
the top-left. The flow continues straight through the box with no branching —
the arrows enter at the top of the box and exit at the bottom unchanged. Blue
accent for the box border. Recommended Figma or draw.io. 4:3.
```

**`03-branch-concept.png`**（diagram）
```
Minimal flat swimlane diagram, white background. The main flow proceeds vertically
(Step A → Step B → Step C). A side path appears to the right: "Branch start"
step has NO entry arrow (the top of the step box has no incoming arrow), then
"Branch middle" step, then "Branch end" step. A merge arrow goes from "Branch
end" to "Step C" (or the step after end-branch). The absence of an entry arrow
on the first branch step is clearly visible. Green accent for branch path.
Recommended Figma or draw.io. 4:3.
```

**`03-section-vs-branch.png`**（diagram）
```
Minimal flat diagram with two side-by-side swimlane panels, light background.
Left panel "section": a dashed rectangle box groups three steps inline, main
flow continues straight through without diverging. Label "visual group only".
Right panel "branch": a side path branches off to the right with no entry arrow
on its first step, then merges back at a downstream step with a merge arrow.
Label "structural side path". Colour-coded: blue for section, green for branch.
Recommended Figma or draw.io. 4:3.
```

---

## 04 途中合流（merge）と応用パターン

| ファイル名 | 種別 | 使用スライド | 内容（alt） |
| --- | --- | --- | --- |
| `04-merge-concept.png` | diagram | mergeとは | スイムレーン図。ifのデシジョンダイヤモンドからキャンセルケースが分岐し、「キャンセル受付」ステップの後、mergeの矢印がendifをスキップして直接「取引完了」ステップ（id:done）に飛ぶ。通常ケースはendifを経由して取引完了に来る |
| `04-merge-arrow.png` | diagram | arrowとmergeの組み合わせ | スイムレーン図。ifの緊急停止ケースとその他ケースから破線の矢印がid:emergency-endに飛んでいる。通常終了ケースは実線でendifを経由する。破線と実線の使い分けが視覚的に明確 |
| `04-complex-flow.png` | diagram | 複合フロー例 | 全構文（if・merge・section・branch・fork）を組み合わせた複合受発注処理スイムレーン図。キャンセルケースの破線merge矢印、在庫処理の点線sectionボックス、配送支線のbranch（入矢なし）、並行後処理のforkスプリット/ジョインバーが全て見えている |

**`04-merge-concept.png`**（diagram）
```
Minimal flat swimlane diagram, white background. A decision diamond at top.
Two paths branch out: (1) "Normal case" — standard steps leading to a merge
diamond, then a final "Transaction Complete" step (labelled with an "id" badge);
(2) "Cancel case" — one step "Cancel Receipt", then a dashed forward-jump arrow
that bypasses the merge diamond and lands directly on "Transaction Complete".
The bypass arrow is clearly dashed (different style from normal solid arrows).
Recommended Figma or draw.io. 4:3.
```

**`04-merge-arrow.png`**（diagram）
```
Minimal flat swimlane diagram, white background. A decision diamond with three
paths: (1) "Normal End" — solid line to merge diamond then to final step;
(2) "Emergency Stop" — one step, then a dashed curved arrow jumping over the
merge diamond and landing on the final step; (3) "Other Error" — one step, same
dashed jump arrow to the final step. The contrast between solid arrows (normal)
and dashed arrows (exceptional jump) is visually clear. Recommended Figma or
draw.io. 4:3.
```

**`04-complex-flow.png`**（diagram）
```
Complex but readable flat swimlane diagram, white/light background. Multiple
swimlane rows (roles). Reading top to bottom: (1) A decision diamond with one
case having a dashed "merge" forward-jump arrow to a downstream step; (2) A
dashed rectangle "section" box grouping a cluster of middle steps; (3) A side
branch ("branch") with no entry arrow on its first step, merging back to a later
step; (4) A split/join bar pair ("fork") with three parallel paths including one
that has a nested section box. All constructs visible and clearly differentiated
by shape and colour. Recommended Figma or draw.io for accuracy. 4:3 or wider.
```
