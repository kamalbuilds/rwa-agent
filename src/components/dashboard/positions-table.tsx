"use client";

import { useDashboardStore } from "@/lib/store";
import { Wallet } from "lucide-react";

export function PositionsTable() {
  const { portfolio } = useDashboardStore();

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-4 flex items-center gap-2">
        <Wallet className="h-4 w-4 text-blue-400" />
        <h2 className="text-sm font-medium text-[var(--muted-foreground)]">
          Positions
        </h2>
      </div>

      {!portfolio ? (
        <p className="text-xs text-[var(--muted-foreground)]">
          No positions yet
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs text-[var(--muted-foreground)]">
                <th className="pb-2 text-left font-medium">Token</th>
                <th className="pb-2 text-right font-medium">Value</th>
                <th className="pb-2 text-right font-medium">Allocation</th>
                <th className="pb-2 text-right font-medium">Target</th>
                <th className="pb-2 text-right font-medium">APY</th>
                <th className="pb-2 text-right font-medium">P&L</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.positions.map((pos) => (
                <tr
                  key={pos.token}
                  className="border-b border-[var(--border)]/50"
                >
                  <td className="py-2.5 font-medium">{pos.token}</td>
                  <td className="py-2.5 text-right">
                    ${pos.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--muted)]">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${Math.min(100, pos.allocation)}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs">
                        {pos.allocation.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right text-xs text-[var(--muted-foreground)]">
                    {pos.targetAllocation}%
                  </td>
                  <td className="py-2.5 text-right text-emerald-400">
                    {pos.apy}%
                  </td>
                  <td
                    className={`py-2.5 text-right ${
                      pos.pnl >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {pos.pnl >= 0 ? "+" : ""}${pos.pnl.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
