import { AgentState, InvestmentReport } from "@/types";
import { callGemini } from "@/lib/gemini";

function buildPrompt(companyName: string, research: AgentState["rawResearch"]): string {
  if (!research) throw new Error("No research data available");

  return `You are a professional investment research analyst. Your job is to analyze research data about a company and produce a structured investment report.

You must respond with ONLY valid JSON. No markdown. No code fences. No explanation. Just the raw JSON object.

Company being analyzed: ${companyName}

RESEARCH DATA:

--- COMPANY OVERVIEW ---
${research.overview || "No data available"}

--- RECENT NEWS ---
${research.news || "No data available"}

--- GROWTH OPPORTUNITIES ---
${research.opportunities || "No data available"}

--- BUSINESS RISKS ---
${research.risks || "No data available"}

Based on the research above, generate an investment report in this exact JSON format:

{
  "companyName": "${companyName}",
  "overview": "2-3 sentence factual summary of what the company does and its market position",
  "newsSummary": "2-3 sentence summary of the most relevant recent developments",
  "positiveFactors": ["factor 1", "factor 2", "factor 3", "factor 4"],
  "riskFactors": ["risk 1", "risk 2", "risk 3", "risk 4"],
  "score": 65,
  "verdict": "INVEST",
  "reasoning": "2-3 sentences explaining why this verdict was chosen based on the balance of factors and score"
}

Scoring guide:
- 70 to 100: Strong fundamentals, clear growth path, manageable risks → verdict should be INVEST
- 50 to 69: Mixed signals, some opportunity but notable risks → use judgment based on balance
- 0 to 49: High risk, weak fundamentals, or significant red flags → verdict should be PASS

Rules:
- positiveFactors must be an array of 3 to 5 strings
- riskFactors must be an array of 3 to 5 strings  
- score must be a number between 0 and 100
- verdict must be exactly "INVEST" or "PASS"
- Be honest and balanced — not every company should be INVEST`;
}

export async function decisionNode(state: AgentState): Promise<Partial<AgentState>> {
  const { companyName, rawResearch } = state;

  console.log(`[DecisionNode] Generating report for: ${companyName}`);

  const prompt = buildPrompt(companyName, rawResearch);
  const rawResponse = await callGemini(prompt);

  // Strip any accidental markdown fences Gemini might add
  const cleaned = rawResponse
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  let report: InvestmentReport;
  try {
    report = JSON.parse(cleaned);
  } catch {
    console.error("[DecisionNode] Failed to parse Gemini response:", cleaned);
    throw new Error("Failed to parse investment report from AI response");
  }

  // Basic validation
  if (!report.verdict || !["INVEST", "PASS"].includes(report.verdict)) {
    throw new Error("Invalid verdict in AI response");
  }

  if (typeof report.score !== "number" || report.score < 0 || report.score > 100) {
    report.score = 50; // fallback
  }

  console.log(`[DecisionNode] Report generated. Verdict: ${report.verdict}, Score: ${report.score}`);

  return { report };
}
