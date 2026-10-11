"use client";

import Link from "next/link";
import { MoreHorizontal, Edit, Trash2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useIsSuperAdmin } from "@/components/admin/AdminRoleProvider";
import { Badge, type Tone } from "@/components/ui";

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
            <th className="px-3 py-3 text-left font-medium text-muted sm:px-4">Title</th>
            <th className="hidden px-4 py-3 text-left font-medium text-muted sm:table-cell">
              Category
            </th>
            <th className="hidden px-4 py-3 text-left font-medium text-muted md:table-cell">
              Status
            </th>
            <th className="hidden px-4 py-3 text-left font-medium text-muted lg:table-cell">
              Views
            </th>
            <th className="hidden px-4 py-3 text-left font-medium text-muted sm:table-cell">
              Date
            </th>
            <th className="px-3 py-3 text-right font-medium text-muted sm:px-4">
              <span className="sr-only sm:not-sr-only">Actions</span>
            </th>
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
  const isSuperAdmin = useIsSuperAdmin();
  const [menuOpen, setMenuOpen] = useState(false);

  const statusTones: Record<string, Tone> = {
    published: "success",
    draft: "warning",
    archived: "neutral",
  };

  const status = <Badge tone={statusTones[post.status] ?? statusTones.draft}>{post.status}</Badge>;
  const date = new Date(post.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });

  return (
    <tr className="hover:bg-surface/50">
      <td className="px-3 py-3 sm:px-4">
        <Link
          href={`/admin/posts/${post.id}`}
          className="font-medium text-foreground hover:text-primary line-clamp-2 break-words sm:line-clamp-1"
        >
          {post.titleEn}
        </Link>
        {/* Phones: status + date sit under the title instead of in their own columns */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 sm:hidden">
          {status}
          <span className="whitespace-nowrap text-xs text-muted">{date}</span>
        </div>
      </td>
      <td className="hidden px-4 py-3 sm:table-cell">
        {post.category ? (
          <span className="text-xs text-muted">{post.category.name}</span>
        ) : (
          <span className="text-xs text-muted/50">—</span>
        )}
      </td>
      <td className="hidden px-4 py-3 md:table-cell">{status}</td>
      <td className="hidden px-4 py-3 text-muted lg:table-cell">{post.views}</td>
      <td className="hidden whitespace-nowrap px-4 py-3 text-muted sm:table-cell">{date}</td>
      <td className="w-px px-2 py-3 text-right align-top sm:w-auto sm:px-4 sm:align-middle">
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
                {isSuperAdmin && (
                  <button
                    onClick={async () => {
                      if (!confirm("Delete this post?")) return;
                      await fetch(`/api/admin/posts/${post.id}`, { method: "DELETE" });
                      window.location.reload();
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger-emphasis hover:bg-danger-subtle"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
