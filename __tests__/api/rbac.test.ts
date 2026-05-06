import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

/**
 * RBAC tests: Verify role-based access control enforcement.
 * - super_admin: full access
 * - editor: can manage content, cannot delete or access sensitive routes
 * - no session: 401
 * - invalid role: 403
 */

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    siteSetting: { upsert: vi.fn().mockResolvedValue({}), findMany: vi.fn().mockResolvedValue([]) },
    category: {
      create: vi.fn().mockResolvedValue({ id: "1" }),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
    state: {
      create: vi.fn().mockResolvedValue({ id: "1" }),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
    post: {
      create: vi.fn().mockResolvedValue({ id: "1" }),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
    postTag: { deleteMany: vi.fn().mockResolvedValue({}) },
    importantDate: { deleteMany: vi.fn().mockResolvedValue({}) },
    faq: { deleteMany: vi.fn().mockResolvedValue({}) },
    navMenu: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
      deleteMany: vi.fn().mockResolvedValue({}),
    },
    banner: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
    announcement: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
    page: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue({}),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
    adSlot: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
    affiliateLink: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
    interstitialPage: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
    emailSubscriber: { findMany: vi.fn().mockResolvedValue([]) },
    notification: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
    contactSubmission: {
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
  },
}));

vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn().mockResolvedValue({ success: true }),
}));

// Editor-accessible routes
import { POST as categoriesPOST } from "@/app/api/admin/categories/route";
import { DELETE as categoriesDELETE } from "@/app/api/admin/categories/[id]/route";
import { GET as bannersGET } from "@/app/api/admin/banners/route";
import { GET as menusGET } from "@/app/api/admin/menus/route";
import { GET as pagesGET } from "@/app/api/admin/pages/route";

// Super-admin only routes
import { PUT as settingsPUT } from "@/app/api/admin/site-settings/route";
import { POST as adSlotsPOST } from "@/app/api/admin/ad-slots/route";
import { GET as affiliateGET, POST as affiliatePOST } from "@/app/api/admin/affiliate-links/route";
import { GET as subscribersExportGET } from "@/app/api/admin/subscribers/export/route";

// Helper to create session with role
function makeSession(role: string) {
  return {
    user: { id: "user-1", email: "test@test.com", name: "Test", role },
    expires: "2099-01-01",
  };
}

describe("RBAC — Editor role access", () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue(makeSession("editor"));
  });

  it("editor can POST /api/admin/categories", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/categories", {
      method: "POST",
      body: JSON.stringify({ name: "Test", slug: "test" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await categoriesPOST(req);
    // Should not be 401 or 403
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });

  it("editor can GET /api/admin/banners", async () => {
    const res = await bannersGET();
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });

  it("editor can GET /api/admin/menus", async () => {
    const res = await menusGET();
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });

  it("editor can GET /api/admin/pages", async () => {
    const res = await pagesGET();
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });

  it("editor CANNOT PUT /api/admin/site-settings → 403", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/site-settings", {
      method: "PUT",
      body: JSON.stringify({ siteName: "test" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await settingsPUT(req);
    expect(res.status).toBe(403);
  });

  it("editor CANNOT POST /api/admin/ad-slots → 403", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/ad-slots", {
      method: "POST",
      body: JSON.stringify({ name: "test", slotKey: "test" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await adSlotsPOST(req);
    expect(res.status).toBe(403);
  });

  it("editor CANNOT GET /api/admin/affiliate-links → 403", async () => {
    const res = await affiliateGET();
    expect(res.status).toBe(403);
  });

  it("editor CANNOT POST /api/admin/affiliate-links → 403", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/affiliate-links", {
      method: "POST",
      body: JSON.stringify({ name: "x", originalUrl: "http://x.com", slug: "x" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await affiliatePOST(req);
    expect(res.status).toBe(403);
  });

  it("editor CANNOT GET /api/admin/subscribers/export → 403", async () => {
    const res = await subscribersExportGET();
    expect(res.status).toBe(403);
  });

  it("editor CANNOT DELETE /api/admin/categories/[id] → 403", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/categories/123", {
      method: "DELETE",
    });
    const res = await categoriesDELETE(req, { params: Promise.resolve({ id: "123" }) });
    expect(res.status).toBe(403);
  });
});

describe("RBAC — Super admin role access", () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue(makeSession("super_admin"));
  });

  it("super_admin can PUT /api/admin/site-settings", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/site-settings", {
      method: "PUT",
      body: JSON.stringify({ siteName: "test" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await settingsPUT(req);
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });

  it("super_admin can POST /api/admin/ad-slots", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/ad-slots", {
      method: "POST",
      body: JSON.stringify({ name: "test", slotKey: "test-slot" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await adSlotsPOST(req);
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });

  it("super_admin can GET /api/admin/subscribers/export", async () => {
    const res = await subscribersExportGET();
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });

  it("super_admin can DELETE /api/admin/categories/[id]", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/categories/123", {
      method: "DELETE",
    });
    const res = await categoriesDELETE(req, { params: Promise.resolve({ id: "123" }) });
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });

  it("super_admin can POST /api/admin/categories (editor routes too)", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/categories", {
      method: "POST",
      body: JSON.stringify({ name: "Test", slug: "test" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await categoriesPOST(req);
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });
});

describe("RBAC — No session", () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue(null);
  });

  it("unauthenticated → 401 on editor routes", async () => {
    const res = await bannersGET();
    expect(res.status).toBe(401);
  });

  it("unauthenticated → 401 on super_admin routes", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/site-settings", {
      method: "PUT",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    const res = await settingsPUT(req);
    expect(res.status).toBe(401);
  });
});

describe("RBAC — Invalid/missing role", () => {
  it("session without role → 403", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "a@b.com", name: "x" },
      expires: "2099-01-01",
    });
    const res = await bannersGET();
    expect(res.status).toBe(403);
  });

  it("session with unknown role → 403", async () => {
    mockAuth.mockResolvedValue(makeSession("viewer"));
    const res = await bannersGET();
    expect(res.status).toBe(403);
  });
});
