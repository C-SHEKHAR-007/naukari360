import { prisma } from "@/lib/prisma";
import ContactInboxList from "@/components/admin/ContactInboxList";
import PageHeader from "@/components/admin/PageHeader";

export default async function AdminContactInboxPage() {
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unread = submissions.filter((s) => !s.isRead).length;

  return (
    <>
      <PageHeader
        title="Contact Inbox"
        description={
          <>
            {submissions.length} messages • {unread} unread
          </>
        }
      />
      <ContactInboxList submissions={submissions} />
    </>
  );
}
