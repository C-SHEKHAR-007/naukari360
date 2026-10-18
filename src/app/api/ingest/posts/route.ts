import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { cleanPostData } from "@/lib/post-input";
import { slugify } from "@/lib/utils";

/**
 * Machine-to-machine post ingestion for the external scraping/extraction
 * pipeline (see Agentry-One's govt-job-agent). Deliberately separate from
 * /api/admin/posts: auth is a static shared key, not a NextAuth session, and
 * every post this endpoint creates is a draft -- `status` is never read from
 * the request body, so a leaked key can spam the draft queue but can never
 * publish anything live.
 */

// Only fields a notification-extraction pipeline could plausibly produce.
// Anything else (status, views, badges, isTrending/isHot/isNew, id, timestamps)
// is set by Prisma's defaults or by an admin during review, never by this route.
const ALLOWED_FIELDS = [
  "titleHi",
  "contentEn",
  "contentHi",
  "excerptEn",
  "excerptHi",
  "organization",
  "qualification",
  "qualificationLevel",
  "totalPosts",
  "minAge",
  "maxAge",
  "ageLimit",
  "salary",
  "feeGeneral",
  "feeObc",
  "feeScSt",
  "feeWomen",
  "lastDate",
  "examDate",
  "resultDate",
  "applyLink",
  "officialLink",
  "notificationLink",
  "admitCardLink",
  "answerKeyLink",
  "syllabusLink",
  "sourceUrl",
] as const;

interface ImportantDateInput {
  label?: unknown;
  date?: unknown;
}

function isAuthorized(providedKey: string | null): boolean {
  const expectedKey = process.env.INGEST_API_KEY;
  if (!expectedKey || !providedKey) return false;
  const provided = Buffer.from(providedKey);
  const expected = Buffer.from(expectedKey);
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request.headers.get("x-ingest-key"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success } = rateLimit(`ingest:${request.headers.get("x-ingest-key")}`, {
    limit: 60,
    windowMs: 60_000,
  });
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const titleEn = typeof body.titleEn === "string" ? body.titleEn.trim() : "";
  if (!titleEn) {
    return NextResponse.json({ error: "titleEn is required" }, { status: 400 });
  }

  try {
    const sourceUrl =
      typeof body.sourceUrl === "string" && body.sourceUrl ? body.sourceUrl : undefined;
    const notificationLink =
      typeof body.notificationLink === "string" && body.notificationLink
        ? body.notificationLink
        : undefined;

    const dedupeOr = [sourceUrl && { sourceUrl }, notificationLink && { notificationLink }].filter(
      (clause): clause is { sourceUrl: string } | { notificationLink: string } => Boolean(clause)
    );
    if (dedupeOr.length) {
      const existing = await prisma.post.findFirst({ where: { OR: dedupeOr } });
      if (existing) {
        return NextResponse.json({
          duplicate: true,
          id: existing.id,
          editUrl: `/admin/posts/${existing.id}`,
        });
      }
    }

    let categoryId: string | undefined;
    if (typeof body.categorySlug === "string" && body.categorySlug) {
      const category = await prisma.category.findUnique({ where: { slug: body.categorySlug } });
      if (category) categoryId = category.id;
    }

    let stateId: string | undefined;
    if (typeof body.stateSlug === "string" && body.stateSlug) {
      const state = await prisma.state.findUnique({ where: { slug: body.stateSlug } });
      if (state) stateId = state.id;
    }

    let slug = slugify(titleEn) || `post-${Date.now()}`;
    if (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 7)}`;
    }

    const fields: Record<string, unknown> = {};
    for (const field of ALLOWED_FIELDS) {
      if (field in body) fields[field] = body[field];
    }
    const cleaned = cleanPostData(fields);
    cleaned.titleEn = titleEn;
    cleaned.slug = slug;
    if (categoryId) cleaned.categoryId = categoryId;
    if (stateId) cleaned.stateId = stateId;
    cleaned.ingestSource =
      typeof body.ingestSource === "string" && body.ingestSource ? body.ingestSource : "scraper";

    const importantDates = Array.isArray(body.importantDates)
      ? (body.importantDates as ImportantDateInput[])
      : [];

    const post = await prisma.post.create({
      data: {
        ...(cleaned as Record<string, unknown> & { titleEn: string; slug: string }),
        importantDates: {
          create: importantDates
            .filter(
              (d) => typeof d.label === "string" && d.label && typeof d.date === "string" && d.date
            )
            .map((d, i) => ({
              labelEn: d.label as string,
              date: d.date as string,
              displayOrder: i,
            })),
        },
      },
    });

    return NextResponse.json(
      { id: post.id, editUrl: `/admin/posts/${post.id}`, duplicate: false },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("Ingest post error:", err);
    const message = err instanceof Error ? err.message : "Failed to create post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
