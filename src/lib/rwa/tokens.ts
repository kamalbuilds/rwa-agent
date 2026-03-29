export interface RWAToken {
  symbol: string;
  name: string;
  address: string;
  category: "treasury" | "gold" | "credit" | "stablecoin";
  apy: number;
  price: number;
  tvl: string;
  risk: "low" | "medium" | "high";
  chain: string;
  protocol: string;
  description: string;
}

export const RWA_TOKENS: RWAToken[] = [
  {
    symbol: "USDY",
    name: "Ondo US Dollar Yield",
    address: "0x5bE26527e817998A7206475496fDE1E68957c5A6",
    category: "treasury",
    apy: 4.8,
    price: 1.052,
    tvl: "$1.2B",
    risk: "low",
    chain: "BNB Chain",
    protocol: "Ondo Finance",
    description: "Tokenized US Treasury notes yielding 4.8% APY",
  },
  {
    symbol: "BUIDL",
    name: "BlackRock USD Institutional",
    address: "0x7712c34205737192402172409a8F7ccef8aA2AEc",
    category: "treasury",
    apy: 4.5,
    price: 1.0,
    tvl: "$5.8B",
    risk: "low",
    chain: "BNB Chain",
    protocol: "BlackRock/Securitize",
    description: "BlackRock tokenized money market fund",
  },
  {
    symbol: "PAXG",
    name: "Paxos Gold",
    address: "0x7950865a9140cB519342433146Ed5b40c6F210f7",
    category: "gold",
    apy: 0,
    price: 3150.0,
    tvl: "$600M",
    risk: "low",
    chain: "BNB Chain",
    protocol: "Paxos",
    description: "1:1 backed by physical gold in London vaults",
  },
  {
    symbol: "slisBNB",
    name: "Staked Lista BNB",
    address: "0xB0b84D294e0C75A6abe60171b70edEb2EFd14A1B",
    category: "treasury",
    apy: 3.2,
    price: 605.0,
    tvl: "$450M",
    risk: "low",
    chain: "BNB Chain",
    protocol: "Lista DAO",
    description: "Liquid staked BNB with DeFi composability",
  },
  {
    symbol: "lisUSD",
    name: "Lista USD",
    address: "0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5",
    category: "stablecoin",
    apy: 5.2,
    price: 1.0,
    tvl: "$320M",
    risk: "medium",
    chain: "BNB Chain",
    protocol: "Lista DAO",
    description: "Decentralized stablecoin collateralized by liquid staking tokens",
  },
  {
    symbol: "ankrBNB",
    name: "Ankr Staked BNB",
    address: "0x52F24a5e03aee338Da5fd9Df68D2b6FAe1178827",
    category: "treasury",
    apy: 2.9,
    price: 610.0,
    tvl: "$200M",
    risk: "low",
    chain: "BNB Chain",
    protocol: "Ankr",
    description: "Liquid staked BNB via Ankr protocol",
  },
];

export const RWA_CATEGORIES = {
  treasury: { label: "Treasury/Fixed Income", color: "#3b82f6" },
  gold: { label: "Commodities/Gold", color: "#f59e0b" },
  credit: { label: "Credit/Lending", color: "#8b5cf6" },
  stablecoin: { label: "Stablecoins", color: "#10b981" },
};
