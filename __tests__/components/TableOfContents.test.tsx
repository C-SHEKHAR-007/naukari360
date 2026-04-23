import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import TableOfContents from "@/components/public/TableOfContents";

describe("TableOfContents", () => {
  beforeEach(() => {
    // Mock IntersectionObserver as a proper constructor
    function MockIntersectionObserver() {
      return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
    }
    Object.defineProperty(window, "IntersectionObserver", {
      value: MockIntersectionObserver,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders nothing when less than 3 headings", () => {
    const html = "<h2 id='a'>One</h2><h2 id='b'>Two</h2>";
    const { container } = render(<TableOfContents contentHtml={html} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders TOC with 3+ headings", () => {
    const html = `
      <h2 id="intro">Introduction</h2>
      <h2 id="details">Details</h2>
      <h3 id="sub">Sub Section</h3>
      <h2 id="conclusion">Conclusion</h2>
    `;
    render(<TableOfContents contentHtml={html} />);
    expect(screen.getByText("Table of Contents")).toBeInTheDocument();
    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("Sub Section")).toBeInTheDocument();
    expect(screen.getByText("Conclusion")).toBeInTheDocument();
  });

  it("generates navigation links with correct hrefs", () => {
    const html = `
      <h2 id="one">One</h2>
      <h2 id="two">Two</h2>
      <h2 id="three">Three</h2>
    `;
    render(<TableOfContents contentHtml={html} />);
    const link = screen.getByText("One").closest("a");
    expect(link).toHaveAttribute("href", "#one");
  });

  it("has proper accessibility label", () => {
    const html = `
      <h2 id="a">A</h2>
      <h2 id="b">B</h2>
      <h2 id="c">C</h2>
    `;
    render(<TableOfContents contentHtml={html} />);
    expect(screen.getByLabelText("Table of contents")).toBeInTheDocument();
  });
});
