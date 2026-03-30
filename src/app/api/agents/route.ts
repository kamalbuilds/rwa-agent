import { NextResponse } from "next/server";
import { runAgentCycle, getCurrentPortfolio } from "@/lib/agents/orchestrator";

export async function POST() {
  try {
    const result = await runAgentCycle();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Agent cycle failed:", error);
    return NextResponse.json(
      { error: "Failed to run agent cycle", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const portfolio = getCurrentPortfolio();
    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error("Portfolio fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}
