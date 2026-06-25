import { AlertTriangle } from "lucide-react";

interface RiskFactorsCardProps {
  riskFactors: string[];
}

export default function RiskFactorsCard({ riskFactors }: RiskFactorsCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={15} className="text-red-500" />
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Risk Factors</h3>
      </div>
      <ul className="flex flex-col gap-2.5">
        {riskFactors.map((risk, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
            <span className="text-sm text-slate-700 leading-relaxed">{risk}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}