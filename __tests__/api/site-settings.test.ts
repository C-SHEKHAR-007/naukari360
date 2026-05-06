import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock auth - unauthenticated by default
const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    siteSetting: {
      upsert: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { PUT } from "@/app/api/admin/site-settings/route";

describe("PUT /api/admin/site-settings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.siteSetting.upsert as any).mockResolvedValue({});
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const req = new NextRequest("http://localhost:3000/api/admin/site-settings", {
      method: "PUT",
      body: JSON.stringify({ site_name: "Test" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await PUT(req);
    expect(res.status).toBe(401);
  });

  it("updates settings when authenticated", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });

    const req = new NextRequest("http://localhost:3000/api/admin/site-settings", {
      method: "PUT",
      body: JSON.stringify({
        site_name: "NewName",
        tagline: "New Tagline",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await PUT(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(prisma.siteSetting.upsert).toHaveBeenCalledTimes(2);
  });

  it("calls upsert for each setting key", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });

    const req = new NextRequest("http://localhost:3000/api/admin/site-settings", {
      method: "PUT",
      body: JSON.stringify({
        telegram_url: "https://t.me/test",
      }),
      headers: { "Content-Type": "application/json" },
    });

    await PUT(req);

    expect(prisma.siteSetting.upsert).toHaveBeenCalledWith({
      where: { key: "telegram_url" },
      create: { key: "telegram_url", value: "https://t.me/test" },
      update: { value: "https://t.me/test" },
    });
  });
});
