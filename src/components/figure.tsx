import { useState } from "react";

interface FigureProps {
  /** 画像パス（HTML から見た相対 URL、例: "image/05-shelf-desk.png"） */
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

/**
 * レッスン用の画像表示。画像がまだ無い場合は「準備中」のプレースホルダを表示し、
 * 用意するファイル名（src）と内容（alt）を示す。画像を courses/<slug>/image/ に置けば自動で差し替わる。
 */
export function Figure({ src, alt, caption, kind = "diagram" }: FigureProps) {
  const [failed, setFailed] = useState(false);

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
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="mx-auto max-h-[60vh] w-full max-w-3xl rounded-xl border border-slate-200 bg-white object-contain shadow-sm dark:border-slate-700 dark:bg-slate-800/40"
        />
      )}
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
