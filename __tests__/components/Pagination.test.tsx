import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Pagination } from "@/components/public/Pagination";

describe("Pagination", () => {
  it("renders current page number", () => {
    const { container } = render(<Pagination currentPage={3} totalPages={10} baseUrl="/jobs" />);
    const links = container.querySelectorAll("a");
    const currentLink = Array.from(links).find(l => l.textContent === "3");
    expect(currentLink).toBeTruthy();
  });

  it("renders Previous link when not on first page", () => {
    const { container } = render(<Pagination currentPage={2} totalPages={5} baseUrl="/jobs" />);
    const prev = Array.from(container.querySelectorAll("a")).find(l => l.textContent === "Previous");
    expect(prev).toBeTruthy();
    expect(prev!.getAttribute("href")).toBe("/jobs?page=1");
  });

  it("does not render Previous on first page", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={5} baseUrl="/jobs" />);
    const prev = Array.from(container.querySelectorAll("a")).find(l => l.textContent === "Previous");
    expect(prev).toBeUndefined();
  });

  it("renders Next link when not on last page", () => {
    const { container } = render(<Pagination currentPage={2} totalPages={5} baseUrl="/jobs" />);
    const next = Array.from(container.querySelectorAll("a")).find(l => l.textContent === "Next");
    expect(next).toBeTruthy();
    expect(next!.getAttribute("href")).toBe("/jobs?page=3");
  });

  it("does not render Next on last page", () => {
    const { container } = render(<Pagination currentPage={5} totalPages={5} baseUrl="/jobs" />);
    const next = Array.from(container.querySelectorAll("a")).find(l => l.textContent === "Next");
    expect(next).toBeUndefined();
  });

  it("renders nothing when only one page", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} baseUrl="/jobs" />);
    expect(container.innerHTML).toBe("");
  });

  it("uses correct baseUrl in links", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={3} baseUrl="/category/results" />);
    const next = Array.from(container.querySelectorAll("a")).find(l => l.textContent === "Next");
    expect(next!.getAttribute("href")).toBe("/category/results?page=2");
  });
});
