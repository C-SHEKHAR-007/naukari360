import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pages = await prisma.page.findMany({ orderBy: { slug: "asc" } });
  return NextResponse.json(pages);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { titleEn, titleHi, slug, contentEn, contentHi, metaTitle, metaDesc } =
      await request.json();

    const page = await prisma.page.create({
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

    return NextResponse.json(page, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
  }
}
