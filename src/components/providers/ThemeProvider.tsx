"use client";

import { useSyncExternalStore } from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      // Same key the previous custom provider used, so saved choices carry over
      storageKey={THEME_STORAGE_KEY}
    >
      {children}
    </NextThemesProvider>
  );
}

// `mounted` without useEffect + setState: false during SSR/hydration, true after
const noopSubscribe = () => () => {};

export function useTheme() {
  const { theme, resolvedTheme, setTheme } = useNextTheme();
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  return {
    /** What is actually shown: "light" or "dark" (system preference resolved) */
    theme: (resolvedTheme === "dark" ? "dark" : "light") as ResolvedTheme,
    /** What the user chose, including "system" */
    preference: (theme ?? "system") as ThemePreference,
    setTheme: (t: ThemePreference) => setTheme(t),
    mounted,
  };
}
