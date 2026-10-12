import { prisma } from "@/lib/prisma";
import NotificationComposer from "@/components/admin/NotificationComposer";
import PageHeader from "@/components/admin/PageHeader";

export default async function AdminNotificationsPage() {
  const notifications = await prisma.notification.findMany({
    orderBy: { sentAt: "desc" },
    take: 50,
  });

  return (
    <>
      <PageHeader
        title="Push Notifications"
        description="Compose and send push notifications to subscribers"
      />
      <NotificationComposer notifications={JSON.parse(JSON.stringify(notifications))} />
    </>
  );
}
