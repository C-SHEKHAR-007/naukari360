import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db", () => ({ getPersonalizedPosts: vi.fn() }));

import { auth } from "@/lib/auth";
import { getPersonalizedPosts } from "@/lib/db";
import { GET } from "@/app/api/personalized/route";

describe("GET /api/personalized", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns no posts for anonymous visitors", async () => {
    (auth as any).mockResolvedValue(null);
    const res = await GET();
    expect(await res.json()).toEqual({ posts: [] });
    expect(getPersonalizedPosts).not.toHaveBeenCalled();
  });

  it("returns no posts when the user has no saved preferences", async () => {
    (auth as any).mockResolvedValue({ user: { id: "u1", qualification: null, state: null } });
    const res = await GET();
    expect(await res.json()).toEqual({ posts: [] });
    expect(getPersonalizedPosts).not.toHaveBeenCalled();
  });

  it("returns posts matching the user's qualification and state, uncached", async () => {
    (auth as any).mockResolvedValue({
      user: { id: "u1", qualification: "graduate", state: "bihar" },
    });
    (getPersonalizedPosts as any).mockResolvedValue([{ id: "p1" }]);

    const res = await GET();
    expect(getPersonalizedPosts).toHaveBeenCalledWith("graduate", "bihar", 6);
    expect(await res.json()).toEqual({ posts: [{ id: "p1" }] });
    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
  });
});
