import fs from 'node:fs';
import path from 'node:path';

function htmlShell(scriptHref, cssHrefs = []) {
  const cssLinks = cssHrefs
    .map((href) => `    <link rel="stylesheet" crossorigin href="${href}">`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
${cssLinks ? `${cssLinks}\n` : ''}  </head>
  <body>
    <div id="root"></div>
    <script type="module" crossorigin src="${scriptHref}"></script>
  </body>
</html>
`;
}

/** HTML 出力位置からアセットへの相対 URL（GitHub Pages の /repo/ 配下でも動く） */
function assetHrefFromHtml(htmlOut, assetFile) {
  const htmlDir = path.dirname(htmlOut);
  return path.relative(htmlDir, assetFile).replace(/\\/g, '/');
}

/** エントリ chunk とその静的 import 先から CSS を再帰収集（共有 chunk 内の styles.css 用） */
function collectImportedCss(chunk, bundle, visited = new Set()) {
  if (!chunk || visited.has(chunk.fileName)) return [];
  visited.add(chunk.fileName);

  const css = chunk.viteMetadata?.importedCss
    ? [...chunk.viteMetadata.importedCss]
    : [];

  for (const id of chunk.imports ?? []) {
    const dep = bundle[id];
    if (dep?.type === 'chunk') {
      css.push(...collectImportedCss(dep, bundle, visited));
    }
  }

  return css;
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

  /** @type {string} */
  let base = '/';

  return {
    name: 'tsx-mpa',
    config() {
      return { build: { rollupOptions: { input } } };
    },
    configResolved(config) {
      base = config.base;
    },
    configureServer(server) {
      // Vite の index フォールバックより先に実行する（後ろだと一覧 index.html が返る）
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split('?')[0]?.replace(/\/$/, '') ?? '';
        const basePrefix = base.endsWith('/') ? base.slice(0, -1) : base;
        const pathWithoutBase =
          basePrefix && pathname.startsWith(basePrefix)
            ? pathname.slice(basePrefix.length) || '/'
            : pathname;
        const page = lessons.find(
          (p) =>
            pathWithoutBase === `/${p.htmlOut}` ||
            pathWithoutBase === `/${p.htmlOut.replace(/\.html$/, '')}`
        );
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
    generateBundle(_options, bundle) {
      for (const page of lessons) {
        const chunk = Object.values(bundle).find(
          (item) =>
            item.type === 'chunk' &&
            item.isEntry &&
            item.facadeModuleId === page.tsxPath
        );
        if (!chunk) continue;

        const scriptHref = assetHrefFromHtml(page.htmlOut, chunk.fileName);
        const cssHrefs = [...new Set(collectImportedCss(chunk, bundle))].map(
          (file) => assetHrefFromHtml(page.htmlOut, file)
        );

        this.emitFile({
          type: 'asset',
          fileName: page.htmlOut,
          source: htmlShell(scriptHref, cssHrefs),
        });
      }
    },
  };
}
