import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    state: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { POST } from "@/app/api/admin/states/route";

describe("POST /api/admin/states", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const req = new NextRequest("http://localhost:3000/api/admin/states", {
      method: "POST",
      body: JSON.stringify({ name: "UP", slug: "up" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("creates state when authenticated", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });
    (prisma.state.create as any).mockResolvedValue({
      id: "state-1",
      name: "Uttar Pradesh",
      nameHi: "उत्तर प्रदेश",
      slug: "uttar-pradesh",
    });

    const req = new NextRequest("http://localhost:3000/api/admin/states", {
      method: "POST",
      body: JSON.stringify({
        name: "Uttar Pradesh",
        nameHi: "उत्तर प्रदेश",
        slug: "uttar-pradesh",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.name).toBe("Uttar Pradesh");
    expect(data.slug).toBe("uttar-pradesh");
  });

  it("returns 400 when name or slug missing", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });

    const req = new NextRequest("http://localhost:3000/api/admin/states", {
      method: "POST",
      body: JSON.stringify({ name: "Test" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("handles nameHi as optional", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });
    (prisma.state.create as any).mockResolvedValue({
      id: "state-2",
      name: "Delhi",
      nameHi: null,
      slug: "delhi",
    });

    const req = new NextRequest("http://localhost:3000/api/admin/states", {
      method: "POST",
      body: JSON.stringify({ name: "Delhi", slug: "delhi" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(prisma.state.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ nameHi: null }),
      })
    );
  });
});
