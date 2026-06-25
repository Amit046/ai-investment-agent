import { Building2 } from "lucide-react";

interface OverviewCardProps {
  overview: string;
  companyName: string;
}

export default function OverviewCard({ overview, companyName }: OverviewCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Building2 size={15} className="text-blue-500" />
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company Overview</h3>
      </div>
      <p className="text-xs font-medium text-slate-400 mb-2">{companyName}</p>
      <p className="text-sm text-slate-700 leading-relaxed">{overview}</p>
    </div>
  );
}