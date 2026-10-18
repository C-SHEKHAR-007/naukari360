import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, within } from "@testing-library/react";

const nav = vi.hoisted(() => ({ pathname: "/admin/posts" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));
vi.mock("next-auth/react", () => ({ signOut: vi.fn() }));
vi.mock("@/components/public/ThemeToggle", () => ({ default: () => <button>Theme</button> }));
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { signOut } from "next-auth/react";
import AdminShell from "@/components/admin/AdminShell";
import PageHeader from "@/components/admin/PageHeader";

const user = { name: "Super Admin", email: "admin@naukari360.in" };

describe("AdminShell", () => {
  beforeEach(() => {
    nav.pathname = "/admin/posts";
    vi.clearAllMocks();
  });
  afterEach(() => cleanup());

  it("marks the current page in the sidebar and shows it in the top bar", () => {
    render(
      <AdminShell user={user} role="super_admin">
        <p>content</p>
      </AdminShell>
    );
    const sidebar = screen.getByRole("navigation", { name: "Admin" });
    expect(within(sidebar).getByRole("link", { name: "Posts" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(within(sidebar).getByRole("link", { name: "Dashboard" })).not.toHaveAttribute(
      "aria-current"
    );
    expect(screen.getByRole("banner")).toHaveTextContent("Content / Posts");
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("shows the role and initials", () => {
    render(
      <AdminShell user={user} role="editor">
        <p />
      </AdminShell>
    );
    expect(screen.getAllByText("Editor").length).toBeGreaterThan(0);
    expect(screen.getAllByText("SA").length).toBeGreaterThan(0);
  });

  it("opens and closes the mobile drawer", () => {
    render(
      <AdminShell user={user} role="super_admin">
        <p />
      </AdminShell>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    const drawer = screen.getByRole("dialog", { name: "Admin navigation" });
    expect(within(drawer).getByRole("link", { name: "Settings" })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the drawer after navigating", () => {
    render(
      <AdminShell user={user} role="super_admin">
        <p />
      </AdminShell>
    );
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    const drawer = screen.getByRole("dialog");
    fireEvent.click(within(drawer).getByRole("link", { name: "Categories" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("collapses the desktop sidebar to icons and remembers it", () => {
    const setCookie = vi.spyOn(document, "cookie", "set");
    render(
      <AdminShell user={user} role="super_admin">
        <p />
      </AdminShell>
    );
    fireEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    const sidebar = screen.getByRole("navigation", { name: "Admin" });
    expect(within(sidebar).queryByText("Posts")).not.toBeInTheDocument();
    expect(within(sidebar).getAllByRole("link")[0]).toHaveAccessibleName("Dashboard");
    expect(setCookie).toHaveBeenCalledWith(
      expect.stringContaining("admin-sidebar-collapsed=true; path=/admin")
    );

    fireEvent.click(screen.getByRole("button", { name: "Expand sidebar" }));
    expect(within(sidebar).getByText("Posts")).toBeInTheDocument();
    expect(setCookie).toHaveBeenLastCalledWith(expect.stringContaining("admin-sidebar-width=248"));
    setCookie.mockRestore();
  });

  it("starts collapsed at the saved state and shows tooltips on hover", () => {
    render(
      <AdminShell user={user} role="super_admin" sidebar={{ collapsed: true, width: 300 }}>
        <p />
      </AdminShell>
    );
    const sidebar = screen.getByRole("navigation", { name: "Admin" });
    expect(sidebar.closest("aside")).toHaveStyle({ width: "64px" });
    fireEvent.mouseEnter(within(sidebar).getByRole("link", { name: "Analytics" }).parentElement!);
    expect(screen.getByRole("tooltip", { hidden: true })).toHaveTextContent("Analytics");
  });

  it("resets to the default width on double-clicking the edge", () => {
    const { container } = render(
      <AdminShell user={user} role="super_admin" sidebar={{ collapsed: false, width: 320 }}>
        <p />
      </AdminShell>
    );
    const aside = container.querySelector("aside")!;
    expect(aside).toHaveStyle({ width: "320px" });
    fireEvent.doubleClick(aside.querySelector("[title^='Drag to resize']")!);
    expect(aside).toHaveStyle({ width: "248px" });
  });

  it("signs out from the account menu", () => {
    render(
      <AdminShell user={user} role="super_admin">
        <p />
      </AdminShell>
    );
    fireEvent.click(screen.getByRole("button", { name: "Account menu" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Sign out" }));
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/admin/login" });
  });
});

describe("PageHeader", () => {
  afterEach(() => cleanup());

  it("renders title, description and actions with the section icon", () => {
    nav.pathname = "/admin/posts";
    const { container } = render(
      <PageHeader title="Posts" description="17 total posts" actions={<button>New Post</button>} />
    );
    expect(screen.getByRole("heading", { level: 1, name: "Posts" })).toBeInTheDocument();
    expect(screen.getByText("17 total posts")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New Post" })).toBeInTheDocument();
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("omits the icon for pages outside the nav", () => {
    nav.pathname = "/admin/somewhere";
    const { container } = render(<PageHeader title="Other" />);
    expect(container.querySelector("svg")).toBeNull();
  });
});
