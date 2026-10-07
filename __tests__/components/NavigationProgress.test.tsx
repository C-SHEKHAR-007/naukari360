/* eslint-disable @next/next/no-html-link-for-pages -- plain anchors stand in for rendered <Link> output */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";
import { usePathname } from "next/navigation";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/latest-jobs"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

import NavigationProgress from "@/components/public/NavigationProgress";

function renderWithLinks() {
  return render(
    <>
      <NavigationProgress />
      <a href="/post/ssc-cgl">Internal</a>
      <a href="https://example.com/">External</a>
      <a href="/post/new-tab" target="_blank">
        New tab
      </a>
      <a href={window.location.pathname}>Same page</a>
    </>
  );
}

// jsdom can't navigate; stop the default action after our listener has seen the click
function click(el: Element, init: MouseEventInit = {}) {
  const prevent = (e: Event) => e.preventDefault();
  window.addEventListener("click", prevent, { once: true });
  fireEvent.click(el, init);
}

describe("NavigationProgress", () => {
  beforeEach(() => {
    (usePathname as any).mockReturnValue("/latest-jobs");
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("is hidden initially", () => {
    renderWithLinks();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("shows immediately when an internal link is clicked", () => {
    renderWithLinks();
    click(screen.getByText("Internal"));
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("ignores external links, new-tab links, modified clicks and same-page links", () => {
    renderWithLinks();
    click(screen.getByText("External"));
    click(screen.getByText("New tab"));
    click(screen.getByText("Internal"), { ctrlKey: true });
    click(screen.getByText("Same page"));
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("shows for next/link-style links that call preventDefault to navigate client-side", () => {
    render(
      <>
        <NavigationProgress />
        <a href="/post/x" onClick={(e) => e.preventDefault()}>
          Job card
        </a>
      </>
    );
    fireEvent.click(screen.getByText("Job card"));
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("ignores clicks on controls inside a link (e.g. bookmark button on a card)", () => {
    render(
      <>
        <NavigationProgress />
        <a href="/post/x" onClick={(e) => e.preventDefault()}>
          <span>Job title</span>
          <button onClick={(e) => e.preventDefault()}>
            <svg data-testid="bookmark-icon" />
          </button>
        </a>
      </>
    );
    fireEvent.click(screen.getByTestId("bookmark-icon"));
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("hides once the route changes", () => {
    const { rerender } = renderWithLinks();
    click(screen.getByText("Internal"));
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    (usePathname as any).mockReturnValue("/post/ssc-cgl");
    rerender(
      <>
        <NavigationProgress />
      </>
    );
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("never stays stuck if navigation is cancelled", () => {
    vi.useFakeTimers();
    renderWithLinks();
    click(screen.getByText("Internal"));
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(15000);
    });
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
