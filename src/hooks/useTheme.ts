import { useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const THEME_EVENT = "portfolio-theme-change";

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function storedTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem("portfolio-theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Ignore storage access failures.
  }
  return null;
}

function getSnapshot(): Theme {
  return storedTheme() ?? systemTheme();
}

function getServerSnapshot(): Theme {
  return "light";
}

function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => callback();

  media.addEventListener("change", onChange);
  window.addEventListener("storage", onChange);
  window.addEventListener(THEME_EVENT, onChange);

  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener("storage", onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("portfolio-theme", next);
    } catch {
      // Ignore storage access failures.
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, [theme]);

  return { theme, toggle };
}
