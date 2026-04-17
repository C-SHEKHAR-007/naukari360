import { prisma } from "@/lib/prisma";
import NotificationComposer from "@/components/admin/NotificationComposer";

export default async function AdminNotificationsPage() {
  const notifications = await prisma.notification.findMany({
    orderBy: { sentAt: "desc" },
    take: 50,
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Push Notifications</h1>
        <p className="mt-1 text-sm text-muted">
          Compose and send push notifications to subscribers
        </p>
      </div>
      <NotificationComposer notifications={JSON.parse(JSON.stringify(notifications))} />
    </>
  );
}
