import { Confidence, Verdict } from "@/types";
import { TrendingUp, TrendingDown, Volume2, VolumeX } from "lucide-react";

interface VerdictCardProps {
  verdict: Verdict;
  reasoning: string;
  companyName: string;
  score: number;
  confidence?: Confidence;
  isMuted?: boolean;
  isSpeaking?: boolean;
  onToggleSpeech?: () => void;
}

export default function VerdictCard({
  verdict,
  reasoning,
  companyName,
  score,
  confidence,
  isMuted = false,
  isSpeaking = false,
  onToggleSpeech,
}: VerdictCardProps) {
  const isInvest = verdict === "INVEST";

  const confidenceColor =
    confidence === "HIGH"
      ? "text-emerald-700 bg-emerald-100/80 border-emerald-300"
      : confidence === "MEDIUM"
      ? "text-amber-700 bg-amber-100/80 border-amber-300"
      : "text-rose-700 bg-rose-100/80 border-rose-300";

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
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Verdict for</p>
              {confidence && (
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${confidenceColor}`}>
                  {confidence} Confidence
                </span>
              )}
            </div>
            <p className="text-base font-semibold text-slate-900">{companyName}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {onToggleSpeech && (
            <button
              type="button"
              onClick={onToggleSpeech}
              title={
                isSpeaking
                  ? "Stop speech summary"
                  : isMuted
                  ? "Unmute & replay Biddu summary"
                  : "Listen to Biddu summary"
              }
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all border ${
                isSpeaking
                  ? "bg-blue-600 text-white border-blue-600 animate-pulse shadow-sm"
                  : isMuted
                  ? "bg-white/80 text-slate-400 border-slate-200 hover:text-slate-700 hover:bg-white"
                  : "bg-white/90 text-blue-700 border-blue-200 hover:bg-blue-50 shadow-xs"
              }`}
            >
              {isSpeaking ? (
                <Volume2 size={16} className="animate-bounce" />
              ) : isMuted ? (
                <VolumeX size={16} />
              ) : (
                <Volume2 size={16} />
              )}
              <span>{isSpeaking ? "Speaking" : isMuted ? "Muted" : "Listen"}</span>
            </button>
          )}

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
      </div>
      <p className="mt-4 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-4">
        {reasoning}
      </p>
    </div>
  );
}
