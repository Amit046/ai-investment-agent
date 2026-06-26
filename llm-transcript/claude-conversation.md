You are a Senior Full Stack AI Engineer helping me build a take-home assignment.
IMPORTANT RULES:
- Do NOT over-engineer this project
- This should look like a strong student project built in 4-5 days
- I must be able to explain every part in an interview
- Avoid enterprise-level complexity
- Build step by step, wait for my approval at each phase
- Do NOT generate code until all phases are approved
PROJECT: AI Investment Research Agent
WHAT IT DOES:
User enters a company name → AI researches it → generates investment report with:
- Company Overview
- Recent News Summary
- Positive Factors
- Risk Factors
- Investment Score (0-100)
- Final Verdict: INVEST or PASS
- Reasoning
TECH STACK:
- Frontend: Next.js 15, TypeScript, Tailwind CSS
- Backend: Next.js API Routes
- AI: Gemini 1.5 Flash
- Search: Tavily Search API
- AI Framework: LangGraph.js
- Deployment: Render or Vercel
DO NOT USE:
- PostgreSQL, MongoDB, Redis
- Docker, AWS
- Authentication or user accounts
- Real-time stock APIs
- Financial Modeling Prep or Alpha Vantage
- Complex financial modeling
LANGGRAPH WORKFLOW:
Only 2 nodes:
Research Node (4 parallel Tavily searches) 
→ Decision Node (Gemini analyzes and generates report)
→ Final Report
UI THEME:
- White and blue light theme
- Clean modern finance style
- bg-slate-50 background
- Blue accents (blue-600)
- White cards with slate-200 borders
- shadow-sm on cards
PAGE LAYOUT:
- Header: white bg, blue icon, border-bottom
- Hero section: title + subtitle
- Search bar: white input + blue button
- Loading state: animated steps
- Results: 6 cards in grid layout
  1. VerdictCard (full width, green/red based on verdict)
  2. OverviewCard + NewsCard (2 column)
  3. PositiveFactorsCard + RiskFactorsCard (2 column)
  4. ScoreCard (full width, progress bar)
CARD STYLING:
- bg-white
- border border-slate-200
- rounded-xl
- shadow-sm
- px-5 py-5
FOLDER STRUCTURE:
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── api/research/route.ts
├── agent/
│   ├── graph.ts
│   ├── state.ts
│   └── nodes/
│       ├── researchNode.ts
│       └── decisionNode.ts
├── lib/
│   ├── tavily.ts
│   └── gemini.ts
├── types/index.ts
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
ENV VARIABLES NEEDED:
- GEMINI_API_KEY (from aistudio.google.com)
- TAVILY_API_KEY (from app.tavily.com)
WHAT TO GENERATE FINALLY:
- Every file with complete code
- README.md with all sections
- .env.example
- .gitignore
- package.json
- Setup and run instructions
- Deployment guide for Render
README SECTIONS:
- Overview
- How to run it
- How it works + architecture
- Key decisions and tradeoffs
- Example runs (3 companies)
- What I would improve
- AI usage section
Now start with Phase 1: Requirements and Scope only.
Do not generate any code.
Wait for my approval before moving to next phase.

Show less
10:48 AM
Phase 1: Requirements & Scope
What We're Building
A single-page web app where a user types a company name, an AI agent researches it using live web search, and returns a structured investment report — all in under 30 seconds.

Scope Boundaries
In scope:

One input → one report, no history, no persistence
4 parallel Tavily searches per query (overview, news, financials, risks)
Gemini analyzes all search results and generates the report
6 display cards with clean finance UI
Single API route, no auth, no DB
Out of scope:

Saving past reports
User accounts or login
Real stock prices or charts
Comparing multiple companies
Mobile-optimized layout (works, but desktop-first)
Data Flow
User types "Apple" 
  → POST /api/research 
    → LangGraph kicks off
      → Research Node: 4 Tavily searches run in parallel
          1. "Apple company overview business model"
          2. "Apple latest news 2025"
          3. "Apple financials revenue growth"
          4. "Apple risks challenges competition"
      → Decision Node: Gemini gets all 4 search results
          → Returns structured JSON report
  → Frontend renders 6 cards
What the Report Contains
Field	Type	Notes
companyName	string	Cleaned up name
overview	string	3-4 sentence summary
recentNews	string[]	4-5 bullet points
positiveFactors	string[]	4-5 bullets
riskFactors	string[]	4-5 bullets
investmentScore	number	0–100
verdict	"INVEST" or "PASS"	Score ≥ 60 → INVEST
reasoning	string	2-3 sentence justification
Key Constraints
No real-time stock data — Gemini infers financial health from news and web content
No caching — every search is fresh (acceptable for a take-home)
Score is AI-generated — not a formula, Gemini assigns it based on research. Easy to explain in interview: "It's a qualitative score, not a quant model"
Tavily free tier — 1000 searches/month, plenty for demo use
What You Can Explain in an Interview
Why LangGraph? "It gives me a clear node-based workflow I can extend — easy to add a third node later"
Why Gemini Flash? "Fast, cheap, handles long context well for summarizing search results"
Why Tavily? "Built for AI agents, returns clean text snippets, not raw HTML"
Why no DB? "Reports are ephemeral — no user value in storing them for this scope"
Does this scope match your vision? Any adjustments before Phase 2 (File Structure & Types)?

next

10:49 AM
Phase 2: File Structure & Types
Folder Structure
ai-investment-agent/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Main page, holds all state
│   │   ├── layout.tsx                # Root layout, font + metadata
│   │   ├── globals.css               # Tailwind imports only
│   │   └── api/
│   │       └── research/
│   │           └── route.ts          # Single POST endpoint
│   ├── agent/
│   │   ├── graph.ts                  # LangGraph graph definition
│   │   ├── state.ts                  # AgentState type + annotation
│   │   └── nodes/
│   │       ├── researchNode.ts       # 4 parallel Tavily searches
│   │       └── decisionNode.ts       # Gemini analysis + report gen
│   ├── lib/
│   │   ├── tavily.ts                 # Tavily client wrapper
│   │   └── gemini.ts                 # Gemini client wrapper
│   ├── types/
│   │   └── index.ts                  # All shared types in one file
│   └── components/
│       ├── SearchForm.tsx
│       ├── LoadingState.tsx
│       ├── ResultsSection.tsx
│       └── cards/
│           ├── VerdictCard.tsx
│           ├── OverviewCard.tsx
│           ├── NewsCard.tsx
│           ├── PositiveFactorsCard.tsx
│           ├── RiskFactorsCard.tsx
│           └── ScoreCard.tsx
├── .env.local                        # Your actual keys (gitignored)
├── .env.example                      # Template to share
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
All Types (src/types/index.ts)
ts
// The final report structure returned by Gemini
export interface InvestmentReport {
  companyName: string;
  overview: string;
  recentNews: string[];
  positiveFactors: string[];
  riskFactors: string[];
  investmentScore: number;       // 0–100
  verdict: "INVEST" | "PASS";
  reasoning: string;
}

// LangGraph agent state — passed between nodes
export interface AgentState {
  company: string;
  searchResults: string[];       // Raw text from all 4 Tavily searches
  report: InvestmentReport | null;
}

// API response shape from /api/research
export interface ApiResponse {
  success: boolean;
  report?: InvestmentReport;
  error?: string;
}

// Loading step for the animated UI state
export interface LoadingStep {
  id: number;
  label: string;
  status: "pending" | "active" | "done";
}
Type Relationships
User Input (string)
  → AgentState.company
    → researchNode fills AgentState.searchResults[]
      → decisionNode fills AgentState.report (InvestmentReport)
        → API returns ApiResponse
          → Frontend renders cards from InvestmentReport
What Each File Is Responsible For
File	Single Responsibility
state.ts	Defines AgentState shape only
graph.ts	Wires nodes together, exports runAgent()
researchNode.ts	Tavily calls only, no AI
decisionNode.ts	Gemini call only, no search
route.ts	Receives request, calls runAgent(), returns response
page.tsx	Holds UI state, renders components
types/index.ts	Single source of truth for all types
Ready for Phase 3: LangGraph Agent Design (node logic + prompts)?

next

10:50 AM
Phase 3: LangGraph Agent Design
Graph Overview
START → researchNode → decisionNode → END
Two nodes, one edge, no branching. Simple enough to explain in 30 seconds, solid enough to show you understand agent workflows.

State (src/agent/state.ts)
ts
AgentState {
  company: string          // set by API before graph runs
  searchResults: string[]  // filled by researchNode (4 items)
  report: InvestmentReport | null  // filled by decisionNode
}
LangGraph uses an Annotation object to define state. We'll use Annotation.Root — no reducers needed since we're just overwriting arrays, not merging them.

Node 1: Research Node
File: src/agent/nodes/researchNode.ts

What it does:
Runs 4 Tavily searches in parallel using Promise.all(). Each search targets a different angle of the company.

The 4 searches:

1. "{company} company overview business model revenue"
2. "{company} latest news 2025"
3. "{company} financial performance growth profits"
4. "{company} risks challenges competition problems"
How Tavily returns data:
Each call returns an array of results with title, url, and content. We join the content fields into one string per search, giving us 4 clean text blobs.

Output: searchResults — array of 4 strings, each ~500-1000 words of raw research.

Node 2: Decision Node
File: src/agent/nodes/decisionNode.ts

What it does:
Takes all 4 search result strings, builds one big prompt, sends to Gemini Flash, parses the JSON response.

Prompt structure:

System: You are an investment research analyst. Analyze the 
provided research and return ONLY valid JSON matching this schema...

User: Company: {company}

Research Data:
[OVERVIEW]: {searchResults[0]}
[NEWS]: {searchResults[1]}
[FINANCIALS]: {searchResults[2]}
[RISKS]: {searchResults[3]}

Return a JSON object with these exact fields:
{
  companyName, overview, recentNews[], positiveFactors[],
  riskFactors[], investmentScore (0-100), verdict ("INVEST"/"PASS"),
  reasoning
}

Rules:
- investmentScore >= 60 means verdict is INVEST
- investmentScore < 60 means verdict is PASS
- recentNews, positiveFactors, riskFactors must each have 4-5 items
- Return ONLY the JSON object, no markdown, no explanation
}
JSON parsing strategy:
Gemini sometimes wraps output in markdown fences. We strip ```json and ``` before parsing. If parse fails, we throw an error that bubbles up to the API route as a 500.

Graph (src/agent/graph.ts)
What it does:

Creates a StateGraph with AgentState
Adds both nodes
Sets edges: START → research → decision → END
Compiles and exports a runAgent(company: string) function
runAgent flow:

ts
async function runAgent(company: string): Promise<InvestmentReport> {
  const result = await graph.invoke({ 
    company, 
    searchResults: [], 
    report: null 
  })
  return result.report
}
One function call from the API route. Clean interface.

Tavily Client (src/lib/tavily.ts)
Simple wrapper around @tavily/core:

ts
search(query: string): Promise<string>
// Returns joined content from top 5 results as one string
Config: searchDepth: "basic", maxResults: 5 — fast enough, rich enough.

Gemini Client (src/lib/gemini.ts)
Simple wrapper around @google/generative-ai:

ts
generate(prompt: string): Promise<string>
// Returns raw text response from Gemini Flash
Model: gemini-1.5-flash, no streaming, no function calling — just generateContent().

Error Handling Strategy
Where	What can fail	How we handle it
Tavily search	Network/API error	try/catch, throw with message
Gemini call	API error or bad key	try/catch, throw with message
JSON parse	Malformed Gemini output	Strip fences, try parse, throw if fail
runAgent()	Any node failure	Bubbles to route.ts → returns {success: false, error}
No retries — keep it simple. If it fails, user sees an error message and can try again.

Why This Design is Easy to Explain
Why Promise.all for searches? "All 4 searches are independent, so running them in parallel cuts research time from ~8s to ~2s"
Why JSON mode via prompt instead of Gemini function calling? "Simpler to implement and debug. I control the exact schema in the prompt."
Why only 2 nodes? "Research and decision are clean separation of concerns. A third node could add a fact-check step if I extended it."
Why no LangGraph reducers? "Each node fully overwrites its output fields. No need to merge arrays."
Ready for Phase 4: API Route + Frontend Design?

next

10:52 AM
Phase 4: API Route + Frontend Design
API Route (src/app/api/research/route.ts)
Method: POST only
Input: { company: string }
Output: ApiResponse

Logic:

1. Parse request body
2. Validate company string (not empty, under 100 chars)
3. Call runAgent(company)
4. Return { success: true, report }
5. On any error → return { success: false, error: message }
No middleware, no rate limiting, no auth. Single try/catch wraps everything. Response always has a consistent shape so the frontend never gets an unexpected structure.

Page State (src/app/page.tsx)
Four UI states, one at a time:

"idle"     → show SearchForm only
"loading"  → show LoadingState (animated steps)
"result"   → show ResultsSection (6 cards)
"error"    → show error message + retry button
State variables:

ts
status: "idle" | "loading" | "result" | "error"
report: InvestmentReport | null
error: string | null
handleSearch(company) function:

1. Set status → "loading"
2. POST to /api/research
3. On success → set report, set status → "result"
4. On failure → set error message, set status → "error"
Loading State Design (src/components/LoadingState.tsx)
3 animated steps shown sequentially with a pulsing indicator:

Step 1: 🔍 Researching company...       [~2s]
Step 2: 📰 Analyzing news and data...   [~3s]  
Step 3: 🧠 Generating investment report... [~5s]
Steps auto-advance on a timer (not tied to real API progress — fake progress is fine for a take-home). Each step shows a spinning icon while active, checkmark when done.

Component Breakdown
SearchForm.tsx
Single text input + blue submit button
Controlled input with useState
Disabled while loading
Trims whitespace before submitting
Placeholder: "Enter a company name (e.g. Apple, Tesla, Nvidia)"
LoadingState.tsx
Receives company: string to show "Researching {company}..."
3 steps with useEffect timer advancing them
Clean centered layout
ResultsSection.tsx
Receives report: InvestmentReport
Renders all 6 cards in correct layout
"Search Again" button at bottom resets to idle
Card Layout:
[        VerdictCard (full width)        ]
[ OverviewCard ]  [ NewsCard            ]
[ PositiveCard ]  [ RiskCard            ]
[        ScoreCard (full width)          ]
Card Designs
VerdictCard

Full width
Green bg (bg-green-50 border-green-200) for INVEST
Red bg (bg-red-50 border-red-200) for PASS
Large verdict text + reasoning paragraph
Investment score badge in top right
OverviewCard

Title: "Company Overview"
Body: report.overview as a paragraph
Building/company icon in header
NewsCard

Title: "Recent News"
report.recentNews as a bulleted list
Newspaper icon in header
PositiveFactorsCard

Title: "Positive Factors"
report.positiveFactors as list with green checkmark icons
Green accent color
RiskFactorsCard

Title: "Risk Factors"
report.riskFactors as list with red X icons
Red accent color
ScoreCard

Title: "Investment Score"
Large score number centered: {score}/100
Full-width progress bar
Color: green if ≥60, red if <60
Label below bar: "Strong Buy" / "Caution" / "Avoid" based on range
Score Label Logic
80–100 → "Strong Buy"   (green)
60–79  → "Buy"          (light green)
40–59  → "Caution"      (yellow)
0–39   → "Avoid"        (red)
Page Layout
┌─────────────────────────────────────┐
│  HEADER: logo + "AI Investment..."  │  white bg, border-bottom
├─────────────────────────────────────┤
│  HERO: title + subtitle             │  bg-slate-50, py-12
│  SEARCH BAR                         │
├─────────────────────────────────────┤
│  CONTENT AREA                       │  
│  (idle: nothing)                    │
│  (loading: LoadingState)            │
│  (result: ResultsSection)           │
│  (error: error message)             │
├─────────────────────────────────────┤
│  FOOTER: simple 1-line text         │
└─────────────────────────────────────┘
What You Can Explain
Why fake loading steps? "The API takes 8-12s. Showing animated progress keeps the UX from feeling broken. It's a common pattern — even Google does this."
Why 4 UI states instead of a boolean? "Booleans like isLoading + hasError create invalid combinations. A single status enum is safer and cleaner."
Why no React Query or SWR? "One API call, no caching needed. useState + fetch is the simplest correct solution."
Why all cards in one ResultsSection? "Keeps the layout logic in one place. Each card is just a display component with no logic."
All 4 phases are now designed. Ready to approve and move to Phase 5: Full Code Generation?

next

10:53 AM
Generating all files now. This will be complete and ready to run.


Check available skills
Check available skills
Now let me generate all the files:


Created 27 files, ran a command
Created 27 files, ran a command
Now the README:


Created a file, ran a command
Created a file, ran a command
All 28 files generated. Let me present them:


Presented 27 files
Presented 27 files
Everything is generated. Here's a summary of what was built and how to get it running:

What Was Generated — 27 Files
Category	Files
Config	package.json, tsconfig.json, next.config.ts, tailwind.config.ts, postcss.config.mjs
Env	.env.example, .gitignore
Types	src/types/index.ts
Agent	state.ts, graph.ts, researchNode.ts, decisionNode.ts
Lib	tavily.ts, gemini.ts
API	src/app/api/research/route.ts
App	page.tsx, layout.tsx, globals.css
Components	SearchForm, LoadingState, ResultsSection + 6 cards
Docs	README.md
Run It in 4 Commands
bash
# 1. Copy files into your project folder with the correct structure
# 2. Install deps
npm install

# 3. Create .env.local with your keys
cp .env.example .env.local
# Add GEMINI_API_KEY and TAVILY_API_KEY

# 4. Start
npm run dev
One Thing to Note
The files are downloaded individually (no zip). When placing them locally, follow the folder structure exactly from Phase 2 — especially the src/agent/nodes/ and src/components/cards/ subdirectories. The @/ import alias maps to src/, which tsconfig.json handles automatically.


Readme
Document · MD 

Package
Code · JSON 

Index
TS 

State
TS 

Researchnode
TS 

Decisionnode
TS 

Graph
TS 

Tavily
TS 

Gemini
TS 

Route
TS 

Page
Code · TSX 

Layout
Code · TSX 

Searchform
Code · TSX 

Loadingstate
Code · TSX 

Resultssection
Code · TSX 

Verdictcard
Code · TSX 

Overviewcard
Code · TSX 

Newscard
Code · TSX 

Positivefactorscard
Code · TSX 

Riskfactorscard
Code · TSX 

Scorecard
Code · TSX 

.env
EXAMPLE 

.gitignore
GITIGNORE 

Tailwind.config
TS 

Tsconfig
Code · JSON 

Next.config
TS 

Postcss.config
MJS 



link: https://claude.ai/share/f48573d0-402c-4452-8191-1adb92898eaf