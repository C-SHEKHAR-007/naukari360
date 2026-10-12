import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireSuperAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { withInvalidation } from "@/lib/cache";

async function putHandler(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdmin();
  if (!authResult.authorized) return authResult.response;

  const { id } = await params;
  try {
    const { text, link, displayOrder, isActive } = await request.json();

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        text,
        link: link || null,
        displayOrder: displayOrder ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(announcement);
  } catch {
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 });
  }
}

async function deleteHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireSuperAdmin();
  if (!authResult.authorized) return authResult.response;

  const { id } = await params;
  try {
    await prisma.announcement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}

export const PUT = withInvalidation(putHandler);

export const DELETE = withInvalidation(deleteHandler);
