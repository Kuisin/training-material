import { useMemo } from "react";
import { parseSlideHtml } from "../lib/parse-slide";
import type { SlideData } from "../lib/types";

interface SlideProps {
  slide: SlideData;
}

export function Slide({ slide }: SlideProps) {
  const content = useMemo(() => parseSlideHtml(slide.html), [slide.html]);
  return (
    <article
      key={slide.html}
      className="animate-slide-fade prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-h1:text-3xl prose-h2:text-2xl prose-a:text-brand prose-code:rounded prose-code:bg-slate-200/70 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.85em] prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-slate-700/70"
    >
      {content}
    </article>
  );
}
