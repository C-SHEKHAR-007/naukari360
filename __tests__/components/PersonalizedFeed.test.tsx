import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { useSession } from "next-auth/react";

vi.mock("next-auth/react", () => ({ useSession: vi.fn() }));
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
// PostCard is covered by its own tests; render just the title here
vi.mock("@/components/public/PostCard", () => ({
  default: ({ post }: any) => <div data-testid="post-card">{post.titleEn}</div>,
}));

import PersonalizedFeed from "@/components/public/PersonalizedFeed";

function mockFetch(posts: unknown[]) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ posts }),
  }) as unknown as typeof fetch;
}

describe("PersonalizedFeed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch([]);
  });
  afterEach(() => cleanup());

  it("renders nothing and does not fetch for anonymous visitors", () => {
    (useSession as any).mockReturnValue({ data: null, status: "unauthenticated" });
    const { container } = render(<PersonalizedFeed />);
    expect(container).toBeEmptyDOMElement();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("does not fetch when the user has no saved preferences", () => {
    (useSession as any).mockReturnValue({ data: { user: { id: "u1" } }, status: "authenticated" });
    render(<PersonalizedFeed />);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("loads and shows jobs matching the user's profile", async () => {
    (useSession as any).mockReturnValue({
      data: { user: { id: "u1", qualification: "graduate" } },
      status: "authenticated",
    });
    mockFetch([
      { id: "p1", titleEn: "SSC CGL" },
      { id: "p2", titleEn: "UPSC CSE" },
    ]);

    render(<PersonalizedFeed />);
    expect(await screen.findByText("Jobs For You")).toBeInTheDocument();
    expect(screen.getAllByTestId("post-card")).toHaveLength(2);
    expect(global.fetch).toHaveBeenCalledWith("/api/personalized");
  });

  it("stays hidden when there are no matching jobs", async () => {
    (useSession as any).mockReturnValue({
      data: { user: { id: "u1", state: "bihar" } },
      status: "authenticated",
    });
    const { container } = render(<PersonalizedFeed />);
    await vi.waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });
});
