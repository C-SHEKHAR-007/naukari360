import { prisma } from "@/lib/prisma";
import PagesManager from "@/components/admin/PagesManager";

export default async function PagesAdminPage() {
  const pages = await prisma.page.findMany({ orderBy: { slug: "asc" } });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Static Pages</h1>
        <p className="text-sm text-muted mt-1">
          Edit About, Contact, Privacy Policy, and Disclaimer pages.
        </p>
      </div>
      <PagesManager initialPages={pages} />
    </div>
  );
}
