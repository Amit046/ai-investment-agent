import { Newspaper } from "lucide-react";

interface NewsCardProps {
  newsSummary: string;
}

export default function NewsCard({ newsSummary }: NewsCardProps) {
  return (
    <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] px-5 py-5">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper size={15} className="text-zinc-500" />
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Recent News</h3>
      </div>
      <p className="text-sm text-zinc-300 leading-relaxed">{newsSummary}</p>
    </div>
  );
}
