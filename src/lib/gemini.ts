import { GoogleGenerativeAI } from "@google/generative-ai";

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
    client = new GoogleGenerativeAI(apiKey);
  }
  return client;
}

export async function callGemini(prompt: string, retries = 3): Promise<string> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
    generationConfig: {
      temperature: 0.3,
    },
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (err: any) {
      const isTransient =
        err?.status === 503 ||
        err?.status === 429 ||
        err?.message?.includes("503") ||
        err?.message?.includes("high demand") ||
        err?.message?.includes("rate limit") ||
        err?.message?.includes("fetch failed") ||
        err?.message?.includes("Resource has been exhausted");


      if (isTransient && attempt < retries) {
        const delay = attempt * 2000;
        console.warn(`[Gemini] Attempt ${attempt} hit transient error (${err?.status || err?.message?.slice(0, 40)}), retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }

  throw new Error("Failed to generate content after retries");
}

export const geminiSearch = callGemini;

