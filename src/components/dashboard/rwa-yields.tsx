"use client";

import { RWA_TOKENS, RWA_CATEGORIES } from "@/lib/rwa/tokens";
import { Coins } from "lucide-react";

export function RWAYields() {
  return (
    <div className="glass-card border border-white/10 p-6">
      <p className="flex items-center gap-2 text-xs font-medium text-amber-400 uppercase tracking-wider mb-5">
        <Coins className="h-3.5 w-3.5" />
        RWA Token Yields
      </p>
      <div className="flex flex-col gap-2">
        {RWA_TOKENS.sort((a, b) => b.apy - a.apy).map((token) => {
          const cat = RWA_CATEGORIES[token.category];
          return (
            <div
              key={token.symbol}
              className="flex items-center justify-between rounded-xl border border-border/30 bg-card/30 px-4 py-3 hover:bg-card/50 transition-colors"
            >
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{token.symbol}</span>
                  <span
                    className="text-[9px] font-medium px-1.5 py-0 rounded-full border"
                    style={{ color: cat.color, borderColor: `${cat.color}40` }}
                  >
                    {cat.label}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {token.protocol}
                </span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-emerald-400 stat-value font-mono">
                  {token.apy}%
                </span>
                <p className="text-[10px] text-muted-foreground/50">
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
