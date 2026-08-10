import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  GraduationCap,
  IndianRupee,
  ExternalLink,
  Clock,
  Eye,
} from "lucide-react";
import { getPostBySlug, getRelatedPosts, getAffiliateLinks } from "@/lib/db";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { generateJobPostingSchema, generateFAQSchema, generateBreadcrumbSchema } from "@/lib/seo";
import sanitizeHtml from "sanitize-html";
import AdSlot from "@/components/public/AdSlot";
import PostCard from "@/components/public/PostCard";
import ShareButtons from "@/components/public/ShareButtons";
import PostTitle from "@/components/public/PostTitle";
import ReadingProgressBar from "@/components/public/ReadingProgressBar";
import CopyJobDetails from "@/components/public/CopyJobDetails";
import PrintButton from "@/components/public/PrintButton";
import ReadingTime from "@/components/public/ReadingTime";
import AddToCalendar from "@/components/public/AddToCalendar";
import AskOnWhatsApp from "@/components/public/AskOnWhatsApp";
import InlineNewsletterForm from "@/components/public/InlineNewsletterForm";
import TrackApplicationButton from "@/components/public/TrackApplicationButton";
import InteractiveSyllabus from "@/components/public/InteractiveSyllabus";
import type { SyllabusSection } from "@/components/public/InteractiveSyllabus";
import ViewTracker from "@/components/public/ViewTracker";
import SalaryCalculator from "@/components/public/SalaryCalculator";
import CommentsSection from "@/components/public/CommentsSection";
import type { PostCardData } from "@/lib/db";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.metaTitle || post.titleEn,
    description:
      post.metaDesc ||
      post.excerptEn ||
      `${post.titleEn} - Complete details, eligibility, dates, and apply link.`,
    alternates: {
      canonical: `/post/${post.slug}`,
      languages: { "en-IN": `/post/${post.slug}`, "hi-IN": `/post/${post.slug}` },
    },
    openGraph: {
      title: post.metaTitle || post.titleEn,
      description: post.metaDesc || post.excerptEn || undefined,
      images: post.ogImage ? [post.ogImage] : undefined,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.titleEn,
      description: post.metaDesc || post.excerptEn || undefined,
      images: post.ogImage ? [post.ogImage] : undefined,
    },
    keywords: post.metaKeywords || undefined,
  };
}

export const revalidate = 300;

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") notFound();

  const [relatedPosts, affiliateLinks, session] = await Promise.all([
    getRelatedPosts(post.id, post.categoryId, 4),
    getAffiliateLinks(post.categoryId || undefined),
    auth(),
  ]);

  let isTracked = false;
  let initialCompletedTopics: string[] = [];
  if (session?.user) {
    const [trackedRecord, syllabusProgress] = await Promise.all([
      prisma.applicationTracker.findUnique({
        where: {
          userId_postId: { userId: session.user.id, postId: post.id },
        },
      }),
      prisma.syllabusProgress.findUnique({
        where: {
          userId_postId: { userId: session.user.id, postId: post.id },
        },
      }),
    ]);
    if (trackedRecord) isTracked = true;
    if (syllabusProgress && Array.isArray(syllabusProgress.completedTopics)) {
      initialCompletedTopics = syllabusProgress.completedTopics as string[];
    }
  }

  const breadcrumbs = [
    { name: "Home", url: "/" },
    ...(post.category ? [{ name: post.category.name, url: `/${post.category.slug}` }] : []),
    { name: post.titleEn, url: `/post/${post.slug}` },
  ];

  // Try to parse pay level from salary string (e.g. "Level 7", "Level-6")
  let initialPayLevel = 1;
  if (post.salary) {
    const levelMatch = post.salary.match(/level[\s-]*(\d+)/i);
    if (levelMatch && levelMatch[1]) {
      initialPayLevel = Math.min(14, Math.max(1, parseInt(levelMatch[1], 10)));
    }
  }

  return (
    <>
      <ViewTracker postId={post.id} />
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />
      {post.lastDate && post.organization && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateJobPostingSchema({ post, url: `/post/${post.slug}` })),
          }}
        />
      )}
      {post.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateFAQSchema(post.faqs)),
          }}
        />
      )}

      <article className="mx-auto max-w-4xl px-4 sm:px-6 py-8 lg:py-12">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          {post.category && (
            <>
              <span className="text-border">/</span>
              <Link
                href={`/${post.category.slug}`}
                className="transition-colors hover:text-primary"
              >
                {post.category.name}
              </Link>
            </>
          )}
          <span className="text-border">/</span>
          <span className="font-medium text-foreground/80 line-clamp-1">{post.titleEn}</span>
        </nav>

        {/* Title */}
        <PostTitle
          titleEn={post.titleEn}
          titleHi={post.titleHi}
          as="h1"
          className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl leading-tight"
        />

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
          {post.organization && (
            <span className="font-semibold text-foreground">{post.organization}</span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readingTime || 3} min read
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {post.views} views
          </span>
          <span>{formatDate(post.createdAt)}</span>
        </div>

        <AdSlot slotKey="in_article_1" className="my-6" />

        {/* Quick Info Table */}
        <section className="my-8 overflow-hidden rounded-xl border border-border/60 shadow-[var(--shadow-card)]">
          <div className="bg-primary/8 px-5 py-3 dark:bg-primary/15">
            <h2 className="text-sm font-bold text-primary">Quick Information</h2>
          </div>
          <div className="divide-y divide-border/60">
            {post.organization && (
              <InfoRow
                icon={<Users className="h-4 w-4" />}
                label="Organization"
                value={post.organization}
              />
            )}
            {post.totalPosts && (
              <InfoRow
                icon={<Users className="h-4 w-4" />}
                label="Total Vacancies"
                value={post.totalPosts}
              />
            )}
            {post.qualification && (
              <InfoRow
                icon={<GraduationCap className="h-4 w-4" />}
                label="Qualification"
                value={post.qualification}
              />
            )}
            {post.ageLimit && <InfoRow label="Age Limit" value={post.ageLimit} />}
            {post.salary && (
              <InfoRow
                icon={<IndianRupee className="h-4 w-4" />}
                label="Salary"
                value={post.salary}
              />
            )}
            {post.lastDate && (
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Last Date"
                value={formatDate(post.lastDate)}
                highlight
              />
            )}
            {post.examDate && (
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Exam Date"
                value={formatDate(post.examDate)}
              />
            )}
            {post.state && (
              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label="Location"
                value={post.state.name}
              />
            )}
          </div>
        </section>

        {/* Salary Calculator (Render if salary is mentioned) */}
        {post.salary && (
          <section className="my-6">
            <SalaryCalculator initialLevel={initialPayLevel} />
          </section>
        )}

        {/* Fee Details */}
        {(post.feeGeneral || post.feeObc || post.feeScSt || post.feeWomen) && (
          <section className="my-6 overflow-hidden rounded-lg border border-border">
            <div className="bg-primary/5 px-4 py-2">
              <h2 className="text-sm font-bold text-primary">Application Fee</h2>
            </div>
            <div className="divide-y divide-border">
              {post.feeGeneral && <InfoRow label="General / OBC" value={`₹${post.feeGeneral}`} />}
              {post.feeObc && <InfoRow label="OBC" value={`₹${post.feeObc}`} />}
              {post.feeScSt && <InfoRow label="SC / ST" value={`₹${post.feeScSt}`} />}
              {post.feeWomen && <InfoRow label="Women" value={`₹${post.feeWomen}`} />}
            </div>
          </section>
        )}

        {/* Important Dates */}
        {post.importantDates.length > 0 && (
          <section className="my-6 overflow-hidden rounded-lg border border-border">
            <div className="bg-primary/5 px-4 py-2">
              <h2 className="text-sm font-bold text-primary">Important Dates</h2>
            </div>
            <div className="divide-y divide-border">
              {post.importantDates.map((d) => (
                <InfoRow key={d.id} label={d.labelEn} value={d.date} />
              ))}
            </div>
          </section>
        )}

        <AdSlot slotKey="in_article_2" className="my-6" />

        {/* Content */}
        {post.contentEn && (
          <div
            className="prose prose-sm max-w-none dark:prose-invert mt-6"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.contentEn) }}
          />
        )}

        <AdSlot slotKey="in_article_3" className="my-6" />

        {/* Important Links */}
        <section className="my-6 overflow-hidden rounded-lg border border-border">
          <div className="bg-primary/5 px-4 py-2">
            <h2 className="text-sm font-bold text-primary">Important Links</h2>
          </div>
          <div className="divide-y divide-border">
            {post.applyLink && (
              <LinkRow label="Apply Online" href={`/go/${post.slug}?type=apply`} highlight />
            )}
            {post.officialLink && (
              <LinkRow label="Official Website" href={post.officialLink} external />
            )}
            {post.notificationLink && (
              <LinkRow label="Official Notification" href={post.notificationLink} external />
            )}
            {post.admitCardLink && (
              <LinkRow label="Download Admit Card" href={post.admitCardLink} external />
            )}
            {post.answerKeyLink && (
              <LinkRow label="Answer Key" href={post.answerKeyLink} external />
            )}
            {post.syllabusLink && <LinkRow label="Syllabus" href={post.syllabusLink} external />}
          </div>
        </section>

        <AdSlot slotKey="before_apply_btn" className="my-6" />

        {/* Apply CTA */}
        {post.applyLink && (
          <div className="my-8 text-center">
            <Link
              href={`/go/${post.slug}?type=apply`}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-10 py-4 text-lg font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
            >
              Apply Now →
            </Link>
          </div>
        )}

        {/* Interactive Syllabus */}
        {post.syllabusData && (
          <section className="my-10">
            <InteractiveSyllabus
              postId={post.id}
              syllabus={post.syllabusData as unknown as SyllabusSection[]}
              initialCompletedTopics={initialCompletedTopics}
            />
          </section>
        )}

        {/* FAQ */}
        {post.faqs.length > 0 && (
          <section className="my-10">
            <h2 className="mb-5 text-xl font-bold text-foreground">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {post.faqs.map((faq) => (
                <details
                  key={faq.id}
                  className="group rounded-xl border border-border/60 bg-card shadow-[var(--shadow-card)] open:shadow-[var(--shadow-md)]"
                >
                  <summary className="cursor-pointer px-5 py-3.5 font-medium text-foreground transition-colors hover:text-primary">
                    {faq.questionEn}
                  </summary>
                  <div className="border-t border-border/60 px-5 py-4 text-sm leading-relaxed text-muted">
                    {faq.answerEn}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Share & Actions */}
        <div className="my-6 flex flex-wrap items-center gap-3">
          <ShareButtons title={post.titleEn} slug={post.slug} />
          <TrackApplicationButton postId={post.id} initialTracked={isTracked} />
          <CopyJobDetails
            title={post.titleEn}
            organization={post.organization}
            qualification={post.qualification}
            lastDate={post.lastDate ? formatDate(post.lastDate) : null}
            salary={post.salary}
            applyLink={post.applyLink}
            url={`https://naukari360.in/post/${post.slug}`}
          />
          <PrintButton />
          {post.readingTime && <ReadingTime minutes={post.readingTime} />}
          {post.lastDate && (
            <AddToCalendar
              title={`${post.titleEn} - Last Date`}
              date={new Date(post.lastDate)}
              description={`Last date to apply for ${post.titleEn}`}
              url={`https://naukari360.in/post/${post.slug}`}
            />
          )}
          <AskOnWhatsApp jobTitle={post.titleEn} />
        </div>

        {/* Affiliate Recommendations */}
        {affiliateLinks.length > 0 && (
          <section className="my-8 rounded-lg border border-border p-4">
            <h3 className="mb-3 text-sm font-bold text-foreground">Recommended Resources</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {affiliateLinks.slice(0, 4).map((link) => (
                <a
                  key={link.id}
                  href={link.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center gap-2 rounded-md border border-border p-2 text-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="line-clamp-1">{link.name}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        <AdSlot slotKey="in_article_4" className="my-6" />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="my-8">
            <h2 className="mb-4 text-xl font-bold text-foreground">Related Posts</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedPosts.map((p) => (
                <PostCard key={p.id} post={p as PostCardData} />
              ))}
            </div>
          </section>
        )}

        <InlineNewsletterForm />
        
        {/* Discussion Forum */}
        <CommentsSection postId={post.id} />
      </article>
    </>
  );
}

function InfoRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center px-5 py-3">
      <span className="flex items-center gap-2 text-sm text-muted min-w-[140px] sm:min-w-[160px]">
        {icon && <span className="text-muted/60">{icon}</span>}
        {label}
      </span>
      <span
        className={`text-sm font-semibold ${highlight ? "text-red-600 dark:text-red-400" : "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}

function LinkRow({
  label,
  href,
  external,
  highlight,
}: {
  label: string;
  href: string;
  external?: boolean;
  highlight?: boolean;
}) {
  const Comp = external ? "a" : Link;
  const extraProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <span className="text-sm text-muted">{label}</span>
      <Comp
        href={href}
        {...extraProps}
        className={`flex items-center gap-1 text-sm font-medium ${highlight ? "text-primary" : "text-blue-600 dark:text-blue-400"} hover:underline`}
      >
        {highlight ? "Apply Now" : "Click Here"} <ExternalLink className="h-3 w-3" />
      </Comp>
    </div>
  );
}
