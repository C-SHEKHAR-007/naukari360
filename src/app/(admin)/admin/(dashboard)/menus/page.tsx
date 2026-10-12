import { prisma } from "@/lib/prisma";
import MenuManager from "@/components/admin/MenuManager";
import PageHeader from "@/components/admin/PageHeader";

export default async function MenusPage() {
  const menus = await prisma.navMenu.findMany({
    where: { parentId: null },
    orderBy: { displayOrder: "asc" },
    include: { children: { orderBy: { displayOrder: "asc" } } },
  });

  return (
    <div>
      <PageHeader
        title="Nav Menu Builder"
        description="Manage navigation links shown on the public site header."
      />
      <MenuManager initialMenus={menus} />
    </div>
  );
}
