# AIレッスン生成ルール

**対象読者:** 研修教材を生成するAI。レッスンを作成するたびに、**毎回**このルールに従うこと。
各レッスンは **1つの `.tsx` ファイル**（React + Tailwind）。Vite がビルドし、ブラウザでは `.html` として配信される。

---

## 1. 絶対ルール（厳守）

1. **1レッスン = 1つの `.tsx` ファイル**。必ず `template/lesson-template.tsx` を**コピー**して作る。
2. **各レッスンは default export の React コンポーネント**（Next.js の page と同様）。`<Lesson>` で `chrome` と `slides` を渡し、末尾で `mountLesson(YourLesson)` を呼ぶ。ナビ・進捗・ジャンプメニューは共有 `Deck` が描画する。
3. **1スライド = `slides` 配列の1要素。** `title`（ジャンプメニュー用）と `content`（JSX）と `plainText`（Copilot コピー用）を必ず設定する。
4. **編集してはいけない部分:** `src/mount-lesson.tsx`、`src/components/deck.tsx`、`src/components/lesson.tsx` など共有エンジン。レッスン `.tsx` では `Lesson` の props（`chrome` / `slides`）だけを書く。
5. **import は `src/lesson.tsx` から統一。** `Callout` なども同ファイルから import する（個別パス import は使わない）。見た目は共有コンポーネント（Tailwind）のみ。独自 CSS は書かない。
6. **各レッスンに必ず含めるもの:** 概要スライド、本文スライド、**図（Mermaid または `Figure`）を1つ以上**、**確認テストのスライドを1つ以上**。
7. **ビルド前提。** 開発は `pnpm dev`、公開は `pnpm build`。
8. **品質の基準は `courses/abap-taining/` を手本にする。** 新規・改訂どちらも、abap-taining と同じ密度（登場人物の対話・図・リスト・手厚い解説）を満たすこと。薄い箇条書きだけのスライドにしない（§9 を必ず確認）。

---

## 2. ファイル・命名規則

```
training-material/
├─ AI-LESSON-RULES.md
├─ index.html                     # 一覧ページの Vite エントリ（ルート / 用）
├─ index.tsx                      # レッスン一覧（React）
├─ template/
│  └─ lesson-template.tsx         # 全レッスンはこれをコピー
├─ src/
│  ├─ lesson.tsx                  # レッスン用の統一 import（Lesson, Callout, mountLesson, …）
│  ├─ mount-lesson.tsx            # Vite MPA エントリ（#root へマウント）
│  ├─ components/lesson.tsx       # レッスン共通ラッパー（Deck + title）
│  └─ components/                 # Callout, Quiz, CodeBlock, …
└─ <track>/                       # 例: abap-taining/
   ├─ 00-introduction.tsx         # レッスン本文（編集するのはこれのみ）
   └─ assets/                     # 画像が必要な場合のみ
```

- ファイル名: `NN-kebab-case-title.tsx`
- **ナビ URL は手書きしない。** `lessonChrome(courseSlug, lessonFile, title)` を使う（`src/lib/courses.ts` が GitHub Pages の `/repo/` とローカルの `/` の両方で正しい URL を組み立てる）。

---

## 3. スライド構成（この順番で）

1. **スライド1 — 概要:** タイトル、1行サマリー、`LessonMeta`、目標 2〜4 個。
2. **本文スライド** — 1スライド1概念。`h2`、短文、`Callout`、`CodeBlock`、図。
3. **図** — 少なくとも1枚に `MermaidDiagram`（§5）。
4. **確認テスト** — 最後に `Quiz` を 1〜3 問（§6）。

目安: **5〜12 スライド**。文体は簡潔・例中心・初心者向け。

---

## 4. スライドショーの仕組み（共有エンジンが提供）

- 次へ／前へ、キーボード、`#s3` ディープリンク、進捗バー、ジャンプメニュー、Copilot ボタンはすべて `Deck` が担当。
- レッスン側は `slides` を並べるだけ。

---

## 5. 使える TSX コンポーネント

```tsx
import {
  Lesson,
  Callout,
  Dialog,
  CharacterIntro,
  InfoPanel,
  CodeBlock,
  Quiz,
  MermaidDiagram,
  Figure,
  LessonMeta,
  lessonChrome,
  mountLesson,
} from "../src/lesson";

const lessonMeta = { title: "章タイトル" };

export default function MyLesson() {
  return (
    <Lesson
      chrome={lessonChrome("abap-taining", "01-overview", lessonMeta.title)}
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
通常の会話は `Dialog`、章の最初の自己紹介スライドだけ `CharacterIntro` を使う。

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

**`image/list.md`（コースごとに必須）:** 各コースの `courses/<slug>/image/` フォルダには必ず `list.md` を置く。手本は `courses/abap-taining/image/list.md`。

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
  explanation="解説文"
  question={<strong>問題文</strong>}
  options={["選択肢A", "選択肢B", "選択肢C"]}
/>
```

- `answer` は 0 始まりインデックス
- `explanation` は必須
- 1レッスン 1〜3 問

---

## 7. インデックスへの登録

`src/pages/index-page.tsx` の `ABAP_LESSONS`（または該当トラック配列）に追加:

```tsx
{ num: "2", href: "abap-taining/02-business-basics.html", title: "仕訳日記帳と会計伝票", meta: "初学者 · 20分" },
```

`href` はビルド後の `.html` パス（Vite が `.tsx` から生成）。

---

## 8. 品質バー（毎回これを満たす）

**手本は `courses/abap-taining/`。** 「動く」だけでなく、初学者が読んで分かる密度にすること。

1. **登場人物で説明する。** 概念を地の文だけで終わらせない。`先生`が要点を言い、`Aくん`（理屈）と`Bちゃん`（例え話）が別角度で受け、必要なら`stumble`でつまずきを先回りする。**各本文スライドに最低1つは `Dialog`** を入れるのが目安。章の最初に `CharacterIntro` で3人を紹介する。
2. **図と画像を惜しまない。** 1レッスンに **`Figure` を1〜3枚**目安で入れる（画像が無くてもプレースホルダが出るので先に置く）。比喩は `kind="concept"`、画面・構成・対応表は `kind="diagram"` か `MermaidDiagram`。「言葉で説明したこと」は必ず図でも見せる。
3. **箇条書き＋表で構造化する。** 並列する項目は `<ul>`/`<ol>`、対応関係（コード↔用途、症状↔対処、キー↔意味）は `InfoPanel` 内の `<table>`。ベタ書きの長文にしない。
4. **スライド数の目安は 6〜11。** 1スライド1概念。概要 → 登場人物紹介 → 本文（各概念）→ まとめ/対話 → 確認テスト。
5. **確認テストの `explanation` は手厚く。** 「なぜ正解か」だけでなく「なぜ他が違うか／実務でどう効くか」まで2〜3文で書く。1レッスン 2〜3 問。
6. **比喩は具体的に。** ATM＝GUI、内線番号＝T-code、ブラウザのタブ＝セッション のように、初学者が既に知っているものに必ず結びつける。
7. **`plainText` も本文と同じ密度で。** Copilot コピー用なので、対話・リストの中身も改行区切りで写す（見出しだけにしない）。

---

## 9. 完成前チェックリスト

- [ ] `<track>/NN-kebab-title.tsx` で、`template/lesson-template.tsx` からコピーした
- [ ] `chrome` の `title` / `prevHref` / `nextHref` が正しい
- [ ] 概要スライドあり（`LessonMeta` + 目標リスト）
- [ ] 各スライドに `title`、`content`、`plainText`
- [ ] `export default function …()` + `mountLesson(…)` の形になっている
- [ ] import は `../src/lesson` から統一している
- [ ] 図（Mermaid か `Figure`）が1つ以上、確認テストが1つ以上
- [ ] **§8 の品質バーを満たす**（対話・画像・リスト・手厚い解説・6〜11スライド）
- [ ] `Figure` の `alt` を具体的に書き、画像ファイル名を `image/NN-...webp` で統一した
- [ ] `courses/<slug>/image/list.md` に全 `Figure` のエントリと英語生成プロンプトを追記した
- [ ] `index-page.tsx`（または `course.json`）にレッスンを登録した
- [ ] `pnpm typecheck` と `pnpm build` が通る
