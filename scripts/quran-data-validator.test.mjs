import test from "node:test";
import assert from "node:assert/strict";
import { validateQuranDataset } from "./quran-data-validator.mjs";

const validFixture = {
  surahs: [
    { number: 1, nameArabic: "سورة تجريبية", verses: [
      { number: 1, text: "نص اختبار" },
      { number: 2, text: "نص اختبار آخر" },
    ] },
    { number: 2, nameArabic: "سورة تجريبية ثانية", verses: [
      { number: 1, text: "نص اختبار ثالث" },
    ] },
  ],
};

test("accepts a correctly ordered dataset when expected totals are supplied", () => {
  assert.deepEqual(validateQuranDataset(validFixture, { surahCount: 2, verseCount: 3 }), []);
});

test("rejects missing surahs and incorrect total verse counts", () => {
  const errors = validateQuranDataset({ surahs: [] }, { surahCount: 2, verseCount: 3 });
  assert.ok(errors.some((error) => error.includes("Expected 2 surahs")));
  assert.ok(errors.some((error) => error.includes("Expected 3 verses")));
});

test("rejects verse numbering gaps and empty text", () => {
  const broken = {
    surahs: [{ number: 1, nameArabic: "سورة تجريبية", verses: [
      { number: 2, text: "" },
    ] }],
  };
  const errors = validateQuranDataset(broken, { surahCount: 1, verseCount: 1 });
  assert.ok(errors.some((error) => error.includes("invalid number")));
  assert.ok(errors.some((error) => error.includes("has no text")));
});
