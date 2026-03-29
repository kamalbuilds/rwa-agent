"use client";

import { useDashboardStore } from "@/lib/store";
import { Shield, AlertTriangle } from "lucide-react";

export function RiskPanel() {
  const { riskAssessments } = useDashboardStore();

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-4 flex items-center gap-2">
        <Shield className="h-4 w-4 text-amber-400" />
        <h2 className="text-sm font-medium text-[var(--muted-foreground)]">
          Risk Assessment
        </h2>
      </div>

      {riskAssessments.length === 0 ? (
        <p className="text-xs text-[var(--muted-foreground)]">
          Run a cycle to see risk data
        </p>
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
                ? "bg-emerald-500/10"
                : assessment.overallRisk === "medium"
                ? "bg-amber-500/10"
                : "bg-red-500/10";

            return (
              <div
                key={assessment.token}
                className={`flex items-center justify-between rounded-lg ${bgColor} px-3 py-2`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{assessment.token}</span>
                  {assessment.alerts.length > 0 && (
                    <AlertTriangle className="h-3 w-3 text-amber-400" />
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-[var(--muted-foreground)]">
                    Liq: {(assessment.liquidityScore * 100).toFixed(0)}%
                  </span>
                  <span className={`font-medium ${riskColor}`}>
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
