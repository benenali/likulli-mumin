import test from "node:test";
import assert from "node:assert/strict";
import { calculateKhatmaPlan } from "../src/lib/khatma-planner.mjs";

test("distributes 604 pages across 30 days without losing pages", () => {
  const plan = calculateKhatmaPlan(604, 30);
  assert.equal(plan.totalPages, 604);
  assert.equal(plan.dailyTargets.length, 30);
  assert.equal(plan.dailyTargets.reduce((sum, pages) => sum + pages, 0), 604);
  assert.equal(plan.dailyTargets.filter((pages) => pages === 21).length, 4);
  assert.equal(plan.dailyTargets.filter((pages) => pages === 20).length, 26);
});

test("supports a short plan and evenly spreads targets", () => {
  const plan = calculateKhatmaPlan(10, 3);
  assert.deepEqual(plan.dailyTargets, [4, 3, 3]);
  assert.equal(plan.pagesPerDay, 4);
});

test("rejects invalid page counts and durations", () => {
  assert.throws(() => calculateKhatmaPlan(0, 30), RangeError);
  assert.throws(() => calculateKhatmaPlan(604, 0), RangeError);
  assert.throws(() => calculateKhatmaPlan(1.5, 7), RangeError);
  assert.throws(() => calculateKhatmaPlan(2001, 7), RangeError);
});
