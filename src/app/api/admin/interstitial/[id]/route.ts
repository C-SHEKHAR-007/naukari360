import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { withInvalidation } from "@/lib/cache";

async function putHandler(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireSuperAdmin();
  if (!authResult.authorized) return authResult.response;

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

async function deleteHandler(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireSuperAdmin();
  if (!authResult.authorized) return authResult.response;

  try {
    const { id } = await params;
    await prisma.interstitialPage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Delete interstitial error:", err);
    return NextResponse.json({ error: "Failed to delete config" }, { status: 500 });
  }
}

export const PUT = withInvalidation(putHandler);

export const DELETE = withInvalidation(deleteHandler);
