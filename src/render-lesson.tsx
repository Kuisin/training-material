import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Deck } from "./components/deck";
import type { LessonChrome, SlideDefinition } from "./lib/types";
import { applyStoredTheme } from "./lib/theme";
import "./styles.css";

export function renderLesson(chrome: LessonChrome, slides: SlideDefinition[]): void {
  applyStoredTheme();
  if (chrome.title) document.title = chrome.title;

  let root = document.getElementById("root");
  if (!root) {
    root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
  }
  document.body.classList.add("ready");

  createRoot(root).render(
    <StrictMode>
      <Deck chrome={chrome} slides={slides} />
    </StrictMode>
  );
}
