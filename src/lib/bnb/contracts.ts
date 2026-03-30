// These ABIs are defined as const to avoid parseAbi at build time
// parseAbi is evaluated at import time which can cause issues during builds

export const ERC20_ABI = [
  { type: 'function', name: 'balanceOf', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'decimals', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
  { type: 'function', name: 'totalSupply', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'symbol', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { type: 'function', name: 'name', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { type: 'function', name: 'allowance', stateMutability: 'view', inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ type: 'uint256' }] },
] as const;

export const CHAINLINK_PRICE_FEED_ABI = [
  { type: 'function', name: 'latestRoundData', stateMutability: 'view', inputs: [], outputs: [
    { name: 'roundId', type: 'uint80' },
    { name: 'answer', type: 'int256' },
    { name: 'startedAt', type: 'uint256' },
    { name: 'updatedAt', type: 'uint256' },
    { name: 'answeredInRound', type: 'uint80' }
  ]},
  { type: 'function', name: 'decimals', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
] as const;

export const VENUS_COMPTROLLER_ABI = [
  { type: 'function', name: 'getAllMarkets', stateMutability: 'view', inputs: [], outputs: [{ type: 'address[]' }] },
  { type: 'function', name: 'markets', stateMutability: 'view', inputs: [{ name: 'market', type: 'address' }], outputs: [{ name: 'isListed', type: 'bool' }, { name: 'collateralFactorMantissa', type: 'uint256' }, { name: 'isComped', type: 'bool' }] },
  { type: 'function', name: 'borrowCaps', stateMutability: 'view', inputs: [{ name: 'market', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'supplyCaps', stateMutability: 'view', inputs: [{ name: 'market', type: 'address' }], outputs: [{ type: 'uint256' }] },
] as const;

export const VENUS_VTOKEN_ABI = [
  { type: 'function', name: 'getAccountSnapshot', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: 'error', type: 'uint256' }, { name: 'vTokenBalance', type: 'uint256' }, { name: 'borrowBalance', type: 'uint256' }, { name: 'exchangeRateCurrent', type: 'uint256' }] },
  { type: 'function', name: 'borrowRatePerBlock', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'supplyRatePerBlock', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'exchangeRateStored', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'getCash', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'totalBorrows', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'totalSupply', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'underlying', stateMutability: 'view', inputs: [], outputs: [{ type: 'address' }] },
] as const;

// RWA Token Addresses on BSC
export const RWA_CONTRACTS = {
  USDY: "0x5bE26527e817998A7206475496fDE1E68957c5A6" as const,
  PAXG: "0x7950865a9140cB519342433146Ed5b40c6F210f7" as const,
  slisBNB: "0xB0b84D294e0C75A6abe60171b70edEb2EFd14A1B" as const,
  lisUSD: "0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5" as const,
  ankrBNB: "0x52F24a5e03aee338Da5fd9Df68D2b6FAe1178827" as const,
  BUIDL: "0x7712c34205737192402172409a8F7ccef8aA2AEc" as const,
};

// Standard BSC Token Addresses
export const BSC_TOKENS = {
  WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" as const,
  USDT: "0x55d398326f99059fF775485246999027B3197955" as const,
  USDC: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d" as const,
  BUSD: "0xe9e7cea3dedca5984780bafc599bd69add087d56" as const,
};

// Chainlink Price Feed Addresses on BSC
export const CHAINLINK_FEEDS = {
  BNB_USD: "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE" as const,
  USDT_USD: "0xB97Ad0E74b7F7cb2d42a23401CCCde1bc0eb3A50" as const,
  USDC_USD: "0x51597f405303c4377E36123cBc172b13269D1345" as const,
  BTC_USD: "0x264990fbd0A4343B3422bD7fb0fc0cb41F5D4b16" as const,
  ETH_USD: "0x9EF59B10143528124a0a3E1Adfa4fSa23B7c7234" as const,
};

// Venus Protocol Addresses
export const VENUS_CONTRACTS = {
  COMPTROLLER: "0xfD36E2c2a6789Db23113685031d7F16329158384" as const,
  // Common vTokens
  vUSDAI: "0xecA88125a5ADbe82614ffC12D0DB554E2e2867C8" as const,
  vUSDC: "0xecA88125a5ADbe82614ffC12D0DB554E2e2867C8" as const,
  vUSDT: "0xfD5840cd36d94D7229439859C0112a4497827eF3" as const,
  vBNB: "0xA07c5b74C9B40447a954e1466938b865b263Bcc1" as const,
};

export interface TokenData {
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: string;
  address: `0x${string}`;
}

export interface ContractReadResult {
  success: boolean;
  data?: unknown;
  error?: string;
}
