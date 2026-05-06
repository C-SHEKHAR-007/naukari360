import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    page: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { GET, POST } from "@/app/api/admin/pages/route";

describe("GET /api/admin/pages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns pages when authenticated", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });
    (prisma.page.findMany as any).mockResolvedValue([
      { id: "1", titleEn: "About Us", slug: "about-us", isPublished: true },
      { id: "2", titleEn: "Privacy Policy", slug: "privacy-policy", isPublished: true },
    ]);

    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveLength(2);
    expect(data[0].titleEn).toBe("About Us");
  });
});

describe("POST /api/admin/pages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const req = new NextRequest("http://localhost:3000/api/admin/pages", {
      method: "POST",
      body: JSON.stringify({ titleEn: "About", slug: "about" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("creates page when authenticated", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });
    (prisma.page.create as any).mockResolvedValue({
      id: "p-1",
      titleEn: "About Us",
      titleHi: "हमारे बारे में",
      slug: "about-us",
      contentEn: "<p>About Naukari360</p>",
      contentHi: "<p>Naukari360 के बारे में</p>",
      isPublished: true,
    });

    const req = new NextRequest("http://localhost:3000/api/admin/pages", {
      method: "POST",
      body: JSON.stringify({
        titleEn: "About Us",
        titleHi: "हमारे बारे में",
        slug: "about-us",
        contentEn: "<p>About Naukari360</p>",
        contentHi: "<p>Naukari360 के बारे में</p>",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.titleEn).toBe("About Us");
    expect(data.slug).toBe("about-us");
  });

  it("returns 500 when creation fails", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });
    (prisma.page.create as any).mockRejectedValue(new Error("DB error"));

    const req = new NextRequest("http://localhost:3000/api/admin/pages", {
      method: "POST",
      body: JSON.stringify({ titleEn: "Test", slug: "test" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
