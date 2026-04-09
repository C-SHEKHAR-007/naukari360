import { prisma } from "@/lib/prisma";
import StatesManager from "@/components/admin/StatesManager";

export default async function AdminStatesPage() {
  const states = await prisma.state.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">States</h1>
        <p className="mt-1 text-sm text-muted">Manage state listings for job filtering</p>
      </div>
      <StatesManager states={states} />
    </>
  );
}
