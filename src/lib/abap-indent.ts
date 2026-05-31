/** 行頭の空白を除いた本体 */
export function stripLeading(line: string): string {
  return line.trimStart();
}

const CLOSE =
  /^(ENDLOOP|ENDIF|ENDFORM|ENDAT|ENDCASE|ENDDO|ENDWHILE|ENDTRY)\b/i;
const OPEN = /^(LOOP|IF|FORM|AT|CASE|DO|WHILE|TRY)\b/i;
/** IF の別分岐（IF/ELSEIF/ELSE と同じ段） */
const BRANCH = /^(ELSEIF|ELSE)\b/i;
const CONTINUATION = /^(FROM|INTO|WHERE|CHANGING|USING)\b/i;

/** 組み立て順に応じた各行のインデント段（2スペース×段数）を返す。 */
export function computeAbapIndentLevels(lines: string[]): number[] {
  const levels: number[] = [];
  let depth = 0;

  for (const raw of lines) {
    const line = stripLeading(raw);

    if (CLOSE.test(line)) {
      depth = Math.max(0, depth - 1);
      levels.push(depth);
      continue;
    }

    if (BRANCH.test(line)) {
      depth = Math.max(0, depth - 1);
      levels.push(depth);
      depth += 1;
      continue;
    }

    if (CONTINUATION.test(line)) {
      levels.push(depth + 1);
      continue;
    }

    levels.push(depth);
    if (OPEN.test(line)) depth += 1;
  }

  return levels;
}

/** インデントを付けて表示用テキストにする。 */
export function formatAbapLine(raw: string, indentLevel: number): string {
  const pad = "  ".repeat(Math.max(0, indentLevel));
  return pad + stripLeading(raw);
}

export function formatAbapBlock(lines: string[]): string[] {
  const levels = computeAbapIndentLevels(lines);
  return lines.map((line, i) => formatAbapLine(line, levels[i]!));
}
