import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchInput from "@/components/public/SearchInput";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("SearchInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search input with placeholder", () => {
    const { container } = render(<SearchInput />);
    const input = container.querySelector("input")!;
    expect(input).toBeInTheDocument();
    expect(input.placeholder).toContain("Search");
  });

  it("submits search form and navigates", () => {
    const { container } = render(<SearchInput />);
    const input = container.querySelector("input")!;
    const form = container.querySelector("form")!;

    fireEvent.change(input, { target: { value: "SSC CGL" } });
    fireEvent.submit(form);

    expect(mockPush).toHaveBeenCalledWith("/search?q=SSC%20CGL");
  });

  it("uses defaultValue when provided", () => {
    const { container } = render(<SearchInput defaultValue="Railway" />);
    const input = container.querySelector("input")!;
    expect(input.value).toBe("Railway");
  });

  it("does not navigate on empty query", () => {
    const { container } = render(<SearchInput />);
    const form = container.querySelector("form")!;

    fireEvent.submit(form);
    expect(mockPush).not.toHaveBeenCalled();
  });
});
