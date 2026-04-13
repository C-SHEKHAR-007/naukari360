import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "@/components/public/Header";

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}));

// Mock language provider
vi.mock("@/components/providers/LanguageProvider", () => ({
  useLanguage: () => ({
    t: (en: string) => en,
    language: "en",
    setLanguage: vi.fn(),
  }),
}));

// Mock LanguageToggle
vi.mock("@/components/public/LanguageToggle", () => ({
  default: () => <button data-testid="lang-toggle">EN</button>,
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe("Header", () => {
  const mockSettings = {
    site_name: "Naukari360",
    announcement_active: "true",
    announcement_text: "Welcome to Naukari360!",
  };

  it("renders site name from settings", () => {
    render(<Header settings={mockSettings} />);
    expect(screen.getByText("Naukari")).toBeInTheDocument();
    expect(screen.getByText("360")).toBeInTheDocument();
  });

  it("renders announcement bar when active", () => {
    const { container } = render(<Header settings={mockSettings} />);
    expect(container.textContent).toContain("Welcome to Naukari360!");
  });

  it("hides announcement when inactive", () => {
    const { container } = render(
      <Header settings={{ ...mockSettings, announcement_active: "false" }} />
    );
    expect(container.textContent).not.toContain("Welcome to Naukari360!");
  });

  it("renders navigation links", () => {
    render(<Header settings={mockSettings} />);
    // Desktop nav has all links, mobile may too - use getAllByText
    const latestJobs = screen.getAllByText("Latest Jobs");
    expect(latestJobs.length).toBeGreaterThanOrEqual(1);
    const results = screen.getAllByText("Results");
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it("renders search link", () => {
    const { container } = render(<Header settings={mockSettings} />);
    const searchLinks = container.querySelectorAll('[aria-label="Search"]');
    expect(searchLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("renders dark mode toggle", () => {
    const { container } = render(<Header settings={mockSettings} />);
    const toggles = container.querySelectorAll('[aria-label="Toggle dark mode"]');
    expect(toggles.length).toBeGreaterThanOrEqual(1);
  });

  it("renders language toggle", () => {
    render(<Header settings={mockSettings} />);
    expect(screen.getAllByTestId("lang-toggle").length).toBeGreaterThanOrEqual(1);
  });

  it("handles custom site name", () => {
    render(<Header settings={{ ...mockSettings, site_name: "GovJobs" }} />);
    expect(screen.getByText("GovJobs")).toBeInTheDocument();
  });
});
