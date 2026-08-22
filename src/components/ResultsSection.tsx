"use client";

import { useState, useEffect } from "react";
import { CompetitorAnalysis, InvestmentReport } from "@/types";
import { AlertTriangle, Users } from "lucide-react";
import { speakText, stopSpeaking } from "@/lib/speech";
import VerdictCard from "./cards/VerdictCard";
import OverviewCard from "./cards/OverviewCard";
import NewsCard from "./cards/NewsCard";
import PositiveFactorsCard from "./cards/PositiveFactorsCard";
import RiskFactorsCard from "./cards/RiskFactorsCard";
import ScoreCard from "./cards/ScoreCard";
import AskBidduCard from "./AskBidduCard";

interface ResultsSectionProps {
  report: InvestmentReport;
  competitorAnalysis?: CompetitorAnalysis | null;
  tavilyFailed?: boolean;
}

export default function ResultsSection({
  report,
  competitorAnalysis,
  tavilyFailed = false,
}: ResultsSectionProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Speak short summary on report load if user hasn't muted
    if (!isMuted) {
      const summaryText = `Here is Biddu's investment report for ${report.companyName}. The verdict is ${report.verdict} with an investment score of ${report.score} out of 100. Key reasoning: ${report.reasoning}`;
      setIsSpeaking(true);
      speakText(summaryText, () => {
        setIsSpeaking(false);
      });
    }

    return () => {
      stopSpeaking();
    };
  }, [report.companyName, report.verdict, report.score, report.reasoning, isMuted]);

  function handleToggleSpeech() {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      setIsMuted(true);
    } else {
      setIsMuted(false);
      setIsSpeaking(true);
      const summaryText = `Here is Biddu's investment report for ${report.companyName}. The verdict is ${report.verdict} with an investment score of ${report.score} out of 100. Key reasoning: ${report.reasoning}`;
      speakText(summaryText, () => {
        setIsSpeaking(false);
      });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {tavilyFailed && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50/90 px-5 py-4 text-amber-900 shadow-sm">
          <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-900">Live Web Search Unavailable (Fallback Mode Active)</p>
            <p className="text-amber-700 text-xs mt-0.5 leading-relaxed">
              Live web search could not be reached. Research was generated using internal AI model knowledge. Confidence score is automatically downgraded to <span className="font-bold text-rose-700">LOW</span>.
            </p>
          </div>
        </div>
      )}

      <VerdictCard
        verdict={report.verdict}
        reasoning={report.reasoning}
        companyName={report.companyName}
        score={report.score}
        confidence={report.confidence}
        isMuted={isMuted}
        isSpeaking={isSpeaking}
        onToggleSpeech={handleToggleSpeech}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OverviewCard overview={report.overview} companyName={report.companyName} />
        <NewsCard newsSummary={report.newsSummary} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PositiveFactorsCard positiveFactors={report.positiveFactors} />
        <RiskFactorsCard riskFactors={report.riskFactors} />
      </div>

      {competitorAnalysis && competitorAnalysis.competitors?.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Users size={16} className="text-blue-600" />
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Competitor Analysis
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            {competitorAnalysis.competitors.map((comp, idx) => (
              <div key={idx} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5">
                <p className="text-sm font-semibold text-slate-900 mb-1">{comp.name}</p>
                <p className="text-xs text-slate-600 mb-1"><span className="font-medium text-slate-700">Advantage:</span> {comp.strength}</p>
                <p className="text-xs text-slate-600 mb-1"><span className="font-medium text-slate-700">Weakness:</span> {comp.weakness}</p>
                <p className="text-xs text-slate-500 italic mt-1.5 pt-1.5 border-t border-slate-200/60">{comp.vsOurCompany}</p>
              </div>
            ))}
          </div>
          {competitorAnalysis.marketPosition && (
            <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-3 border border-slate-100">
              <span className="font-semibold text-slate-700">Market Position:</span> {competitorAnalysis.marketPosition}
            </p>
          )}
        </div>
      )}

      <ScoreCard
        score={report.score}
        verdict={report.verdict}
        confidence={report.confidence}
        confidenceReason={report.confidenceReason}
      />

      {/* Biddu Interactive Q&A Card */}
      <AskBidduCard report={report} isMuted={isMuted} />
    </div>
  );
}


