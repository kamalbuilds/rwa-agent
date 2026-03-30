import { NextResponse, NextRequest } from "next/server";
import { getAgentEconomy } from "@/lib/x402/agent-economy";
import { getLeaderboard, getAllAgents, getAgentBalance, getAgentPaymentHistory } from "@/lib/x402/registry";
import { getComplianceAuditLog } from "@/lib/x402/compliance-screening";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get("endpoint");
    const agentId = searchParams.get("agentId");
    const economy = getAgentEconomy();

    // GET /api/x402 - Return agent economy state
    if (!endpoint) {
      return NextResponse.json({
        agentIdentities: getAllAgents(),
        leaderboard: getLeaderboard(),
        globalLedger: economy.getGlobalLedger(),
        totalVolume: economy.getTotalVolume(),
        timestamp: Date.now(),
      });
    }

    // GET /api/x402?endpoint=leaderboard
    if (endpoint === "leaderboard") {
      return NextResponse.json({
        leaderboard: getLeaderboard(),
        timestamp: Date.now(),
      });
    }

    // GET /api/x402?endpoint=agent&agentId=research-agent-01
    if (endpoint === "agent" && agentId) {
      const agent = economy.getAgent(agentId);
      if (!agent) {
        return NextResponse.json(
          { error: "Agent not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        agent,
        balance: getAgentBalance(agentId),
        paymentHistory: getAgentPaymentHistory(agentId),
        timestamp: Date.now(),
      });
    }

    // GET /api/x402?endpoint=audit
    if (endpoint === "audit") {
      return NextResponse.json({
        auditLog: getComplianceAuditLog(),
        timestamp: Date.now(),
      });
    }

    // GET /api/x402?endpoint=economy
    if (endpoint === "economy") {
      return NextResponse.json({
        snapshot: economy.getAgentEconomySnapshot(),
        globalLedger: economy.getGlobalLedger(),
        totalVolume: economy.getTotalVolume(),
        timestamp: Date.now(),
      });
    }

    return NextResponse.json(
      { error: "Unknown endpoint" },
      { status: 400 }
    );
  } catch (error) {
    console.error("x402 GET failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch x402 data", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, fromAgentId, toAgentId, amount, reason, agentId, delta } = body;
    const economy = getAgentEconomy();

    // POST /api/x402 - Trigger a payment between agents
    if (action === "payment") {
      if (!fromAgentId || !toAgentId || !amount) {
        return NextResponse.json(
          {
            error: "Missing required fields: fromAgentId, toAgentId, amount",
          },
          { status: 400 }
        );
      }

      const payment = economy.createPayment(
        fromAgentId,
        toAgentId,
        amount,
        reason || "Direct payment"
      );

      if (!payment) {
        return NextResponse.json(
          { error: "Payment failed (insufficient balance or invalid agents)" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        payment,
        fromBalance: getAgentBalance(fromAgentId),
        toBalance: getAgentBalance(toAgentId),
        timestamp: Date.now(),
      });
    }

    // POST /api/x402 - Update reputation
    if (action === "updateReputation") {
      if (!agentId || delta === undefined) {
        return NextResponse.json(
          { error: "Missing required fields: agentId, delta" },
          { status: 400 }
        );
      }

      economy.updateReputation(agentId, delta);
      const agent = economy.getAgent(agentId);

      return NextResponse.json({
        success: true,
        agent,
        timestamp: Date.now(),
      });
    }

    return NextResponse.json(
      { error: "Unknown action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("x402 POST failed:", error);
    return NextResponse.json(
      { error: "Failed to process x402 request", details: String(error) },
      { status: 500 }
    );
  }
}
