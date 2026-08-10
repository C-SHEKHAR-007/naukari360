import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    bookmark: {
      findUnique: vi.fn(),
      delete: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { POST } from "@/app/api/bookmarks/route";

function createRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost:3000/api/bookmarks", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/bookmarks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if user is not authenticated", async () => {
    (auth as any).mockResolvedValue(null);

    const res = await POST(createRequest({ postId: "post-1" }));
    expect(res.status).toBe(401);

    const data = await res.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 400 if postId is missing", async () => {
    (auth as any).mockResolvedValue({
      user: { id: "user-123" },
    });

    const res = await POST(createRequest({}));
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("Post ID is required");
  });

  it("adds a new bookmark if it does not exist", async () => {
    (auth as any).mockResolvedValue({
      user: { id: "user-123" },
    });

    (prisma.bookmark.findUnique as any).mockResolvedValue(null);
    (prisma.bookmark.create as any).mockResolvedValue({
      id: "bookmark-1",
      userId: "user-123",
      postId: "post-1",
    });

    const res = await POST(createRequest({ postId: "post-1" }));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.bookmarked).toBe(true);

    expect(prisma.bookmark.create).toHaveBeenCalledWith({
      data: {
        userId: "user-123",
        postId: "post-1",
      },
    });
  });

  it("removes a bookmark if it already exists", async () => {
    (auth as any).mockResolvedValue({
      user: { id: "user-123" },
    });

    (prisma.bookmark.findUnique as any).mockResolvedValue({
      id: "bookmark-existing-id",
      userId: "user-123",
      postId: "post-1",
    });

    (prisma.bookmark.delete as any).mockResolvedValue({
      id: "bookmark-existing-id",
    });

    const res = await POST(createRequest({ postId: "post-1" }));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.bookmarked).toBe(false);

    expect(prisma.bookmark.delete).toHaveBeenCalledWith({
      where: { id: "bookmark-existing-id" },
    });
  });

  it("returns 500 on unexpected database error", async () => {
    (auth as any).mockResolvedValue({
      user: { id: "user-123" },
    });

    (prisma.bookmark.findUnique as any).mockRejectedValue(new Error("DB Connection Error"));

    const res = await POST(createRequest({ postId: "post-1" }));
    expect(res.status).toBe(500);

    const data = await res.json();
    expect(data.error).toBe("Internal Server Error");
  });
});
