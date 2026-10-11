import { prisma } from "@/lib/prisma";
import SyllabusForm from "@/components/admin/SyllabusForm";
import PageHeader from "@/components/admin/PageHeader";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Syllabus | Admin Dashboard",
};

interface Props {
  params: {
    id: string;
  };
}

export default async function EditSyllabusPage({ params }: Props) {
  const resolvedParams = await params;

  const [syllabus, posts] = await Promise.all([
    prisma.syllabus.findUnique({
      where: { id: resolvedParams.id },
    }),
    prisma.post.findMany({
      select: { id: true, titleEn: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!syllabus) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Edit Syllabus"
        description="Update the syllabus document and interactive progress tracker."
      />

      <SyllabusForm initialData={syllabus} posts={posts} />
    </>
  );
}
