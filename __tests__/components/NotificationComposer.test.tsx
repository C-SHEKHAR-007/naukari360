import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";

const mockFetch = vi.fn();
global.fetch = mockFetch;

import NotificationComposer from "@/components/admin/NotificationComposer";

const mockNotifications = [
  {
    id: "n-1",
    title: "SSC CGL Result",
    message: "Result has been declared",
    link: "https://naukari360.in/post/ssc-result",
    sentAt: "2026-04-10T10:00:00.000Z",
  },
  {
    id: "n-2",
    title: "UPSC Prelims",
    message: "Date announced",
    link: null,
    sentAt: "2026-04-12T10:00:00.000Z",
  },
];

describe("NotificationComposer", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders compose form", () => {
    render(<NotificationComposer notifications={mockNotifications} />);
    expect(screen.getByText("Compose Notification")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/SSC CGL 2025 Result/)).toBeInTheDocument();
  });

  it("renders sent notifications list", () => {
    const { container } = render(<NotificationComposer notifications={mockNotifications} />);
    expect(container.textContent).toContain("SSC CGL Result");
    expect(container.textContent).toContain("UPSC Prelims");
    expect(container.textContent).toContain("Result has been declared");
  });

  it("shows notification count", () => {
    const { container } = render(<NotificationComposer notifications={mockNotifications} />);
    expect(container.textContent).toContain("Sent Notifications (2)");
  });

  it("sends notification on form submit", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "n-3",
        title: "New Alert",
        message: "Check this out",
        link: null,
        sentAt: new Date().toISOString(),
      }),
    });

    render(<NotificationComposer notifications={[]} />);

    fireEvent.change(screen.getByPlaceholderText(/SSC CGL 2025 Result/), {
      target: { value: "New Alert" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Brief notification message/), {
      target: { value: "Check this out" },
    });
    fireEvent.click(screen.getByText("Send Notification"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/admin/notifications",
        expect.objectContaining({ method: "POST" })
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Notification sent!")).toBeInTheDocument();
    });
  });

  it("shows error when send fails", async () => {
    mockFetch.mockResolvedValue({ ok: false, json: async () => ({ error: "Failed" }) });

    render(<NotificationComposer notifications={[]} />);

    fireEvent.change(screen.getByPlaceholderText(/SSC CGL 2025 Result/), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Brief notification message/), {
      target: { value: "Test message" },
    });
    fireEvent.click(screen.getByText("Send Notification"));

    await waitFor(() => {
      expect(screen.getByText("Failed to send")).toBeInTheDocument();
    });
  });

  it("deletes notification on confirm", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<NotificationComposer notifications={mockNotifications} />);

    // Find delete button next to the first notification
    const buttons = screen.getAllByRole("button");
    // Delete buttons have red coloring - find buttons that are not "Send Notification"
    const deleteButtons = buttons.filter(
      (btn) => !btn.textContent?.includes("Send") && !btn.textContent?.includes("Sending")
    );
    if (deleteButtons.length > 0) fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/admin/notifications/n-1", { method: "DELETE" });
    });
  });

  it("shows empty state when no notifications", () => {
    const { container } = render(<NotificationComposer notifications={[]} />);
    expect(container.textContent).toContain("No notifications sent yet.");
  });
});
