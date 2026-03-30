"use client";

import { useDashboardStore } from "@/lib/store";
import { BarChart3 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function PnlChart() {
  const { pnlHistory } = useDashboardStore();

  return (
    <div className="glass-card border border-white/10 p-6">
      <div className="flex items-center justify-between mb-5">
        <p className="flex items-center gap-2 text-xs font-medium text-amber-400 uppercase tracking-wider">
          <BarChart3 className="h-3.5 w-3.5" />
          Portfolio Value
        </p>
        {pnlHistory.length > 0 && (
          <span className="text-[10px] text-muted-foreground/50 font-mono">
            {pnlHistory.length} points
          </span>
        )}
      </div>
      <div className="h-56">
        {pnlHistory.length < 2 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground/15 mb-3" />
            <p className="text-sm text-muted-foreground">Run cycles to see portfolio chart</p>
            <p className="text-xs text-muted-foreground/50 mt-1">Data appears after 2+ cycles</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pnlHistory} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.80 0.15 85)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="oklch(0.80 0.15 85)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.20 0.01 260 / 0.5)" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: "oklch(0.50 0 0)" }}
                axisLine={{ stroke: "oklch(0.20 0.01 260 / 0.5)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "oklch(0.50 0 0)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`}
                width={55}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.14 0.01 260)",
                  border: "1px solid oklch(0.25 0.015 260 / 0.5)",
                  borderRadius: "10px",
                  fontSize: "12px",
                  boxShadow: "0 8px 30px oklch(0 0 0 / 0.4)",
                }}
                labelStyle={{ color: "oklch(0.50 0 0)" }}
                formatter={(value) => [`$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, "Value"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="oklch(0.80 0.15 85)"
                strokeWidth={2}
                fill="url(#pnlGradient)"
                dot={false}
                activeDot={{ r: 4, fill: "oklch(0.80 0.15 85)", stroke: "oklch(0.14 0.01 260)", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
