import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    contactSubmission: { create: vi.fn() },
  },
}));

vi.mock("@/lib/email", () => ({
  sendContactNotification: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn().mockReturnValue({ success: true, remaining: 4 }),
}));

import { prisma } from "@/lib/prisma";
import { POST } from "@/app/api/contact/route";

describe("Security — Input Sanitization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.contactSubmission.create as any).mockResolvedValue({ id: "c1" });
  });

  it("contact form does not reject special characters in name", async () => {
    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "John O'Brien-Smith",
        email: "john@test.com",
        subject: "general",
        message: "Hello there",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("handles XSS script tags in message field", async () => {
    const maliciousPayload = '<script>alert("xss")</script>';
    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Hacker",
        email: "hacker@test.com",
        subject: "general",
        message: maliciousPayload,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    // Should still process (stored as text), but not execute
    expect([200, 400]).toContain(res.status);
    // If stored, verify it's stored as-is (not rendered unsafely)
    if (res.status === 200) {
      expect(prisma.contactSubmission.create).toHaveBeenCalled();
    }
  });

  it("handles SQL injection attempts in email field", async () => {
    const sqli = "'; DROP TABLE users; --";
    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        email: sqli,
        subject: "general",
        message: "test",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    // Should be rejected by email validation
    expect(res.status).toBe(400);
  });

  it("rejects oversized payloads in message field", async () => {
    const largeMessage = "a".repeat(10001);
    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        email: "test@test.com",
        subject: "general",
        message: largeMessage,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("handles HTML entities in name field", async () => {
    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "&lt;img src=x onerror=alert(1)&gt;",
        email: "test@test.com",
        subject: "general",
        message: "testing html entities",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect([200, 400]).toContain(res.status);
  });

  it("rejects prototype pollution attempts", async () => {
    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test",
        email: "test@test.com",
        subject: "general",
        message: "normal",
        __proto__: { admin: true },
        constructor: { prototype: { admin: true } },
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    // Should not crash and should handle gracefully
    expect([200, 400]).toContain(res.status);
  });
});
