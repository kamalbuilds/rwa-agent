import { AgentMessage, PortfolioState, AgentDecision, RiskAssessment } from "./types";
import { runResearchCycle } from "./research";
import { runRiskCycle } from "./risk";
import { generateTradeSignals } from "./trading";
import { runPortfolioCycle, getPortfolio } from "./portfolio";

export interface CycleResult {
  messages: AgentMessage[];
  portfolio: PortfolioState;
  decisions: AgentDecision[];
  riskAssessments: RiskAssessment[];
  cycleNumber: number;
  timestamp: number;
}

let cycleCount = 0;

export function runAgentCycle(): CycleResult {
  cycleCount++;
  const allMessages: AgentMessage[] = [];

  // Phase 1: Research Agent scans market
  const researchMessages = runResearchCycle();
  allMessages.push(...researchMessages);

  // Phase 2: Risk Agent assesses each token
  const { messages: riskMessages, assessments } = runRiskCycle();
  allMessages.push(...riskMessages);

  // Phase 3: Trading Agent generates signals
  const { messages: tradeMessages, decisions } = generateTradeSignals(
    researchMessages,
    assessments
  );
  allMessages.push(...tradeMessages);

  // Phase 4: Portfolio Agent executes and rebalances
  const { messages: portfolioMessages, portfolio } = runPortfolioCycle(
    decisions,
    assessments
  );
  allMessages.push(...portfolioMessages);

  return {
    messages: allMessages,
    portfolio,
    decisions,
    riskAssessments: assessments,
    cycleNumber: cycleCount,
    timestamp: Date.now(),
  };
}

export function getCurrentPortfolio(): PortfolioState {
  return getPortfolio();
}
