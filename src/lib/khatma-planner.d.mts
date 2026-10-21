export const DEFAULT_PAGE_COUNT: number;

export interface KhatmaPlan {
  pageCount: number;
  durationDays: number;
  dailyTargets: number[];
  pagesPerDay: number;
  totalPages: number;
  pagesPerPrayer: number;
}

export function calculateKhatmaPlan(pageCount: number, durationDays: number): KhatmaPlan;
