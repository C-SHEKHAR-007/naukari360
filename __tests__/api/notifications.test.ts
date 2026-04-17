import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    notification: {
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { GET, POST } from "@/app/api/admin/notifications/route";

describe("GET /api/admin/notifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns notifications when authenticated", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });
    const mockNotifications = [
      {
        id: "n-1",
        title: "SSC Result Out",
        message: "Check now",
        link: null,
        sentAt: new Date().toISOString(),
      },
    ];
    (prisma.notification.findMany as any).mockResolvedValue(mockNotifications);

    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe("SSC Result Out");
  });
});

describe("POST /api/admin/notifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const req = new NextRequest("http://localhost:3000/api/admin/notifications", {
      method: "POST",
      body: JSON.stringify({ title: "Test", message: "Hello" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when title is missing", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });
    const req = new NextRequest("http://localhost:3000/api/admin/notifications", {
      method: "POST",
      body: JSON.stringify({ message: "Hello" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("Title and message are required");
  });

  it("returns 400 when message is missing", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });
    const req = new NextRequest("http://localhost:3000/api/admin/notifications", {
      method: "POST",
      body: JSON.stringify({ title: "Test" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates notification with valid data", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });
    const mockNotification = {
      id: "n-1",
      title: "UPSC Prelims Date",
      message: "Exam on June 15, 2026",
      link: "https://naukari360.in/post/upsc-prelims",
      sentAt: new Date().toISOString(),
    };
    (prisma.notification.create as any).mockResolvedValue(mockNotification);

    const req = new NextRequest("http://localhost:3000/api/admin/notifications", {
      method: "POST",
      body: JSON.stringify({
        title: "UPSC Prelims Date",
        message: "Exam on June 15, 2026",
        link: "https://naukari360.in/post/upsc-prelims",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.title).toBe("UPSC Prelims Date");
    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: "UPSC Prelims Date",
        message: "Exam on June 15, 2026",
        link: "https://naukari360.in/post/upsc-prelims",
      }),
    });
  });

  it("creates notification without link", async () => {
    mockAuth.mockResolvedValue({ user: { email: "admin@naukari360.in" } });
    (prisma.notification.create as any).mockResolvedValue({ id: "n-2" });

    const req = new NextRequest("http://localhost:3000/api/admin/notifications", {
      method: "POST",
      body: JSON.stringify({ title: "General Update", message: "App updated" }),
      headers: { "Content-Type": "application/json" },
    });

    await POST(req);
    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ link: null }),
    });
  });
});
