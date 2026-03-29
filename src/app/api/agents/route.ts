import { NextResponse } from "next/server";
import { runAgentCycle, getCurrentPortfolio } from "@/lib/agents/orchestrator";

export async function POST() {
  const result = runAgentCycle();
  return NextResponse.json(result);
}

export async function GET() {
  const portfolio = getCurrentPortfolio();
  return NextResponse.json({ portfolio });
}
