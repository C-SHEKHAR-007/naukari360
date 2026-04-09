"use client";

import Link from "next/link";
import { MoreHorizontal, Edit, Trash2, ExternalLink } from "lucide-react";
import { useState } from "react";

interface Post {
  id: string;
  titleEn: string;
  slug: string;
  status: string;
  badge: string | null;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  category: { name: string; slug: string } | null;
}

export default function PostsTable({ posts }: { posts: Post[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-surface">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-muted">Title</th>
            <th className="hidden px-4 py-3 text-left font-medium text-muted sm:table-cell">
              Category
            </th>
            <th className="hidden px-4 py-3 text-left font-medium text-muted md:table-cell">
              Status
            </th>
            <th className="hidden px-4 py-3 text-left font-medium text-muted lg:table-cell">
              Views
            </th>
            <th className="px-4 py-3 text-left font-medium text-muted">Date</th>
            <th className="px-4 py-3 text-right font-medium text-muted">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {posts.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center text-muted">
                No posts found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function PostRow({ post }: { post: Post }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const statusStyles: Record<string, string> = {
    published: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
    draft: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
    archived: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <tr className="hover:bg-surface/50">
      <td className="px-4 py-3">
        <Link
          href={`/admin/posts/${post.id}`}
          className="font-medium text-foreground hover:text-primary line-clamp-1"
        >
          {post.titleEn}
        </Link>
      </td>
      <td className="hidden px-4 py-3 sm:table-cell">
        {post.category ? (
          <span className="text-xs text-muted">{post.category.name}</span>
        ) : (
          <span className="text-xs text-muted/50">—</span>
        )}
      </td>
      <td className="hidden px-4 py-3 md:table-cell">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[post.status] || statusStyles.draft}`}
        >
          {post.status}
        </span>
      </td>
      <td className="hidden px-4 py-3 text-muted lg:table-cell">{post.views}</td>
      <td className="px-4 py-3 text-muted">
        {new Date(post.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "2-digit",
        })}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="relative inline-block">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-md p-1.5 text-muted hover:bg-surface hover:text-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-border bg-card py-1 shadow-lg">
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-surface"
                  onClick={() => setMenuOpen(false)}
                >
                  <Edit className="h-3.5 w-3.5" /> Edit
                </Link>
                <Link
                  href={`/post/${post.slug}`}
                  target="_blank"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-surface"
                  onClick={() => setMenuOpen(false)}
                >
                  <ExternalLink className="h-3.5 w-3.5" /> View
                </Link>
                <button
                  onClick={async () => {
                    if (!confirm("Delete this post?")) return;
                    await fetch(`/api/admin/posts/${post.id}`, { method: "DELETE" });
                    window.location.reload();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
