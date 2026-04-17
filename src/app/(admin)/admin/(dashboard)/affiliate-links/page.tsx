import { prisma } from "@/lib/prisma";
import AffiliateLinksManager from "@/components/admin/AffiliateLinksManager";

export default async function AdminAffiliateLinksPage() {
  const [links, categories] = await Promise.all([
    prisma.affiliateLink.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Affiliate Links</h1>
        <p className="mt-1 text-sm text-muted">Manage affiliate/referral links for monetization</p>
      </div>
      <AffiliateLinksManager
        links={JSON.parse(JSON.stringify(links))}
        categories={JSON.parse(JSON.stringify(categories))}
      />
    </>
  );
}
