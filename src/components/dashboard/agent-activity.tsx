"use client";

import { useDashboardStore } from "@/lib/store";
import { Activity, Brain, Shield, TrendingUp, RefreshCcw, Scale } from "lucide-react";
import type { AgentRole } from "@/lib/agents/types";

const agentIcons: Record<AgentRole, typeof Brain> = {
  research: Brain,
  risk: Shield,
  trading: TrendingUp,
  compliance: Scale,
  portfolio: RefreshCcw,
};

const agentColors: Record<AgentRole, string> = {
  research: "text-violet-400",
  risk: "text-amber-400",
  trading: "text-emerald-400",
  compliance: "text-cyan-400",
  portfolio: "text-blue-400",
};

const typeColors: Record<string, string> = {
  analysis: "border-blue-500/30 bg-blue-500/5",
  signal: "border-emerald-500/30 bg-emerald-500/5",
  action: "border-violet-500/30 bg-violet-500/5",
  alert: "border-red-500/30 bg-red-500/5",
  rebalance: "border-amber-500/30 bg-amber-500/5",
};

export function AgentActivity() {
  const { messages } = useDashboardStore();

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-violet-400" />
        <h2 className="text-sm font-medium text-[var(--muted-foreground)]">
          Agent Activity
        </h2>
        <span className="ml-auto text-xs text-[var(--muted-foreground)]">
          {messages.length} messages
        </span>
      </div>

      <div className="flex max-h-80 flex-col gap-1.5 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-xs text-[var(--muted-foreground)]">
            No agent activity yet. Run a cycle to start.
          </p>
        ) : (
          messages.slice(0, 30).map((msg) => {
            const Icon = agentIcons[msg.agent];
            const color = agentColors[msg.agent];
            const typeColor = typeColors[msg.type] || "border-[var(--border)] bg-[var(--muted)]";

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2 rounded-lg border px-3 py-2 ${typeColor}`}
              >
                <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${color}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-medium uppercase ${color}`}>
                      {msg.agent}
                    </span>
                    <span className="text-[10px] text-[var(--muted-foreground)]">
                      {msg.type}
                    </span>
                    {msg.confidence && (
                      <span className="text-[10px] text-[var(--muted-foreground)]">
                        {(msg.confidence * 100).toFixed(0)}%
                      </span>
                    )}
                    <span className="ml-auto text-[10px] text-[var(--muted-foreground)]">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed">{msg.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
