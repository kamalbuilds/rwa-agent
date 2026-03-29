import { AgentMessage, AgentRole } from "./types";
import { RWA_TOKENS, RWAToken } from "../rwa/tokens";

const AGENT: AgentRole = "research";

function generateId() {
  return `${AGENT}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

interface MarketCondition {
  treasuryYield: number;
  goldTrend: "up" | "down" | "flat";
  stablecoinDepeg: boolean;
  rwaInflows: number;
  sentiment: "bullish" | "bearish" | "neutral";
}

function simulateMarketConditions(): MarketCondition {
  return {
    treasuryYield: 4.2 + Math.random() * 1.2,
    goldTrend: ["up", "down", "flat"][Math.floor(Math.random() * 3)] as MarketCondition["goldTrend"],
    stablecoinDepeg: Math.random() < 0.05,
    rwaInflows: Math.round((Math.random() * 200 - 50) * 100) / 100,
    sentiment: ["bullish", "bearish", "neutral"][Math.floor(Math.random() * 3)] as MarketCondition["sentiment"],
  };
}

function analyzeToken(token: RWAToken, market: MarketCondition): AgentMessage {
  const signals: string[] = [];
  let confidence = 0.5;

  if (token.category === "treasury") {
    if (market.treasuryYield > 4.5) {
      signals.push(`Treasury yields at ${market.treasuryYield.toFixed(2)}%, ${token.symbol} yield competitive`);
      confidence += 0.15;
    }
    if (market.rwaInflows > 50) {
      signals.push(`Strong RWA inflows: +$${market.rwaInflows.toFixed(0)}M this week`);
      confidence += 0.1;
    }
  }

  if (token.category === "gold" && market.goldTrend === "up") {
    signals.push("Gold trending up, favorable for gold-backed RWA");
    confidence += 0.2;
  }

  if (token.category === "stablecoin" && market.stablecoinDepeg) {
    signals.push("Stablecoin depeg risk detected in market");
    confidence -= 0.3;
  }

  if (market.sentiment === "bullish") {
    confidence += 0.1;
    signals.push("Market sentiment: bullish");
  } else if (market.sentiment === "bearish") {
    confidence -= 0.1;
    signals.push("Market sentiment: bearish, caution advised");
  }

  return {
    id: generateId(),
    agent: AGENT,
    timestamp: Date.now(),
    type: "analysis",
    content: `[${token.symbol}] ${signals.join(". ") || "No significant signals detected"}.`,
    confidence: Math.max(0.1, Math.min(0.95, confidence)),
    data: {
      token: token.symbol,
      apy: token.apy,
      signals,
      market,
    },
  };
}

export function runResearchCycle(): AgentMessage[] {
  const market = simulateMarketConditions();
  const messages: AgentMessage[] = [];

  messages.push({
    id: generateId(),
    agent: AGENT,
    timestamp: Date.now(),
    type: "analysis",
    content: `Market scan: Treasury yields ${market.treasuryYield.toFixed(2)}%, Gold ${market.goldTrend}, RWA inflows $${market.rwaInflows > 0 ? "+" : ""}${market.rwaInflows.toFixed(0)}M, Sentiment: ${market.sentiment}`,
    data: { market },
    confidence: 0.8,
  });

  for (const token of RWA_TOKENS) {
    messages.push(analyzeToken(token, market));
  }

  const topYield = [...RWA_TOKENS].sort((a, b) => b.apy - a.apy)[0];
  messages.push({
    id: generateId(),
    agent: AGENT,
    timestamp: Date.now(),
    type: "signal",
    content: `Yield opportunity: ${topYield.symbol} (${topYield.protocol}) at ${topYield.apy}% APY on ${topYield.chain}. TVL: ${topYield.tvl}`,
    confidence: 0.75,
    data: { recommendation: topYield.symbol, apy: topYield.apy },
  });

  return messages;
}
