// ============================================================================
//  レッスン共有エンジン（React + TSX コンポーネント版）
//  ----------------------------------------------------------------------------
//  各レッスンHTMLは従来どおり「中身（#deck 内の .slide）」と <body> の data-* だけを
//  持てばよい。上部バー・コントロール・ジャンプメニュー・進捗バー・AIボタン・
//  スライド送り・Mermaid・確認テストは、すべて TSX コンポーネントが生成・描画する。
//  既存レッスンの HTML はそのまま動く（パーサーが callout/quiz/code/mermaid を
//  対応するコンポーネントへ変換する）。
// ============================================================================
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Deck } from "./components/deck";
import type { LessonChrome, SlideData } from "./lib/types";
import "./styles.css";

function readSlides(): SlideData[] {
  const sections = document.querySelectorAll<HTMLElement>("#deck .slide");
  return [...sections].map((section, i) => ({
    title: section.dataset.title?.trim() || `スライド ${i + 1}`,
    html: section.innerHTML,
  }));
}

function readChrome(): LessonChrome {
  const { title, next, prev, index } = document.body.dataset;
  const resolved = (title || document.title || "").trim();
  if (resolved) document.title = resolved;
  return {
    title: resolved,
    nextHref: (next ?? "").trim(),
    prevHref: (prev ?? "").trim(),
    indexHref: (index ?? "../index.html").trim(),
  };
}

function boot() {
  const slides = readSlides();
  const chrome = readChrome();

  // 読み取り後、素の #deck は DOM から取り除く（重複コンテンツ・a11y ノイズを防ぐ）。
  document.getElementById("deck")?.remove();

  const mount = document.createElement("div");
  mount.id = "app";
  document.body.appendChild(mount);
  document.body.classList.add("ready");

  createRoot(mount).render(
    <StrictMode>
      <Deck chrome={chrome} slides={slides} />
    </StrictMode>
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
