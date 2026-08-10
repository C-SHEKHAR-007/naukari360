import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CommentsSection from "@/components/public/CommentsSection";

vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
}));

// Mock fetch to prevent network errors in test environment
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as any;

describe("CommentsSection Component", () => {
  it("renders sign in prompt when unauthenticated", () => {
    render(<CommentsSection postId="test-post-123" />);

    expect(screen.getByText("Join the conversation")).toBeInTheDocument();
    expect(screen.getByText("Sign In to Comment")).toBeInTheDocument();
  });

  it("shows 'No comments yet' when empty", async () => {
    render(<CommentsSection postId="test-post-123" />);

    // Because fetch resolves with [], it sets loading to false and comments to []
    expect(await screen.findByText("No comments yet. Be the first to start the discussion!")).toBeInTheDocument();
  });
});
