"use client";

import { useState } from "react";
import Link from "next/link";
import { History } from "lucide-react";

interface RecentPost {
  slug: string;
  title: string;
  visitedAt: number;
}

const STORAGE_KEY = "recentlyViewed";
const MAX_ITEMS = 10;

export function trackPageView(slug: string, title: string) {
  if (typeof window === "undefined") return;
  try {
    const stored: RecentPost[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const filtered = stored.filter((p) => p.slug !== slug);
    const updated = [{ slug, title, visitedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

export default function RecentlyViewed({ currentSlug }: { currentSlug?: string }) {
  const [posts, setPosts] = useState<RecentPost[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored: RecentPost[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const filtered = currentSlug ? stored.filter((p) => p.slug !== currentSlug) : stored;
      return filtered.slice(0, 5);
    } catch {
      return [];
    }
  });

  if (posts.length === 0) return null;

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
        <History className="h-4 w-4" />
        Recently Viewed
      </h3>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/post/${post.slug}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
