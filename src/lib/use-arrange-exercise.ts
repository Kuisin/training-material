import { useEffect, useLayoutEffect, useState } from "react";
import {
  readUiState,
  registerGrader,
  registerReportDetail,
  useItemConfirmed,
  usePersistentState,
  writeUiState,
} from "./score-store";
import { formatAbapBlock, formatAbapLine, computeAbapIndentLevels } from "./abap-indent";

function shuffledIndices(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  if (n > 1 && arr.every((v, i) => v === i)) {
    [arr[0], arr[1]] = [arr[1]!, arr[0]!];
  }
  return arr;
}

function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from === to || to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item!);
  return next;
}

function isValidArrangeState(pool: number[], built: number[], lineCount: number): boolean {
  if (lineCount <= 0) return pool.length === 0 && built.length === 0;

  const all = [...pool, ...built];
  if (all.length !== lineCount) return false;

  const seen = new Set<number>();
  for (const idx of all) {
    if (!Number.isInteger(idx) || idx < 0 || idx >= lineCount || seen.has(idx)) return false;
    seen.add(idx);
  }
  return true;
}

/** 教材改訂などで行数が変わったとき、古い localStorage の index を捨てる */
function ensureValidArrangeState(scoreId: string, lineCount: number): void {
  const pool = readUiState<number[]>(`${scoreId}:pool`) ?? [];
  const built = readUiState<number[]>(`${scoreId}:built`) ?? [];
  if (isValidArrangeState(pool, built, lineCount)) return;

  writeUiState(`${scoreId}:pool`, shuffledIndices(lineCount));
  writeUiState(`${scoreId}:built`, []);
}

interface UseArrangeExerciseOptions {
  scoreId: string;
  lines: string[];
  /** ABAP の LOOP/IF/FORM 等に応じて表示インデントを付ける */
  autoIndent?: boolean;
}

export function useArrangeExercise({ scoreId, lines, autoIndent = false }: UseArrangeExerciseOptions) {
  ensureValidArrangeState(scoreId, lines.length);

  const confirmed = useItemConfirmed(scoreId);
  const [pool, setPool] = usePersistentState<number[]>(`${scoreId}:pool`, () =>
    shuffledIndices(lines.length)
  );
  const [built, setBuilt] = usePersistentState<number[]>(`${scoreId}:built`, []);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    const currentPool = readUiState<number[]>(`${scoreId}:pool`) ?? [];
    const currentBuilt = readUiState<number[]>(`${scoreId}:built`) ?? [];
    if (!isValidArrangeState(currentPool, currentBuilt, lines.length)) {
      setPool(shuffledIndices(lines.length));
      setBuilt([]);
    }
  }, [scoreId, lines.length, setPool, setBuilt]);

  useLayoutEffect(() => {
    registerGrader(scoreId, {
      isAnswered: () => {
        const current = readUiState<number[]>(`${scoreId}:built`) ?? [];
        return current.length === lines.length;
      },
      grade: () => {
        const current = readUiState<number[]>(`${scoreId}:built`) ?? [];
        return current.length === lines.length && current.every((lineIdx, pos) => lineIdx === pos);
      },
    });

    registerReportDetail(scoreId, () => {
      const builtOrder = readUiState<number[]>(`${scoreId}:built`) ?? [];
      if (builtOrder.length === 0) return "";
      const builtLines = builtOrder.map((i) => lines[i]!);
      if (autoIndent) {
        const formatted = formatAbapBlock(builtLines);
        return formatted.map((text, pos) => `${pos + 1}. ${text}`).join("\n");
      }
      return builtOrder.map((lineIdx, pos) => `${pos + 1}. ${lines[lineIdx]}`).join("\n");
    });

    registerReportDetail(`${scoreId}:correct`, () => {
      if (autoIndent) {
        return formatAbapBlock(lines).map((text, pos) => `${pos + 1}. ${text}`).join("\n");
      }
      return lines.map((line, pos) => `${pos + 1}. ${line}`).join("\n");
    });
  }, [scoreId, lines, autoIndent]);

  function pick(lineIdx: number) {
    if (confirmed) return;
    setPool(pool.filter((i) => i !== lineIdx));
    setBuilt([...built, lineIdx]);
  }

  function unpick(pos: number) {
    if (confirmed) return;
    const lineIdx = built[pos]!;
    setBuilt(built.filter((_, i) => i !== pos));
    setPool([...pool, lineIdx]);
  }

  function reorder(from: number, to: number) {
    if (confirmed) return;
    const next = moveItem(built, from, to);
    if (next !== built) setBuilt(next);
  }

  function displayText(lineIdx: number, pos: number): string {
    const raw = lines[lineIdx] ?? "";
    if (!autoIndent) return raw;
    const builtLines = built.map((i) => lines[i] ?? "");
    const levels = computeAbapIndentLevels(builtLines);
    return formatAbapLine(raw, levels[pos] ?? 0);
  }

  const complete = built.length === lines.length;
  const isCorrect =
    complete && built.every((lineIdx, pos) => lineIdx === pos);

  return {
    confirmed,
    pool,
    built,
    dragIndex,
    setDragIndex,
    pick,
    unpick,
    reorder,
    complete,
    isCorrect,
    displayText,
  };
}
