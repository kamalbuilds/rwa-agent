export type AgentRole = "research" | "risk" | "trading" | "portfolio" | "compliance";

export interface AgentMessage {
  id: string;
  agent: AgentRole;
  timestamp: number;
  type: "analysis" | "signal" | "action" | "alert" | "rebalance";
  content: string;
  data?: Record<string, unknown>;
  confidence?: number;
}

export interface PortfolioPosition {
  token: string;
  amount: number;
  value: number;
  allocation: number;
  targetAllocation: number;
  apy: number;
  pnl: number;
  pnlPercent: number;
}

export interface PortfolioState {
  totalValue: number;
  dailyPnl: number;
  dailyPnlPercent: number;
  weeklyPnl: number;
  weeklyPnlPercent: number;
  avgApy: number;
  positions: PortfolioPosition[];
  riskScore: number;
  lastRebalance: number;
}

export interface AgentDecision {
  agent: AgentRole;
  action: "buy" | "sell" | "hold" | "rebalance";
  token: string;
  reason: string;
  confidence: number;
  timestamp: number;
}

export interface RiskAssessment {
  token: string;
  liquidityScore: number;
  depegRisk: number;
  smartContractRisk: number;
  yieldSustainability: number;
  overallRisk: "low" | "medium" | "high";
  alerts: string[];
}
