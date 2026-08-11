import { prisma } from "./prisma";
import type { PostStatus, QualificationLevel } from "@prisma/client";

// Shared select for post cards (lightweight - no content)
const postCardSelect = {
  id: true,
  titleEn: true,
  titleHi: true,
  slug: true,
  excerptEn: true,
  excerptHi: true,
  status: true,
  badge: true,
  totalPosts: true,
  organization: true,
  qualification: true,
  qualificationLevel: true,
  salary: true,
  lastDate: true,
  examDate: true,
  resultDate: true,
  applyLink: true,
  isTrending: true,
  isHot: true,
  isNew: true,
  readingTime: true,
  views: true,
  createdAt: true,
  updatedAt: true,
  category: { select: { id: true, name: true, nameHi: true, slug: true, color: true } },
  state: { select: { id: true, name: true, nameHi: true, slug: true } },
} as const;

export type PostCardData = Awaited<ReturnType<typeof getLatestPosts>>[number];

export async function getLatestPosts(limit = 20, offset = 0) {
  return prisma.post.findMany({
    where: { status: "published" as PostStatus },
    select: postCardSelect,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function getPostsByCategory(categorySlug: string, limit = 20, offset = 0) {
  return prisma.post.findMany({
    where: {
      status: "published" as PostStatus,
      category: { slug: categorySlug },
    },
    select: postCardSelect,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function getPostsByState(stateSlug: string, limit = 20, offset = 0) {
  return prisma.post.findMany({
    where: {
      status: "published" as PostStatus,
      state: { slug: stateSlug },
    },
    select: postCardSelect,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function getPostsByQualification(level: string, limit = 20, offset = 0) {
  return prisma.post.findMany({
    where: {
      status: "published" as PostStatus,
      qualificationLevel: level as QualificationLevel,
    },
    select: postCardSelect,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function getPersonalizedPosts(qualification: string | null, state: string | null, limit = 6) {
  if (!qualification && !state) return [];
  
  return prisma.post.findMany({
    where: {
      status: "published" as PostStatus,
      OR: [
        ...(qualification ? [{ qualificationLevel: qualification as QualificationLevel }] : []),
        ...(state ? [{ state: { slug: state } }] : []),
      ],
    },
    select: postCardSelect,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getTrendingPosts(limit = 10) {
  return prisma.post.findMany({
    where: {
      status: "published" as PostStatus,
      OR: [{ isTrending: true }, { isHot: true }],
    },
    select: postCardSelect,
    orderBy: { views: "desc" },
    take: limit,
  });
}

export async function getClosingSoonPosts(limit = 10) {
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  return prisma.post.findMany({
    where: {
      status: "published" as PostStatus,
      lastDate: { gte: now, lte: threeDaysFromNow },
    },
    select: postCardSelect,
    orderBy: { lastDate: "asc" },
    take: limit,
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      state: true,
      importantDates: { orderBy: { displayOrder: "asc" } },
      faqs: { orderBy: { displayOrder: "asc" } },
      postTags: { include: { tag: true } },
      syllabus: true,
    },
  });
}

export async function getRelatedPosts(
  postId: string, 
  categoryId: string | null, 
  qualificationLevel?: QualificationLevel | null, 
  limit = 4
) {
  // 1. Try to match BOTH category and qualification
  let matchingPosts = await prisma.post.findMany({
    where: {
      status: "published" as PostStatus,
      id: { not: postId },
      ...(categoryId ? { categoryId } : {}),
      ...(qualificationLevel ? { qualificationLevel } : {}),
    },
    select: postCardSelect,
    orderBy: { views: "desc" },
    take: limit,
  });

  // 2. If we don't have enough, relax qualification requirement (keep category)
  if (matchingPosts.length < limit) {
    const remaining = limit - matchingPosts.length;
    const excludeIds = [postId, ...matchingPosts.map((p) => p.id)];
    
    const categoryOnlyPosts = await prisma.post.findMany({
      where: {
        status: "published" as PostStatus,
        id: { notIn: excludeIds },
        ...(categoryId ? { categoryId } : {}),
      },
      select: postCardSelect,
      orderBy: { views: "desc" },
      take: remaining,
    });
    
    matchingPosts = [...matchingPosts, ...categoryOnlyPosts];
  }

  // 3. If we STILL don't have enough, relax category requirement (global trending)
  if (matchingPosts.length < limit) {
    const remaining = limit - matchingPosts.length;
    const excludeIds = [postId, ...matchingPosts.map((p) => p.id)];
    
    const globalPosts = await prisma.post.findMany({
      where: {
        status: "published" as PostStatus,
        id: { notIn: excludeIds },
      },
      select: postCardSelect,
      orderBy: { views: "desc" },
      take: remaining,
    });
    
    matchingPosts = [...matchingPosts, ...globalPosts];
  }

  return matchingPosts;
}

export async function searchPosts(query: string, limit = 20, offset = 0) {
  return prisma.post.findMany({
    where: {
      status: "published" as PostStatus,
      OR: [
        { titleEn: { contains: query, mode: "insensitive" } },
        { titleHi: { contains: query, mode: "insensitive" } },
        { organization: { contains: query, mode: "insensitive" } },
        { excerptEn: { contains: query, mode: "insensitive" } },
      ],
    },
    select: postCardSelect,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function getPostsCount(where?: Parameters<typeof prisma.post.count>[0]) {
  return prisma.post.count(where);
}

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getStates() {
  return prisma.state.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

export async function getStateBySlug(slug: string) {
  return prisma.state.findUnique({ where: { slug } });
}

export async function getAdSlots() {
  return prisma.adSlot.findMany({
    where: { isActive: true },
  });
}

export async function getAdSlot(slotKey: string) {
  return prisma.adSlot.findUnique({
    where: { slotKey },
  });
}

export async function getSiteSettings() {
  const settings = await prisma.siteSetting.findMany();
  return Object.fromEntries(
    settings.map((s: { key: string; value: string }) => [s.key, s.value])
  ) as Record<string, string>;
}

export async function getPageBySlug(slug: string) {
  return prisma.page.findUnique({ where: { slug } });
}

export async function getInterstitialConfig() {
  return prisma.interstitialPage.findFirst({
    where: { isActive: true },
  });
}

export async function incrementPostViews(id: string) {
  return prisma.post.update({
    where: { id },
    data: { views: { increment: 1 } },
  });
}

export async function getExamCalendarPosts() {
  const now = new Date();
  return prisma.post.findMany({
    where: {
      status: "published" as PostStatus,
      examDate: { gte: now },
    },
    select: {
      id: true,
      titleEn: true,
      titleHi: true,
      slug: true,
      examDate: true,
      organization: true,
      category: { select: { name: true, slug: true, color: true } },
    },
    orderBy: { examDate: "asc" },
  });
}

export async function getAffiliateLinks(categoryId?: string) {
  return prisma.affiliateLink.findMany({
    where: {
      isActive: true,
      ...(categoryId ? { categoryId } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}
