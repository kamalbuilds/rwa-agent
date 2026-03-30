"use client";

import { useDashboardStore } from "@/lib/store";
import { Activity, Brain, Shield, TrendingUp, RefreshCcw, Scale } from "lucide-react";
import type { AgentRole } from "@/lib/agents/types";

const agentConfig: Record<AgentRole, { icon: typeof Brain; color: string; borderColor: string }> = {
  research: { icon: Brain, color: "text-violet-400", borderColor: "border-violet-500/20" },
  risk: { icon: Shield, color: "text-amber-400", borderColor: "border-amber-500/20" },
  trading: { icon: TrendingUp, color: "text-emerald-400", borderColor: "border-emerald-500/20" },
  compliance: { icon: Scale, color: "text-cyan-400", borderColor: "border-cyan-500/20" },
  portfolio: { icon: RefreshCcw, color: "text-blue-400", borderColor: "border-blue-500/20" },
};

const typeColors: Record<string, string> = {
  analysis: "text-blue-400 bg-blue-400/10",
  signal: "text-emerald-400 bg-emerald-400/10",
  action: "text-violet-400 bg-violet-400/10",
  alert: "text-red-400 bg-red-400/10",
  rebalance: "text-amber-400 bg-amber-400/10",
};

export function AgentActivity() {
  const { messages } = useDashboardStore();

  return (
    <div className="glass-card border border-white/10 p-6">
      <div className="flex items-center justify-between mb-5">
        <p className="flex items-center gap-2 text-xs font-medium text-amber-400 uppercase tracking-wider">
          <Activity className="h-3.5 w-3.5" />
          Agent Activity
        </p>
        <span className="text-[10px] text-muted-foreground/50 font-mono">
          {messages.length} messages
        </span>
      </div>
      <div className="flex max-h-80 flex-col gap-1.5 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Activity className="h-10 w-10 text-muted-foreground/20 mb-3" />
            <p className="text-sm text-muted-foreground">No agent activity yet</p>
            <p className="text-xs text-muted-foreground/50 mt-1">Run a cycle to start the agents</p>
          </div>
        ) : (
          messages.slice(0, 30).map((msg) => {
            const config = agentConfig[msg.agent];
            const Icon = config.icon;
            const typeClass = typeColors[msg.type] || "text-muted-foreground bg-muted/30";

            return (
              <div
                key={msg.id}
                className="flex items-start gap-3 rounded-xl border border-border/20 bg-card/20 px-4 py-3 hover:bg-card/40 transition-colors"
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-card/50 border ${config.borderColor} mt-0.5`}>
                  <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold uppercase ${config.color}`}>
                      {msg.agent}
                    </span>
                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${typeClass}`}>
                      {msg.type}
                    </span>
                    {msg.confidence && (
                      <span className="text-[10px] text-muted-foreground/50 font-mono">
                        {(msg.confidence * 100).toFixed(0)}% conf
                      </span>
                    )}
                    <span className="ml-auto text-[10px] text-muted-foreground/40 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-foreground/70">
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
