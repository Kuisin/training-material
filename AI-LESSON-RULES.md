# AIレッスン生成ルール

**対象読者:** 研修教材を生成するAI。レッスンを作成するたびに、**毎回**このルールに従うこと。
各レッスンは **1つの `.tsx` ファイル**（React + Tailwind）。Vite がビルドし、ブラウザでは `.html` として配信される。

---

## 1. 絶対ルール（厳守）

1. **1レッスン = 1つの `.tsx` ファイル**。必ず `template/lesson-template.tsx` を**コピー**して作る。
2. **各レッスンはスライドショー。** `renderLesson(chrome, slides)` でマウントする。ナビ・進捗・ジャンプメニューは共有 `Deck` が描画する。レッスン側では `slides` 配列だけを編集する。
3. **1スライド = `slides` 配列の1要素。** `title`（ジャンプメニュー用）と `content`（JSX）と `plainText`（Copilot コピー用）を必ず設定する。
4. **編集してはいけない部分:** `src/render-lesson.tsx`、`src/components/deck.tsx` など共有エンジン。レッスン `.tsx` では `chrome` と `slides` だけを書く。
5. **見た目は共有 TSX コンポーネント（Tailwind）から来る。** 独自 CSS は書かない。
6. **各レッスンに必ず含めるもの:** 概要スライド、本文スライド、**Mermaid 図を1つ以上**、**確認テストのスライドを1つ以上**。
7. **ビルド前提。** 開発は `pnpm dev`、公開は `pnpm build`。

---

## 2. ファイル・命名規則

```
traininig-material/
├─ AI-LESSON-RULES.md
├─ index.html                     # 一覧ページの Vite エントリ（ルート / 用）
├─ index.tsx                      # レッスン一覧（React）
├─ template/
│  └─ lesson-template.tsx         # 全レッスンはこれをコピー
├─ src/
│  ├─ render-lesson.tsx           # レッスン起動
│  └─ components/                 # Callout, Quiz, CodeBlock, …
└─ <track>/                       # 例: abap-taining/
   ├─ 00-introduction.tsx         # レッスン本文（編集するのはこれのみ）
   └─ assets/                     # 画像が必要な場合のみ
```

- ファイル名: `NN-kebab-case-title.tsx`
- `chrome.nextHref` / `chrome.prevHref` は隣の章へのパス（例: `"01-overview.html"`）。Vite ビルド後も `.html` URL のまま。
- `chrome.indexHref` は通常 `"../index.html"`

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
import { Callout } from "../src/components/callout";
import { Dialog } from "../src/components/dialog";
import { CodeBlock } from "../src/components/code-block";
import { Quiz } from "../src/components/quiz";
import { MermaidDiagram } from "../src/components/mermaid-diagram";
import { LessonMeta } from "../src/components/lesson-meta";
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
登場人物のセリフには `Callout` ではなく `Dialog` を使うこと（吹き出しアイコン＋話者バッジで区別）。

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

## 8. 完成前チェックリスト

- [ ] `<track>/NN-kebab-title.tsx` で、`template/lesson-template.tsx` からコピーした
- [ ] `chrome` の `title` / `prevHref` / `nextHref` が正しい
- [ ] 概要スライドあり（`LessonMeta` + 目標リスト）
- [ ] 各スライドに `title`、`content`、`plainText`
- [ ] Mermaid が1つ以上、確認テストが1つ以上
- [ ] `index-page.tsx` にレッスンリンクを追加した
- [ ] `pnpm typecheck` と `pnpm build` が通る
