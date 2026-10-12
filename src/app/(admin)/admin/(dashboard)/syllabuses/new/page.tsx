import { prisma } from "@/lib/prisma";
import SyllabusForm from "@/components/admin/SyllabusForm";
import PageHeader from "@/components/admin/PageHeader";

export const metadata = {
  title: "Create Syllabus | Admin Dashboard",
};

export default async function NewSyllabusPage() {
  const posts = await prisma.post.findMany({
    select: { id: true, titleEn: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader
        title="New Syllabus"
        description="Create a new syllabus document with an interactive progress tracker."
      />

      <SyllabusForm posts={posts} />
    </>
  );
}
