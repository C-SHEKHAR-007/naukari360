import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import RecentlyViewed, { trackPageView } from "@/components/public/RecentlyViewed";

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

describe("RecentlyViewed", () => {
  let store: Map<string, string>;

  beforeEach(() => {
    store = mockLocalStorage();
  });

  afterEach(() => {
    cleanup();
    store.clear();
  });

  it("renders nothing when no history", () => {
    const { container } = render(<RecentlyViewed />);
    expect(container.innerHTML).toBe("");
  });

  it("displays recently viewed posts from localStorage", () => {
    const posts = [
      { slug: "post-1", title: "SSC CGL 2026", visitedAt: Date.now() },
      { slug: "post-2", title: "Railway NTPC", visitedAt: Date.now() - 1000 },
    ];
    store.set("recentlyViewed", JSON.stringify(posts));

    render(<RecentlyViewed />);
    expect(screen.getByText("SSC CGL 2026")).toBeInTheDocument();
    expect(screen.getByText("Railway NTPC")).toBeInTheDocument();
  });

  it("excludes current slug from the list", () => {
    const posts = [
      { slug: "current-post", title: "Current Post", visitedAt: Date.now() },
      { slug: "other-post", title: "Other Post", visitedAt: Date.now() - 1000 },
    ];
    store.set("recentlyViewed", JSON.stringify(posts));

    render(<RecentlyViewed currentSlug="current-post" />);
    expect(screen.queryByText("Current Post")).not.toBeInTheDocument();
    expect(screen.getByText("Other Post")).toBeInTheDocument();
  });

  it("limits display to 5 posts", () => {
    const posts = Array.from({ length: 8 }, (_, i) => ({
      slug: `post-${i}`,
      title: `Post ${i}`,
      visitedAt: Date.now() - i * 1000,
    }));
    store.set("recentlyViewed", JSON.stringify(posts));

    render(<RecentlyViewed />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(5);
  });
});

describe("trackPageView", () => {
  let store: Map<string, string>;

  beforeEach(() => {
    store = mockLocalStorage();
  });

  afterEach(() => {
    store.clear();
  });

  it("adds a new entry to localStorage", () => {
    trackPageView("new-post", "New Post Title");
    const stored = JSON.parse(store.get("recentlyViewed") || "[]");
    expect(stored[0].slug).toBe("new-post");
    expect(stored[0].title).toBe("New Post Title");
  });

  it("moves existing entry to the front", () => {
    const posts = [
      { slug: "post-1", title: "Post 1", visitedAt: 100 },
      { slug: "post-2", title: "Post 2", visitedAt: 90 },
    ];
    store.set("recentlyViewed", JSON.stringify(posts));

    trackPageView("post-2", "Post 2");
    const stored = JSON.parse(store.get("recentlyViewed") || "[]");
    expect(stored[0].slug).toBe("post-2");
    expect(stored[1].slug).toBe("post-1");
  });

  it("limits to 10 entries", () => {
    const posts = Array.from({ length: 10 }, (_, i) => ({
      slug: `post-${i}`,
      title: `Post ${i}`,
      visitedAt: Date.now() - i * 1000,
    }));
    store.set("recentlyViewed", JSON.stringify(posts));

    trackPageView("brand-new", "Brand New");
    const stored = JSON.parse(store.get("recentlyViewed") || "[]");
    expect(stored).toHaveLength(10);
    expect(stored[0].slug).toBe("brand-new");
  });
});
