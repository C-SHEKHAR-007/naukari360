import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AdminRoleProvider } from "@/components/admin/AdminRoleProvider";

const mockFetch = vi.fn();
global.fetch = mockFetch;

import AffiliateLinksManager from "@/components/admin/AffiliateLinksManager";

const mockLinks = [
  {
    id: "link-1",
    name: "SSC Book",
    originalUrl: "https://amzn.to/ssc-book",
    slug: "ssc-book",
    clicks: 42,
    isActive: true,
    displayInPosts: true,
    categoryId: "cat-1",
    category: { id: "cat-1", name: "Latest Jobs" },
    createdAt: "2026-04-10T00:00:00.000Z",
  },
  {
    id: "link-2",
    name: "Study Guide",
    originalUrl: "https://amzn.to/study",
    slug: "study-guide",
    clicks: 5,
    isActive: false,
    displayInPosts: false,
    categoryId: null,
    category: null,
    createdAt: "2026-04-12T00:00:00.000Z",
  },
];

const mockCategories = [
  { id: "cat-1", name: "Latest Jobs" },
  { id: "cat-2", name: "Results" },
];

describe("AffiliateLinksManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all affiliate links", () => {
    render(<AffiliateLinksManager links={mockLinks} categories={mockCategories} />);
    expect(screen.getByText("SSC Book")).toBeInTheDocument();
    expect(screen.getByText("Study Guide")).toBeInTheDocument();
  });

  it("shows click counts", () => {
    const { container } = render(
      <AffiliateLinksManager links={mockLinks} categories={mockCategories} />
    );
    const clickCells = container.querySelectorAll("td.text-center.font-mono");
    expect(clickCells[0]?.textContent).toBe("42");
    expect(clickCells[1]?.textContent).toBe("5");
  });

  it("shows category name", () => {
    const { container } = render(
      <AffiliateLinksManager links={mockLinks} categories={mockCategories} />
    );
    const rows = container.querySelectorAll("tbody tr");
    expect(rows[0]?.textContent).toContain("Latest Jobs");
  });

  it("shows add form when Add Link button is clicked", () => {
    render(<AffiliateLinksManager links={mockLinks} categories={mockCategories} />);
    const addBtn = screen.getAllByText("Add Link")[0];
    fireEvent.click(addBtn);
    expect(screen.getByPlaceholderText("Link name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Original URL (affiliate link)")).toBeInTheDocument();
  });

  it("creates new link on form submit", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "link-3",
        name: "New Link",
        originalUrl: "https://example.com",
        slug: "new-link",
        clicks: 0,
        isActive: true,
        displayInPosts: false,
        categoryId: null,
        category: null,
        createdAt: "2026-04-15T00:00:00.000Z",
      }),
    });

    render(<AffiliateLinksManager links={mockLinks} categories={mockCategories} />);
    fireEvent.click(screen.getAllByText("Add Link")[0]);

    fireEvent.change(screen.getByPlaceholderText("Link name"), { target: { value: "New Link" } });
    fireEvent.change(screen.getByPlaceholderText("Original URL (affiliate link)"), {
      target: { value: "https://example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Slug (e.g., best-book)"), {
      target: { value: "new-link" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/admin/affiliate-links",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("deletes link on confirm", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    vi.spyOn(window, "confirm").mockReturnValue(true);

    const { container } = render(
      <AdminRoleProvider role="super_admin">
        <AffiliateLinksManager links={mockLinks} categories={mockCategories} />
      </AdminRoleProvider>
    );

    // Find the first row's delete button (last button in the actions cell)
    const rows = container.querySelectorAll("tbody tr");
    const firstRowButtons = rows[0]?.querySelectorAll("button");
    if (firstRowButtons && firstRowButtons.length >= 2) {
      fireEvent.click(firstRowButtons[firstRowButtons.length - 1]);
    }

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/admin/affiliate-links/link-1", {
        method: "DELETE",
      });
    });
  });

  it("shows empty state when no links", () => {
    render(<AffiliateLinksManager links={[]} categories={mockCategories} />);
    expect(screen.getByText(/No affiliate links yet/)).toBeInTheDocument();
  });
});
