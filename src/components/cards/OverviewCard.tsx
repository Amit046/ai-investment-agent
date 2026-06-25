import { Building2 } from "lucide-react";

interface OverviewCardProps {
  overview: string;
  companyName: string;
}

export default function OverviewCard({ overview, companyName }: OverviewCardProps) {
  return (
    <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] px-5 py-5">
      <div className="flex items-center gap-2 mb-4">
        <Building2 size={15} className="text-zinc-500" />
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Company Overview</h3>
      </div>
      <p className="text-xs font-medium text-zinc-500 mb-2">{companyName}</p>
      <p className="text-sm text-zinc-300 leading-relaxed">{overview}</p>
    </div>
  );
}
