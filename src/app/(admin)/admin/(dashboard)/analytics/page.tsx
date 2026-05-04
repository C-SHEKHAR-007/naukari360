import { prisma } from "@/lib/prisma";
import { BarChart3, Eye, TrendingUp, Users, MousePointerClick } from "lucide-react";
import Link from "next/link";

async function getAnalyticsData() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [totalViews, topPosts, recentSubscribers, totalSubscribers, dailyViews, topAffiliates] =
    await Promise.all([
      prisma.post.aggregate({ _sum: { views: true } }),
      prisma.post.findMany({
        select: { id: true, titleEn: true, slug: true, views: true, createdAt: true },
        orderBy: { views: "desc" },
        take: 10,
      }),
      prisma.emailSubscriber.count({
        where: { subscribedAt: { gte: sevenDaysAgo }, isActive: true },
      }),
      prisma.emailSubscriber.count({ where: { isActive: true } }),
      prisma.pageView.groupBy({
        by: ["date"],
        _sum: { views: true },
        where: { date: { gte: thirtyDaysAgo } },
        orderBy: { date: "asc" },
      }),
      prisma.affiliateLink.findMany({
        select: { id: true, name: true, slug: true, clicks: true },
        orderBy: { clicks: "desc" },
        take: 5,
      }),
    ]);

  return {
    totalViews: totalViews._sum.views || 0,
    topPosts,
    recentSubscribers,
    totalSubscribers,
    dailyViews: dailyViews.map((d: { date: Date; _sum: { views: number | null } }) => ({
      date: d.date.toISOString().split("T")[0],
      views: d._sum.views || 0,
    })),
    topAffiliates,
  };
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-muted">Site performance overview (last 30 days)</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Views" value={data.totalViews.toLocaleString()} icon={Eye} />
        <StatCard
          label="Subscribers"
          value={data.totalSubscribers.toString()}
          icon={Users}
          subtitle={`+${data.recentSubscribers} this week`}
        />
        <StatCard
          label="Top Affiliates"
          value={data.topAffiliates
            .reduce((s: number, a: { clicks: number }) => s + a.clicks, 0)
            .toLocaleString()}
          icon={MousePointerClick}
          subtitle="total clicks"
        />
        <StatCard
          label="Avg Daily Views"
          value={
            data.dailyViews.length > 0
              ? Math.round(
                  data.dailyViews.reduce((s: number, d: { views: number }) => s + d.views, 0) /
                    data.dailyViews.length
                ).toLocaleString()
              : "0"
          }
          icon={TrendingUp}
          subtitle="last 30 days"
        />
      </div>

      {/* Daily Views Chart (simple bar representation) */}
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Daily Views (30 days)</h2>
        </div>
        {data.dailyViews.length > 0 ? (
          <div className="flex items-end gap-1" style={{ height: "160px" }}>
            {data.dailyViews.map((d: { date: string; views: number }) => {
              const max = Math.max(...data.dailyViews.map((v: { views: number }) => v.views));
              const height = max > 0 ? (d.views / max) * 100 : 0;
              return (
                <div
                  key={d.date}
                  className="group relative flex-1"
                  title={`${d.date}: ${d.views} views`}
                >
                  <div
                    className="w-full rounded-t bg-primary/80 transition-colors group-hover:bg-primary"
                    style={{ height: `${height}%`, minHeight: d.views > 0 ? "4px" : "0" }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted">
            No view data yet. Views will appear as visitors browse posts.
          </p>
        )}
      </div>

      {/* Top Posts */}
      <div className="mt-8 rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">Top Posts by Views</h2>
        </div>
        <div className="divide-y divide-border">
          {data.topPosts.map(
            (post: { id: string; titleEn: string; slug: string; views: number }, i: number) => (
              <div key={post.id} className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-xs font-bold text-muted">
                    {i + 1}
                  </span>
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="text-sm font-medium text-foreground hover:text-primary line-clamp-1"
                  >
                    {post.titleEn}
                  </Link>
                </div>
                <span className="flex items-center gap-1 text-sm text-muted">
                  <Eye className="h-3.5 w-3.5" /> {post.views.toLocaleString()}
                </span>
              </div>
            )
          )}
          {data.topPosts.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-muted">No posts yet</p>
          )}
        </div>
      </div>

      {/* Top Affiliate Links */}
      <div className="mt-8 rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Top Affiliate Links</h2>
            <Link href="/admin/affiliate-links" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
        </div>
        <div className="divide-y divide-border">
          {data.topAffiliates.map(
            (link: { id: string; name: string; slug: string; clicks: number }) => (
              <div key={link.id} className="flex items-center justify-between px-6 py-3">
                <span className="text-sm font-medium text-foreground">{link.name}</span>
                <span className="flex items-center gap-1 text-sm text-muted">
                  <MousePointerClick className="h-3.5 w-3.5" /> {link.clicks} clicks
                </span>
              </div>
            )
          )}
          {data.topAffiliates.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-muted">No affiliate links yet</p>
          )}
        </div>
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  subtitle,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  subtitle?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{label}</p>
        <Icon className="h-5 w-5 text-muted" />
      </div>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}
    </div>
  );
}
