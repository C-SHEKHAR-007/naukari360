import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Plus, Edit } from "lucide-react";
import { formatDate } from "@/lib/utils";
import DeleteSyllabusButton from "@/components/admin/DeleteSyllabusButton";
import PageHeader from "@/components/admin/PageHeader";
import AdminSearch from "@/components/admin/AdminSearch";

export const metadata = {
  title: "Manage Syllabuses | Admin Dashboard",
};

interface Props {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function AdminSyllabusesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const query = params.q || "";
  const perPage = 15;

  const where: Record<string, unknown> = {};
  if (query) {
    where.OR = [
      { titleEn: { contains: query, mode: "insensitive" } },
      { titleHi: { contains: query, mode: "insensitive" } },
      { post: { titleEn: { contains: query, mode: "insensitive" } } },
    ];
  }

  const [syllabuses, total] = await Promise.all([
    prisma.syllabus.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { post: true },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.syllabus.count({ where }),
  ]);
  const totalPages = Math.ceil(total / perPage);

  return (
    <>
      {/* Header */}
      <PageHeader
        title="Syllabuses"
        description={`${total} total syllabuses`}
        actions={
          <Link
            href="/admin/syllabuses/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4" />
            Add Syllabus
          </Link>
        }
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <AdminSearch placeholder="Search syllabuses..." />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface">
              <tr>
                <th className="px-4 py-3 font-medium text-muted sm:px-6">Title</th>
                <th className="hidden px-6 py-3 font-medium text-muted sm:table-cell">
                  Linked Post
                </th>
                <th className="hidden px-6 py-3 font-medium text-muted sm:table-cell">
                  Last Updated
                </th>
                <th className="px-4 py-3 font-medium text-muted text-right sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {syllabuses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground sm:px-6">
                    No syllabuses found. Create one to get started.
                  </td>
                </tr>
              ) : (
                syllabuses.map((syl) => (
                  <tr key={syl.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:flex">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="break-words font-medium text-foreground">{syl.titleEn}</p>
                          <p className="break-all text-xs text-muted-foreground">{syl.slug}</p>
                          {/* Phones: linked post + last updated shown here instead of columns */}
                          <p className="mt-1 text-xs text-muted-foreground sm:hidden">
                            {syl.post ? (
                              syl.post.titleEn
                            ) : (
                              <span className="text-warning-emphasis">Standalone</span>
                            )}
                            <span aria-hidden="true"> · </span>
                            <span className="whitespace-nowrap">{formatDate(syl.updatedAt)}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-6 py-4 text-muted-foreground sm:table-cell">
                      {syl.post ? (
                        syl.post.titleEn
                      ) : (
                        <span className="text-warning-emphasis">Standalone</span>
                      )}
                    </td>
                    <td className="hidden px-6 py-4 text-muted-foreground whitespace-nowrap sm:table-cell">
                      {formatDate(syl.updatedAt)}
                    </td>
                    <td className="px-2 py-4 text-right sm:px-6">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <Link
                          href={`/admin/syllabuses/${syl.id}`}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <DeleteSyllabusButton id={syl.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/syllabuses?page=${page - 1}${query ? `&q=${query}` : ""}`}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-surface"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/syllabuses?page=${page + 1}${query ? `&q=${query}` : ""}`}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-surface"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
