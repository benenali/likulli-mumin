"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "likulli-mumin:tasbeeh-count";

export default function TasbeehCounter() {
  const [count, setCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = Number(saved);
        if (Number.isSafeInteger(parsed) && parsed >= 0) {
          // Restore browser-only saved state after hydration to avoid a server/client markup mismatch.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setCount(parsed);
        }
      }
    } catch {
      // The counter remains usable for this session if storage is unavailable.
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, String(count));
    } catch {
      // Keep the current count in memory if persistent storage is blocked.
    }
  }, [count, isReady]);

  function resetCount() {
    setCount(0);
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

      <section className="tool-content" aria-labelledby="tasbeeh-title">
        <p className="eyebrow">أداة يومية · تعمل دون إنترنت بعد تحميل الصفحة</p>
        <h1 id="tasbeeh-title">المسبحة الإلكترونية</h1>
        <p className="tool-intro">
          عدّ تسبيحاتك بسهولة. يُحفظ العدد على هذا الجهاز، ولا تحتاج الأداة إلى حساب أو اتصال مستمر.
        </p>

        <section className="tasbeeh-card" aria-label="عداد التسبيح">
          <p className="tasbeeh-label">العدد الحالي</p>
          <output className="tasbeeh-count" aria-live="polite" aria-atomic="true">
            {new Intl.NumberFormat("ar-IQ").format(count)}
          </output>
          <button
            className="tasbeeh-increment"
            type="button"
            onClick={() => setCount((current) => current < Number.MAX_SAFE_INTEGER ? current + 1 : current)}
            disabled={!isReady || count >= Number.MAX_SAFE_INTEGER}
          >
            تسبيحة واحدة +
          </button>
          <div className="tasbeeh-actions">
            <button className="settings-option" type="button" onClick={resetCount} disabled={!isReady || count === 0}>
              تصفير العداد
            </button>
          </div>
          <p className="settings-note" role="status">
            {isReady ? "الحفظ المحلي مفعّل على هذا الجهاز." : "جارٍ استعادة العدد المحفوظ…"}
          </p>
        </section>
        <p className="tool-caution">هذه أداة للعدّ فقط؛ لا تعرض أذكاراً أو نصوصاً دينية غير موثقة.</p>
      </section>
    </main>
  );
}
