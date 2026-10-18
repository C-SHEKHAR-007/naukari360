import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    post: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
    category: { findUnique: vi.fn() },
    state: { findUnique: vi.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
import { POST } from "@/app/api/ingest/posts/route";

function createRequest(body: unknown, key: string | null = "test-ingest-key") {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (key !== null) headers["x-ingest-key"] = key;
  return new NextRequest("http://localhost:3000/api/ingest/posts", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

describe("POST /api/ingest/posts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.INGEST_API_KEY = "test-ingest-key";
    (prisma.post.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    (prisma.post.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);
  });

  it("returns 401 when the key header is missing", async () => {
    const res = await POST(createRequest({ titleEn: "Test" }, null));
    expect(res.status).toBe(401);
    expect(prisma.post.create).not.toHaveBeenCalled();
  });

  it("returns 401 when the key is wrong", async () => {
    const res = await POST(createRequest({ titleEn: "Test" }, "wrong-key"));
    expect(res.status).toBe(401);
  });

  it("returns 401 when INGEST_API_KEY is not configured", async () => {
    delete process.env.INGEST_API_KEY;
    const res = await POST(createRequest({ titleEn: "Test" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 when titleEn is missing", async () => {
    const res = await POST(createRequest({ organization: "SSC" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/titleEn/);
  });

  it("creates a draft post and ignores a client-supplied status", async () => {
    (prisma.post.create as ReturnType<typeof vi.fn>).mockResolvedValue({ id: "post-1" });

    const res = await POST(
      createRequest({
        titleEn: "SSC CGL 2026 Notification",
        organization: "SSC",
        status: "published",
        notificationLink: "https://ssc.gov.in/notice/cgl-2026",
      })
    );

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.id).toBe("post-1");
    expect(data.editUrl).toBe("/admin/posts/post-1");
    expect(data.duplicate).toBe(false);

    const createCall = (prisma.post.create as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(createCall.data).not.toHaveProperty("status");
    expect(createCall.data.titleEn).toBe("SSC CGL 2026 Notification");
    expect(createCall.data.ingestSource).toBe("scraper");
  });

  it("drops fields that are not on the allow-list", async () => {
    (prisma.post.create as ReturnType<typeof vi.fn>).mockResolvedValue({ id: "post-2" });

    await POST(
      createRequest({
        titleEn: "Test Post",
        views: 999999,
        isTrending: true,
        id: "attacker-chosen-id",
      })
    );

    const createCall = (prisma.post.create as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(createCall.data).not.toHaveProperty("views");
    expect(createCall.data).not.toHaveProperty("isTrending");
    expect(createCall.data).not.toHaveProperty("id");
  });

  it("returns the existing post as a duplicate instead of creating a new one", async () => {
    (prisma.post.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({ id: "existing-1" });

    const res = await POST(
      createRequest({
        titleEn: "Duplicate Notification",
        notificationLink: "https://ssc.gov.in/notice/cgl-2026",
      })
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.duplicate).toBe(true);
    expect(data.id).toBe("existing-1");
    expect(prisma.post.create).not.toHaveBeenCalled();
  });

  it("resolves categorySlug/stateSlug to ids when found", async () => {
    (prisma.category.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({ id: "cat-1" });
    (prisma.state.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({ id: "state-1" });
    (prisma.post.create as ReturnType<typeof vi.fn>).mockResolvedValue({ id: "post-3" });

    await POST(
      createRequest({
        titleEn: "Bihar Police Recruitment",
        categorySlug: "latest-jobs",
        stateSlug: "bihar",
      })
    );

    const createCall = (prisma.post.create as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(createCall.data.categoryId).toBe("cat-1");
    expect(createCall.data.stateId).toBe("state-1");
  });

  it("leaves category/state unset when the slug does not match", async () => {
    (prisma.category.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    (prisma.post.create as ReturnType<typeof vi.fn>).mockResolvedValue({ id: "post-4" });

    await POST(createRequest({ titleEn: "Unknown Category Post", categorySlug: "does-not-exist" }));

    const createCall = (prisma.post.create as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(createCall.data).not.toHaveProperty("categoryId");
  });

  it("returns 500 when the database create fails", async () => {
    (prisma.post.create as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("DB error"));

    const res = await POST(createRequest({ titleEn: "Will Fail" }));
    expect(res.status).toBe(500);
  });
});
