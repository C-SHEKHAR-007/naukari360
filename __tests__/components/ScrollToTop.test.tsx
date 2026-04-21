import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import ScrollToTop from "@/components/public/ScrollToTop";

describe("ScrollToTop", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
  });

  afterEach(() => {
    cleanup();
  });

  it("is hidden when page is at the top", () => {
    render(<ScrollToTop />);
    expect(screen.queryByLabelText("Scroll to top")).not.toBeInTheDocument();
  });

  it("becomes visible after scrolling past 300px", () => {
    render(<ScrollToTop />);
    Object.defineProperty(window, "scrollY", { value: 350 });
    fireEvent.scroll(window);
    expect(screen.getByLabelText("Scroll to top")).toBeInTheDocument();
  });

  it("hides again when scrolled back to top", () => {
    render(<ScrollToTop />);
    Object.defineProperty(window, "scrollY", { value: 400 });
    fireEvent.scroll(window);
    expect(screen.getByLabelText("Scroll to top")).toBeInTheDocument();

    Object.defineProperty(window, "scrollY", { value: 100 });
    fireEvent.scroll(window);
    expect(screen.queryByLabelText("Scroll to top")).not.toBeInTheDocument();
  });

  it("scrolls to top when clicked", () => {
    window.scrollTo = vi.fn();
    render(<ScrollToTop />);
    Object.defineProperty(window, "scrollY", { value: 500 });
    fireEvent.scroll(window);

    fireEvent.click(screen.getByLabelText("Scroll to top"));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
