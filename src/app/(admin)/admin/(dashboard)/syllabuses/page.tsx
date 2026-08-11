import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, Plus, Edit } from "lucide-react";
import { formatDate } from "@/lib/utils";
import DeleteSyllabusButton from "@/components/admin/DeleteSyllabusButton";

export const metadata = {
  title: "Manage Syllabuses | Admin Dashboard",
};

export default async function AdminSyllabusesPage() {
  const syllabuses = await prisma.syllabus.findMany({
    orderBy: { createdAt: "desc" },
    include: { post: true },
  });

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Syllabuses</h1>
          <p className="mt-1 text-sm text-muted">{syllabuses.length} total syllabuses</p>
        </div>
        <Link
          href="/admin/syllabuses/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" />
          Add Syllabus
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Linked Post</th>
                <th className="px-6 py-4 font-medium">Last Updated</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {syllabuses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No syllabuses found. Create one to get started.
                  </td>
                </tr>
              ) : (
                syllabuses.map((syl) => (
                  <tr key={syl.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{syl.titleEn}</p>
                          <p className="text-xs text-muted-foreground">{syl.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {syl.post ? syl.post.titleEn : <span className="text-amber-500">Standalone</span>}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {formatDate(syl.updatedAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
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
    </>
  );
}
