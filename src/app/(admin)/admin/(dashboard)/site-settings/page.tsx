import { prisma } from "@/lib/prisma";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";
import PageHeader from "@/components/admin/PageHeader";

export default async function AdminSiteSettingsPage() {
  const settings = await prisma.siteSetting.findMany();
  const settingsMap: Record<string, string> = {};
  for (const s of settings) {
    settingsMap[s.key] = s.value;
  }

  return (
    <>
      <PageHeader title="Site Settings" description="Configure global site settings" />
      <SiteSettingsForm settings={settingsMap} />
    </>
  );
}
