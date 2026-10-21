export function validateQuranDataset(dataset, expected = { surahCount: 114, verseCount: 6236 }) {
  const errors = [];
  if (!dataset || typeof dataset !== "object" || !Array.isArray(dataset.surahs)) {
    return ["Dataset must contain a surahs array."];
  }

  const { surahCount, verseCount } = expected;
  if (dataset.surahs.length !== surahCount) {
    errors.push(`Expected ${surahCount} surahs; found ${dataset.surahs.length}.`);
  }

  const seenSurahs = new Set();
  let totalVerses = 0;

  for (const [index, surah] of dataset.surahs.entries()) {
    const expectedNumber = index + 1;
    if (!surah || typeof surah !== "object") {
      errors.push(`Surah entry ${expectedNumber} must be an object.`);
      continue;
    }
    if (surah.number !== expectedNumber) {
      errors.push(`Surah at position ${expectedNumber} must have number ${expectedNumber}.`);
    }
    if (seenSurahs.has(surah.number)) {
      errors.push(`Duplicate surah number: ${surah.number}.`);
    }
    seenSurahs.add(surah.number);
    if (typeof surah.nameArabic !== "string" || !surah.nameArabic.trim()) {
      errors.push(`Surah ${expectedNumber} is missing its Arabic name.`);
    }
    if (!Array.isArray(surah.verses) || surah.verses.length === 0) {
      errors.push(`Surah ${expectedNumber} must contain a non-empty verses array.`);
      continue;
    }

    totalVerses += surah.verses.length;
    for (const [verseIndex, verse] of surah.verses.entries()) {
      const expectedVerseNumber = verseIndex + 1;
      if (!verse || typeof verse !== "object" || verse.number !== expectedVerseNumber) {
        errors.push(`Surah ${expectedNumber}: verse at position ${expectedVerseNumber} has an invalid number.`);
        continue;
      }
      if (typeof verse.text !== "string" || !verse.text.trim()) {
        errors.push(`Surah ${expectedNumber}, verse ${expectedVerseNumber} has no text.`);
      }
    }
  }

  if (totalVerses !== verseCount) {
    errors.push(`Expected ${verseCount} verses in total; found ${totalVerses}.`);
  }
  return errors;
}
