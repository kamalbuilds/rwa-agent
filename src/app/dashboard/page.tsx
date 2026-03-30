"use client";

import { useEffect } from "react";
import { useDashboardStore } from "@/lib/store";
import { PortfolioOverview } from "@/components/dashboard/portfolio-overview";
import { AgentActivity } from "@/components/dashboard/agent-activity";
import { RWAYields } from "@/components/dashboard/rwa-yields";
import { RiskPanel } from "@/components/dashboard/risk-panel";
import { PositionsTable } from "@/components/dashboard/positions-table";
import { PnlChart } from "@/components/dashboard/pnl-chart";
import { AgentEconomy } from "@/components/dashboard/agent-economy";
import {
  BarChart3,
  Play,
  Pause,
  RefreshCcw,
  Zap,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const {
    portfolio,
    cycleNumber,
    isRunning,
    isLoading,
    error,
    chainStatus,
    runCycle,
    startAutorun,
    stopAutorun,
    fetchChainStatus,
    fetchX402Data,
  } = useDashboardStore();

  useEffect(() => {
    runCycle();
    fetchChainStatus();
    fetchX402Data();
    const chainInterval = setInterval(fetchChainStatus, 15000);
    const x402Interval = setInterval(fetchX402Data, 20000);
    return () => {
      clearInterval(chainInterval);
      clearInterval(x402Interval);
    };
  }, [runCycle, fetchChainStatus, fetchX402Data]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="nav-glass sticky top-0 z-50 flex items-center justify-between px-4 lg:px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <h1 className="text-base font-semibold">RWA Agent</h1>
          <span className="glow-badge text-[10px] font-medium px-2 py-0.5 rounded-full text-primary">
            BNB Chain
          </span>
          {cycleNumber > 0 && (
            <span className="text-xs text-muted-foreground font-mono">
              Cycle #{cycleNumber}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Chain Status */}
          {chainStatus && (
            <div className="hidden lg:flex items-center gap-3 mr-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${chainStatus.connected ? "pulse-dot" : "bg-red-400"}`} />
                <span>{chainStatus.connected ? "Connected" : "Offline"}</span>
              </div>
              {chainStatus.connected && (
                <>
                  <span className="text-border/30">|</span>
                  <span className="font-mono">Block #{chainStatus.blockNumber}</span>
                  <span className="text-border/30">|</span>
                  <span className="font-mono">Gas: {chainStatus.gasPrice}</span>
                  <span className="text-border/30">|</span>
                  <span className="text-primary font-semibold font-mono">BNB ${chainStatus.bnbPrice.toFixed(2)}</span>
                </>
              )}
            </div>
          )}

          <button
            onClick={runCycle}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border/50 text-sm font-medium hover:bg-card/50 transition-colors disabled:opacity-50"
          >
            <RefreshCcw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Run Cycle
          </button>

          <button
            onClick={isRunning ? stopAutorun : startAutorun}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isRunning
                ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {isRunning ? (
              <><Pause className="h-3.5 w-3.5" /> Stop</>
            ) : (
              <><Play className="h-3.5 w-3.5" /> Auto</>
            )}
          </button>

          {isRunning && (
            <div className="glow-badge flex items-center gap-1.5 px-2.5 py-1 rounded-full">
              <Zap className="h-3 w-3 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">Live</span>
            </div>
          )}
        </div>
      </header>

      {error && (
        <div className="border-b border-destructive/20 bg-destructive/5 px-6 py-2 text-center text-xs text-destructive">
          {error}
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4">
          {/* Row 1: Portfolio + Risk */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PortfolioOverview />
            </div>
            <RiskPanel />
          </div>

          {/* Row 2: Chart + Yields */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PnlChart />
            </div>
            <RWAYields />
          </div>

          {/* Row 3: Positions */}
          <PositionsTable />

          {/* Row 4: Agent Activity */}
          <AgentActivity />

          {/* Row 5: Agent Economy */}
          <div className="border-t border-white/5 pt-6 mt-6">
            <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-4 px-2">
              x402 Agent Economy
            </h2>
            <AgentEconomy />
          </div>
        </div>
      </div>
    </div>
  );
}
