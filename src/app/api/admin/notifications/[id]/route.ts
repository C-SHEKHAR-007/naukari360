import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.notification.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Delete notification error:", err);
    return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });
  }
}
