import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import MobileBottomNav from "@/components/public/MobileBottomNav";

afterEach(() => {
  cleanup();
});

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("@/components/providers/LanguageProvider", () => ({
  useLanguage: () => ({ t: (en: string, hi: string) => en }),
}));

describe("MobileBottomNav Component", () => {
  it("renders all navigation items correctly", () => {
    render(<MobileBottomNav />);

    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /saved/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /profile/i })).toBeInTheDocument();
  });

  it("applies active styles to the current path", () => {
    render(<MobileBottomNav />);
    
    // Home should be active based on usePathname mock ("/")
    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toHaveClass("text-primary");
    
    const searchLink = screen.getByRole("link", { name: /search/i });
    expect(searchLink).toHaveClass("text-muted");
  });
});
