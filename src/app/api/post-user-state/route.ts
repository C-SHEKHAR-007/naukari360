import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Per-user state for a post page, fetched client-side so the post page itself can be cached.
export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get("postId");
  const syllabusId = request.nextUrl.searchParams.get("syllabusId");
  const session = await auth();

  if ((!postId && !syllabusId) || !session?.user?.id) {
    return NextResponse.json({ isTracked: false, completedTopics: [] });
  }

  const userId = session.user.id;
  const [tracking, progress] = await Promise.all([
    postId
      ? prisma.applicationTracker.findUnique({
          where: { userId_postId: { userId, postId } },
          select: { id: true },
        })
      : null,
    syllabusId
      ? prisma.syllabusProgress.findUnique({
          where: { userId_syllabusId: { userId, syllabusId } },
          select: { completedTopics: true },
        })
      : null,
  ]);

  return NextResponse.json(
    {
      isTracked: !!tracking,
      completedTopics: (progress?.completedTopics as string[] | undefined) ?? [],
    },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
