import fs from 'node:fs';
import path from 'node:path';

function htmlShell(scriptHref) {
  return `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${scriptHref}"></script>
  </body>
</html>
`;
}

/**
 * レッスン .tsx 用の HTML をビルド時に生成し、dev では仮想ルートで配信する。
 * ルート index はプロジェクト直下の index.html を使う（Vite 標準）。
 */
export function tsxMpaPlugin({ root, lessonsDir }) {
  const indexHtml = path.resolve(root, 'index.html');

  /** @type {{ tsxPath: string, htmlOut: string }[]} */
  const lessons = [];

  for (const f of fs.readdirSync(lessonsDir)) {
    if (!f.endsWith('.tsx')) continue;
    const base = f.replace('.tsx', '');
    lessons.push({
      tsxPath: path.resolve(lessonsDir, `${base}.tsx`),
      htmlOut: `abap-taining/${base}.html`,
    });
  }

  const input = {
    index: indexHtml,
    ...Object.fromEntries(
      lessons.map((p) => {
        const key = p.htmlOut.replace(/\.html$/, '').replace(/\//g, '-');
        return [key, p.tsxPath];
      })
    ),
  };

  return {
    name: 'tsx-mpa',
    config() {
      return { build: { rollupOptions: { input } } };
    },
    configureServer(server) {
      // Vite の index フォールバックより先に実行する（後ろだと一覧 index.html が返る）
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split('?')[0]?.replace(/\/$/, '') ?? '';
        const page = lessons.find((p) => pathname === `/${p.htmlOut}`);
        if (!page) return next();

        const scriptSrc = `/${path.relative(root, page.tsxPath).replace(/\\/g, '/')}`;
        const url = req.originalUrl ?? req.url ?? pathname;

        try {
          // @vitejs/plugin-react の preamble / @vite/client を注入する（素の HTML だと HMR が壊れる）
          const html = await server.transformIndexHtml(url, htmlShell(scriptSrc));
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(html);
        } catch (err) {
          next(err);
        }
      });
    },
    generateBundle(options, bundle) {
      const base = options.base?.replace(/\/$/, '') || '';
      const basePrefix = base ? `${base}/` : '/';

      for (const page of lessons) {
        const chunk = Object.values(bundle).find(
          (item) =>
            item.type === 'chunk' &&
            item.isEntry &&
            item.facadeModuleId === page.tsxPath
        );
        if (!chunk) continue;

        this.emitFile({
          type: 'asset',
          fileName: page.htmlOut,
          source: htmlShell(basePrefix + chunk.fileName),
        });
      }
    },
  };
}
