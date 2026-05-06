import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireSuperAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authResult = await requireAdmin();
  if (!authResult.authorized) return authResult.response;

  const { id } = await params;
  try {
    const { name, nameHi, slug } = await request.json();
    if (!name || !slug)
      return NextResponse.json({ error: "Name and slug required" }, { status: 400 });

    const category = await prisma.category.update({
      where: { id },
      data: { name, nameHi: nameHi || null, slug },
    });
    return NextResponse.json(category);
  } catch (err: unknown) {
    console.error("Update category error:", err);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const authResult = await requireSuperAdmin();
  if (!authResult.authorized) return authResult.response;

  const { id } = await params;
  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Delete category error:", err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
