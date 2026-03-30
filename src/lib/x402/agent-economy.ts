import { AgentIdentity, AgentPayment } from "./types";

// Pricing model for agent services (in USDC wei)
const AGENT_PRICING = {
  research: "1000000000000000", // 0.001 USDC per query
  risk: "2000000000000000", // 0.002 USDC per assessment
  trading_success: "10000000000000000", // 0.01 USDC per successful trade
  compliance: "500000000000000", // 0.0005 USDC per wallet screening
  portfolio: "1000000000000000", // 0.001 USDC per rebalance
};

interface AgentEconomyEntry {
  identity: AgentIdentity;
  ledger: AgentPayment[];
  balance: string; // in wei
}

class AgentEconomyManager {
  private agents: Map<string, AgentEconomyEntry> = new Map();
  private globalLedger: AgentPayment[] = [];

  constructor() {
    this.initializeDefaultAgents();
  }

  private initializeDefaultAgents() {
    const defaultAgents: AgentIdentity[] = [
      {
        agentId: "research-agent-01",
        name: "Market Research Agent",
        role: "research",
        reputation: 850,
        totalEarnings: "0",
        totalPayments: "0",
        registeredAt: Date.now(),
        stakingAmount: "1000000000000000000", // 1 USDC
        performanceScore: 0.92,
      },
      {
        agentId: "risk-agent-01",
        name: "Risk Assessment Agent",
        role: "risk",
        reputation: 900,
        totalEarnings: "0",
        totalPayments: "0",
        registeredAt: Date.now(),
        stakingAmount: "1000000000000000000",
        performanceScore: 0.95,
      },
      {
        agentId: "trading-agent-01",
        name: "Trading Execution Agent",
        role: "trading",
        reputation: 800,
        totalEarnings: "0",
        totalPayments: "0",
        registeredAt: Date.now(),
        stakingAmount: "5000000000000000000", // 5 USDC
        performanceScore: 0.88,
      },
      {
        agentId: "compliance-agent-01",
        name: "Compliance & Screening Agent",
        role: "compliance",
        reputation: 950,
        totalEarnings: "0",
        totalPayments: "0",
        registeredAt: Date.now(),
        stakingAmount: "2000000000000000000",
        performanceScore: 0.98,
      },
      {
        agentId: "portfolio-agent-01",
        name: "Portfolio Management Agent",
        role: "portfolio",
        reputation: 875,
        totalEarnings: "0",
        totalPayments: "0",
        registeredAt: Date.now(),
        stakingAmount: "3000000000000000000",
        performanceScore: 0.91,
      },
    ];

    for (const agent of defaultAgents) {
      this.agents.set(agent.agentId, {
        identity: { ...agent },
        ledger: [],
        balance: "0",
      });
    }
  }

  registerAgent(
    agentId: string,
    name: string,
    role: AgentIdentity["role"],
    stakingAmount: string
  ): AgentIdentity {
    if (this.agents.has(agentId)) {
      throw new Error(`Agent ${agentId} already registered`);
    }

    const identity: AgentIdentity = {
      agentId,
      name,
      role,
      reputation: 500,
      totalEarnings: "0",
      totalPayments: "0",
      registeredAt: Date.now(),
      stakingAmount,
      performanceScore: 0.5,
    };

    this.agents.set(agentId, {
      identity,
      ledger: [],
      balance: "0",
    });

    return identity;
  }

  getAgent(agentId: string): AgentIdentity | undefined {
    return this.agents.get(agentId)?.identity;
  }

  createPayment(
    fromAgentId: string,
    toAgentId: string,
    amount: string,
    reason: string
  ): AgentPayment | null {
    const fromEntry = this.agents.get(fromAgentId);
    const toEntry = this.agents.get(toAgentId);

    if (!fromEntry || !toEntry) {
      console.error("Invalid agent IDs for payment");
      return null;
    }

    // Check balance
    const fromBalance = BigInt(fromEntry.balance);
    const paymentAmount = BigInt(amount);

    if (fromBalance < paymentAmount) {
      console.warn(`Insufficient balance: ${fromAgentId}`);
      return null;
    }

    const payment: AgentPayment = {
      id: `payment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      from: fromEntry.identity,
      to: toEntry.identity,
      amount,
      reason,
      timestamp: Date.now(),
      status: "pending",
    };

    // Process payment
    fromEntry.balance = (fromBalance - paymentAmount).toString();
    toEntry.balance = (BigInt(toEntry.balance) + paymentAmount).toString();

    payment.status = "completed";
    fromEntry.ledger.push(payment);
    toEntry.ledger.push(payment);
    this.globalLedger.push(payment);

    // Update totals
    fromEntry.identity.totalPayments = (
      BigInt(fromEntry.identity.totalPayments) + paymentAmount
    ).toString();
    toEntry.identity.totalEarnings = (
      BigInt(toEntry.identity.totalEarnings) + paymentAmount
    ).toString();

    return payment;
  }

  chargeForService(
    payerAgentId: string,
    serviceType: keyof typeof AGENT_PRICING,
    reason: string
  ): AgentPayment | null {
    const amount = AGENT_PRICING[serviceType];
    const systemAgentId = "system-treasury";

    // Ensure system treasury exists
    if (!this.agents.has(systemAgentId)) {
      this.registerAgent(systemAgentId, "System Treasury", "portfolio", "0");
    }

    // Deduct from payer
    const payerEntry = this.agents.get(payerAgentId);
    if (!payerEntry) {
      console.error("Payer agent not found");
      return null;
    }

    const payment: AgentPayment = {
      id: `charge-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      from: payerEntry.identity,
      to: this.agents.get(systemAgentId)!.identity,
      amount,
      reason,
      timestamp: Date.now(),
      status: "completed",
    };

    const payerBalance = BigInt(payerEntry.balance);
    const chargeAmount = BigInt(amount);

    payerEntry.balance = (payerBalance - chargeAmount).toString();
    payerEntry.ledger.push(payment);
    this.globalLedger.push(payment);

    payerEntry.identity.totalPayments = (
      BigInt(payerEntry.identity.totalPayments) + chargeAmount
    ).toString();

    return payment;
  }

  recordEarnings(
    agentId: string,
    amount: string,
    reason: string
  ): AgentPayment | null {
    const agentEntry = this.agents.get(agentId);
    if (!agentEntry) {
      console.error("Agent not found");
      return null;
    }

    // Ensure system treasury exists
    const systemAgentId = "system-treasury";
    if (!this.agents.has(systemAgentId)) {
      this.registerAgent(systemAgentId, "System Treasury", "portfolio", "0");
    }

    const payment: AgentPayment = {
      id: `earning-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      from: this.agents.get(systemAgentId)!.identity,
      to: agentEntry.identity,
      amount,
      reason,
      timestamp: Date.now(),
      status: "completed",
    };

    const earningAmount = BigInt(amount);
    agentEntry.balance = (BigInt(agentEntry.balance) + earningAmount).toString();
    agentEntry.ledger.push(payment);
    this.globalLedger.push(payment);

    agentEntry.identity.totalEarnings = (
      BigInt(agentEntry.identity.totalEarnings) + earningAmount
    ).toString();

    return payment;
  }

  updateReputation(agentId: string, delta: number): void {
    const agent = this.agents.get(agentId);
    if (!agent) {
      console.error("Agent not found");
      return;
    }

    agent.identity.reputation = Math.max(
      0,
      Math.min(1000, agent.identity.reputation + delta)
    );
  }

  updatePerformanceScore(agentId: string, score: number): void {
    const agent = this.agents.get(agentId);
    if (!agent) {
      console.error("Agent not found");
      return;
    }

    agent.identity.performanceScore = Math.max(0, Math.min(1, score));
  }

  getBalance(agentId: string): string {
    const agent = this.agents.get(agentId);
    return agent?.balance || "0";
  }

  getPaymentHistory(agentId: string): AgentPayment[] {
    const agent = this.agents.get(agentId);
    return agent?.ledger || [];
  }

  getLeaderboard(): AgentIdentity[] {
    return Array.from(this.agents.values())
      .filter(e => !e.identity.agentId.includes("system"))
      .map(e => e.identity)
      .sort((a, b) => b.reputation - a.reputation);
  }

  getGlobalLedger(): AgentPayment[] {
    return [...this.globalLedger];
  }

  getAgentEconomySnapshot() {
    const snapshot: Record<string, any> = {};
    for (const [agentId, entry] of this.agents) {
      if (!agentId.includes("system")) {
        snapshot[agentId] = {
          identity: entry.identity,
          balance: entry.balance,
          recentPayments: entry.ledger.slice(-5),
        };
      }
    }
    return snapshot;
  }

  getTotalVolume(): string {
    return this.globalLedger.reduce((sum, payment) => {
      return (BigInt(sum) + BigInt(payment.amount)).toString();
    }, "0");
  }
}

// Singleton instance
let economyManager: AgentEconomyManager | null = null;

export function getAgentEconomy(): AgentEconomyManager {
  if (!economyManager) {
    economyManager = new AgentEconomyManager();
  }
  return economyManager;
}

export function resetAgentEconomy(): void {
  economyManager = new AgentEconomyManager();
}
