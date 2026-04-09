import { prisma } from "@/lib/prisma";
import CategoriesManager from "@/components/admin/CategoriesManager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Categories</h1>
        <p className="mt-1 text-sm text-muted">Manage post categories</p>
      </div>
      <CategoriesManager categories={categories} />
    </>
  );
}
