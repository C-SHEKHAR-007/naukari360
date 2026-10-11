import { prisma } from "@/lib/prisma";
import CategoriesManager from "@/components/admin/CategoriesManager";
import PageHeader from "@/components/admin/PageHeader";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <>
      <PageHeader title="Categories" description="Manage post categories" />
      <CategoriesManager categories={categories} />
    </>
  );
}
