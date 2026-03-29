import { AgentMessage, AgentRole, AgentDecision, PortfolioState, PortfolioPosition, RiskAssessment } from "./types";
import { RWA_TOKENS } from "../rwa/tokens";

const AGENT: AgentRole = "portfolio";

function generateId() {
  return `${AGENT}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const TARGET_ALLOCATIONS: Record<string, number> = {
  USDY: 30,
  BUIDL: 20,
  PAXG: 15,
  slisBNB: 15,
  lisUSD: 10,
  ankrBNB: 10,
};

let currentPortfolio: PortfolioState | null = null;

function initPortfolio(): PortfolioState {
  const totalValue = 100000;
  const positions: PortfolioPosition[] = RWA_TOKENS.map(token => {
    const target = TARGET_ALLOCATIONS[token.symbol] || 0;
    const value = totalValue * (target / 100);
    const amount = value / token.price;
    return {
      token: token.symbol,
      amount,
      value,
      allocation: target,
      targetAllocation: target,
      apy: token.apy,
      pnl: 0,
      pnlPercent: 0,
    };
  });

  return {
    totalValue,
    dailyPnl: 0,
    dailyPnlPercent: 0,
    weeklyPnl: 0,
    weeklyPnlPercent: 0,
    avgApy: positions.reduce((sum, p) => sum + p.apy * (p.allocation / 100), 0),
    positions,
    riskScore: 25,
    lastRebalance: Date.now(),
  };
}

export function getPortfolio(): PortfolioState {
  if (!currentPortfolio) {
    currentPortfolio = initPortfolio();
  }
  return currentPortfolio;
}

export function runPortfolioCycle(
  decisions: AgentDecision[],
  riskAssessments: RiskAssessment[]
): { messages: AgentMessage[]; portfolio: PortfolioState } {
  const messages: AgentMessage[] = [];
  const portfolio = getPortfolio();

  // Simulate market movements
  for (const pos of portfolio.positions) {
    const dailyReturn = (Math.random() - 0.48) * 0.02;
    const yieldReturn = pos.apy / 365 / 100;
    const totalReturn = dailyReturn + yieldReturn;

    pos.value *= (1 + totalReturn);
    pos.pnl += pos.value * totalReturn;
    pos.pnlPercent = (pos.pnl / (pos.value - pos.pnl)) * 100;
  }

  portfolio.totalValue = portfolio.positions.reduce((sum, p) => sum + p.value, 0);
  for (const pos of portfolio.positions) {
    pos.allocation = (pos.value / portfolio.totalValue) * 100;
  }

  portfolio.dailyPnl = portfolio.positions.reduce((sum, p) => sum + p.pnl * 0.1, 0);
  portfolio.dailyPnlPercent = (portfolio.dailyPnl / portfolio.totalValue) * 100;
  portfolio.weeklyPnl = portfolio.dailyPnl * 5.2;
  portfolio.weeklyPnlPercent = portfolio.dailyPnlPercent * 5.2;
  portfolio.avgApy = portfolio.positions.reduce(
    (sum, p) => sum + p.apy * (p.allocation / 100), 0
  );

  // Apply agent decisions
  for (const decision of decisions) {
    const pos = portfolio.positions.find(p => p.token === decision.token);
    if (!pos) continue;

    if (decision.action === "buy" && decision.confidence > 0.7) {
      const increase = pos.value * 0.05;
      pos.value += increase;
      messages.push({
        id: generateId(),
        agent: AGENT,
        timestamp: Date.now(),
        type: "action",
        content: `Increased ${decision.token} position by 5% ($${increase.toFixed(2)}) per trading agent signal`,
        confidence: decision.confidence,
        data: { token: decision.token, action: "increase", amount: increase },
      });
    } else if (decision.action === "sell" && decision.confidence > 0.7) {
      const decrease = pos.value * 0.1;
      pos.value -= decrease;
      messages.push({
        id: generateId(),
        agent: AGENT,
        timestamp: Date.now(),
        type: "action",
        content: `Reduced ${decision.token} position by 10% ($${decrease.toFixed(2)}) per risk/trading signal`,
        confidence: decision.confidence,
        data: { token: decision.token, action: "decrease", amount: decrease },
      });
    }
  }

  // Check for rebalance need
  const drifts = portfolio.positions.map(p => ({
    token: p.token,
    drift: Math.abs(p.allocation - p.targetAllocation),
  }));
  const maxDrift = Math.max(...drifts.map(d => d.drift));

  if (maxDrift > 5) {
    messages.push({
      id: generateId(),
      agent: AGENT,
      timestamp: Date.now(),
      type: "rebalance",
      content: `Rebalance triggered: max drift ${maxDrift.toFixed(1)}% (${drifts.find(d => d.drift === maxDrift)?.token}). Adjusting allocations to targets.`,
      confidence: 0.9,
      data: { drifts, maxDrift },
    });

    for (const pos of portfolio.positions) {
      pos.value = portfolio.totalValue * (pos.targetAllocation / 100);
      pos.allocation = pos.targetAllocation;
    }
    portfolio.lastRebalance = Date.now();
  }

  // Recalculate totals
  portfolio.totalValue = portfolio.positions.reduce((sum, p) => sum + p.value, 0);
  for (const pos of portfolio.positions) {
    pos.allocation = (pos.value / portfolio.totalValue) * 100;
  }

  // Risk score from assessments
  const riskMap = new Map(riskAssessments.map(a => [a.token, a]));
  let weightedRisk = 0;
  for (const pos of portfolio.positions) {
    const assessment = riskMap.get(pos.token);
    if (assessment) {
      const riskVal = assessment.overallRisk === "low" ? 20 : assessment.overallRisk === "medium" ? 50 : 80;
      weightedRisk += riskVal * (pos.allocation / 100);
    }
  }
  portfolio.riskScore = Math.round(weightedRisk);

  messages.push({
    id: generateId(),
    agent: AGENT,
    timestamp: Date.now(),
    type: "analysis",
    content: `Portfolio: $${portfolio.totalValue.toFixed(2)} | APY: ${portfolio.avgApy.toFixed(2)}% | Risk: ${portfolio.riskScore}/100 | Positions: ${portfolio.positions.length}`,
    confidence: 0.95,
    data: { totalValue: portfolio.totalValue, avgApy: portfolio.avgApy, riskScore: portfolio.riskScore },
  });

  currentPortfolio = portfolio;
  return { messages, portfolio };
}
