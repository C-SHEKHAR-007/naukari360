import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    adSlot: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { POST } from "@/app/api/admin/ad-slots/route";

describe("POST /api/admin/ad-slots", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const req = new NextRequest("http://localhost:3000/api/admin/ad-slots", {
      method: "POST",
      body: JSON.stringify({ name: "Header", slotKey: "header_banner" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("creates ad slot when authenticated", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });
    (prisma.adSlot.create as any).mockResolvedValue({
      id: "slot-1",
      name: "Header Banner",
      slotKey: "header_banner",
      adCode: "<div>Ad</div>",
      device: "all",
    });

    const req = new NextRequest("http://localhost:3000/api/admin/ad-slots", {
      method: "POST",
      body: JSON.stringify({
        name: "Header Banner",
        slotKey: "header_banner",
        adCode: "<div>Ad</div>",
        device: "all",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.slotKey).toBe("header_banner");
  });

  it("returns 400 when name or slotKey missing", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });

    const req = new NextRequest("http://localhost:3000/api/admin/ad-slots", {
      method: "POST",
      body: JSON.stringify({ name: "" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("defaults device to 'all' when not specified", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });
    (prisma.adSlot.create as any).mockResolvedValue({
      id: "slot-2",
      name: "Sidebar",
      slotKey: "sidebar_top",
      device: "all",
    });

    const req = new NextRequest("http://localhost:3000/api/admin/ad-slots", {
      method: "POST",
      body: JSON.stringify({ name: "Sidebar", slotKey: "sidebar_top" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(prisma.adSlot.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ device: "all" }),
      })
    );
  });
});
