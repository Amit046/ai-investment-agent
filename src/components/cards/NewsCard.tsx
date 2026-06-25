import { Newspaper } from "lucide-react";

interface NewsCardProps {
  newsSummary: string;
}

export default function NewsCard({ newsSummary }: NewsCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper size={15} className="text-blue-500" />
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent News</h3>
      </div>
      <p className="text-sm text-slate-700 leading-relaxed">{newsSummary}</p>
    </div>
  );
}