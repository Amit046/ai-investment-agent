import { AgentState } from "@/types";

export function createInitialState(companyName: string): AgentState {
  return {
    companyName,
    rawResearch: null,
    report: null,
    competitorAnalysis: null,
    tavilyFailed: false,
  };
}

export type { AgentState };