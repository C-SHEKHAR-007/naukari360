import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { AdminRoleProvider } from "@/components/admin/AdminRoleProvider";
import {
  SIDEBAR_COLLAPSED_COOKIE,
  SIDEBAR_WIDTH_COOKIE,
  parseSidebarPrefs,
} from "@/components/admin/sidebar-prefs";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const role =
    (session.user as unknown as { role?: string }).role === "super_admin"
      ? "super_admin"
      : "editor";

  const cookieStore = await cookies();
  const sidebar = parseSidebarPrefs(
    cookieStore.get(SIDEBAR_COLLAPSED_COOKIE)?.value,
    cookieStore.get(SIDEBAR_WIDTH_COOKIE)?.value
  );

  return (
    <AdminRoleProvider role={role}>
      <AdminShell
        user={{ name: session.user?.name, email: session.user?.email }}
        role={role}
        sidebar={sidebar}
      >
        {children}
      </AdminShell>
    </AdminRoleProvider>
  );
}
