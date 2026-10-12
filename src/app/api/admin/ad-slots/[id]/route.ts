import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { withInvalidation } from "@/lib/cache";

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function putHandler(request: NextRequest, { params }: RouteParams) {
  const authResult = await requireSuperAdmin();
  if (!authResult.authorized) return authResult.response;

  const { id } = await params;
  try {
    const body = await request.json();
    const slot = await prisma.adSlot.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(slot);
  } catch {
    return NextResponse.json({ error: "Failed to update ad slot" }, { status: 500 });
  }
}

async function deleteHandler(_request: NextRequest, { params }: RouteParams) {
  const authResult = await requireSuperAdmin();
  if (!authResult.authorized) return authResult.response;

  const { id } = await params;
  try {
    await prisma.adSlot.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete ad slot" }, { status: 500 });
  }
}

export const PUT = withInvalidation(putHandler);

export const DELETE = withInvalidation(deleteHandler);
