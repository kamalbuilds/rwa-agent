interface VenusMarketData {
  symbol: string;
  address: string;
  supplyAPY: number;
  borrowAPY: number;
  totalSupply: string;
  totalBorrow: string;
  liquidity: string;
  collateralFactor: number;
}

interface VenusAPIResponse {
  request: {
    timestamp: number;
  };
  result: Array<{
    symbol: string;
    address: string;
    underlying: string;
    underlyingSymbol: string;
    collateralFactor: string;
    borrowApy: string;
    supplyApy: string;
    cash: string;
    totalBorrows: string;
    totalSupply: string;
    exchangeRate: string;
  }>;
}

const VENUS_CACHE: Map<string, { data: VenusMarketData; timestamp: number }> = new Map();
const CACHE_TTL = 300000; // 5 minutes

async function fetchVenusMarkets(): Promise<VenusAPIResponse | null> {
  try {
    const response = await fetch("https://api.venus.io/api/v1/markets", {
      next: { revalidate: 60 },
    });

    if (!response.ok) throw new Error("Venus API error");
    const data: VenusAPIResponse = await response.json();
    return data;
  } catch (error) {
    console.warn("Venus API unavailable:", error);
    return null;
  }
}

export async function getVenusMarketData(symbol: string): Promise<VenusMarketData | null> {
  // Check cache
  const cached = VENUS_CACHE.get(symbol);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const apiData = await fetchVenusMarkets();
    if (!apiData) return null;

    const market = apiData.result.find(
      (m) => m.underlyingSymbol.toUpperCase() === symbol.toUpperCase()
    );

    if (!market) return null;

    const marketData: VenusMarketData = {
      symbol: market.underlyingSymbol,
      address: market.underlying,
      supplyAPY: parseFloat(market.supplyApy) * 100,
      borrowAPY: parseFloat(market.borrowApy) * 100,
      totalSupply: market.totalSupply,
      totalBorrow: market.totalBorrows,
      liquidity: market.cash,
      collateralFactor: parseFloat(market.collateralFactor),
    };

    VENUS_CACHE.set(symbol, { data: marketData, timestamp: Date.now() });
    return marketData;
  } catch (error) {
    console.warn(`Failed to fetch Venus data for ${symbol}:`, error);
    return null;
  }
}

export async function getAllVenusMarkets(): Promise<VenusMarketData[]> {
  try {
    const apiData = await fetchVenusMarkets();
    if (!apiData) return [];

    return apiData.result
      .map((market) => ({
        symbol: market.underlyingSymbol,
        address: market.underlying,
        supplyAPY: parseFloat(market.supplyApy) * 100,
        borrowAPY: parseFloat(market.borrowApy) * 100,
        totalSupply: market.totalSupply,
        totalBorrow: market.totalBorrows,
        liquidity: market.cash,
        collateralFactor: parseFloat(market.collateralFactor),
      }))
      .filter((m) => m.supplyAPY > 0 || m.borrowAPY > 0);
  } catch (error) {
    console.warn("Failed to fetch all Venus markets:", error);
    return [];
  }
}

export async function getTopVenusYields(): Promise<VenusMarketData[]> {
  const markets = await getAllVenusMarkets();
  return markets.sort((a, b) => b.supplyAPY - a.supplyAPY).slice(0, 5);
}

// Fallback APY data for common tokens
export const FALLBACK_APY: Record<string, number> = {
  USDY: 4.8,
  BUIDL: 4.5,
  PAXG: 0,
  slisBNB: 3.2,
  lisUSD: 5.2,
  ankrBNB: 2.9,
  USDT: 0.5,
  USDC: 0.5,
  BNB: 1.5,
};

export async function getTokenAPY(symbol: string): Promise<number> {
  const venusData = await getVenusMarketData(symbol);
  if (venusData) {
    return venusData.supplyAPY;
  }
  return FALLBACK_APY[symbol] || 0;
}
