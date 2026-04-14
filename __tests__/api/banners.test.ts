import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    banner: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { GET, POST } from "@/app/api/admin/banners/route";

describe("GET /api/admin/banners", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns banners when authenticated", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });
    (prisma.banner.findMany as any).mockResolvedValue([
      { id: "1", title: "Test Banner", imageUrl: "/banner.jpg", isActive: true },
    ]);

    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe("Test Banner");
  });
});

describe("POST /api/admin/banners", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const req = new NextRequest("http://localhost:3000/api/admin/banners", {
      method: "POST",
      body: JSON.stringify({ title: "Banner", imageUrl: "/img.jpg" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("creates banner when authenticated", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });
    (prisma.banner.create as any).mockResolvedValue({
      id: "b-1",
      title: "New Banner",
      imageUrl: "/img.jpg",
      link: "/jobs",
      isActive: true,
      displayOrder: 0,
    });

    const req = new NextRequest("http://localhost:3000/api/admin/banners", {
      method: "POST",
      body: JSON.stringify({
        title: "New Banner",
        imageUrl: "/img.jpg",
        link: "/jobs",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.title).toBe("New Banner");
    expect(data.imageUrl).toBe("/img.jpg");
  });
});
