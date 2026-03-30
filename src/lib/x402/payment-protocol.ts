import { X402PaymentRequest, X402PaymentReceipt } from "./types";
import { getAgentEconomy } from "./agent-economy";

const CHAIN_ID = 56; // BSC mainnet
const USDC_ADDRESS = "0x8AC76a51cc950d9822D68b83fE1ad97B32Cd580d";

export function createPaymentRequest(
  resource: string,
  amount: string,
  recipientAgentId: string,
  description: string
): X402PaymentRequest {
  const economy = getAgentEconomy();
  const recipient = economy.getAgent(recipientAgentId);

  if (!recipient) {
    throw new Error(`Agent ${recipientAgentId} not found`);
  }

  return {
    version: "x402-v1",
    paymentRequired: {
      amount,
      token: USDC_ADDRESS,
      recipient: recipientAgentId,
      chainId: CHAIN_ID,
      description,
    },
    paywall: {
      resource,
      ttl: 3600, // 1 hour validity
    },
  };
}

export function processPayment(
  request: X402PaymentRequest,
  payerAgentId: string
): X402PaymentReceipt | null {
  const economy = getAgentEconomy();
  const payer = economy.getAgent(payerAgentId);

  if (!payer) {
    console.error("Payer agent not found");
    return null;
  }

  const payment = economy.createPayment(
    payerAgentId,
    request.paymentRequired.recipient,
    request.paymentRequired.amount,
    request.paymentRequired.description
  );

  if (!payment) {
    console.error("Payment processing failed");
    return null;
  }

  return {
    txHash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
    payer: payerAgentId,
    recipient: request.paymentRequired.recipient,
    amount: request.paymentRequired.amount,
    timestamp: Date.now(),
    resource: request.paywall.resource,
  };
}

export function verifyPayment(receipt: X402PaymentReceipt): boolean {
  if (!receipt.txHash || !receipt.payer || !receipt.recipient || !receipt.amount) {
    return false;
  }

  // In a real implementation, this would verify the transaction on-chain
  // For simulation, we just validate the structure
  return receipt.timestamp > 0 && receipt.amount !== "0";
}

export function getAgentBalance(agentId: string): string {
  const economy = getAgentEconomy();
  return economy.getBalance(agentId);
}

export function getPaymentHistory(agentId: string) {
  const economy = getAgentEconomy();
  return economy.getPaymentHistory(agentId);
}

export function chargeAgentForService(
  agentId: string,
  serviceType: "research" | "risk" | "trading_success" | "compliance" | "portfolio",
  reason: string
): void {
  const economy = getAgentEconomy();
  economy.chargeForService(agentId, serviceType, reason);
}

export function recordAgentEarnings(
  agentId: string,
  amount: string,
  reason: string
): void {
  const economy = getAgentEconomy();
  economy.recordEarnings(agentId, amount, reason);
}
