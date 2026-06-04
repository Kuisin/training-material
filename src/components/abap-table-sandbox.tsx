import { useState, useEffect } from "react";
import { cn } from "../lib/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

type Row = Record<string, string>;
interface ColumnDef { id: string; name: string; }
interface TableDef { id: string; name: string; columns: ColumnDef[]; rows: Row[]; }

interface LoopFrame {
  tableName: string;
  varName: string;
  index: number;
  bodyStart: number;
  prevRow: Row | null;
}

interface IfFrame {
  executing: boolean;
  done: boolean;
  outerSkip: boolean;
}

interface ExecError { line: number; message: string; }
interface ExecResult { pages: string[][]; errors: ExecError[]; }

// ─── Utilities ────────────────────────────────────────────────────────────────

function normLine(raw: string): string {
  return raw.trim().replace(/\.$/, "").trim();
}

function splitByComma(s: string): string[] {
  const parts: string[] = [];
  let cur = "", inQ = false;
  for (const ch of s) {
    if (ch === "'" && !inQ) { inQ = true; cur += ch; }
    else if (ch === "'" && inQ) { inQ = false; cur += ch; }
    else if (ch === "," && !inQ) { parts.push(cur); cur = ""; }
    else cur += ch;
  }
  if (cur.trim()) parts.push(cur);
  return parts;
}

// Display width: CJK/full-width characters count as 2 display columns.
// The line buffer stores one element per DISPLAY COLUMN.
// Double-width chars occupy index[p] = char and index[p+1] = "" (right-half marker).
function charDW(ch: string): 1 | 2 {
  const cp = ch.codePointAt(0) ?? 0;
  return (
    (cp >= 0x1100 && cp <= 0x11FF) || (cp >= 0x2E80 && cp <= 0x303F) ||
    (cp >= 0x3040 && cp <= 0x33FF) || (cp >= 0x3400 && cp <= 0x4DBF) ||
    (cp >= 0x4E00 && cp <= 0x9FFF) || (cp >= 0xAC00 && cp <= 0xD7AF) ||
    (cp >= 0xF900 && cp <= 0xFAFF) || (cp >= 0xFE10 && cp <= 0xFE4F) ||
    (cp >= 0xFF00 && cp <= 0xFF60) || (cp >= 0xFFE0 && cp <= 0xFFE6) ||
    (cp >= 0x20000 && cp <= 0x2FFFD)
  ) ? 2 : 1;
}

function formatWidth(val: string, w: number, align: "left" | "right" | "center"): string {
  let s = "", dw = 0;
  for (const ch of val) { const cw = charDW(ch); if (dw + cw > w) break; s += ch; dw += cw; }
  const pad = w - dw;
  if (pad <= 0) return s;
  const sp = " ".repeat(pad);
  if (align === "right") return sp + s;
  if (align === "center") { const l = Math.floor(pad / 2); return " ".repeat(l) + s + " ".repeat(pad - l); }
  return s + sp;
}

// col is a 1-indexed DISPLAY COLUMN position (same as ABAP WRITE column semantics).
function writeAt(buf: string[], col: number, text: string): string[] {
  const result = [...buf];
  let p = col - 1; // 0-indexed display column
  for (const ch of text) {
    const w = charDW(ch);
    while (result.length <= p + w - 1) result.push(" ");
    result[p] = ch;
    if (w === 2) result[p + 1] = ""; // right-half placeholder
    p += w;
  }
  return result;
}

// Filter out right-half placeholders before joining so HTML renders double-width chars correctly.
function bufStr(chars: string[]): string { return chars.filter(c => c !== "").join("").trimEnd(); }

function applyEditMask(value: string, mask: string): string {
  let result = "", vi = 0;
  for (const m of mask) {
    if (m === "_") { result += value[vi] ?? " "; vi++; }
    else result += m;
  }
  return result;
}

// ─── Value resolver ───────────────────────────────────────────────────────────

function resolveVal(
  raw: string,
  workAreas: Record<string, Row>,
  scalars: Record<string, string>,
  sySubrc: number,
  pageNo: number,
): string {
  const t = raw.trim();
  if (!t) return "";
  if (t.startsWith("'") && t.endsWith("'")) return t.slice(1, -1);
  if (/^-?\d+(\.\d+)?$/.test(t)) return t;
  const u = t.toUpperCase();
  if (u === "SY-SUBRC") return String(sySubrc);
  if (u === "SY-PAGNO") return String(pageNo);
  if (u === "SY-DATUM") return new Date().toISOString().slice(0, 10).replace(/-/g, "");
  if (u === "SY-UZEIT") return new Date().toTimeString().slice(0, 8).replace(/:/g, "");
  if (u === "SY-CPROG") return "SANDBOX";
  if (u === "SY-UNAME") return "USER";
  if (u === "ABAP_TRUE" || u === "ABAP_TRUE") return "X";
  if (u === "ABAP_FALSE") return "";
  if (u === "SPACE") return " ";
  const fm = t.match(/^(\w+)-(\w+)$/i);
  if (fm) return workAreas[fm[1].toUpperCase()]?.[fm[2].toUpperCase()] ?? "";
  return scalars[u] ?? "";
}

// ─── Condition evaluator ─────────────────────────────────────────────────────

function evalCond(
  condStr: string,
  workAreas: Record<string, Row>,
  scalars: Record<string, string>,
  sySubrc: number,
  pageNo: number,
): boolean {
  const s = condStr.trim();
  const u = s.toUpperCase();
  const rv = (v: string) => resolveVal(v, workAreas, scalars, sySubrc, pageNo);

  if (u.endsWith(" IS INITIAL")) { const v = rv(s.slice(0, -" IS INITIAL".length)); return v === "" || v === "0"; }
  if (u.endsWith(" IS NOT INITIAL")) { const v = rv(s.slice(0, -" IS NOT INITIAL".length)); return v !== "" && v !== "0"; }

  const cm = s.match(/^(.+?)\s*(=|<>|<=|>=|<|>)\s*(.+)$/);
  if (cm) {
    const l = rv(cm[1].trim()), r = rv(cm[3].trim()), op = cm[2];
    const ln = parseFloat(l), rn = parseFloat(r), numOk = !isNaN(ln) && !isNaN(rn);
    if (op === "=") return l === r;
    if (op === "<>") return l !== r;
    if (op === "<") return numOk ? ln < rn : l < r;
    if (op === ">") return numOk ? ln > rn : l > r;
    if (op === "<=") return numOk ? ln <= rn : l <= r;
    if (op === ">=") return numOk ? ln >= rn : l >= r;
  }
  return false;
}

// ─── Pre-process: AT NEW / LOOP jump map ─────────────────────────────────────

function buildJumps(lines: string[]): Map<number, number> {
  const jumps = new Map<number, number>();
  const up = lines.map(l => normLine(l).toUpperCase());

  for (let i = 0; i < up.length; i++) {
    if (up[i].match(/^AT\s+NEW\b/)) {
      let d = 0;
      for (let j = i + 1; j < up.length; j++) {
        if (up[j].match(/^AT\s+NEW\b/)) d++;
        if (up[j] === "ENDAT") { if (d === 0) { jumps.set(i, j + 1); break; } d--; }
      }
    }
    if (up[i].match(/^LOOP\s+AT\b/)) {
      let d = 0;
      for (let j = i + 1; j < up.length; j++) {
        if (up[j].match(/^LOOP\s+AT\b/)) d++;
        if (up[j] === "ENDLOOP") { if (d === 0) { jumps.set(i, j + 1); break; } d--; }
      }
    }
  }
  return jumps;
}

// ─── WRITE argument parser ───────────────────────────────────────────────────

interface WriteTok {
  newLine: boolean;
  col: number | null;
  width: number | null;
  align: "left" | "right" | "center";
  noGap: boolean;
  rawValue: string;
}

function parseWriteArgs(s: string): WriteTok[] {
  return splitByComma(s).map(part => {
    let p = part.trim();
    let newLine = false, col: number | null = null, width: number | null = null;
    let align: "left" | "right" | "center" = "left", noGap = false;

    if (p.startsWith("/")) { newLine = true; p = p.slice(1).trim(); }

    const cwm = p.match(/^(\d+)(?:\((\d+)\))?\s+(.*)/);
    if (cwm) { col = parseInt(cwm[1]); if (cwm[2]) width = parseInt(cwm[2]); p = cwm[3].trim(); }
    else {
      const cOnly = p.match(/^(\d+)(?:\((\d+)\))?$/);
      if (cOnly) { col = parseInt(cOnly[1]); if (cOnly[2]) width = parseInt(cOnly[2]); p = ""; }
    }

    if (/\bRIGHT-JUSTIFIED\b/i.test(p)) { align = "right"; p = p.replace(/\bRIGHT-JUSTIFIED\b/i, "").trim(); }
    if (/\bCENTERED\b/i.test(p)) { align = "center"; p = p.replace(/\bCENTERED\b/i, "").trim(); }
    if (/\bNO-GAP\b/i.test(p)) { noGap = true; p = p.replace(/\bNO-GAP\b/i, "").trim(); }
    p = p.replace(/\bCURRENCY\s+\S+/i, "").replace(/\bNO-SIGN\b/i, "").replace(/\bUSING\s+EDIT\s+MASK\s+'[^']*'/i, "").trim();

    return { newLine, col, width, align, noGap, rawValue: p };
  });
}

// ─── Logical line joiner (handles ABAP-style multi-line statements) ──────────

function buildLogicalLines(code: string): { text: string; lineNum: number }[] {
  const rawLines = code.split("\n");
  const result: { text: string; lineNum: number }[] = [];
  let current = "";
  let startLineNum = 1;

  for (let i = 0; i < rawLines.length; i++) {
    const trimmed = rawLines[i].trim();
    if (!trimmed) continue;

    // Comments are always standalone — flush any pending statement first
    if (trimmed.startsWith('"') || trimmed.startsWith("*")) {
      if (current) { result.push({ text: current.trim(), lineNum: startLineNum }); current = ""; }
      result.push({ text: trimmed, lineNum: i + 1 });
      continue;
    }

    if (!current) { current = trimmed; startLineNum = i + 1; }
    else current += " " + trimmed;

    // A period at the end of the (trimmed) line terminates the statement
    if (trimmed.endsWith(".")) {
      result.push({ text: current.trim(), lineNum: startLineNum });
      current = "";
    }
  }

  if (current.trim()) result.push({ text: current.trim(), lineNum: startLineNum });
  return result;
}

// ─── Executor ────────────────────────────────────────────────────────────────

function runCode(code: string, tables: TableDef[]): ExecResult {
  const knownTables = new Map(tables.map(t => [t.name.toUpperCase(), t]));
  const workAreas: Record<string, Row> = {};
  const tableData: Record<string, Row[]> = {};

  for (const t of tables) {
    const key = t.name.toUpperCase();
    workAreas[key] = Object.fromEntries(t.columns.map(c => [c.name.toUpperCase(), ""]));
    tableData[key] = t.rows.map(row =>
      Object.fromEntries(t.columns.map(c => { const k = c.name.toUpperCase(); return [k, row[k] ?? row[c.name] ?? ""]; }))
    );
  }

  const scalars: Record<string, string> = {};
  let sySubrc = 0, pageNo = 1;
  const pages: string[][] = [[]];
  let lineChars: string[] = [];
  const errors: ExecError[] = [];
  const loopStack: LoopFrame[] = [];
  const ifStack: IfFrame[] = [];

  const logicalLines = buildLogicalLines(code);
  const norms = logicalLines.map(ll => normLine(ll.text));
  const uppers = norms.map(l => l.toUpperCase());
  const jumps = buildJumps(logicalLines.map(ll => ll.text));

  const isExec = () => ifStack.every(f => f.executing);
  const rv = (s: string) => resolveVal(s, workAreas, scalars, sySubrc, pageNo);
  const ec = (s: string) => evalCond(s, workAreas, scalars, sySubrc, pageNo);

  function flushLine() { pages[pages.length - 1].push(bufStr(lineChars)); lineChars = []; }
  function doNewPage() { flushLine(); pages.push([]); pageNo++; }

  let i = 0, guard = 200000;

  while (i < norms.length && guard-- > 0) {
    const line = norms[i], upper = uppers[i], lineNum = logicalLines[i]?.lineNum ?? i + 1;
    if (!line || line.startsWith('"') || line.startsWith("*")) { i++; continue; }

    // ── IF / ELSEIF / ELSE / ENDIF ──────────────────────────────────────────
    if (upper.match(/^IF\b/)) {
      const os = !isExec();
      if (os) ifStack.push({ executing: false, done: false, outerSkip: true });
      else if (ec(line.replace(/^IF\s+/i, ""))) ifStack.push({ executing: true, done: true, outerSkip: false });
      else ifStack.push({ executing: false, done: false, outerSkip: false });
      i++; continue;
    }
    if (upper.match(/^ELSEIF\b/)) {
      const top = ifStack[ifStack.length - 1];
      if (top && !top.outerSkip) {
        if (top.done) top.executing = false;
        else if (ec(line.replace(/^ELSEIF\s+/i, ""))) { top.executing = true; top.done = true; }
        else top.executing = false;
      }
      i++; continue;
    }
    if (upper === "ELSE") {
      const top = ifStack[ifStack.length - 1];
      if (top && !top.outerSkip) { top.executing = !top.done; if (top.executing) top.done = true; }
      i++; continue;
    }
    if (upper === "ENDIF") { ifStack.pop(); i++; continue; }

    // ── LOOP AT ─────────────────────────────────────────────────────────────
    if (upper.match(/^LOOP\s+AT\b/)) {
      if (!isExec()) { const sk = jumps.get(i); i = sk ?? i + 1; continue; }
      const m = upper.match(/^LOOP\s+AT\s+(\w+)(?:\s+INTO\s+(\w+))?/);
      if (!m) { errors.push({ line: lineNum, message: "LOOP AT 構文エラー" }); i++; continue; }
      const tbl = m[1], varN = (m[2] ?? m[1]).toUpperCase();
      if (!knownTables.has(tbl)) { errors.push({ line: lineNum, message: `テーブル "${tbl}" はありません` }); i = jumps.get(i) ?? i + 1; continue; }
      const rows = tableData[tbl];
      if (!rows.length) { i = jumps.get(i) ?? i + 1; continue; }
      loopStack.push({ tableName: tbl, varName: varN, index: 0, bodyStart: i + 1, prevRow: null });
      workAreas[varN] = { ...rows[0] };
      if (varN !== tbl) workAreas[tbl] = { ...rows[0] };
      i++; continue;
    }
    if (upper === "ENDLOOP") {
      if (!loopStack.length) { errors.push({ line: lineNum, message: "対応するLOOP ATがありません" }); i++; continue; }
      const fr = loopStack[loopStack.length - 1];
      const prevRow = { ...tableData[fr.tableName][fr.index] };
      fr.index++;
      if (fr.index < tableData[fr.tableName].length) {
        fr.prevRow = prevRow;
        workAreas[fr.varName] = { ...tableData[fr.tableName][fr.index] };
        if (fr.varName !== fr.tableName) workAreas[fr.tableName] = { ...tableData[fr.tableName][fr.index] };
        i = fr.bodyStart;
      } else { loopStack.pop(); i++; }
      continue;
    }

    // ── Skip non-executing (after structural keywords) ──────────────────────
    if (!isExec()) { i++; continue; }

    // ── AT NEW / ENDAT ───────────────────────────────────────────────────────
    if (upper.match(/^AT\s+NEW\b/)) {
      const fm = upper.match(/^AT\s+NEW\s+(\w+)/);
      const fld = fm?.[1] ?? "";
      const fr = loopStack[loopStack.length - 1];
      const curV = fr ? (workAreas[fr.varName]?.[fld] ?? "") : "";
      const prevV = fr?.prevRow?.[fld] ?? null;
      if (prevV !== null && prevV === curV) { i = jumps.get(i) ?? i + 1; continue; }
      i++; continue;
    }
    if (upper === "ENDAT") { i++; continue; }

    // ── SORT ────────────────────────────────────────────────────────────────
    if (upper.match(/^SORT\b/)) {
      const sm = upper.match(/^SORT\s+(\w+)\s+BY\s+(.+)$/);
      if (sm) {
        const tbl = sm[1];
        const parts = sm[2].split(/\s+/);
        const fields: string[] = [], desc: string[] = [];
        for (let k = 0; k < parts.length; k++) {
          if (parts[k] === "DESCENDING") desc.push(fields[fields.length - 1]);
          else if (parts[k] !== "ASCENDING") fields.push(parts[k]);
        }
        if (tableData[tbl]) {
          tableData[tbl].sort((a, b) => {
            for (const f of fields) {
              const av = a[f] ?? "", bv = b[f] ?? "";
              const cmp = av.localeCompare(bv, undefined, { numeric: true });
              if (cmp !== 0) return desc.includes(f) ? -cmp : cmp;
            }
            return 0;
          });
        }
      }
      i++; continue;
    }

    // ── READ TABLE ──────────────────────────────────────────────────────────
    if (upper.match(/^READ\s+TABLE\b/)) {
      const rm = line.match(/READ\s+TABLE\s+(\w+)\s+INTO\s+(\w+)\s+WITH\s+KEY\s+(.+)/i);
      if (rm) {
        const tbl = rm[1].toUpperCase(), wa = rm[2].toUpperCase(), keyStr = rm[3];
        const keyPairs: [string, string][] = [];
        const re = /(\w+)\s*=\s*('[^']*'|\S+)/g;
        let km;
        while ((km = re.exec(keyStr)) !== null) keyPairs.push([km[1].toUpperCase(), rv(km[2])]);
        const rows = tableData[tbl] ?? [];
        const found = rows.find(row => keyPairs.every(([k, v]) => row[k] === v));
        if (found) { workAreas[wa] = { ...found }; sySubrc = 0; }
        else { sySubrc = 4; }
      }
      i++; continue;
    }

    // ── CONTINUE ─────────────────────────────────────────────────────────────
    if (upper === "CONTINUE") {
      if (!loopStack.length) { errors.push({ line: lineNum, message: "CONTINUE は LOOP の外では使えません" }); i++; continue; }
      let depth = 0;
      let jumped = false;
      for (let j = i + 1; j < uppers.length; j++) {
        if (uppers[j].match(/^LOOP\s+AT\b/)) depth++;
        if (uppers[j] === "ENDLOOP") {
          if (depth === 0) { i = j; jumped = true; break; }
          depth--;
        }
      }
      if (!jumped) i++;
      continue;
    }

    // ── NEW-LINE ─────────────────────────────────────────────────────────────
    if (upper === "NEW-LINE") { flushLine(); i++; continue; }

    // ── NEW-PAGE ─────────────────────────────────────────────────────────────
    if (upper === "NEW-PAGE") { doNewPage(); i++; continue; }

    // ── SKIP ─────────────────────────────────────────────────────────────────
    if (upper.match(/^SKIP(\s+\d+)?$/)) {
      const n = parseInt(upper.match(/\d+/)?.[0] ?? "1");
      for (let s = 0; s < n; s++) pages[pages.length - 1].push("");
      i++; continue;
    }

    // ── ULINE ────────────────────────────────────────────────────────────────
    if (upper === "ULINE") { flushLine(); pages[pages.length - 1].push("─".repeat(100)); i++; continue; }

    // ── WRITE src TO dest USING EDIT MASK ───────────────────────────────────
    if (upper.match(/^WRITE\b/) && upper.includes(" TO ") && upper.includes("USING EDIT MASK")) {
      const wm = line.match(/WRITE\s+(.+?)\s+TO\s+(\w+(?:-\w+)?)\s+USING\s+EDIT\s+MASK\s+'([^']+)'/i);
      if (wm) {
        const formatted = applyEditMask(rv(wm[1].trim()), wm[3]);
        const dest = wm[2].toUpperCase();
        const fa = dest.match(/^(\w+)-(\w+)$/);
        if (fa) { if (!workAreas[fa[1]]) workAreas[fa[1]] = {}; workAreas[fa[1]][fa[2]] = formatted; }
        else scalars[dest] = formatted;
      }
      i++; continue;
    }

    // ── CONDENSE ─────────────────────────────────────────────────────────────
    if (upper.match(/^CONDENSE\b/)) {
      const vn = line.replace(/^CONDENSE\s+/i, "").replace(/\s+NO-GAPS?$/i, "").trim().toUpperCase();
      const fa = vn.match(/^(\w+)-(\w+)$/);
      if (fa) { const val = workAreas[fa[1]]?.[fa[2]] ?? ""; if (!workAreas[fa[1]]) workAreas[fa[1]] = {}; workAreas[fa[1]][fa[2]] = val.trim().replace(/\s+/g, " "); }
      else scalars[vn] = (scalars[vn] ?? "").trim().replace(/\s+/g, " ");
      i++; continue;
    }

    // ── CLEAR ────────────────────────────────────────────────────────────────
    if (upper.match(/^CLEAR\b/)) {
      const targets = line.replace(/^CLEAR\s*:?\s*/i, "").split(/\s*,\s*/);
      for (const t of targets) {
        const tk = t.trim().toUpperCase();
        const fa = tk.match(/^(\w+)-(\w+)$/);
        if (fa) { if (workAreas[fa[1]]) workAreas[fa[1]][fa[2]] = ""; }
        else if (workAreas[tk]) { for (const f of Object.keys(workAreas[tk])) workAreas[tk][f] = ""; }
        else scalars[tk] = "";
      }
      i++; continue;
    }

    // ── REFRESH ──────────────────────────────────────────────────────────────
    if (upper.match(/^REFRESH\b/)) {
      const targets = line.replace(/^REFRESH\s*:?\s*/i, "").split(/\s*,\s*/);
      for (const t of targets) { const tk = t.trim().toUpperCase(); if (tableData[tk]) tableData[tk] = []; }
      i++; continue;
    }

    // ── APPEND ───────────────────────────────────────────────────────────────
    if (upper.match(/^APPEND\b/)) {
      const am = upper.match(/^APPEND\s+(\w+)(?:\s+TO\s+(\w+))?$/);
      if (am) {
        const src = am[1], dst = am[2] ?? src;
        if (tableData[dst]) tableData[dst].push({ ...(workAreas[src] ?? {}) });
        else errors.push({ line: lineNum, message: `テーブル "${dst}" はありません` });
      }
      i++; continue;
    }

    // ── CONSTANTS ────────────────────────────────────────────────────────────
    if (upper.match(/^CONSTANTS?\b/)) {
      const re = /(\w+)\s+(?:TYPE\s+\S+\s+)?VALUE\s+'([^']*)'/gi;
      let m;
      while ((m = re.exec(line)) !== null) scalars[m[1].toUpperCase()] = m[2];
      i++; continue;
    }

    // ── WRITE (list output) ──────────────────────────────────────────────────
    if (upper.match(/^WRITE\b/)) {
      const afterWrite = line.replace(/^WRITE\s*:?\s*/i, "");
      const tokens = parseWriteArgs(afterWrite);
      let curPos = lineChars.length + 1;
      for (const tok of tokens) {
        if (tok.newLine) { flushLine(); curPos = 1; }
        if (!tok.rawValue) continue;
        const raw = rv(tok.rawValue);
        const formatted = tok.width ? formatWidth(raw, tok.width, tok.align) : raw;
        if (tok.col !== null) {
          lineChars = writeAt(lineChars, tok.col, formatted);
          curPos = tok.col + formatted.length;
        } else {
          while (lineChars.length < curPos - 1) lineChars.push(" ");
          for (const ch of formatted) lineChars.push(ch);
          curPos += formatted.length;
        }
      }
      i++; continue;
    }

    // ── Scalar / WA field assignment ─────────────────────────────────────────
    const am = line.match(/^(\w+(?:-\w+)?)\s*=\s*(.+)$/i);
    if (am) {
      const dest = am[1].toUpperCase(), val = rv(am[2].trim());
      const fa = dest.match(/^(\w+)-(\w+)$/);
      if (fa) { if (!workAreas[fa[1]]) workAreas[fa[1]] = {}; workAreas[fa[1]][fa[2]] = val; }
      else scalars[dest] = val;
      i++; continue;
    }

    errors.push({ line: lineNum, message: `構文エラー: "${line}"` });
    i++;
  }

  if (lineChars.length) flushLine();
  if (guard <= 0) errors.push({ line: 0, message: "無限ループを検出しました" });

  return { pages: pages.filter((p, idx) => p.length > 0 || idx === 0), errors };
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const EXAMPLE_TABLES: TableDef[] = [
  {
    id: "t001", name: "T001",
    columns: [
      { id: "t001-1", name: "BUKRS" }, { id: "t001-2", name: "BUTXT" },
      { id: "t001-3", name: "WAERS" }, { id: "t001-4", name: "KTOPL" },
    ],
    rows: [
      { BUKRS: "1000", BUTXT: "サンプル株式会社", WAERS: "JPY", KTOPL: "INT" },
      { BUKRS: "2000", BUTXT: "デモ商事株式会社", WAERS: "JPY", KTOPL: "INT" },
    ],
  },
  {
    id: "bkpf", name: "BKPF",
    columns: [
      { id: "bkpf-1", name: "BUKRS" }, { id: "bkpf-2", name: "BELNR" },
      { id: "bkpf-3", name: "GJAHR" }, { id: "bkpf-4", name: "BLART" },
      { id: "bkpf-5", name: "BUDAT" }, { id: "bkpf-6", name: "BLDAT" },
      { id: "bkpf-7", name: "USNAM" },
    ],
    rows: [
      { BUKRS: "1000", BELNR: "1000000001", GJAHR: "2024", BLART: "SA", BUDAT: "20240115", BLDAT: "20240115", USNAM: "USER01" },
      { BUKRS: "1000", BELNR: "1900000001", GJAHR: "2024", BLART: "KR", BUDAT: "20240116", BLDAT: "20240116", USNAM: "USER01" },
      { BUKRS: "1000", BELNR: "1000000002", GJAHR: "2024", BLART: "SA", BUDAT: "20240120", BLDAT: "20240120", USNAM: "USER02" },
    ],
  },
  {
    id: "bseg", name: "BSEG",
    columns: [
      { id: "bseg-1", name: "BUKRS" }, { id: "bseg-2", name: "BELNR" },
      { id: "bseg-3", name: "GJAHR" }, { id: "bseg-4", name: "BUZEI" },
      { id: "bseg-5", name: "HKONT" }, { id: "bseg-6", name: "SHKZG" },
      { id: "bseg-7", name: "DMBTR" }, { id: "bseg-8", name: "SGTXT" },
    ],
    rows: [
      { BUKRS: "1000", BELNR: "1000000001", GJAHR: "2024", BUZEI: "001", HKONT: "0000113100", SHKZG: "S", DMBTR: "100000", SGTXT: "売上計上" },
      { BUKRS: "1000", BELNR: "1000000001", GJAHR: "2024", BUZEI: "002", HKONT: "0000800000", SHKZG: "H", DMBTR: "100000", SGTXT: "売上高" },
      { BUKRS: "1000", BELNR: "1900000001", GJAHR: "2024", BUZEI: "001", HKONT: "0000160000", SHKZG: "H", DMBTR: "50000",  SGTXT: "買掛金計上" },
      { BUKRS: "1000", BELNR: "1900000001", GJAHR: "2024", BUZEI: "002", HKONT: "0000400000", SHKZG: "S", DMBTR: "50000",  SGTXT: "仕入高" },
      { BUKRS: "1000", BELNR: "1000000002", GJAHR: "2024", BUZEI: "001", HKONT: "0000113100", SHKZG: "S", DMBTR: "200000", SGTXT: "売上計上" },
      { BUKRS: "1000", BELNR: "1000000002", GJAHR: "2024", BUZEI: "002", HKONT: "0000800000", SHKZG: "H", DMBTR: "200000", SGTXT: "売上高" },
    ],
  },
  {
    id: "skat", name: "SKAT",
    columns: [
      { id: "skat-1", name: "KTOPL" }, { id: "skat-2", name: "SAKNR" },
      { id: "skat-3", name: "SPRAS" }, { id: "skat-4", name: "TXT20" },
    ],
    rows: [
      { KTOPL: "INT", SAKNR: "0000113100", SPRAS: "J", TXT20: "売掛金" },
      { KTOPL: "INT", SAKNR: "0000160000", SPRAS: "J", TXT20: "買掛金" },
      { KTOPL: "INT", SAKNR: "0000400000", SPRAS: "J", TXT20: "仕入高" },
      { KTOPL: "INT", SAKNR: "0000800000", SPRAS: "J", TXT20: "売上高" },
    ],
  },
];

const EXAMPLE_CODE = `" 仕訳日記帳レポート
CONSTANTS c_bukrs VALUE '1000'.
CONSTANTS c_s VALUE 'S'.

" 会社コード情報取得
READ TABLE T001 INTO gs_t001 WITH KEY BUKRS = c_bukrs.
WRITE: /1 '会社名:', 10 gs_t001-BUTXT, 45 '通貨:', 51 gs_t001-WAERS.
ULINE.

" 列ヘッダー
WRITE: /1 '伝票番号', 13 '転記日付', 25 '明細', 30 '勘定コード', 43 '勘定名称', 57 '借方', 70 '貸方', 83 '摘要'.
ULINE.

" BKPF × BSEG 結合ループ
LOOP AT BKPF INTO gs_bkpf.
  IF gs_bkpf-BUKRS <> c_bukrs.
    CONTINUE.
  ENDIF.
  WRITE gs_bkpf-BUDAT TO lv_date USING EDIT MASK '____/__/__'.

  LOOP AT BSEG INTO gs_bseg.
    IF gs_bseg-BELNR <> gs_bkpf-BELNR.
      CONTINUE.
    ENDIF.

    " 勘定科目名称取得
    READ TABLE SKAT INTO gs_skat WITH KEY SAKNR = gs_bseg-HKONT.

    " 借方・貸方判定
    IF gs_bseg-SHKZG = c_s.
      gv_deb = gs_bseg-DMBTR.
      gv_crd = ''.
    ELSE.
      gv_deb = ''.
      gv_crd = gs_bseg-DMBTR.
    ENDIF.

    WRITE: /1 gs_bkpf-BELNR,
           13 lv_date,
           25 gs_bseg-BUZEI,
           30 gs_bseg-HKONT,
           43 gs_skat-TXT20,
           57(12) gv_deb RIGHT-JUSTIFIED,
           70(12) gv_crd RIGHT-JUSTIFIED,
           83 gs_bseg-SGTXT.
  ENDLOOP.
ENDLOOP.

ULINE.`;

let _id = 300;
const genId = () => String(_id++);

// ─── Spreadsheet ─────────────────────────────────────────────────────────────

function Spreadsheet({ table, onChange }: { table: TableDef; onChange: (t: TableDef) => void }) {
  const cols = table.columns.map(c => c.name.toUpperCase());
  if (!cols.length) return null;

  function setCell(ri: number, col: string, v: string) {
    onChange({ ...table, rows: table.rows.map((r, i) => i === ri ? { ...r, [col]: v } : r) });
  }
  function addRow() { onChange({ ...table, rows: [...table.rows, Object.fromEntries(cols.map(c => [c, ""]))] }); }
  function delRow(ri: number) { onChange({ ...table, rows: table.rows.filter((_, i) => i !== ri) }); }

  return (
    <div className="mt-2">
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              {cols.map(c => (
                <th key={c} className="border-b border-r border-slate-200 px-2 py-1 text-left font-mono font-semibold text-slate-500 last:border-r-0 dark:border-slate-700 dark:text-slate-400">{c}</th>
              ))}
              <th className="w-6 border-b border-slate-200 dark:border-slate-700" />
            </tr>
          </thead>
          <tbody>
            {!table.rows.length && (
              <tr><td colSpan={cols.length + 1} className="px-2 py-2 text-center text-slate-400 dark:text-slate-600">行がありません</td></tr>
            )}
            {table.rows.map((row, ri) => (
              <tr key={ri} className="group border-b border-slate-100 last:border-0 dark:border-slate-800">
                {cols.map(c => (
                  <td key={c} className="border-r border-slate-100 p-0 last:border-r-0 dark:border-slate-800">
                    <input type="text" value={row[c] ?? ""} onChange={e => setCell(ri, c, e.target.value)}
                      className="w-full min-w-[60px] bg-transparent px-2 py-1 font-mono text-xs text-slate-700 outline-none focus:bg-blue-50 focus:ring-1 focus:ring-inset focus:ring-blue-400 dark:text-slate-300 dark:focus:bg-blue-900/20" />
                  </td>
                ))}
                <td className="px-1">
                  <button type="button" onClick={() => delRow(ri)}
                    className="text-slate-300 opacity-0 hover:text-red-400 group-hover:opacity-100 dark:text-slate-700">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" onClick={addRow}
        className="mt-1.5 w-full rounded-lg border border-dashed border-slate-200 py-1 text-xs text-slate-400 transition hover:border-blue-400 hover:text-blue-500 dark:border-slate-700 dark:hover:border-blue-500">
        ＋ 行を追加
      </button>
    </div>
  );
}

// ─── Table Designer ───────────────────────────────────────────────────────────

function TableDesigner({ tables, onChange }: { tables: TableDef[]; onChange: (t: TableDef[]) => void }) {
  const [activeId, setActiveId] = useState<string>(() => tables[0]?.id ?? "");
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCol, setNewCol] = useState("");

  // Keep activeId valid when tables change
  const active = tables.find(t => t.id === activeId) ?? tables[0];

  function addTable() {
    const n = newName.trim().toUpperCase();
    if (!n || tables.some(t => t.name === n)) return;
    const id = genId();
    onChange([...tables, { id, name: n, columns: [], rows: [] }]);
    setActiveId(id);
    setNewName(""); setAdding(false);
  }

  function removeActive() {
    if (!active) return;
    const remaining = tables.filter(t => t.id !== active.id);
    onChange(remaining);
    setActiveId(remaining[remaining.length - 1]?.id ?? "");
  }

  function update(t: TableDef) { onChange(tables.map(x => x.id === t.id ? t : x)); }

  function addCol() {
    if (!active) return;
    const n = newCol.trim().toUpperCase();
    if (!n || active.columns.some(c => c.name === n)) return;
    update({ ...active, columns: [...active.columns, { id: genId(), name: n }], rows: active.rows.map(r => ({ ...r, [n]: r[n] ?? "" })) });
    setNewCol("");
  }

  function removeCol(cid: string) {
    if (!active) return;
    const col = active.columns.find(c => c.id === cid);
    update({ ...active, columns: active.columns.filter(c => c.id !== cid), rows: col ? active.rows.map(r => { const n = { ...r }; delete n[col.name]; return n; }) : active.rows });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      {/* Tab bar */}
      <div className="flex items-center gap-0 overflow-x-auto border-b border-slate-200 dark:border-slate-700">
        {tables.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => { setActiveId(t.id); setAdding(false); }}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2 font-mono text-xs font-semibold transition",
              t.id === activeId && !adding
                ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            {t.name}
          </button>
        ))}
        {adding ? (
          <div className="flex items-center gap-1 px-2 py-1">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addTable(); if (e.key === "Escape") setAdding(false); }}
              placeholder="テーブル名"
              autoFocus
              className="w-24 rounded border border-slate-300 px-2 py-0.5 font-mono text-xs font-bold uppercase outline-none focus:border-blue-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
            <button type="button" onClick={addTable} className="rounded bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white hover:bg-blue-700">追加</button>
            <button type="button" onClick={() => setAdding(false)} className="text-xs text-slate-400 hover:text-slate-600">✕</button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="shrink-0 border-b-2 border-transparent px-3 py-2 text-xs text-slate-400 hover:text-blue-500 dark:hover:text-blue-400"
          >
            ＋
          </button>
        )}
      </div>

      {/* Active table content */}
      {active && !adding && (
        <div className="p-3">
          {/* Column chips + delete table */}
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {active.columns.length > 0 ? active.columns.map(c => (
                <span key={c.id} className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 dark:bg-slate-700">
                  <span className="font-mono text-xs text-slate-600 dark:text-slate-300">{c.name}</span>
                  <button type="button" onClick={() => removeCol(c.id)} className="text-[10px] text-slate-400 hover:text-red-400">✕</button>
                </span>
              )) : <span className="text-xs text-slate-400">列がありません</span>}
            </div>
            <button type="button" onClick={removeActive} className="shrink-0 text-xs text-slate-300 hover:text-red-400 dark:text-slate-600 dark:hover:text-red-400" title={`${active.name}を削除`}>
              テーブル削除
            </button>
          </div>

          {/* Add column */}
          <div className="mb-3 flex gap-1.5">
            <input
              type="text"
              value={newCol}
              onChange={e => setNewCol(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addCol()}
              placeholder="列名を追加"
              className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-1 font-mono text-xs uppercase outline-none focus:border-blue-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
            <button type="button" onClick={addCol}
              className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300">
              ＋列
            </button>
          </div>

          {/* Spreadsheet */}
          <Spreadsheet table={active} onChange={update} />
        </div>
      )}
    </div>
  );
}

// ─── Report Output ────────────────────────────────────────────────────────────

function ReportOutput({ pages, errors }: { pages: string[][]; errors: ExecError[] }) {
  const hasOutput = pages.some(p => p.some(l => l !== ""));
  return (
    <div>
      {errors.length > 0 && (
        <ul className="mb-3 flex flex-col gap-1">
          {errors.map((e, k) => (
            <li key={k} className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-1.5 text-xs text-red-700 dark:bg-red-500/10 dark:text-red-400">
              {e.line > 0 && <span className="shrink-0 font-semibold">行{e.line}</span>}
              <span>{e.message}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-700/70 bg-slate-800/60 px-4 py-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">レポート出力</span>
          {pages.length > 1 && <span className="text-xs text-slate-500">{pages.length} ページ</span>}
        </div>
        {hasOutput ? (
          <div className="p-4">
            {pages.map((page, pi) => (
              <div key={pi}>
                {pi > 0 && (
                  <div className="my-3 flex items-center gap-2">
                    <div className="h-px flex-1 bg-slate-700" />
                    <span className="text-xs text-slate-600">ページ {pi + 1}</span>
                    <div className="h-px flex-1 bg-slate-700" />
                  </div>
                )}
                <pre className="font-mono text-sm leading-relaxed text-slate-100">
                  {page.map((l, li) => (
                    <div key={li} className={cn("whitespace-pre", l.startsWith("─") && "text-slate-500")}>
                      {l || " "}
                    </div>
                  ))}
                </pre>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-4 py-8 text-center text-sm text-slate-500">WRITE 文を実行するとここに出力されます</p>
        )}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function AbapTableSandbox() {
  const [tables, setTables] = useState<TableDef[]>(EXAMPLE_TABLES);
  const [code, setCode] = useState(EXAMPLE_CODE);
  const [result, setResult] = useState<ExecResult>(() => runCode(EXAMPLE_CODE, EXAMPLE_TABLES));

  useEffect(() => {
    const id = setTimeout(() => setResult(runCode(code, tables)), 200);
    return () => clearTimeout(id);
  }, [code, tables]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">テーブル定義 &amp; データ</h2>
          <TableDesigner tables={tables} onChange={setTables} />
        </section>
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">コード</h2>
            <button type="button" onClick={() => { setTables(EXAMPLE_TABLES); setCode(EXAMPLE_CODE); }}
              className="text-xs text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline dark:text-slate-500">
              サンプルをリセット
            </button>
          </div>
          <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false} rows={18}
            onKeyDown={e => {
              if (e.key === "Tab") {
                e.preventDefault();
                const el = e.currentTarget;
                const start = el.selectionStart, end = el.selectionEnd;
                const next = code.slice(0, start) + "  " + code.slice(end);
                setCode(next);
                requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + 2; });
              }
            }}
            className={cn("w-full resize-y rounded-xl border bg-slate-900 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none focus:ring-2 focus:ring-blue-500",
              result.errors.length > 0 ? "border-red-500" : "border-slate-700")} />
          <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-800">
            <p className="mb-1 text-xs font-semibold text-slate-400 dark:text-slate-500">新しい構文</p>
            <div className="flex flex-col gap-0.5 font-mono text-xs text-slate-500 dark:text-slate-500">
              <span>SORT table BY f1 f2.　　READ TABLE t INTO wa WITH KEY f = v.</span>
              <span>IF cond. / ELSEIF / ELSE / ENDIF.　　AT NEW field. / ENDAT.</span>
              <span>WRITE: /col val, col(w) val RIGHT-JUSTIFIED.　　NEW-LINE.　　NEW-PAGE.</span>
              <span>WRITE src TO dest USING EDIT MASK '____/__/__'.　　CONDENSE var.</span>
            </div>
          </div>
        </section>
      </div>
      <section>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">実行結果</h2>
        <ReportOutput pages={result.pages} errors={result.errors} />
      </section>
    </div>
  );
}
