import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    announcement: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { GET, POST } from "@/app/api/admin/announcements/route";

describe("GET /api/admin/announcements", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns announcements when authenticated", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });
    (prisma.announcement.findMany as any).mockResolvedValue([
      { id: "1", text: "New recruitment drive!", isActive: true },
    ]);

    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(data[0].text).toBe("New recruitment drive!");
  });
});

describe("POST /api/admin/announcements", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const req = new NextRequest("http://localhost:3000/api/admin/announcements", {
      method: "POST",
      body: JSON.stringify({ text: "Test", textHi: "टेस्ट" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("creates announcement when authenticated", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });
    (prisma.announcement.create as any).mockResolvedValue({
      id: "a-1",
      text: "SSC CGL notification released!",
      link: "/post/ssc-cgl",
      isActive: true,
      displayOrder: 0,
    });

    const req = new NextRequest("http://localhost:3000/api/admin/announcements", {
      method: "POST",
      body: JSON.stringify({
        text: "SSC CGL notification released!",
        link: "/post/ssc-cgl",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.text).toBe("SSC CGL notification released!");
  });
});
