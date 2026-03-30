import { AgentMessage, PortfolioState, AgentDecision, RiskAssessment } from "./types";
import { runResearchCycle } from "./research";
import { runRiskCycle } from "./risk";
import { generateTradeSignals } from "./trading";
import { runComplianceCycle } from "./compliance";
import { runPortfolioCycle, getPortfolio } from "./portfolio";
import { AgentPayment, AgentIdentity } from "../x402/types";
import { getAgentEconomy } from "../x402/agent-economy";
import { chargeAgentForService, recordAgentEarnings } from "../x402/payment-protocol";

export interface CycleResult {
  messages: AgentMessage[];
  portfolio: PortfolioState;
  decisions: AgentDecision[];
  riskAssessments: RiskAssessment[];
  cycleNumber: number;
  timestamp: number;
  x402: {
    payments: AgentPayment[];
    totalVolume: string;
    agentBalances: Record<string, number>;
    agentIdentities: Record<string, AgentIdentity>;
  };
}

let cycleCount = 0;

const AGENT_IDS = {
  research: "research-agent-01",
  risk: "risk-agent-01",
  trading: "trading-agent-01",
  compliance: "compliance-agent-01",
  portfolio: "portfolio-agent-01",
};

export async function runAgentCycle(): Promise<CycleResult> {
  cycleCount++;
  const allMessages: AgentMessage[] = [];
  const economy = getAgentEconomy();

  // Phase 1: Research Agent scans market (async, fetches real on-chain data)
  const researchMessages = await runResearchCycle();
  allMessages.push(...researchMessages);
  chargeAgentForService(AGENT_IDS.research, "research", "Market data query");

  // Phase 2: Risk Agent assesses each token
  const { messages: riskMessages, assessments } = runRiskCycle();
  allMessages.push(...riskMessages);
  chargeAgentForService(AGENT_IDS.risk, "risk", "Risk assessment for portfolio");

  // Phase 3: Trading Agent generates signals
  const { messages: tradeMessages, decisions } = generateTradeSignals(
    researchMessages,
    assessments
  );
  allMessages.push(...tradeMessages);

  // Phase 4: Compliance Agent reviews decisions
  chargeAgentForService(
    AGENT_IDS.compliance,
    "compliance",
    "Wallet screening and compliance check"
  );
  const { messages: complianceMessages, approvedDecisions } = runComplianceCycle(
    decisions
  );
  allMessages.push(...complianceMessages);

  // Phase 5: Portfolio Agent executes approved trades only
  const { messages: portfolioMessages, portfolio } = runPortfolioCycle(
    approvedDecisions,
    assessments
  );
  allMessages.push(...portfolioMessages);

  // Record earnings for successful executions
  if (approvedDecisions.length > 0) {
    recordAgentEarnings(
      AGENT_IDS.portfolio,
      "5000000000000000", // 0.005 USDC for successful execution
      `Executed ${approvedDecisions.length} trades successfully`
    );

    for (const decision of approvedDecisions) {
      recordAgentEarnings(
        AGENT_IDS.trading,
        "10000000000000000", // 0.01 USDC per trade
        `Successful ${decision.action} decision for ${decision.token}`
      );
    }
  }

  // Build response with x402 data
  const cyclePayments = economy
    .getGlobalLedger()
    .filter(p => p.timestamp > Date.now() - 5000);

  const agentBalances: Record<string, number> = {};
  const agentIdentities: Record<string, AgentIdentity> = {};

  for (const [, agentId] of Object.entries(AGENT_IDS)) {
    const agent = economy.getAgent(agentId);
    if (agent) {
      agentIdentities[agentId] = agent;
      agentBalances[agentId] = Number(economy.getBalance(agentId)) / 1e15;
    }
  }

  return {
    messages: allMessages,
    portfolio,
    decisions: approvedDecisions,
    riskAssessments: assessments,
    cycleNumber: cycleCount,
    timestamp: Date.now(),
    x402: {
      payments: cyclePayments,
      totalVolume: economy.getTotalVolume(),
      agentBalances,
      agentIdentities,
    },
  };
}

export function getCurrentPortfolio(): PortfolioState {
  return getPortfolio();
}
