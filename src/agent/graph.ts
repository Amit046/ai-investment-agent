// src/agent/graph.ts
// LangGraph StateGraph using Annotation API (v0.2+).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { Annotation, StateGraph, END, START } from "@langchain/langgraph";
import { researchNode } from "./nodes/researchNode";
import { competitorNode } from "./nodes/competitorNode";
import { decisionNode } from "./nodes/decisionNode";
import { CompetitorAnalysis, InvestmentReport, RawResearch } from "@/types";

const AgentAnnotation = Annotation.Root({
  companyName: Annotation<string>({
    reducer: (_prev: string, next: string) => next,
    default: () => "",
  }),
  rawResearch: Annotation<RawResearch | null>({
    reducer: (_prev: RawResearch | null, next: RawResearch | null) =>
      next !== undefined ? next : _prev,
    default: () => null,
  }),
  report: Annotation<InvestmentReport | null>({
    reducer: (
      _prev: InvestmentReport | null,
      next: InvestmentReport | null
    ) => (next !== undefined ? next : _prev),
    default: () => null,
  }),
  competitorAnalysis: Annotation<CompetitorAnalysis | null>({
    reducer: (
      _prev: CompetitorAnalysis | null,
      next: CompetitorAnalysis | null
    ) => (next !== undefined ? next : _prev),
    default: () => null,
  }),
  tavilyFailed: Annotation<boolean>({
    reducer: (_prev: boolean, next: boolean) =>
      next !== undefined ? next : _prev,
    default: () => false,
  }),
});

export type GraphState = typeof AgentAnnotation.State;

export function buildGraph() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graph = new StateGraph(AgentAnnotation) as any;

  graph.addNode("research", researchNode);
  graph.addNode("competitor", competitorNode);
  graph.addNode("decision", decisionNode);

  graph.addEdge(START, "research");
  graph.addEdge("research", "competitor");
  graph.addEdge("competitor", "decision");
  graph.addEdge("decision", END);

  return graph.compile();
}

