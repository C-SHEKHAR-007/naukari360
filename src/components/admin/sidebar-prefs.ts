// Desktop sidebar size, remembered in cookies so the server renders it at the
// right width (no flash after hydration). Shared by the layout and AdminShell.

export const SIDEBAR = { collapsed: 64, default: 248, min: 200, max: 360 } as const;

/** Dragging the edge narrower than this collapses the sidebar */
export const COLLAPSE_THRESHOLD = 140;

export const SIDEBAR_COLLAPSED_COOKIE = "admin-sidebar-collapsed";
export const SIDEBAR_WIDTH_COOKIE = "admin-sidebar-width";

export interface SidebarPrefs {
  collapsed: boolean;
  width: number;
}

export function clampWidth(width: number) {
  return Math.round(Math.min(Math.max(width, SIDEBAR.min), SIDEBAR.max));
}

export function parseSidebarPrefs(collapsed?: string, width?: string): SidebarPrefs {
  const n = Number(width);
  return {
    collapsed: collapsed === "true",
    width: Number.isFinite(n) && n > 0 ? clampWidth(n) : SIDEBAR.default,
  };
}

export function saveSidebarPrefs({ collapsed, width }: SidebarPrefs) {
  const opts = "; path=/admin; max-age=31536000; samesite=lax";
  document.cookie = `${SIDEBAR_COLLAPSED_COOKIE}=${collapsed}${opts}`;
  document.cookie = `${SIDEBAR_WIDTH_COOKIE}=${width}${opts}`;
}
