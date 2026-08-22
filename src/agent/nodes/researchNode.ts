import { AgentState } from "@/types";
import { tavilySearch } from "@/lib/tavily";
import { geminiSearch } from "@/lib/gemini";

export async function researchNode(state: AgentState): Promise<Partial<AgentState>> {
  const { companyName } = state;

  console.log(`[ResearchNode] Starting research for: ${companyName}`);

  try {
    // Run all 4 searches in parallel
    const [overview, news, opportunities, risks] = await Promise.all([
      tavilySearch(`${companyName} company overview business model revenue`),
      tavilySearch(`${companyName} latest news 2024 2025`),
      tavilySearch(`${companyName} growth opportunities market expansion future`),
      tavilySearch(`${companyName} business risks challenges problems competition`),
    ]);

    console.log(`[ResearchNode] Tavily research complete for: ${companyName}`);

    return {
      rawResearch: { overview, news, opportunities, risks },
      tavilyFailed: false,
    };

  } catch (err) {
    // ── GRACEFUL DEGRADATION ──
    // Tavily failed → fallback to Gemini's own knowledge
    console.warn(`[ResearchNode] Tavily search unavailable (${err instanceof Error ? err.message : err}), falling back to Gemini knowledge`);

    const fallbackPrompt = `You are an investment analyst. Provide research data about ${companyName} based on your knowledge.
Return ONLY valid JSON without code blocks:
{
  "overview": "Detailed 2-3 paragraph overview of ${companyName}'s business model, operations, and revenue",
  "news": "Summary of recent developments, industry context, and news for ${companyName}",
  "opportunities": "Key growth opportunities and market drivers for ${companyName}",
  "risks": "Main business risks, competitive threats, and challenges facing ${companyName}"
}`;

    let parsedFallback = {
      overview: "",
      news: "",
      opportunities: "",
      risks: "",
    };

    try {
      const raw = await geminiSearch(fallbackPrompt);
      const cleaned = raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
      parsedFallback = JSON.parse(cleaned);
    } catch {
      parsedFallback = {
        overview: `${companyName} overview generated from baseline model knowledge.`,
        news: "Recent news estimated from industry baseline.",
        opportunities: "Expansion opportunities derived from sector analysis.",
        risks: "Market and operational risks derived from sector analysis.",
      };
    }

    console.log(`[ResearchNode] Gemini fallback complete for: ${companyName}`);

    return {
      rawResearch: {
        overview: parsedFallback.overview || `${companyName} overview data.`,
        news: parsedFallback.news || "News summary data.",
        opportunities: parsedFallback.opportunities || "Growth opportunities data.",
        risks: parsedFallback.risks || "Risk factors data.",
      },
      tavilyFailed: true,
    };
  }
}