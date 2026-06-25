import { AlertTriangle } from "lucide-react";

interface RiskFactorsCardProps {
  riskFactors: string[];
}

export default function RiskFactorsCard({ riskFactors }: RiskFactorsCardProps) {
  return (
    <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] px-5 py-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={15} className="text-red-600" />
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Risk Factors</h3>
      </div>
      <ul className="flex flex-col gap-2.5">
        {riskFactors.map((risk, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
            <span className="text-sm text-zinc-300 leading-relaxed">{risk}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
