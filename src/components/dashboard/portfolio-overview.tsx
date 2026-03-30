"use client";

import { useDashboardStore } from "@/lib/store";
import { TrendingUp, TrendingDown, DollarSign, Percent, Shield } from "lucide-react";

export function PortfolioOverview() {
  const { portfolio } = useDashboardStore();

  const stats = [
    {
      label: "Total Value",
      value: portfolio
        ? `$${portfolio.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : "$--",
      icon: DollarSign,
      color: "text-primary",
      borderColor: "border-primary/20",
    },
    {
      label: "Daily P&L",
      value: portfolio
        ? `${portfolio.dailyPnl >= 0 ? "+" : ""}$${portfolio.dailyPnl.toFixed(2)}`
        : "$--",
      sub: portfolio
        ? `${portfolio.dailyPnlPercent >= 0 ? "+" : ""}${portfolio.dailyPnlPercent.toFixed(2)}%`
        : "",
      icon: portfolio && portfolio.dailyPnl >= 0 ? TrendingUp : TrendingDown,
      color: portfolio && portfolio.dailyPnl >= 0 ? "text-emerald-400" : "text-red-400",
      borderColor: portfolio && portfolio.dailyPnl >= 0 ? "border-emerald-500/20" : "border-red-500/20",
    },
    {
      label: "Avg APY",
      value: portfolio ? `${portfolio.avgApy.toFixed(2)}%` : "--%",
      icon: Percent,
      color: "text-amber-400",
      borderColor: "border-amber-500/20",
    },
    {
      label: "Risk Score",
      value: portfolio ? `${portfolio.riskScore}/100` : "--/100",
      icon: Shield,
      color:
        portfolio && portfolio.riskScore < 40
          ? "text-emerald-400"
          : portfolio && portfolio.riskScore < 60
          ? "text-amber-400"
          : "text-red-400",
      borderColor:
        portfolio && portfolio.riskScore < 40
          ? "border-emerald-500/20"
          : portfolio && portfolio.riskScore < 60
          ? "border-amber-500/20"
          : "border-red-500/20",
    },
  ];

  return (
    <div className="glass-card border border-white/10 p-6">
      <p className="text-xs font-medium text-amber-400 uppercase tracking-wider mb-5">
        Portfolio Overview
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-card/50 border ${stat.borderColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <span className="text-2xl font-bold tracking-tight stat-value font-mono">{stat.value}</span>
              {stat.sub && (
                <span className={`text-xs font-medium ${stat.color}`}>{stat.sub}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
