"use client";

import { useState } from "react";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "theme";

function readInitialTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.setAttribute("data-theme", mode);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return readInitialTheme();
  });

  function onToggle() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  }

  const label = theme === "light" ? "Switch to dark mode" : "Switch to light mode";

  return (
    <button aria-label={label} className="icon-button" onClick={onToggle} title={label} type="button">
      {theme === "dark" ? (
        <svg aria-hidden="true" className="icon-svg" viewBox="0 0 24 24">
          <path
            d="M20 15.2A8.7 8.7 0 1 1 8.8 4a7.2 7.2 0 1 0 11.2 11.2Z"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      ) : (
        <svg aria-hidden="true" className="icon-svg" viewBox="0 0 24 24">
          <circle cx="12" cy="12" fill="none" r="4.2" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M12 2.4v2.5M12 19.1v2.5M4.5 4.5l1.8 1.8M17.7 17.7l1.8 1.8M2.4 12h2.5M19.1 12h2.5M4.5 19.5l1.8-1.8M17.7 6.3l1.8-1.8"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
      )}
    </button>
  );
}
