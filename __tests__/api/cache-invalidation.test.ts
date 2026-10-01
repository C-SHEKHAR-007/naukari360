import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Admin writes must clear the public page cache, but only when they succeed.
vi.mock("@/lib/auth-utils", () => ({
  requireAdmin: vi
    .fn()
    .mockResolvedValue({ authorized: true, session: { user: { id: "a1", role: "admin" } } }),
  requireSuperAdmin: vi
    .fn()
    .mockResolvedValue({ authorized: true, session: { user: { id: "a1", role: "super_admin" } } }),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    category: {
      create: vi.fn().mockResolvedValue({ id: "c1" }),
      update: vi.fn().mockResolvedValue({ id: "c1" }),
      delete: vi.fn().mockResolvedValue({ id: "c1" }),
    },
  },
}));

import { revalidateTag, revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { POST } from "@/app/api/admin/categories/route";
import { PUT, DELETE } from "@/app/api/admin/categories/[id]/route";

function jsonReq(method: string, body?: unknown) {
  return new NextRequest("http://localhost:3000/api/admin/categories", {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: { "Content-Type": "application/json" },
  });
}
const params = { params: Promise.resolve({ id: "c1" }) };

describe("admin writes invalidate the public cache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST invalidates after creating", async () => {
    const res = await POST(jsonReq("POST", { name: "Jobs", slug: "jobs" }));
    expect(res.ok).toBe(true);
    expect(revalidateTag).toHaveBeenCalledWith("content", { expire: 0 });
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("PUT invalidates after updating", async () => {
    const res = await PUT(jsonReq("PUT", { name: "Jobs", slug: "jobs" }), params);
    expect(res.ok).toBe(true);
    expect(revalidateTag).toHaveBeenCalledTimes(1);
  });

  it("DELETE invalidates after deleting", async () => {
    const res = await DELETE(jsonReq("DELETE"), params);
    expect(res.ok).toBe(true);
    expect(revalidateTag).toHaveBeenCalledTimes(1);
  });

  it("does not invalidate when the user is not authorized", async () => {
    const { NextResponse } = await import("next/server");
    (requireAdmin as any).mockResolvedValueOnce({
      authorized: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    });
    const res = await POST(jsonReq("POST", { name: "Jobs", slug: "jobs" }));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("does not invalidate when the write fails", async () => {
    (prisma.category.update as any).mockRejectedValueOnce(new Error("db error"));
    const res = await PUT(jsonReq("PUT", { name: "Jobs", slug: "jobs" }), params);
    expect(res.ok).toBe(false);
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
