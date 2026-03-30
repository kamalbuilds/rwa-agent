import { AgentIdentity } from "./types";
import { getAgentEconomy } from "./agent-economy";

export function registerAgent(
  agentId: string,
  name: string,
  role: AgentIdentity["role"],
  stakingAmount: string
): AgentIdentity {
  const economy = getAgentEconomy();
  return economy.registerAgent(agentId, name, role, stakingAmount);
}

export function updateReputation(agentId: string, delta: number): void {
  const economy = getAgentEconomy();
  economy.updateReputation(agentId, delta);
}

export function updatePerformanceScore(agentId: string, score: number): void {
  const economy = getAgentEconomy();
  economy.updatePerformanceScore(agentId, score);
}

export function getLeaderboard(): AgentIdentity[] {
  const economy = getAgentEconomy();
  return economy.getLeaderboard();
}

export function getAgent(agentId: string): AgentIdentity | undefined {
  const economy = getAgentEconomy();
  return economy.getAgent(agentId);
}

export function getAllAgents(): Record<string, AgentIdentity> {
  const economy = getAgentEconomy();
  const snapshot = economy.getAgentEconomySnapshot();
  const result: Record<string, AgentIdentity> = {};

  for (const [agentId, data] of Object.entries(snapshot)) {
    result[agentId] = data.identity;
  }

  return result;
}

export function getAgentBalance(agentId: string): string {
  const economy = getAgentEconomy();
  return economy.getBalance(agentId);
}

export function getAgentPaymentHistory(agentId: string) {
  const economy = getAgentEconomy();
  return economy.getPaymentHistory(agentId);
}
