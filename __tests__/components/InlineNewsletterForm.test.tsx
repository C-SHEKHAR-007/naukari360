import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import InlineNewsletterForm from "@/components/public/InlineNewsletterForm";

describe("InlineNewsletterForm", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders email input and subscribe button", () => {
    render(<InlineNewsletterForm />);
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByText("Subscribe")).toBeInTheDocument();
  });

  it("shows success message on successful submission", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(<InlineNewsletterForm />);
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByText("Subscribe"));

    await waitFor(() => {
      expect(screen.getByText(/You're subscribed/)).toBeInTheDocument();
    });
  });

  it("shows error message on failed submission", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    render(<InlineNewsletterForm />);
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByText("Subscribe"));

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });
  });

  it("shows error on network failure", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    render(<InlineNewsletterForm />);
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByText("Subscribe"));

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    });
  });

  it("sends correct payload to API", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(<InlineNewsletterForm />);
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "user@test.com" },
    });
    fireEvent.click(screen.getByText("Subscribe"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "user@test.com" }),
      });
    });
  });
});
