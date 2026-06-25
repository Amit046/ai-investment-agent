import { AgentState } from "@/types";

export function createInitialState(companyName: string): AgentState {
  return {
    companyName,
    rawResearch: null,
    report: null,
  };
}
