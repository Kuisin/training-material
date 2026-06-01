/** Tailwind selectors for `<table>` inside not-prose panels (InfoPanel, Callout, Dialog, …). */
export const NESTED_TABLE_STYLES =
  "[&_table]:my-2 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_table]:text-left " +
  "[&_thead]:bg-black/5 dark:[&_thead]:bg-white/10 " +
  "[&_th]:border [&_th]:border-current/25 [&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold [&_th]:text-left " +
  "[&_td]:border [&_td]:border-current/25 [&_td]:px-3 [&_td]:py-2 [&_td]:align-top";
