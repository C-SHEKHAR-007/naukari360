import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    // Check if bookmark exists
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId,
        },
      },
    });

    if (existing) {
      // Remove bookmark
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ bookmarked: false });
    } else {
      // Add bookmark
      await prisma.bookmark.create({
        data: {
          userId: session.user.id,
          postId: postId,
        },
      });
      return NextResponse.json({ bookmarked: true });
    }
  } catch (error) {
    console.error("Bookmark Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
