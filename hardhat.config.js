import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    "bsc-testnet": {
      url: process.env.BSC_TESTNET_RPC || "https://data-seed-prebsc-1-1.bnbchain.org:8545",
      chainId: 97,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 10e9,
    },
    "bsc-mainnet": {
      url: process.env.BSC_MAINNET_RPC || "https://bsc-dataseed.bnbchain.org",
      chainId: 56,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 5e9,
    },
    hardhat: {
      chainId: 1337,
      forking: {
        enabled: false,
        url: process.env.BSC_TESTNET_RPC || "https://data-seed-prebsc-1-1.bnbchain.org:8545",
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  etherscan: {
    apiKey: {
      bscTestnet: process.env.BSCSCAN_API_KEY || "",
      bsc: process.env.BSCSCAN_API_KEY || "",
    },
  },
};

export default config;
