"use client";

import { useEffect } from "react";
import { useDashboardStore } from "@/lib/store";
import { PortfolioOverview } from "@/components/dashboard/portfolio-overview";
import { AgentActivity } from "@/components/dashboard/agent-activity";
import { RWAYields } from "@/components/dashboard/rwa-yields";
import { RiskPanel } from "@/components/dashboard/risk-panel";
import { PositionsTable } from "@/components/dashboard/positions-table";
import { PnlChart } from "@/components/dashboard/pnl-chart";
import {
  Layers,
  Play,
  Pause,
  RefreshCcw,
  Zap,
  Link2,
} from "lucide-react";

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
  } = useDashboardStore();

  useEffect(() => {
    runCycle();
    fetchChainStatus();
    const chainInterval = setInterval(fetchChainStatus, 15000);
    return () => clearInterval(chainInterval);
  }, [runCycle, fetchChainStatus]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[var(--border)] px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
            <Layers className="h-4 w-4 text-blue-400" />
          </div>
          <h1 className="text-lg font-bold">RWA Agent</h1>
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
            BNB Chain
          </span>
          {cycleNumber > 0 && (
            <span className="text-xs text-[var(--muted-foreground)]">
              Cycle #{cycleNumber}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Chain Status */}
          {chainStatus && (
            <div className="hidden sm:flex items-center gap-3 mr-3 text-xs text-[var(--muted-foreground)]">
              <div className="flex items-center gap-1">
                <Link2 className="h-3 w-3" />
                <span className={chainStatus.connected ? "text-emerald-400" : "text-red-400"}>
                  {chainStatus.connected ? "Connected" : "Disconnected"}
                </span>
              </div>
              {chainStatus.connected && (
                <>
                  <span>Block #{chainStatus.blockNumber}</span>
                  <span>Gas: {chainStatus.gasPrice}</span>
                  <span>BNB: ${chainStatus.bnbPrice.toFixed(2)}</span>
                </>
              )}
            </div>
          )}
          <button
            onClick={runCycle}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[var(--muted)] disabled:opacity-50"
          >
            <RefreshCcw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
            Run Cycle
          </button>
          <button
            onClick={isRunning ? stopAutorun : startAutorun}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              isRunning
                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-3 w-3" /> Stop
              </>
            ) : (
              <>
                <Play className="h-3 w-3" /> Auto
              </>
            )}
          </button>
          {isRunning && (
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <Zap className="h-3 w-3" />
              <span>Live</span>
            </div>
          )}
        </div>
      </header>

      {error && (
        <div className="border-b border-red-500/20 bg-red-500/5 px-6 py-2 text-center text-xs text-red-400">
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
        </div>
      </div>
    </div>
  );
}
