import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import AskOnWhatsApp from "@/components/public/AskOnWhatsApp";

describe("AskOnWhatsApp", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the button", () => {
    render(<AskOnWhatsApp jobTitle="SSC CGL 2026" />);
    expect(screen.getByText("Ask on WhatsApp")).toBeInTheDocument();
  });

  it("generates WhatsApp URL with job title in message", () => {
    render(<AskOnWhatsApp jobTitle="Railway Group D" />);
    const link = screen.getByLabelText("Ask on WhatsApp");
    const href = link.getAttribute("href")!;
    expect(href).toContain("wa.me/917042825899");
    expect(href).toContain("Railway%20Group%20D");
  });

  it("uses custom phone number", () => {
    render(<AskOnWhatsApp jobTitle="Test" phoneNumber="919876543210" />);
    const link = screen.getByLabelText("Ask on WhatsApp");
    expect(link.getAttribute("href")).toContain("wa.me/919876543210");
  });

  it("opens in new tab", () => {
    render(<AskOnWhatsApp jobTitle="Test" />);
    const link = screen.getByLabelText("Ask on WhatsApp");
    expect(link).toHaveAttribute("target", "_blank");
  });
});
