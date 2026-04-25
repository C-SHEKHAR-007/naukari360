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
import type { PostCardData } from "@/lib/db";

const categories = [
  {
    href: "/latest-jobs",
    label: "Latest Jobs",
    labelHi: "नवीनतम नौकरी",
    slug: "latest-jobs",
    icon: Briefcase,
    color: "bg-primary/10 text-primary ring-primary/20",
    darkColor: "dark:bg-primary/15 dark:ring-primary/30",
  },
  {
    href: "/results",
    label: "Results",
    labelHi: "रिजल्ट",
    slug: "results",
    icon: FileText,
    color: "bg-emerald-50 text-emerald-600 ring-emerald-200",
    darkColor: "dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800",
  },
  {
    href: "/admit-card",
    label: "Admit Card",
    labelHi: "एडमिट कार्ड",
    slug: "admit-card",
    icon: CreditCard,
    color: "bg-blue-50 text-blue-600 ring-blue-200",
    darkColor: "dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-800",
  },
  {
    href: "/answer-key",
    label: "Answer Key",
    labelHi: "आंसर की",
    slug: "answer-key",
    icon: ClipboardList,
    color: "bg-violet-50 text-violet-600 ring-violet-200",
    darkColor: "dark:bg-violet-900/20 dark:text-violet-400 dark:ring-violet-800",
  },
  {
    href: "/admission",
    label: "Admission",
    labelHi: "एडमिशन",
    slug: "admission",
    icon: GraduationCap,
    color: "bg-amber-50 text-amber-600 ring-amber-200",
    darkColor: "dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-800",
  },
  {
    href: "/syllabus",
    label: "Syllabus",
    labelHi: "सिलेबस",
    slug: "syllabus",
    icon: BookOpen,
    color: "bg-rose-50 text-rose-600 ring-rose-200",
    darkColor: "dark:bg-rose-900/20 dark:text-rose-400 dark:ring-rose-800",
  },
];

export const revalidate = 300; // ISR: revalidate every 5 minutes

export default async function HomePage() {
  const results = await Promise.all([
    getClosingSoonPosts(6),
    getTrendingPosts(6),
    ...categories.map((cat) => getPostsByCategory(cat.slug, 6)),
  ]);
  const closingSoon = results[0] as PostCardData[];
  const trending = results[1] as PostCardData[];
  const categoryPosts = results.slice(2) as PostCardData[][];

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
      <section className="relative mb-12 overflow-hidden rounded-2xl">
        <img
          src="/banner-hero.svg"
          alt="Naukari360 — सरकारी नौकरी अपडेट 360°"
          width={1200}
          height={400}
          className="hidden w-full dark:block"
        />
        <div className="block dark:hidden rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 px-6 py-12 text-center">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              <span className="text-primary">Naukari</span>
              <span className="text-secondary dark:text-blue-400">360</span>
            </h1>
            <p className="mt-4 text-lg font-semibold text-foreground/90">सरकारी नौकरी अपडेट 360°</p>
            <BilingualText
              en="Your one-stop destination for latest government jobs, exam results, admit cards & notifications"
              hi="सरकारी नौकरी, परीक्षा परिणाम, एडमिट कार्ड और सूचनाओं के लिए आपका एकमात्र ठिकाना"
              as="p"
              className="mt-2 text-sm text-muted sm:text-base"
            />
          </div>
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
              <div className={`rounded-xl p-3 ring-1 ${cat.color} ${cat.darkColor}`}>
                <cat.icon className="h-5 w-5" />
              </div>
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

      {/* Closing Soon */}
      {closingSoon.length > 0 && (
        <section className="mb-12">
          <div className="mb-5 flex items-center justify-between border-l-4 border-red-500 pl-4">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-red-50 p-2 dark:bg-red-900/20">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <BilingualText
                  en="Closing Soon"
                  hi="जल्दी बंद होने वाले"
                  as="h2"
                  className="text-lg font-bold text-foreground sm:text-xl"
                />
                <BilingualText
                  en="Apply before deadline expires"
                  hi="अंतिम तिथि से पहले आवेदन करें"
                  as="p"
                  className="text-xs text-muted"
                />
              </div>
            </div>
            <Link
              href="/latest-jobs"
              className="hidden items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 sm:flex"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
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
          <div className="mb-5 flex items-center justify-between border-l-4 border-violet-500 pl-4">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-violet-50 p-2 dark:bg-violet-900/20">
                <TrendingUp className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <BilingualText
                  en="Trending Now"
                  hi="अभी ट्रेंडिंग"
                  as="h2"
                  className="text-lg font-bold text-foreground sm:text-xl"
                />
                <BilingualText
                  en="Most viewed posts this week"
                  hi="इस सप्ताह सबसे अधिक देखी गई पोस्ट"
                  as="p"
                  className="text-xs text-muted"
                />
              </div>
            </div>
          </div>
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
