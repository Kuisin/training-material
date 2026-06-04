import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { NESTED_TABLE_STYLES } from "../lib/nested-table-styles";

export interface KeyValueRow {
  label: ReactNode;
  value: ReactNode;
}

interface KeyValueTableProps {
  rows: KeyValueRow[];
  labelHeader?: ReactNode;
  valueHeader?: ReactNode;
  className?: string;
}

/** 手順内の「項目／値」表（InfoPanel・Callout と同じテーブルスタイル） */
export function KeyValueTable({
  rows,
  labelHeader = "項目",
  valueHeader = "値",
  className,
}: KeyValueTableProps) {
  return (
    <div className={cn("not-prose my-2 overflow-x-auto", NESTED_TABLE_STYLES, className)}>
      <table>
        <thead>
          <tr>
            <th>{labelHeader}</th>
            <th>{valueHeader}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row.label}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
