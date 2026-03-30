import { NextResponse } from "next/server";
import { getClientWithFallback } from "@/lib/bnb/provider";
import { RWA_CONTRACTS, BSC_TOKENS, ERC20_ABI } from "@/lib/bnb/contracts";
import { getBNBPrice } from "@/lib/bnb/prices";
import { formatUnits } from "viem";

export async function GET() {
  try {
    const client = await getClientWithFallback();

    // Fetch real on-chain data in parallel
    const [blockNumber, gasPrice, bnbPrice] = await Promise.all([
      client.getBlockNumber(),
      client.getGasPrice(),
      getBNBPrice(),
    ]);

    // Fetch token supplies separately with error handling
    let usdtSupply = "0";
    let ankrBnbSupply = "0";

    try {
      const supply = await client.readContract({
        address: BSC_TOKENS.USDT,
        abi: ERC20_ABI,
        functionName: "totalSupply",
      });
      usdtSupply = formatUnits(supply as bigint, 18);
    } catch (e) {
      console.warn("USDT supply fetch failed:", e);
    }

    try {
      const supply = await client.readContract({
        address: RWA_CONTRACTS.ankrBNB,
        abi: ERC20_ABI,
        functionName: "totalSupply",
      });
      ankrBnbSupply = formatUnits(supply as bigint, 18);
    } catch (e) {
      console.warn("ankrBNB supply fetch failed:", e);
    }

    // Convert gas price from wei to gwei
    const gasPriceGwei = parseFloat(formatUnits(gasPrice, 9));

    return NextResponse.json({
      chain: "BNB Smart Chain",
      chainId: 56,
      blockNumber: blockNumber.toString(),
      gasPrice: `${gasPriceGwei.toFixed(2)} gwei`,
      bnbPrice,
      connected: true,
      tokens: {
        USDT: {
          address: BSC_TOKENS.USDT,
          totalSupply: usdtSupply,
          decimals: 18,
        },
        ankrBNB: {
          address: RWA_CONTRACTS.ankrBNB,
          totalSupply: ankrBnbSupply,
          decimals: 18,
        },
      },
      timestamp: Date.now(),
      dataSource: "on-chain",
    });
  } catch (error) {
    console.error("Chain data fetch error:", error);
    return NextResponse.json(
      {
        chain: "BNB Smart Chain",
        chainId: 56,
        error: "Failed to fetch live chain data",
        connected: false,
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}
