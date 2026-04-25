import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import NotificationPreferences from "@/components/public/NotificationPreferences";

function mockLocalStorage() {
  const store = new Map<string, string>();
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, val: string) => store.set(key, val),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
    },
    writable: true,
  });
  return store;
}

describe("NotificationPreferences", () => {
  let store: Map<string, string>;

  beforeEach(() => {
    store = mockLocalStorage();
  });

  afterEach(() => {
    cleanup();
    store.clear();
  });

  it("renders all category checkboxes", () => {
    render(<NotificationPreferences />);
    expect(screen.getByText("SSC")).toBeInTheDocument();
    expect(screen.getByText("Railway")).toBeInTheDocument();
    expect(screen.getByText("Banking")).toBeInTheDocument();
    expect(screen.getByText("UPSC")).toBeInTheDocument();
    expect(screen.getByText("State Jobs")).toBeInTheDocument();
    expect(screen.getByText("Defence")).toBeInTheDocument();
    expect(screen.getByText("Results")).toBeInTheDocument();
    expect(screen.getByText("Admit Cards")).toBeInTheDocument();
  });

  it("all categories are checked by default", () => {
    render(<NotificationPreferences />);
    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach((cb) => {
      expect(cb).toBeChecked();
    });
  });

  it("toggles a category and persists to localStorage", () => {
    render(<NotificationPreferences />);
    const sscCheckbox = screen.getAllByRole("checkbox")[0]; // SSC is first
    fireEvent.click(sscCheckbox);
    expect(sscCheckbox).not.toBeChecked();

    const stored = JSON.parse(store.get("notificationPrefs") || "{}");
    expect(stored.ssc).toBe(false);
  });

  it("restores saved preferences from localStorage", () => {
    store.set(
      "notificationPrefs",
      JSON.stringify({
        ssc: false,
        railway: true,
        banking: false,
        upsc: true,
        state: true,
        defence: true,
        results: true,
        "admit-card": true,
      })
    );
    render(<NotificationPreferences />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).not.toBeChecked(); // SSC
    expect(checkboxes[1]).toBeChecked(); // Railway
    expect(checkboxes[2]).not.toBeChecked(); // Banking
  });
});
