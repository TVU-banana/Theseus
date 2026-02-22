"use client";

import { useEffect, useRef, useState } from "react";

type WidthMode = "narrow" | "standard" | "wide";

const STORAGE_KEY = "width-mode";
const WIDTH_OPTIONS: Array<{ label: string; value: WidthMode }> = [
  { label: "Narrow", value: "narrow" },
  { label: "Standard", value: "standard" },
  { label: "Wide", value: "wide" },
];

function readWidthMode(): WidthMode {
  const value = document.documentElement.getAttribute("data-width");
  if (value === "narrow" || value === "standard" || value === "wide") {
    return value;
  }

  return "standard";
}

function applyWidthMode(mode: WidthMode) {
  document.documentElement.setAttribute("data-width", mode);
}

export default function WidthSettings() {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<WidthMode>(() => {
    if (typeof window === "undefined") {
      return "standard";
    }

    return readWidthMode();
  });

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [isOpen]);

  function onChange(nextMode: WidthMode) {
    setMode(nextMode);
    applyWidthMode(nextMode);
    window.localStorage.setItem(STORAGE_KEY, nextMode);
  }

  return (
    <div className="settings-wrap" ref={panelRef}>
      <button
        aria-expanded={isOpen}
        aria-label="Open layout settings"
        className="icon-button"
        onClick={() => setIsOpen((value) => !value)}
        title="Layout settings"
        type="button"
      >
        <svg aria-hidden="true" className="icon-svg" viewBox="0 0 24 24">
          <path
            d="M10.3 3h3.4l.5 2.2a7.2 7.2 0 0 1 1.6.9l2.1-.9 2.3 2.3-.9 2.1c.3.5.6 1 .8 1.6l2.3.5v3.3l-2.3.5a7.2 7.2 0 0 1-.8 1.6l.9 2.1-2.3 2.3-2.1-.9a7.2 7.2 0 0 1-1.6.8l-.5 2.3h-3.4l-.5-2.3a7.2 7.2 0 0 1-1.6-.8l-2.1.9-2.3-2.3.9-2.1a7.2 7.2 0 0 1-.8-1.6L2 15.1v-3.3l2.2-.5a7.2 7.2 0 0 1 .9-1.6l-.9-2.1 2.3-2.3 2.1.9a7.2 7.2 0 0 1 1.6-.9L10.3 3Z"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
          <circle cx="12" cy="12" fill="none" r="2.9" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      </button>

      {isOpen ? (
        <section aria-label="Layout settings panel" className="settings-panel">
          <h3 className="settings-title">Layout</h3>
          <p className="settings-label">Page Width</p>
          <div className="settings-options">
            {WIDTH_OPTIONS.map((option) => (
              <button
                className="settings-option"
                data-active={mode === option.value}
                key={option.value}
                onClick={() => onChange(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
