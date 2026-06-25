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
    <div className="rounded-xl border border-slate-200 bg-white px-6 py-8 flex flex-col items-center gap-5 shadow-sm">
      <Loader2 size={28} className="animate-spin text-blue-600" />
      <div className="text-center">
        <p className="text-sm font-medium text-slate-700">Researching {companyName}</p>
        <p className="text-xs text-slate-400 mt-1">{STEPS[stepIndex]}</p>
      </div>
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i <= stepIndex ? "w-5 bg-blue-500" : "w-1.5 bg-slate-200"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-slate-400">This takes about 10–15 seconds</p>
    </div>
  );
}