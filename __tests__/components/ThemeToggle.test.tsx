import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

const state = vi.hoisted(() => ({
  preference: "system" as "system" | "light" | "dark",
  mounted: true,
  setTheme: (() => {}) as (t: string) => void,
}));

vi.mock("@/components/providers/ThemeProvider", () => ({
  useTheme: () => ({
    theme: state.preference === "dark" ? "dark" : "light",
    preference: state.preference,
    setTheme: state.setTheme,
    mounted: state.mounted,
  }),
}));

import ThemeToggle from "@/components/public/ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    state.preference = "system";
    state.mounted = true;
    state.setTheme = vi.fn();
  });
  afterEach(() => cleanup());

  it.each([
    ["system", "light", /device theme\. switch to light theme/i],
    ["light", "dark", /light theme\. switch to dark theme/i],
    ["dark", "system", /dark theme\. switch to device theme/i],
  ] as const)("from %s it switches to %s", (current, next, label) => {
    state.preference = current;
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: label });
    fireEvent.click(button);
    expect(state.setTheme).toHaveBeenCalledWith(next);
  });

  it("renders a neutral label and no icon until mounted, matching the server HTML", () => {
    state.mounted = false;
    state.preference = "dark";
    const { container } = render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: "Change theme" })).toBeInTheDocument();
    expect(container.querySelector("svg")).toBeNull();
  });
});
