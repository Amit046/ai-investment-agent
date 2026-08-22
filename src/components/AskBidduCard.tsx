"use client";

import { useState, useEffect, useRef } from "react";
import { InvestmentReport } from "@/types";
import { speakText, stopSpeaking } from "@/lib/speech";
import {
  Sparkles,
  Send,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  HelpCircle,
} from "lucide-react";

interface AskBidduCardProps {
  report: InvestmentReport;
  isMuted?: boolean;
}

export default function AskBidduCard({ report, isMuted = false }: AskBidduCardProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingAnswer, setIsSpeakingAnswer] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      setIsSpeechSupported(!!SpeechRecognition);
    }

    return () => {
      stopSpeaking();
    };
  }, []);

  async function handleAsk(queryToAsk?: string) {
    const q = (queryToAsk !== undefined ? queryToAsk : question).trim();
    if (!q || isAsking) return;

    if (queryToAsk) setQuestion(queryToAsk);
    setIsAsking(true);
    setError(null);
    stopSpeaking();
    setIsSpeakingAnswer(false);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          report,
        }),
      });

      const data = await res.json();

      if (data.success && data.answer) {
        setAnswer(data.answer);

        if (!isMuted) {
          setIsSpeakingAnswer(true);
          speakText(data.answer, () => {
            setIsSpeakingAnswer(false);
          });
        }
      } else {
        setError(data.error || "Biddu couldn't answer. Please try again.");
      }
    } catch (err) {
      console.error("Ask Biddu error:", err);
      setError("Network error while asking Biddu.");
    } finally {
      setIsAsking(false);
    }
  }

  function toggleSpeechAnswer() {
    if (isSpeakingAnswer) {
      stopSpeaking();
      setIsSpeakingAnswer(false);
    } else if (answer) {
      setIsSpeakingAnswer(true);
      speakText(answer, () => {
        setIsSpeakingAnswer(false);
      });
    }
  }

  function toggleVoiceInput() {
    if (isAsking) return;

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
        setQuestion(transcript);
        setIsListening(false);
        handleAsk(transcript);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }
  }

  const suggestedQuestions = [
    "Is this company risky?",
    "What are their main growth opportunities?",
    "How do they compare to competitors?",
    "Why did you give this verdict?",
  ];

  return (
    <div className="rounded-xl border border-blue-200/80 bg-gradient-to-b from-blue-50/50 to-white px-5 py-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Bot size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              Ask Biddu
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100/80 px-2 py-0.5 rounded-full">
                AI Voice &amp; Chat
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Ask any follow-up question about {report.companyName}&apos;s report
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Chips */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {suggestedQuestions.map((sq, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleAsk(sq)}
            disabled={isAsking}
            className="text-xs bg-white border border-slate-200/90 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 px-2.5 py-1 rounded-lg transition-all disabled:opacity-50"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <HelpCircle
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isAsking && question.trim()) {
                handleAsk();
              }
            }}
            placeholder={
              isListening
                ? "Listening... Ask your question..."
                : `Ask Biddu about ${report.companyName}...`
            }
            disabled={isAsking}
            className={`w-full bg-white border rounded-xl pl-10 pr-12 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all shadow-sm ${
              isListening
                ? "border-blue-500 ring-2 ring-blue-100 placeholder:text-blue-500"
                : "border-slate-200 focus:border-blue-400 focus:ring-blue-100 disabled:opacity-50"
            }`}
          />
          {isSpeechSupported && (
            <button
              type="button"
              onClick={toggleVoiceInput}
              disabled={isAsking}
              title={isListening ? "Stop listening" : "Speak your question to Biddu"}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
                isListening
                  ? "bg-red-500 text-white animate-pulse shadow-md"
                  : "text-slate-400 hover:text-blue-600 hover:bg-slate-100"
              }`}
            >
              {isListening ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => handleAsk()}
          disabled={isAsking || !question.trim()}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
        >
          {isAsking ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              <Send size={13} />
              Ask
            </>
          )}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg p-2.5">
          {error}
        </p>
      )}

      {/* Biddu Answer Bubble */}
      {answer && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 space-y-2 animate-fadeIn shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-blue-600" />
              <span className="text-xs font-semibold text-blue-950">
                Biddu&apos;s Answer
              </span>
            </div>
            <button
              type="button"
              onClick={toggleSpeechAnswer}
              title={isSpeakingAnswer ? "Stop speaking" : "Listen to answer"}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors ${
                isSpeakingAnswer
                  ? "bg-blue-600 text-white animate-pulse"
                  : "text-blue-700 hover:bg-blue-100/80"
              }`}
            >
              {isSpeakingAnswer ? <Volume2 size={13} /> : <Volume2 size={13} />}
              <span>{isSpeakingAnswer ? "Speaking..." : "Listen"}</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}
