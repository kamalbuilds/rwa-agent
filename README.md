# RWA Agent

AI-powered multi-agent system for Real World Asset portfolio management on BNB Chain.

## What it does

RWA Agent is an autonomous portfolio manager that uses four specialized AI agents working together to research, assess risk, trade, and rebalance a portfolio of tokenized Real World Assets on BNB Chain.

### The Agents

- **Research Agent**: Scans RWA token yields, prices, market conditions, and news. Identifies yield opportunities across tokenized treasuries, gold, and stablecoins.
- **Risk Agent**: Assesses each RWA token for liquidity risk, depeg risk, smart contract risk, and yield sustainability. Flags high-risk positions.
- **Trading Agent**: Generates buy/sell/hold signals based on research and risk data. Routes trades through PancakeSwap for on-chain execution.
- **Portfolio Agent**: Manages allocations, auto-rebalances when drift exceeds thresholds, optimizes for yield while respecting risk limits.

### Supported RWA Tokens

| Token | Type | Protocol | APY |
|-------|------|----------|-----|
| USDY | Treasury | Ondo Finance | 4.8% |
| BUIDL | Treasury | BlackRock | 4.5% |
| PAXG | Gold | Paxos | 0% (price appreciation) |
| slisBNB | Liquid Staking | Lista DAO | 3.2% |
| lisUSD | Stablecoin | Lista DAO | 5.2% |
| ankrBNB | Liquid Staking | Ankr | 2.9% |

## Architecture

```
Market Data -> Research Agent -> Market Analysis
                                      |
                                Risk Agent -> Risk Assessment
                                      |
                              Trading Agent -> Trade Signals
                                      |
                            Portfolio Agent -> Execute & Rebalance
                                      |
                              BNB Chain (PancakeSwap / Venus)
```

Each cycle runs all four agents in sequence. The Research Agent provides market context, the Risk Agent evaluates safety, the Trading Agent generates actionable signals, and the Portfolio Agent executes and maintains target allocations.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Blockchain**: BNB Chain (BSC), viem
- **State**: Zustand
- **Agents**: TypeScript, modular agent architecture

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000 to see the landing page, then click "Open Dashboard" to interact with the agent system.

### Dashboard Controls

- **Run Cycle**: Manually trigger one agent cycle
- **Auto**: Start continuous 8-second cycles
- **Stop**: Pause autorun

## Project Structure

```
src/
  app/
    page.tsx              Landing page
    dashboard/page.tsx    Main dashboard
    api/agents/route.ts   Agent orchestration API
  lib/
    agents/
      research.ts         Research Agent
      risk.ts             Risk Agent
      trading.ts          Trading Agent
      portfolio.ts        Portfolio Agent
      orchestrator.ts     Agent coordination
      types.ts            Shared types
    rwa/
      tokens.ts           RWA token registry
    store.ts              Dashboard state
  components/
    dashboard/            UI components
```

## Built for

DoraHacks RWA Demo Day Hackathon on BNB Chain.
