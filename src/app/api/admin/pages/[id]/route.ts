import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireSuperAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { withInvalidation } from "@/lib/cache";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdmin();
  if (!authResult.authorized) return authResult.response;

  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(page);
}

async function putHandler(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdmin();
  if (!authResult.authorized) return authResult.response;

  const { id } = await params;
  try {
    const { titleEn, titleHi, slug, contentEn, contentHi, metaTitle, metaDesc } =
      await request.json();

    const page = await prisma.page.update({
      where: { id },
      data: {
        titleEn,
        titleHi: titleHi || null,
        slug,
        contentEn: contentEn || null,
        contentHi: contentHi || null,
        metaTitle: metaTitle || null,
        metaDesc: metaDesc || null,
      },
    });

    return NextResponse.json(page);
  } catch {
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
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
    await prisma.page.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
  }
}

export const PUT = withInvalidation(putHandler);

export const DELETE = withInvalidation(deleteHandler);
