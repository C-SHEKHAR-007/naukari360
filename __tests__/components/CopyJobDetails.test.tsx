import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import CopyJobDetails from "@/components/public/CopyJobDetails";

describe("CopyJobDetails", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    title: "SSC CGL 2025",
    organization: "Staff Selection Commission",
    qualification: "Graduate",
    lastDate: "30 Jun 2025",
    salary: "₹25,000 - ₹80,000",
    applyLink: "https://ssc.nic.in/apply",
    url: "https://naukari360.in/post/ssc-cgl-2025",
  };

  it("renders the Copy Info button", () => {
    render(<CopyJobDetails {...defaultProps} />);
    expect(screen.getByText("Copy Info")).toBeInTheDocument();
  });

  it("copies formatted text to clipboard on click", async () => {
    render(<CopyJobDetails {...defaultProps} />);
    fireEvent.click(screen.getByText("Copy Info"));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    });

    const text = (navigator.clipboard.writeText as any).mock.calls[0][0];
    expect(text).toContain("SSC CGL 2025");
    expect(text).toContain("Staff Selection Commission");
    expect(text).toContain("Graduate");
    expect(text).toContain("30 Jun 2025");
    expect(text).toContain("₹25,000 - ₹80,000");
    expect(text).toContain("https://ssc.nic.in/apply");
    expect(text).toContain("Naukari360");
  });

  it("shows Copied! feedback after clicking", async () => {
    render(<CopyJobDetails {...defaultProps} />);
    fireEvent.click(screen.getByText("Copy Info"));

    await waitFor(() => {
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });
  });

  it("omits null fields from copied text", async () => {
    render(<CopyJobDetails title="Test Job" url="https://example.com" />);
    fireEvent.click(screen.getByText("Copy Info"));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });

    const text = (navigator.clipboard.writeText as any).mock.calls[0][0];
    expect(text).toContain("Test Job");
    expect(text).not.toContain("undefined");
    expect(text).not.toContain("null");
  });
});
