import { prisma } from "@/lib/prisma";
import SiteSettingsForm from "@/components/admin/SiteSettingsForm";

export default async function AdminSiteSettingsPage() {
  const settings = await prisma.siteSetting.findMany();
  const settingsMap: Record<string, string> = {};
  for (const s of settings) {
    settingsMap[s.key] = s.value;
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
        <p className="mt-1 text-sm text-muted">Configure global site settings</p>
      </div>
      <SiteSettingsForm settings={settingsMap} />
    </>
  );
}
