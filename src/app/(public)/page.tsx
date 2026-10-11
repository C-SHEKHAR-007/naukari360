import Link from "next/link";
import {
  Briefcase,
  FileText,
  CreditCard,
  BookOpen,
  GraduationCap,
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import CategorySection from "@/components/public/CategorySection";
import PostCard from "@/components/public/PostCard";
import AdSlot from "@/components/public/AdSlot";
import BilingualText from "@/components/public/BilingualText";
import { getPostsByCategory, getClosingSoonPosts, getTrendingPosts } from "@/lib/db";
import { generateWebSiteSchema, generateOrganizationSchema } from "@/lib/seo";
import PersonalizedFeed from "@/components/public/PersonalizedFeed";
import { IconTile, SectionHeader, type Tone } from "@/components/ui";

const categories = [
  {
    href: "/latest-jobs",
    label: "Latest Jobs",
    labelHi: "नवीनतम नौकरी",
    slug: "latest-jobs",
    icon: Briefcase,
    tone: "primary",
  },
  {
    href: "/results",
    label: "Results",
    labelHi: "रिजल्ट",
    slug: "results",
    icon: FileText,
    tone: "success",
  },
  {
    href: "/admit-card",
    label: "Admit Card",
    labelHi: "एडमिट कार्ड",
    slug: "admit-card",
    icon: CreditCard,
    tone: "info",
  },
  {
    href: "/answer-key",
    label: "Answer Key",
    labelHi: "आंसर की",
    slug: "answer-key",
    icon: ClipboardList,
    tone: "highlight",
  },
  {
    href: "/admission",
    label: "Admission",
    labelHi: "एडमिशन",
    slug: "admission",
    icon: GraduationCap,
    tone: "warning",
  },
  {
    href: "/syllabus",
    label: "Syllabus",
    labelHi: "सिलेबस",
    slug: "syllabus",
    icon: BookOpen,
    tone: "notice",
  },
] satisfies { tone: Tone; [key: string]: unknown }[];

export const revalidate = 300; // ISR: revalidate every 5 minutes

export default async function HomePage() {
  const [closingSoon, trending, categoryPosts] = await Promise.all([
    getClosingSoonPosts(6),
    getTrendingPosts(6),
    Promise.all(categories.map((cat) => getPostsByCategory(cat.slug, 6))),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 lg:py-12">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebSiteSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }}
      />

      {/* Hero Section */}
      <section className="relative mb-12 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/8 via-card/70 to-info/8 px-6 py-12 text-center shadow-sm backdrop-blur-sm">
        <div
          aria-hidden="true"
          className="bg-dots pointer-events-none absolute inset-0 text-primary [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        />
        <div className="relative mx-auto max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            <span className="text-primary">Naukari</span>
            <span className="text-secondary">360</span>
          </h1>
          <p className="mt-4 text-lg font-semibold text-foreground/90">सरकारी नौकरी अपडेट 360°</p>
          <BilingualText
            en="Your one-stop destination for latest government jobs, exam results, admit cards & notifications"
            hi="सरकारी नौकरी, परीक्षा परिणाम, एडमिट कार्ड और सूचनाओं के लिए आपका एकमात्र ठिकाना"
            as="p"
            className="mt-2 text-sm text-muted sm:text-base"
          />
        </div>
      </section>

      {/* Categories Grid */}
      <section className="mb-12">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="card-hover group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary/40 hover:shadow-md"
            >
              <IconTile tone={cat.tone} ring className="rounded-xl p-3">
                <cat.icon className="h-5 w-5" />
              </IconTile>
              <div className="text-center">
                <BilingualText
                  en={cat.label}
                  hi={cat.labelHi}
                  as="p"
                  className="text-sm font-semibold text-foreground group-hover:text-primary"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <AdSlot slotKey="header_banner" className="mb-10" />

      {/* Personalized Feed (client-side so this page stays cached) */}
      <PersonalizedFeed />

      {/* Closing Soon */}
      {closingSoon.length > 0 && (
        <section className="mb-12">
          <SectionHeader
            tone="danger"
            icon={<AlertTriangle className="h-4 w-4" />}
            title={
              <BilingualText
                en="Closing Soon"
                hi="जल्दी बंद होने वाले"
                as="h2"
                className="text-lg font-bold text-foreground sm:text-xl"
              />
            }
            subtitle={
              <BilingualText
                en="Apply before deadline expires"
                hi="अंतिम तिथि से पहले आवेदन करें"
                as="p"
                className="text-xs text-muted"
              />
            }
            action={
              <Link
                href="/latest-jobs"
                className="hidden items-center gap-1 rounded-lg bg-danger-subtle px-3 py-1.5 text-sm font-semibold text-danger-emphasis transition-all hover:bg-danger-emphasis/10 sm:flex"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {closingSoon.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      <AdSlot slotKey="between_sections" className="mb-10" />

      {/* Trending */}
      {trending.length > 0 && (
        <section className="mb-12">
          <SectionHeader
            tone="highlight"
            icon={<TrendingUp className="h-4 w-4" />}
            title={
              <BilingualText
                en="Trending Now"
                hi="अभी ट्रेंडिंग"
                as="h2"
                className="text-lg font-bold text-foreground sm:text-xl"
              />
            }
            subtitle={
              <BilingualText
                en="Most viewed posts this week"
                hi="इस सप्ताह सबसे अधिक देखी गई पोस्ट"
                as="p"
                className="text-xs text-muted"
              />
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Category Sections */}
      {categories.map((cat, i) => (
        <div key={cat.slug}>
          <CategorySection
            title={cat.label}
            titleHi={cat.labelHi}
            href={cat.href}
            posts={categoryPosts[i]}
          />
          {i === 2 && <AdSlot slotKey="in_feed_1" className="mb-10" />}
        </div>
      ))}

      <AdSlot slotKey="footer_banner" className="mt-10" />
    </div>
  );
}
