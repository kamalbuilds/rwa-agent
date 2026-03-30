import Link from "next/link";
import {
  Brain,
  Shield,
  TrendingUp,
  RefreshCcw,
  ArrowRight,
  Scale,
  Zap,
  BarChart3,
  Lock,
  Globe,
  ChevronRight,
  Activity,
} from "lucide-react";

const agents = [
  {
    icon: Brain,
    name: "Research Agent",
    desc: "Continuously scans RWA yields, prices, and market sentiment across all supported protocols on BNB Chain.",
    color: "text-violet-400",
    borderColor: "border-violet-500/20",
    glowColor: "shadow-violet-500/5",
  },
  {
    icon: Shield,
    name: "Risk Agent",
    desc: "Evaluates liquidity depth, depeg probability, smart contract audit status, and counterparty exposure.",
    color: "text-amber-400",
    borderColor: "border-amber-500/20",
    glowColor: "shadow-amber-500/5",
  },
  {
    icon: Scale,
    name: "Compliance Agent",
    desc: "Verifies KYC requirements, sanctions screening, and jurisdictional rules before any trade execution.",
    color: "text-cyan-400",
    borderColor: "border-cyan-500/20",
    glowColor: "shadow-cyan-500/5",
  },
  {
    icon: TrendingUp,
    name: "Trading Agent",
    desc: "Generates trade signals with confidence scores and executes swaps via PancakeSwap DEX aggregation.",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    glowColor: "shadow-emerald-500/5",
  },
  {
    icon: RefreshCcw,
    name: "Portfolio Agent",
    desc: "Maintains target allocations through autonomous rebalancing, optimizing for risk-adjusted yield.",
    color: "text-blue-400",
    borderColor: "border-blue-500/20",
    glowColor: "shadow-blue-500/5",
  },
];

const tokens = [
  { symbol: "USDY", name: "Ondo US Dollar Yield", apy: "4.8%", type: "Treasury", tvl: "$1.2B", protocol: "Ondo Finance", color: "text-blue-400" },
  { symbol: "BUIDL", name: "BlackRock USD Institutional", apy: "4.5%", type: "Treasury", tvl: "$5.8B", protocol: "BlackRock/Securitize", color: "text-emerald-400" },
  { symbol: "PAXG", name: "Paxos Gold Token", apy: "Gold-backed", type: "Commodity", tvl: "$600M", protocol: "Paxos", color: "text-amber-400" },
  { symbol: "slisBNB", name: "Staked Lista BNB", apy: "3.2%", type: "LST", tvl: "$450M", protocol: "Lista DAO", color: "text-cyan-400" },
  { symbol: "lisUSD", name: "Lista Stablecoin", apy: "5.2%", type: "CDP Stable", tvl: "$320M", protocol: "Lista DAO", color: "text-violet-400" },
  { symbol: "ankrBNB", name: "Ankr Staked BNB", apy: "2.9%", type: "LST", tvl: "$200M", protocol: "Ankr", color: "text-rose-400" },
];

const steps = [
  { num: "01", title: "Market Intelligence", desc: "Research Agent scans yields, prices, and on-chain data across all RWA protocols", icon: Brain, color: "text-violet-400" },
  { num: "02", title: "Risk Assessment", desc: "Risk Agent scores liquidity, depeg probability, and smart contract safety", icon: Shield, color: "text-amber-400" },
  { num: "03", title: "Compliance Check", desc: "Compliance Agent verifies KYC, sanctions, and regulatory requirements", icon: Scale, color: "text-cyan-400" },
  { num: "04", title: "Signal & Execute", desc: "Trading Agent generates signals and executes optimal trades on PancakeSwap", icon: TrendingUp, color: "text-emerald-400" },
  { num: "05", title: "Rebalance", desc: "Portfolio Agent maintains target allocations for optimal risk-adjusted yield", icon: RefreshCcw, color: "text-blue-400" },
];

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen overflow-x-hidden">
      {/* Nav */}
      <nav className="nav-glass sticky top-0 z-50 px-6 py-3">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <BarChart3 className="h-4.5 w-4.5 text-primary" />
            </div>
            <span className="text-lg font-semibold tracking-tight">RWA Agent</span>
            <span className="glow-badge text-[10px] font-medium px-2 py-0.5 rounded-full text-primary">
              BNB Chain
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/pitch" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pitch Deck
            </Link>
            <Link href="https://github.com/kamalbuilds/rwa-agent" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              GitHub
            </Link>
            <Link href="/dashboard">
              <button className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                Launch App <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-28 pb-20">
        <div className="hero-glow" />
        <div className="hero-glow-accent" />
        <div className="relative z-10 mx-auto max-w-4xl flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-8">
            <div className="glow-badge flex items-center gap-2 px-4 py-1.5 rounded-full text-sm">
              <div className="pulse-dot" />
              <span className="text-muted-foreground">Live on BNB Chain</span>
            </div>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            The Intelligence Layer{" "}
            <br />
            <span className="gradient-text">for Real World Assets</span>
          </h1>

          <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10">
            5 autonomous AI agents research, assess risk, ensure compliance, trade,
            and rebalance tokenized treasuries, gold, and yield products on BNB Chain.
          </p>

          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground text-base font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20">
                Open Dashboard <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/pitch">
              <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border text-base font-medium hover:bg-card/50 transition-all">
                View Pitch Deck <ChevronRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="relative z-10 px-6 py-1">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: "6", label: "RWA Tokens", sub: "BNB Chain" },
              { value: "3.8%", label: "Avg APY", sub: "Yield Bearing" },
              { value: "5", label: "AI Agents", sub: "Autonomous" },
              { value: "8s", label: "Cycle Time", sub: "Continuous" },
            ].map((m) => (
              <div key={m.label} className="metric-card flex flex-col items-center gap-1 py-6 px-4">
                <span className="text-3xl sm:text-4xl font-bold gradient-text stat-value">{m.value}</span>
                <span className="text-sm font-medium mt-1">{m.label}</span>
                <span className="text-xs text-muted-foreground">{m.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="my-16 section-divider" />

      {/* Agent Architecture */}
      <section className="relative z-10 px-6 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.2em] text-primary/70 font-medium mb-3">Architecture</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Multi-Agent System</h2>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-lg">
              Five specialized agents work in concert, each mastering one domain
              of RWA portfolio management.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => {
              const Icon = agent.icon;
              return (
                <div key={agent.name} className="glass-card rounded-xl p-6 group">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-card/50 border ${agent.borderColor}`}>
                      <Icon className={`h-5 w-5 ${agent.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">{agent.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {agent.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.2em] text-primary/70 font-medium mb-3">Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Intelligence Loop</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Every 8 seconds, the agent system runs a complete cycle.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.num} className="glass-card rounded-xl p-5 flex items-center gap-5 group">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/5 border border-primary/20">
                    <span className="text-sm font-bold text-primary/70">{item.num}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <Icon className={`h-5 w-5 ${item.color} shrink-0 hidden sm:block opacity-50 group-hover:opacity-100 transition-opacity`} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider" />

      {/* Supported Assets */}
      <section className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.2em] text-primary/70 font-medium mb-3">Assets</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Supported RWA Tokens</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Tokenized treasuries, gold, stablecoins, and liquid staking on BNB Chain.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tokens.map((token) => (
              <div key={token.symbol} className="token-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className={`text-xl font-bold ${token.color}`}>{token.symbol}</span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-card/80 border border-border/50 text-muted-foreground">
                        {token.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{token.name}</p>
                  </div>
                </div>
                <div className="flex items-end justify-between pt-3 border-t border-border/30">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Protocol</p>
                    <p className="text-xs font-medium mt-0.5">{token.protocol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">APY</p>
                    <p className="text-lg font-bold text-emerald-400 stat-value">{token.apy}</p>
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <span className="text-[10px] text-muted-foreground">TVL: {token.tvl}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why BNB Chain */}
      <section className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.2em] text-primary/70 font-medium mb-3">Infrastructure</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Built on BNB Chain</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              The fastest and most cost-effective chain for autonomous agent execution.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Zap, title: "3s Blocks", desc: "Ultra-fast agent cycles" },
              { icon: Lock, title: "$0.01 Fees", desc: "Sub-cent rebalancing" },
              { icon: Globe, title: "RWA Hub", desc: "Growing token ecosystem" },
              { icon: Activity, title: "Deep Liquidity", desc: "PancakeSwap + Venus" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="glass-card rounded-xl p-5 text-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5 border border-primary/20 mx-auto mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust / Partners */}
      <section className="relative z-10 px-6 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/50 mb-6">
            Integrated Protocols & Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {["Ondo Finance", "BlackRock/Securitize", "Paxos", "Lista DAO", "Ankr", "PancakeSwap", "Venus Protocol"].map((p) => (
              <span key={p} className="text-sm text-muted-foreground/40 font-medium tracking-wide">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider" />

      {/* CTA */}
      <section className="relative z-10 px-6 py-28">
        <div className="hero-glow" style={{ top: "-100px" }} />
        <div className="relative z-10 mx-auto max-w-2xl text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            Autonomous RWA
            <br />
            <span className="gradient-text">Portfolio Management</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-md">
            Let AI agents handle research, risk, compliance, and execution
            while you focus on strategy.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <Link href="/dashboard">
              <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground text-base font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20">
                Try the Demo <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/pitch">
              <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border text-base font-medium hover:bg-card/50 transition-all">
                Pitch Deck
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 px-6 py-8">
        <div className="mx-auto max-w-5xl flex items-center justify-between text-xs text-muted-foreground/50">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>RWA Agent</span>
            <span className="text-muted-foreground/30">|</span>
            <span>Built for DoraHacks RWA Demo Day</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="https://github.com/kamalbuilds/rwa-agent" target="_blank" className="hover:text-foreground transition-colors">
              GitHub
            </Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/pitch" className="hover:text-foreground transition-colors">
              Pitch Deck
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
