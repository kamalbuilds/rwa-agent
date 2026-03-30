// x402 Protocol Types
export interface X402PaymentRequest {
  version: "x402-v1";
  paymentRequired: {
    amount: string; // in wei
    token: string; // token address (USDC on BSC)
    recipient: string; // agent address
    chainId: number;
    description: string;
  };
  paywall: {
    resource: string; // what's being paid for
    ttl: number; // seconds the payment is valid
  };
}

export interface X402PaymentReceipt {
  txHash: string;
  payer: string;
  recipient: string;
  amount: string;
  timestamp: number;
  resource: string;
}

export interface AgentIdentity {
  // ERC-8004 inspired
  agentId: string;
  name: string;
  role: "research" | "risk" | "trading" | "compliance" | "portfolio";
  reputation: number; // 0-1000
  totalEarnings: string;
  totalPayments: string;
  registeredAt: number;
  stakingAmount: string;
  performanceScore: number;
}

export interface AgentPayment {
  id: string;
  from: AgentIdentity;
  to: AgentIdentity;
  amount: string;
  reason: string;
  timestamp: number;
  status: "pending" | "completed" | "failed";
}

export interface ComplianceReport {
  walletAddress: string;
  isBlacklisted: boolean;
  riskScore: number; // 0-100
  riskLevel: "low" | "medium" | "high" | "critical";
  flags: ComplianceFlag[];
  timestamp: number;
  auditTrail: AuditEntry[];
}

export interface ComplianceFlag {
  type: "sanctions" | "wallet_age" | "transaction_pattern" | "token_exposure" | "geographic";
  severity: "low" | "medium" | "high";
  description: string;
}

export interface AuditEntry {
  timestamp: number;
  action: string;
  actor: string;
  result: string;
}
