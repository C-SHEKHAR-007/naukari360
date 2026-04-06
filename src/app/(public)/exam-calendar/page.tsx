import type { Metadata } from "next";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { getExamCalendarPosts } from "@/lib/db";

export const metadata: Metadata = {
  title: "Exam Calendar — Upcoming Government Exams",
  description:
    "View upcoming government exam dates, admit card release dates, and result dates in a visual calendar.",
};

export const revalidate = 300;

export default async function ExamCalendarPage() {
  const posts = await getExamCalendarPosts();
  type CalendarPost = (typeof posts)[number];

  // Group by month
  const grouped: Record<string, CalendarPost[]> = {};
  for (const post of posts) {
    if (!post.examDate) continue;
    const key = new Date(post.examDate).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(post);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <Calendar className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exam Calendar</h1>
          <p className="text-sm text-muted">Upcoming government exam dates</p>
        </div>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="rounded-xl border border-border p-12 text-center">
          <p className="text-muted">No upcoming exams scheduled.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([month, monthPosts]) => (
            <section key={month}>
              <h2 className="mb-3 text-lg font-bold text-primary">{month}</h2>
              <div className="space-y-2">
                {monthPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.slug}`}
                    className="flex items-center gap-4 rounded-lg border border-border p-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
                  >
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10">
                      <span className="text-xs font-medium text-primary">
                        {new Date(post.examDate!).toLocaleDateString("en-IN", { month: "short" })}
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {new Date(post.examDate!).getDate()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {post.titleEn}
                      </p>
                      {post.organization && (
                        <p className="text-xs text-muted">{post.organization}</p>
                      )}
                    </div>
                    {post.category && (
                      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {post.category.name}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
