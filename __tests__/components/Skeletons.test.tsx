import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import {
  ListingPageSkeleton,
  PostDetailSkeleton,
  PostGridSkeleton,
} from "@/components/public/Skeletons";
import ListingLoading from "@/app/(public)/loading";
import PostLoading from "@/app/(public)/post/[slug]/loading";

describe("loading skeletons", () => {
  afterEach(() => cleanup());

  it("renders the requested number of card placeholders", () => {
    const { container } = render(<PostGridSkeleton count={4} />);
    expect(container.firstElementChild?.children).toHaveLength(4);
  });

  it("listing skeleton is marked busy for assistive tech", () => {
    render(<ListingPageSkeleton />);
    expect(screen.getByLabelText("Loading")).toHaveAttribute("aria-busy", "true");
  });

  it("post skeleton is marked busy for assistive tech", () => {
    render(<PostDetailSkeleton />);
    expect(screen.getByLabelText("Loading")).toHaveAttribute("aria-busy", "true");
  });

  it("route loading files render their skeletons", () => {
    const { unmount } = render(<ListingLoading />);
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
    unmount();
    render(<PostLoading />);
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  });
});
