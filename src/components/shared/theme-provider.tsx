"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  // Initialize from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const initial = stored || "system";
    setThemeState(initial);
    const r = initial === "system" ? getSystemTheme() : initial;
    setResolved(r);
    document.documentElement.classList.toggle("dark", r === "dark");
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    const r = t === "system" ? getSystemTheme() : t;
    setResolved(r);
    document.documentElement.classList.toggle("dark", r === "dark");
    if (t === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", t);
    }
  }, []);

  // Listen for system preference changes when in "system" mode
  useEffect(() => {
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setResolved(e.matches ? "dark" : "light");
      document.documentElement.classList.toggle("dark", e.matches);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, setTheme, resolvedTheme: resolved }),
    [theme, setTheme, resolved]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
