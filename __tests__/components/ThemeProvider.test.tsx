import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, cleanup } from "@testing-library/react";

const nextThemes = vi.hoisted(() => ({
  theme: "system" as string | undefined,
  resolvedTheme: "dark" as string | undefined,
  setTheme: (() => {}) as (t: string) => void,
}));

vi.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => nextThemes,
}));

import { useTheme } from "@/components/providers/ThemeProvider";

describe("useTheme", () => {
  afterEach(() => cleanup());

  it("exposes the resolved theme and the user's preference separately", () => {
    nextThemes.theme = "system";
    nextThemes.resolvedTheme = "dark";
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
    expect(result.current.preference).toBe("system");
    expect(result.current.mounted).toBe(true);
  });

  it("falls back to light / system before next-themes has resolved", () => {
    nextThemes.theme = undefined;
    nextThemes.resolvedTheme = undefined;
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
    expect(result.current.preference).toBe("system");
  });

  it("passes the chosen theme through to next-themes", () => {
    nextThemes.setTheme = vi.fn();
    const { result } = renderHook(() => useTheme());
    result.current.setTheme("dark");
    expect(nextThemes.setTheme).toHaveBeenCalledWith("dark");
  });
});
