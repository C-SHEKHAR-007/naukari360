import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const authResult = await requireAdmin();
  if (!authResult.authorized) return authResult.response;

  const menus = await prisma.navMenu.findMany({
    orderBy: { displayOrder: "asc" },
    include: { children: { orderBy: { displayOrder: "asc" } } },
  });
  return NextResponse.json(menus);
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if (!authResult.authorized) return authResult.response;

  try {
    const { label, labelHi, url, parentId, displayOrder, isActive } = await request.json();

    const menu = await prisma.navMenu.create({
      data: {
        label,
        labelHi: labelHi || null,
        url,
        parentId: parentId || null,
        displayOrder: displayOrder ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(menu, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 });
  }
}
