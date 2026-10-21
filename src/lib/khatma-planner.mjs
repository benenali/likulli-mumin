export const DEFAULT_PAGE_COUNT = 604;

export function calculateKhatmaPlan(pageCount, durationDays) {
  if (!Number.isSafeInteger(pageCount) || pageCount < 1 || pageCount > 2000) {
    throw new RangeError("Page count must be an integer between 1 and 2000.");
  }
  if (!Number.isSafeInteger(durationDays) || durationDays < 1 || durationDays > 3650) {
    throw new RangeError("Duration must be an integer between 1 and 3650 days.");
  }
  const basePages = Math.floor(pageCount / durationDays);
  const extraDays = pageCount % durationDays;
  const dailyTargets = Array.from({ length: durationDays }, (_, index) =>
    basePages + (index < extraDays ? 1 : 0)
  );
  return {
    pageCount,
    durationDays,
    dailyTargets,
    pagesPerDay: Math.ceil(pageCount / durationDays),
    totalPages: dailyTargets.reduce((sum, pages) => sum + pages, 0),
    pagesPerPrayer: Math.ceil(Math.max(1, Math.ceil(pageCount / durationDays)) / 5),
  };
}
