// src/app/api/research/route.ts

import { NextRequest, NextResponse } from "next/server";
import { buildGraph } from "@/agent/graph";
import { ApiErrorResponse, ApiSuccessResponse } from "@/types";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName } = body;

    if (!companyName || typeof companyName !== "string" || companyName.trim() === "") {
      const error: ApiErrorResponse = {
        success: false,
        error: "Company name is required.",
      };
      return NextResponse.json(error, { status: 400 });
    }

    const sanitized = companyName.trim().slice(0, 100);
    console.log(`[API] Research request for: ${sanitized}`);

    const graph = buildGraph();
    const finalState = await graph.invoke({
      companyName: sanitized,
      rawResearch: null,
      report: null,
    });

    if (!finalState.report) {
      const error: ApiErrorResponse = {
        success: false,
        error: "The AI agent failed to generate a report. Please try again.",
      };
      return NextResponse.json(error, { status: 500 });
    }

    const success: ApiSuccessResponse = {
      success: true,
      report: finalState.report,
    };

    return NextResponse.json(success, { status: 200 });
  } catch (error) {
    console.error("[API] Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    const response: ApiErrorResponse = {
      success: false,
      error: `Research failed: ${errorMessage}`,
    };
    return NextResponse.json(response, { status: 500 });
  }
}
