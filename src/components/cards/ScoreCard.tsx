import { Confidence, Verdict } from "@/types";
import { ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";

interface ScoreCardProps {
  score: number;
  verdict: Verdict;
  confidence?: Confidence;
  confidenceReason?: string;
}

export default function ScoreCard({
  score,
  confidence = "MEDIUM",
  confidenceReason,
}: ScoreCardProps) {
  const barColor = score >= 70 ? "bg-emerald-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500";
  const label = score >= 70 ? "Strong fundamentals" : score >= 50 ? "Moderate fundamentals" : "Weak fundamentals";
  const textColor = score >= 70 ? "text-emerald-600" : score >= 50 ? "text-yellow-500" : "text-red-600";

  const confidenceBadge = {
    HIGH: {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
      icon: ShieldCheck,
    },
    MEDIUM: {
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
      icon: AlertTriangle,
    },
    LOW: {
      bg: "bg-rose-50 text-rose-700 border-rose-200",
      dot: "bg-rose-500",
      icon: ShieldAlert,
    },
  }[confidence] || {
    bg: "bg-slate-50 text-slate-700 border-slate-200",
    dot: "bg-slate-500",
    icon: ShieldCheck,
  };

  const Icon = confidenceBadge.icon;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm space-y-5">
      <div>
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

      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Analysis Confidence</span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${confidenceBadge.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${confidenceBadge.dot}`} />
            <Icon size={12} />
            {confidence}
          </span>
        </div>
        {confidenceReason && (
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {confidenceReason}
          </p>
        )}
      </div>
    </div>
  );
}