"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Brain,
  Shield,
  TrendingUp,
  RefreshCcw,
  Scale,
  Rocket,
  Globe,
  DollarSign,
  BarChart3,
  Lock,
  Zap,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Activity,
  Cpu,
  Network,
  Layers,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TOTAL_SLIDES = 10;

function SlideNumber({ n }: { n: number }) {
  return (
    <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
      <span className="text-xs font-mono tracking-widest text-amber-400/60 uppercase">
        {String(n).padStart(2, "0")} / {String(TOTAL_SLIDES).padStart(2, "0")}
      </span>
      <div className="w-12 h-px bg-gradient-to-r from-amber-400/40 to-transparent" />
    </div>
  );
}

function ScrollHint() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/20 animate-bounce">
      <ChevronDown className="h-4 w-4" />
    </div>
  );
}

function GlowOrb({ className }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none blur-[120px] ${className}`}
    />
  );
}

export default function PitchPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = slideRefs.current.indexOf(
              entry.target as HTMLElement
            );
            if (idx !== -1) setActiveSlide(idx);
          }
        });
      },
      { threshold: 0.5 }
    );
    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSlide = (idx: number) => {
    slideRefs.current[idx]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative bg-[#070b14] text-white">
      {/* Fixed nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 nav-glass">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-amber-400/10 flex items-center justify-center">
              <BarChart3 className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <span className="text-sm font-semibold text-white/90">RWA Agent</span>
          </div>
          <Badge className="text-[10px] bg-amber-400/10 text-amber-400 border-amber-400/20 px-2">
            DoraHacks 2026
          </Badge>
        </div>

        {/* Slide dots */}
        <div className="hidden md:flex items-center gap-1.5">
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToSlide(i)}
              className={`rounded-full transition-all duration-300 ${
                activeSlide === i
                  ? "w-5 h-1.5 bg-amber-400"
                  : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <Link href="/dashboard">
          <Button
            size="sm"
            className="gap-1.5 text-xs bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/20"
            variant="ghost"
          >
            Live Demo <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </nav>

      {/* ─── SLIDE 1: TITLE ─── */}
      <section
        ref={(el) => { slideRefs.current[0] = el; }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      >
        <GlowOrb className="w-[700px] h-[500px] -top-32 left-1/2 -translate-x-1/2 bg-amber-400/8" />
        <GlowOrb className="w-[400px] h-[400px] bottom-0 right-0 bg-cyan-500/6" />

        <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-4xl pt-16">
          {/* Live badge */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/8 text-emerald-400 text-xs font-medium">
            <span className="pulse-dot" />
            Live on BSC Testnet
          </div>

          {/* Main heading */}
          <div className="flex flex-col gap-3">
            <h1 className="text-6xl sm:text-8xl font-bold tracking-tight leading-none">
              <span className="gradient-text">RWA Agent</span>
            </h1>
            <p className="text-2xl sm:text-3xl font-light text-white/50 tracking-wide">
              The Intelligence Layer for Real World Assets
            </p>
          </div>

          <p className="max-w-2xl text-base sm:text-lg text-white/40 leading-relaxed">
            The first compliance-aware AI agent swarm for institutional RWA
            deployment on BNB Chain. Five specialized agents. One unified
            portfolio. Fully autonomous.
          </p>

          {/* Key stats */}
          <div className="grid grid-cols-3 gap-6 mt-4 w-full max-w-lg">
            {[
              { value: "$3B+", label: "RWA TVL on BNB Chain" },
              { value: "8s", label: "Agent cycle time" },
              { value: "5", label: "Specialized AI agents" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold gradient-text">{s.value}</span>
                <span className="text-xs text-white/30 text-center leading-tight">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            {[
              { icon: Zap, label: "BNB Chain Native", color: "text-amber-400 border-amber-400/20 bg-amber-400/8" },
              { icon: Brain, label: "Multi-Agent AI", color: "text-violet-400 border-violet-400/20 bg-violet-400/8" },
              { icon: Shield, label: "On-Chain Compliance", color: "text-cyan-400 border-cyan-400/20 bg-cyan-400/8" },
              { icon: Network, label: "x402 Machine Economy", color: "text-emerald-400 border-emerald-400/20 bg-emerald-400/8" },
            ].map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border ${color}`}
              >
                <Icon className="h-3 w-3" />
                {label}
              </div>
            ))}
          </div>
        </div>
        <ScrollHint />
      </section>

      {/* ─── SLIDE 2: THE PROBLEM ─── */}
      <section
        ref={(el) => { slideRefs.current[1] = el; }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden"
      >
        <SlideNumber n={2} />
        <GlowOrb className="w-[500px] h-[400px] top-0 left-0 bg-red-500/6" />
        <GlowOrb className="w-[400px] h-[300px] bottom-0 right-0 bg-orange-500/5" />

        <div className="relative z-10 w-full max-w-5xl flex flex-col gap-12">
          <div className="text-center flex flex-col gap-4">
            <p className="text-xs font-mono tracking-widest text-red-400/60 uppercase">The Problem</p>
            <h2 className="text-4xl sm:text-6xl font-bold leading-tight">
              $3B in RWA liquidity.<br />
              <span className="text-red-400">88% locked out of DeFi.</span>
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              BNB Chain has the assets. It lacks the infrastructure to deploy them safely at institutional scale.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: AlertTriangle,
                color: "text-red-400",
                bg: "bg-red-500/8 border-red-500/20",
                stat: "88%",
                statColor: "text-red-400",
                title: "No Compliance Layer",
                desc: "Institutions cannot deploy capital without KYC/AML gating. No ComplianceOracle. No on-chain wallet screening. Every trade is a regulatory risk.",
              },
              {
                icon: Layers,
                color: "text-orange-400",
                bg: "bg-orange-500/8 border-orange-500/20",
                stat: "4+",
                statColor: "text-orange-400",
                title: "Fragmented Protocols",
                desc: "Ondo, BlackRock BUIDL, Lista DAO, Ankr — each siloed. No unified view. Manual allocation across every platform. No cross-protocol routing.",
              },
              {
                icon: RefreshCcw,
                color: "text-yellow-400",
                bg: "bg-yellow-500/8 border-yellow-500/20",
                stat: "0",
                statColor: "text-yellow-400",
                title: "Zero Automation",
                desc: "No autonomous rebalancing. No risk monitoring. No audit trails. Portfolio drift goes unnoticed until it's too late. Human intervention required for every trade.",
              },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className={`glass-card rounded-2xl p-6 border ${p.bg} flex flex-col gap-4`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${p.bg}`}>
                      <Icon className={`h-5 w-5 ${p.color}`} />
                    </div>
                    <span className={`text-4xl font-bold ${p.statColor} leading-none`}>{p.stat}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-2">{p.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="glass-card rounded-2xl p-5 border border-amber-400/10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="text-3xl font-bold gradient-text shrink-0">$400B+</div>
            <p className="text-white/50 text-sm">
              in institutional capital waiting for a compliant on-chain deployment pathway. USYC just surpassed BlackRock BUIDL as the #1 tokenized Treasury product at $2.29B. The window is open. The infrastructure is missing.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SLIDE 3: THE SOLUTION ─── */}
      <section
        ref={(el) => { slideRefs.current[2] = el; }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden"
      >
        <SlideNumber n={3} />
        <GlowOrb className="w-[600px] h-[500px] top-0 right-0 bg-amber-400/7" />
        <GlowOrb className="w-[400px] h-[300px] bottom-0 left-0 bg-violet-500/6" />

        <div className="relative z-10 w-full max-w-5xl flex flex-col gap-12">
          <div className="text-center flex flex-col gap-4">
            <p className="text-xs font-mono tracking-widest text-amber-400/60 uppercase">The Solution</p>
            <h2 className="text-4xl sm:text-6xl font-bold leading-tight">
              Not another portfolio tool.<br />
              <span className="gradient-text">An institutional-grade agent swarm.</span>
            </h2>
          </div>

          {/* 5 agents */}
          <div className="grid gap-4 sm:grid-cols-5">
            {[
              { icon: Brain, name: "Research", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", desc: "Scans live BSC prices, Venus yields, PancakeSwap liquidity. Real on-chain data, not simulated.", stat: "6 tokens" },
              { icon: Shield, name: "Risk", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", desc: "Depeg probability, liquidity depth, smart contract audit scores, and counterparty risk in real time.", stat: "4 vectors" },
              { icon: Scale, name: "Compliance", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20", desc: "ComplianceOracle on-chain: wallet screening, KYC status, sanctions check BEFORE any trade executes.", stat: "Pre-trade" },
              { icon: TrendingUp, name: "Trading", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", desc: "Generates buy/sell/hold signals with confidence scores. Routes via PancakeSwap for best execution.", stat: "8s cycles" },
              { icon: RefreshCcw, name: "Portfolio", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", desc: "Manages allocations, triggers rebalancing on drift threshold breach, optimizes risk-adjusted yield.", stat: "Auto-rebalance" },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <div
                  key={a.name}
                  className={`glass-card rounded-2xl p-5 border ${a.bg} flex flex-col gap-3`}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${a.bg}`}>
                    <Icon className={`h-5 w-5 ${a.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{a.name}</span>
                    </div>
                    <Badge className={`text-[9px] mb-2 ${a.bg} ${a.color} border-0`}>{a.stat}</Badge>
                    <p className="text-white/40 text-xs leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Innovation callouts */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                <Lock className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">ComplianceOracle Smart Contract</h3>
                <p className="text-white/40 text-sm">
                  On-chain KYC/AML enforcement. Wallet risk scoring. Jurisdiction gating. Every trade passes through the oracle before execution. Institutions can deploy capital without legal exposure.
                </p>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Network className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">x402 Machine Economy</h3>
                <p className="text-white/40 text-sm">
                  Agents pay agents via HTTP 402 protocol (Coinbase standard). Research agent purchases premium data feeds. Execution agent earns fees. The first RWA project with agent-to-agent micropayments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SLIDE 4: HOW IT WORKS ─── */}
      <section
        ref={(el) => { slideRefs.current[3] = el; }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden"
      >
        <SlideNumber n={4} />
        <GlowOrb className="w-[500px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teal-500/5" />

        <div className="relative z-10 w-full max-w-4xl flex flex-col gap-12">
          <div className="text-center flex flex-col gap-4">
            <p className="text-xs font-mono tracking-widest text-white/30 uppercase">Architecture</p>
            <h2 className="text-4xl sm:text-5xl font-bold">
              The <span className="gradient-text">8-Second</span> Intelligence Loop
            </h2>
            <p className="text-white/40">
              Every 8 seconds on BNB Chain. Continuous. Autonomous. Compliant.
            </p>
          </div>

          <div className="relative flex flex-col gap-0">
            {[
              {
                step: "01",
                icon: Brain,
                color: "text-violet-400",
                bg: "bg-violet-500/10 border-violet-500/30",
                title: "Research Agent scans on-chain data",
                desc: "Live BSC RPC calls. USDY yield from Ondo Finance contract. Venus supply APY. PancakeSwap price oracle. slisBNB/lisUSD from Lista DAO. No third-party APIs that can fail.",
                badge: "Real on-chain data",
              },
              {
                step: "02",
                icon: Shield,
                color: "text-amber-400",
                bg: "bg-amber-500/10 border-amber-500/30",
                title: "Risk Agent evaluates exposure",
                desc: "Liquidity depth scoring. Stablecoin peg deviation monitoring. Smart contract audit status. Counterparty concentration risk. Output: risk-adjusted position limits per token.",
                badge: "4 risk dimensions",
              },
              {
                step: "03",
                icon: TrendingUp,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10 border-emerald-500/30",
                title: "Trading Agent generates signals",
                desc: "Combines research + risk data. Yield spread analysis vs. benchmarks. Momentum detection. Signal confidence score (0-100). Buy/Sell/Hold with position sizing recommendation.",
                badge: "Confidence-scored signals",
              },
              {
                step: "04",
                icon: Scale,
                color: "text-cyan-400",
                bg: "bg-cyan-500/10 border-cyan-500/30",
                title: "ComplianceOracle approves trade",
                desc: "On-chain call to ComplianceOracle contract. Wallet KYC status. OFAC/sanctions screening. Jurisdiction eligibility check. Audit trail written to chain. If rejected: logged and blocked.",
                badge: "On-chain enforcement",
              },
              {
                step: "05",
                icon: RefreshCcw,
                color: "text-blue-400",
                bg: "bg-blue-500/10 border-blue-500/30",
                title: "Portfolio Agent executes and rebalances",
                desc: "RWAVault smart contract execution. PancakeSwap routing for best price. Post-trade allocation verification. AgentRegistry reputation update. Cycle repeats in 8 seconds.",
                badge: "Smart contract execution",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="flex items-stretch gap-6">
                  {/* Left: step number + connector */}
                  <div className="flex flex-col items-center shrink-0 w-12">
                    <div className={`h-12 w-12 rounded-full border-2 ${item.bg} flex items-center justify-center shrink-0`}>
                      <span className={`text-xs font-bold font-mono ${item.color}`}>{item.step}</span>
                    </div>
                    {i < 4 && <div className="step-line flex-1 my-1 w-0.5" />}
                  </div>
                  {/* Right: content */}
                  <div className={`glass-card rounded-2xl p-5 border flex-1 mb-3 ${item.bg}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={`h-4 w-4 ${item.color}`} />
                          <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                        </div>
                        <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                      </div>
                      <Badge className={`shrink-0 text-[9px] ${item.bg} ${item.color} border-0 whitespace-nowrap`}>
                        {item.badge}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {["BNB Chain RPC", "PancakeSwap V3", "Venus Protocol", "Lista DAO", "Ankr", "viem + ethers.js"].map((t) => (
              <div
                key={t}
                className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/40"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SLIDE 5: SMART CONTRACTS ─── */}
      <section
        ref={(el) => { slideRefs.current[4] = el; }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden"
      >
        <SlideNumber n={5} />
        <GlowOrb className="w-[500px] h-[400px] top-0 right-0 bg-cyan-500/6" />

        <div className="relative z-10 w-full max-w-5xl flex flex-col gap-12">
          <div className="text-center flex flex-col gap-4">
            <p className="text-xs font-mono tracking-widest text-cyan-400/60 uppercase">Infrastructure</p>
            <h2 className="text-4xl sm:text-5xl font-bold">
              Production-Ready <span className="gradient-text-teal">Smart Contracts</span>
            </h2>
            <p className="text-white/40">
              Four contracts form the backbone. Not mock implementations.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                icon: Lock,
                name: "ComplianceOracle",
                color: "text-cyan-400",
                bg: "bg-cyan-500/8 border-cyan-500/20",
                tag: "Core Innovation",
                tagColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
                features: [
                  "Wallet KYC status registry",
                  "OFAC/sanctions screening on-chain",
                  "Jurisdiction eligibility flags",
                  "Risk score (0-100) per wallet",
                  "Audit trail — every decision logged",
                ],
                desc: "The compliance gate that makes institutional deployment possible. No trade executes without passing this oracle.",
              },
              {
                icon: Layers,
                name: "RWAVault",
                color: "text-amber-400",
                bg: "bg-amber-500/8 border-amber-500/20",
                tag: "Treasury",
                tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                features: [
                  "Over-collateralization enforcement",
                  "Multi-asset deposit/withdrawal",
                  "Yield accrual accounting",
                  "Emergency pause mechanism",
                  "Rebalancing execution interface",
                ],
                desc: "Institutional-grade vault with collateral safety margins and automated position management.",
              },
              {
                icon: Cpu,
                name: "AgentRegistry",
                color: "text-violet-400",
                bg: "bg-violet-500/8 border-violet-500/20",
                tag: "Agent Economy",
                tagColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
                features: [
                  "On-chain agent reputation scores",
                  "Stake-to-operate enforcement",
                  "Performance history per agent",
                  "Agent authorization controls",
                  "Slash conditions for bad actors",
                ],
                desc: "Agents must stake to operate. Performance is tracked on-chain. Bad actors get slashed. Skin in the game.",
              },
              {
                icon: Activity,
                name: "RWARouter",
                color: "text-emerald-400",
                bg: "bg-emerald-500/8 border-emerald-500/20",
                tag: "Execution",
                tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                features: [
                  "Cross-protocol trade routing",
                  "PancakeSwap V3 integration",
                  "Slippage protection",
                  "Best-execution price discovery",
                  "Fee accounting per trade",
                ],
                desc: "Unified execution layer across all supported RWA protocols. One interface, optimized routing.",
              },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.name}
                  className={`glass-card rounded-2xl p-6 border ${c.bg} flex flex-col gap-4`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${c.bg}`}>
                        <Icon className={`h-5 w-5 ${c.color}`} />
                      </div>
                      <span className="font-bold text-white font-mono">{c.name}</span>
                    </div>
                    <Badge className={`text-[10px] border ${c.tagColor}`}>{c.tag}</Badge>
                  </div>
                  <p className="text-white/40 text-xs leading-relaxed">{c.desc}</p>
                  <ul className="flex flex-col gap-1.5">
                    {c.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-white/50">
                        <CheckCircle className={`h-3.5 w-3.5 shrink-0 ${c.color}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SLIDE 6: MARKET OPPORTUNITY ─── */}
      <section
        ref={(el) => { slideRefs.current[5] = el; }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden"
      >
        <SlideNumber n={6} />
        <GlowOrb className="w-[600px] h-[400px] top-0 left-0 bg-emerald-500/5" />
        <GlowOrb className="w-[400px] h-[300px] bottom-0 right-0 bg-amber-400/5" />

        <div className="relative z-10 w-full max-w-5xl flex flex-col gap-12">
          <div className="text-center flex flex-col gap-4">
            <p className="text-xs font-mono tracking-widest text-emerald-400/60 uppercase">Market Opportunity</p>
            <h2 className="text-4xl sm:text-6xl font-bold">
              The numbers are<br />
              <span className="text-emerald-400">impossible to ignore.</span>
            </h2>
          </div>

          {/* Big stats */}
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { value: "$20B+", label: "Current tokenized RWA market", sub: "Growing 300%+ YoY", color: "text-emerald-400" },
              { value: "$3B+", label: "RWA TVL on BNB Chain", sub: "360% holder growth in 2026", color: "text-amber-400" },
              { value: "$400B+", label: "Institutional TAM", sub: "Capital seeking compliant on-chain rails", color: "text-cyan-400" },
              { value: "40,946", label: "BNB Chain RWA holders", sub: "Up from 8,700 in 2025 — 4.7x", color: "text-violet-400" },
            ].map((s) => (
              <div
                key={s.label}
                className="metric-card p-5 flex flex-col gap-2"
              >
                <span className={`text-3xl font-bold ${s.color} stat-value`}>{s.value}</span>
                <span className="text-sm text-white/60 leading-tight">{s.label}</span>
                <span className="text-xs text-white/30">{s.sub}</span>
              </div>
            ))}
          </div>

          {/* Trend callouts */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "USYC overtook BlackRock BUIDL",
                desc: "USYC reached $2.29B — now the #1 tokenized Treasury product. The race for institutional RWA dominance is active.",
                color: "border-l-amber-400",
              },
              {
                title: "BNB Chain RWA ecosystem expanding",
                desc: "Ondo Finance, Lista DAO, Ankr, Matrixdock — all deploying on BNB. The chain is becoming the preferred RWA settlement layer.",
                color: "border-l-cyan-400",
              },
              {
                title: "Institutions demand compliance-first",
                desc: "Without KYC/AML gating at the protocol level, institutional capital cannot flow. That is exactly the gap we fill.",
                color: "border-l-emerald-400",
              },
            ].map((c) => (
              <div
                key={c.title}
                className={`glass-card rounded-2xl p-5 border border-white/8 border-l-2 ${c.color} flex flex-col gap-2`}
              >
                <h3 className="font-semibold text-white text-sm">{c.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-5 border border-amber-400/15 text-center">
            <p className="text-white/50 text-sm max-w-2xl mx-auto">
              We are not building for retail. We are building the compliance and automation layer that lets <strong className="text-white/80">institutional capital flow into tokenized RWAs on BNB Chain</strong> without legal or operational risk. The TAM is not the DeFi market. It is the global fixed income market.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SLIDE 7: COMPETITIVE LANDSCAPE ─── */}
      <section
        ref={(el) => { slideRefs.current[6] = el; }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden"
      >
        <SlideNumber n={7} />
        <GlowOrb className="w-[400px] h-[300px] top-0 right-0 bg-violet-500/5" />

        <div className="relative z-10 w-full max-w-5xl flex flex-col gap-10">
          <div className="text-center flex flex-col gap-4">
            <p className="text-xs font-mono tracking-widest text-white/30 uppercase">Competitive Landscape</p>
            <h2 className="text-4xl sm:text-5xl font-bold">
              No one else is doing<br />
              <span className="gradient-text">all of this. On BNB Chain.</span>
            </h2>
          </div>

          <div className="glass-card rounded-2xl border border-white/8 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/8 hover:bg-transparent">
                  <TableHead className="text-white/50 font-medium py-4 pl-6">Capability</TableHead>
                  <TableHead className="text-center py-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-amber-400 font-bold">RWA Agent</span>
                      <Badge className="text-[9px] bg-amber-400/10 text-amber-400 border-amber-400/20">US</Badge>
                    </div>
                  </TableHead>
                  <TableHead className="text-center text-white/40 py-4">Ondo Finance</TableHead>
                  <TableHead className="text-center text-white/40 py-4">OpenEden</TableHead>
                  <TableHead className="text-center text-white/40 py-4">Maple Finance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { feature: "AI Agent Portfolio Management", us: true, ondo: false, openeden: false, maple: false, note: "First in RWA" },
                  { feature: "On-Chain ComplianceOracle", us: true, ondo: "partial", openeden: "partial", maple: "partial", note: "Only full implementation" },
                  { feature: "x402 Agent-to-Agent Payments", us: true, ondo: false, openeden: false, maple: false, note: "Industry first" },
                  { feature: "Auto-Rebalancing (8s cycles)", us: true, ondo: false, openeden: false, maple: false, note: "" },
                  { feature: "Multi-Agent Risk Swarm", us: true, ondo: false, openeden: false, maple: false, note: "" },
                  { feature: "Cross-Protocol RWA Routing", us: true, ondo: false, openeden: false, maple: false, note: "" },
                  { feature: "BNB Chain Native", us: true, ondo: true, openeden: true, maple: false, note: "" },
                  { feature: "Tokenized Treasuries", us: true, ondo: true, openeden: true, maple: false, note: "" },
                ].map((row) => (
                  <TableRow key={row.feature} className="border-b border-white/5 hover:bg-white/3">
                    <TableCell className="text-white/60 text-sm py-3.5 pl-6">
                      <span>{row.feature}</span>
                      {row.note && (
                        <Badge className="ml-2 text-[9px] bg-amber-400/8 text-amber-400/70 border-amber-400/15">{row.note}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center py-3.5">
                      <CheckCircle className="inline h-5 w-5 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                    </TableCell>
                    <TableCell className="text-center py-3.5">
                      {row.ondo === true ? (
                        <CheckCircle className="inline h-4 w-4 text-emerald-400/50" />
                      ) : row.ondo === "partial" ? (
                        <div className="inline-flex items-center justify-center h-4 w-4 rounded-full border border-yellow-400/40 text-yellow-400/40 text-[8px] font-bold">~</div>
                      ) : (
                        <XCircle className="inline h-4 w-4 text-white/15" />
                      )}
                    </TableCell>
                    <TableCell className="text-center py-3.5">
                      {row.openeden === true ? (
                        <CheckCircle className="inline h-4 w-4 text-emerald-400/50" />
                      ) : row.openeden === "partial" ? (
                        <div className="inline-flex items-center justify-center h-4 w-4 rounded-full border border-yellow-400/40 text-yellow-400/40 text-[8px] font-bold">~</div>
                      ) : (
                        <XCircle className="inline h-4 w-4 text-white/15" />
                      )}
                    </TableCell>
                    <TableCell className="text-center py-3.5">
                      {row.maple === true ? (
                        <CheckCircle className="inline h-4 w-4 text-emerald-400/50" />
                      ) : row.maple === "partial" ? (
                        <div className="inline-flex items-center justify-center h-4 w-4 rounded-full border border-yellow-400/40 text-yellow-400/40 text-[8px] font-bold">~</div>
                      ) : (
                        <XCircle className="inline h-4 w-4 text-white/15" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { value: "8", label: "Unique capabilities competitors lack", color: "text-amber-400" },
              { value: "3", label: "Industry firsts in this build", color: "text-cyan-400" },
              { value: "0", label: "Competitors with agent-to-agent payments", color: "text-emerald-400" },
            ].map((s) => (
              <div key={s.label} className="glass-card rounded-2xl p-5 border border-white/8 text-center">
                <span className={`text-4xl font-bold ${s.color}`}>{s.value}</span>
                <p className="text-white/40 text-sm mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SLIDE 8: REVENUE MODEL ─── */}
      <section
        ref={(el) => { slideRefs.current[7] = el; }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden"
      >
        <SlideNumber n={8} />
        <GlowOrb className="w-[500px] h-[400px] bottom-0 right-0 bg-emerald-500/6" />

        <div className="relative z-10 w-full max-w-5xl flex flex-col gap-12">
          <div className="text-center flex flex-col gap-4">
            <p className="text-xs font-mono tracking-widest text-emerald-400/60 uppercase">Business Model</p>
            <h2 className="text-4xl sm:text-5xl font-bold">
              Multiple revenue streams.<br />
              <span className="text-emerald-400">Aligned with users.</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-5">
            {[
              { value: "0.5%", label: "AUM Fee", desc: "Annual management fee on total assets under management", color: "text-amber-400", bg: "bg-amber-500/8 border-amber-500/20", tier: "Primary" },
              { value: "10%", label: "Performance Fee", desc: "On alpha generated above the RWA benchmark yield", color: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/20", tier: "Primary" },
              { value: "20%", label: "Marketplace Cut", desc: "From agent-to-agent payments in the x402 ecosystem", color: "text-cyan-400", bg: "bg-cyan-500/8 border-cyan-500/20", tier: "x402" },
              { value: "$500/mo", label: "Compliance-as-a-Service", desc: "Per institutional client using ComplianceOracle API", color: "text-violet-400", bg: "bg-violet-500/8 border-violet-500/20", tier: "B2B" },
              { value: "Custom", label: "Protocol Integrations", desc: "Revenue share with new RWA protocols wanting agent coverage", color: "text-blue-400", bg: "bg-blue-500/8 border-blue-500/20", tier: "B2B" },
            ].map((r) => (
              <div key={r.label} className={`glass-card rounded-2xl p-5 border ${r.bg} flex flex-col gap-3`}>
                <Badge className={`w-fit text-[9px] ${r.bg} ${r.color} border-0`}>{r.tier}</Badge>
                <span className={`text-3xl font-bold ${r.color} stat-value`}>{r.value}</span>
                <div>
                  <p className="font-semibold text-white text-sm mb-1">{r.label}</p>
                  <p className="text-white/40 text-xs leading-relaxed">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="bg-white/8" />

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-white">Unit Economics at Scale</h3>
              <div className="flex flex-col gap-3">
                {[
                  { aum: "$10M AUM", mgmt: "$50K/yr", perf: "$30K/yr", total: "$80K/yr" },
                  { aum: "$100M AUM", mgmt: "$500K/yr", perf: "$300K/yr", total: "$800K/yr" },
                  { aum: "$1B AUM", mgmt: "$5M/yr", perf: "$3M/yr", total: "$8M/yr" },
                ].map((row) => (
                  <div key={row.aum} className="glass-card rounded-xl p-4 border border-white/8 flex items-center justify-between gap-4">
                    <span className="text-white/50 text-sm font-mono">{row.aum}</span>
                    <div className="flex items-center gap-4 text-xs text-white/30">
                      <span>{row.mgmt} mgmt</span>
                      <span>+</span>
                      <span>{row.perf} perf</span>
                      <span className="font-bold text-emerald-400 text-sm">{row.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-white">2027 Target: $100M AUM</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Management fees (0.5%)", value: "$500K/yr", width: "50%" },
                  { label: "Performance fees (10% alpha)", value: "$300K/yr", width: "30%" },
                  { label: "Compliance-as-a-Service", value: "$120K/yr", width: "12%" },
                  { label: "x402 marketplace fees", value: "$80K/yr", width: "8%" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">{item.label}</span>
                      <span className="text-white/60 font-mono">{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-400/50 rounded-full"
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="glass-card rounded-xl p-4 border border-emerald-500/20 flex items-center justify-between">
                <span className="text-white/50 text-sm">Total projected revenue</span>
                <span className="text-emerald-400 font-bold text-xl stat-value">$1M+/yr</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SLIDE 9: ROADMAP ─── */}
      <section
        ref={(el) => { slideRefs.current[8] = el; }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden"
      >
        <SlideNumber n={9} />
        <GlowOrb className="w-[500px] h-[400px] top-0 left-0 bg-violet-500/5" />

        <div className="relative z-10 w-full max-w-5xl flex flex-col gap-12">
          <div className="text-center flex flex-col gap-4">
            <p className="text-xs font-mono tracking-widest text-white/30 uppercase">Roadmap</p>
            <h2 className="text-4xl sm:text-5xl font-bold">
              From hackathon to<br />
              <span className="gradient-text">institutional infrastructure.</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            {[
              {
                phase: "Q1 2026",
                label: "NOW",
                title: "MVP",
                color: "text-amber-400",
                bg: "bg-amber-500/8 border-amber-500/20",
                active: true,
                items: [
                  "Multi-agent swarm on BSC testnet",
                  "ComplianceOracle smart contract",
                  "x402 agent-to-agent payments",
                  "Live on-chain BSC data feeds",
                  "RWAVault + AgentRegistry deployed",
                ],
              },
              {
                phase: "Q2 2026",
                label: "NEXT",
                title: "Mainnet",
                color: "text-emerald-400",
                bg: "bg-emerald-500/8 border-emerald-500/20",
                active: false,
                items: [
                  "BNB Chain mainnet launch",
                  "3 RWA tokens live (USDY, BUIDL, PAXG)",
                  "Compliance-as-a-Service beta",
                  "First institutional pilot",
                  "$1M AUM target",
                ],
              },
              {
                phase: "Q3 2026",
                label: "SCALE",
                title: "Ecosystem",
                color: "text-cyan-400",
                bg: "bg-cyan-500/8 border-cyan-500/20",
                active: false,
                items: [
                  "x402 agent marketplace public",
                  "10+ RWA tokens supported",
                  "Third-party agent integrations",
                  "BSC Foundation partnership",
                  "$10M AUM target",
                ],
              },
              {
                phase: "Q4 2026",
                label: "EXPAND",
                title: "Multi-Chain",
                color: "text-violet-400",
                bg: "bg-violet-500/8 border-violet-500/20",
                active: false,
                items: [
                  "Ethereum + Arbitrum expansion",
                  "20+ institutional clients",
                  "Governance token launch",
                  "Cross-chain RWA routing",
                  "$100M AUM target",
                ],
              },
            ].map((p) => (
              <div
                key={p.phase}
                className={`glass-card rounded-2xl p-5 border ${p.bg} flex flex-col gap-3 ${p.active ? "ring-1 ring-amber-400/20" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono ${p.color}`}>{p.phase}</span>
                  <Badge className={`text-[9px] ${p.bg} ${p.color} border-0`}>{p.label}</Badge>
                </div>
                <h3 className={`text-lg font-bold ${p.color}`}>{p.title}</h3>
                <ul className="flex flex-col gap-1.5">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-white/40">
                      <Rocket className={`h-3 w-3 shrink-0 mt-0.5 ${p.color}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="bg-white/8" />

          {/* Why BNB Chain */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 text-center">Why BNB Chain</h3>
            <div className="grid gap-4 sm:grid-cols-4">
              {[
                { icon: Zap, title: "Sub-second finality", desc: "3s blocks. 8s agent cycles are economically viable and technically reliable.", color: "text-amber-400" },
                { icon: DollarSign, title: "Sub-cent fees", desc: "Frequent rebalancing does not erode yield. Gas cost is negligible on BSC.", color: "text-emerald-400" },
                { icon: Globe, title: "Fastest RWA growth", desc: "360% holder growth. $3B TVL. Ondo, Lista, Ankr, Matrixdock all deploying here.", color: "text-cyan-400" },
                { icon: BarChart3, title: "20,000 TPS roadmap", desc: "Infrastructure ready to scale with institutional volume. Not a bottleneck.", color: "text-violet-400" },
              ].map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="glass-card rounded-2xl p-4 border border-white/8 flex flex-col gap-2">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <h4 className="font-semibold text-white text-sm">{title}</h4>
                  <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SLIDE 10: CTA ─── */}
      <section
        ref={(el) => { slideRefs.current[9] = el; }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      >
        <SlideNumber n={10} />
        <GlowOrb className="w-[800px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400/6" />
        <GlowOrb className="w-[400px] h-[300px] bottom-0 right-0 bg-cyan-500/6" />

        <div className="relative z-10 flex flex-col items-center gap-10 text-center max-w-3xl">
          {/* Icon */}
          <div className="h-20 w-20 rounded-3xl bg-amber-400/8 border border-amber-400/20 flex items-center justify-center">
            <BarChart3 className="h-10 w-10 text-amber-400" />
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-5xl sm:text-7xl font-bold leading-tight">
              <span className="gradient-text">RWA Agent</span>
            </h2>
            <p className="text-xl sm:text-2xl text-white/50 font-light leading-relaxed">
              The compliance-aware AI agent swarm<br className="hidden sm:block" />
              for institutional RWA on BNB Chain.
            </p>
          </div>

          {/* Summary bullets */}
          <div className="grid gap-3 sm:grid-cols-3 w-full text-sm">
            {[
              { icon: Brain, text: "5 specialized AI agents with real coordination", color: "text-violet-400" },
              { icon: Lock, text: "ComplianceOracle — KYC/AML enforced on-chain", color: "text-cyan-400" },
              { icon: Network, text: "x402 machine economy — first in RWA space", color: "text-emerald-400" },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="glass-card rounded-xl p-4 border border-white/8 flex items-start gap-3 text-left">
                <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${color}`} />
                <p className="text-white/50 text-xs leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 w-full">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="gap-2 px-8 text-base bg-amber-400 hover:bg-amber-300 text-black font-semibold"
                >
                  Try the Live Demo <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link
                href="https://github.com/kamalbuilds/rwa-agent"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 text-base border-white/20 text-white/60 hover:text-white hover:border-white/40"
                >
                  GitHub
                </Button>
              </Link>
            </div>
            <p className="text-xs text-white/20 mt-2">
              DoraHacks RWA Demo Day · BNB Chain · April 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
