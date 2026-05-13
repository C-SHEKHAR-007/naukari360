"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

type AdminRole = "super_admin" | "editor";

const AdminRoleContext = createContext<AdminRole>("editor");

export function AdminRoleProvider({ role, children }: { role: AdminRole; children: ReactNode }) {
  return <AdminRoleContext.Provider value={role}>{children}</AdminRoleContext.Provider>;
}

export function useAdminRole() {
  return useContext(AdminRoleContext);
}

export function useIsSuperAdmin() {
  return useContext(AdminRoleContext) === "super_admin";
}
