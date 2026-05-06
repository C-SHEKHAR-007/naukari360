import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    contactSubmission: {
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { PUT, DELETE } from "@/app/api/admin/contact/[id]/route";

const makeParams = (id: string) => ({ params: Promise.resolve({ id }) });

describe("PUT /api/admin/contact/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const req = new NextRequest("http://localhost:3000/api/admin/contact/c1", {
      method: "PUT",
      body: JSON.stringify({ isRead: true }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await PUT(req, makeParams("c1"));
    expect(res.status).toBe(401);
  });

  it("marks contact submission as read", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });
    (prisma.contactSubmission.update as any).mockResolvedValue({
      id: "c1",
      isRead: true,
    });

    const req = new NextRequest("http://localhost:3000/api/admin/contact/c1", {
      method: "PUT",
      body: JSON.stringify({ isRead: true }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await PUT(req, makeParams("c1"));
    expect(res.status).toBe(200);
    expect(prisma.contactSubmission.update).toHaveBeenCalledWith({
      where: { id: "c1" },
      data: { isRead: true },
    });
  });
});

describe("DELETE /api/admin/contact/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const req = new NextRequest("http://localhost:3000/api/admin/contact/c1", {
      method: "DELETE",
    });

    const res = await DELETE(req, makeParams("c1"));
    expect(res.status).toBe(401);
  });

  it("deletes contact submission", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });
    (prisma.contactSubmission.delete as any).mockResolvedValue({});

    const req = new NextRequest("http://localhost:3000/api/admin/contact/c1", {
      method: "DELETE",
    });

    const res = await DELETE(req, makeParams("c1"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });
});
