"use client";

import { useDashboardStore } from "@/lib/store";
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";

export function PortfolioOverview() {
  const { portfolio } = useDashboardStore();

  const stats = [
    {
      label: "Total Value",
      value: portfolio ? `$${portfolio.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$--",
      icon: DollarSign,
      color: "text-blue-400",
    },
    {
      label: "Daily P&L",
      value: portfolio ? `${portfolio.dailyPnl >= 0 ? "+" : ""}$${portfolio.dailyPnl.toFixed(2)}` : "$--",
      sub: portfolio ? `${portfolio.dailyPnlPercent >= 0 ? "+" : ""}${portfolio.dailyPnlPercent.toFixed(2)}%` : "",
      icon: portfolio && portfolio.dailyPnl >= 0 ? TrendingUp : TrendingDown,
      color: portfolio && portfolio.dailyPnl >= 0 ? "text-emerald-400" : "text-red-400",
    },
    {
      label: "Avg APY",
      value: portfolio ? `${portfolio.avgApy.toFixed(2)}%` : "--%",
      icon: Percent,
      color: "text-amber-400",
    },
    {
      label: "Risk Score",
      value: portfolio ? `${portfolio.riskScore}/100` : "--/100",
      icon: portfolio && portfolio.riskScore < 40 ? TrendingUp : TrendingDown,
      color: portfolio && portfolio.riskScore < 40 ? "text-emerald-400" : portfolio && portfolio.riskScore < 60 ? "text-amber-400" : "text-red-400",
    },
  ];

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <h2 className="mb-4 text-sm font-medium text-[var(--muted-foreground)]">
        Portfolio Overview
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <Icon className={`h-3.5 w-3.5 ${stat.color}`} />
                <span className="text-xs text-[var(--muted-foreground)]">
                  {stat.label}
                </span>
              </div>
              <span className="text-xl font-bold">{stat.value}</span>
              {stat.sub && (
                <span className={`text-xs ${stat.color}`}>{stat.sub}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
