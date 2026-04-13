import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ShareButtons from "@/components/public/ShareButtons";

describe("ShareButtons", () => {
  const props = { title: "SSC CGL 2025 Notification", slug: "ssc-cgl-2025" };

  it("renders WhatsApp share link", () => {
    render(<ShareButtons {...props} />);
    const links = screen.getAllByText("WhatsApp");
    expect(links[0]).toBeInTheDocument();
    expect(links[0].getAttribute("href")).toContain("whatsapp.com");
  });

  it("renders Telegram share link", () => {
    render(<ShareButtons {...props} />);
    const links = screen.getAllByText("Telegram");
    expect(links[0]).toBeInTheDocument();
    expect(links[0].getAttribute("href")).toContain("t.me");
  });

  it("renders X (Twitter) share link", () => {
    render(<ShareButtons {...props} />);
    const links = screen.getAllByText("X");
    expect(links[0]).toBeInTheDocument();
    expect(links[0].getAttribute("href")).toContain("twitter.com");
  });

  it("has a copy button", () => {
    render(<ShareButtons {...props} />);
    const btns = screen.getAllByRole("button");
    expect(btns.length).toBeGreaterThan(0);
  });

  it("share links contain the slug in URL", () => {
    render(<ShareButtons {...props} />);
    const links = screen.getAllByText("WhatsApp");
    expect(links[0].getAttribute("href")).toContain("ssc-cgl-2025");
  });

  it("renders Share label", () => {
    render(<ShareButtons {...props} />);
    const labels = screen.getAllByText("Share:");
    expect(labels[0]).toBeInTheDocument();
  });
});
