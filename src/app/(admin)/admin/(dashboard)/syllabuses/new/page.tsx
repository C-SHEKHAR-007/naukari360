import { prisma } from "@/lib/prisma";
import SyllabusForm from "@/components/admin/SyllabusForm";

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">New Syllabus</h1>
        <p className="mt-1 text-sm text-muted">Create a new syllabus document with an interactive progress tracker.</p>
      </div>

      <SyllabusForm posts={posts} />
    </>
  );
}
