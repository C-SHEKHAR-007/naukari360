import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if (!authResult.authorized) return authResult.response;

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

    const post = await prisma.post.create({
      data: {
        ...(cleaned as Record<string, unknown> & { titleEn: string; slug: string }),
        importantDates: {
          create: (importantDates || [])
            .filter((d: { label: string; date: string }) => d.label && d.date)
            .map((d: { label: string; date: string }, i: number) => ({
              labelEn: d.label,
              date: d.date,
              displayOrder: i,
            })),
        },
        faqs: {
          create: (faqs || [])
            .filter((f: { question: string; answer: string }) => f.question && f.answer)
            .map((f: { question: string; answer: string }, i: number) => ({
              questionEn: f.question,
              answerEn: f.answer,
              displayOrder: i,
            })),
        },
      },
    });

    // Handle tags
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
        await prisma.postTag.create({ data: { postId: post.id, tagId: tag.id } });
      }
    }

    return NextResponse.json({ id: post.id });
  } catch (err: unknown) {
    console.error("Create post error:", err);
    const message = err instanceof Error ? err.message : "Failed to create post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
