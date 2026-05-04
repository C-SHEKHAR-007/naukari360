import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const banners = await prisma.banner.findMany({ orderBy: { displayOrder: "asc" } });
  return NextResponse.json(banners);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
