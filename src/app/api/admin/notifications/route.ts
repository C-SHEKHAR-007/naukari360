import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notifications = await prisma.notification.findMany({
    orderBy: { sentAt: "desc" },
    take: 50,
  });
  return NextResponse.json(notifications);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, message, link } = await request.json();
    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        link: link || null,
        sentAt: new Date(),
      },
    });
    return NextResponse.json(notification);
  } catch (err: unknown) {
    console.error("Create notification error:", err);
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}
