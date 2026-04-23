import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import TrendingWidget from "@/components/public/TrendingWidget";

describe("TrendingWidget", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders nothing when no posts", () => {
    const { container } = render(<TrendingWidget posts={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("displays trending posts with rank numbers", () => {
    const posts = [
      { slug: "ssc-cgl", titleEn: "SSC CGL 2026", views: 5000 },
      { slug: "rrb-ntpc", titleEn: "RRB NTPC Result", views: 3000 },
    ];
    render(<TrendingWidget posts={posts} />);
    expect(screen.getByText("Trending Now")).toBeInTheDocument();
    expect(screen.getByText("SSC CGL 2026")).toBeInTheDocument();
    expect(screen.getByText("RRB NTPC Result")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows formatted view count", () => {
    const posts = [{ slug: "test", titleEn: "Test", views: 12345 }];
    render(<TrendingWidget posts={posts} />);
    expect(screen.getByText("12,345")).toBeInTheDocument();
  });

  it("limits to 10 posts maximum", () => {
    const posts = Array.from({ length: 15 }, (_, i) => ({
      slug: `post-${i}`,
      titleEn: `Post ${i}`,
      views: 100 - i,
    }));
    render(<TrendingWidget posts={posts} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(10);
  });

  it("renders links pointing to post pages", () => {
    const posts = [{ slug: "my-post", titleEn: "My Post", views: 100 }];
    render(<TrendingWidget posts={posts} />);
    const link = screen.getByText("My Post").closest("a");
    expect(link).toHaveAttribute("href", "/post/my-post");
  });
});
