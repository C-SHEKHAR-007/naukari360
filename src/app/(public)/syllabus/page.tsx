import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

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
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Exam Syllabuses
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Detailed, subject-wise syllabus and exam patterns for all major government exams.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {syllabuses.map((syl) => (
          <Link
            key={syl.id}
            href={`/syllabus/${syl.slug}`}
            className="group relative flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {syl.titleEn}
            </h2>
            {syl.titleHi && <p className="mt-1 font-hindi text-sm text-muted-foreground">{syl.titleHi}</p>}
            
            <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Updated: {formatDate(syl.updatedAt)}
              </span>
            </div>
          </Link>
        ))}
        {syllabuses.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border rounded-xl bg-card">
            No syllabuses found.
          </div>
        )}
      </div>
    </div>
  );
}
