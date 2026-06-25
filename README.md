# AI Investment Research Agent

An AI-powered investment research tool that analyzes any company and generates a structured invest/pass recommendation using real-time web research and LLM reasoning.

Built for the **InsideIIM × Altuni AI Labs** AI Engineer Intern assignment.

🔗 **Live Demo:** https://ai-investment-agent-6djw.onrender.com

---

## Overview

This tool takes a company name as input and runs a two-node LangGraph.js workflow:

1. **Research Node** — runs 4 parallel Tavily web searches (company overview, recent news, growth opportunities, business risks)
2. **Decision Node** — passes all research to Gemini 2.5 Flash, which generates a structured investment report

**The final report contains:**
- Company Overview
- Recent News Summary
- Positive Factors
- Risk Factors
- Investment Score (0–100)
- Final Verdict: **INVEST** or **PASS**
- Reasoning behind the verdict

No database. No authentication. No financial APIs. Each research run is stateless and independent.

---

## How To Run It

### Prerequisites
- Node.js 18+
- npm
- Gemini API key (free): https://aistudio.google.com/app/apikey
- Tavily API key (free): https://app.tavily.com

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/ai-investment-agent
cd ai-investment-agent

# 2. Install dependencies
npm install

# 3. Create env file
cp .env.example .env.local

# 4. Add your API keys to .env.local
# GEMINI_API_KEY=your_key_here
# TAVILY_API_KEY=your_key_here

# 5. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note:** Research takes 8–12 seconds per query (4 parallel searches + LLM synthesis). Vercel hobby plan has a 10s function timeout — run locally for reliable usage, or upgrade to Vercel Pro.

---

## How It Works

### Architecture

```
Browser
  │  POST /api/research { companyName }
  ▼
Next.js API Route
  │
  ▼
LangGraph StateGraph
  │
  ├── Node 1: Research
  │     ├── tavilySearch("company overview")      ─┐
  │     ├── tavilySearch("recent news")            │ Promise.all
  │     ├── tavilySearch("growth opportunities")  ─┤
  │     └── tavilySearch("business risks")        ─┘
  │     └── writes → state.rawResearch
  │
  └── Node 2: Decision
        └── builds structured prompt
        └── calls Gemini 2.5 Flash (temp: 0.3)
        └── parses JSON response
        └── writes → state.report
  │
  ▼
API returns { success: true, report: InvestmentReport }
  │
  ▼
Frontend renders 6 result cards
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes (serverless) |
| AI | Gemini 2.5 Flash |
| Search | Tavily Search API |
| AI Framework | LangGraph.js |
| Deployment | Vercel |

---

## Key Decisions & Tradeoffs

**LangGraph.js for workflow orchestration**
Chose LangGraph over a simple sequential function call because it makes the workflow explicit, traceable, and extensible. Adding a third node (e.g. competitor analysis) requires just `addNode` + `addEdge` — no restructuring. Tradeoff: slight overhead for a 2-node graph, worth it for architectural clarity.

**Tavily for web search**
Chose Tavily over SerpAPI because it returns clean pre-extracted content rather than raw HTML — no scraping needed. Free tier covers this assignment. Tradeoff: less control over source selection.

**Gemini 2.5 Flash**
Chose Flash over Pro because latency matters — 4 search results need to be synthesized quickly. Flash handles structured JSON output reliably at temperature 0.3. Tradeoff: slightly less reasoning depth than Pro, acceptable at this scope.

**Stateless architecture (no database)**
Each request is self-contained. Tradeoff: same company queried twice runs the full pipeline again. A production system would cache results by company + date — noted in improvements.

**Structured JSON output via prompt engineering**
Prompted Gemini to return only valid JSON with explicit schema. Tradeoff: occasional parse failures if the model deviates — handled with try/catch returning a clear error message.

**What I intentionally left out**
- Real-time stock prices (not needed for research agent)
- Database (no persistence requirement)
- Authentication (single-user assignment tool)
- Response streaming (adds complexity without significant UX gain)
- DCF / financial ratios (quant-level, outside scope)

---

## Example Runs

### Zepto
> Score: **74** | Verdict: **INVEST**
> "Zepto has demonstrated strong execution in India's quick commerce market with rapid city expansion and consistent GMV growth. The company's 10-minute delivery model has strong product-market fit in metro areas. Key risks include high cash burn and intense competition from Blinkit and Swiggy Instamart, but growth trajectory supports an invest thesis."

### Nvidia
> Score: **88** | Verdict: **INVEST**
> "Nvidia dominates the AI chip market with its H100/H200 GPUs, capturing the bulk of enterprise and cloud AI infrastructure spend. Data center revenue has grown over 200% YoY driven by GenAI demand. Risks include export restrictions to China and potential competition from custom silicon from hyperscalers, but current moat remains very strong."

### WeWork
> Score: **22** | Verdict: **PASS**
> "WeWork's bankruptcy filing and subsequent restructuring have left the company with significant debt obligations and a shrinking real estate footprint. The commercial real estate market continues to face headwinds from remote work trends. High execution risk and an unclear recovery path make this a clear pass at this time."

*Note: Run these yourself and paste your actual outputs here before submission.*

---

## What I Would Improve With More Time

1. **Result caching** — cache reports by company + date to avoid redundant API calls (Redis or even in-memory LRU cache)
2. **Streaming responses** — stream Gemini output token-by-token so the UI feels faster instead of a blank wait
3. **Source citations** — show which Tavily URLs informed each section, increasing transparency and trust
4. **Sector benchmarking** — add a third LangGraph node that fetches competitor data for relative comparison
5. **Score history** — simple chart showing how a company's score changes if queried over multiple dates
6. **Retry logic** — automatic retry on Tavily failures with exponential backoff

---

## AI Usage

This project was built using **Claude (Anthropic)** as the primary AI assistant throughout development.

AI was used for:
- Architecture planning across 8 phases before any code was written
- TypeScript type definitions and boilerplate
- LangGraph workflow design and implementation
- Prompt engineering for the Gemini decision node
- Component structure and Tailwind styling
- README drafting

All code was reviewed, understood, and is fully explainable. The complete LLM chat transcript is included in `/llm-transcript/claude-session.md` as required by the assignment bonus criteria.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Main page — all UI state
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Tailwind + CSS variables
│   └── api/research/route.ts    # POST /api/research
├── agent/
│   ├── graph.ts                  # LangGraph StateGraph
│   ├── state.ts                  # Initial state factory
│   └── nodes/
│       ├── researchNode.ts       # 4 parallel Tavily searches
│       └── decisionNode.ts       # Gemini analysis + JSON report
├── lib/
│   ├── tavily.ts                 # Tavily REST wrapper
│   └── gemini.ts                 # Gemini SDK wrapper
├── types/
│   └── index.ts                  # All shared TypeScript types
└── components/
    ├── SearchForm.tsx
    ├── LoadingState.tsx
    ├── ResultsSection.tsx
    └── cards/
        ├── VerdictCard.tsx
        ├── OverviewCard.tsx
        ├── NewsCard.tsx
        ├── PositiveFactorsCard.tsx
        ├── RiskFactorsCard.tsx
        └── ScoreCard.tsx
```
