import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IndexPage } from "./src/pages/index-page";
import { applyStoredTheme } from "./src/lib/theme";
import "./src/styles.css";

applyStoredTheme();
document.title = "研修教材";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <IndexPage />
    </StrictMode>
  );
}
