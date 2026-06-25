import { InvestmentReport } from "@/types";
import VerdictCard from "./cards/VerdictCard";
import OverviewCard from "./cards/OverviewCard";
import NewsCard from "./cards/NewsCard";
import PositiveFactorsCard from "./cards/PositiveFactorsCard";
import RiskFactorsCard from "./cards/RiskFactorsCard";
import ScoreCard from "./cards/ScoreCard";

interface ResultsSectionProps {
  report: InvestmentReport;
}

export default function ResultsSection({ report }: ResultsSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <VerdictCard
        verdict={report.verdict}
        reasoning={report.reasoning}
        companyName={report.companyName}
        score={report.score}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OverviewCard overview={report.overview} companyName={report.companyName} />
        <NewsCard newsSummary={report.newsSummary} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PositiveFactorsCard positiveFactors={report.positiveFactors} />
        <RiskFactorsCard riskFactors={report.riskFactors} />
      </div>
      <ScoreCard score={report.score} verdict={report.verdict} />
    </div>
  );
}
