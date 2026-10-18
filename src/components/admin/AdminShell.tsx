"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ExternalLink, LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import ThemeToggle from "@/components/public/ThemeToggle";
import { Badge, Tooltip } from "@/components/ui";
import { cn } from "@/lib/utils";
import { AdminLogo, AdminWordmark } from "./AdminBrand";
import { ADMIN_NAV, findNavItem, initials, isActive, type AdminNavItem } from "./nav";
import {
  COLLAPSE_THRESHOLD,
  SIDEBAR,
  clampWidth,
  saveSidebarPrefs,
  type SidebarPrefs,
} from "./sidebar-prefs";

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

const iconButton =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground";

function NavEntry({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: AdminNavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? item.label : undefined}
      className={cn(
        "flex items-center rounded-lg text-sm transition-all duration-150",
        collapsed ? "h-9 w-9 justify-center" : "w-full gap-3 px-2.5 py-2",
        active
          ? "bg-primary-subtle font-semibold text-primary-emphasis shadow-sm"
          : "font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <item.icon
        className={cn(
          "h-[18px] w-[18px] shrink-0",
          active && "drop-shadow-[0_0_6px_color-mix(in_srgb,var(--color-brand)_60%,transparent)]"
        )}
      />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
  return collapsed ? <Tooltip label={item.label}>{link}</Tooltip> : link;
}

function SidebarContent({
  user,
  role,
  collapsed,
  onToggle,
  onClose,
  onNavigate,
}: {
  user?: AdminUser;
  role: Role;
  collapsed: boolean;
  /** Collapse/expand (desktop) */
  onToggle?: () => void;
  /** Close the mobile drawer */
  onClose?: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="@container flex h-full min-h-0 flex-col">
      {/* Logo + collapse toggle. Collapsed: the logo turns into the expand button
          while the pointer is over the sidebar (or the button has focus). */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center gap-2.5",
          collapsed ? "justify-center" : "px-4"
        )}
      >
        {collapsed && onToggle ? (
          <Tooltip label="Expand sidebar">
            <button
              type="button"
              onClick={onToggle}
              aria-label="Expand sidebar"
              className="group/toggle relative inline-flex h-8 w-8 items-center justify-center rounded-lg"
            >
              <span className="absolute inset-0 transition-all duration-200 group-hover/sidebar:scale-75 group-hover/sidebar:opacity-0 group-focus-visible/toggle:scale-75 group-focus-visible/toggle:opacity-0">
                <AdminLogo />
              </span>
              <span className="absolute inset-0 inline-flex scale-75 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all duration-200 hover:bg-accent hover:text-foreground group-hover/sidebar:scale-100 group-hover/sidebar:opacity-100 group-focus-visible/toggle:scale-100 group-focus-visible/toggle:opacity-100">
                <PanelLeftOpen className="h-[18px] w-[18px]" />
              </span>
            </button>
          </Tooltip>
        ) : (
          <AdminLogo />
        )}
        {!collapsed && (
          <Link
            href="/admin"
            onClick={onNavigate}
            className="flex min-w-0 items-center gap-2 rounded-md"
          >
            <AdminWordmark className="shrink-0" />
            <span className="hidden rounded-md bg-primary-subtle px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-emphasis @[16rem]:inline">
              Admin
            </span>
          </Link>
        )}
        {!collapsed && onToggle && (
          <Tooltip label="Collapse sidebar" side="bottom" className="ml-auto">
            <button
              type="button"
              onClick={onToggle}
              aria-label="Collapse sidebar"
              className={iconButton}
            >
              <PanelLeftClose className="h-[18px] w-[18px]" />
            </button>
          </Tooltip>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className={cn(iconButton, "ml-auto")}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav
        aria-label="Admin"
        className={cn("flex-1 overflow-y-auto overflow-x-hidden pb-3 pt-1", !collapsed && "px-3")}
      >
        {ADMIN_NAV.map((group, i) => (
          <div key={group.label} className="mt-4 first:mt-0">
            {collapsed ? (
              i > 0 && <div className="mx-auto mb-3 h-px w-6 bg-border" />
            ) : (
              <p className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                {group.label}
              </p>
            )}
            <ul className={cn("grid gap-0.5", collapsed && "justify-items-center gap-1.5")}>
              {group.items.map((item) => (
                <li key={item.href}>
                  <NavEntry
                    item={item}
                    active={isActive(pathname, item.href)}
                    collapsed={collapsed}
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className={cn("shrink-0 border-t border-border py-3", collapsed ? "px-0" : "px-3")}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <Tooltip label={user?.name || "Admin"}>
              <Avatar user={user} className="h-9 w-9 text-xs" />
            </Tooltip>
            <Tooltip label="Logout">
              <button
                type="button"
                onClick={logout}
                aria-label="Logout"
                className={cn(
                  iconButton,
                  "h-9 w-9 text-danger-emphasis hover:bg-danger-subtle hover:text-danger-emphasis"
                )}
              >
                <LogOut className="h-[18px] w-[18px]" />
              </button>
            </Tooltip>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-surface/60 p-2">
            <Avatar user={user} className="h-9 w-9 text-xs" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {user?.name || "Admin"}
              </p>
              <Badge tone={role === "super_admin" ? "primary" : "info"} className="mt-0.5">
                {ROLE_LABEL[role]}
              </Badge>
            </div>
            <Tooltip label="Logout">
              <button
                type="button"
                onClick={logout}
                aria-label="Logout"
                className={cn(
                  iconButton,
                  "text-danger-emphasis hover:bg-danger-subtle hover:text-danger-emphasis"
                )}
              >
                <LogOut className="h-[18px] w-[18px]" />
              </button>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}

// Desktop sidebar: collapses to icons, and its right edge can be dragged to resize
// (drag far enough left to collapse; double-click to reset the width).
function DesktopSidebar({
  user,
  role,
  initial,
}: {
  user?: AdminUser;
  role: Role;
  initial: SidebarPrefs;
}) {
  const [prefs, setPrefs] = useState(initial);
  const [dragging, setDragging] = useState(false);
  // Read by the drag handlers, which outlive the render they were created in
  const latest = useRef(prefs);

  const update = (next: SidebarPrefs, persist = true) => {
    latest.current = next;
    setPrefs(next);
    if (persist) saveSidebarPrefs(next);
  };

  const toggle = () => update({ ...prefs, collapsed: !prefs.collapsed });

  const startResize = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = prefs.collapsed ? SIDEBAR.collapsed : prefs.width;
    setDragging(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMove = (ev: PointerEvent) => {
      const w = startWidth + ev.clientX - startX;
      const cur = latest.current;
      update(
        w < COLLAPSE_THRESHOLD
          ? { ...cur, collapsed: true }
          : { collapsed: false, width: clampWidth(w) },
        false
      );
    };
    const onUp = () => {
      setDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      saveSidebarPrefs(latest.current);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <aside
      style={{ width: prefs.collapsed ? SIDEBAR.collapsed : prefs.width }}
      className={cn(
        "group/sidebar sticky top-0 z-40 hidden h-screen shrink-0 flex-col border-r border-border bg-card/80 backdrop-blur lg:flex",
        !dragging && "transition-[width] duration-200"
      )}
    >
      <SidebarContent user={user} role={role} collapsed={prefs.collapsed} onToggle={toggle} />

      <div
        aria-hidden="true"
        onPointerDown={startResize}
        onDoubleClick={() => update({ collapsed: false, width: SIDEBAR.default })}
        title="Drag to resize · double-click to reset"
        className={cn(
          "absolute -right-1.5 bottom-0 top-0 z-20 flex w-3 cursor-col-resize select-none items-center justify-center transition-colors hover:bg-primary/10",
          dragging && "bg-primary/15"
        )}
      >
        <span
          className={cn(
            "h-8 w-1 rounded-full bg-border/40 transition-all duration-150 group-hover/sidebar:bg-border",
            dragging && "h-16 bg-primary! shadow-sm shadow-primary/40"
          )}
        />
      </div>
    </aside>
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
  sidebar = { collapsed: false, width: SIDEBAR.default },
  children,
}: {
  user?: AdminUser;
  role: Role;
  /** Saved desktop sidebar state, read from cookies by the layout */
  sidebar?: SidebarPrefs;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
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
      <DesktopSidebar user={user} role={role} initial={sidebar} />

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Admin navigation"
        >
          <div className="absolute inset-0 bg-overlay" onClick={() => setDrawerOpen(false)} />
          <aside className="animate-drawer-in absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col border-r border-border bg-card shadow-lg">
            <SidebarContent
              user={user}
              role={role}
              collapsed={false}
              onClose={() => setDrawerOpen(false)}
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
