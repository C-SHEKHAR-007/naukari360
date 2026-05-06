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
    const body = await request.json();
    const { importantDates, faqs, tags, ...data } = body;

    // Clean empty strings to null
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === "") cleaned[key] = null;
      else cleaned[key] = value;
    }

    // Parse dates
    if (cleaned.lastDate) cleaned.lastDate = new Date(cleaned.lastDate as string);
    if (cleaned.examDate) cleaned.examDate = new Date(cleaned.examDate as string);
    if (cleaned.resultDate) cleaned.resultDate = new Date(cleaned.resultDate as string);

    // Update post
    const post = await prisma.post.update({
      where: { id },
      data: cleaned as Record<string, unknown> & { titleEn: string; slug: string },
    });

    // Rebuild important dates
    await prisma.importantDate.deleteMany({ where: { postId: id } });
    if (importantDates?.length) {
      await prisma.importantDate.createMany({
        data: importantDates
          .filter((d: { label: string; date: string }) => d.label && d.date)
          .map((d: { label: string; date: string }, i: number) => ({
            postId: id,
            labelEn: d.label,
            date: d.date,
            displayOrder: i,
          })),
      });
    }

    // Rebuild FAQs
    await prisma.faq.deleteMany({ where: { postId: id } });
    if (faqs?.length) {
      await prisma.faq.createMany({
        data: faqs
          .filter((f: { question: string; answer: string }) => f.question && f.answer)
          .map((f: { question: string; answer: string }, i: number) => ({
            postId: id,
            questionEn: f.question,
            answerEn: f.answer,
            displayOrder: i,
          })),
      });
    }

    // Rebuild tags
    await prisma.postTag.deleteMany({ where: { postId: id } });
    if (tags) {
      const tagNames = (tags as string)
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);
      for (const name of tagNames) {
        const tag = await prisma.tag.upsert({
          where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
          create: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
          update: {},
        });
        await prisma.postTag.create({ data: { postId: id, tagId: tag.id } });
      }
    }

    return NextResponse.json({ id: post.id });
  } catch (err: unknown) {
    console.error("Update post error:", err);
    const message = err instanceof Error ? err.message : "Failed to update post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const authResult = await requireSuperAdmin();
  if (!authResult.authorized) return authResult.response;

  const { id } = await params;

  try {
    await prisma.postTag.deleteMany({ where: { postId: id } });
    await prisma.importantDate.deleteMany({ where: { postId: id } });
    await prisma.faq.deleteMany({ where: { postId: id } });
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Delete post error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
