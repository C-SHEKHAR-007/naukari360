import { prisma } from "@/lib/prisma";
import MenuManager from "@/components/admin/MenuManager";

export default async function MenusPage() {
  const menus = await prisma.navMenu.findMany({
    where: { parentId: null },
    orderBy: { displayOrder: "asc" },
    include: { children: { orderBy: { displayOrder: "asc" } } },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Nav Menu Builder</h1>
        <p className="text-sm text-muted mt-1">
          Manage navigation links shown on the public site header.
        </p>
      </div>
      <MenuManager initialMenus={menus} />
    </div>
  );
}
