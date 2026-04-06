import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PostCard from "@/components/public/PostCard";
import { Pagination, PostListEmpty } from "@/components/public/Pagination";
import AdSlot from "@/components/public/AdSlot";
import { getPostsByCategory, getCategoryBySlug, getPostsCount } from "@/lib/db";

const POSTS_PER_PAGE = 20;

// Valid category slugs
const VALID_CATEGORIES = [
  "latest-jobs",
  "results",
  "admit-card",
  "answer-key",
  "admission",
  "syllabus",
];

interface Props {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  if (!VALID_CATEGORIES.includes(categorySlug)) return {};
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return {};
  return {
    title: category.metaTitle || `${category.name} — Government Jobs`,
    description:
      category.metaDesc ||
      `Browse all ${category.name.toLowerCase()} for government jobs in India.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { categorySlug } = await params;

  if (!VALID_CATEGORIES.includes(categorySlug)) {
    notFound();
  }

  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const offset = (currentPage - 1) * POSTS_PER_PAGE;

  const [posts, totalCount] = await Promise.all([
    getPostsByCategory(categorySlug, POSTS_PER_PAGE, offset),
    getPostsCount({ where: { status: "published", category: { slug: categorySlug } } }),
  ]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {category.name}
        </h1>
        {category.nameHi && (
          <p className="mt-1 font-hindi text-base text-muted">{category.nameHi}</p>
        )}
        {category.description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {category.description}
          </p>
        )}
      </div>

      <AdSlot slotKey="header_banner" className="mb-8" />

      {posts.length === 0 ? (
        <PostListEmpty />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <div key={post.id}>
                <PostCard post={post} />
                {i === 5 && (
                  <AdSlot slotKey="in_feed_1" className="mt-4 sm:col-span-2 lg:col-span-3" />
                )}
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl={`/${categorySlug}`}
          />
        </>
      )}

      <AdSlot slotKey="footer_banner" className="mt-8" />
    </div>
  );
}
