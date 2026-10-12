"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import PostCard from "./PostCard";
import type { PostCardData } from "@/lib/db";
import { SectionHeader } from "@/components/ui";

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
      <SectionHeader
        tone="warning"
        icon={<Star className="h-4 w-4" />}
        title={<h2 className="text-lg font-bold text-foreground sm:text-xl">Jobs For You</h2>}
        subtitle={<p className="text-xs text-muted">Based on your saved profile preferences</p>}
        action={
          <Link
            href="/profile"
            className="hidden items-center gap-1 rounded-lg bg-background px-3 py-1.5 text-sm font-semibold text-primary border border-primary/20 transition-all hover:bg-primary/5 sm:flex"
          >
            Update Profile
          </Link>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
