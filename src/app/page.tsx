"use client";

import { useState } from "react";
import { InvestmentReport, UIStatus, ApiResponse } from "@/types";
import SearchForm from "@/components/SearchForm";
import LoadingState from "@/components/LoadingState";
import ResultsSection from "@/components/ResultsSection";
import { TrendingUp } from "lucide-react";

export default function Home() {
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<UIStatus>("idle");
  const [report, setReport] = useState<InvestmentReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!company.trim()) return;

    setStatus("loading");
    setReport(null);
    setError(null);

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: company.trim() }),
      });

      const data: ApiResponse = await res.json();

      if (data.success) {
        setReport(data.report);
        setStatus("success");
      } else {
        setError(data.error);
        setStatus("error");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
            <TrendingUp size={16} className="text-zinc-300" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-zinc-100 tracking-tight">
              AI Investment Research Agent
            </h1>
            <p className="text-xs text-zinc-500">Powered by Gemini · LangGraph · Tavily</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Hero — only on idle */}
        {status === "idle" && (
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-zinc-100 tracking-tight mb-3">
              Research any company.
              <br />
              <span className="text-zinc-500">Get an invest or pass verdict.</span>
            </h2>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">
              Enter a company name. The agent searches the web, analyzes the data,
              and generates a structured investment report.
            </p>
          </div>
        )}

        {/* Search bar — always visible */}
        <SearchForm
          value={company}
          onChange={setCompany}
          onSubmit={handleSubmit}
          isLoading={status === "loading"}
        />

        {/* Loading */}
        {status === "loading" && (
          <div className="mt-10">
            <LoadingState companyName={company} />
          </div>
        )}

        {/* Error */}
        {status === "error" && error && (
          <div className="mt-8 rounded-xl border border-red-900/40 bg-red-950/20 px-5 py-4">
            <p className="text-sm font-medium text-red-400">Research failed</p>
            <p className="text-sm text-red-400/70 mt-1">{error}</p>
          </div>
        )}

        {/* Results */}
        {status === "success" && report && (
          <div className="mt-10">
            <ResultsSection report={report} />
          </div>
        )}
      </div>
    </main>
  );
}
