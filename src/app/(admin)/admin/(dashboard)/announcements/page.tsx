import { prisma } from "@/lib/prisma";
import AnnouncementsManager from "@/components/admin/AnnouncementsManager";

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({ orderBy: { displayOrder: "asc" } });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
        <p className="text-sm text-muted mt-1">
          Manage scrolling ticker announcements on the public site.
        </p>
      </div>
      <AnnouncementsManager initialAnnouncements={announcements} />
    </div>
  );
}
