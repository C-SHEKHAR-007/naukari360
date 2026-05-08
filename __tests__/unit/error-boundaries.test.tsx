import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import GlobalError from "@/app/global-error";
import PublicError from "@/app/(public)/error";
import AdminError from "@/app/(admin)/admin/(dashboard)/error";

describe("Error Boundaries", () => {
  let mockError: Error & { digest?: string };
  let mockRetry: () => void;

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockError = Object.assign(new Error("Test error"), { digest: "abc123" });
    mockRetry = vi.fn();
  });

  describe("GlobalError", () => {
    it("renders error message and retry button", () => {
      render(<GlobalError error={mockError} unstable_retry={mockRetry} />);
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(screen.getByText("Try Again")).toBeInTheDocument();
    });

    it("displays error digest", () => {
      render(<GlobalError error={mockError} unstable_retry={mockRetry} />);
      expect(screen.getByText("Error ID: abc123")).toBeInTheDocument();
    });

    it("calls unstable_retry on button click", () => {
      render(<GlobalError error={mockError} unstable_retry={mockRetry} />);
      fireEvent.click(screen.getByText("Try Again"));
      expect(mockRetry).toHaveBeenCalledTimes(1);
    });

    it("logs error to console", () => {
      render(<GlobalError error={mockError} unstable_retry={mockRetry} />);
      expect(console.error).toHaveBeenCalledWith("[GlobalError]", mockError);
    });

    it("is a client component with html and body tags", () => {
      // global-error must define its own <html> and <body>
      // We verify by checking the rendered output contains body-level classes
      render(<GlobalError error={mockError} unstable_retry={mockRetry} />);
      expect(document.querySelector(".flex.min-h-screen")).toBeInTheDocument();
    });
  });

  describe("PublicError", () => {
    it("renders Hindi error message", () => {
      render(<PublicError error={mockError} unstable_retry={mockRetry} />);
      expect(screen.getByText("पेज लोड नहीं हो पाया")).toBeInTheDocument();
    });

    it("shows retry and home buttons", () => {
      render(<PublicError error={mockError} unstable_retry={mockRetry} />);
      expect(screen.getByText("दोबारा कोशिश करें")).toBeInTheDocument();
      expect(screen.getByText("होम पेज पर जाएँ")).toBeInTheDocument();
    });

    it("calls unstable_retry on retry click", () => {
      render(<PublicError error={mockError} unstable_retry={mockRetry} />);
      fireEvent.click(screen.getByText("दोबारा कोशिश करें"));
      expect(mockRetry).toHaveBeenCalledTimes(1);
    });

    it("home link points to /", () => {
      render(<PublicError error={mockError} unstable_retry={mockRetry} />);
      const homeLink = screen.getByText("होम पेज पर जाएँ");
      expect(homeLink.closest("a")).toHaveAttribute("href", "/");
    });

    it("displays error digest", () => {
      render(<PublicError error={mockError} unstable_retry={mockRetry} />);
      expect(screen.getByText("Error ID: abc123")).toBeInTheDocument();
    });

    it("hides digest when not present", () => {
      const errorNoDigest = new Error("No digest") as Error & { digest?: string };
      render(<PublicError error={errorNoDigest} unstable_retry={mockRetry} />);
      expect(screen.queryByText(/Error ID/)).not.toBeInTheDocument();
    });
  });

  describe("AdminError", () => {
    it("renders admin error message", () => {
      render(<AdminError error={mockError} unstable_retry={mockRetry} />);
      expect(screen.getByText("Admin Panel Error")).toBeInTheDocument();
    });

    it("reassures data safety", () => {
      render(<AdminError error={mockError} unstable_retry={mockRetry} />);
      expect(screen.getByText(/Your data is safe/)).toBeInTheDocument();
    });

    it("calls unstable_retry on retry click", () => {
      render(<AdminError error={mockError} unstable_retry={mockRetry} />);
      fireEvent.click(screen.getByText("Retry"));
      expect(mockRetry).toHaveBeenCalledTimes(1);
    });

    it("has dashboard navigation button", () => {
      render(<AdminError error={mockError} unstable_retry={mockRetry} />);
      expect(screen.getByText("Go to Dashboard")).toBeInTheDocument();
    });

    it("displays error digest", () => {
      render(<AdminError error={mockError} unstable_retry={mockRetry} />);
      expect(screen.getByText("Error ID: abc123")).toBeInTheDocument();
    });

    it("logs error to console", () => {
      render(<AdminError error={mockError} unstable_retry={mockRetry} />);
      expect(console.error).toHaveBeenCalledWith("[AdminError]", mockError);
    });
  });
});
