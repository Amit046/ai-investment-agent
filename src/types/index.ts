// ─────────────────────────────────────────
// API REQUEST
// ─────────────────────────────────────────

export interface ResearchRequest {
  companyName: string;
}

// ─────────────────────────────────────────
// FINAL REPORT
// ─────────────────────────────────────────

export type Verdict = "INVEST" | "PASS";
export type Confidence = "HIGH" | "MEDIUM" | "LOW";

export interface InvestmentReport {
  companyName: string;
  overview: string;
  newsSummary: string;
  positiveFactors: string[];
  riskFactors: string[];
  score: number;
  verdict: Verdict;
  reasoning: string;
  confidence: Confidence;
  confidenceReason: string;
}

// ─────────────────────────────────────────
// COMPETITOR ANALYSIS
// ─────────────────────────────────────────

export interface Competitor {
  name: string;
  strength: string;
  weakness: string;
  vsOurCompany: string;
}

export interface CompetitorAnalysis {
  competitors: Competitor[];
  marketPosition: string;
}

// ─────────────────────────────────────────
// API RESPONSE
// ─────────────────────────────────────────

export interface ApiSuccessResponse {
  success: true;
  report: InvestmentReport;
  competitorAnalysis: CompetitorAnalysis | null;
  tavilyFailed: boolean;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// ─────────────────────────────────────────
// LANGGRAPH AGENT STATE
// ─────────────────────────────────────────

export interface RawResearch {
  overview: string;
  news: string;
  opportunities: string;
  risks: string;
}

export interface AgentState {
  companyName: string;
  rawResearch: RawResearch | null;
  report: InvestmentReport | null;
  competitorAnalysis: CompetitorAnalysis | null;
  tavilyFailed: boolean;
}

// ─────────────────────────────────────────
// TAVILY
// ─────────────────────────────────────────

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export interface TavilyResponse {
  results: TavilySearchResult[];
}

// ─────────────────────────────────────────
// FRONTEND UI STATE
// ─────────────────────────────────────────

export type UIStatus = "idle" | "loading" | "success" | "error";