"use client";

import { create } from "zustand";
import { AgentMessage, PortfolioState, AgentDecision, RiskAssessment } from "./agents/types";

interface ChainStatus {
  blockNumber: string;
  gasPrice: string;
  bnbPrice: number;
  connected: boolean;
}

export interface AgentIdentity {
  id: string;
  name: string;
  role: string;
  reputationScore: number;
  totalEarnings: number;
  currentBalance: number;
  performanceRank: number;
}

export interface AgentPayment {
  from: string;
  to: string;
  amount: number;
  reason: string;
  timestamp: number;
}

export interface X402Data {
  agents: AgentIdentity[];
  payments: AgentPayment[];
  totalVolume: number;
  leaderboard: AgentIdentity[];
}

interface DashboardState {
  portfolio: PortfolioState | null;
  messages: AgentMessage[];
  decisions: AgentDecision[];
  riskAssessments: RiskAssessment[];
  cycleNumber: number;
  isRunning: boolean;
  isLoading: boolean;
  error: string | null;
  pnlHistory: { time: string; value: number }[];
  chainStatus: ChainStatus | null;
  x402: X402Data | null;
  x402Loading: boolean;
  runCycle: () => Promise<void>;
  startAutorun: () => void;
  stopAutorun: () => void;
  fetchChainStatus: () => Promise<void>;
  fetchX402Data: () => Promise<void>;
}

let intervalId: ReturnType<typeof setInterval> | null = null;

const SEED_PORTFOLIO: PortfolioState = {
  totalValue: 105271.41,
  dailyPnl: 13.47,
  dailyPnlPercent: 0.013,
  weeklyPnl: 284.92,
  weeklyPnlPercent: 0.272,
  avgApy: 3.66,
  riskScore: 23,
  lastRebalance: Date.now() - 1000 * 60 * 47,
  positions: [
    { token: "USDY", amount: 18240.0, value: 18422.4, allocation: 17.5, targetAllocation: 18.0, apy: 4.65, pnl: 182.4, pnlPercent: 1.0 },
    { token: "BUIDL", amount: 25000.0, value: 25187.5, allocation: 23.9, targetAllocation: 24.0, apy: 4.92, pnl: 187.5, pnlPercent: 0.75 },
    { token: "PAXG", amount: 10.52, value: 32561.8, allocation: 30.9, targetAllocation: 30.0, apy: 0.0, pnl: 1048.2, pnlPercent: 3.33 },
    { token: "slisBNB", amount: 28.7, value: 17363.5, allocation: 16.5, targetAllocation: 17.0, apy: 3.12, pnl: 215.3, pnlPercent: 1.25 },
    { token: "lisUSD", amount: 8500.0, value: 8508.5, allocation: 8.1, targetAllocation: 8.0, apy: 5.21, pnl: 8.5, pnlPercent: 0.1 },
    { token: "ankrBNB", amount: 5.44, value: 3227.76, allocation: 3.1, targetAllocation: 3.0, apy: 6.48, pnl: 47.92, pnlPercent: 1.51 },
  ],
};

const SEED_MESSAGES: AgentMessage[] = [
  {
    id: "seed-msg-1",
    agent: "research",
    timestamp: Date.now() - 1000 * 60 * 3,
    type: "analysis",
    content: "BSC RWA market scan complete. BUIDL yield spread vs. T-bills holding at +42bps. PAXG/XAU basis stable at 0.03%. Recommending current allocation weights.",
    confidence: 0.87,
  },
  {
    id: "seed-msg-2",
    agent: "risk",
    timestamp: Date.now() - 1000 * 60 * 2,
    type: "signal",
    content: "Portfolio risk score: 23/100 (LOW). Depeg probability across stablecoin positions below 0.8%. Smart contract exposure within defined limits. No alerts.",
    confidence: 0.94,
  },
  {
    id: "seed-msg-3",
    agent: "compliance",
    timestamp: Date.now() - 1000 * 60 * 1,
    type: "action",
    content: "On-chain compliance screening passed for all 6 positions. AML/KYC flags: 0. All token issuers verified. Portfolio cleared for trading operations.",
    confidence: 0.99,
  },
  {
    id: "seed-msg-4",
    agent: "portfolio",
    timestamp: Date.now() - 1000 * 45,
    type: "rebalance",
    content: "Portfolio drift within 0.5% threshold on all positions. No rebalance required. Next scheduled review in 13 minutes. Daily PnL: +$13.47 (+0.013%).",
    confidence: 0.91,
  },
];

const SEED_X402_AGENTS: AgentIdentity[] = [
  { id: "agent-research", name: "Research Agent", role: "research", reputationScore: 94, totalEarnings: 0.0182, currentBalance: 0.0041, performanceRank: 1 },
  { id: "agent-risk", name: "Risk Agent", role: "risk", reputationScore: 91, totalEarnings: 0.0154, currentBalance: 0.0037, performanceRank: 2 },
  { id: "agent-compliance", name: "Compliance Agent", role: "compliance", reputationScore: 89, totalEarnings: 0.0131, currentBalance: 0.0028, performanceRank: 3 },
  { id: "agent-trading", name: "Trading Agent", role: "trading", reputationScore: 86, totalEarnings: 0.0122, currentBalance: 0.0031, performanceRank: 4 },
  { id: "agent-portfolio", name: "Portfolio Agent", role: "portfolio", reputationScore: 83, totalEarnings: 0.0096, currentBalance: 0.0024, performanceRank: 5 },
];

const SEED_X402_PAYMENTS: AgentPayment[] = [
  { from: "Portfolio Agent", to: "Research Agent", amount: 0.0012, reason: "RWA market analysis report", timestamp: Date.now() - 1000 * 60 * 8 },
  { from: "Trading Agent", to: "Risk Agent", amount: 0.0009, reason: "Pre-trade risk clearance", timestamp: Date.now() - 1000 * 60 * 5 },
  { from: "Portfolio Agent", to: "Compliance Agent", amount: 0.0007, reason: "Position compliance screening", timestamp: Date.now() - 1000 * 60 * 2 },
];

const SEED_PNL_HISTORY = [
  { time: "09:00", value: 104812.33 },
  { time: "09:30", value: 104956.78 },
  { time: "10:00", value: 105088.12 },
  { time: "10:30", value: 105044.90 },
  { time: "11:00", value: 105193.55 },
  { time: "11:30", value: 105271.41 },
];

const SEED_CHAIN_STATUS: ChainStatus = {
  blockNumber: "48031247",
  gasPrice: "3 Gwei",
  bnbPrice: 605,
  connected: true,
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  portfolio: SEED_PORTFOLIO,
  messages: SEED_MESSAGES,
  decisions: [],
  riskAssessments: [],
  cycleNumber: 0,
  isRunning: false,
  isLoading: false,
  error: null,
  pnlHistory: SEED_PNL_HISTORY,
  chainStatus: SEED_CHAIN_STATUS,
  x402: {
    agents: SEED_X402_AGENTS,
    payments: SEED_X402_PAYMENTS,
    totalVolume: 0.0685,
    leaderboard: [...SEED_X402_AGENTS].sort((a, b) => b.reputationScore - a.reputationScore),
  },
  x402Loading: false,

  runCycle: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/agents", { method: "POST" });
      if (!res.ok) throw new Error("Agent cycle failed");
      const data = await res.json();

      set(state => {
        const newHistory = [...state.pnlHistory];
        if (data.portfolio) {
          newHistory.push({
            time: new Date().toLocaleTimeString(),
            value: data.portfolio.totalValue,
          });
          if (newHistory.length > 50) newHistory.shift();
        }

        return {
          portfolio: data.portfolio,
          messages: [...data.messages, ...state.messages].slice(0, 100),
          decisions: data.decisions,
          riskAssessments: data.riskAssessments,
          cycleNumber: data.cycleNumber,
          isLoading: false,
          pnlHistory: newHistory,
        };
      });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  fetchChainStatus: async () => {
    try {
      const res = await fetch("/api/chain");
      if (!res.ok) return;
      const data = await res.json();
      set({
        chainStatus: {
          blockNumber: data.blockNumber,
          gasPrice: data.gasPrice,
          bnbPrice: data.bnbPrice,
          connected: data.connected,
        },
      });
    } catch {
      set({ chainStatus: { blockNumber: "0", gasPrice: "0", bnbPrice: 600, connected: false } });
    }
  },

  startAutorun: () => {
    const { runCycle, isRunning } = get();
    if (isRunning) return;
    set({ isRunning: true });
    runCycle();
    intervalId = setInterval(runCycle, 8000);
  },

  stopAutorun: () => {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    set({ isRunning: false });
  },

  fetchX402Data: async () => {
    set({ x402Loading: true });
    try {
      const res = await fetch("/api/x402");
      if (!res.ok) throw new Error("Failed to fetch x402 data");
      const data = await res.json();

      const weiToEth = (wei: string | number) => Number(wei) / 1e18;

      // agentIdentities may be an object keyed by ID or an array
      let rawAgents: Record<string, unknown>[] = [];
      if (Array.isArray(data.agentIdentities)) {
        rawAgents = data.agentIdentities;
      } else if (data.agentIdentities && typeof data.agentIdentities === "object") {
        rawAgents = Object.values(data.agentIdentities) as Record<string, unknown>[];
      } else if (Array.isArray(data.agents)) {
        rawAgents = data.agents;
      }

      // Transform agents to expected shape
      const agents: AgentIdentity[] = rawAgents.map((a: Record<string, unknown>, i: number) => ({
        id: (a.agentId || a.id || `agent-${i}`) as string,
        name: (a.name || "Agent") as string,
        role: (a.role || "unknown") as string,
        reputationScore: Number(a.reputation || a.reputationScore || 0),
        totalEarnings: weiToEth((a.totalEarnings as string) || "0"),
        currentBalance: weiToEth((a.currentBalance as string) || (a.stakingAmount as string) || "0"),
        performanceRank: i + 1,
      }));

      // Transform leaderboard
      const leaderboard: AgentIdentity[] = (Array.isArray(data.leaderboard) ? data.leaderboard : []).map(
        (a: Record<string, unknown>, i: number) => ({
          id: (a.agentId || a.id || `agent-${i}`) as string,
          name: (a.name || "Agent") as string,
          role: (a.role || "unknown") as string,
          reputationScore: Number(a.reputation || a.reputationScore || 0),
          totalEarnings: weiToEth((a.totalEarnings as string) || "0"),
          currentBalance: weiToEth((a.currentBalance as string) || (a.stakingAmount as string) || "0"),
          performanceRank: i + 1,
        })
      );

      // Transform payments from globalLedger
      const rawPayments = data.globalLedger || data.payments || [];
      const payments: AgentPayment[] = (Array.isArray(rawPayments) ? rawPayments : []).map(
        (p: Record<string, unknown>) => ({
          from: typeof p.from === "object" && p.from ? (p.from as Record<string, unknown>).name as string : String(p.from),
          to: typeof p.to === "object" && p.to ? (p.to as Record<string, unknown>).name as string : String(p.to),
          amount: weiToEth((p.amount as string) || "0"),
          reason: (p.reason || "") as string,
          timestamp: Number(p.timestamp || Date.now()),
        })
      );

      set({
        x402: {
          agents,
          payments,
          totalVolume: weiToEth(data.totalVolume || "0"),
          leaderboard,
        },
        x402Loading: false,
      });
    } catch (err) {
      console.error("Error fetching x402 data:", err);
      set({ x402Loading: false });
    }
  },
}));
