"use client";

import { useState, useRef } from "react";
import { Mic, MicOff } from "lucide-react";

interface SpeechRecognitionResult {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionEvent {
  readonly results: { [index: number]: { [index: number]: SpeechRecognitionResult } };
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

interface VoiceSearchProps {
  onResult: (transcript: string) => void;
}

export default function VoiceSearch({ onResult }: VoiceSearchProps) {
  const [mounted, setMounted] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  function startListening() {
    if (!isSupported) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.lang = "hi-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      stopListening();
    };

    recognition.onerror = () => {
      stopListening();
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  if (!mounted || !isSupported) return null;

  return (
    <button
      onClick={listening ? stopListening : startListening}
      className={`rounded-lg p-2 transition-colors ${
        listening
          ? "bg-red-100 text-red-600 dark:bg-red-900/30"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
      aria-label={listening ? "Stop voice search" : "Start voice search"}
      type="button"
    >
      {listening ? <MicOff className="h-5 w-5 animate-pulse" /> : <Mic className="h-5 w-5" />}
    </button>
  );
}
