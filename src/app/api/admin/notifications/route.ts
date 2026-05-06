import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const authResult = await requireAdmin();
  if (!authResult.authorized) return authResult.response;

  const notifications = await prisma.notification.findMany({
    orderBy: { sentAt: "desc" },
    take: 50,
  });
  return NextResponse.json(notifications);
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if (!authResult.authorized) return authResult.response;

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
