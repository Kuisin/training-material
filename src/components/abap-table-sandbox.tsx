import { useState, useEffect, useRef } from "react";
import { cn } from "../lib/cn";

// ---- Types ----

interface ColumnDef {
  id: string;
  name: string;
}

interface TableDef {
  id: string;
  name: string;
  columns: ColumnDef[];
}

type WorkArea = Record<string, string>;

interface ExecResult {
  workAreas: Record<string, WorkArea>;
  tableData: Record<string, Record<string, string>[]>;
  errors: { line: number; message: string }[];
}

// ---- Executor ----

function runCode(code: string, tables: TableDef[]): ExecResult {
  const knownTables = new Map(tables.map((t) => [t.name.toUpperCase(), t]));
  const workAreas: Record<string, WorkArea> = {};
  const tableData: Record<string, Record<string, string>[]> = {};
  const errors: { line: number; message: string }[] = [];

  for (const t of tables) {
    const key = t.name.toUpperCase();
    workAreas[key] = Object.fromEntries(t.columns.map((c) => [c.name.toUpperCase(), ""]));
    tableData[key] = [];
  }

  const lines = code.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i].trim().replace(/\.$/, "").trim();
    if (!line || line.startsWith('"') || line.startsWith("*")) continue;

    const upper = line.toUpperCase();

    // APPEND TABLENAME
    const appendMatch = upper.match(/^APPEND\s+(\w+)$/);
    if (appendMatch) {
      const key = appendMatch[1];
      if (!knownTables.has(key)) {
        errors.push({ line: lineNum, message: `テーブル "${key}" はありません` });
      } else {
        tableData[key].push({ ...workAreas[key] });
      }
      continue;
    }

    // CLEAR TABLENAME
    const clearMatch = upper.match(/^CLEAR\s+(\w+)$/);
    if (clearMatch) {
      const key = clearMatch[1];
      if (!knownTables.has(key)) {
        errors.push({ line: lineNum, message: `テーブル "${key}" はありません` });
      } else {
        const t = knownTables.get(key)!;
        workAreas[key] = Object.fromEntries(t.columns.map((c) => [c.name.toUpperCase(), ""]));
      }
      continue;
    }

    // TABLENAME-FIELD = VALUE
    const assignMatch = line.match(/^(\w+)-(\w+)\s*=\s*(.+)$/i);
    if (assignMatch) {
      const tKey = assignMatch[1].toUpperCase();
      const fKey = assignMatch[2].toUpperCase();
      const raw = assignMatch[3].trim();

      if (!knownTables.has(tKey)) {
        errors.push({ line: lineNum, message: `テーブル "${tKey}" はありません` });
        continue;
      }
      const t = knownTables.get(tKey)!;
      if (!t.columns.some((c) => c.name.toUpperCase() === fKey)) {
        errors.push({ line: lineNum, message: `フィールド "${tKey}-${fKey}" はありません` });
        continue;
      }

      let value: string;
      if (raw.startsWith("'") && raw.endsWith("'")) {
        value = raw.slice(1, -1);
      } else if (/^-?\d+(\.\d+)?$/.test(raw)) {
        value = raw;
      } else {
        errors.push({ line: lineNum, message: `値を解析できません: "${raw}" — 文字列は '...' で囲んでください` });
        continue;
      }

      workAreas[tKey][fKey] = value;
      continue;
    }

    errors.push({ line: lineNum, message: `構文エラー: "${line}"` });
  }

  return { workAreas, tableData, errors };
}

// ---- Defaults ----

const EXAMPLE_TABLES: TableDef[] = [
  {
    id: "ex-1",
    name: "MARA",
    columns: [
      { id: "ex-1-1", name: "MATNR" },
      { id: "ex-1-2", name: "MAKTX" },
      { id: "ex-1-3", name: "MENGE" },
    ],
  },
];

const EXAMPLE_CODE = `" 品目テーブルにデータを書き込む
MARA-MATNR = 'MAT001'.
MARA-MAKTX = '部品A'.
MARA-MENGE = 100.
APPEND MARA.
CLEAR MARA.

MARA-MATNR = 'MAT002'.
MARA-MAKTX = '部品B'.
MARA-MENGE = 50.
APPEND MARA.
CLEAR MARA.

MARA-MATNR = 'MAT003'.
MARA-MAKTX = '部品C'.
MARA-MENGE = 200.
APPEND MARA.`;

let _nextId = 100;
function genId() {
  return String(_nextId++);
}

// ---- Table Designer ----

function TableDesigner({
  tables,
  onChange,
}: {
  tables: TableDef[];
  onChange: (t: TableDef[]) => void;
}) {
  const [addingTable, setAddingTable] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [newColNames, setNewColNames] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  function addTable() {
    const name = newTableName.trim().toUpperCase();
    if (!name || tables.some((t) => t.name === name)) return;
    onChange([...tables, { id: genId(), name, columns: [] }]);
    setNewTableName("");
    setAddingTable(false);
  }

  function removeTable(id: string) {
    onChange(tables.filter((t) => t.id !== id));
  }

  function addColumn(tableId: string) {
    const name = (newColNames[tableId] ?? "").trim().toUpperCase();
    if (!name) return;
    onChange(
      tables.map((t) => {
        if (t.id !== tableId || t.columns.some((c) => c.name === name)) return t;
        return { ...t, columns: [...t.columns, { id: genId(), name }] };
      })
    );
    setNewColNames((prev) => ({ ...prev, [tableId]: "" }));
  }

  function removeColumn(tableId: string, colId: string) {
    onChange(
      tables.map((t) => {
        if (t.id !== tableId) return t;
        return { ...t, columns: t.columns.filter((c) => c.id !== colId) };
      })
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tables.map((table) => (
        <div
          key={table.id}
          className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-700">
            <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-100">
              {table.name}
            </span>
            <button
              type="button"
              onClick={() => removeTable(table.id)}
              className="rounded p-0.5 text-xs text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
              aria-label={`${table.name}を削除`}
            >
              ✕
            </button>
          </div>
          <div className="p-3">
            {table.columns.length > 0 ? (
              <ul className="mb-2.5 flex flex-col gap-1.5">
                {table.columns.map((col) => (
                  <li key={col.id} className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      └ {col.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeColumn(table.id, col.id)}
                      className="text-xs text-slate-300 hover:text-red-400 dark:text-slate-600 dark:hover:text-red-400"
                      aria-label={`${col.name}を削除`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-2.5 text-xs text-slate-400 dark:text-slate-500">列がありません</p>
            )}
            <div className="flex gap-1.5">
              <input
                type="text"
                value={newColNames[table.id] ?? ""}
                onChange={(e) =>
                  setNewColNames((prev) => ({ ...prev, [table.id]: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && addColumn(table.id)}
                placeholder="列名を入力"
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-1 font-mono text-xs uppercase outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:ring-blue-900"
              />
              <button
                type="button"
                onClick={() => addColumn(table.id)}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              >
                ＋列
              </button>
            </div>
          </div>
        </div>
      ))}

      {addingTable ? (
        <div className="flex gap-1.5">
          <input
            ref={inputRef}
            type="text"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTable();
              if (e.key === "Escape") setAddingTable(false);
            }}
            placeholder="テーブル名"
            autoFocus
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm font-bold uppercase outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
          <button
            type="button"
            onClick={addTable}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            追加
          </button>
          <button
            type="button"
            onClick={() => setAddingTable(false)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAddingTable(true)}
          className="flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-3 text-sm font-medium text-slate-400 transition hover:border-blue-400 hover:text-blue-500 dark:border-slate-700 dark:hover:border-blue-500 dark:hover:text-blue-400"
        >
          <span aria-hidden>＋</span> テーブルを追加
        </button>
      )}
    </div>
  );
}

// ---- Results View ----

function ResultsView({
  tables,
  result,
}: {
  tables: TableDef[];
  result: ExecResult;
}) {
  const active = tables.filter((t) => {
    const key = t.name.toUpperCase();
    return (
      (result.tableData[key]?.length ?? 0) > 0 ||
      Object.values(result.workAreas[key] ?? {}).some((v) => v !== "")
    );
  });

  if (active.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 px-5 py-10 text-center dark:border-slate-800">
        <p className="text-sm text-slate-400 dark:text-slate-500">
          APPEND 文を実行するとここに結果が表示されます
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {active.map((table) => {
        const key = table.name.toUpperCase();
        const rows = result.tableData[key] ?? [];
        const workArea = result.workAreas[key] ?? {};
        const hasPending = Object.values(workArea).some((v) => v !== "");
        const cols = table.columns.map((c) => c.name.toUpperCase());

        return (
          <div key={table.id}>
            <div className="mb-2 flex items-baseline gap-2">
              <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">
                {table.name}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">{rows.length} 行</span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                    <th className="w-10 px-3 py-2 text-right font-mono text-xs font-semibold text-slate-400 dark:text-slate-500">
                      #
                    </th>
                    {cols.map((col) => (
                      <th
                        key={col}
                        className="px-4 py-2 text-left font-mono text-xs font-semibold text-slate-500 dark:text-slate-400"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                    >
                      <td className="px-3 py-2 text-right font-mono text-xs text-slate-400 dark:text-slate-600">
                        {idx + 1}
                      </td>
                      {cols.map((col) => (
                        <td
                          key={col}
                          className="px-4 py-2 font-mono text-xs text-slate-700 dark:text-slate-300"
                        >
                          {row[col] ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {hasPending && (
                    <tr className="border-t-2 border-dashed border-amber-300 bg-amber-50/50 dark:border-amber-700 dark:bg-amber-500/5">
                      <td className="px-3 py-2 text-right font-mono text-xs italic text-amber-500 dark:text-amber-600">
                        ―
                      </td>
                      {cols.map((col) => (
                        <td
                          key={col}
                          className="px-4 py-2 font-mono text-xs italic text-amber-700 dark:text-amber-400"
                        >
                          {workArea[col] || "—"}
                        </td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {hasPending && (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-500">
                ↑ 作業領域 — まだ APPEND されていません
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---- Main Component ----

export function AbapTableSandbox() {
  const [tables, setTables] = useState<TableDef[]>(EXAMPLE_TABLES);
  const [code, setCode] = useState(EXAMPLE_CODE);
  const [result, setResult] = useState<ExecResult>(() => runCode(EXAMPLE_CODE, EXAMPLE_TABLES));

  useEffect(() => {
    const id = setTimeout(() => setResult(runCode(code, tables)), 150);
    return () => clearTimeout(id);
  }, [code, tables]);

  function resetExample() {
    setTables(EXAMPLE_TABLES);
    setCode(EXAMPLE_CODE);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Designer + Editor */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Table Designer */}
        <section>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            テーブル定義
          </h2>
          <TableDesigner tables={tables} onChange={setTables} />
        </section>

        {/* Code Editor */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              コード
            </h2>
            <button
              type="button"
              onClick={resetExample}
              className="text-xs text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline dark:text-slate-500 dark:hover:text-slate-300"
            >
              サンプルをリセット
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            rows={14}
            className={cn(
              "w-full resize-y rounded-xl border bg-slate-900 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none focus:ring-2 focus:ring-blue-500",
              result.errors.length > 0 ? "border-red-500" : "border-slate-700"
            )}
          />
          {/* Syntax reference */}
          <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-800">
            <p className="mb-1 text-xs font-semibold text-slate-400 dark:text-slate-500">構文</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
              <span>
                <span className="text-blue-500">TABLE</span>
                <span className="text-slate-400">-</span>
                <span className="text-green-400">FIELD</span>
                <span className="text-slate-400"> = </span>
                <span className="text-amber-400">'値'</span>
              </span>
              <span>
                <span className="text-purple-400">APPEND</span>
                <span className="text-slate-400"> TABLE</span>
              </span>
              <span>
                <span className="text-purple-400">CLEAR</span>
                <span className="text-slate-400"> TABLE</span>
              </span>
              <span className="text-slate-500">" コメント</span>
            </div>
          </div>
          {/* Errors */}
          {result.errors.length > 0 && (
            <ul className="mt-2 flex flex-col gap-1">
              {result.errors.map((err, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-1.5 text-xs text-red-700 dark:bg-red-500/10 dark:text-red-400"
                >
                  <span className="shrink-0 font-semibold">行{err.line}</span>
                  <span>{err.message}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Results */}
      <section>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          実行結果
        </h2>
        <ResultsView tables={tables} result={result} />
      </section>
    </div>
  );
}
