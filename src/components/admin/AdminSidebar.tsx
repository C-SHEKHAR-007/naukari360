"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  MapPin,
  Megaphone,
  Settings,
  Mail,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Image,
  Bell,
  FileCode,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/states", label: "States", icon: MapPin },
  { href: "/admin/menus", label: "Nav Menus", icon: Menu },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/announcements", label: "Announcements", icon: Bell },
  { href: "/admin/pages", label: "Pages", icon: FileCode },
  { href: "/admin/ads", label: "Ad Slots", icon: Megaphone },
  { href: "/admin/subscribers", label: "Subscribers", icon: Users },
  { href: "/admin/contact-inbox", label: "Contact Inbox", icon: Mail },
  { href: "/admin/site-settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  user?: { name?: string | null; email?: string | null };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-0 flex h-screen flex-col border-r border-border bg-card transition-all duration-200 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link href="/admin" className="flex items-baseline">
            <span className="text-lg font-bold text-primary">Naukari</span>
            <span className="text-lg font-bold text-secondary dark:text-blue-400">360</span>
            <span className="ml-1.5 text-[10px] font-semibold text-muted">Admin</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1.5 text-muted hover:bg-surface hover:text-foreground"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-surface hover:text-foreground"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-3">
        {!collapsed && (
          <div className="mb-2 px-3">
            <p className="truncate text-sm font-medium text-foreground">{user?.name || "Admin"}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
