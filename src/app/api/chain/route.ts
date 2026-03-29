import { NextResponse } from "next/server";
import { getChainStatus, getTokenSupply, BNB_TOKENS } from "@/lib/chain/bnb";

export async function GET() {
  try {
    const [status, usdtSupply, ankrBnbSupply] = await Promise.all([
      getChainStatus(),
      getTokenSupply(BNB_TOKENS.USDT),
      getTokenSupply(BNB_TOKENS.ankrBNB),
    ]);

    return NextResponse.json({
      chain: "BNB Smart Chain",
      blockNumber: status.blockNumber.toString(),
      gasPrice: `${parseFloat(status.gasPrice).toFixed(2)} gwei`,
      bnbPrice: status.bnbPrice,
      connected: status.connected,
      tokens: {
        USDT: { totalSupply: usdtSupply },
        ankrBNB: { totalSupply: ankrBnbSupply },
      },
      timestamp: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch chain data", connected: false },
      { status: 500 }
    );
  }
}
