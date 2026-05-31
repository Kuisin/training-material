import { useMemo, useState } from "react";
import { appHref, courseFigureHref } from "../lib/app-href";
import { cn } from "../lib/cn";

interface FigureProps {
  /** 画像パス（相対 URL、例: "image/05-shelf-desk.webp"） */
  src: string;
  /** 代替テキスト（読み上げ・画像欠落時の説明） */
  alt: string;
  /** 図の下に出す説明文（任意） */
  caption?: string;
  /** "concept"（やわらかい比喩イラスト）/ "diagram"（技術図）。枠の色味だけ変える */
  kind?: "concept" | "diagram";
}

const KIND_BADGE: Record<NonNullable<FigureProps["kind"]>, string> = {
  concept: "💡 イメージ図",
  diagram: "🛠 構成図",
};

/** レッスン URL からコース slug を推定し、図の絶対 URL を返す */
function resolveFigureSrc(relativeSrc: string): string {
  if (/^(https?:|data:)/i.test(relativeSrc)) {
    return relativeSrc;
  }

  if (relativeSrc.startsWith("image/")) {
    const base = import.meta.env.BASE_URL;
    const pathname = window.location.pathname;
    let pathWithoutBase =
      base !== "/" && pathname.startsWith(base)
        ? pathname.slice(base.length)
        : pathname;
    if (!pathWithoutBase.startsWith("/")) {
      pathWithoutBase = `/${pathWithoutBase}`;
    }
    const slug = pathWithoutBase.match(/^\/([^/]+)\//)?.[1];
    if (slug) {
      return courseFigureHref(slug, relativeSrc);
    }
  }

  if (relativeSrc.startsWith("/")) {
    return appHref(relativeSrc.slice(1));
  }

  return relativeSrc;
}

/**
 * レッスン用の画像表示。画像がまだ無い場合は「準備中」のプレースホルダを表示し、
 * 用意するファイル名（src）と内容（alt）を示す。画像を courses/<slug>/image/ に置けば自動で差し替わる。
 */
export function Figure({ src, alt, caption, kind = "diagram" }: FigureProps) {
  const resolvedSrc = useMemo(() => resolveFigureSrc(src), [src]);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <figure className="not-prose my-6">
      {failed ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center dark:border-slate-600 dark:bg-slate-800/40">
          <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            {KIND_BADGE[kind]}（準備中）
          </span>
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
            {src}
          </span>
          <span className="max-w-md text-sm text-slate-600 dark:text-slate-300">
            {alt}
          </span>
        </div>
      ) : (
        <div className="relative mx-auto min-h-48 max-w-3xl">
          {!loaded && (
            <div
              className="absolute inset-0 flex items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-800/40"
              aria-hidden
            >
              <span className="text-sm text-slate-500 dark:text-slate-400">画像を読み込み中…</span>
            </div>
          )}
          <img
            src={resolvedSrc}
            alt={alt}
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={cn(
              "mx-auto max-h-[60vh] w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm transition-opacity duration-200 dark:border-slate-700 dark:bg-slate-800/40",
              loaded ? "opacity-100" : "opacity-0"
            )}
          />
        </div>
      )}
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
