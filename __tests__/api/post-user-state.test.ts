import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    applicationTracker: { findUnique: vi.fn() },
    syllabusProgress: { findUnique: vi.fn() },
  },
}));

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GET } from "@/app/api/post-user-state/route";

function req(query: string) {
  return new NextRequest(`http://localhost:3000/api/post-user-state?${query}`);
}

describe("GET /api/post-user-state", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns defaults for anonymous users without querying the DB", async () => {
    (auth as any).mockResolvedValue(null);
    const res = await GET(req("postId=p1"));
    expect(await res.json()).toEqual({ isTracked: false, completedTopics: [] });
    expect(prisma.applicationTracker.findUnique).not.toHaveBeenCalled();
  });

  it("returns defaults when neither postId nor syllabusId is given", async () => {
    (auth as any).mockResolvedValue({ user: { id: "u1" } });
    const res = await GET(req(""));
    expect(await res.json()).toEqual({ isTracked: false, completedTopics: [] });
  });

  it("reports tracked status for the signed-in user", async () => {
    (auth as any).mockResolvedValue({ user: { id: "u1" } });
    (prisma.applicationTracker.findUnique as any).mockResolvedValue({ id: "t1" });

    const res = await GET(req("postId=p1"));
    expect(prisma.applicationTracker.findUnique).toHaveBeenCalledWith({
      where: { userId_postId: { userId: "u1", postId: "p1" } },
      select: { id: true },
    });
    expect(prisma.syllabusProgress.findUnique).not.toHaveBeenCalled();
    expect(await res.json()).toEqual({ isTracked: true, completedTopics: [] });
    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
  });

  it("returns syllabus progress when syllabusId is given", async () => {
    (auth as any).mockResolvedValue({ user: { id: "u1" } });
    (prisma.applicationTracker.findUnique as any).mockResolvedValue(null);
    (prisma.syllabusProgress.findUnique as any).mockResolvedValue({ completedTopics: ["Algebra"] });

    const res = await GET(req("postId=p1&syllabusId=s1"));
    expect(await res.json()).toEqual({ isTracked: false, completedTopics: ["Algebra"] });
  });

  it("returns syllabus progress for a syllabus without a linked post", async () => {
    (auth as any).mockResolvedValue({ user: { id: "u1" } });
    (prisma.syllabusProgress.findUnique as any).mockResolvedValue({ completedTopics: ["History"] });

    const res = await GET(req("postId=&syllabusId=s1"));
    expect(prisma.applicationTracker.findUnique).not.toHaveBeenCalled();
    expect(await res.json()).toEqual({ isTracked: false, completedTopics: ["History"] });
  });
});
