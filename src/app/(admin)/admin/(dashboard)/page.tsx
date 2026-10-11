import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ExternalLink,
  Eye,
  FileText,
  FolderOpen,
  Mail,
  Megaphone,
  Plus,
  Send,
  Settings,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Badge, Card, IconTile, buttonVariants, type Tone } from "@/components/ui";
import { cn } from "@/lib/utils";

async function getStats() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [totalPosts, published, drafts, subscribers, contactUnread, weekViews, allViews] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "published" } }),
      prisma.post.count({ where: { status: "draft" } }),
      prisma.emailSubscriber.count({ where: { isActive: true } }),
      prisma.contactSubmission.count({ where: { isRead: false } }),
      prisma.pageView.aggregate({ _sum: { views: true }, where: { date: { gte: weekAgo } } }),
      prisma.post.aggregate({ _sum: { views: true } }),
    ]);
  return {
    totalPosts,
    published,
    drafts,
    subscribers,
    contactUnread,
    weekViews: weekViews._sum.views ?? 0,
    allViews: allViews._sum.views ?? 0,
  };
}

async function getRecentPosts() {
  return prisma.post.findMany({
    select: { id: true, titleEn: true, slug: true, status: true, createdAt: true, views: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}

async function getTopPosts() {
  return prisma.post.findMany({
    where: { status: "published" },
    select: { id: true, titleEn: true, views: true },
    orderBy: { views: "desc" },
    take: 5,
  });
}

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "Asia/Kolkata",
    }).format(new Date())
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const nf = new Intl.NumberFormat("en-IN");

const QUICK_ACTIONS: { label: string; href: string; icon: LucideIcon; tone: Tone }[] = [
  { label: "New post", href: "/admin/posts/new", icon: Plus, tone: "primary" },
  { label: "Send notification", href: "/admin/notifications", icon: Send, tone: "info" },
  { label: "Categories", href: "/admin/categories", icon: FolderOpen, tone: "highlight" },
  { label: "Ad slots", href: "/admin/ads", icon: Megaphone, tone: "warning" },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3, tone: "success" },
  { label: "Settings", href: "/admin/site-settings", icon: Settings, tone: "neutral" },
];

export default async function AdminDashboardPage() {
  const [session, stats, recentPosts, topPosts] = await Promise.all([
    auth(),
    getStats(),
    getRecentPosts(),
    getTopPosts(),
  ]);
  const firstName = session?.user?.name?.split(" ")[0] || "Admin";

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-2xl bg-ink p-6 text-ink-foreground shadow-lg sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-info/30 blur-3xl" />
          <div className="bg-dots absolute inset-0 text-ink-foreground opacity-30 [mask-image:linear-gradient(90deg,transparent,black)]" />
        </div>
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-ink-foreground/70">Dashboard</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {greeting()}, {firstName} 👋
            </h1>
            <p className="mt-2 max-w-xl text-sm text-ink-foreground/75">
              {nf.format(stats.published)} live posts and {nf.format(stats.weekViews)} views in the
              last 7 days.
              {stats.drafts > 0 &&
                ` ${nf.format(stats.drafts)} drafts are waiting to be published.`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/posts/new" className={buttonVariants({ variant: "primary" })}>
              <Plus className="h-4 w-4" /> New Post
            </Link>
            <Link
              href="/"
              target="_blank"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "text-ink-foreground/85 ring-1 ring-ink-foreground/20 hover:bg-ink-foreground/10 hover:text-ink-foreground"
              )}
            >
              <ExternalLink className="h-4 w-4" /> View site
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Posts"
          value={stats.totalPosts}
          hint={`${nf.format(stats.published)} published · ${nf.format(stats.drafts)} drafts`}
          icon={FileText}
          tone="primary"
          href="/admin/posts"
        />
        <StatCard
          label="Views (7 days)"
          value={stats.weekViews}
          hint={`${nf.format(stats.allViews)} all time`}
          icon={Eye}
          tone="success"
          href="/admin/analytics"
        />
        <StatCard
          label="Subscribers"
          value={stats.subscribers}
          hint="Active newsletter subscribers"
          icon={Users}
          tone="info"
          href="/admin/subscribers"
        />
        <StatCard
          label="Unread Messages"
          value={stats.contactUnread}
          hint={stats.contactUnread ? "Waiting in the inbox" : "Inbox zero 🎉"}
          icon={Mail}
          tone="warning"
          href="/admin/contact-inbox"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent posts */}
        <Card className="overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold text-foreground">Recent Posts</h2>
            <Link
              href="/admin/posts"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-surface/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-2.5 text-left font-semibold">Title</th>
                <th className="hidden px-5 py-2.5 text-left font-semibold sm:table-cell">Status</th>
                <th className="hidden px-5 py-2.5 text-right font-semibold md:table-cell">Views</th>
                <th className="px-5 py-2.5 text-right font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentPosts.map((post) => (
                <tr key={post.id} className="transition-colors hover:bg-accent/60">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="line-clamp-1 font-medium text-foreground hover:text-primary"
                    >
                      {post.titleEn}
                    </Link>
                  </td>
                  <td className="hidden px-5 py-3 sm:table-cell">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="hidden px-5 py-3 text-right tabular-nums text-muted-foreground md:table-cell">
                    {nf.format(post.views)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right text-muted-foreground">
                    {post.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </td>
                </tr>
              ))}
              {recentPosts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">
                    No posts yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>

        <div className="space-y-6">
          {/* Quick actions */}
          <Card className="p-5">
            <h2 className="mb-4 font-semibold text-foreground">Quick actions</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex flex-col gap-2 rounded-xl border border-border p-3 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <IconTile tone={action.tone} className="h-8 w-8 p-0">
                    <action.icon className="h-4 w-4" />
                  </IconTile>
                  {action.label}
                </Link>
              ))}
            </div>
          </Card>

          {/* Top posts */}
          <Card className="p-5">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
              <TrendingUp className="h-4 w-4 text-success-emphasis" /> Top posts
            </h2>
            <ol className="space-y-3">
              {topPosts.map((post, i) => (
                <li key={post.id} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="line-clamp-1 flex-1 text-sm text-foreground hover:text-primary"
                  >
                    {post.titleEn}
                  </Link>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {nf.format(post.views)}
                  </span>
                </li>
              ))}
              {topPosts.length === 0 && (
                <li className="text-sm text-muted-foreground">No views yet</li>
              )}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone,
  href,
}: {
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  tone: Tone;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <IconTile tone={tone} ring>
          <Icon className="h-4 w-4" />
        </IconTile>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-foreground tabular-nums">
        {nf.format(value)}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tones: Record<string, Tone> = {
    published: "success",
    draft: "warning",
    archived: "neutral",
  };
  return <Badge tone={tones[status] ?? tones.draft}>{status}</Badge>;
}
