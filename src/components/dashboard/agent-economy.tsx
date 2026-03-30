"use client";

import { useDashboardStore } from "@/lib/store";
import {
  Users,
  TrendingUp,
  Wallet,
  Award,
  ArrowRight,
  Clock,
  Zap,
} from "lucide-react";

export function AgentEconomy() {
  const { x402, x402Loading } = useDashboardStore();

  if (x402Loading) {
    return (
      <div className="glass-card border border-white/10 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Zap className="h-8 w-8 text-amber-400/50 mx-auto mb-3 animate-pulse" />
            <p className="text-sm text-muted-foreground">Loading agent economy data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!x402 || !x402.agents || x402.agents.length === 0) {
    return (
      <div className="glass-card border border-white/10 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Users className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No agent economy data available</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate economy stats
  const totalPayments = x402.payments && x402.payments.length > 0 ? x402.payments.length : 0;
  const averagePayment = totalPayments > 0
    ? x402.payments!.reduce((sum, p) => sum + p.amount, 0) / totalPayments
    : 0;
  const totalAgents = x402.agents.length;

  return (
    <div className="space-y-4">
      {/* Economy Stats Header */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass-card border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Agents
            </span>
          </div>
          <p className="text-3xl font-bold text-white font-mono">{totalAgents}</p>
        </div>

        <div className="glass-card border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Volume
            </span>
          </div>
          <p className="text-3xl font-bold text-emerald-400 font-mono">
            {Number(x402.totalVolume || 0).toFixed(2)} BNB
          </p>
        </div>

        <div className="glass-card border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Avg Payment
            </span>
          </div>
          <p className="text-3xl font-bold text-blue-400 font-mono">
            {averagePayment.toFixed(4)} BNB
          </p>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-2">
          Agent Identities
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {x402.agents.map((agent) => (
            <div
              key={agent.id}
              className="glass-card border border-white/10 p-4 hover:border-amber-500/30 transition-all"
            >
              {/* Agent Header with Rank */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
                  <p className="text-xs text-muted-foreground">{agent.role}</p>
                </div>
                {agent.performanceRank <= 3 && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-400/10 border border-amber-500/20">
                    <Award className="h-3 w-3 text-amber-400" />
                    <span className="text-xs font-bold text-amber-400">#{agent.performanceRank}</span>
                  </div>
                )}
              </div>

              {/* Reputation Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Reputation</span>
                  <span className="text-xs font-mono text-amber-400">
                    {agent.reputationScore}/1000
                  </span>
                </div>
                <div className="w-full h-2 bg-card/30 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all"
                    style={{ width: `${Math.min((agent.reputationScore / 1000) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Balance
                  </span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {Number(agent.currentBalance || 0).toFixed(4)}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Earnings
                  </span>
                  <span className="text-sm font-bold text-blue-400 font-mono">
                    {Number(agent.totalEarnings || 0).toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Payments Flow */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-2">
          Recent Payments
        </p>
        <div className="glass-card border border-white/10 p-4 max-h-96 overflow-y-auto">
          {x402.payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Wallet className="h-10 w-10 text-muted-foreground/20 mb-2" />
              <p className="text-sm text-muted-foreground">No payments yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {x402.payments.slice(0, 20).map((payment, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-card/20 hover:bg-card/40 transition-colors"
                >
                  {/* From Agent */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {payment.from}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center gap-2 px-2 flex-shrink-0">
                    <ArrowRight className="h-3.5 w-3.5 text-amber-400/50" />
                  </div>

                  {/* To Agent */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {payment.to}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="flex items-end gap-2 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-emerald-400">
                        {Number(payment.amount || 0).toFixed(4)} BNB
                      </p>
                      <p className="text-[10px] text-muted-foreground/50 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {new Date(payment.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      {x402.leaderboard.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-2">
            Leaderboard
          </p>
          <div className="glass-card border border-white/10 p-4">
            <div className="space-y-2">
              {x402.leaderboard.slice(0, 5).map((agent, rank) => (
                <div key={agent.id} className="flex items-center gap-4 p-3 rounded-lg border border-white/5 bg-card/20">
                  {/* Rank Badge */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-500/30 flex-shrink-0">
                    <span className="text-sm font-bold text-amber-400">#{rank + 1}</span>
                  </div>

                  {/* Agent Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.role}</p>
                  </div>

                  {/* Reputation Score */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium text-muted-foreground">Reputation</p>
                    <p className="text-sm font-bold text-amber-400 font-mono">
                      {agent.reputationScore}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
