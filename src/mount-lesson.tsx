import { StrictMode, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { applyStoredTheme } from "./lib/theme";
import "./styles.css";

/** Vite MPA エントリ: default export されたレッスンコンポーネントを #root にマウントする。 */
export function mountLesson(LessonPage: ComponentType): void {
  applyStoredTheme();
  document.body.classList.add("ready");

  let root = document.getElementById("root");
  if (!root) {
    root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
  }

  createRoot(root).render(
    <StrictMode>
      <LessonPage />
    </StrictMode>
  );
}
