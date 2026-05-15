"use client";

import { createContext, useContext, useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
  mounted: false,
});

const STORAGE_KEY = "theme";

// useSyncExternalStore to track "mounted" without useEffect + setState
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const isDark = document.documentElement.classList.contains("dark");
  if (isDark) return "dark";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "dark" ? "dark" : "light";
}

// Module-level state to avoid useState (which triggers lint issues with effects)
let currentTheme: Theme = "light";
let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

const themeStore = {
  subscribe(listener: () => void) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  getSnapshot() {
    return currentTheme;
  },
  getServerSnapshot() {
    return "light" as Theme;
  },
  setTheme(newTheme: Theme) {
    currentTheme = newTheme;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
    emitChange();
  },
  init() {
    currentTheme = getInitialTheme();
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize on first client render
  if (typeof window !== "undefined" && currentTheme === "light") {
    themeStore.init();
  }

  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot
  );

  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((newTheme: Theme) => {
    themeStore.setTheme(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mounted }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
