import { createPublicClient, http, formatUnits, parseAbi } from "viem";
import { bsc } from "viem/chains";

export const bnbClient = createPublicClient({
  chain: bsc,
  transport: http("https://bsc-dataseed1.binance.org"),
});

const ERC20_ABI = parseAbi([
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
]);

const PANCAKE_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E" as const;

// BNB Chain verified token addresses
export const BNB_TOKENS = {
  USDT: "0x55d398326f99059fF775485246999027B3197955" as const,
  USDC: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d" as const,
  WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" as const,
  PAXG: "0x7950865a9140cB519342433146Ed5b40c6F210f7" as const,
  ankrBNB: "0x52F24a5e03aee338Da5fd9Df68D2b6FAe1178827" as const,
  slisBNB: "0xB0b84D294e0C75A6abe60171b70edEb2EFd14A1B" as const,
  lisUSD: "0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5" as const,
};

export async function getTokenBalance(
  tokenAddress: `0x${string}`,
  walletAddress: `0x${string}`
): Promise<{ balance: string; decimals: number }> {
  try {
    const [balance, decimals] = await Promise.all([
      bnbClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [walletAddress],
      }),
      bnbClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "decimals",
      }),
    ]);
    return {
      balance: formatUnits(balance, decimals),
      decimals,
    };
  } catch {
    return { balance: "0", decimals: 18 };
  }
}

export async function getTokenSupply(
  tokenAddress: `0x${string}`
): Promise<string> {
  try {
    const [supply, decimals] = await Promise.all([
      bnbClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "totalSupply",
      }),
      bnbClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "decimals",
      }),
    ]);
    return formatUnits(supply, decimals);
  } catch {
    return "0";
  }
}

export async function getBNBPrice(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT"
    );
    const data = await response.json();
    return parseFloat(data.price);
  } catch {
    return 600;
  }
}

export async function getLatestBlockNumber(): Promise<bigint> {
  return bnbClient.getBlockNumber();
}

export async function getGasPrice(): Promise<string> {
  const gasPrice = await bnbClient.getGasPrice();
  return formatUnits(gasPrice, 9); // gwei
}

export interface ChainStatus {
  blockNumber: bigint;
  gasPrice: string;
  bnbPrice: number;
  connected: boolean;
}

export async function getChainStatus(): Promise<ChainStatus> {
  try {
    const [blockNumber, gasPrice, bnbPrice] = await Promise.all([
      getLatestBlockNumber(),
      getGasPrice(),
      getBNBPrice(),
    ]);
    return { blockNumber, gasPrice, bnbPrice, connected: true };
  } catch {
    return {
      blockNumber: BigInt(0),
      gasPrice: "0",
      bnbPrice: 600,
      connected: false,
    };
  }
}
