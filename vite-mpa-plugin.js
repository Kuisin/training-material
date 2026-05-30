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
      // 内部ミドルウェアの後に実行し、レッスン HTML だけを補完する
      return () => {
        server.middlewares.use((req, res, next) => {
          const pathname = req.url?.split('?')[0] ?? '';
          const page = lessons.find((p) => pathname === `/${p.htmlOut}`);
          if (!page) return next();

          const scriptSrc = `/${path.relative(root, page.tsxPath).replace(/\\/g, '/')}`;
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(htmlShell(scriptSrc));
        });
      };
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
