import { useCallback, useEffect, useState } from "react";
import type { LessonChrome, SlideData } from "../lib/types";
import { ProgressBar } from "./progress-bar";
import { TopBar } from "./top-bar";
import { Controls } from "./controls";
import { SlideMenu } from "./slide-menu";
import { AiAskButton } from "./ai-ask-button";
import { Slide } from "./slide";

interface DeckProps {
  chrome: LessonChrome;
  slides: SlideData[];
}

function initialIndex(total: number): number {
  const match = location.hash.match(/^#s(\d+)/);
  if (!match) return 0;
  return Math.min(Math.max(Number(match[1]) - 1, 0), total - 1);
}

export function Deck({ chrome, slides }: DeckProps) {
  const total = slides.length;
  const [idx, setIdx] = useState(() => initialIndex(total));
  const [menuOpen, setMenuOpen] = useState(false);

  const go = useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 0), total - 1);
      setIdx(clamped);
      history.replaceState(null, "", `#s${clamped + 1}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [total]
  );

  const goNext = useCallback(() => {
    if (idx === total - 1) {
      if (chrome.nextHref) location.href = chrome.nextHref;
    } else go(idx + 1);
  }, [idx, total, chrome.nextHref, go]);

  const goPrev = useCallback(() => {
    if (idx === 0) {
      if (chrome.prevHref) location.href = chrome.prevHref;
    } else go(idx - 1);
  }, [idx, chrome.prevHref, go]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === "PageDown") goNext();
      else if (e.key === "ArrowLeft" || e.key === "PageUp") goPrev();
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(total - 1);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, go, total]);

  // 外部からのハッシュ変更（URL 直接編集・戻る/進む）にも追従する。
  useEffect(() => {
    function onHash() {
      const match = location.hash.match(/^#s(\d+)/);
      if (match) setIdx(Math.min(Math.max(Number(match[1]) - 1, 0), total - 1));
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [total]);

  return (
    <div className="min-h-dvh pb-20">
      <ProgressBar ratio={(idx + 1) / total} />
      <TopBar
        title={chrome.title}
        current={idx + 1}
        total={total}
        indexHref={chrome.indexHref}
        onOpenMenu={() => setMenuOpen(true)}
      />
      <AiAskButton title={chrome.title} slides={slides} />

      <main className="mx-auto w-full max-w-3xl px-5 py-8">
        <Slide slide={slides[idx]} />
      </main>

      <SlideMenu
        open={menuOpen}
        slides={slides}
        current={idx}
        onSelect={(i) => {
          go(i);
          setMenuOpen(false);
        }}
        onClose={() => setMenuOpen(false)}
      />

      <Controls
        current={idx}
        total={total}
        hasPrevChapter={Boolean(chrome.prevHref)}
        hasNextChapter={Boolean(chrome.nextHref)}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  );
}
