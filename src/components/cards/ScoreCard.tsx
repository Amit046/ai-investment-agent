import { Verdict } from "@/types";

interface ScoreCardProps {
  score: number;
  verdict: Verdict;
}

export default function ScoreCard({ score }: ScoreCardProps) {
  const barColor = score >= 70 ? "bg-emerald-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500";
  const label = score >= 70 ? "Strong fundamentals" : score >= 50 ? "Moderate fundamentals" : "Weak fundamentals";
  const textColor = score >= 70 ? "text-emerald-600" : score >= 50 ? "text-yellow-500" : "text-red-600";

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Investment Score</h3>
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <div className="flex items-end gap-3">
        <span className={`text-5xl font-bold tabular-nums ${textColor}`}>{score}</span>
        <span className="text-slate-400 text-lg mb-1">/ 100</span>
      </div>
      <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs text-slate-300">0</span>
        <span className="text-xs text-slate-300">50</span>
        <span className="text-xs text-slate-300">100</span>
      </div>
    </div>
  );
}