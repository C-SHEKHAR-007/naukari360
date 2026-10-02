"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import PostCard from "./PostCard";
import type { PostCardData } from "@/lib/db";

export default function PersonalizedFeed() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<PostCardData[]>([]);
  const hasPrefs = !!(session?.user?.qualification || session?.user?.state);

  useEffect(() => {
    if (!hasPrefs) return;
    let cancelled = false;
    fetch("/api/personalized")
      .then((res) => (res.ok ? res.json() : { posts: [] }))
      .then((data) => {
        if (!cancelled) setPosts(data.posts ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [hasPrefs]);

  if (!hasPrefs || posts.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="mb-5 flex items-center justify-between border-l-4 border-amber-500 pl-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-900/20">
            <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground sm:text-xl">Jobs For You</h2>
            <p className="text-xs text-muted">Based on your saved profile preferences</p>
          </div>
        </div>
        <Link
          href="/profile"
          className="hidden items-center gap-1 rounded-lg bg-background px-3 py-1.5 text-sm font-semibold text-primary border border-primary/20 transition-all hover:bg-primary/5 sm:flex"
        >
          Update Profile
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
