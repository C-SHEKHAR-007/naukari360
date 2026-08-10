import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "Missing postId" }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("GET /api/comments error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId, content } = await request.json();

    if (!postId || !content || content.trim() === "") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        userId: session.user.id,
        content: content.trim(),
      },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("POST /api/comments error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
