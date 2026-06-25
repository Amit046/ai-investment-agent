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
      className={`rounded-xl border px-6 py-6 shadow-sm ${
        isInvest
          ? "border-emerald-200 bg-emerald-50"
          : "border-red-200 bg-red-50"
      }`}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
              isInvest ? "bg-emerald-100" : "bg-red-100"
            }`}
          >
            {isInvest ? (
              <TrendingUp size={20} className="text-emerald-600" />
            ) : (
              <TrendingDown size={20} className="text-red-600" />
            )}
            <span
              className={`text-2xl font-bold tracking-tight ${
                isInvest ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {verdict}
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Verdict for</p>
            <p className="text-base font-semibold text-slate-900">{companyName}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-medium mb-1">Score</p>
          <p
            className={`text-3xl font-bold tabular-nums ${
              score >= 70 ? "text-emerald-600" : score >= 50 ? "text-yellow-500" : "text-red-600"
            }`}
          >
            {score}
            <span className="text-sm text-slate-400 font-normal">/100</span>
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-4">
        {reasoning}
      </p>
    </div>
  );
}