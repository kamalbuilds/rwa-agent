import { NextResponse } from "next/server";
import { RWA_TOKENS } from "@/lib/rwa/tokens";
import { getTokenPrice, getPricesBySymbols, getBNBPrice } from "@/lib/bnb/prices";
import { getTokenAPY, FALLBACK_APY } from "@/lib/bnb/venus";
import { getClientWithFallback } from "@/lib/bnb/provider";
import { RWA_CONTRACTS, ERC20_ABI } from "@/lib/bnb/contracts";
import { formatUnits } from "viem";

interface RWATokenResponse {
  symbol: string;
  name: string;
  address: string;
  category: string;
  apy: number;
  price: number;
  tvl: string;
  risk: string;
  chain: string;
  protocol: string;
  description: string;
  onChainData?: {
    totalSupply?: string;
    decimals?: number;
    lastUpdated: number;
  };
}

async function fetchTokenOnChainData(
  symbol: string,
  address: string
): Promise<{ totalSupply?: string; decimals?: number }> {
  try {
    const client = await getClientWithFallback();

    const [supply, decimals] = await Promise.all([
      client.readContract({
        address: address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "totalSupply",
      }),
      client.readContract({
        address: address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "decimals",
      }),
    ]);

    return {
      totalSupply: formatUnits(supply as bigint, decimals as number),
      decimals: Number(decimals),
    };
  } catch (error) {
    console.warn(`Failed to fetch on-chain data for ${symbol}:`, error);
    return {};
  }
}

export async function GET() {
  try {
    // Fetch real prices for all tokens
    const priceSymbols = RWA_TOKENS.map((t) => t.symbol);
    const prices = await getPricesBySymbols(priceSymbols);

    // Fetch real APYs from Venus
    const apyPromises = RWA_TOKENS.map((t) => getTokenAPY(t.symbol));
    const apyResults = await Promise.all(apyPromises);

    // Fetch on-chain data (total supply, decimals)
    const onChainPromises = RWA_TOKENS.map((t) =>
      fetchTokenOnChainData(t.symbol, t.address)
    );
    const onChainResults = await Promise.all(onChainPromises);

    // Construct response with real data
    const tokens: RWATokenResponse[] = RWA_TOKENS.map((token, index) => ({
      symbol: token.symbol,
      name: token.name,
      address: token.address,
      category: token.category,
      apy: apyResults[index] || FALLBACK_APY[token.symbol] || token.apy,
      price: prices[token.symbol] || token.price,
      tvl: token.tvl,
      risk: token.risk,
      chain: token.chain,
      protocol: token.protocol,
      description: token.description,
      onChainData: onChainResults[index]
        ? {
            totalSupply: onChainResults[index].totalSupply,
            decimals: onChainResults[index].decimals,
            lastUpdated: Date.now(),
          }
        : undefined,
    }));

    // Get BNB price
    const bnbPrice = await getBNBPrice();

    return NextResponse.json({
      tokens,
      bnbPrice,
      timestamp: Date.now(),
      dataSource: "on-chain",
    });
  } catch (error) {
    console.error("Failed to fetch RWA data:", error);
    return NextResponse.json(
      {
        tokens: RWA_TOKENS,
        error: "Partial data: Using fallback prices",
        timestamp: Date.now(),
        dataSource: "fallback",
      },
      { status: 200 }
    );
  }
}
