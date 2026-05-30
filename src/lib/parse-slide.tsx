import parse, { domToReact, Element } from "html-react-parser";
import type { DOMNode } from "html-react-parser";
import type { ReactElement, ReactNode } from "react";
import { Callout } from "../components/callout";
import { CodeBlock } from "../components/code-block";
import { Quiz } from "../components/quiz";
import { MermaidDiagram } from "../components/mermaid-diagram";
import { LessonMeta } from "../components/lesson-meta";
import type { CalloutVariant } from "./types";

function classList(node: Element): string[] {
  const cls = node.attribs?.class ?? "";
  return cls.split(/\s+/).filter(Boolean);
}

function textOf(node: Element): string {
  let out = "";
  const walk = (children: DOMNode[]) => {
    for (const child of children) {
      if (child.type === "text") out += child.data;
      else if (child instanceof Element) walk(child.children as DOMNode[]);
    }
  };
  walk(node.children as DOMNode[]);
  return out;
}

function calloutVariant(classes: string[]): CalloutVariant {
  if (classes.includes("warning")) return "warning";
  if (classes.includes("note")) return "note";
  return "tip";
}

function renderMeta(node: Element): ReactElement {
  const items = (node.children as DOMNode[])
    .filter((c): c is Element => c instanceof Element && c.name === "span")
    .map((span) => {
      const raw = textOf(span).trim();
      const [icon, ...rest] = raw.split(/\s+/);
      return { icon, text: rest.join(" ") };
    });
  return <LessonMeta items={items} />;
}

function renderQuiz(node: Element): ReactElement {
  const answer = Number(node.attribs["data-answer"] ?? "0");
  const explanation = node.attribs["data-explanation"] ?? "";
  const children = node.children as DOMNode[];

  const questionNode = children.find(
    (c): c is Element =>
      c instanceof Element && c.name === "p" && !classList(c).includes("feedback")
  );
  const question = questionNode
    ? domToReact(questionNode.children as DOMNode[], parseOptions)
    : null;

  const options = children
    .filter((c): c is Element => c instanceof Element && c.name === "button")
    .map((btn) => textOf(btn).trim());

  return (
    <Quiz
      question={question}
      options={options}
      answer={answer}
      explanation={explanation}
    />
  );
}

function replace(node: DOMNode): ReactElement | undefined {
  if (!(node instanceof Element)) return undefined;
  const classes = classList(node);

  if (node.name === "div" && classes.includes("callout")) {
    return (
      <Callout variant={calloutVariant(classes)}>
        {domToReact(node.children as DOMNode[], parseOptions)}
      </Callout>
    );
  }

  if (node.name === "div" && classes.includes("quiz")) return renderQuiz(node);

  if (node.name === "div" && classes.includes("lesson-meta")) return renderMeta(node);

  if (node.name === "pre" && classes.includes("mermaid")) {
    return <MermaidDiagram chart={textOf(node)} />;
  }

  if (node.name === "pre") {
    const code = (node.children as DOMNode[]).find(
      (c): c is Element => c instanceof Element && c.name === "code"
    );
    if (code) {
      const lang = classList(code)
        .find((c) => c.startsWith("language-"))
        ?.replace("language-", "");
      return <CodeBlock code={textOf(code).replace(/\n$/, "")} language={lang} />;
    }
  }

  return undefined;
}

const parseOptions = { replace };

/** スライドの生 HTML を TSX コンポーネントツリーへ変換する。 */
export function parseSlideHtml(html: string): ReactNode {
  return parse(html, parseOptions);
}
