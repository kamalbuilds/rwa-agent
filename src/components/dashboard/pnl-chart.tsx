"use client";

import { useDashboardStore } from "@/lib/store";
import { BarChart3 } from "lucide-react";

export function PnlChart() {
  const { pnlHistory } = useDashboardStore();

  const min = pnlHistory.length > 0 ? Math.min(...pnlHistory.map(p => p.value)) : 99000;
  const max = pnlHistory.length > 0 ? Math.max(...pnlHistory.map(p => p.value)) : 101000;
  const range = max - min || 1;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-blue-400" />
        <h2 className="text-sm font-medium text-[var(--muted-foreground)]">
          Portfolio Value
        </h2>
        {pnlHistory.length > 0 && (
          <span className="ml-auto text-xs text-[var(--muted-foreground)]">
            {pnlHistory.length} data points
          </span>
        )}
      </div>

      <div className="relative h-48">
        {pnlHistory.length < 2 ? (
          <div className="flex h-full items-center justify-center text-xs text-[var(--muted-foreground)]">
            Run cycles to see portfolio value chart
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${pnlHistory.length * 20} 200`}
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {[0, 50, 100, 150, 200].map(y => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2={pnlHistory.length * 20}
                y2={y}
                stroke="var(--border)"
                strokeWidth="0.5"
              />
            ))}

            {/* Area */}
            <path
              d={`
                M 0 ${200 - ((pnlHistory[0].value - min) / range) * 180}
                ${pnlHistory.map((p, i) => `L ${i * 20} ${200 - ((p.value - min) / range) * 180}`).join(" ")}
                L ${(pnlHistory.length - 1) * 20} 200
                L 0 200
                Z
              `}
              fill="url(#chartGradient)"
            />

            {/* Line */}
            <path
              d={`M ${pnlHistory.map((p, i) => `${i * 20} ${200 - ((p.value - min) / range) * 180}`).join(" L ")}`}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />

            {/* Dots */}
            {pnlHistory.map((p, i) => (
              <circle
                key={i}
                cx={i * 20}
                cy={200 - ((p.value - min) / range) * 180}
                r="3"
                fill="#3b82f6"
              />
            ))}

            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* Y-axis labels */}
        {pnlHistory.length >= 2 && (
          <div className="absolute top-0 right-0 flex h-full flex-col justify-between text-[10px] text-[var(--muted-foreground)]">
            <span>${(max / 1000).toFixed(1)}k</span>
            <span>${(min / 1000).toFixed(1)}k</span>
          </div>
        )}
      </div>
    </div>
  );
}
