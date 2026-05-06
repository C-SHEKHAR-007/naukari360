import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    emailSubscriber: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { GET } from "@/app/api/admin/subscribers/export/route";

describe("GET /api/admin/subscribers/export", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns CSV with subscriber data", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });
    (prisma.emailSubscriber.findMany as any).mockResolvedValue([
      {
        email: "user@test.com",
        name: "Test User",
        source: "homepage",
        isActive: true,
        subscribedAt: new Date("2025-01-15T10:00:00Z"),
      },
      {
        email: "user2@test.com",
        name: null,
        source: "popup",
        isActive: false,
        subscribedAt: new Date("2025-02-01T12:00:00Z"),
      },
    ]);

    const res = await GET();
    expect(res.status).toBe(200);

    const contentType = res.headers.get("Content-Type");
    expect(contentType).toBe("text/csv");

    const disposition = res.headers.get("Content-Disposition");
    expect(disposition).toContain("attachment");
    expect(disposition).toContain(".csv");

    const body = await res.text();
    expect(body).toContain("Email,Name,Source,Status,Subscribed At");
    expect(body).toContain("user@test.com");
    expect(body).toContain("active");
    expect(body).toContain("unsubscribed");
  });

  it("returns empty CSV when no subscribers", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "1", email: "admin@naukari360.in", name: "Admin", role: "super_admin" },
    });
    (prisma.emailSubscriber.findMany as any).mockResolvedValue([]);

    const res = await GET();
    expect(res.status).toBe(200);

    const body = await res.text();
    expect(body).toContain("Email,Name,Source,Status,Subscribed At");
    // Only the header row, no data rows
    const lines = body.trim().split("\n");
    expect(lines.length).toBe(1);
  });
});
