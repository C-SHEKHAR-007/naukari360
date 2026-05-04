import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSend = vi.hoisted(() => vi.fn());
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mockSend };
  },
}));

import { sendEmail, sendContactNotification } from "@/lib/email";

describe("email.ts — sendEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSend.mockResolvedValue({ data: { id: "email-123" }, error: null });
  });

  it("sends email with correct parameters", async () => {
    await sendEmail({
      to: "test@example.com",
      subject: "Test Subject",
      html: "<p>Hello</p>",
    });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "test@example.com",
        subject: "Test Subject",
        html: "<p>Hello</p>",
      })
    );
  });

  it("returns result from Resend API", async () => {
    mockSend.mockResolvedValue({ data: { id: "msg-456" }, error: null });

    const result = await sendEmail({
      to: "user@test.com",
      subject: "Hello",
      html: "<b>Hey</b>",
    });

    expect(result).toEqual({ data: { id: "msg-456" }, error: null });
  });

  it("handles Resend API errors", async () => {
    mockSend.mockResolvedValue({ data: null, error: { message: "Rate limited" } });

    const result = await sendEmail({
      to: "user@test.com",
      subject: "Hello",
      html: "<b>Hey</b>",
    });

    expect(result.error).toBeDefined();
  });
});

describe("email.ts — sendContactNotification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSend.mockResolvedValue({ data: { id: "email-789" }, error: null });
  });

  it("sends notification with contact form data", async () => {
    await sendContactNotification({
      name: "John Doe",
      email: "john@example.com",
      type: "general",
      subject: "general",
      message: "I need help with the site",
    });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining("Contact"),
        html: expect.stringContaining("John Doe"),
      })
    );
  });

  it("includes contact details in email body", async () => {
    await sendContactNotification({
      name: "Jane",
      email: "jane@test.com",
      type: "feedback",
      subject: "feedback",
      message: "Great website!",
    });

    const call = mockSend.mock.calls[0][0];
    expect(call.html).toContain("jane@test.com");
    expect(call.html).toContain("Great website!");
  });

  it("escapes HTML in user input to prevent XSS", async () => {
    await sendContactNotification({
      name: '<script>alert("xss")</script>',
      email: "attacker@evil.com",
      type: "general",
      subject: '<img src=x onerror="steal()">',
      message: "<b>bold</b> & 'quotes'",
    });

    const call = mockSend.mock.calls[0][0];
    expect(call.html).not.toContain("<script>");
    expect(call.html).not.toContain("<img");
    expect(call.html).toContain("&lt;script&gt;");
    expect(call.html).toContain("&lt;img");
    expect(call.html).toContain("&amp;");
    expect(call.html).toContain("&#039;quotes&#039;");
  });
});
