import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import ApplicationTracker, {
  addToTracker,
  removeFromTracker,
} from "@/components/public/ApplicationTracker";

function mockLocalStorage() {
  const store = new Map<string, string>();
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, val: string) => store.set(key, val),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
    },
    writable: true,
  });
  return store;
}

describe("ApplicationTracker", () => {
  let store: Map<string, string>;

  beforeEach(() => {
    store = mockLocalStorage();
  });

  afterEach(() => {
    cleanup();
    store.clear();
  });

  it("shows empty state when no jobs tracked", () => {
    render(<ApplicationTracker />);
    expect(screen.getByText("No jobs tracked yet.")).toBeInTheDocument();
  });

  it("displays tracked jobs from localStorage", () => {
    const jobs = [
      { slug: "ssc-cgl", title: "SSC CGL 2026", status: "saved", addedAt: "2026-04-01" },
    ];
    store.set("applicationTracker", JSON.stringify(jobs));

    render(<ApplicationTracker />);
    expect(screen.getByText("SSC CGL 2026")).toBeInTheDocument();
  });

  it("filters jobs by status", () => {
    const jobs = [
      { slug: "job-1", title: "Job 1", status: "saved", addedAt: "2026-04-01" },
      { slug: "job-2", title: "Job 2", status: "applied", addedAt: "2026-04-02" },
    ];
    store.set("applicationTracker", JSON.stringify(jobs));

    render(<ApplicationTracker />);
    // Click the "applied" filter button (it's a button element)
    const buttons = screen.getAllByRole("button");
    const appliedButton = buttons.find((b) => b.textContent === "applied")!;
    fireEvent.click(appliedButton);
    expect(screen.queryByText("Job 1")).not.toBeInTheDocument();
    expect(screen.getByText("Job 2")).toBeInTheDocument();
  });

  it("removes job when delete button clicked", () => {
    const jobs = [{ slug: "job-1", title: "Job 1", status: "saved", addedAt: "2026-04-01" }];
    store.set("applicationTracker", JSON.stringify(jobs));

    render(<ApplicationTracker />);
    fireEvent.click(screen.getByLabelText("Remove Job 1 from tracker"));
    expect(screen.queryByText("Job 1")).not.toBeInTheDocument();
    expect(screen.getByText("No jobs tracked yet.")).toBeInTheDocument();
  });
});

describe("addToTracker", () => {
  let store: Map<string, string>;

  beforeEach(() => {
    store = mockLocalStorage();
  });

  afterEach(() => {
    store.clear();
  });

  it("adds a new job to tracker", () => {
    addToTracker({ slug: "new-job", title: "New Job" }, "saved");
    const stored = JSON.parse(store.get("applicationTracker") || "[]");
    expect(stored[0].slug).toBe("new-job");
    expect(stored[0].status).toBe("saved");
  });

  it("updates status of existing job", () => {
    const jobs = [{ slug: "job-1", title: "Job 1", status: "saved", addedAt: "2026-04-01" }];
    store.set("applicationTracker", JSON.stringify(jobs));

    addToTracker({ slug: "job-1", title: "Job 1" }, "applied");
    const stored = JSON.parse(store.get("applicationTracker") || "[]");
    expect(stored[0].status).toBe("applied");
  });

  it("limits to 50 entries", () => {
    const jobs = Array.from({ length: 50 }, (_, i) => ({
      slug: `job-${i}`,
      title: `Job ${i}`,
      status: "saved",
      addedAt: "2026-04-01",
    }));
    store.set("applicationTracker", JSON.stringify(jobs));

    addToTracker({ slug: "overflow", title: "Overflow" }, "saved");
    const stored = JSON.parse(store.get("applicationTracker") || "[]");
    expect(stored).toHaveLength(50);
    expect(stored[0].slug).toBe("overflow");
  });
});

describe("removeFromTracker", () => {
  let store: Map<string, string>;

  beforeEach(() => {
    store = mockLocalStorage();
  });

  afterEach(() => {
    store.clear();
  });

  it("removes a job by slug", () => {
    const jobs = [{ slug: "job-1", title: "Job 1", status: "saved", addedAt: "2026-04-01" }];
    store.set("applicationTracker", JSON.stringify(jobs));

    removeFromTracker("job-1");
    const stored = JSON.parse(store.get("applicationTracker") || "[]");
    expect(stored).toHaveLength(0);
  });
});
