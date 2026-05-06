import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    post: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    tag: { upsert: vi.fn() },
    postTag: { create: vi.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
import { POST } from "@/app/api/admin/posts/route";

describe("POST /api/admin/posts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const req = new NextRequest("http://localhost:3000/api/admin/posts", {
      method: "POST",
      body: JSON.stringify({ titleEn: "Test", slug: "test" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("creates post when authenticated", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });
    (prisma.post.create as any).mockResolvedValue({ id: "post-1" });

    const req = new NextRequest("http://localhost:3000/api/admin/posts", {
      method: "POST",
      body: JSON.stringify({
        titleEn: "SSC CGL 2025",
        slug: "ssc-cgl-2025",
        organization: "SSC",
        status: "published",
        importantDates: [],
        faqs: [],
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe("post-1");
  });

  it("handles tags during post creation", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });
    (prisma.post.create as any).mockResolvedValue({ id: "post-2" });
    (prisma.tag.upsert as any).mockResolvedValue({ id: "tag-1" });
    (prisma.postTag.create as any).mockResolvedValue({});

    const req = new NextRequest("http://localhost:3000/api/admin/posts", {
      method: "POST",
      body: JSON.stringify({
        titleEn: "Railway Recruitment",
        slug: "railway-2025",
        importantDates: [],
        faqs: [],
        tags: "Railway, RRB, Group D",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(prisma.tag.upsert).toHaveBeenCalledTimes(3);
    expect(prisma.postTag.create).toHaveBeenCalledTimes(3);
  });

  it("creates important dates and FAQs with post", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });
    (prisma.post.create as any).mockResolvedValue({ id: "post-3" });

    const req = new NextRequest("http://localhost:3000/api/admin/posts", {
      method: "POST",
      body: JSON.stringify({
        titleEn: "UPSC Civil Services",
        slug: "upsc-2025",
        importantDates: [
          { label: "Apply Start", date: "01/01/2025" },
          { label: "Last Date", date: "31/01/2025" },
        ],
        faqs: [{ question: "What is eligibility?", answer: "Graduate from any stream" }],
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(prisma.post.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          importantDates: expect.objectContaining({
            create: expect.arrayContaining([
              expect.objectContaining({ labelEn: "Apply Start", date: "01/01/2025" }),
            ]),
          }),
          faqs: expect.objectContaining({
            create: expect.arrayContaining([
              expect.objectContaining({ questionEn: "What is eligibility?" }),
            ]),
          }),
        }),
      })
    );
  });

  it("converts empty strings to null", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });
    (prisma.post.create as any).mockResolvedValue({ id: "post-4" });

    const req = new NextRequest("http://localhost:3000/api/admin/posts", {
      method: "POST",
      body: JSON.stringify({
        titleEn: "Test Post",
        slug: "test-post",
        salary: "",
        organization: "",
        importantDates: [],
        faqs: [],
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(prisma.post.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          salary: null,
          organization: null,
        }),
      })
    );
  });

  it("parses date strings into Date objects", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });
    (prisma.post.create as any).mockResolvedValue({ id: "post-5" });

    const req = new NextRequest("http://localhost:3000/api/admin/posts", {
      method: "POST",
      body: JSON.stringify({
        titleEn: "Date Test",
        slug: "date-test",
        lastDate: "2025-03-15",
        examDate: "2025-06-01",
        importantDates: [],
        faqs: [],
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(prisma.post.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          lastDate: expect.any(Date),
          examDate: expect.any(Date),
        }),
      })
    );
  });

  it("returns 500 on database error", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });
    (prisma.post.create as any).mockRejectedValue(new Error("DB constraint error"));

    const req = new NextRequest("http://localhost:3000/api/admin/posts", {
      method: "POST",
      body: JSON.stringify({
        titleEn: "Fail Post",
        slug: "fail",
        importantDates: [],
        faqs: [],
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("DB constraint error");
  });
});
