import Link from "next/link";
import { TrendingUp, Eye } from "lucide-react";

interface TrendingPost {
  slug: string;
  titleEn: string;
  views: number;
}

export default function TrendingWidget({ posts }: { posts: TrendingPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
        <TrendingUp className="h-4 w-4 text-primary" />
        Trending Now
      </h3>
      <ul className="space-y-3">
        {posts.slice(0, 10).map((post, index) => (
          <li key={post.slug} className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <Link
                href={`/post/${post.slug}`}
                className="text-sm text-foreground hover:text-primary transition-colors line-clamp-2"
              >
                {post.titleEn}
              </Link>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="h-3 w-3" />
                {post.views.toLocaleString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
