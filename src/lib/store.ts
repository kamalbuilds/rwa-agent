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

export const useDashboardStore = create<DashboardState>((set, get) => ({
  portfolio: null,
  messages: [],
  decisions: [],
  riskAssessments: [],
  cycleNumber: 0,
  isRunning: false,
  isLoading: false,
  error: null,
  pnlHistory: [],
  chainStatus: null,
  x402: null,
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

      // Handle both old and new API response formats
      const agents = data.agents || data.agentIdentities || [];
      const payments = data.payments || data.globalLedger || [];
      const leaderboard = data.leaderboard || agents.slice(0, 5);

      set({
        x402: {
          agents,
          payments: Array.isArray(payments) ? payments : [],
          totalVolume: data.totalVolume || 0,
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
