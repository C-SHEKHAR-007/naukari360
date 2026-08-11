import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PostsTable from "@/components/admin/PostsTable";
import AdminSearch from "@/components/admin/AdminSearch";

interface Props {
  searchParams: Promise<{ page?: string; status?: string; q?: string }>;
}

export default async function AdminPostsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const status = params.status || "all";
  const query = params.q || "";
  const perPage = 15;

  const where: Record<string, unknown> = {};
  if (status !== "all") where.status = status;
  if (query) {
    where.OR = [
      { titleEn: { contains: query, mode: "insensitive" } },
      { titleHi: { contains: query, mode: "insensitive" } },
      { organization: { contains: query, mode: "insensitive" } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      select: {
        id: true,
        titleEn: true,
        slug: true,
        status: true,
        badge: true,
        views: true,
        createdAt: true,
        updatedAt: true,
        category: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Posts</h1>
          <p className="mt-1 text-sm text-muted">{total} total posts</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <AdminSearch placeholder="Search posts..." />
        <div className="flex gap-2">
          {["all", "published", "draft", "archived"].map((s) => (
            <Link
              key={s}
              href={`/admin/posts?status=${s}${query ? `&q=${query}` : ""}`}
              className={`rounded-lg px-3 py-2 text-xs font-medium capitalize transition-colors ${
                status === s
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-surface hover:text-foreground"
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <PostsTable posts={posts} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/posts?page=${page - 1}${status !== "all" ? `&status=${status}` : ""}${query ? `&q=${query}` : ""}`}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-surface"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/posts?page=${page + 1}${status !== "all" ? `&status=${status}` : ""}${query ? `&q=${query}` : ""}`}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-surface"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
