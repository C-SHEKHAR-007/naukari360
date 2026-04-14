import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  prisma: {
    contactSubmission: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/email", () => ({
  sendContactNotification: vi.fn().mockResolvedValue(undefined),
}));

import { prisma } from "@/lib/prisma";
import { POST } from "@/app/api/contact/route";

function createRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost:3000/api/contact", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.contactSubmission.create as any).mockResolvedValue({ id: "test-id" });
  });

  it("creates a contact submission with valid data", async () => {
    const res = await POST(
      createRequest({
        name: "John Doe",
        email: "john@example.com",
        type: "general",
        subject: "Inquiry",
        message: "Hello, I have a question.",
      })
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(prisma.contactSubmission.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: "John Doe",
        email: "john@example.com",
        type: "general",
        subject: "Inquiry",
      }),
    });
  });

  it("returns 400 when name is missing", async () => {
    const res = await POST(
      createRequest({
        email: "john@example.com",
        subject: "Test",
        message: "Hello",
      })
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("returns 400 when email is missing", async () => {
    const res = await POST(
      createRequest({
        name: "John",
        subject: "Test",
        message: "Hello",
      })
    );

    expect(res.status).toBe(400);
  });

  it("returns 400 when email is invalid", async () => {
    const res = await POST(
      createRequest({
        name: "John",
        email: "not-an-email",
        subject: "Test",
        message: "Hello",
      })
    );

    expect(res.status).toBe(400);
  });

  it("returns 400 when message is too long", async () => {
    const res = await POST(
      createRequest({
        name: "John",
        email: "john@example.com",
        subject: "Test",
        message: "x".repeat(5001),
      })
    );

    expect(res.status).toBe(400);
  });

  it("defaults type to general when invalid type provided", async () => {
    const res = await POST(
      createRequest({
        name: "John",
        email: "john@example.com",
        type: "invalid_type",
        subject: "Test",
        message: "Hello",
      })
    );

    expect(res.status).toBe(200);
    expect(prisma.contactSubmission.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ type: "general" }),
    });
  });

  it("accepts sponsored_post type", async () => {
    const res = await POST(
      createRequest({
        name: "Agency",
        email: "agency@test.com",
        type: "sponsored_post",
        subject: "Sponsorship",
        message: "We want to advertise.",
      })
    );

    expect(res.status).toBe(200);
    expect(prisma.contactSubmission.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ type: "sponsored_post" }),
    });
  });

  it("truncates long names to 200 chars", async () => {
    const longName = "A".repeat(300);
    const res = await POST(
      createRequest({
        name: longName,
        email: "john@example.com",
        subject: "Test",
        message: "Hello",
      })
    );

    // Should reject because name > 200
    expect(res.status).toBe(400);
  });
});
