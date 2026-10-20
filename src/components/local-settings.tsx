"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type Theme = "light" | "dark";
type TextSize = "normal" | "large";
type Preferences = { theme: Theme; textSize: TextSize };

const STORAGE_KEY = "likulli-mumin:preferences";
const DEFAULT_PREFERENCES: Preferences = { theme: "light", textSize: "normal" };
const DEFAULT_SNAPSHOT = JSON.stringify(DEFAULT_PREFERENCES);
const listeners = new Set<() => void>();

function getSnapshot(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? DEFAULT_SNAPSHOT;
  } catch {
    return DEFAULT_SNAPSHOT;
  }
}

function getServerSnapshot(): string {
  return DEFAULT_SNAPSHOT;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function parsePreferences(snapshot: string): Preferences {
  try {
    const parsed = JSON.parse(snapshot) as Partial<Preferences>;
    return {
      theme: parsed.theme === "dark" ? "dark" : "light",
      textSize: parsed.textSize === "large" ? "large" : "normal",
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function savePreferences(preferences: Preferences): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // Preferences still apply for the current render if persistent storage is blocked.
  }
  listeners.forEach((listener) => listener());
}

export default function LocalSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const preferences = parsePreferences(snapshot);

  useEffect(() => {
    document.documentElement.dataset.theme = preferences.theme;
    document.documentElement.dataset.textSize = preferences.textSize;
  }, [preferences.theme, preferences.textSize]);

  function updatePreferences(next: Preferences) {
    document.documentElement.dataset.theme = next.theme;
    document.documentElement.dataset.textSize = next.textSize;
    savePreferences(next);
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
                className={preferences.theme === "light" ? "settings-option is-selected" : "settings-option"}
                aria-pressed={preferences.theme === "light"}
                onClick={() => updatePreferences({ ...preferences, theme: "light" })}
              >
                فاتح
              </button>
              <button
                type="button"
                className={preferences.theme === "dark" ? "settings-option is-selected" : "settings-option"}
                aria-pressed={preferences.theme === "dark"}
                onClick={() => updatePreferences({ ...preferences, theme: "dark" })}
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
                className={preferences.textSize === "normal" ? "settings-option is-selected" : "settings-option"}
                aria-pressed={preferences.textSize === "normal"}
                onClick={() => updatePreferences({ ...preferences, textSize: "normal" })}
              >
                عادي
              </button>
              <button
                type="button"
                className={preferences.textSize === "large" ? "settings-option is-selected" : "settings-option"}
                aria-pressed={preferences.textSize === "large"}
                onClick={() => updatePreferences({ ...preferences, textSize: "large" })}
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
