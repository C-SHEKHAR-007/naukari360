import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/public/Footer";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe("Footer", () => {
  const mockSettings = {
    site_name: "Naukari360",
    tagline: "Your 360° Government Jobs Portal",
    telegram_url: "https://t.me/naukari360",
    footer_text: "© 2025 Naukari360. All rights reserved.",
  };

  it("renders site name from settings", () => {
    render(<Footer settings={mockSettings} />);
    expect(screen.getByText("Naukari")).toBeInTheDocument();
    expect(screen.getByText("360")).toBeInTheDocument();
  });

  it("renders tagline from settings", () => {
    render(<Footer settings={mockSettings} />);
    const taglines = screen.getAllByText("Your 360° Government Jobs Portal");
    expect(taglines.length).toBeGreaterThanOrEqual(1);
  });

  it("renders footer text from settings", () => {
    const { container } = render(<Footer settings={mockSettings} />);
    expect(container.textContent).toContain("© 2025 Naukari360. All rights reserved.");
  });

  it("renders telegram link when provided", () => {
    const { container } = render(<Footer settings={mockSettings} />);
    const telegramLinks = container.querySelectorAll('a[href="https://t.me/naukari360"]');
    expect(telegramLinks.length).toBeGreaterThanOrEqual(1);
    expect(telegramLinks[0].textContent).toContain("Join Telegram Channel");
  });

  it("hides telegram link when URL is empty", () => {
    const { container } = render(<Footer settings={{ ...mockSettings, telegram_url: "" }} />);
    const telegramLinks = container.querySelectorAll('a[href*="t.me"]');
    expect(telegramLinks.length).toBe(0);
  });

  it("renders category links", () => {
    render(<Footer settings={mockSettings} />);
    const latestJobs = screen.getAllByText("Latest Jobs");
    expect(latestJobs.length).toBeGreaterThanOrEqual(1);
    const results = screen.getAllByText("Results");
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it("renders qualification links", () => {
    const { container } = render(<Footer settings={mockSettings} />);
    expect(container.textContent).toContain("10th Pass Jobs");
    expect(container.textContent).toContain("12th Pass Jobs");
    expect(container.textContent).toContain("Graduate Jobs");
  });

  it("renders quick links", () => {
    const { container } = render(<Footer settings={mockSettings} />);
    expect(container.textContent).toContain("About Us");
    expect(container.textContent).toContain("Contact Us");
    expect(container.textContent).toContain("Privacy Policy");
    expect(container.textContent).toContain("Disclaimer");
  });

  it("renders custom footer text", () => {
    render(
      <Footer settings={{ ...mockSettings, footer_text: "Custom Copyright 2026" }} />
    );
    expect(screen.getByText("Custom Copyright 2026")).toBeInTheDocument();
  });
});
