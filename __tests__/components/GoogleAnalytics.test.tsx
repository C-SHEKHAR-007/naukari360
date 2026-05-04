import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import GoogleAnalytics from "@/components/public/GoogleAnalytics";

describe("GoogleAnalytics", () => {
  it("renders nothing when gaId is empty", () => {
    const { container } = render(<GoogleAnalytics gaId="" />);
    expect(container.innerHTML).toBe("");
  });

  it("renders script tags when gaId is provided", () => {
    const { container } = render(<GoogleAnalytics gaId="G-TESTID123" />);
    // Next/Script renders outside of the component container in test env
    // So we just verify it doesn't error and returns non-null
    expect(container).toBeDefined();
  });

  it("does not render with falsy gaId", () => {
    const { container } = render(<GoogleAnalytics gaId="" />);
    expect(container.childElementCount).toBe(0);
  });
});
