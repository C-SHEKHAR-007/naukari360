import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClientAdminSidebar from "@/components/admin/ClientAdminSidebar";
import { AdminRoleProvider } from "@/components/admin/AdminRoleProvider";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const role =
    (session.user as unknown as { role?: string }).role === "super_admin"
      ? "super_admin"
      : "editor";

  return (
    <div className="flex min-h-screen bg-background">
      <ClientAdminSidebar user={session.user} />
      <main className="flex-1 overflow-y-auto">
        <AdminRoleProvider role={role as "super_admin" | "editor"}>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </AdminRoleProvider>
      </main>
    </div>
  );
}
