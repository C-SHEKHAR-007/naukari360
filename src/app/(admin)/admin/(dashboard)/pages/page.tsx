import { prisma } from "@/lib/prisma";
import PagesManager from "@/components/admin/PagesManager";
import PageHeader from "@/components/admin/PageHeader";

export default async function PagesAdminPage() {
  const pages = await prisma.page.findMany({ orderBy: { slug: "asc" } });

  return (
    <div>
      <PageHeader
        title="Static Pages"
        description="Edit About, Contact, Privacy Policy, and Disclaimer pages."
      />
      <PagesManager initialPages={pages} />
    </div>
  );
}
