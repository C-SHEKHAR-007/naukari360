import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    pageView: {
      upsert: vi.fn().mockResolvedValue({ id: "pv-1", postId: "post-1", views: 1 }),
    },
    post: {
      update: vi.fn().mockResolvedValue({ id: "post-1", views: 2 }),
    },
  },
}));

vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn().mockReturnValue({ success: true, remaining: 29 }),
}));

import { POST } from "@/app/api/track-view/route";
import { prisma } from "@/lib/prisma";

describe("POST /api/track-view", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("increments views for valid postId", async () => {
    const req = new NextRequest("http://localhost/api/track-view", {
      method: "POST",
      body: JSON.stringify({ postId: "post-1" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(prisma.pageView.upsert).toHaveBeenCalled();
    expect(prisma.post.update).toHaveBeenCalled();
  });

  it("returns 400 for missing postId", async () => {
    const req = new NextRequest("http://localhost/api/track-view", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid postId type", async () => {
    const req = new NextRequest("http://localhost/api/track-view", {
      method: "POST",
      body: JSON.stringify({ postId: 123 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 500 on database error", async () => {
    vi.mocked(prisma.pageView.upsert).mockRejectedValueOnce(new Error("DB error"));
    const req = new NextRequest("http://localhost/api/track-view", {
      method: "POST",
      body: JSON.stringify({ postId: "post-1" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
