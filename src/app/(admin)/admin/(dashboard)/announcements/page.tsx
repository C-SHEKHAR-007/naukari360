import { prisma } from "@/lib/prisma";
import AnnouncementsManager from "@/components/admin/AnnouncementsManager";
import PageHeader from "@/components/admin/PageHeader";

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({ orderBy: { displayOrder: "asc" } });

  return (
    <div>
      <PageHeader
        title="Announcements"
        description="Manage scrolling ticker announcements on the public site."
      />
      <AnnouncementsManager initialAnnouncements={announcements} />
    </div>
  );
}
