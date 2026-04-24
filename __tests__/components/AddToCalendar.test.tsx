import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import AddToCalendar from "@/components/public/AddToCalendar";

describe("AddToCalendar", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the button with correct text", () => {
    render(<AddToCalendar title="SSC CGL Exam" date={new Date("2026-06-15T10:00:00Z")} />);
    expect(screen.getByText("Add to Calendar")).toBeInTheDocument();
  });

  it("generates a Google Calendar link with correct params", () => {
    const date = new Date("2026-06-15T10:00:00Z");
    render(<AddToCalendar title="SSC CGL Exam" date={date} />);
    const link = screen.getByLabelText("Add SSC CGL Exam to Google Calendar");
    const href = link.getAttribute("href")!;
    expect(href).toContain("google.com/calendar/render");
    expect(href).toContain("SSC+CGL+Exam");
    expect(href).toContain("20260615T100000Z");
  });

  it("includes description when provided", () => {
    const date = new Date("2026-06-15T10:00:00Z");
    render(<AddToCalendar title="Exam" date={date} description="Tier 1 exam starts" />);
    const link = screen.getByLabelText("Add Exam to Google Calendar");
    expect(link.getAttribute("href")).toContain("Tier+1+exam+starts");
  });

  it("opens in new tab", () => {
    render(<AddToCalendar title="Test" date={new Date()} />);
    const link = screen.getByText("Add to Calendar").closest("a");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
