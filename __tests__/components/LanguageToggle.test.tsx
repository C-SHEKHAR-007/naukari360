import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import LanguageToggle from "@/components/public/LanguageToggle";

const mockSetLang = vi.fn();
vi.mock("@/components/providers/LanguageProvider", () => ({
  useLanguage: () => ({ lang: "en", setLang: mockSetLang }),
}));

describe("LanguageToggle", () => {
  it("renders toggle button", () => {
    const { container } = render(<LanguageToggle />);
    const btn = container.querySelector("button");
    expect(btn).toBeTruthy();
  });

  it("shows Hindi text when lang is en", () => {
    const { container } = render(<LanguageToggle />);
    const btn = container.querySelector("button")!;
    expect(btn.textContent).toBe("हिं");
  });

  it("toggles language to hi on click", () => {
    const { container } = render(<LanguageToggle />);
    const btn = container.querySelector("button")!;
    fireEvent.click(btn);
    expect(mockSetLang).toHaveBeenCalledWith("hi");
  });

  it("has accessible aria-label", () => {
    const { container } = render(<LanguageToggle />);
    const btn = container.querySelector("button")!;
    expect(btn.getAttribute("aria-label")).toBe("Toggle language");
  });
});
