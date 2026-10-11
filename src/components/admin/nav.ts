import {
  BarChart3,
  Bell,
  BookOpen,
  DollarSign,
  FileCode,
  FileText,
  FolderOpen,
  Image,
  LayoutDashboard,
  Link2,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  Palette,
  Send,
  Settings,
  Timer,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/posts", label: "Posts", icon: FileText },
      { href: "/admin/syllabuses", label: "Syllabuses", icon: BookOpen },
      { href: "/admin/categories", label: "Categories", icon: FolderOpen },
      { href: "/admin/states", label: "States", icon: MapPin },
      { href: "/admin/pages", label: "Pages", icon: FileCode },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/menus", label: "Nav Menus", icon: Menu },
      { href: "/admin/banners", label: "Banners", icon: Image },
      { href: "/admin/announcements", label: "Announcements", icon: Bell },
    ],
  },
  {
    label: "Engagement",
    items: [
      { href: "/admin/notifications", label: "Notifications", icon: Send },
      { href: "/admin/subscribers", label: "Subscribers", icon: Users },
      { href: "/admin/contact-inbox", label: "Contact Inbox", icon: Mail },
    ],
  },
  {
    label: "Monetization",
    items: [
      { href: "/admin/ads", label: "Ad Slots", icon: Megaphone },
      { href: "/admin/affiliate-links", label: "Affiliate Links", icon: Link2 },
      { href: "/admin/monetization", label: "Monetization", icon: DollarSign },
      { href: "/admin/interstitial", label: "Interstitial", icon: Timer },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/site-settings", label: "Settings", icon: Settings },
      { href: "/admin/styleguide", label: "Style Guide", icon: Palette },
    ],
  },
];

export function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/admin" && pathname.startsWith(href + "/"));
}

/** The nav item (and its group) for the current page, used for the top bar title */
export function findNavItem(pathname: string) {
  for (const group of ADMIN_NAV) {
    for (const item of group.items) {
      if (isActive(pathname, item.href)) return { group, item };
    }
  }
  return null;
}

export function initials(name?: string | null, email?: string | null) {
  const source = (name || email || "A").trim();
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "A") + (parts[1]?.[0] ?? "")).toUpperCase();
}
