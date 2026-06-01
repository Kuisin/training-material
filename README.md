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

| URL | 内容 |
|-----|------|
| `/index.html` | コース／レッスン一覧 |
| `/abap-taining/00-introduction.html` | 各レッスン |

ポート 5173 が他プロセスで使われている場合、Vite は別ポート（5174 など）を使います。**表示されたポートを必ず確認してください。**

### GitHub Pages と同じパスでローカル確認

公開先はプロジェクトサイト（`/training-material/` 配下）です。

```bash
pnpm dev:pages          # http://localhost:5173/training-material/
pnpm run preview:pages  # ビルド後の本番同等プレビュー
```

## 公開（GitHub Pages）

`main` へ push すると Actions が自動デプロイします。

- 公開 URL: **https://kuisin.github.io/training-material/**
- ワークフローは `BASE_PATH=/<リポジトリ名>/` でビルドします（リポジトリ名を変えた場合は `package.json` の `dev:pages` / `preview:pages` も合わせて更新）

## ビルド・プレビュー

```bash
pnpm build              # ローカル用（base: /）
pnpm preview            # http://localhost:4173/

pnpm run build:pages    # GitHub Pages 用（base: /training-material/）
pnpm run preview:pages  # Pages と同じ URL で確認
```

## 構成

| パス | 役割 |
|------|------|
| `index.html` + `index.tsx` | レッスン一覧 |
| `abap-taining/*.tsx` | 各レッスンのスライド本文 |
| `src/render-lesson.tsx` | レッスン用スライドショーエンジン |
| `vite-mpa-plugin.js` | レッスン用 HTML をビルド／dev で生成 |

新規レッスンは `template/lesson-template.tsx` をコピー。詳細は `AI-LESSON-RULES.md` を参照。

## レッスン用画像

| 場所 | 用途 |
|------|------|
| `courses/<slug>/image/originals/*.png` | 原画（リポジトリに保持、サイトには出さない） |
| `courses/<slug>/image/*.webp` | 配信用（`Figure` の `src` で参照） |
| `assets/characters/originals/*.png` | キャラ原画 |
| `public/characters/*.webp` | キャラ配信用 |

原画を `originals/` に置いたあと、WebP を生成します（幅最大 1400px / アバター 256px）。

```bash
pnpm run optimize:images        # 新規・更新された PNG だけ変換
pnpm run optimize:images -- --force   # すべて再生成
```

レッスン TSX では `src="image/ファイル名.webp"` を指定してください。
