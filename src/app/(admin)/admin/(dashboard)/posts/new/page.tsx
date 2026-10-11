import { prisma } from "@/lib/prisma";
import PostForm from "@/components/admin/PostForm";
import PageHeader from "@/components/admin/PageHeader";

export default async function NewPostPage() {
  const [categories, states] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } }),
    prisma.state.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <PageHeader title="New Post" description="Create a new post" />
      <PostForm post={null} categories={categories} states={states} />
    </>
  );
}
