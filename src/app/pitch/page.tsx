import {
  Layers,
  Brain,
  Shield,
  TrendingUp,
  RefreshCcw,
  Scale,
  Target,
  Users,
  Rocket,
  Globe,
  DollarSign,
  BarChart3,
  Lock,
} from "lucide-react";

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`flex min-h-screen flex-col items-center justify-center px-6 py-20 ${className}`}
    >
      {children}
    </section>
  );
}

export default function PitchPage() {
  return (
    <div className="flex flex-col">
      {/* Slide 1: Title */}
      <Section>
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-500/10 ring-1 ring-blue-500/20">
            <Layers className="h-10 w-10 text-blue-400" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            RWA Agent
          </h1>
          <p className="max-w-xl text-xl text-[var(--muted-foreground)]">
            AI-Powered Real World Asset Portfolio Management on BNB Chain
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-400">
              BNB Chain
            </span>
            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-blue-400">
              Multi-Agent AI
            </span>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-400">
              DeFi
            </span>
          </div>
        </div>
      </Section>

      {/* Slide 2: Problem */}
      <Section className="bg-[var(--card)]">
        <div className="flex max-w-3xl flex-col items-center gap-8 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">The Problem</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
              <p className="text-lg font-bold text-red-400">$16T+</p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Tokenizable RWA market, but portfolio management is manual and fragmented
              </p>
            </div>
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
              <p className="text-lg font-bold text-red-400">Complex</p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Users must manually research yields, assess risks, and rebalance across protocols
              </p>
            </div>
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
              <p className="text-lg font-bold text-red-400">Risky</p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Depeg events, smart contract risks, and yield sustainability are hard to monitor 24/7
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Slide 3: Solution */}
      <Section>
        <div className="flex max-w-3xl flex-col items-center gap-8 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Our Solution</h2>
          <p className="text-lg text-[var(--muted-foreground)]">
            Four specialized AI agents that work together autonomously to manage
            your RWA portfolio on BNB Chain.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-left">
              <Brain className="mt-1 h-6 w-6 shrink-0 text-violet-400" />
              <div>
                <h3 className="font-bold">Research Agent</h3>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Continuously scans RWA token yields, prices, and market
                  conditions. Identifies opportunities across treasuries, gold,
                  and stablecoins.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-left">
              <Shield className="mt-1 h-6 w-6 shrink-0 text-amber-400" />
              <div>
                <h3 className="font-bold">Risk Agent</h3>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Evaluates liquidity, depeg probability, smart contract safety,
                  and yield sustainability for every token in the portfolio.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-left">
              <TrendingUp className="mt-1 h-6 w-6 shrink-0 text-emerald-400" />
              <div>
                <h3 className="font-bold">Trading Agent</h3>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Generates buy/sell/hold signals based on research and risk
                  data. Routes trades through PancakeSwap for on-chain execution.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-left">
              <Scale className="mt-1 h-6 w-6 shrink-0 text-cyan-400" />
              <div>
                <h3 className="font-bold">Compliance Agent</h3>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Checks KYC requirements, jurisdiction restrictions, sanctions
                  screening, and audit status before every trade execution.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-left sm:col-span-2 sm:mx-auto sm:max-w-md">
              <RefreshCcw className="mt-1 h-6 w-6 shrink-0 text-blue-400" />
              <div>
                <h3 className="font-bold">Portfolio Agent</h3>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Manages target allocations, auto-rebalances when drift exceeds
                  thresholds, and optimizes for risk-adjusted yield.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Slide 4: Architecture */}
      <Section className="bg-[var(--card)]">
        <div className="flex max-w-3xl flex-col items-center gap-8 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">How It Works</h2>
          <div className="flex flex-col gap-3 text-left">
            {[
              {
                step: "1",
                title: "Research",
                desc: "Scan market for RWA yields, prices, and sentiment",
                color: "text-violet-400 bg-violet-500/10",
              },
              {
                step: "2",
                title: "Risk Assessment",
                desc: "Evaluate each token for liquidity, depeg, and contract risk",
                color: "text-amber-400 bg-amber-500/10",
              },
              {
                step: "3",
                title: "Signal Generation",
                desc: "Combine research + risk data into trade signals with confidence scores",
                color: "text-emerald-400 bg-emerald-500/10",
              },
              {
                step: "4",
                title: "Compliance Check",
                desc: "Verify KYC, sanctions, jurisdiction, and audit status before execution",
                color: "text-cyan-400 bg-cyan-500/10",
              },
              {
                step: "5",
                title: "Execute & Rebalance",
                desc: "Trade on PancakeSwap, maintain target allocations, optimize yield",
                color: "text-blue-400 bg-blue-500/10",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold ${item.color}`}
                >
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            Cycles run every 8 seconds, continuously adapting to market changes
          </p>
        </div>
      </Section>

      {/* Slide 5: RWA Tokens */}
      <Section>
        <div className="flex max-w-3xl flex-col items-center gap-8 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Supported RWA Tokens
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { symbol: "USDY", protocol: "Ondo Finance", apy: "4.8%", type: "Treasury", color: "border-blue-500/30" },
              { symbol: "BUIDL", protocol: "BlackRock", apy: "4.5%", type: "Treasury", color: "border-blue-500/30" },
              { symbol: "PAXG", protocol: "Paxos", apy: "Gold", type: "Commodity", color: "border-amber-500/30" },
              { symbol: "slisBNB", protocol: "Lista DAO", apy: "3.2%", type: "LST", color: "border-violet-500/30" },
              { symbol: "lisUSD", protocol: "Lista DAO", apy: "5.2%", type: "Stablecoin", color: "border-emerald-500/30" },
              { symbol: "ankrBNB", protocol: "Ankr", apy: "2.9%", type: "LST", color: "border-violet-500/30" },
            ].map((token) => (
              <div
                key={token.symbol}
                className={`rounded-xl border ${token.color} bg-[var(--card)] p-4`}
              >
                <p className="text-lg font-bold">{token.symbol}</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {token.protocol}
                </p>
                <p className="mt-2 text-sm font-medium text-emerald-400">
                  {token.apy} APY
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {token.type}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Slide 6: Market Opportunity */}
      <Section className="bg-[var(--card)]">
        <div className="flex max-w-3xl flex-col items-center gap-8 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Market Opportunity</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2">
              <DollarSign className="h-8 w-8 text-emerald-400" />
              <p className="text-3xl font-bold">$16T+</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Tokenizable RWA market by 2030
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <BarChart3 className="h-8 w-8 text-blue-400" />
              <p className="text-3xl font-bold">$12B+</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Current on-chain RWA TVL
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Globe className="h-8 w-8 text-violet-400" />
              <p className="text-3xl font-bold">40%+</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                YoY growth in tokenized treasuries
              </p>
            </div>
          </div>
          <p className="max-w-lg text-[var(--muted-foreground)]">
            BlackRock, Ondo, Paxos, and others are tokenizing real assets.
            But there is no intelligent portfolio layer. RWA Agent fills that gap.
          </p>
        </div>
      </Section>

      {/* Slide 7: Why BNB Chain */}
      <Section>
        <div className="flex max-w-3xl flex-col items-center gap-8 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Why BNB Chain</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <p className="font-bold">Low Fees</p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Sub-cent transaction costs enable frequent rebalancing
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <p className="font-bold">RWA Ecosystem</p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                USDY, Lista DAO, Ankr, and growing RWA token availability
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <p className="font-bold">DeFi Infrastructure</p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                PancakeSwap, Venus, and mature DEX/lending protocols
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <p className="font-bold">Speed</p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                3-second block times for responsive agent execution
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Slide 8: Roadmap */}
      <Section className="bg-[var(--card)]">
        <div className="flex max-w-3xl flex-col items-center gap-8 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Roadmap</h2>
          <div className="flex flex-col gap-4 text-left">
            {[
              {
                phase: "Q2 2026",
                title: "Launch",
                items: [
                  "Live agent execution on BNB Chain mainnet",
                  "PancakeSwap integration for RWA swaps",
                  "Public dashboard with real-time monitoring",
                ],
              },
              {
                phase: "Q3 2026",
                title: "Scale",
                items: [
                  "Support 20+ RWA tokens across BNB ecosystem",
                  "Custom allocation strategies (conservative, growth, yield-max)",
                  "Telegram bot for alerts and control",
                ],
              },
              {
                phase: "Q4 2026",
                title: "Expand",
                items: [
                  "Multi-chain support (Ethereum, Base, Arbitrum)",
                  "Institutional-grade risk reporting",
                  "Agent marketplace for community strategies",
                ],
              },
            ].map((phase) => (
              <div
                key={phase.phase}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                    {phase.phase}
                  </span>
                  <h3 className="font-bold">{phase.title}</h3>
                </div>
                <ul className="mt-3 flex flex-col gap-1">
                  {phase.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]"
                    >
                      <Rocket className="mt-0.5 h-3 w-3 shrink-0 text-blue-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Slide 9: Team */}
      <Section>
        <div className="flex max-w-3xl flex-col items-center gap-8 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Team</h2>
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10 ring-1 ring-blue-500/20">
              <Users className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-bold">Kamal</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Full-stack blockchain developer
              </p>
              <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                Building at the intersection of AI and DeFi. Previously shipped
                multiple DeFi protocols and trading systems.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Slide 10: CTA */}
      <Section className="bg-[var(--card)]">
        <div className="flex max-w-3xl flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-bold sm:text-5xl">
            The Intelligence Layer for RWA
          </h2>
          <p className="max-w-lg text-lg text-[var(--muted-foreground)]">
            RWA Agent brings autonomous portfolio management to tokenized real
            world assets. Research, risk, trading, and rebalancing, all handled
            by AI agents on BNB Chain.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <a
              href="/dashboard"
              className="rounded-full bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-500"
            >
              Try the Demo
            </a>
            <a
              href="https://github.com/kamalbuilds/rwa-agent"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--border)] px-8 py-3 text-sm font-medium hover:bg-[var(--muted)]"
            >
              GitHub
            </a>
          </div>
        </div>
      </Section>
    </div>
  );
}
