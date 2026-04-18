import { prisma } from "@/lib/prisma";
import InterstitialManager from "@/components/admin/InterstitialManager";

export default async function AdminInterstitialPage() {
  const configs = await prisma.interstitialPage.findMany({
    orderBy: { title: "asc" },
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Interstitial Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Configure interstitial ad pages shown before external redirects
        </p>
      </div>
      <InterstitialManager configs={JSON.parse(JSON.stringify(configs))} />
    </>
  );
}
