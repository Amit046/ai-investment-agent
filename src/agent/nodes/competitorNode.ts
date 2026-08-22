import { tavilySearch } from "@/lib/tavily";
import { AgentState } from "@/types";
import { callGemini, geminiSearch } from "@/lib/gemini";

export async function competitorNode(
  state: AgentState
): Promise<Partial<AgentState>> {
  const { companyName, tavilyFailed } = state;

  try {
    let combinedData = "";

    if (tavilyFailed) {
      console.log(`[CompetitorNode] Tavily search unavailable, using Gemini knowledge fallback for ${companyName}`);
      combinedData = await geminiSearch(`List the top 2 competitors of ${companyName} with their strengths, weaknesses, and market comparison.`);
    } else {
      try {
        const [comp1Data, comp2Data] = await Promise.all([
          tavilySearch(`${companyName} top competitors alternatives 2025`),
          tavilySearch(`${companyName} vs competitors market share comparison`),
        ]);
        combinedData = `${comp1Data}\n\n${comp2Data}`;
      } catch (err) {
        console.warn(`[CompetitorNode] Tavily search failed, falling back to Gemini knowledge:`, err);
        combinedData = await geminiSearch(`List the top 2 competitors of ${companyName} with their strengths, weaknesses, and market comparison.`);
      }
    }

    // Extract competitor names from search results or knowledge
    const competitorPrompt = `Based on this research about ${companyName}'s competitors, identify exactly 2 main competitors and provide a brief comparison.

Research: ${combinedData || `General industry knowledge about ${companyName}`}

Return ONLY valid JSON, no markdown:
{
  "competitors": [
    {
      "name": "Competitor 1 name",
      "strength": "Their main advantage in one sentence",
      "weakness": "Their main weakness in one sentence",
      "vsOurCompany": "How ${companyName} compares to them in one sentence"
    },
    {
      "name": "Competitor 2 name", 
      "strength": "Their main advantage in one sentence",
      "weakness": "Their main weakness in one sentence",
      "vsOurCompany": "How ${companyName} compares to them in one sentence"
    }
  ],
  "marketPosition": "Where ${companyName} stands vs competitors in 2 sentences"
}`;

    const raw = await callGemini(competitorPrompt);
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const competitorData = JSON.parse(cleaned);

    return {
      competitorAnalysis: competitorData,
    };
  } catch (err) {
    console.error("Competitor node failed:", err);
    // Graceful degradation — return empty so report still works
    return {
      competitorAnalysis: null,
    };
  }
}
