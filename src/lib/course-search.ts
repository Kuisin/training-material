import { appHref, lessonPageHref } from "./app-href";

export interface SearchIndexEntry {
  courseSlug: string;
  lessonFile: string;
  lessonNum: string;
  lessonTitle: string;
  slideIndex: number;
  slideTitle: string;
  text: string;
}

export interface SearchIndex {
  version: 1;
  entries: SearchIndexEntry[];
}

export interface SnippetPart {
  text: string;
  highlight?: boolean;
}

export interface SearchHit {
  courseSlug: string;
  lessonFile: string;
  lessonNum: string;
  lessonTitle: string;
  slideIndex: number;
  slideTitle: string;
  snippetParts: SnippetPart[];
  href: string;
  score: number;
}

let cachedIndex: SearchIndex | null = null;

export async function loadSearchIndex(): Promise<SearchIndex> {
  if (cachedIndex) return cachedIndex;
  const response = await fetch(appHref("search-index.json"));
  if (!response.ok) {
    throw new Error(`search-index.json の読み込みに失敗しました (${response.status})`);
  }
  cachedIndex = (await response.json()) as SearchIndex;
  return cachedIndex;
}

export function normalizeForSearch(value: string): string {
  return value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}

/** クエリを空白区切りの語句に分解（"..." はフレーズとして1語扱い） */
export function parseSearchTerms(query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const terms: string[] = [];
  const pattern = /"([^"]+)"|'([^']+)'|(\S+)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(trimmed)) !== null) {
    const raw = match[1] ?? match[2] ?? match[3] ?? "";
    const normalized = normalizeForSearch(raw);
    if (normalized) terms.push(normalized);
  }
  return terms;
}

function hitHref(entry: SearchIndexEntry): string {
  if (!entry.lessonFile) {
    return appHref(`index.html?course=${encodeURIComponent(entry.courseSlug)}`);
  }
  const base = lessonPageHref(entry.courseSlug, entry.lessonFile);
  if (entry.slideIndex < 0) return base;
  return `${base}#s${entry.slideIndex + 1}`;
}

function termMatchesLessonNum(term: string, lessonNum: string): boolean {
  if (!lessonNum) return false;
  if (term === lessonNum) return true;
  if (term === `l${lessonNum}`) return true;
  if (term === `レッスン${lessonNum}`) return true;
  return false;
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let index = 0;
  while ((index = haystack.indexOf(needle, index)) >= 0) {
    count += 1;
    index += needle.length;
  }
  return count;
}

function scoreEntry(entry: SearchIndexEntry, terms: string[]): number | null {
  const slideTitle = normalizeForSearch(entry.slideTitle);
  const lessonTitle = normalizeForSearch(entry.lessonTitle);
  const body = normalizeForSearch(entry.text);
  const titleLine = `${slideTitle} ${lessonTitle}`.trim();

  let score = 0;

  for (const term of terms) {
    let matched = false;

    if (termMatchesLessonNum(term, entry.lessonNum)) {
      score += 120;
      matched = true;
    }

    if (slideTitle.includes(term)) {
      score += slideTitle === term ? 200 : 110;
      matched = true;
    } else if (lessonTitle.includes(term)) {
      score += lessonTitle === term ? 150 : 90;
      matched = true;
    } else if (titleLine.includes(term)) {
      score += 70;
      matched = true;
    }

    if (body.includes(term)) {
      score += 25 + Math.min(countOccurrences(body, term) * 4, 20);
      matched = true;
    }

    if (!matched) return null;
  }

  if (entry.slideIndex >= 0) score += 8;
  else if (entry.lessonFile) score += 4;

  return score;
}

function findBestAnchor(text: string, terms: string[]): number {
  const normalized = normalizeForSearch(text);
  let bestIndex = 0;
  let bestScore = -1;

  for (const term of terms) {
    let index = normalized.indexOf(term);
    while (index >= 0) {
      const score = terms.filter((other) => {
        const start = Math.max(0, index - 40);
        const end = Math.min(normalized.length, index + term.length + 40);
        return normalized.slice(start, end).includes(other);
      }).length;

      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
      index = normalized.indexOf(term, index + 1);
    }
  }

  return bestIndex;
}

/** 原文テキスト上のインデックスを正規化後のインデックスから逆引きする */
function mapNormalizedIndexToOriginal(text: string, normalizedIndex: number): number {
  let normPos = 0;
  let inWhitespace = false;

  for (let i = 0; i < text.length; i += 1) {
    if (normPos >= normalizedIndex) return i;

    const chunk = text[i] ?? "";
    const normalizedChunk = chunk.normalize("NFKC").toLowerCase();

    if (/\s/.test(chunk)) {
      if (!inWhitespace) {
        normPos += 1;
        inWhitespace = true;
      }
      continue;
    }

    inWhitespace = false;
    normPos += normalizedChunk.length;
  }

  return text.length;
}

export function buildHighlightedSnippet(
  text: string,
  terms: string[],
  radius = 56
): SnippetPart[] {
  if (!text.trim()) return [{ text: "" }];

  const anchor = findBestAnchor(text, terms);
  const anchorOriginal = mapNormalizedIndexToOriginal(text, anchor);

  const start = Math.max(0, anchorOriginal - radius);
  const end = Math.min(text.length, anchorOriginal + radius);
  const slice = text.slice(start, end).replace(/\s+/g, " ");
  const sliceNormalized = normalizeForSearch(slice);

  const ranges: Array<{ start: number; end: number }> = [];
  for (const term of terms) {
    let index = sliceNormalized.indexOf(term);
    while (index >= 0) {
      ranges.push({ start: index, end: index + term.length });
      index = sliceNormalized.indexOf(term, index + 1);
    }
  }

  ranges.sort((a, b) => a.start - b.start);
  const merged: Array<{ start: number; end: number }> = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (!last || range.start > last.end) merged.push({ ...range });
    else last.end = Math.max(last.end, range.end);
  }

  const parts: SnippetPart[] = [];
  if (start > 0) parts.push({ text: "…" });

  let cursor = 0;
  for (const range of merged) {
    if (range.start > cursor) {
      parts.push({ text: slice.slice(cursor, range.start) });
    }
    parts.push({ text: slice.slice(range.start, range.end), highlight: true });
    cursor = range.end;
  }

  if (cursor < slice.length) {
    parts.push({ text: slice.slice(cursor) });
  }
  if (end < text.length) {
    parts.push({ text: "…" });
  }

  return parts.length > 0 ? parts : [{ text: slice.trim() }];
}

export function searchCourseEntries(
  entries: SearchIndexEntry[],
  query: string,
  courseSlug?: string,
  limit = 50
): SearchHit[] {
  const terms = parseSearchTerms(query);
  if (terms.length === 0) return [];

  const scoped = courseSlug
    ? entries.filter((entry) => entry.courseSlug === courseSlug)
    : entries;

  const hits: SearchHit[] = [];
  const seen = new Set<string>();

  for (const entry of scoped) {
    const score = scoreEntry(entry, terms);
    if (score === null) continue;

    const key = `${entry.courseSlug}:${entry.lessonFile}:${entry.slideIndex}:${entry.slideTitle}`;
    if (seen.has(key)) continue;
    seen.add(key);

    hits.push({
      courseSlug: entry.courseSlug,
      lessonFile: entry.lessonFile,
      lessonNum: entry.lessonNum,
      lessonTitle: entry.lessonTitle,
      slideIndex: entry.slideIndex,
      slideTitle: entry.slideTitle,
      snippetParts: buildHighlightedSnippet(entry.text, terms),
      href: hitHref(entry),
      score,
    });
  }

  return hits
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const lessonCompare = a.lessonNum.localeCompare(b.lessonNum, undefined, { numeric: true });
      if (lessonCompare !== 0) return lessonCompare;
      return a.slideIndex - b.slideIndex;
    })
    .slice(0, limit);
}

export function groupSearchHits(hits: SearchHit[]): Array<{ key: string; lessonNum: string; lessonTitle: string; hits: SearchHit[] }> {
  const groups = new Map<string, { lessonNum: string; lessonTitle: string; hits: SearchHit[] }>();

  for (const hit of hits) {
    const key = hit.lessonFile || hit.courseSlug;
    const existing = groups.get(key);
    if (existing) {
      existing.hits.push(hit);
      continue;
    }
    groups.set(key, {
      lessonNum: hit.lessonNum,
      lessonTitle: hit.lessonFile ? hit.lessonTitle : hit.slideTitle,
      hits: [hit],
    });
  }

  return [...groups.entries()].map(([key, group]) => ({ key, ...group }));
}

export function courseSlugFromPathname(pathname: string): string | undefined {
  const segments = pathname.replace(/\/$/, "").split("/").filter(Boolean);
  if (segments.length < 2) return undefined;
  const lessonFile = segments[segments.length - 1] ?? "";
  if (!lessonFile.endsWith(".html")) return undefined;
  return segments[segments.length - 2];
}
