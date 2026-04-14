import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    category: { update: vi.fn(), delete: vi.fn() },
    state: { update: vi.fn(), delete: vi.fn() },
    adSlot: { update: vi.fn(), delete: vi.fn() },
    navMenu: { update: vi.fn(), delete: vi.fn(), deleteMany: vi.fn() },
    banner: { update: vi.fn(), delete: vi.fn() },
    announcement: { update: vi.fn(), delete: vi.fn() },
    page: { findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
import { PUT as categoryPUT, DELETE as categoryDELETE } from "@/app/api/admin/categories/[id]/route";
import { PUT as statePUT, DELETE as stateDELETE } from "@/app/api/admin/states/[id]/route";
import { PUT as adSlotPUT, DELETE as adSlotDELETE } from "@/app/api/admin/ad-slots/[id]/route";
import { PUT as menuPUT, DELETE as menuDELETE } from "@/app/api/admin/menus/[id]/route";
import { PUT as bannerPUT, DELETE as bannerDELETE } from "@/app/api/admin/banners/[id]/route";
import { PUT as announcementPUT, DELETE as announcementDELETE } from "@/app/api/admin/announcements/[id]/route";

const makeParams = (id: string) => ({ params: Promise.resolve({ id }) });

describe("[id] routes — PUT (Update)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });
  });

  it("PUT /api/admin/categories/[id] updates category", async () => {
    (prisma.category.update as any).mockResolvedValue({ id: "c1", name: "Updated", slug: "updated" });

    const req = new NextRequest("http://localhost:3000/api/admin/categories/c1", {
      method: "PUT",
      body: JSON.stringify({ name: "Updated", nameHi: "अपडेट", slug: "updated" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await categoryPUT(req, makeParams("c1"));
    expect(res.status).toBe(200);
    expect(prisma.category.update).toHaveBeenCalledWith({
      where: { id: "c1" },
      data: { name: "Updated", nameHi: "अपडेट", slug: "updated" },
    });
  });

  it("PUT /api/admin/categories/[id] returns 400 if name/slug missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/categories/c1", {
      method: "PUT",
      body: JSON.stringify({ name: "" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await categoryPUT(req, makeParams("c1"));
    expect(res.status).toBe(400);
  });

  it("PUT /api/admin/states/[id] updates state", async () => {
    (prisma.state.update as any).mockResolvedValue({ id: "s1", name: "Bihar", slug: "bihar" });

    const req = new NextRequest("http://localhost:3000/api/admin/states/s1", {
      method: "PUT",
      body: JSON.stringify({ name: "Bihar", nameHi: "बिहार", slug: "bihar" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await statePUT(req, makeParams("s1"));
    expect(res.status).toBe(200);
    expect(prisma.state.update).toHaveBeenCalledWith({
      where: { id: "s1" },
      data: { name: "Bihar", nameHi: "बिहार", slug: "bihar" },
    });
  });

  it("PUT /api/admin/ad-slots/[id] updates ad slot", async () => {
    (prisma.adSlot.update as any).mockResolvedValue({ id: "a1", isActive: false });

    const req = new NextRequest("http://localhost:3000/api/admin/ad-slots/a1", {
      method: "PUT",
      body: JSON.stringify({ isActive: false }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await adSlotPUT(req, makeParams("a1"));
    expect(res.status).toBe(200);
  });

  it("PUT /api/admin/menus/[id] updates menu item", async () => {
    (prisma.navMenu.update as any).mockResolvedValue({ id: "m1", label: "New Label" });

    const req = new NextRequest("http://localhost:3000/api/admin/menus/m1", {
      method: "PUT",
      body: JSON.stringify({ label: "New Label", url: "/new" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await menuPUT(req, makeParams("m1"));
    expect(res.status).toBe(200);
  });

  it("PUT /api/admin/banners/[id] updates banner", async () => {
    (prisma.banner.update as any).mockResolvedValue({ id: "b1", title: "Updated Banner" });

    const req = new NextRequest("http://localhost:3000/api/admin/banners/b1", {
      method: "PUT",
      body: JSON.stringify({ title: "Updated Banner", imageUrl: "/new.jpg" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await bannerPUT(req, makeParams("b1"));
    expect(res.status).toBe(200);
  });

  it("PUT /api/admin/announcements/[id] updates announcement", async () => {
    (prisma.announcement.update as any).mockResolvedValue({ id: "an1", text: "Updated" });

    const req = new NextRequest("http://localhost:3000/api/admin/announcements/an1", {
      method: "PUT",
      body: JSON.stringify({ text: "Updated", isActive: false }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await announcementPUT(req, makeParams("an1"));
    expect(res.status).toBe(200);
  });
});

describe("[id] routes — DELETE", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });
  });

  it("DELETE /api/admin/categories/[id] deletes category", async () => {
    (prisma.category.delete as any).mockResolvedValue({});

    const req = new NextRequest("http://localhost:3000/api/admin/categories/c1", { method: "DELETE" });
    const res = await categoryDELETE(req, makeParams("c1"));
    expect(res.status).toBe(200);
    expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: "c1" } });
  });

  it("DELETE /api/admin/states/[id] deletes state", async () => {
    (prisma.state.delete as any).mockResolvedValue({});

    const req = new NextRequest("http://localhost:3000/api/admin/states/s1", { method: "DELETE" });
    const res = await stateDELETE(req, makeParams("s1"));
    expect(res.status).toBe(200);
  });

  it("DELETE /api/admin/ad-slots/[id] deletes ad slot", async () => {
    (prisma.adSlot.delete as any).mockResolvedValue({});

    const req = new NextRequest("http://localhost:3000/api/admin/ad-slots/a1", { method: "DELETE" });
    const res = await adSlotDELETE(req, makeParams("a1"));
    expect(res.status).toBe(200);
  });

  it("DELETE /api/admin/menus/[id] deletes menu + children", async () => {
    (prisma.navMenu.deleteMany as any).mockResolvedValue({});
    (prisma.navMenu.delete as any).mockResolvedValue({});

    const req = new NextRequest("http://localhost:3000/api/admin/menus/m1", { method: "DELETE" });
    const res = await menuDELETE(req, makeParams("m1"));
    expect(res.status).toBe(200);
  });

  it("DELETE /api/admin/banners/[id] deletes banner", async () => {
    (prisma.banner.delete as any).mockResolvedValue({});

    const req = new NextRequest("http://localhost:3000/api/admin/banners/b1", { method: "DELETE" });
    const res = await bannerDELETE(req, makeParams("b1"));
    expect(res.status).toBe(200);
  });

  it("DELETE /api/admin/announcements/[id] deletes announcement", async () => {
    (prisma.announcement.delete as any).mockResolvedValue({});

    const req = new NextRequest("http://localhost:3000/api/admin/announcements/an1", { method: "DELETE" });
    const res = await announcementDELETE(req, makeParams("an1"));
    expect(res.status).toBe(200);
  });
});

describe("[id] routes — Auth guard on all", () => {
  beforeEach(() => {
    mockAuth.mockResolvedValue(null);
  });

  it("PUT category returns 401", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/categories/x", {
      method: "PUT",
      body: JSON.stringify({ name: "x", slug: "x" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await categoryPUT(req, makeParams("x"));
    expect(res.status).toBe(401);
  });

  it("DELETE state returns 401", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/states/x", { method: "DELETE" });
    const res = await stateDELETE(req, makeParams("x"));
    expect(res.status).toBe(401);
  });

  it("PUT ad-slot returns 401", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/ad-slots/x", {
      method: "PUT",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    const res = await adSlotPUT(req, makeParams("x"));
    expect(res.status).toBe(401);
  });

  it("DELETE banner returns 401", async () => {
    const req = new NextRequest("http://localhost:3000/api/admin/banners/x", { method: "DELETE" });
    const res = await bannerDELETE(req, makeParams("x"));
    expect(res.status).toBe(401);
  });
});
