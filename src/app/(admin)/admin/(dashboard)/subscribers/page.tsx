import { prisma } from "@/lib/prisma";
import { Download } from "lucide-react";

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.emailSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  const active = subscribers.filter((s) => s.isActive).length;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Subscribers</h1>
          <p className="mt-1 text-sm text-muted">
            {subscribers.length} total • {active} active
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/admin/subscribers/export"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface"
        >
          <Download className="h-4 w-4" /> Export CSV
        </a>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted">Email</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted sm:table-cell">
                Name
              </th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted md:table-cell">
                Source
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted lg:table-cell">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {subscribers.map((sub) => (
              <tr key={sub.id} className="hover:bg-surface/50">
                <td className="px-4 py-3 font-medium text-foreground">{sub.email}</td>
                <td className="hidden px-4 py-3 text-muted sm:table-cell">{sub.name || "—"}</td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <span className="rounded bg-surface px-2 py-0.5 text-xs text-muted">
                    {sub.source}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${sub.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
                  >
                    {sub.isActive ? "Active" : "Unsubscribed"}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-xs text-muted lg:table-cell">
                  {new Date(sub.subscribedAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted">
                  No subscribers yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
