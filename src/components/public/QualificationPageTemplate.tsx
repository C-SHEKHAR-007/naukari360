import PostCard from "@/components/public/PostCard";
import { Pagination, PostListEmpty } from "@/components/public/Pagination";
import { getPostsByQualification, getPostsCount } from "@/lib/db";
import type { QualificationLevel } from "@prisma/client";

const POSTS_PER_PAGE = 20;

interface QualificationPageProps {
  level: string;
  title: string;
  titleHi: string;
  description: string;
  baseUrl: string;
  searchParams: Promise<{ page?: string }>;
}

export default async function QualificationPageTemplate({
  level,
  title,
  titleHi,
  description,
  baseUrl,
  searchParams,
}: QualificationPageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const offset = (currentPage - 1) * POSTS_PER_PAGE;

  const [posts, totalCount] = await Promise.all([
    getPostsByQualification(level, POSTS_PER_PAGE, offset),
    getPostsCount({
      where: { status: "published", qualificationLevel: level as QualificationLevel },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      <p className="mt-1 font-hindi text-lg text-muted">{titleHi}</p>
      <p className="mt-2 text-sm text-muted">{description}</p>

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
            <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl={baseUrl} />
          </>
        )}
      </div>
    </div>
  );
}
