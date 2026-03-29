import { AgentMessage, AgentRole, RiskAssessment } from "./types";
import { RWA_TOKENS, RWAToken } from "../rwa/tokens";

const AGENT: AgentRole = "risk";

function generateId() {
  return `${AGENT}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function assessTokenRisk(token: RWAToken): RiskAssessment {
  const baseRisk = token.risk === "low" ? 0.2 : token.risk === "medium" ? 0.5 : 0.8;
  const noise = () => (Math.random() - 0.5) * 0.15;

  const liquidityScore = Math.max(0.1, Math.min(1.0, (1 - baseRisk) + noise()));
  const depegRisk = Math.max(0, Math.min(1.0, baseRisk * 0.5 + noise()));
  const smartContractRisk = Math.max(0.05, Math.min(0.8, baseRisk * 0.6 + noise()));
  const yieldSustainability = Math.max(0.3, Math.min(1.0, (1 - baseRisk * 0.3) + noise()));

  const avgRisk = (depegRisk + smartContractRisk + (1 - liquidityScore)) / 3;
  const overallRisk: RiskAssessment["overallRisk"] =
    avgRisk < 0.3 ? "low" : avgRisk < 0.6 ? "medium" : "high";

  const alerts: string[] = [];
  if (depegRisk > 0.4) alerts.push(`Elevated depeg risk (${(depegRisk * 100).toFixed(0)}%)`);
  if (liquidityScore < 0.5) alerts.push(`Low liquidity score (${(liquidityScore * 100).toFixed(0)}%)`);
  if (smartContractRisk > 0.5) alerts.push(`Smart contract risk above threshold`);
  if (token.apy > 8) alerts.push(`High APY may be unsustainable`);

  return {
    token: token.symbol,
    liquidityScore,
    depegRisk,
    smartContractRisk,
    yieldSustainability,
    overallRisk,
    alerts,
  };
}

export function runRiskCycle(): { messages: AgentMessage[]; assessments: RiskAssessment[] } {
  const messages: AgentMessage[] = [];
  const assessments: RiskAssessment[] = [];

  for (const token of RWA_TOKENS) {
    const assessment = assessTokenRisk(token);
    assessments.push(assessment);

    const alertText = assessment.alerts.length > 0
      ? ` Alerts: ${assessment.alerts.join("; ")}`
      : " No alerts.";

    messages.push({
      id: generateId(),
      agent: AGENT,
      timestamp: Date.now(),
      type: assessment.alerts.length > 0 ? "alert" : "analysis",
      content: `[${token.symbol}] Risk: ${assessment.overallRisk.toUpperCase()} | Liquidity: ${(assessment.liquidityScore * 100).toFixed(0)}% | Depeg: ${(assessment.depegRisk * 100).toFixed(0)}% | Contract: ${(assessment.smartContractRisk * 100).toFixed(0)}%.${alertText}`,
      confidence: 0.85,
      data: { assessment },
    });
  }

  const highRiskTokens = assessments.filter(a => a.overallRisk === "high");
  if (highRiskTokens.length > 0) {
    messages.push({
      id: generateId(),
      agent: AGENT,
      timestamp: Date.now(),
      type: "alert",
      content: `HIGH RISK ALERT: ${highRiskTokens.map(t => t.token).join(", ")} flagged. Recommend reducing exposure.`,
      confidence: 0.9,
      data: { highRiskTokens: highRiskTokens.map(t => t.token) },
    });
  }

  const portfolioRisk = assessments.reduce((sum, a) => {
    const score = a.overallRisk === "low" ? 1 : a.overallRisk === "medium" ? 2 : 3;
    return sum + score;
  }, 0) / assessments.length;

  messages.push({
    id: generateId(),
    agent: AGENT,
    timestamp: Date.now(),
    type: "analysis",
    content: `Portfolio risk score: ${(portfolioRisk / 3 * 100).toFixed(0)}/100. ${portfolioRisk < 1.5 ? "Conservative, well-diversified." : portfolioRisk < 2.2 ? "Moderate risk, acceptable." : "Elevated risk, rebalance recommended."}`,
    confidence: 0.88,
    data: { portfolioRisk: portfolioRisk / 3 },
  });

  return { messages, assessments };
}
