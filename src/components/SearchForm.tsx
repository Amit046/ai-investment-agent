"use client";

import { Search, Loader2 } from "lucide-react";

interface SearchFormProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function SearchForm({ value, onChange, onSubmit, isLoading }: SearchFormProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !isLoading && value.trim()) {
      onSubmit();
    }
  }

  return (
    <div className="flex gap-2 w-full">
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Zepto, Nvidia, Reliance Industries..."
          disabled={isLoading}
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors disabled:opacity-50 shadow-sm"
        />
      </div>
      <button
        onClick={onSubmit}
        disabled={isLoading || !value.trim()}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap shadow-sm"
      >
        {isLoading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Researching...
          </>
        ) : (
          "Research"
        )}
      </button>
    </div>
  );
}