import { prisma } from "./prisma";
import { cached } from "./cache";
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

export type PostCardData = Awaited<ReturnType<typeof getLatestPostsUncached>>[number];

async function getLatestPostsUncached(limit = 20, offset = 0) {
  return prisma.post.findMany({
    where: { status: "published" as PostStatus },
    select: postCardSelect,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

async function getPostsByCategoryUncached(categorySlug: string, limit = 20, offset = 0) {
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

async function getPostsByStateUncached(stateSlug: string, limit = 20, offset = 0) {
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

async function getPostsByQualificationUncached(level: string, limit = 20, offset = 0) {
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

export async function getPersonalizedPosts(
  qualification: string | null,
  state: string | null,
  limit = 6
) {
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

async function getTrendingPostsUncached(limit = 10) {
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

async function getClosingSoonPostsUncached(limit = 10) {
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

async function getPostBySlugUncached(slug: string) {
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

async function getRelatedPostsUncached(
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

async function searchPostsUncached(query: string, limit = 20, offset = 0) {
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

async function getPostsCountUncached(where?: Parameters<typeof prisma.post.count>[0]) {
  return prisma.post.count(where);
}

async function getCategoriesUncached() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });
}

async function getCategoryBySlugUncached(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

async function getStatesUncached() {
  return prisma.state.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

async function getStateBySlugUncached(slug: string) {
  return prisma.state.findUnique({ where: { slug } });
}

async function getAdSlotsUncached() {
  return prisma.adSlot.findMany({
    where: { isActive: true },
  });
}

export async function getAdSlot(slotKey: string) {
  const slots = await getAdSlots();
  return slots.find((s) => s.slotKey === slotKey) ?? null;
}

async function getPageBySlugUncached(slug: string) {
  return prisma.page.findUnique({ where: { slug } });
}

async function getInterstitialConfigUncached() {
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

async function getExamCalendarPostsUncached() {
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

async function getAffiliateLinksUncached(categoryId?: string) {
  return prisma.affiliateLink.findMany({
    where: {
      isActive: true,
      ...(categoryId ? { categoryId } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

// Cached public read queries (invalidated by admin writes via invalidatePublicContent)
export const getLatestPosts = cached(getLatestPostsUncached, "getLatestPosts");
export const getPostsByCategory = cached(getPostsByCategoryUncached, "getPostsByCategory");
export const getPostsByState = cached(getPostsByStateUncached, "getPostsByState");
export const getPostsByQualification = cached(
  getPostsByQualificationUncached,
  "getPostsByQualification"
);
export const getTrendingPosts = cached(getTrendingPostsUncached, "getTrendingPosts");
export const getClosingSoonPosts = cached(getClosingSoonPostsUncached, "getClosingSoonPosts");
export const getPostBySlug = cached(getPostBySlugUncached, "getPostBySlug");
export const getRelatedPosts = cached(getRelatedPostsUncached, "getRelatedPosts");
export const searchPosts = cached(searchPostsUncached, "searchPosts");
export const getPostsCount = cached(getPostsCountUncached, "getPostsCount");
export const getCategories = cached(getCategoriesUncached, "getCategories");
export const getCategoryBySlug = cached(getCategoryBySlugUncached, "getCategoryBySlug");
export const getStates = cached(getStatesUncached, "getStates");
export const getStateBySlug = cached(getStateBySlugUncached, "getStateBySlug");
export const getAdSlots = cached(getAdSlotsUncached, "getAdSlots");
export const getPageBySlug = cached(getPageBySlugUncached, "getPageBySlug");
export const getInterstitialConfig = cached(getInterstitialConfigUncached, "getInterstitialConfig");
export const getExamCalendarPosts = cached(getExamCalendarPostsUncached, "getExamCalendarPosts");
export const getAffiliateLinks = cached(getAffiliateLinksUncached, "getAffiliateLinks");

export const getSyllabusBySlug = cached(
  (slug: string) => prisma.syllabus.findUnique({ where: { slug }, include: { post: true } }),
  "getSyllabusBySlug"
);
