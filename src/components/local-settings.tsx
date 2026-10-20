"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
type TextSize = "normal" | "large";

const STORAGE_KEY = "likulli-mumin:preferences";

export default function LocalSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [textSize, setTextSize] = useState<TextSize>("normal");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const preferences = JSON.parse(saved) as Partial<{
        theme: Theme;
        textSize: TextSize;
      }>;
      const nextTheme = preferences.theme === "dark" ? "dark" : "light";
      const nextTextSize = preferences.textSize === "large" ? "large" : "normal";
      document.documentElement.dataset.theme = nextTheme;
      document.documentElement.dataset.textSize = nextTextSize;
      setTheme(nextTheme);
      setTextSize(nextTextSize);
    } catch {
      // Keep safe defaults if browser storage is unavailable or invalid.
    }
  }, []);

  function savePreferences(nextTheme: Theme, nextTextSize: TextSize) {
    setTheme(nextTheme);
    setTextSize(nextTextSize);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.dataset.textSize = nextTextSize;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ theme: nextTheme, textSize: nextTextSize }),
      );
    } catch {
      // The current session still works when persistent storage is blocked.
    }
  }

  return (
    <div className="local-settings">
      <button
        className="settings-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="local-settings-panel"
        onClick={() => setIsOpen((open) => !open)}
      >
        الإعدادات
      </button>
      {isOpen && (
        <section className="settings-panel" id="local-settings-panel" aria-label="إعدادات العرض">
          <div className="settings-group">
            <h2>المظهر</h2>
            <div className="settings-options">
              <button
                type="button"
                className={theme === "light" ? "settings-option is-selected" : "settings-option"}
                aria-pressed={theme === "light"}
                onClick={() => savePreferences("light", textSize)}
              >
                فاتح
              </button>
              <button
                type="button"
                className={theme === "dark" ? "settings-option is-selected" : "settings-option"}
                aria-pressed={theme === "dark"}
                onClick={() => savePreferences("dark", textSize)}
              >
                داكن
              </button>
            </div>
          </div>
          <div className="settings-group">
            <h2>حجم النص</h2>
            <div className="settings-options">
              <button
                type="button"
                className={textSize === "normal" ? "settings-option is-selected" : "settings-option"}
                aria-pressed={textSize === "normal"}
                onClick={() => savePreferences(theme, "normal")}
              >
                عادي
              </button>
              <button
                type="button"
                className={textSize === "large" ? "settings-option is-selected" : "settings-option"}
                aria-pressed={textSize === "large"}
                onClick={() => savePreferences(theme, "large")}
              >
                كبير
              </button>
            </div>
          </div>
          <p className="settings-note">تُحفظ هذه الإعدادات على هذا الجهاز فقط، ولا تحتاج إلى اتصال بالإنترنت.</p>
        </section>
      )}
    </div>
  );
}
