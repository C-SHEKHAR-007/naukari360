import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import BilingualText from "@/components/public/BilingualText";

export const metadata = {
  title: "All Syllabuses | Sarkari Duniya",
  description: "Browse detailed subject-wise syllabuses for all government exams.",
};

export default async function SyllabusListingPage() {
  const syllabuses = await prisma.syllabus.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        select: { titleEn: true, slug: true }
      }
    }
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Syllabus
        </h1>
        <p className="mt-1 font-hindi text-base text-muted">पाठ्यक्रम</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Detailed, subject-wise syllabus and exam patterns for all major government exams.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {syllabuses.map((syl) => (
          <Link
            key={syl.id}
            href={`/syllabus/${syl.slug}`}
            className="card-hover group relative flex flex-col rounded-xl border border-border bg-card/80 backdrop-blur-sm p-4 shadow-sm hover:border-primary/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] h-full transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                <BookOpen className="h-5 w-5" />
              </div>
              {syl.post && (
                <span className="shrink-0 rounded-md bg-primary/8 px-2 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-primary/20 dark:bg-primary/15 line-clamp-1 max-w-[150px]">
                  {syl.post.titleEn}
                </span>
              )}
            </div>

            <BilingualText 
              en={syl.titleEn} 
              hi={syl.titleHi || undefined}
              as="h2"
              className="mt-1 text-[15px] font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2"
            />
            
            <div className="mt-auto flex items-center justify-between border-t border-border pt-2.5 mt-4">
              <div className="flex items-center gap-3 text-[11px] text-muted">
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3 text-muted/70" />
                  Updated: {formatDate(syl.updatedAt)}
                </span>
              </div>
            </div>
          </Link>
        ))}
        {syllabuses.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-muted border rounded-xl bg-card">
            <BilingualText en="No syllabuses found." hi="कोई पाठ्यक्रम नहीं मिला।" />
          </div>
        )}
      </div>
    </div>
  );
}
