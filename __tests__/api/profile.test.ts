import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      update: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { PUT } from "@/app/api/profile/route";

function createRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost:3000/api/profile", {
    method: "PUT",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("PUT /api/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if user is not authenticated", async () => {
    (auth as any).mockResolvedValue(null);

    const res = await PUT(createRequest({ qualification: "graduate", state: "delhi" }));
    expect(res.status).toBe(401);

    const data = await res.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("updates user profile with qualification and state", async () => {
    (auth as any).mockResolvedValue({
      user: { email: "test@example.com" },
    });

    (prisma.user.update as any).mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      qualification: "graduate",
      state: "delhi",
    });

    const res = await PUT(createRequest({ qualification: "graduate", state: "delhi" }));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
      data: {
        qualification: "graduate",
        state: "delhi",
      },
    });
  });

  it("clears qualification and state if empty", async () => {
    (auth as any).mockResolvedValue({
      user: { email: "test@example.com" },
    });

    (prisma.user.update as any).mockResolvedValue({
      id: "user-1",
      email: "test@example.com",
      qualification: null,
      state: null,
    });

    const res = await PUT(createRequest({ qualification: "", state: "" }));
    expect(res.status).toBe(200);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
      data: {
        qualification: null,
        state: null,
      },
    });
  });

  it("returns 500 on unexpected database error", async () => {
    (auth as any).mockResolvedValue({
      user: { email: "test@example.com" },
    });

    (prisma.user.update as any).mockRejectedValue(new Error("DB error"));

    const res = await PUT(createRequest({ qualification: "10th" }));
    expect(res.status).toBe(500);

    const data = await res.json();
    expect(data.error).toBe("Failed to update profile");
  });
});
