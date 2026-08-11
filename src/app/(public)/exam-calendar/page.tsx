import type { Metadata } from "next";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { getExamCalendarPosts } from "@/lib/db";
import BilingualText from "@/components/public/BilingualText";

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-8 border-b border-border pb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Exam Calendar
        </h1>
        <p className="mt-1 font-hindi text-base text-muted">परीक्षा कैलेंडर</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Upcoming government exam dates, admit card releases, and results in a visual timeline.
        </p>
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
              <div className="grid gap-4 sm:grid-cols-2">
                {monthPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.slug}`}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                  >
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10">
                      <span className="text-xs font-semibold text-primary">
                        {new Date(post.examDate!).toLocaleDateString("en-IN", { month: "short" })}
                      </span>
                      <span className="text-xl font-extrabold text-primary">
                        {new Date(post.examDate!).getDate()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <BilingualText 
                        en={post.titleEn}
                        hi={post.titleHi || undefined}
                        as="p"
                        className="text-sm font-bold text-foreground line-clamp-1 transition-colors group-hover:text-primary"
                      />
                      {post.organization && (
                        <p className="text-xs text-muted">{post.organization}</p>
                      )}
                    </div>
                    {post.category && (
                      <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
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
