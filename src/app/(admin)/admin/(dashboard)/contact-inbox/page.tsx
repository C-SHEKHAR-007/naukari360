import { prisma } from "@/lib/prisma";
import ContactInboxList from "@/components/admin/ContactInboxList";

export default async function AdminContactInboxPage() {
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unread = submissions.filter((s) => !s.isRead).length;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Contact Inbox</h1>
        <p className="mt-1 text-sm text-muted">
          {submissions.length} messages • {unread} unread
        </p>
      </div>
      <ContactInboxList submissions={submissions} />
    </>
  );
}
