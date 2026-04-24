import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import VoiceSearch from "@/components/public/VoiceSearch";

function createMockRecognition() {
  return {
    start: vi.fn(),
    stop: vi.fn(),
    lang: "",
    interimResults: false,
    maxAlternatives: 1,
    onresult: null as ((e: unknown) => void) | null,
    onerror: null as ((e: unknown) => void) | null,
    onend: null as (() => void) | null,
  };
}

let mockRecognition: ReturnType<typeof createMockRecognition>;

function setupSpeechRecognition() {
  mockRecognition = createMockRecognition();
  function MockSpeechRecognition() {
    return mockRecognition;
  }
  Object.defineProperty(window, "SpeechRecognition", {
    value: MockSpeechRecognition,
    writable: true,
    configurable: true,
  });
}

describe("VoiceSearch", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    // Clean up
    Object.defineProperty(window, "SpeechRecognition", {
      value: undefined,
      writable: true,
      configurable: true,
    });
  });

  it("renders nothing if SpeechRecognition is not supported", () => {
    const { container } = render(<VoiceSearch onResult={vi.fn()} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders mic button when SpeechRecognition is available", () => {
    setupSpeechRecognition();
    render(<VoiceSearch onResult={vi.fn()} />);
    expect(screen.getByLabelText("Start voice search")).toBeInTheDocument();
  });

  it("starts listening when clicked", () => {
    setupSpeechRecognition();
    render(<VoiceSearch onResult={vi.fn()} />);
    fireEvent.click(screen.getByLabelText("Start voice search"));
    expect(mockRecognition.start).toHaveBeenCalled();
    expect(screen.getByLabelText("Stop voice search")).toBeInTheDocument();
  });

  it("calls onResult with transcript", () => {
    setupSpeechRecognition();
    const onResult = vi.fn();
    render(<VoiceSearch onResult={onResult} />);
    fireEvent.click(screen.getByLabelText("Start voice search"));

    // Simulate recognition result
    const resultEvent = { results: [[{ transcript: "ssc cgl vacancy" }]] };
    mockRecognition.onresult!(resultEvent);

    expect(onResult).toHaveBeenCalledWith("ssc cgl vacancy");
  });
});
