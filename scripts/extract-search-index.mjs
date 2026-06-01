import fs from 'node:fs';
import path from 'node:path';

/** @typedef {{ title: string; plainText: string }} ExtractedSlide */
/** @typedef {{ courseSlug: string; lessonFile: string; lessonNum: string; lessonTitle: string; slideIndex: number; slideTitle: string; text: string }} SearchIndexEntry */
/** @typedef {{ version: 1; entries: SearchIndexEntry[] }} SearchIndex */

/**
 * JS/TS の文字列リテラル（", ', `）を先頭から読む。
 * @returns {{ value: string; end: number } | null}
 */
function readStringLiteral(source, start) {
  let i = start;
  while (i < source.length && /\s/.test(source[i])) i += 1;
  if (i >= source.length) return null;

  const quote = source[i];
  if (quote !== '"' && quote !== "'" && quote !== '`') return null;

  i += 1;
  let value = '';

  while (i < source.length) {
    const ch = source[i];
    if (quote === '`' && ch === '$' && source[i + 1] === '{') {
      // 動的 plainText は静的インデックス対象外
      return null;
    }
    if (ch === '\\') {
      i += 1;
      if (i >= source.length) break;
      const esc = source[i];
      const map = { n: '\n', r: '\r', t: '\t', '\\': '\\', '"': '"', "'": "'", '`': '`' };
      value += map[esc] ?? esc;
      i += 1;
      continue;
    }
    if (ch === quote) {
      return { value, end: i + 1 };
    }
    value += ch;
    i += 1;
  }

  return null;
}

/**
 * `key:` の直後にある文字列リテラルを読む。
 * @returns {string | null}
 */
function readFieldString(source, key, fromIndex = 0) {
  const pattern = new RegExp(`\\b${key}\\s*:`, 'g');
  pattern.lastIndex = fromIndex;
  const match = pattern.exec(source);
  if (!match) return null;
  const literal = readStringLiteral(source, match.index + match[0].length);
  return literal?.value ?? null;
}

/**
 * レッスン TSX から slides 配列内の title / plainText を順に抽出する。
 * @returns {ExtractedSlide[]}
 */
export function extractSlidesFromLessonTsx(source) {
  const slidesStart = source.indexOf('slides={[');
  if (slidesStart < 0) return [];

  /** @type {ExtractedSlide[]} */
  const slides = [];
  let searchFrom = slidesStart;

  while (searchFrom < source.length) {
    const titleOffset = source.indexOf('title:', searchFrom);
    if (titleOffset < 0) break;

    const title = readFieldString(source, 'title', titleOffset);
    if (!title) {
      searchFrom = titleOffset + 6;
      continue;
    }

    const plainText = readFieldString(source, 'plainText', titleOffset);
    const contentOffset = source.indexOf('content:', titleOffset);
    const plainTextOffset = source.indexOf('plainText:', titleOffset);

    if (plainTextOffset < 0 || contentOffset < 0 || plainTextOffset > contentOffset) {
      searchFrom = titleOffset + 6;
      continue;
    }

    slides.push({
      title,
      plainText: plainText ?? title,
    });

    searchFrom = contentOffset + 8;
  }

  return slides;
}

/**
 * *-assessment-data.ts から評価用テキストを抽出する。
 * @returns {ExtractedSlide[]}
 */
export function extractSlidesFromAssessmentData(source) {
  /** @type {ExtractedSlide[]} */
  const slides = [];
  const blockPattern = /num:\s*"([^"]*)"[\s\S]*?title:\s*"([^"]*)"[\s\S]*?summary:\s*"([^"]*)"/g;

  let match;
  while ((match = blockPattern.exec(source)) !== null) {
    const [, num, title, summary] = match;
    const blockEnd = blockPattern.lastIndex;
    const blockStart = match.index;
    const block = source.slice(blockStart, blockEnd + 800);

    const quizTexts = [];
    const questionPattern = /question:\s*"((?:\\.|[^"\\])*)"/g;
    let qMatch;
    while ((qMatch = questionPattern.exec(block)) !== null) {
      quizTexts.push(qMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'));
    }

    const explanationPattern = /explanation:\s*"((?:\\.|[^"\\])*)"/g;
    let eMatch;
    while ((eMatch = explanationPattern.exec(block)) !== null) {
      quizTexts.push(eMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'));
    }

    slides.push({
      title: `L${num} ${title}`,
      plainText: [`L${num} ${title}`, summary, ...quizTexts].join('\n'),
    });
  }

  return slides;
}

/**
 * @param {string} root プロジェクトルート
 * @returns {SearchIndex}
 */
export function buildSearchIndex(root) {
  const coursesDir = path.join(root, 'courses');
  /** @type {SearchIndexEntry[]} */
  const entries = [];

  if (!fs.existsSync(coursesDir)) {
    return { version: 1, entries };
  }

  for (const courseSlug of fs.readdirSync(coursesDir).sort()) {
    const courseDir = path.join(coursesDir, courseSlug);
    if (!fs.statSync(courseDir).isDirectory()) continue;

    const metaPath = path.join(courseDir, 'course.json');
    if (!fs.existsSync(metaPath)) continue;

    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    if (meta.active === false) continue;

    entries.push({
      courseSlug,
      lessonFile: '',
      lessonNum: '',
      lessonTitle: meta.title ?? courseSlug,
      slideIndex: -1,
      slideTitle: meta.title ?? courseSlug,
      text: [meta.title, meta.description].filter(Boolean).join('\n'),
    });

    for (const lesson of meta.lessons ?? []) {
      const tsxPath = path.join(courseDir, `${lesson.file}.tsx`);
      if (!fs.existsSync(tsxPath)) continue;

      const source = fs.readFileSync(tsxPath, 'utf8');
      const lessonNum = lesson.num ?? '';
      const lessonTitle = lesson.title ?? lesson.file;

      entries.push({
        courseSlug,
        lessonFile: lesson.file,
        lessonNum,
        lessonTitle,
        slideIndex: -1,
        slideTitle: lessonTitle,
        text: [lessonTitle, lesson.meta].filter(Boolean).join('\n'),
      });

      let slides = extractSlidesFromLessonTsx(source);

      const assessmentDataPath = path.join(courseDir, `${lesson.file.replace(/-final-assessment$/, '')}-assessment-data.ts`);
      const altAssessmentPath = path.join(courseDir, '16-assessment-data.ts');
      const dataPath = fs.existsSync(assessmentDataPath)
        ? assessmentDataPath
        : lesson.file.includes('assessment') && fs.existsSync(altAssessmentPath)
          ? altAssessmentPath
          : null;

      if (dataPath) {
        const dataSource = fs.readFileSync(dataPath, 'utf8');
        const dynamicSlides = extractSlidesFromAssessmentData(dataSource);
        if (dynamicSlides.length > 0) {
          slides = [...slides, ...dynamicSlides];
        }
      }

      slides.forEach((slide, slideIndex) => {
        entries.push({
          courseSlug,
          lessonFile: lesson.file,
          lessonNum,
          lessonTitle,
          slideIndex,
          slideTitle: slide.title,
          text: [slide.title, slide.plainText].filter(Boolean).join('\n'),
        });
      });
    }
  }

  return { version: 1, entries };
}
