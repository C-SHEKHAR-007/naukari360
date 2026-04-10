import { prisma } from "@/lib/prisma";
import BannersManager from "@/components/admin/BannersManager";

export default async function BannersPage() {
  const banners = await prisma.banner.findMany({ orderBy: { displayOrder: "asc" } });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Banners</h1>
        <p className="text-sm text-muted mt-1">Manage homepage banners and promotional images.</p>
      </div>
      <BannersManager initialBanners={banners} />
    </div>
  );
}
