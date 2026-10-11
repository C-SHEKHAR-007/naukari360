import { prisma } from "@/lib/prisma";
import InterstitialManager from "@/components/admin/InterstitialManager";
import PageHeader from "@/components/admin/PageHeader";

export default async function AdminInterstitialPage() {
  const configs = await prisma.interstitialPage.findMany({
    orderBy: { title: "asc" },
  });

  return (
    <>
      <PageHeader
        title="Interstitial Settings"
        description="Configure interstitial ad pages shown before external redirects"
      />
      <InterstitialManager configs={JSON.parse(JSON.stringify(configs))} />
    </>
  );
}
