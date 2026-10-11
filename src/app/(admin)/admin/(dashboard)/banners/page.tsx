import { prisma } from "@/lib/prisma";
import BannersManager from "@/components/admin/BannersManager";
import PageHeader from "@/components/admin/PageHeader";

export default async function BannersPage() {
  const banners = await prisma.banner.findMany({ orderBy: { displayOrder: "asc" } });

  return (
    <div>
      <PageHeader title="Banners" description="Manage homepage banners and promotional images." />
      <BannersManager initialBanners={banners} />
    </div>
  );
}
