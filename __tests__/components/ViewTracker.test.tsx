import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import ViewTracker from "@/components/public/ViewTracker";

describe("ViewTracker", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
    sessionStorage.clear();
  });

  it("renders nothing visible", () => {
    const { container } = render(<ViewTracker postId="test-123" />);
    expect(container.innerHTML).toBe("");
  });

  it("sends view request on mount", () => {
    render(<ViewTracker postId="test-123" />);
    expect(fetch).toHaveBeenCalledWith(
      "/api/track-view",
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  it("does not send duplicate view in same session", () => {
    sessionStorage.setItem("viewed_test-123", Date.now().toString());
    render(<ViewTracker postId="test-123" />);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("sends view after 30 min gap", () => {
    sessionStorage.setItem("viewed_test-123", (Date.now() - 31 * 60 * 1000).toString());
    render(<ViewTracker postId="test-123" />);
    expect(fetch).toHaveBeenCalled();
  });
});
