import { TrendingUp } from "lucide-react";

interface PositiveFactorsCardProps {
  positiveFactors: string[];
}

export default function PositiveFactorsCard({ positiveFactors }: PositiveFactorsCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={15} className="text-emerald-600" />
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Positive Factors</h3>
      </div>
      <ul className="flex flex-col gap-2.5">
        {positiveFactors.map((factor, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-sm text-slate-700 leading-relaxed">{factor}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}