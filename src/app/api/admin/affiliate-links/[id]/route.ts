import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const data = await request.json();
    const link = await prisma.affiliateLink.update({
      where: { id },
      data: {
        name: data.name,
        originalUrl: data.originalUrl,
        slug: data.slug,
        isActive: data.isActive,
        displayInPosts: data.displayInPosts,
        categoryId: data.categoryId || null,
      },
      include: { category: true },
    });
    return NextResponse.json(link);
  } catch (err: unknown) {
    console.error("Update affiliate link error:", err);
    return NextResponse.json({ error: "Failed to update link" }, { status: 500 });
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
    await prisma.affiliateLink.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Delete affiliate link error:", err);
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
  }
}
