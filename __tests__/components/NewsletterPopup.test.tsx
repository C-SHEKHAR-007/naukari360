import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act, cleanup } from "@testing-library/react";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// We need to fully control localStorage for this component
const storageMap = new Map<string, string>();
const mockGetItem = vi.fn((key: string) => storageMap.get(key) ?? null);
const mockSetItem = vi.fn((key: string, value: string) => storageMap.set(key, value));

Object.defineProperty(window, "localStorage", {
  value: {
    getItem: mockGetItem,
    setItem: mockSetItem,
    removeItem: vi.fn((key: string) => storageMap.delete(key)),
    clear: vi.fn(() => storageMap.clear()),
    get length() {
      return storageMap.size;
    },
    key: vi.fn(),
  },
  writable: true,
});

// Import AFTER mocking localStorage
import NewsletterPopup from "@/components/public/NewsletterPopup";

describe("NewsletterPopup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storageMap.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it("does not show immediately", () => {
    render(<NewsletterPopup />);
    expect(screen.queryByText("Stay Updated!")).not.toBeInTheDocument();
  });

  it("shows after 15 seconds", () => {
    render(<NewsletterPopup />);
    act(() => {
      vi.advanceTimersByTime(15000);
    });
    expect(screen.getByText("Stay Updated!")).toBeInTheDocument();
  });

  it("does not show if previously dismissed", () => {
    storageMap.set("newsletter_dismissed", "123456");
    render(<NewsletterPopup />);
    act(() => {
      vi.advanceTimersByTime(15000);
    });
    expect(screen.queryByText("Stay Updated!")).not.toBeInTheDocument();
  });

  it("does not show if already subscribed", () => {
    storageMap.set("newsletter_subscribed", "true");
    render(<NewsletterPopup />);
    act(() => {
      vi.advanceTimersByTime(15000);
    });
    expect(screen.queryByText("Stay Updated!")).not.toBeInTheDocument();
  });

  it("dismisses when X is clicked", () => {
    render(<NewsletterPopup />);
    act(() => {
      vi.advanceTimersByTime(15000);
    });
    expect(screen.getByText("Stay Updated!")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Close"));
    expect(screen.queryByText("Stay Updated!")).not.toBeInTheDocument();
    expect(mockSetItem).toHaveBeenCalledWith("newsletter_dismissed", expect.any(String));
  });

  it("submits email and shows success", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Subscribed successfully" }),
    });

    render(<NewsletterPopup />);
    act(() => {
      vi.advanceTimersByTime(15000);
    });

    expect(screen.getByText("Stay Updated!")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Enter your email");
    fireEvent.change(input, { target: { value: "test@example.com" } });

    // Switch to real timers before click so the async fetch resolves
    vi.useRealTimers();

    fireEvent.click(screen.getByText("Subscribe Free"));

    await waitFor(() => {
      expect(screen.getByText("Subscribed successfully")).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", source: "popup" }),
    });
    expect(mockSetItem).toHaveBeenCalledWith("newsletter_subscribed", "true");
  });

  it("shows error on failed submission", async () => {
    vi.useRealTimers();

    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Server error" }),
      })
    );

    vi.useFakeTimers();
    render(<NewsletterPopup />);
    act(() => {
      vi.advanceTimersByTime(15000);
    });
    vi.useRealTimers();

    expect(screen.getByText("Stay Updated!")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Enter your email");
    fireEvent.change(input, { target: { value: "invalid@test.com" } });
    fireEvent.click(screen.getByText("Subscribe Free"));

    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument();
    });
  });
});
