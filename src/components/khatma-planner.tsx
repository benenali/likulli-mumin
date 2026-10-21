"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { calculateKhatmaPlan, DEFAULT_PAGE_COUNT } from "@/lib/khatma-planner.mjs";

const STORAGE_KEY = "likulli-mumin:khatma-plan";
const DURATION_OPTIONS = [7, 30, 60, 90, 180, 365];

type SavedPlan = {
  pageCount: number;
  durationDays: number;
  completedDays: number[];
};

function isValidSavedPlan(value: unknown): value is SavedPlan {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<SavedPlan>;
  return Number.isSafeInteger(candidate.pageCount)
    && (candidate.pageCount as number) >= 1
    && (candidate.pageCount as number) <= 2000
    && Number.isSafeInteger(candidate.durationDays)
    && DURATION_OPTIONS.includes(candidate.durationDays as number)
    && Array.isArray(candidate.completedDays)
    && candidate.completedDays.every((day) => Number.isSafeInteger(day)
      && day >= 0 && day < (candidate.durationDays as number));
}

export default function KhatmaPlanner() {
  const [pageCount, setPageCount] = useState(DEFAULT_PAGE_COUNT);
  const [durationDays, setDurationDays] = useState(30);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isValidSavedPlan(parsed)) {
          // Restore browser-only saved progress after hydration to avoid server/client markup mismatch.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setPageCount(parsed.pageCount);
          setDurationDays(parsed.durationDays);
          setCompletedDays([...new Set(parsed.completedDays)]);
        }
      }
    } catch {
      // The planner remains usable in this session if local storage is unavailable.
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        pageCount,
        durationDays,
        completedDays,
      }));
    } catch {
      // Keep the plan in memory if persistent storage is blocked.
    }
  }, [pageCount, durationDays, completedDays, isReady]);

  const plan = useMemo(
    () => calculateKhatmaPlan(pageCount, durationDays),
    [pageCount, durationDays],
  );
  const completedCount = completedDays.length;
  const progress = Math.round((completedCount / durationDays) * 100);

  function changePageCount(nextValue: string) {
    const parsed = Number(nextValue);
    if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > 2000) return;
    setPageCount(parsed);
    setCompletedDays([]);
  }

  function changeDuration(nextValue: string) {
    const parsed = Number(nextValue);
    if (!DURATION_OPTIONS.includes(parsed)) return;
    setDurationDays(parsed);
    setCompletedDays([]);
  }

  function toggleDay(dayIndex: number) {
    setCompletedDays((current) => current.includes(dayIndex)
      ? current.filter((day) => day !== dayIndex)
      : [...current, dayIndex].sort((a, b) => a - b));
  }

  function resetProgress() {
    setCompletedDays([]);
  }

  return (
    <main className="page-shell tool-page">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="لكل مؤمن - الصفحة الرئيسية">
          <span className="brand-mark" aria-hidden="true">ك</span>
          <span>لكل مؤمن</span>
        </Link>
        <Link className="settings-toggle" href="/">الرئيسية</Link>
      </header>

      <section className="tool-content khatma-content" aria-labelledby="khatma-title">
        <p className="eyebrow">أداة يومية · تحفظ خطتك على جهازك</p>
        <h1 id="khatma-title">خطة ختمة القرآن</h1>
        <p className="tool-intro">
          نظّم هدف القراءة وسجّل الأيام التي أنجزت فيها وردك. لا تتضمن هذه الأداة نص المصحف؛ عدد الصفحات قابل للتعديل بحسب طبعة المصحف التي تقرأ منها.
        </p>

        <section className="khatma-card" aria-label="إعدادات خطة الختمة">
          <div className="khatma-fields">
            <label className="khatma-field">
              <span>عدد صفحات المصحف</span>
              <input
                type="number"
                min="1"
                max="2000"
                step="1"
                inputMode="numeric"
                value={pageCount}
                onChange={(event) => changePageCount(event.target.value)}
                disabled={!isReady}
              />
              <small>الافتراضي 604 صفحات؛ غيّره ليتوافق مع مصحفك.</small>
            </label>
            <label className="khatma-field">
              <span>مدة الختمة</span>
              <select value={durationDays} onChange={(event) => changeDuration(event.target.value)} disabled={!isReady}>
                {DURATION_OPTIONS.map((days) => (
                  <option key={days} value={days}>{days} يومًا</option>
                ))}
              </select>
            </label>
          </div>

          <div className="khatma-summary" aria-live="polite">
            <div className="khatma-stat">
              <span>القراءة اليومية</span>
              <strong>{plan.pagesPerDay} صفحة تقريبًا</strong>
            </div>
            <div className="khatma-stat">
              <span>تقسيم مقترح</span>
              <strong>نحو {plan.pagesPerPrayer} صفحات بعد كل صلاة</strong>
            </div>
          </div>
          <p className="settings-note">
            يتفاوت ورد اليوم بين {Math.min(...plan.dailyTargets)} و{Math.max(...plan.dailyTargets)} صفحة حتى يكتمل مجموع {plan.totalPages} صفحة خلال {durationDays} يومًا. تقسيم الصلوات اقتراح تنظيمي وليس حكمًا دينيًا.
          </p>
        </section>

        <section className="khatma-progress-card" aria-labelledby="progress-title">
          <div className="khatma-progress-heading">
            <div>
              <h2 id="progress-title">تقدّم الختمة</h2>
              <p>{completedCount} من {durationDays} يومًا مكتملًا</p>
            </div>
            <strong>{progress}٪</strong>
          </div>
          <div className="khatma-progress-track" role="progressbar" aria-label="نسبة إنجاز الختمة" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="khatma-day-list">
            {plan.dailyTargets.map((pages, index) => {
              const isCompleted = completedDays.includes(index);
              return (
                <button
                  className={isCompleted ? "khatma-day is-complete" : "khatma-day"}
                  type="button"
                  key={index}
                  aria-pressed={isCompleted}
                  onClick={() => toggleDay(index)}
                  disabled={!isReady}
                >
                  <span className="khatma-day-check" aria-hidden="true">{isCompleted ? "✓" : index + 1}</span>
                  <span className="khatma-day-copy">
                    <strong>اليوم {index + 1}</strong>
                    <small>{pages} صفحة</small>
                  </span>
                  <span className="khatma-day-status">{isCompleted ? "مكتمل" : "تحديد كمكتمل"}</span>
                </button>
              );
            })}
          </div>

          <div className="khatma-footer-actions">
            <button className="settings-option" type="button" onClick={resetProgress} disabled={!isReady || completedCount === 0}>
              تصفير التقدم
            </button>
            <p className="settings-note" role="status">
              {isReady ? "تُحفظ الخطة والتقدم محليًا على هذا الجهاز." : "جارٍ استعادة خطتك المحفوظة…"}
            </p>
          </div>
        </section>
        <p className="tool-caution">لا يلزم حساب أو اتصال مستمر. مسح بيانات المتصفح قد يحذف الخطة المحفوظة؛ لا تُرفع بياناتك إلى خادم.</p>
      </section>
    </main>
  );
}
