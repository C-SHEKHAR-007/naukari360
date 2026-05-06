import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    affiliateLink: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { GET, POST } from "@/app/api/admin/affiliate-links/route";

describe("GET /api/admin/affiliate-links", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns all affiliate links when authenticated", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });
    const mockLinks = [
      {
        id: "link-1",
        name: "Test Book",
        slug: "test-book",
        originalUrl: "https://amzn.to/xyz",
        clicks: 10,
      },
    ];
    (prisma.affiliateLink.findMany as any).mockResolvedValue(mockLinks);

    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(data[0].name).toBe("Test Book");
  });
});

describe("POST /api/admin/affiliate-links", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const req = new NextRequest("http://localhost:3000/api/admin/affiliate-links", {
      method: "POST",
      body: JSON.stringify({ name: "Test", originalUrl: "https://example.com", slug: "test" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when required fields are missing", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });
    const req = new NextRequest("http://localhost:3000/api/admin/affiliate-links", {
      method: "POST",
      body: JSON.stringify({ name: "Test" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates affiliate link when authenticated with valid data", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });
    const mockLink = {
      id: "link-1",
      name: "Best Book",
      originalUrl: "https://amzn.to/abc",
      slug: "best-book",
      isActive: true,
      displayInPosts: false,
      categoryId: null,
      category: null,
    };
    (prisma.affiliateLink.create as any).mockResolvedValue(mockLink);

    const req = new NextRequest("http://localhost:3000/api/admin/affiliate-links", {
      method: "POST",
      body: JSON.stringify({
        name: "Best Book",
        originalUrl: "https://amzn.to/abc",
        slug: "best-book",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.name).toBe("Best Book");
    expect(data.slug).toBe("best-book");
  });

  it("passes categoryId when provided", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });
    (prisma.affiliateLink.create as any).mockResolvedValue({ id: "link-2" });

    const req = new NextRequest("http://localhost:3000/api/admin/affiliate-links", {
      method: "POST",
      body: JSON.stringify({
        name: "Study Material",
        originalUrl: "https://amzn.to/xyz",
        slug: "study-material",
        categoryId: "cat-1",
        displayInPosts: true,
      }),
      headers: { "Content-Type": "application/json" },
    });

    await POST(req);
    expect(prisma.affiliateLink.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        categoryId: "cat-1",
        displayInPosts: true,
      }),
      include: { category: true },
    });
  });
});
