# 研修教材（training-material）

Vite + React + Tailwind のスライド型研修教材。

## セットアップ

```bash
pnpm install
```

## 開発

```bash
pnpm dev
```

ブラウザで **ターミナルに表示された URL** を開く（通常 `http://localhost:5173/`）。

- `/` … レッスン一覧
- `/abap-taining/00-introduction.html` … 各レッスン（ビルド後も同じパス）

ポート 5173 が他プロセスで使われている場合、Vite は別ポート（5174 など）を使います。**表示されたポートを必ず確認してください。**

## ビルド・プレビュー

```bash
pnpm build
pnpm preview   # http://localhost:4173/
```

## 構成

| パス | 役割 |
|------|------|
| `index.html` + `index.tsx` | レッスン一覧 |
| `abap-taining/*.tsx` | 各レッスンのスライド本文 |
| `src/render-lesson.tsx` | レッスン用スライドショーエンジン |
| `vite-mpa-plugin.js` | レッスン用 HTML をビルド／dev で生成 |

新規レッスンは `template/lesson-template.tsx` をコピー。詳細は `AI-LESSON-RULES.md` を参照。
