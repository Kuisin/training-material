/**
 * Vite `base`（GitHub Pages: /repo/、ローカル dev: /）配下の絶対パスを組み立てる。
 * ナビ・画像・public アセットはすべてここ経由にすると環境差が出ない。
 */
export function appHref(path: string): string {
  const base = import.meta.env.BASE_URL;
  const normalized = path.replace(/^\//, "");
  return `${base}${normalized}`;
}

/** レッスン HTML（例: abap-taining/00-introduction.html） */
export function lessonPageHref(courseSlug: string, lessonFile: string): string {
  const file = lessonFile.replace(/\.html$/i, "");
  return appHref(`${courseSlug}/${file}.html`);
}

/** コース内の図（例: image/05-shelf-desk.webp） */
export function courseFigureHref(courseSlug: string, relativeSrc: string): string {
  return appHref(`${courseSlug}/${relativeSrc.replace(/^\//, "")}`);
}

/** public/characters 配下 */
export function characterAvatarHref(avatarFile: string): string {
  return appHref(`characters/${avatarFile}`);
}
