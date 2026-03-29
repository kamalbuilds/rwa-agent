import { AgentMessage, AgentRole, AgentDecision, RiskAssessment } from "./types";
import { RWA_TOKENS } from "../rwa/tokens";

const AGENT: AgentRole = "trading";

function generateId() {
  return `${AGENT}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

interface TradeSignal {
  token: string;
  action: "buy" | "sell" | "hold";
  size: number;
  reason: string;
  confidence: number;
}

export function generateTradeSignals(
  researchMessages: AgentMessage[],
  riskAssessments: RiskAssessment[]
): { messages: AgentMessage[]; decisions: AgentDecision[] } {
  const messages: AgentMessage[] = [];
  const decisions: AgentDecision[] = [];

  const riskMap = new Map(riskAssessments.map(a => [a.token, a]));

  for (const token of RWA_TOKENS) {
    const risk = riskMap.get(token.symbol);
    const researchSignals = researchMessages.filter(
      m => m.data?.token === token.symbol
    );

    const avgConfidence = researchSignals.length > 0
      ? researchSignals.reduce((sum, m) => sum + (m.confidence || 0.5), 0) / researchSignals.length
      : 0.5;

    let action: TradeSignal["action"] = "hold";
    let reason = "";
    let confidence = avgConfidence;

    if (risk?.overallRisk === "high") {
      action = "sell";
      reason = `High risk assessment (${risk.alerts.join(", ")})`;
      confidence = 0.8;
    } else if (token.apy > 4 && avgConfidence > 0.6 && risk?.overallRisk === "low") {
      action = "buy";
      reason = `Strong yield (${token.apy}% APY), low risk, positive research signals`;
      confidence = Math.min(0.9, avgConfidence + 0.15);
    } else if (token.apy < 2 && avgConfidence < 0.4) {
      action = "sell";
      reason = `Low yield (${token.apy}% APY), weak signals`;
      confidence = 0.6;
    } else {
      action = "hold";
      reason = `Stable position, ${token.apy}% APY, ${risk?.overallRisk || "unknown"} risk`;
      confidence = 0.5;
    }

    const decision: AgentDecision = {
      agent: AGENT,
      action,
      token: token.symbol,
      reason,
      confidence,
      timestamp: Date.now(),
    };
    decisions.push(decision);

    const actionEmoji = action === "buy" ? "BUY" : action === "sell" ? "SELL" : "HOLD";
    messages.push({
      id: generateId(),
      agent: AGENT,
      timestamp: Date.now(),
      type: action === "hold" ? "analysis" : "signal",
      content: `[${token.symbol}] ${actionEmoji} | Confidence: ${(confidence * 100).toFixed(0)}% | ${reason}`,
      confidence,
      data: { decision },
    });
  }

  const buys = decisions.filter(d => d.action === "buy");
  const sells = decisions.filter(d => d.action === "sell");
  messages.push({
    id: generateId(),
    agent: AGENT,
    timestamp: Date.now(),
    type: "analysis",
    content: `Trade cycle summary: ${buys.length} buy, ${sells.length} sell, ${decisions.length - buys.length - sells.length} hold signals`,
    confidence: 0.85,
    data: { buys: buys.length, sells: sells.length },
  });

  return { messages, decisions };
}
