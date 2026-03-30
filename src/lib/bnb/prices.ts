import { getClientWithFallback } from "./provider";
import { CHAINLINK_FEEDS, CHAINLINK_PRICE_FEED_ABI } from "./contracts";
import { formatUnits } from "viem";

interface DeFiLlamaPrice {
  [key: string]: {
    price: number;
  };
}

const DEFILLAMA_CACHE: Map<string, { price: number; timestamp: number }> = new Map();
const CACHE_TTL = 60000; // 1 minute

async function fetchDeFiLlamaPrices(tokens: string[]): Promise<DeFiLlamaPrice> {
  try {
    const tokenString = tokens.join(",");
    const response = await fetch(
      `https://coins.llama.fi/prices/current/${tokenString}`,
      { next: { revalidate: 30 } }
    );
    if (!response.ok) throw new Error("DeFi Llama API error");
    const data = await response.json();
    return data.coins || {};
  } catch (error) {
    console.warn("DeFi Llama API unavailable:", error);
    return {};
  }
}

export async function getTokenPrice(
  tokenSymbol: string,
  bscAddress?: string
): Promise<number | null> {
  // Check cache first
  const cached = DEFILLAMA_CACHE.get(tokenSymbol);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.price;
  }

  try {
    // Try DeFi Llama with BSC address if available
    let llamaKey = tokenSymbol;
    if (bscAddress) {
      llamaKey = `bsc:${bscAddress.toLowerCase()}`;
    }

    const prices = await fetchDeFiLlamaPrices([llamaKey]);
    const priceData = prices[llamaKey];

    if (priceData?.price) {
      const price = priceData.price;
      DEFILLAMA_CACHE.set(tokenSymbol, { price, timestamp: Date.now() });
      return price;
    }

    // Fallback to Chainlink for common tokens
    return await getChainlinkPrice(tokenSymbol);
  } catch (error) {
    console.warn(`Failed to fetch price for ${tokenSymbol}:`, error);
    return null;
  }
}

async function getChainlinkPrice(tokenSymbol: string): Promise<number | null> {
  try {
    // For now, rely on DeFi Llama primarily
    // Chainlink calls can be expensive during build time
    return null;
  } catch (error) {
    console.warn(`Chainlink price fetch failed for ${tokenSymbol}:`, error);
    return null;
  }
}

export async function getMultiplePrices(
  tokens: Array<{ symbol: string; address?: string }>
): Promise<Map<string, number>> {
  const prices = new Map<string, number>();

  const results = await Promise.allSettled(
    tokens.map((t) => getTokenPrice(t.symbol, t.address))
  );

  results.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value !== null) {
      prices.set(tokens[index].symbol, result.value);
    }
  });

  return prices;
}

// Fallback prices for demo (real data preferred)
export const FALLBACK_PRICES: Record<string, number> = {
  BNB: 600,
  USDT: 1.0,
  USDC: 1.0,
  USDY: 1.052,
  PAXG: 3150,
  slisBNB: 605,
  lisUSD: 1.0,
  ankrBNB: 610,
  BUIDL: 1.0,
};

export async function getBNBPrice(): Promise<number> {
  const cached = DEFILLAMA_CACHE.get("BNB");
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.price;
  }

  try {
    // Try Chainlink first
    const chainlinkPrice = await getChainlinkPrice("BNB_USD");
    if (chainlinkPrice) return chainlinkPrice;

    // Try DeFi Llama
    const prices = await fetchDeFiLlamaPrices(["binancecoin"]);
    const price = prices.binancecoin?.price;
    if (price) {
      DEFILLAMA_CACHE.set("BNB", { price, timestamp: Date.now() });
      return price;
    }

    // Fallback
    return FALLBACK_PRICES.BNB;
  } catch (error) {
    console.warn("Failed to fetch BNB price:", error);
    return FALLBACK_PRICES.BNB;
  }
}

export async function getPricesBySymbols(
  symbols: string[]
): Promise<Record<string, number>> {
  const prices: Record<string, number> = {};

  const results = await Promise.allSettled(
    symbols.map(async (symbol) => {
      const price = await getTokenPrice(symbol);
      if (price !== null) {
        prices[symbol] = price;
      } else {
        prices[symbol] = FALLBACK_PRICES[symbol] || 1.0;
      }
    })
  );

  return prices;
}
