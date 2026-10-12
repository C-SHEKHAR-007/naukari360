"use client";

import Link from "next/link";
import { Clock, MapPin, Briefcase, Calendar, Bookmark, BookmarkCheck } from "lucide-react";
import { formatDate, daysUntil, isClosingSoon } from "@/lib/utils";
import type { PostCardData } from "@/lib/db";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Badge, type Tone } from "@/components/ui";

const badgeStyles: Record<string, { tone: Tone; variant: "solid" | "subtle"; className?: string }> =
  {
    NEW: { tone: "success", variant: "solid", className: "shadow-sm shadow-success/20" },
    HOT: { tone: "notice", variant: "solid", className: "shadow-sm shadow-notice/20" },
    TRENDING: { tone: "highlight", variant: "solid", className: "shadow-sm shadow-highlight/20" },
    EXPIRED: { tone: "neutral", variant: "subtle" },
    IMPORTANT: { tone: "warning", variant: "solid", className: "shadow-sm shadow-warning/20" },
    CLOSING_SOON: {
      tone: "danger",
      variant: "solid",
      className: "badge-urgent shadow-sm shadow-danger/30",
    },
  };

function PostBadge({ type }: { type: string }) {
  const style = badgeStyles[type];

  return (
    <Badge
      tone={style?.tone ?? "neutral"}
      variant={style?.variant ?? "subtle"}
      className={style?.className}
    >
      {type.replace("_", " ")}
    </Badge>
  );
}

function CountdownTimer({ lastDate }: { lastDate: Date }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="inline-block w-12 h-5 rounded-md bg-muted/20 animate-pulse"></span>;
  }

  const days = daysUntil(lastDate);
  if (days < 0) return null;
  if (days === 0)
    return (
      <span className="inline-flex items-center rounded-md bg-danger-subtle px-2 py-0.5 text-[11px] font-bold text-danger-emphasis ring-1 ring-danger-emphasis/25">
        Last day!
      </span>
    );
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold ring-1 ${
        days <= 3
          ? "bg-danger-subtle text-danger-emphasis ring-danger-emphasis/25"
          : "bg-warning-subtle text-warning-emphasis ring-warning-emphasis/25"
      }`}
    >
      {days}d left
    </span>
  );
}

export default function PostCard({ post }: { post: PostCardData }) {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const [bookmarked, setBookmarked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const saved = JSON.parse(localStorage.getItem("bookmarks") || "[]") as string[];
    setBookmarked(saved.includes(post.id));
  }, [post.id]);

  async function toggleBookmark(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update
    const saved = JSON.parse(localStorage.getItem("bookmarks") || "[]") as string[];
    let updated: string[];
    if (saved.includes(post.id)) {
      updated = saved.filter((id) => id !== post.id);
    } else {
      updated = [...saved, post.id];
    }
    localStorage.setItem("bookmarks", JSON.stringify(updated));
    setBookmarked(!bookmarked);

    // Sync to database if logged in
    if (session?.user) {
      try {
        await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: post.id }),
        });
      } catch (err) {
        console.error("Failed to sync bookmark", err);
      }
    }
  }

  const badges: string[] = [];
  if (post.badge) badges.push(post.badge);
  else if (isClosingSoon(post.lastDate)) badges.push("CLOSING_SOON");
  else if (post.isNew) badges.push("NEW");
  if (post.isHot && !badges.includes("HOT")) badges.push("HOT");
  if (post.isTrending && !badges.includes("TRENDING")) badges.push("TRENDING");

  return (
    <div className="h-full transition-transform duration-200 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.02]">
      <Link
        href={`/post/${post.slug}`}
        className="card-hover group relative flex flex-col rounded-xl border border-border bg-card/80 backdrop-blur-sm p-4 shadow-sm hover:border-primary/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] h-full transition-colors"
      >
        {/* Top row: badges + bookmark */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {badges.map((b) => (
              <PostBadge key={b} type={b} />
            ))}
            {post.category && (
              <span className="rounded-md bg-primary-subtle px-2 py-0.5 text-[11px] font-semibold text-primary ring-1 ring-primary/20">
                {post.category.name}
              </span>
            )}
          </div>
          <button
            onClick={toggleBookmark}
            className="shrink-0 rounded-lg p-1.5 text-muted transition-all hover:bg-primary/10 hover:text-primary"
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            {mounted && bookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-[15px] font-semibold leading-snug text-foreground group-hover:text-primary line-clamp-2">
          {t(post.titleEn, post.titleHi)}
        </h3>

        {/* Organization */}
        {post.organization && (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted">
            <Briefcase className="h-3 w-3 text-muted/70" />
            {post.organization}
          </p>
        )}

        {/* Meta row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted">
          {post.totalPosts && (
            <span className="inline-flex items-center gap-1 rounded-full bg-info-subtle px-2.5 py-0.5 font-semibold text-info-emphasis">
              {post.totalPosts} vacancies
            </span>
          )}
          {post.qualification && <span className="text-muted">{post.qualification}</span>}
          {post.state && (
            <span className="flex items-center gap-0.5 text-muted">
              <MapPin className="h-3 w-3" /> {post.state.name}
            </span>
          )}
        </div>

        {/* Footer */}
        {(post.lastDate || post.readingTime) && (
          <div className="mt-auto flex items-center justify-between border-t border-border pt-2.5">
            <div className="flex items-center gap-3 text-xs text-muted">
              {post.lastDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(post.lastDate)}
                </span>
              )}
              {post.readingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readingTime} min
                </span>
              )}
            </div>
            {post.lastDate && <CountdownTimer lastDate={new Date(post.lastDate)} />}
          </div>
        )}
      </Link>
    </div>
  );
}
