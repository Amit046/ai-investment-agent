"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Mic, MicOff } from "lucide-react";

interface SearchFormProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (overrideVal?: string) => void;
  isLoading: boolean;
}

export function extractCompanyName(raw: string): string {
  let text = raw.trim().replace(/[?.!]+$/, "").trim();
  if (!text) return "";

  // Strip leading wake words ("hey biddu", "biddu", "ok biddu", "please")
  text = text.replace(/^(?:(?:hey|ok|hi)\s+)?biddu(?:,)?\s*/i, "").trim();
  text = text.replace(/^please\s+/i, "").trim();

  // Strip common command phrases
  const commandPrefixes = [
    /^what\s+do\s+you\s+think\s+about\s+/i,
    /^should\s+i\s+invest\s+in\s+/i,
    /^(?:search\s+for|search|find|check|tell\s+me\s+about|research|look\s+up|what\s+about|analyze|investigate|give\s+me\s+info\s+on)\s+/i,
  ];

  for (const prefix of commandPrefixes) {
    if (prefix.test(text)) {
      text = text.replace(prefix, "").trim();
      break;
    }
  }

  return text.replace(/[?.!]+$/, "").trim();
}


export default function SearchForm({ value, onChange, onSubmit, isLoading }: SearchFormProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognition);
    }
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !isLoading && value.trim()) {
      onSubmit();
    }
  }

  function toggleListening() {
    if (isLoading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript) {
        const extracted = extractCompanyName(transcript);
        onChange(extracted);
        setIsListening(false);
        onSubmit(extracted);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
    }
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex gap-2 w-full">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? "Listening to Biddu... Speak company name"
                : "e.g. Zepto, Nvidia, Reliance Industries..."
            }
            disabled={isLoading}
            className={`w-full bg-white border rounded-xl pl-10 pr-12 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all shadow-sm ${
              isListening
                ? "border-blue-500 ring-2 ring-blue-100 placeholder:text-blue-500"
                : "border-slate-200 focus:border-blue-400 focus:ring-blue-100 disabled:opacity-50"
            }`}
          />
          {isSupported ? (
            <button
              type="button"
              onClick={toggleListening}
              disabled={isLoading}
              title={
                isListening
                  ? "Stop listening"
                  : "Ask Biddu (Voice Search) — Speak 'Search for [Company]'"
              }
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                isListening
                  ? "bg-red-500 text-white animate-pulse shadow-md"
                  : "text-slate-400 hover:text-blue-600 hover:bg-slate-100"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {isListening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>
          ) : (
            <button
              type="button"
              disabled
              title="Voice search is supported in Chrome and Edge browsers."
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-300 cursor-not-allowed"
            >
              <Mic size={15} />
            </button>
          )}
        </div>
        <button
          onClick={() => onSubmit()}
          disabled={isLoading || !value.trim()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Researching...
            </>
          ) : (
            "Research"
          )}
        </button>
      </div>

      {isListening && (
        <div className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50/80 border border-blue-200 rounded-lg px-3 py-1.5 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>
            <strong>Biddu is listening...</strong> Try saying <em>&quot;Biddu, search for Nvidia&quot;</em> or <em>&quot;Check Airbnb&quot;</em>
          </span>
        </div>
      )}
    </div>
  );
}