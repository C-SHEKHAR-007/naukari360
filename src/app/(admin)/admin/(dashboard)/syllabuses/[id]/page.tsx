import { prisma } from "@/lib/prisma";
import SyllabusForm from "@/components/admin/SyllabusForm";
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Edit Syllabus</h1>
        <p className="mt-1 text-sm text-muted">Update the syllabus document and interactive progress tracker.</p>
      </div>

      <SyllabusForm initialData={syllabus} posts={posts} />
    </>
  );
}
