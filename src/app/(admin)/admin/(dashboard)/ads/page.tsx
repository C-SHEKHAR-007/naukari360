import { prisma } from "@/lib/prisma";
import AdSlotsManager from "@/components/admin/AdSlotsManager";

export default async function AdminAdSlotsPage() {
  const adSlots = await prisma.adSlot.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Ad Slots</h1>
        <p className="mt-1 text-sm text-muted">Manage advertisement placements</p>
      </div>
      <AdSlotsManager adSlots={adSlots} />
    </>
  );
}
