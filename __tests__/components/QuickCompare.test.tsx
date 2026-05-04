import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import QuickCompare, {
  addToCompare,
  removeFromCompare,
  isInCompare,
} from "@/components/public/QuickCompare";

const mockPost = {
  id: "post-1",
  titleEn: "SSC CGL 2026",
  slug: "ssc-cgl-2026",
  organization: "SSC",
  qualification: "Graduate",
  salary: "₹25,000 - ₹80,000",
  ageLimit: "18-27 Years",
  lastDate: "2026-05-15",
  totalPosts: "1500",
  feeGeneral: "₹100",
};

describe("QuickCompare", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders nothing when no posts in compare", () => {
    const { container } = render(<QuickCompare />);
    expect(container.innerHTML).toBe("");
  });

  it("shows floating bar when posts are added", () => {
    localStorage.setItem("compare_posts", JSON.stringify([mockPost]));
    render(<QuickCompare />);
    expect(screen.getByText("1 job selected")).toBeDefined();
  });

  it("shows compare button when 2+ posts", () => {
    const posts = [mockPost, { ...mockPost, id: "post-2", titleEn: "IBPS PO" }];
    localStorage.setItem("compare_posts", JSON.stringify(posts));
    render(<QuickCompare />);
    expect(screen.getByText("Compare")).toBeDefined();
  });

  it("opens comparison table on Compare click", () => {
    const posts = [mockPost, { ...mockPost, id: "post-2", titleEn: "IBPS PO" }];
    localStorage.setItem("compare_posts", JSON.stringify(posts));
    render(<QuickCompare />);
    const compareBtn = screen.getAllByText("Compare")[0];
    fireEvent.click(compareBtn);
    expect(screen.getByText("Job Comparison")).toBeDefined();
  });
});

describe("addToCompare", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds post to localStorage", () => {
    addToCompare(mockPost);
    const stored = JSON.parse(localStorage.getItem("compare_posts") || "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe("post-1");
  });

  it("limits to 3 posts max", () => {
    addToCompare(mockPost);
    addToCompare({ ...mockPost, id: "2" });
    addToCompare({ ...mockPost, id: "3" });
    const result = addToCompare({ ...mockPost, id: "4" });
    expect(result).toBe(false);
  });

  it("prevents duplicate posts", () => {
    addToCompare(mockPost);
    const result = addToCompare(mockPost);
    expect(result).toBe(false);
  });
});

describe("removeFromCompare", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("removes post from localStorage", () => {
    addToCompare(mockPost);
    removeFromCompare("post-1");
    const stored = JSON.parse(localStorage.getItem("compare_posts") || "[]");
    expect(stored).toHaveLength(0);
  });
});

describe("isInCompare", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns true for added post", () => {
    addToCompare(mockPost);
    expect(isInCompare("post-1")).toBe(true);
  });

  it("returns false for non-added post", () => {
    expect(isInCompare("post-99")).toBe(false);
  });
});
