import Link from "next/link";
import {
  Brain,
  Shield,
  TrendingUp,
  RefreshCcw,
  ArrowRight,
  Layers,
  Scale,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <main className="flex max-w-3xl flex-col items-center gap-10 py-20 text-center">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 ring-1 ring-blue-500/20">
            <Layers className="h-7 w-7 text-blue-400" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              RWA Agent
            </h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              on BNB Chain
            </p>
          </div>
        </div>

        <p className="max-w-lg text-lg leading-relaxed text-[var(--muted-foreground)]">
          AI-powered multi-agent system for intelligent Real World Asset
          portfolio management. Research, assess risk, ensure compliance, trade,
          and rebalance tokenized treasuries, gold, and yield products on BNB
          Chain.
        </p>

        <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-5">
          <div className="flex flex-col items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <Brain className="h-5 w-5 text-violet-400" />
            <span className="text-sm font-medium">Research</span>
            <span className="text-xs text-[var(--muted-foreground)]">
              Yields, prices, news
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <Shield className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-medium">Risk</span>
            <span className="text-xs text-[var(--muted-foreground)]">
              Liquidity, depeg, contracts
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-medium">Trading</span>
            <span className="text-xs text-[var(--muted-foreground)]">
              PancakeSwap execution
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <Scale className="h-5 w-5 text-cyan-400" />
            <span className="text-sm font-medium">Compliance</span>
            <span className="text-xs text-[var(--muted-foreground)]">
              KYC, sanctions, audit
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <RefreshCcw className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium">Portfolio</span>
            <span className="text-xs text-[var(--muted-foreground)]">
              Auto-rebalancing
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 py-4">
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-[var(--muted-foreground)]">RWA Tokens</span>
              <p className="text-lg font-bold">6</p>
            </div>
            <div className="h-8 w-px bg-[var(--border)]" />
            <div>
              <span className="text-[var(--muted-foreground)]">Avg APY</span>
              <p className="text-lg font-bold text-emerald-400">3.8%</p>
            </div>
            <div className="h-8 w-px bg-[var(--border)]" />
            <div>
              <span className="text-[var(--muted-foreground)]">Chain</span>
              <p className="text-lg font-bold text-amber-400">BNB</p>
            </div>
            <div className="h-8 w-px bg-[var(--border)]" />
            <div>
              <span className="text-[var(--muted-foreground)]">Agents</span>
              <p className="text-lg font-bold text-violet-400">5</p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          Open Dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
          <span>USDY</span>
          <span>BUIDL</span>
          <span>PAXG</span>
          <span>slisBNB</span>
          <span>lisUSD</span>
          <span>ankrBNB</span>
        </div>
      </main>
    </div>
  );
}
