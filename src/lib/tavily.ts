import { TavilyResponse } from "@/types";

export async function tavilySearch(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) throw new Error("TAVILY_API_KEY is not set");

  try {
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
      console.error(`Tavily search failed for query: ${query}`);
      return "";
    }

    const data: TavilyResponse = await response.json();

    return data.results
      .map((r) => `[${r.title}]\n${r.content}`)
      .join("\n\n");
  } catch (err) {
    console.error(`Tavily error for query "${query}":`, err);
    return "";
  }
}
