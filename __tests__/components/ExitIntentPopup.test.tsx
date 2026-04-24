import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import ExitIntentPopup from "@/components/public/ExitIntentPopup";

describe("ExitIntentPopup", () => {
  beforeEach(() => {
    Object.defineProperty(window, "sessionStorage", {
      value: {
        getItem: vi.fn().mockReturnValue(null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("is hidden by default", () => {
    render(<ExitIntentPopup />);
    expect(screen.queryByText(/Wait!/)).not.toBeInTheDocument();
  });

  it("shows popup when mouse leaves viewport", () => {
    render(<ExitIntentPopup />);
    fireEvent.mouseLeave(document, { clientY: -10 });
    expect(screen.getByText(/Wait! Get 50% OFF/)).toBeInTheDocument();
  });

  it("closes when X button is clicked", () => {
    render(<ExitIntentPopup />);
    fireEvent.mouseLeave(document, { clientY: -10 });
    expect(screen.getByText(/Wait! Get 50% OFF/)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Close popup"));
    expect(screen.queryByText(/Wait! Get 50% OFF/)).not.toBeInTheDocument();
  });

  it("shows custom message and affiliate name", () => {
    render(
      <ExitIntentPopup
        message="Don't leave! Special offer"
        affiliateName="Unacademy"
        affiliateUrl="https://unacademy.com"
      />
    );
    fireEvent.mouseLeave(document, { clientY: -10 });
    expect(screen.getByText("Don't leave! Special offer")).toBeInTheDocument();
    expect(screen.getByText(/Unacademy/)).toBeInTheDocument();
    expect(screen.getByText("Grab the Offer").closest("a")).toHaveAttribute(
      "href",
      "https://unacademy.com"
    );
  });

  it("does not trigger twice", () => {
    render(<ExitIntentPopup />);
    fireEvent.mouseLeave(document, { clientY: -10 });
    fireEvent.click(screen.getByLabelText("Close popup"));
    // Second mouse leave should not trigger
    fireEvent.mouseLeave(document, { clientY: -10 });
    expect(screen.queryByText(/Wait! Get 50% OFF/)).not.toBeInTheDocument();
  });

  it("does not show if already shown this session", () => {
    (window.sessionStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue("true");
    render(<ExitIntentPopup />);
    fireEvent.mouseLeave(document, { clientY: -10 });
    expect(screen.queryByText(/Wait!/)).not.toBeInTheDocument();
  });
});
