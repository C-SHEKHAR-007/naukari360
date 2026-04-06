import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PostCard from "@/components/public/PostCard";
import { Pagination, PostListEmpty } from "@/components/public/Pagination";
import { getPostsByState, getStateBySlug, getPostsCount } from "@/lib/db";

const POSTS_PER_PAGE = 20;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const state = await getStateBySlug(slug);
  if (!state) return {};
  return {
    title: `Government Jobs in ${state.name}`,
    description: `Browse all government job notifications for ${state.name}. Latest sarkari naukri in ${state.name}.`,
  };
}

export default async function StatePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const state = await getStateBySlug(slug);
  if (!state) notFound();

  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const offset = (currentPage - 1) * POSTS_PER_PAGE;

  const [posts, totalCount] = await Promise.all([
    getPostsByState(slug, POSTS_PER_PAGE, offset),
    getPostsCount({ where: { status: "published", state: { slug } } }),
  ]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground">Government Jobs in {state.name}</h1>
      {state.nameHi && (
        <p className="mt-1 font-hindi text-lg text-muted">{state.nameHi} — सरकारी नौकरी</p>
      )}

      <div className="mt-6">
        {posts.length === 0 ? (
          <PostListEmpty />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl={`/state/${slug}`}
            />
          </>
        )}
      </div>
    </div>
  );
}
