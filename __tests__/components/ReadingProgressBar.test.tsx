import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import ReadingProgressBar from "@/components/public/ReadingProgressBar";

describe("ReadingProgressBar", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 2000,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 800,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("is hidden when not scrolled", () => {
    render(<ReadingProgressBar />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("shows progress when scrolled", () => {
    render(<ReadingProgressBar />);
    Object.defineProperty(window, "scrollY", { value: 600 });
    fireEvent.scroll(window);
    const bar = screen.getByRole("progressbar");
    expect(bar).toBeInTheDocument();
    expect(bar.getAttribute("aria-valuenow")).toBe("50");
  });

  it("shows 100% at the bottom", () => {
    render(<ReadingProgressBar />);
    Object.defineProperty(window, "scrollY", { value: 1200 });
    fireEvent.scroll(window);
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("100");
  });

  it("caps progress at 100%", () => {
    render(<ReadingProgressBar />);
    Object.defineProperty(window, "scrollY", { value: 1500 });
    fireEvent.scroll(window);
    const bar = screen.getByRole("progressbar");
    expect(Number(bar.getAttribute("aria-valuenow"))).toBeLessThanOrEqual(100);
  });
});
