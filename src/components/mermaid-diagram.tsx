import { useEffect, useId, useRef, useState } from "react";
import mermaid from "mermaid";

let initialized = false;

function ensureInit() {
  if (initialized) return;
  mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });
  initialized = true;
}

interface MermaidDiagramProps {
  /** Mermaid のソース定義 */
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const reactId = useId();
  const renderId = `mermaid-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const [svg, setSvg] = useState("");
  const [failed, setFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    ensureInit();
    mermaid
      .render(renderId, chart.trim())
      .then(({ svg: out }) => {
        if (!cancelled) setSvg(out);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [chart, renderId]);

  if (failed)
    return (
      <pre className="my-6 overflow-x-auto rounded-xl bg-slate-100 p-4 text-sm dark:bg-slate-800">
        {chart}
      </pre>
    );

  return (
    <figure
      ref={containerRef}
      className="not-prose mermaid-rendered my-6 flex justify-center overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/40"
      // Mermaid が生成した SVG をそのまま挿入する
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
