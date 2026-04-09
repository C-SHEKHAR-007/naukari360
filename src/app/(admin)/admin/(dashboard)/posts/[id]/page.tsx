import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;

  const [post, categories, states] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: {
        importantDates: true,
        faqs: true,
        postTags: { include: { tag: true } },
      },
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } }),
    prisma.state.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  if (!post) notFound();

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Edit Post</h1>
        <p className="mt-1 text-sm text-muted">Update post details</p>
      </div>
      <PostForm post={post} categories={categories} states={states} />
    </>
  );
}
