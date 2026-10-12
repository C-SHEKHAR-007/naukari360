import { prisma } from "@/lib/prisma";
import AffiliateLinksManager from "@/components/admin/AffiliateLinksManager";
import PageHeader from "@/components/admin/PageHeader";

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
      <PageHeader
        title="Affiliate Links"
        description="Manage affiliate/referral links for monetization"
      />
      <AffiliateLinksManager
        links={JSON.parse(JSON.stringify(links))}
        categories={JSON.parse(JSON.stringify(categories))}
      />
    </>
  );
}
