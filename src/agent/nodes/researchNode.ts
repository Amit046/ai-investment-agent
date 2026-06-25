import { AgentState } from "@/types";
import { tavilySearch } from "@/lib/tavily";

export async function researchNode(state: AgentState): Promise<Partial<AgentState>> {
  const { companyName } = state;

  console.log(`[ResearchNode] Starting research for: ${companyName}`);

  // Run all 4 searches in parallel
  const [overview, news, opportunities, risks] = await Promise.all([
    tavilySearch(`${companyName} company overview business model revenue`),
    tavilySearch(`${companyName} latest news 2024 2025`),
    tavilySearch(`${companyName} growth opportunities market expansion future`),
    tavilySearch(`${companyName} business risks challenges problems competition`),
  ]);

  console.log(`[ResearchNode] Research complete for: ${companyName}`);

  return {
    rawResearch: { overview, news, opportunities, risks },
  };
}
