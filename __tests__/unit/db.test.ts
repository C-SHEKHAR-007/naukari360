import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    post: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
    },
    category: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    state: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    adSlot: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    siteSetting: {
      findMany: vi.fn(),
    },
    page: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  getLatestPosts,
  getPostsByCategory,
  getPostsByState,
  getPostsByQualification,
  getTrendingPosts,
  getClosingSoonPosts,
  getPostBySlug,
  getRelatedPosts,
  searchPosts,
  getPostsCount,
  getCategories,
  getCategoryBySlug,
  getStates,
  getAdSlot,
  getPageBySlug,
} from "@/lib/db";

describe("db.ts — getLatestPosts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("queries published posts ordered by createdAt desc", async () => {
    (prisma.post.findMany as any).mockResolvedValue([]);
    await getLatestPosts();
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: "published" },
        orderBy: { createdAt: "desc" },
        take: 20,
        skip: 0,
      })
    );
  });

  it("respects limit and offset params", async () => {
    (prisma.post.findMany as any).mockResolvedValue([]);
    await getLatestPosts(10, 5);
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 10, skip: 5 })
    );
  });
});

describe("db.ts — getPostsByCategory", () => {
  it("filters by category slug", async () => {
    (prisma.post.findMany as any).mockResolvedValue([]);
    await getPostsByCategory("latest-jobs");
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: "published",
          category: { slug: "latest-jobs" },
        }),
      })
    );
  });
});

describe("db.ts — getPostsByState", () => {
  it("filters by state slug", async () => {
    (prisma.post.findMany as any).mockResolvedValue([]);
    await getPostsByState("uttar-pradesh");
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          state: { slug: "uttar-pradesh" },
        }),
      })
    );
  });
});

describe("db.ts — getPostsByQualification", () => {
  it("filters by qualification level", async () => {
    (prisma.post.findMany as any).mockResolvedValue([]);
    await getPostsByQualification("graduate");
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          qualificationLevel: "graduate",
        }),
      })
    );
  });
});

describe("db.ts — getTrendingPosts", () => {
  it("queries trending/hot posts ordered by views", async () => {
    (prisma.post.findMany as any).mockResolvedValue([]);
    await getTrendingPosts(5);
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [{ isTrending: true }, { isHot: true }],
        }),
        orderBy: { views: "desc" },
        take: 5,
      })
    );
  });
});

describe("db.ts — getClosingSoonPosts", () => {
  it("queries posts with lastDate within 3 days", async () => {
    (prisma.post.findMany as any).mockResolvedValue([]);
    await getClosingSoonPosts();
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          lastDate: expect.objectContaining({
            gte: expect.any(Date),
            lte: expect.any(Date),
          }),
        }),
        orderBy: { lastDate: "asc" },
      })
    );
  });
});

describe("db.ts — getPostBySlug", () => {
  it("queries single post with all relations", async () => {
    (prisma.post.findUnique as any).mockResolvedValue(null);
    await getPostBySlug("ssc-cgl-2025");
    expect(prisma.post.findUnique).toHaveBeenCalledWith({
      where: { slug: "ssc-cgl-2025" },
      include: expect.objectContaining({
        category: true,
        state: true,
        importantDates: expect.any(Object),
        faqs: expect.any(Object),
        postTags: expect.any(Object),
      }),
    });
  });
});

describe("db.ts — searchPosts", () => {
  it("searches across titleEn, titleHi, organization, excerptEn", async () => {
    (prisma.post.findMany as any).mockResolvedValue([]);
    await searchPosts("SSC");
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            { titleEn: { contains: "SSC", mode: "insensitive" } },
            { titleHi: { contains: "SSC", mode: "insensitive" } },
            { organization: { contains: "SSC", mode: "insensitive" } },
          ]),
        }),
      })
    );
  });
});

describe("db.ts — getRelatedPosts", () => {
  it("excludes current post and filters by category", async () => {
    (prisma.post.findMany as any).mockResolvedValue([]);
    await getRelatedPosts("post-1", "cat-1");
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: { not: "post-1" },
          categoryId: "cat-1",
        }),
      })
    );
  });
});

describe("db.ts — getCategories", () => {
  it("returns active categories ordered by displayOrder", async () => {
    (prisma.category.findMany as any).mockResolvedValue([]);
    await getCategories();
    expect(prisma.category.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });
  });
});

describe("db.ts — getCategoryBySlug", () => {
  it("queries by slug", async () => {
    (prisma.category.findUnique as any).mockResolvedValue(null);
    await getCategoryBySlug("results");
    expect(prisma.category.findUnique).toHaveBeenCalledWith({ where: { slug: "results" } });
  });
});

describe("db.ts — getStates", () => {
  it("returns active states ordered by name", async () => {
    (prisma.state.findMany as any).mockResolvedValue([]);
    await getStates();
    expect(prisma.state.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  });
});

describe("db.ts — getAdSlot", () => {
  it("queries by slotKey", async () => {
    (prisma.adSlot.findUnique as any).mockResolvedValue(null);
    await getAdSlot("header_banner");
    expect(prisma.adSlot.findUnique).toHaveBeenCalledWith({ where: { slotKey: "header_banner" } });
  });
});

describe("db.ts — getPageBySlug", () => {
  it("queries by slug", async () => {
    (prisma.page.findUnique as any).mockResolvedValue(null);
    await getPageBySlug("about");
    expect(prisma.page.findUnique).toHaveBeenCalledWith({ where: { slug: "about" } });
  });
});

describe("db.ts — getPostsCount", () => {
  it("counts posts", async () => {
    (prisma.post.count as any).mockResolvedValue(42);
    const count = await getPostsCount();
    expect(count).toBe(42);
  });
});
