import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import TextSizeControl from "@/components/public/TextSizeControl";

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

describe("TextSizeControl", () => {
  let store: Map<string, string>;

  beforeEach(() => {
    store = mockLocalStorage();
    vi.spyOn(document.documentElement.style, "setProperty");
  });

  afterEach(() => {
    cleanup();
    store.clear();
    vi.restoreAllMocks();
  });

  it("renders with default size of 16px", () => {
    render(<TextSizeControl />);
    expect(screen.getByText("16px")).toBeInTheDocument();
  });

  it("increases text size when + button clicked", () => {
    render(<TextSizeControl />);
    fireEvent.click(screen.getByLabelText("Increase text size"));
    expect(screen.getByText("18px")).toBeInTheDocument();
    expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(
      "--article-font-size",
      "18px"
    );
  });

  it("decreases text size when - button clicked", () => {
    render(<TextSizeControl />);
    fireEvent.click(screen.getByLabelText("Decrease text size"));
    expect(screen.getByText("14px")).toBeInTheDocument();
  });

  it("does not go below minimum (14px)", () => {
    render(<TextSizeControl />);
    fireEvent.click(screen.getByLabelText("Decrease text size")); // 14
    fireEvent.click(screen.getByLabelText("Decrease text size")); // still 14
    expect(screen.getByText("14px")).toBeInTheDocument();
  });

  it("does not go above maximum (22px)", () => {
    render(<TextSizeControl />);
    fireEvent.click(screen.getByLabelText("Increase text size")); // 18
    fireEvent.click(screen.getByLabelText("Increase text size")); // 20
    fireEvent.click(screen.getByLabelText("Increase text size")); // 22
    fireEvent.click(screen.getByLabelText("Increase text size")); // still 22
    expect(screen.getByText("22px")).toBeInTheDocument();
  });

  it("persists size to localStorage", () => {
    render(<TextSizeControl />);
    fireEvent.click(screen.getByLabelText("Increase text size"));
    expect(store.get("textSize")).toBe("18");
  });

  it("restores saved size from localStorage", () => {
    store.set("textSize", "20");
    render(<TextSizeControl />);
    expect(screen.getByText("20px")).toBeInTheDocument();
  });
});
