"use client";

import { useState, useRef } from "react";
import { Mic, MicOff } from "lucide-react";

interface VoiceSearchProps {
  onResult: (transcript: string) => void;
}

export default function VoiceSearch({ onResult }: VoiceSearchProps) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  function startListening() {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  if (!isSupported) return null;

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
