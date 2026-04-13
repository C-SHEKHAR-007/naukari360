import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import ContactForm from "@/components/public/ContactForm";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  it("renders all required form fields", () => {
    const { container } = render(<ContactForm />);
    expect(container.querySelectorAll("input[type='text']").length).toBeGreaterThanOrEqual(2);
    expect(container.querySelector("input[type='email']")).toBeTruthy();
    expect(container.querySelector("textarea")).toBeTruthy();
    expect(container.querySelector("select")).toBeTruthy();
  });

  it("renders submit button", () => {
    const { container } = render(<ContactForm />);
    const btn = container.querySelector("button[type='submit']");
    expect(btn).toBeTruthy();
    expect(btn!.textContent).toBe("Send Message");
  });

  it("submits form and shows success", async () => {
    const { container } = render(<ContactForm />);
    const inputs = container.querySelectorAll("input[type='text']");
    const emailInput = container.querySelector("input[type='email']")!;
    const textarea = container.querySelector("textarea")!;
    const form = container.querySelector("form")!;

    fireEvent.change(inputs[0], { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@test.com" } });
    fireEvent.change(inputs[1], { target: { value: "Test Subject" } });
    fireEvent.change(textarea, { target: { value: "Hello, I need help" } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/contact", expect.objectContaining({
        method: "POST",
      }));
    });

    await waitFor(() => {
      expect(container.textContent).toContain("Thank you!");
    });
  });

  it("shows error on failed submission", async () => {
    mockFetch.mockResolvedValue({ ok: false, json: () => Promise.resolve({ error: "Failed" }) });

    const { container } = render(<ContactForm />);
    const inputs = container.querySelectorAll("input[type='text']");
    const emailInput = container.querySelector("input[type='email']")!;
    const textarea = container.querySelector("textarea")!;
    const form = container.querySelector("form")!;

    fireEvent.change(inputs[0], { target: { value: "John" } });
    fireEvent.change(emailInput, { target: { value: "john@test.com" } });
    fireEvent.change(inputs[1], { target: { value: "Subject" } });
    fireEvent.change(textarea, { target: { value: "Test message" } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(container.textContent).toContain("Something went wrong");
    });
  });
});
