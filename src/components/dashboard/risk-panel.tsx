"use client";

import { useDashboardStore } from "@/lib/store";
import { Shield, AlertTriangle } from "lucide-react";

export function RiskPanel() {
  const { riskAssessments } = useDashboardStore();

  return (
    <div className="glass-card border border-white/10 p-6">
      <p className="flex items-center gap-2 text-xs font-medium text-amber-400 uppercase tracking-wider mb-5">
        <Shield className="h-3.5 w-3.5" />
        Risk Assessment
      </p>
      {riskAssessments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Shield className="h-10 w-10 text-muted-foreground/20 mb-3" />
          <p className="text-sm text-muted-foreground">Run a cycle to see risk data</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {riskAssessments.map((assessment) => {
            const riskColor =
              assessment.overallRisk === "low"
                ? "text-emerald-400"
                : assessment.overallRisk === "medium"
                ? "text-amber-400"
                : "text-red-400";
            const bgColor =
              assessment.overallRisk === "low"
                ? "bg-emerald-500/5 border-emerald-500/20"
                : assessment.overallRisk === "medium"
                ? "bg-amber-500/5 border-amber-500/20"
                : "bg-red-500/5 border-red-500/20";

            return (
              <div
                key={assessment.token}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${bgColor} transition-colors hover:bg-card/30`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-semibold">{assessment.token}</span>
                  {assessment.alerts.length > 0 && (
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground font-mono">
                    Liq: {(assessment.liquidityScore * 100).toFixed(0)}%
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${riskColor}`}>
                    {assessment.overallRisk.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
