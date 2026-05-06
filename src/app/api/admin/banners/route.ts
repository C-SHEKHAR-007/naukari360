import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const authResult = await requireAdmin();
  if (!authResult.authorized) return authResult.response;

  const banners = await prisma.banner.findMany({ orderBy: { displayOrder: "asc" } });
  return NextResponse.json(banners);
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if (!authResult.authorized) return authResult.response;

  try {
    const { title, imageUrl, link, displayOrder, isActive } = await request.json();

    const banner = await prisma.banner.create({
      data: {
        title,
        imageUrl,
        link: link || null,
        displayOrder: displayOrder ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
