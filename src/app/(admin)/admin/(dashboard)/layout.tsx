import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { AdminRoleProvider } from "@/components/admin/AdminRoleProvider";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const role =
    (session.user as unknown as { role?: string }).role === "super_admin"
      ? "super_admin"
      : "editor";

  return (
    <AdminRoleProvider role={role}>
      <AdminShell user={{ name: session.user?.name, email: session.user?.email }} role={role}>
        {children}
      </AdminShell>
    </AdminRoleProvider>
  );
}
