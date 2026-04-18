import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const data = await request.json();
    const config = await prisma.interstitialPage.update({
      where: { id },
      data: {
        title: data.title,
        adSlotKey: data.adSlotKey,
        delaySeconds: data.delaySeconds,
        isActive: data.isActive,
      },
    });
    return NextResponse.json(config);
  } catch (err: unknown) {
    console.error("Update interstitial error:", err);
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.interstitialPage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Delete interstitial error:", err);
    return NextResponse.json({ error: "Failed to delete config" }, { status: 500 });
  }
}
