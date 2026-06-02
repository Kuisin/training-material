# AIレッスン生成ルール

**対象読者:** 研修教材を生成するAI。レッスンを作成するたびに、**毎回**このルールに従うこと。
各レッスンは **1つの `.tsx` ファイル**（React + Tailwind）。Vite がビルドし、ブラウザでは `.html` として配信される。

**全コース共通の説明様式:** どのトラックでも、概念の伝え方は次の **4要素** を組み合わせる（§3・§5・§8）。地の文だけ・箇条書きだけのレッスンは不可。


| 要素            | 役割                     | 主な実装                                                     |
| ------------- | ---------------------- | -------------------------------------------------------- |
| **plainText** | Copilot コピー・音声読み上げ用の全文 | 各スライドの `plainText`（`content` と同じ情報量）                     |
| **blocks**    | 地の文と区別した構造化ブロック        | `Callout` / `InfoPanel` / リスト・表 / `CodeBlock` / `Reveal` |
| **image**     | 比喩・画面・構成の視覚化           | `Figure`（＋フローは `MermaidDiagram` も可）                      |
| **dialogs**   | 登場人物の対話で多角的に理解させる      | `Dialog`（コース初回のみ `CharacterIntro`）                       |


**手本コース:** `courses/abap-training/`（00〜16、92〜93）。新規・改訂はこの密度・構成に合わせる（§3・§10）。

---

## 1. 絶対ルール（厳守）

1. **1レッスン = 1つの `.tsx` ファイル**。必ず `template/lesson-template.tsx` を**コピー**して作る。
2. **各レッスンは default export の React コンポーネント**（Next.js の page と同様）。`export const lessonMeta = { title, meta? }` を定義し、`<Lesson>` で `chrome` と `slides` を渡し、末尾で `mountLesson(YourLesson)` を呼ぶ。ナビ・進捗・ジャンプメニューは共有 `Deck` が描画する。
3. **1スライド = `slides` 配列の1要素。** `title`（ジャンプメニュー用）と `content`（JSX）と `**plainText`（必須・Copilot コピー用）** を必ず設定する。`plainText` は見出しの要約ではなく、スライド本文（対話・ブロック・図の説明を含む）をそのまま書く。
4. **編集してはいけない部分:** `src/mount-lesson.tsx`、`src/components/deck.tsx`、`src/components/lesson.tsx` など共有エンジン。レッスン `.tsx` では `Lesson` の props（`chrome` / `slides`）だけを書く。
5. **import は `src/lesson.tsx` から統一。** `Callout` なども同ファイルから import する（個別パス import は使わない）。見た目は共有コンポーネント（Tailwind）のみ。独自 CSS は書かない。
6. **各レッスンに必ず含めるもの（4要素＋確認）:** 概要スライド、本文スライド、**blocks**、**image**（`Figure` 1枚以上。`MermaidDiagram` は補助）、**dialogs**（レッスン全体で `Dialog` を厚く。標準レッスンは **「対話で整理」** スライド＋確認テスト前の締め）、**plainText**（全スライド）、**確認テスト**（`Quiz` 1〜3 問。最後に `Dialog speaker="closing"` 推奨）。
7. **ビルド前提。** 開発は `pnpm dev`、公開は `pnpm build`。
8. **品質の基準は `courses/abap-training/` を手本にする。** 新規・改訂・**すべてのコース**で、上記4要素を満たす密度にすること。薄い箇条書きだけ・地の文だけのスライドにしない（§8・§9 を必ず確認）。

---

## 2. ファイル・命名規則

```
training-material/
├─ courses/
│  ├─ AI-LESSON-RULES.md          # 本ファイル
│  └─ <slug>/                     # 例: abap-training/
│     ├─ course.json              # レッスン一覧・前後ナビの元データ（必須）
│     ├─ plan.md                  # 制作プラン（任意）
│     ├─ 00-introduction.tsx      # レッスン（1ファイル＝1章）
│     ├─ …
│     └─ image/
│        ├─ list.md               # 画像インデックス＋生成プロンプト（必須）
│        ├─ originals/*.png       # 原画
│        └─ *.webp                # 配信用（optimize:images で生成）
├─ template/
│  ├─ lesson-template.tsx
│  └─ course.json
├─ src/                           # 共有エンジン（レッスンからは編集しない）
└─ index.tsx                      # コース一覧（course.json を読む）
```

- レッスン配置: `courses/<slug>/NN-kebab-case-title.tsx`
- ファイル名の `NN` は `course.json` の並びと一致（例: `00-introduction`）
- **import:** `from "../../src/lesson"`（`courses/<slug>/` からの相対パス）
- **ナビ URL は手書きしない。** `lessonChrome("<slug>", "<file-without-ext>", lessonMeta.title)` を使う（前後リンクは `course.json` から自動生成）

---

## 3. スライド構成（abap-training 準拠）

各レッスンは **plainText / blocks / image / dialogs** の4要素で説明する。標準レッスン（`course.json` の `lessons`）は、おおむね次の **型** に沿う（手本: `00-introduction.tsx`〜`13-good-programming.tsx`）。


| 順      | スライド                  | 内容                                                                                |
| ------ | --------------------- | --------------------------------------------------------------------------------- |
| 1      | **概要**                | `hgroup` + `LessonMeta` + 「この章で学ぶこと」`<ul>`。必要なら `Dialog speaker="teacher"` で導入    |
| 2      | **登場人物**（**コース初回のみ**） | `CharacterIntro` × 3 + 短い `Dialog`（`00-introduction` のみ。以降の章は省略可）                 |
| 3〜n    | **本文**（1スライド1概念）      | `h2` + 短文 + `Figure`（比喩・構成）または `CodeBlock` + `Dialog`（先生→A/B）。一覧・早見表は `InfoPanel` |
| —      | **図解：…**（推奨）          | `MermaidDiagram` 専用スライド。`Callout variant="tip"` でキーワードまとめ可                        |
| —      | **つまずきポイント**（任意）      | `Dialog speaker="stumble"` + A/B の反応                                              |
| 最後の2枚前 | **対話で整理**             | 先生・Aくん・Bちゃんが章の要点を会話で総括（タイトルは `対話で整理` で統一）                                         |
| 最後     | **確認テスト**             | `Quiz` 1〜3 問 + `Dialog speaker="closing"`（今日のひとこと）                                |


**本文スライドの4要素（レッスン単位で満たす）**

- **plainText:** 1行目にスライド見出し相当の文 → 本文 → `先生:` / `Aくん:` / `Bちゃん:` / `つまずき:` で対話を写す
- **blocks:** 地の文のあとに `Callout` / `InfoPanel` / リスト / `CodeBlock` / `Reveal`（段階表示）のいずれか
- **image:** レッスンあたり `**Figure` 1〜4 枚**（手本は多くが **2 枚**）。比喩スライドに `kind="concept"`、構成・対応に `kind="diagram"`。フローは別スライドで `MermaidDiagram` でも可（**全スライドに Figure は不要**）
- **dialogs:** 概念スライドでは先生＋A/B を交互に。**図だけのスライド**に Dialog が無くてもよいが、レッスン全体では対話を厚く

目安: **8〜18 スライド**（概念が多い章は分割して薄くしない）。文体は簡潔・例中心・初心者向け。

---

## 4. スライドショーの仕組み（共有エンジンが提供）

- 次へ／前へ、キーボード、`#s3` ディープリンク、進捗バー、ジャンプメニュー、Copilot ボタンはすべて `Deck` が担当。
- レッスン側は `slides` を並べるだけ。

---

## 5. 使える TSX コンポーネント

### 5.0 4要素の使い分け（全コース必須）


| 要素            | いつ使う                  | やってはいけないこと                            |
| ------------- | --------------------- | ------------------------------------- |
| **plainText** | すべてのスライド              | タイトル1行だけ／`content` と無関係な要約            |
| **blocks**    | 定義・注意・一覧・対応表・コード      | 長い地の文だけで情報を詰める                        |
| **image**     | 比喩・画面・フロー・対応関係        | 図なしで抽象概念だけを説明する                       |
| **dialogs**   | 概念の導入・「対話で整理」・つまずき先回り | 先生の独白だけ、`Callout` でセリフ代用、本編で「対話で整理」省略 |


1レッスンあたりの目安（abap-training）: `**Figure` 1〜4 枚（典型は 2）**、**「対話で整理」1 枚**、`**Dialog` はレッスン全体で 10 本以上**、**blocks** はほぼ全スライド。

```tsx
import {
  Lesson,
  Callout,
  Dialog,
  CharacterIntro,
  InfoPanel,
  CodeBlock,
  Quiz,
  Reveal,
  MermaidDiagram,
  Figure,
  LessonMeta,
  lessonChrome,
  mountLesson,
} from "../../src/lesson";

export const lessonMeta = {
  title: "章タイトル — サブタイトル",
  meta: "初学者 · 20分",
};

export default function MyLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-training", "01-overview", lessonMeta.title)}
      slides={[
        { title: "概要", plainText: "…", content: <>…</> },
      ]}
    />
  );
}

mountLesson(MyLesson);
```

**コールアウト（補足・キーワード一覧など）:** `<Callout variant="tip|warning|note">…</Callout>`

**対話（先生・Aくん・Bちゃん・つまずき・今日のひとこと）:**

```tsx
<Dialog speaker="teacher">説明文</Dialog>
<Dialog speaker="a">理系向けの反応</Dialog>
<Dialog speaker="b">比喩で理解する反応</Dialog>
<Dialog speaker="stumble">よくある誤解</Dialog>
<Dialog speaker="closing">章末の励まし</Dialog>
```

登場人物のセリフには `Callout` ではなく `Dialog` を使うこと。先生・Aくん・Bちゃんはアバター（先・理・文）＋吹き出し、`stumble` / `closing` はバッジ付きブロックで区別。

**登場人物の紹介（章の冒頭、大きな立ち絵）:**

```tsx
<CharacterIntro speaker="teacher">これから一緒に学びましょう。</CharacterIntro>
<CharacterIntro speaker="a">理屈で納得したいタイプです。</CharacterIntro>
<CharacterIntro speaker="b">例え話があると安心します。</CharacterIntro>
```

通常の会話は `Dialog`。`**CharacterIntro` はコース最初のレッスン（例: `00-introduction`）の「登場人物」スライドだけ**（abap-training は 00 のみ）。2章目以降は `Dialog` のみでよい。

**段階表示（演習・長いコード）:**

```tsx
<Reveal label="期待される結果を見る">…</Reveal>
```

手本: `92-exercise-journal-ledger.tsx`、`05-internal-tables.tsx`（ミニ演習）。

**情報パネル（一覧・対応表・キーワード集など、地の文と区別したいまとまり）:**

```tsx
<InfoPanel title="セッション関連コマンド" variant="reference" lead="任意のリード文">
  <table>…</table>  {/* または <ul> / <ol> */}
</InfoPanel>
```

**画像（`Figure`）:** イラストや画面スクリーンショットを載せる。画像ファイルが無くても**プレースホルダ**（ファイル名と説明）が表示されるので、**先に `Figure` を置いてよい**（画像は後から差し込める）。

```tsx
<Figure
  src="image/03-screen-map.webp"
  alt="読み上げ・画像欠落時に内容が伝わる詳しい説明（何を描くかの指示にもなる）"
  caption="図の下に出す短いキャプション"
  kind="diagram"   {/* "diagram"=技術図／画面図, "concept"=比喩イラスト */}
/>
```

- `src` は必ず `image/ファイル名.webp`（レッスンと同じ `courses/<slug>/image/` に置く）。
- `alt` は**具体的に**書く。これがそのまま「どんな絵を用意すべきか」の発注書になる。
- 抽象概念は `kind="concept"`（例え話のイラスト）、画面・構成・対応は `kind="diagram"`。
- 画像作成手順は `README.md`「レッスン用画像」を参照（`originals/*.png` → `pnpm run optimize:images` で `*.webp` 生成）。

`**image/list.md`（コースごとに必須）:** 各コースの `courses/<slug>/image/` フォルダには必ず `list.md` を置く。手本は `courses/abap-training/image/list.md`。

`list.md` に含める内容:

1. **使い方・ルール**（originals/webp/pnpm コマンドの説明）
2. **共通キャラクター**（teacher/student-a/student-b の説明＋生成プロンプト）
3. **各レッスンのセクション**（章ごとに以下を記載）:
  - テーブル: `ファイル名 / 種別(concept|diagram) / 使用スライド / 内容（alt）`
  - 各ファイルに対応した **英語の画像生成プロンプト**をコードブロックで記載
    - `concept` 画像 → AI 生成可。`flat vector, light background, no text, 16:9` を基本に具体的に書く
    - `diagram` 画像 → Figma/draw.io 推奨の注記を入れる。AI 生成可能な場合はプロンプトも添える
    - プロンプトは**発注書として機能する精度**で書く（左右に何がある・矢印の向き・パレット・縦横比まで）

`list.md` の目的: ①画像インデックス（揃っているか確認）、②**発注書**（プロンプトをそのままコピーして生成AIに投げられる状態）。

**コード:**

```tsx
<CodeBlock code={`REPORT z_hello.\nWRITE 'こんにちは'.`} />
```

**図（Mermaid）:**

```tsx
<MermaidDiagram chart={`flowchart LR\n  A --> B`} />
```

**メタ（概要スライド）:**

```tsx
<LessonMeta items={[
  { icon: "⏱", text: "15分" },
  { icon: "📶", text: "初学者" },
  { icon: "🏷", text: "ABAP研修" },
]} />
```

新しいコンポーネントのスタイルは作らないこと。

---

## 6. 確認テスト

```tsx
<Quiz
  answer={1}
  explanation="解説文（2〜3文。なぜ正解か／なぜ他が違うか）"
  question={<strong>問題文</strong>}
  options={["選択肢A", "選択肢B", "選択肢C"]}
/>
<Dialog speaker="closing">今日のひとこと（励まし）</Dialog>
```

- `Quiz` と `LessonQuiz` は同じ（テンプレートは `LessonQuiz`、手本は `Quiz`）
- `answer` は 0 始まりインデックス。`explanation` は必須
- 1レッスン 1〜3 問。スライドタイトルは `**確認テスト**` または `**理解度チェック**`
- `plainText` に `Q1 … → 答えの要約` と `今日のひとこと：…` を書く（手本: `00-introduction.tsx`）

---

## 7. コース・レッスンの登録

**必須:** `courses/<slug>/course.json` にレッスンを追加する（手本: `courses/abap-training/course.json`）。一覧ページと前後ナビはここから自動生成される。

```json
{
  "title": "コース名",
  "active": true,
  "description": "説明文",
  "lessons": [
    { "file": "02-business-basics", "title": "会計の基本 — …", "meta": "初学者 · 20分" }
  ],
  "courseTest": [
    { "file": "16-final-assessment", "title": "総仕上げ — …", "meta": "初学者 · 60分" }
  ],
  "additionalContent": [
    { "file": "14-sap-development-tools", "title": "…", "meta": "…" }
  ],
  "specialContent": [
    { "file": "92-exercise-journal-ledger", "title": "特別演習① — …", "meta": "特別 · 45分" },
    { "file": "93-exercise-journal-ledger-detail", "title": "…", "meta": "…", "lock": { "requires": "course", "password": "…", "mode": "any" } }
  ]
}
```

- `file` は拡張子なし（`02-business-basics.tsx` に対応）
- 配列の並び = 学習順・前後リンク
- `lessons` = 本編、`courseTest` = 総合テスト、`additionalContent` = 補足、`specialContent` = 演習・ロック付きコンテンツ

`src/pages/index-page.tsx` を直接編集する必要はない（`course.json` がソースオブトゥルース）。

---

## 8. 品質バー（abap-training と同じ密度）

「動く」だけでなく、**plainText / blocks / image / dialogs** の4要素で初学者が読んで分かること。以下は手本コースから抽出した具体基準。

### plainText

- 全スライドに設定。`content` の地の文・`Dialog` 全文・リスト・`InfoPanel` の要点・図の説明を**省略せず**改行区切りで写す。
- 1行目はスライドの見出し相当（例: `たとえ：棚と机`）。概要スライドは `⏱` / `📶` / `🏷` と目標リストも含める。
- 話者ラベル: `先生:` / `Aくん:` / `Bちゃん:` / `つまずき:`（`Dialog speaker="stumble"` と対応）
- 確認テストスライド: `Q1 … → 正解の要約` を列挙し、末尾に `今日のひとこと：…`（`closing` の文言）

### blocks

- 並列項目 → `<ul>` / `<ol>`。早見表・コマンド一覧 → `InfoPanel variant="reference"`。キーワードまとめ → `Callout variant="tip"`。
- 注意・よくある誤解 → `Callout variant="warning"` または `Dialog speaker="stumble"`（セリフは Dialog に限る）。
- 長い答え・完成コード → `Reveal` で段階表示（演習レッスン）。

### image

- レッスンあたり `**Figure` 1 枚以上**（典型 **2 枚**）。先に JSX を置き、画像は `image/list.md` のプロンプトで後追い可。
- 比喩・たとえ → `kind="concept"`。テーブル対応・画面・すき間図 → `kind="diagram"`。
- 処理フロー → タイトル `**図解：…`** のスライドで `MermaidDiagram`（`Figure` と併用可）。

### dialogs

- ペダゴジー: **先生**が要点 → **Aくん**（理屈）→ **Bちゃん**（生活の比喩）。必要なら **stumble** で誤解を先回り。
- 標準レッスンは **「対話で整理」** スライドで章を締める（先生・A・B がそれぞれ1本以上）。
- 確認テストの最後に `**Dialog speaker="closing"`**（励まし）。
- 登場人物のセリフに `Callout` は使わない。

### その他

- **スライド数 8〜18。** 薄い1枚に詰めず、概念ごとに分割。
- `**Quiz` の `explanation` は 2〜3 文**（なぜ正解か／なぜ他が違うか／実務での効き）。
- **比喩は既知のものに結ぶ**（家計簿＝仕訳日記帳、棚と机＝内部テーブルと作業領域、など）。
- **業務 → システム → ABAP** の順を崩さない（ABAP コースの場合）。

---

## 10. レッスン種別（abap-training）


| 種別     | course.json         | 例                     | 備考                              |
| ------ | ------------------- | --------------------- | ------------------------------- |
| 本編     | `lessons`           | `00`...               | §3 の型に準拠。「対話で整理」推奨              |
| コーステスト | `courseTest`        | `40-final-assessment` | `16-assessment-data.ts` 等と連携可   |
| 追加     | `additionalContent` | `50`...               | スライド多め可。「対話で整理」は任意（`15` は省略例）   |
| 特別演習   | `specialContent`    | `90`...               | `CodeBlock` / `Reveal` 中心。長文 OK |


演習・追加コンテンツも **4要素**は満たすが、スライド数・「対話で整理」の有無は上表のとおり柔軟でよい。

---

## 9. 完成前チェックリスト

- `courses/<slug>/NN-kebab-title.tsx` を `template/lesson-template.tsx` からコピーした
- `export const lessonMeta` + `lessonChrome("<slug>", "<file>", lessonMeta.title)` が正しい
- `courses/<slug>/course.json` に `file` / `title` / `meta` を追加し、並び順が学習順になっている
- 概要スライド（`LessonMeta` + 「この章で学ぶこと」）
- 各スライドに `title`、`content`、`**plainText`（abap-training と同密度・話者ラベル可）**
- `**blocks`:** `Callout` / `InfoPanel` / リスト / `CodeBlock` / `Reveal` を適宜使用
- `**image`:** `Figure` 1枚以上（典型2）。`図解：…` で Mermaid があるとより手本に近い
- `**dialogs`:** レッスン全体で対話が厚い。本編なら **「対話で整理」** + 確認テストに `closing`
- `CharacterIntro` はコース初回レッスンのみ（2章目以降で不要なら入れない）
- `export default function …()` + `mountLesson(…)`。import は `../../src/lesson`
- `Quiz` 1〜3 問、`explanation` 手厚い
- **§8・§10** を満たす（4要素・8〜18スライド目安）
- `Figure` の `alt` 具体・`src="image/….webp"`・`courses/<slug>/image/list.md` にプロンプト追記
- `pnpm typecheck` と `pnpm build` が通る

