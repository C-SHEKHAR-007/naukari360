import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    navMenu: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { GET, POST } from "@/app/api/admin/menus/route";

describe("GET /api/admin/menus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns menu items when authenticated", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });
    (prisma.navMenu.findMany as any).mockResolvedValue([
      { id: "1", label: "Home", url: "/", isActive: true, children: [] },
    ]);

    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(data[0].label).toBe("Home");
  });
});

describe("POST /api/admin/menus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const req = new NextRequest("http://localhost:3000/api/admin/menus", {
      method: "POST",
      body: JSON.stringify({ label: "Test", url: "/test" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("creates menu item when authenticated", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });
    (prisma.navMenu.create as any).mockResolvedValue({
      id: "menu-1",
      label: "Latest Jobs",
      labelHi: "नवीनतम नौकरी",
      url: "/latest-jobs",
      parentId: null,
      displayOrder: 0,
      isActive: true,
    });

    const req = new NextRequest("http://localhost:3000/api/admin/menus", {
      method: "POST",
      body: JSON.stringify({
        label: "Latest Jobs",
        labelHi: "नवीनतम नौकरी",
        url: "/latest-jobs",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.label).toBe("Latest Jobs");
    expect(data.url).toBe("/latest-jobs");
  });
});
