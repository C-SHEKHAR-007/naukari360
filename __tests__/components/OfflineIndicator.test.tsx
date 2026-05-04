import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import OfflineIndicator from "@/components/public/OfflineIndicator";

describe("OfflineIndicator", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "onLine", { value: true, writable: true, configurable: true });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders nothing when online", () => {
    const { container } = render(<OfflineIndicator />);
    expect(container.innerHTML).toBe("");
  });

  it("shows offline message when offline", () => {
    Object.defineProperty(navigator, "onLine", { value: false, configurable: true });
    render(<OfflineIndicator />);
    expect(screen.getByText(/You're offline/)).toBeDefined();
  });

  it("responds to offline event", () => {
    render(<OfflineIndicator />);
    act(() => {
      Object.defineProperty(navigator, "onLine", { value: false, configurable: true });
      window.dispatchEvent(new Event("offline"));
    });
    expect(screen.getByText(/You're offline/)).toBeDefined();
  });

  it("hides indicator when back online", () => {
    Object.defineProperty(navigator, "onLine", { value: false, configurable: true });
    render(<OfflineIndicator />);
    act(() => {
      Object.defineProperty(navigator, "onLine", { value: true, configurable: true });
      window.dispatchEvent(new Event("online"));
    });
    expect(screen.queryByText(/You're offline/)).toBeNull();
  });
});
