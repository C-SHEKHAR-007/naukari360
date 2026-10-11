import { prisma } from "@/lib/prisma";
import AdSlotsManager from "@/components/admin/AdSlotsManager";
import PageHeader from "@/components/admin/PageHeader";

export default async function AdminAdSlotsPage() {
  const adSlots = await prisma.adSlot.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <>
      <PageHeader title="Ad Slots" description="Manage advertisement placements" />
      <AdSlotsManager adSlots={adSlots} />
    </>
  );
}
