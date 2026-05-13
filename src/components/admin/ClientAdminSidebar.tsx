"use client";

import dynamic from "next/dynamic";

const AdminSidebar = dynamic(() => import("./AdminSidebar"), { ssr: false });

export default function ClientAdminSidebar({
  user,
}: {
  user?: { name?: string | null; email?: string | null };
}) {
  return <AdminSidebar user={user} />;
}
