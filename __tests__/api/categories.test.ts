import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    category: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { POST } from "@/app/api/admin/categories/route";

describe("POST /api/admin/categories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const req = new NextRequest("http://localhost:3000/api/admin/categories", {
      method: "POST",
      body: JSON.stringify({ name: "Test", slug: "test" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("creates category when authenticated", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });
    (prisma.category.create as any).mockResolvedValue({
      id: "cat-1",
      name: "Latest Jobs",
      nameHi: "नवीनतम नौकरी",
      slug: "latest-jobs",
    });

    const req = new NextRequest("http://localhost:3000/api/admin/categories", {
      method: "POST",
      body: JSON.stringify({
        name: "Latest Jobs",
        nameHi: "नवीनतम नौकरी",
        slug: "latest-jobs",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.name).toBe("Latest Jobs");
    expect(data.slug).toBe("latest-jobs");
  });
});
