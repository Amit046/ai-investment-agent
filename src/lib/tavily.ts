import { TavilyResponse } from "@/types";

export async function tavilySearch(query: string): Promise<string> {
  // Demo toggle: force Tavily failure on demand
  if (process.env.FORCE_TAVILY_FAILURE === "true" || process.env.FORCE_TAVILY_FAILURE === "1") {
    throw new Error("[Demo Mode] Forced Tavily failure via FORCE_TAVILY_FAILURE");
  }

  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) throw new Error("TAVILY_API_KEY is not set");

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: 5,
      search_depth: "basic",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Tavily search failed (HTTP ${response.status}): ${errorBody || response.statusText}`);
  }

  const data: TavilyResponse = await response.json();
  if (!data.results || data.results.length === 0) {
    return "";
  }

  return data.results
    .map((r) => `[${r.title}]\n${r.content}`)
    .join("\n\n");
}

