import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Briefcase, ArrowRight } from "lucide-react";
import SyllabusDetailedView from "@/components/public/SyllabusDetailedView";
import InteractiveSyllabus, { SyllabusSection } from "@/components/public/InteractiveSyllabus";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const syl = await prisma.syllabus.findUnique({ where: { slug } });
  if (!syl) return { title: "Not Found" };
  return {
    title: `${syl.titleEn} | Sarkari Duniya`,
  };
}

export default async function SyllabusViewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();

  const syllabus = await prisma.syllabus.findUnique({
    where: { slug },
    include: { post: true }
  });

  if (!syllabus) {
    notFound();
  }

  let initialCompletedTopics: string[] = [];
  if (session?.user?.id) {
    const progress = await prisma.syllabusProgress.findUnique({
      where: {
        userId_syllabusId: {
          userId: session.user.id,
          syllabusId: syllabus.id,
        },
      },
    });
    if (progress && Array.isArray(progress.completedTopics)) {
      initialCompletedTopics = progress.completedTopics as string[];
    }
  }

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Syllabuses", url: "/syllabus" },
    { name: syllabus.titleEn, url: `/syllabus/${syllabus.slug}` },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, idx) => (
            <li key={idx} className="flex items-center">
              {idx > 0 && <span className="mx-2">/</span>}
              <a href={crumb.url} className="hover:text-primary transition-colors">
                {crumb.name}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mb-8 border-b border-border pb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {syllabus.titleEn}
        </h1>
        {syllabus.titleHi && (
          <p className="mt-2 font-hindi text-lg text-muted-foreground">{syllabus.titleHi}</p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Detailed Syllabus Reader */}
        <div className="lg:col-span-8">
          <SyllabusDetailedView 
            syllabus={syllabus.content as unknown as SyllabusSection[]} 
            markdownContent={syllabus.markdownContent}
          />
        </div>

        {/* Right Column: Interactive Tracker */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <InteractiveSyllabus
              postId={syllabus.postId || ""}
              syllabusId={syllabus.id}
              syllabus={syllabus.content as unknown as SyllabusSection[]}
              initialCompletedTopics={initialCompletedTopics}
            />

            {/* Connected Job Card */}
            {syllabus.post && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground leading-tight">Related Job</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Apply for this post</p>
                  </div>
                </div>
                <h4 className="text-sm font-medium text-foreground mb-4 line-clamp-2">
                  {syllabus.post.titleEn}
                </h4>
                <Link
                  href={`/post/${syllabus.post.slug}`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
                >
                  View Job Details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
