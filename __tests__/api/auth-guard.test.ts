import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

/**
 * Security tests: All admin API routes must return 401 without authentication.
 */

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    siteSetting: { upsert: vi.fn(), findMany: vi.fn() },
    category: { create: vi.fn() },
    state: { create: vi.fn() },
    navMenu: { findMany: vi.fn(), create: vi.fn() },
    banner: { findMany: vi.fn(), create: vi.fn() },
    announcement: { findMany: vi.fn(), create: vi.fn() },
    page: { findMany: vi.fn(), create: vi.fn() },
    adSlot: { findMany: vi.fn(), create: vi.fn() },
  },
}));

// Import all admin route handlers
import { PUT as settingsPUT } from "@/app/api/admin/site-settings/route";
import { POST as categoriesPOST } from "@/app/api/admin/categories/route";
import { GET as menusGET, POST as menusPOST } from "@/app/api/admin/menus/route";
import { GET as bannersGET, POST as bannersPOST } from "@/app/api/admin/banners/route";
import { GET as announcementsGET, POST as announcementsPOST } from "@/app/api/admin/announcements/route";
import { GET as pagesGET, POST as pagesPOST } from "@/app/api/admin/pages/route";

describe("Auth Guard — All admin routes return 401 without session", () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue(null); // Not authenticated
  });

  it("PUT /api/admin/site-settings → 401", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/site-settings", {
      method: "PUT",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    const res = await settingsPUT(req);
    expect(res.status).toBe(401);
  });

  it("POST /api/admin/categories → 401", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/categories", {
      method: "POST",
      body: JSON.stringify({ name: "x", slug: "x" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await categoriesPOST(req);
    expect(res.status).toBe(401);
  });

  it("GET /api/admin/menus → 401", async () => {
    const res = await menusGET();
    expect(res.status).toBe(401);
  });

  it("POST /api/admin/menus → 401", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/menus", {
      method: "POST",
      body: JSON.stringify({ label: "x", url: "/" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await menusPOST(req);
    expect(res.status).toBe(401);
  });

  it("GET /api/admin/banners → 401", async () => {
    const res = await bannersGET();
    expect(res.status).toBe(401);
  });

  it("POST /api/admin/banners → 401", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/banners", {
      method: "POST",
      body: JSON.stringify({ title: "x", imageUrl: "x" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await bannersPOST(req);
    expect(res.status).toBe(401);
  });

  it("GET /api/admin/announcements → 401", async () => {
    const res = await announcementsGET();
    expect(res.status).toBe(401);
  });

  it("POST /api/admin/announcements → 401", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/announcements", {
      method: "POST",
      body: JSON.stringify({ text: "x" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await announcementsPOST(req);
    expect(res.status).toBe(401);
  });

  it("GET /api/admin/pages → 401", async () => {
    const res = await pagesGET();
    expect(res.status).toBe(401);
  });

  it("POST /api/admin/pages → 401", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/pages", {
      method: "POST",
      body: JSON.stringify({ titleEn: "x", slug: "x" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await pagesPOST(req);
    expect(res.status).toBe(401);
  });
});
