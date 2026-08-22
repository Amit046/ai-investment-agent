// src/app/api/ask/route.ts

import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, report } = body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json(
        { success: false, error: "Question is required." },
        { status: 400 }
      );
    }

    if (!report || typeof report !== "object" || !report.companyName) {
      return NextResponse.json(
        {
          success: false,
          error: "Search for a company first so Biddu has something to talk about.",
        },
        { status: 400 }
      );
    }

    const prompt = `You are "Biddu", an intelligent, objective, sharp, and friendly AI investment research assistant.
A user is reviewing an investment report and has a follow-up question.

INVESTMENT REPORT CONTEXT:
${JSON.stringify(report, null, 2)}

USER'S FOLLOW-UP QUESTION:
${question.trim()}

INSTRUCTIONS:
- Answer the user's question directly, insightfully, and concisely in 2 to 4 sentences based on the report context.
- Keep a professional, encouraging, and natural conversational tone.
- Do NOT use markdown headers, asterisks/bold (**), or bullet lists; write pure natural sentences ideal for reading and text-to-speech.`;

    const answer = await callGemini(prompt);

    // Clean any accidental markdown markers
    const cleanedAnswer = answer
      .replace(/[*_#`~]+/g, "")
      .replace(/^Biddu:\s*/i, "")
      .trim();

    return NextResponse.json(
      {
        success: true,
        answer: cleanedAnswer,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API Ask] Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to answer question.";
    return NextResponse.json(
      {
        success: false,
        error: `Biddu could not answer: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
