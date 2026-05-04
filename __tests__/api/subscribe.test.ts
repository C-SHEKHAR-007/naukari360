import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    emailSubscriber: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn().mockReturnValue({ success: true, remaining: 4 }),
}));

import { prisma } from "@/lib/prisma";
import { POST } from "@/app/api/subscribe/route";

function createRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost:3000/api/subscribe", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/subscribe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new subscriber with valid email", async () => {
    (prisma.emailSubscriber.findUnique as any).mockResolvedValue(null);
    (prisma.emailSubscriber.create as any).mockResolvedValue({
      id: "sub-1",
      email: "user@example.com",
    });

    const res = await POST(createRequest({ email: "user@example.com" }));
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.message).toBe("Subscribed successfully");
    expect(prisma.emailSubscriber.create).toHaveBeenCalledWith({
      data: {
        email: "user@example.com",
        name: null,
        source: "popup",
      },
    });
  });

  it("returns 400 when email is missing", async () => {
    const res = await POST(createRequest({}));
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("Email is required");
  });

  it("returns 400 for invalid email format", async () => {
    const res = await POST(createRequest({ email: "not-an-email" }));
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("Invalid email format");
  });

  it("returns message when already subscribed", async () => {
    (prisma.emailSubscriber.findUnique as any).mockResolvedValue({
      id: "sub-1",
      email: "user@example.com",
      isActive: true,
    });

    const res = await POST(createRequest({ email: "user@example.com" }));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.message).toBe("Already subscribed");
  });

  it("re-subscribes inactive subscriber", async () => {
    (prisma.emailSubscriber.findUnique as any).mockResolvedValue({
      id: "sub-1",
      email: "user@example.com",
      isActive: false,
    });
    (prisma.emailSubscriber.update as any).mockResolvedValue({ id: "sub-1", isActive: true });

    const res = await POST(createRequest({ email: "user@example.com" }));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.message).toBe("Re-subscribed successfully");
    expect(prisma.emailSubscriber.update).toHaveBeenCalledWith({
      where: { email: "user@example.com" },
      data: { isActive: true },
    });
  });

  it("includes name and source when provided", async () => {
    (prisma.emailSubscriber.findUnique as any).mockResolvedValue(null);
    (prisma.emailSubscriber.create as any).mockResolvedValue({ id: "sub-2" });

    await POST(createRequest({ email: "test@example.com", name: "Rahul", source: "footer" }));

    expect(prisma.emailSubscriber.create).toHaveBeenCalledWith({
      data: {
        email: "test@example.com",
        name: "Rahul",
        source: "footer",
      },
    });
  });

  it("returns 500 on unexpected error", async () => {
    (prisma.emailSubscriber.findUnique as any).mockRejectedValue(new Error("DB error"));

    const res = await POST(createRequest({ email: "user@example.com" }));
    expect(res.status).toBe(500);

    const data = await res.json();
    expect(data.error).toBe("Something went wrong");
  });
});
