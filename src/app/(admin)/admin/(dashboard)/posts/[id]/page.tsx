import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import PageHeader from "@/components/admin/PageHeader";

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
      <PageHeader title="Edit Post" description="Update post details" />
      <PostForm post={post} categories={categories} states={states} />
    </>
  );
}
