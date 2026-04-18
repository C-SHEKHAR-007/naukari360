import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    interstitialPage: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { GET, POST } from "@/app/api/admin/interstitial/route";

describe("GET /api/admin/interstitial", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns interstitial configs when authenticated", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });
    const mockConfigs = [
      {
        id: "int-1",
        title: "Download Page",
        adSlotKey: "interstitial_main",
        delaySeconds: 5,
        isActive: true,
      },
    ];
    (prisma.interstitialPage.findMany as any).mockResolvedValue(mockConfigs);

    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe("Download Page");
  });
});

describe("POST /api/admin/interstitial", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const req = new NextRequest("http://localhost:3000/api/admin/interstitial", {
      method: "POST",
      body: JSON.stringify({ title: "Test", adSlotKey: "test_slot" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when title is missing", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });
    const req = new NextRequest("http://localhost:3000/api/admin/interstitial", {
      method: "POST",
      body: JSON.stringify({ adSlotKey: "test_slot" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when adSlotKey is missing", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });
    const req = new NextRequest("http://localhost:3000/api/admin/interstitial", {
      method: "POST",
      body: JSON.stringify({ title: "Test" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates interstitial config with valid data", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });
    const mockConfig = {
      id: "int-1",
      title: "Apply Link Page",
      adSlotKey: "interstitial_apply",
      delaySeconds: 7,
      isActive: true,
    };
    (prisma.interstitialPage.create as any).mockResolvedValue(mockConfig);

    const req = new NextRequest("http://localhost:3000/api/admin/interstitial", {
      method: "POST",
      body: JSON.stringify({
        title: "Apply Link Page",
        adSlotKey: "interstitial_apply",
        delaySeconds: 7,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.title).toBe("Apply Link Page");
    expect(data.delaySeconds).toBe(7);
  });

  it("uses default delaySeconds when not provided", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });
    (prisma.interstitialPage.create as any).mockResolvedValue({ id: "int-2" });

    const req = new NextRequest("http://localhost:3000/api/admin/interstitial", {
      method: "POST",
      body: JSON.stringify({ title: "Download Page", adSlotKey: "interstitial_dl" }),
      headers: { "Content-Type": "application/json" },
    });

    await POST(req);
    expect(prisma.interstitialPage.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ delaySeconds: 5 }),
    });
  });
});
