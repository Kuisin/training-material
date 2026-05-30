export const THEME_STORAGE_KEY = "training-theme";

export type Theme = "light" | "dark";

export function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** チラつき防止: React マウント前に html[data-theme] を合わせる。 */
export function applyStoredTheme(): void {
  document.documentElement.dataset.theme = getStoredTheme();
}
