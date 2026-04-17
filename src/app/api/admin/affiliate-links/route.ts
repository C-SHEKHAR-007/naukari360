import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const links = await prisma.affiliateLink.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(links);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, originalUrl, slug, isActive, displayInPosts, categoryId } = await request.json();
    if (!name || !originalUrl || !slug) {
      return NextResponse.json({ error: "Name, URL, and slug are required" }, { status: 400 });
    }

    const link = await prisma.affiliateLink.create({
      data: {
        name,
        originalUrl,
        slug,
        isActive: isActive ?? true,
        displayInPosts: displayInPosts ?? false,
        categoryId: categoryId || null,
      },
      include: { category: true },
    });
    return NextResponse.json(link);
  } catch (err: unknown) {
    console.error("Create affiliate link error:", err);
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
  }
}
