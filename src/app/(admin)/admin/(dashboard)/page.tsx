import Link from "next/link";
import { FileText, Eye, Users, Mail, Plus, FolderOpen, Megaphone, Settings } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getStats() {
  const [totalPosts, published, drafts, subscribers, contactUnread] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "published" } }),
    prisma.post.count({ where: { status: "draft" } }),
    prisma.emailSubscriber.count({ where: { isActive: true } }),
    prisma.contactSubmission.count({ where: { isRead: false } }),
  ]);
  return { totalPosts, published, drafts, subscribers, contactUnread };
}

async function getRecentPosts() {
  return prisma.post.findMany({
    select: { id: true, titleEn: true, slug: true, status: true, createdAt: true, views: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

export default async function AdminDashboardPage() {
  const [stats, recentPosts] = await Promise.all([getStats(), getRecentPosts()]);

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Overview of your site</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Posts"
          value={stats.totalPosts}
          icon={FileText}
          href="/admin/posts"
        />
        <StatCard
          label="Published"
          value={stats.published}
          icon={Eye}
          href="/admin/posts"
          color="text-emerald-600"
        />
        <StatCard
          label="Subscribers"
          value={stats.subscribers}
          icon={Users}
          href="/admin/subscribers"
          color="text-blue-600"
        />
        <StatCard
          label="Unread Messages"
          value={stats.contactUnread}
          icon={Mail}
          href="/admin/contact-inbox"
          color="text-amber-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "New Post", href: "/admin/posts/new", icon: Plus },
          { label: "Categories", href: "/admin/categories", icon: FolderOpen },
          { label: "Ad Slots", href: "/admin/ads", icon: Megaphone },
          { label: "Settings", href: "/admin/site-settings", icon: Settings },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center gap-2 rounded-lg border border-border bg-card p-4 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:shadow-sm"
          >
            <action.icon className="h-4 w-4 text-primary" />
            {action.label}
          </Link>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Posts</h2>
          <Link href="/admin/posts" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted">Title</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted sm:table-cell">
                  Status
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted md:table-cell">
                  Views
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentPosts.map((post) => (
                <tr key={post.id} className="hover:bg-surface/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="font-medium text-foreground hover:text-primary line-clamp-1"
                    >
                      {post.titleEn}
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="hidden px-4 py-3 text-muted md:table-cell">{post.views}</td>
                  <td className="px-4 py-3 text-muted">
                    {post.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </td>
                </tr>
              ))}
              {recentPosts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted">
                    No posts yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  href,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  href: string;
  color?: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{label}</p>
        <Icon className={`h-5 w-5 ${color || "text-muted"}`} />
      </div>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
    draft: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
    archived: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || styles.draft}`}
    >
      {status}
    </span>
  );
}
