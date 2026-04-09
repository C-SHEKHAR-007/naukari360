import { prisma } from "@/lib/prisma";
import PostForm from "@/components/admin/PostForm";

export default async function NewPostPage() {
  const [categories, states] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } }),
    prisma.state.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">New Post</h1>
        <p className="mt-1 text-sm text-muted">Create a new post</p>
      </div>
      <PostForm post={null} categories={categories} states={states} />
    </>
  );
}
