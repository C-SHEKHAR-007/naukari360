import { prisma } from "@/lib/prisma";
import StatesManager from "@/components/admin/StatesManager";
import PageHeader from "@/components/admin/PageHeader";

export default async function AdminStatesPage() {
  const states = await prisma.state.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <>
      <PageHeader title="States" description="Manage state listings for job filtering" />
      <StatesManager states={states} />
    </>
  );
}
