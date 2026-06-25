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
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Zepto, Nvidia, Reliance Industries..."
          disabled={isLoading}
          className="w-full bg-[#111111] border border-[#1e1e1e] rounded-xl pl-9 pr-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors disabled:opacity-50"
        />
      </div>
      <button
        onClick={onSubmit}
        disabled={isLoading || !value.trim()}
        className="flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-semibold px-5 py-3 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
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
