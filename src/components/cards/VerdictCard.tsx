import { Verdict } from "@/types";
import { TrendingUp, TrendingDown } from "lucide-react";

interface VerdictCardProps {
  verdict: Verdict;
  reasoning: string;
  companyName: string;
  score: number;
}

export default function VerdictCard({ verdict, reasoning, companyName, score }: VerdictCardProps) {
  const isInvest = verdict === "INVEST";

  return (
    <div
      className={`rounded-xl border px-6 py-6 ${
        isInvest
          ? "border-emerald-800/50 bg-emerald-950/20"
          : "border-red-800/50 bg-red-950/20"
      }`}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
              isInvest ? "bg-emerald-500/15" : "bg-red-500/15"
            }`}
          >
            {isInvest ? (
              <TrendingUp size={20} className="text-emerald-400" />
            ) : (
              <TrendingDown size={20} className="text-red-400" />
            )}
            <span
              className={`text-2xl font-bold tracking-tight ${
                isInvest ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {verdict}
            </span>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">Verdict for</p>
            <p className="text-base font-semibold text-zinc-100">{companyName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium mb-1">Score</p>
          <p
            className={`text-3xl font-bold tabular-nums ${
              score >= 70 ? "text-emerald-400" : score >= 50 ? "text-yellow-400" : "text-red-400"
            }`}
          >
            {score}
            <span className="text-sm text-zinc-600 font-normal">/100</span>
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
        {reasoning}
      </p>
    </div>
  );
}
