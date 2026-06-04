import type { ReactNode } from "react";
import { cn } from "../lib/cn";

interface InstructionSubstepsProps {
  children: ReactNode;
  className?: string;
}

/** 手順 `<ol>` 内のサブ操作（箇条書き） */
export function InstructionSubsteps({ children, className }: InstructionSubstepsProps) {
  return (
    <ul
      className={cn(
        "not-prose my-2 list-disc space-y-1 pl-5 text-[0.95rem] leading-relaxed",
        className
      )}
    >
      {children}
    </ul>
  );
}
