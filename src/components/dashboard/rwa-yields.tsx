"use client";

import { RWA_TOKENS, RWA_CATEGORIES } from "@/lib/rwa/tokens";
import { Coins } from "lucide-react";

export function RWAYields() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-4 flex items-center gap-2">
        <Coins className="h-4 w-4 text-emerald-400" />
        <h2 className="text-sm font-medium text-[var(--muted-foreground)]">
          RWA Token Yields
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        {RWA_TOKENS.sort((a, b) => b.apy - a.apy).map((token) => {
          const cat = RWA_CATEGORIES[token.category];
          return (
            <div
              key={token.symbol}
              className="flex items-center justify-between rounded-lg bg-[var(--muted)] px-3 py-2"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{token.symbol}</span>
                  <span
                    className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                    style={{
                      backgroundColor: `${cat.color}15`,
                      color: cat.color,
                    }}
                  >
                    {cat.label}
                  </span>
                </div>
                <span className="text-[10px] text-[var(--muted-foreground)]">
                  {token.protocol}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-emerald-400">
                  {token.apy}%
                </span>
                <p className="text-[10px] text-[var(--muted-foreground)]">
                  TVL: {token.tvl}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
