"use client";

import { useDashboardStore } from "@/lib/store";
import { Wallet } from "lucide-react";

export function PositionsTable() {
  const { portfolio } = useDashboardStore();

  return (
    <div className="glass-card border border-white/10 p-6">
      <div className="flex items-center justify-between mb-5">
        <p className="flex items-center gap-2 text-xs font-medium text-amber-400 uppercase tracking-wider">
          <Wallet className="h-3.5 w-3.5" />
          Positions
        </p>
        {portfolio && (
          <span className="text-[10px] text-muted-foreground/50 font-mono">
            {portfolio.positions.length} assets
          </span>
        )}
      </div>
      {!portfolio ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Wallet className="h-10 w-10 text-muted-foreground/20 mb-3" />
          <p className="text-sm text-muted-foreground">No positions yet</p>
          <p className="text-xs text-muted-foreground/50 mt-1">Run a cycle to populate</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left text-xs text-muted-foreground/50 font-medium uppercase tracking-wider py-2.5 pr-4">Token</th>
                <th className="text-right text-xs text-muted-foreground/50 font-medium uppercase tracking-wider py-2.5 px-4">Value</th>
                <th className="text-right text-xs text-muted-foreground/50 font-medium uppercase tracking-wider py-2.5 px-4">Allocation</th>
                <th className="text-right text-xs text-muted-foreground/50 font-medium uppercase tracking-wider py-2.5 px-4">Target</th>
                <th className="text-right text-xs text-muted-foreground/50 font-medium uppercase tracking-wider py-2.5 px-4">APY</th>
                <th className="text-right text-xs text-muted-foreground/50 font-medium uppercase tracking-wider py-2.5 pl-4">P&L</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.positions.map((pos) => {
                const drift = Math.abs(pos.allocation - pos.targetAllocation);
                return (
                  <tr key={pos.token} className="border-b border-border/20 hover:bg-card/30 transition-colors">
                    <td className="font-semibold py-3 pr-4">{pos.token}</td>
                    <td className="text-right font-mono py-3 px-4">
                      ${pos.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="text-right py-3 px-4">
                      <div className="flex items-center justify-end gap-2.5">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-border/20">
                          <div
                            className="h-full rounded-full bg-primary/60 transition-all"
                            style={{ width: `${Math.min(100, pos.allocation)}%` }}
                          />
                        </div>
                        <span className="w-12 text-right text-xs font-mono">
                          {pos.allocation.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="text-right text-xs text-muted-foreground font-mono py-3 px-4">
                      {pos.targetAllocation}%
                      {drift > 3 && (
                        <span className="ml-1.5 text-[9px] font-semibold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full">
                          DRIFT
                        </span>
                      )}
                    </td>
                    <td className="text-right font-mono text-emerald-400 py-3 px-4">
                      {pos.apy}%
                    </td>
                    <td
                      className={`text-right font-mono py-3 pl-4 ${
                        pos.pnl >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {pos.pnl >= 0 ? "+" : ""}${pos.pnl.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
