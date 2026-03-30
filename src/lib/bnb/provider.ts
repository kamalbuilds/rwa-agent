import { createPublicClient, http } from "viem";
import { bsc } from "viem/chains";

export const bscClient = createPublicClient({
  chain: bsc,
  transport: http("https://bsc-dataseed1.binance.org", {
    timeout: 10_000,
    retryCount: 3,
    retryDelay: 100,
  }),
});

export const bscClientFallback = createPublicClient({
  chain: bsc,
  transport: http("https://bsc-dataseed2.binance.org", {
    timeout: 10_000,
    retryCount: 2,
    retryDelay: 100,
  }),
});

export async function getClientWithFallback() {
  try {
    await bscClient.getBlockNumber();
    return bscClient;
  } catch {
    return bscClientFallback;
  }
}
