"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const STEPS = [
  "Searching company overview...",
  "Gathering recent news...",
  "Analyzing growth opportunities...",
  "Evaluating business risks...",
  "Generating investment verdict...",
];

interface LoadingStateProps {
  companyName: string;
}

export default function LoadingState({ companyName }: LoadingStateProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] px-6 py-8 flex flex-col items-center gap-5">
      <Loader2 size={28} className="animate-spin text-zinc-400" />
      <div className="text-center">
        <p className="text-sm font-medium text-zinc-300">Researching {companyName}</p>
        <p className="text-xs text-zinc-500 mt-1">{STEPS[stepIndex]}</p>
      </div>
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i <= stepIndex ? "w-5 bg-zinc-400" : "w-1.5 bg-zinc-700"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-zinc-600">This takes about 10–15 seconds</p>
    </div>
  );
}
