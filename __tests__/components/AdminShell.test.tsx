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

  it("collapses the desktop sidebar to icons", () => {
    render(
      <AdminShell user={user} role="super_admin">
        <p />
      </AdminShell>
    );
    fireEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    const sidebar = screen.getByRole("navigation", { name: "Admin" });
    expect(within(sidebar).queryByText("Posts")).not.toBeInTheDocument();
    expect(within(sidebar).getAllByRole("link")[0]).toHaveAttribute("title", "Dashboard");
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
