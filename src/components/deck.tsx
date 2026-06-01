import { useCallback, useEffect, useState } from "react";
import type { AdjacentLesson, LessonChrome, SlideDefinition } from "../lib/types";
import { ProgressBar } from "./progress-bar";
import { TopBar } from "./top-bar";
import { Controls } from "./controls";
import { SlideMenu } from "./slide-menu";
import { AiAskButton } from "./ai-ask-button";
import { CourseSearchDialog } from "./course-search";
import { Slide } from "./slide";
import { courseSlugFromPathname } from "../lib/course-search";
import { LessonCompleteButton } from "./lesson-complete-button";

function lessonFileFromPath(pathname: string): string {
  const last = pathname.split("/").filter(Boolean).pop() ?? "";
  return last.replace(/\.html$/i, "");
}

interface DeckProps {
  chrome: LessonChrome;
  slides: SlideDefinition[];
}

function initialIndex(total: number): number {
  if (location.hash === "#last") return Math.max(total - 1, 0);
  const match = location.hash.match(/^#s(\d+)/);
  if (!match) return 0;
  return Math.min(Math.max(Number(match[1]) - 1, 0), total - 1);
}

function chapterConfirmMessage(direction: "prev" | "next", lesson: AdjacentLesson): string {
  const label = direction === "prev" ? "前の章" : "次の章";
  return `${label}（レッスン ${lesson.num}: ${lesson.title}）に移動しますか？`;
}

function navigateToChapter(href: string, hash: "" | "#last") {
  location.href = hash ? `${href}${hash}` : href;
}

export function Deck({ chrome, slides }: DeckProps) {
  const total = slides.length;
  const [idx, setIdx] = useState(() => initialIndex(total));
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const courseSlug = courseSlugFromPathname(window.location.pathname);
  const lessonFile = lessonFileFromPath(window.location.pathname);
  const isLastSlide = idx === total - 1;

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
      if (!chrome.nextHref || !chrome.nextLesson) return;
      if (!window.confirm(chapterConfirmMessage("next", chrome.nextLesson))) return;
      navigateToChapter(chrome.nextHref, "");
    } else go(idx + 1);
  }, [idx, total, chrome.nextHref, chrome.nextLesson, go]);

  const goPrev = useCallback(() => {
    if (idx === 0) {
      if (!chrome.prevHref || !chrome.prevLesson) return;
      if (!window.confirm(chapterConfirmMessage("prev", chrome.prevLesson))) return;
      navigateToChapter(chrome.prevHref, "#last");
    } else go(idx - 1);
  }, [idx, chrome.prevHref, chrome.prevLesson, go]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        if (courseSlug) {
          e.preventDefault();
          setSearchOpen(true);
        }
        return;
      }
      if (searchOpen) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") goNext();
      else if (e.key === "ArrowLeft" || e.key === "PageUp") goPrev();
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(total - 1);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, go, total, searchOpen, courseSlug]);

  // 外部からのハッシュ変更（URL 直接編集・戻る/進む）にも追従する。
  useEffect(() => {
    function onHash() {
      if (location.hash === "#last") {
        setIdx(Math.max(total - 1, 0));
        return;
      }
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
        lessonNum={chrome.lessonNum}
        title={chrome.title}
        current={idx + 1}
        total={total}
        indexHref={chrome.indexHref}
        onOpenMenu={() => setMenuOpen(true)}
        onOpenSearch={courseSlug ? () => setSearchOpen(true) : undefined}
      />
      <AiAskButton title={chrome.title} slides={slides} />

      <main className="mx-auto w-full max-w-3xl px-5 py-8">
        <Slide slide={slides[idx]} />
        {isLastSlide && courseSlug && lessonFile ? (
          <LessonCompleteButton courseSlug={courseSlug} lessonFile={lessonFile} />
        ) : null}
      </main>

      <CourseSearchDialog
        open={searchOpen}
        courseSlug={courseSlug}
        onClose={() => setSearchOpen(false)}
      />

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
