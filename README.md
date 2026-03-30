# RWA Agent

**The Intelligence Layer for Real World Assets on BNB Chain**

---

## Overview

RWA Agent is a compliance-aware AI agent swarm for institutional Real World Asset portfolio management. Five specialized autonomous agents collaborate to research opportunities, assess risks, enforce regulatory compliance, execute trades, and rebalance portfolios across tokenized treasuries, gold, and stablecoins on BNB Chain. Every transaction is gated by on-chain compliance screening and KYC verification, making it the first production-grade RWA management system purpose-built for institutional adoption.

---

## Live Demo

- **Dashboard**: https://rwa-agent.vercel.app/dashboard
- **Pitch Deck**: https://rwa-agent.vercel.app/pitch
- **GitHub**: https://github.com/kamalbuilds/rwa-agent

---

## Key Innovation

- **First compliance-aware AI agent system for RWA on BNB Chain** - Every trade decision is legally gated by jurisdiction checks, OFAC screening, and KYC status before on-chain execution
- **x402 machine economy** - Agents charge for services via HTTP 402 protocol (Research: 0.001 USDC, Risk: 0.002 USDC, Compliance: 0.0005 USDC, Trading: 0.01 USDC per successful trade) with full payment ledger and receipts
- **On-chain compliance oracle** - Wallet screening, KYC gating, and risk scoring as an executable smart contract layer
- **Real-time portfolio management** - Autonomous 8-second agent cycles with live market data feeds and chain integration
- **Production Solidity contracts** - 4 auditable smart contracts: RWAVault, ComplianceOracle, AgentRegistry, RWARouter with ERC-8004 inspired identity system

---

## Architecture

RWA Agent operates as a five-layer agent swarm executing in sequence every 8 seconds:

1. **Research Agent** scans tokenized RWA yields, prices, and market conditions via DeFi Llama and Venus Protocol APIs, identifying yield opportunities across treasuries, gold, and liquid staking derivatives
2. **Risk Agent** evaluates each position for liquidity, depeg, smart contract, and yield sustainability risk, flagging positions that exceed risk thresholds
3. **Trading Agent** generates buy/sell/hold signals based on research and risk data, routing signals through PancakeSwap for execution
4. **Compliance Agent** gates every trade by checking KYC status, jurisdiction restrictions, OFAC sanctions screening, and protocol audit status on-chain
5. **Portfolio Agent** manages allocations and auto-rebalances when drift exceeds configured thresholds, optimizing for yield while respecting risk limits

Data flows from market sources through agents to smart contracts on BNB Chain, with every decision recorded on-chain for auditability and institutional compliance.

```
Market Data -> Research Agent -> Market Analysis
                                      |
                                Risk Agent -> Risk Assessment
                                      |
                              Trading Agent -> Trade Signals
                                      |
                            Compliance Agent -> Approved Trades
                                      |
                            Portfolio Agent -> Execute & Rebalance
                                      |
                              BNB Chain Smart Contracts
```

---

## Smart Contracts

**RWAVault.sol** - Multi-token vault with over-collateralization requirements and health factor calculations. Accepts USDY, BUIDL, PAXG, slisBNB, lisUSD, ankrBNB with individual and portfolio risk limits.

**ComplianceOracle.sol** - On-chain wallet screening with OFAC integration points, KYC status gating, and institutional risk scoring. Blocks high-risk or sanctioned wallets from vault participation.

**AgentRegistry.sol** - Decentralized agent identity registry inspired by ERC-8004, tracking agent reputation, staking requirements, fee rates, and service availability. Agents must stake USDC to register and can earn reputation.

**RWARouter.sol** - Cross-protocol routing with built-in compliance checks. Routes trades through PancakeSwap, Venus, and other BNB Chain DeFi protocols while enforcing compliance gates.

---

## x402 Machine Economy

The system implements HTTP 402 Payment Required semantics for agent services:

- **Research Agent**: 0.001 USDC per market analysis request
- **Risk Agent**: 0.002 USDC per risk assessment
- **Compliance Agent**: 0.0005 USDC per compliance check
- **Trading Agent**: 0.01 USDC earnings per successful executed trade

All payments are recorded on-chain with immutable receipts. Agent reputation scores affect fee rates (higher reputation = lower fees for clients, higher earnings for agents). Full payment ledger visible in dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TailwindCSS 4, shadcn/ui, Recharts |
| Backend | Next.js API Routes, Zustand state management |
| Smart Contracts | Solidity 0.8.20, OpenZeppelin contracts, Hardhat |
| Blockchain | BNB Chain (BSC) mainnet via viem |
| Data Sources | DeFi Llama, Venus Protocol, Chainlink Price Feeds |
| AI Agents | TypeScript-based modular multi-agent architecture |
| Supported RWA Tokens | USDY (Ondo), BUIDL (BlackRock), PAXG (Paxos), slisBNB (Lista), lisUSD (Lista), ankrBNB (Ankr) |

---

## Supported RWA Tokens

| Token | Type | Protocol | Yield |
|-------|------|----------|-------|
| USDY | US Treasury | Ondo Finance | 4.8% APY |
| BUIDL | US Treasury | BlackRock | 4.5% APY |
| PAXG | Physical Gold | Paxos | Price appreciation |
| slisBNB | Liquid Staking | Lista DAO | 3.2% APY |
| lisUSD | Stablecoin | Lista DAO | 5.2% APY |
| ankrBNB | Liquid Staking | Ankr | 2.9% APY |

---

## Getting Started

```bash
git clone https://github.com/kamalbuilds/rwa-agent.git
cd rwa-agent
npm install
npm run dev
```

Open http://localhost:3000 and click "Open Dashboard" to interact with the agent system.

### Dashboard Controls

- **Run Cycle**: Manually trigger one 8-second agent execution cycle
- **Auto**: Start continuous autonomous cycles
- **Stop**: Pause autorun
- **Chain Status**: Live BNB Chain connection, block number, gas price, and transaction logs
- **Agent Ledger**: View all agent service payments and receipts
- **Compliance Report**: See wallet screening results and KYC status

---

## Project Structure

```
src/
  app/
    page.tsx              Landing page with project overview
    dashboard/page.tsx    Main dashboard with agent controls and monitoring
    pitch/page.tsx        Hackathon pitch deck
    api/
      agents/route.ts     Agent orchestration and cycle management
      chain/route.ts      BNB Chain status and transaction APIs
  lib/
    agents/
      research.ts         Research Agent: market scanning and opportunity detection
      risk.ts             Risk Agent: portfolio risk assessment
      trading.ts          Trading Agent: buy/sell/hold signal generation
      compliance.ts       Compliance Agent: KYC and sanctions screening
      portfolio.ts        Portfolio Agent: rebalancing and allocation optimization
      orchestrator.ts     Agent coordination and cycle sequencing
      types.ts            Shared TypeScript interfaces and types
    chain/
      bnb.ts              BNB Chain client, viem integration, on-chain reads
    rwa/
      tokens.ts           RWA token registry with metadata
    store.ts              Zustand state management for dashboard
  components/
    dashboard/            Reusable React components for monitoring and controls
```

---

## Team

Built by **kamalbuilds** using Pentagon AI infrastructure and Claude Code. Focused on institutional-grade RWA portfolio management with compliance-first architecture.

---

## Hackathon

**DoraHacks RWA Demo Day** on BNB Chain. Judges will evaluate: compliance enforcement, agent autonomy, on-chain auditability, and institutional readiness.

---

## License

MIT
