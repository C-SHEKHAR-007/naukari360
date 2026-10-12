"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ChevronsLeft, ChevronsRight, ExternalLink, LogOut, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/public/ThemeToggle";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ADMIN_NAV, findNavItem, initials, isActive } from "./nav";

type AdminUser = { name?: string | null; email?: string | null };
type Role = "super_admin" | "editor";

const ROLE_LABEL: Record<Role, string> = { super_admin: "Super admin", editor: "Editor" };

function Avatar({ user, className }: { user?: AdminUser; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-primary font-bold text-primary-foreground",
        className
      )}
    >
      {initials(user?.name, user?.email)}
    </span>
  );
}

function logout() {
  signOut({ callbackUrl: "/admin/login" });
}

function SidebarContent({
  user,
  role,
  collapsed,
  onNavigate,
}: {
  user?: AdminUser;
  role: Role;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn("flex h-16 items-center gap-2.5 px-4", collapsed && "justify-center px-0")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/favicon.svg" alt="" className="h-8 w-8" />
        {!collapsed && (
          <Link href="/admin" onClick={onNavigate} className="flex items-baseline">
            <span className="text-lg font-extrabold tracking-tight text-primary">Naukari</span>
            <span className="text-lg font-extrabold tracking-tight text-secondary">360</span>
            <span className="ml-2 rounded-md bg-primary-subtle px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-emphasis">
              Admin
            </span>
          </Link>
        )}
      </div>

      <nav aria-label="Admin" className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {ADMIN_NAV.map((group) => (
          <div key={group.label}>
            {collapsed ? (
              <div className="mx-auto mb-2 h-px w-6 bg-border" />
            ) : (
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        collapsed && "justify-center px-0",
                        active
                          ? "bg-primary-subtle text-primary-emphasis"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                      )}
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl p-2",
            collapsed && "justify-center p-0"
          )}
        >
          <Avatar user={user} className="h-9 w-9 text-xs" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {user?.name || "Admin"}
              </p>
              <Badge tone={role === "super_admin" ? "primary" : "info"} className="mt-0.5">
                {ROLE_LABEL[role]}
              </Badge>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={logout}
          title={collapsed ? "Logout" : undefined}
          className={cn(
            "mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-danger-emphasis transition-colors hover:bg-danger-subtle",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );
}

function UserMenu({ user, role }: { user?: AdminUser; role: Role }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        className="rounded-full ring-offset-2 ring-offset-background transition-shadow hover:ring-2 hover:ring-primary/30"
      >
        <Avatar user={user} className="h-9 w-9 text-xs" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
        >
          <div className="border-b border-border p-4">
            <p className="truncate text-sm font-semibold text-foreground">
              {user?.name || "Admin"}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            <Badge tone={role === "super_admin" ? "primary" : "info"} className="mt-2">
              {ROLE_LABEL[role]}
            </Badge>
          </div>
          <div className="p-1.5">
            <Link
              role="menuitem"
              href="/"
              target="_blank"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground" /> View site
            </Link>
            <button
              role="menuitem"
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-danger-emphasis hover:bg-danger-subtle"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminShell({
  user,
  role,
  children,
}: {
  user?: AdminUser;
  role: Role;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const current = findNavItem(pathname);

  // Close the drawer on Escape and lock page scroll while it is open
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200 lg:flex",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        <SidebarContent user={user} role={role} collapsed={collapsed} />
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:text-foreground"
        >
          {collapsed ? (
            <ChevronsRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronsLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Admin navigation"
        >
          <div className="absolute inset-0 bg-overlay" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col border-r border-border bg-card shadow-lg">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent
              user={user}
              role={role}
              collapsed={false}
              onNavigate={() => setDrawerOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* Soft brand band behind the page header */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-info/5 to-transparent" />
          <div className="bg-dots absolute inset-0 text-primary opacity-60 [mask-image:linear-gradient(180deg,black,transparent)]" />
        </div>

        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-card/70 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
            className="-ml-1 rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            {current && (
              <p className="truncate text-sm text-muted-foreground">
                <span className="hidden sm:inline">{current.group.label} / </span>
                <span className="font-semibold text-foreground">{current.item.label}</span>
              </p>
            )}
          </div>

          <Link
            href="/"
            target="_blank"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground sm:inline-flex"
          >
            <ExternalLink className="h-4 w-4" /> View site
          </Link>
          <ThemeToggle />
          <UserMenu user={user} role={role} />
        </header>

        <main className="relative flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
