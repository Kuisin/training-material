import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const root = dirname(fileURLToPath(import.meta.url));
const lessonsDir = resolve(root, 'abap-taining');

// マルチページ構成: ルートのメニュー + 各レッスンHTML を入口として列挙する。
// レッスンを追加しても、ここは自動でひろうので編集不要。
const input = { index: resolve(root, 'index.html') };
for (const f of fs.readdirSync(lessonsDir)) {
  if (f.endsWith('.html')) input[`lesson-${f.replace('.html', '')}`] = resolve(lessonsDir, f);
}

export default defineConfig({
  // GitHub Pages のプロジェクトサイトでは /<repo>/ がベースになる。
  // CI から BASE_PATH を渡す（未指定ならローカル用に '/'）。
  base: process.env.BASE_PATH || '/',
  build: {
    outDir: 'dist',
    rollupOptions: { input },
  },
});
