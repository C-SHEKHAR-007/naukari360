"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PostCard from "./PostCard";
import type { PostCardData } from "@/lib/db";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface CategorySectionProps {
  title: string;
  titleHi?: string;
  href: string;
  posts: PostCardData[];
}

export default function CategorySection({ title, titleHi, href, posts }: CategorySectionProps) {
  const { t } = useLanguage();
  if (posts.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="mb-5 flex items-center justify-between border-l-4 border-primary pl-4">
        <div>
          <h2 className="text-lg font-bold text-foreground sm:text-xl">{t(title, titleHi)}</h2>
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-1 rounded-lg bg-primary/5 px-3 py-1.5 text-sm font-semibold text-primary transition-all hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/20"
        >
          {t("View All", "सभी देखें")} <ChevronRight className="h-4 w-4" />
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
