# RWA Agent Smart Contracts - Deployment Guide

## Quick Start

### 1. Setup Environment

Create a `.env` file in the project root:

```bash
# BSC Testnet RPC (required for deployment)
BSC_TESTNET_RPC=https://data-seed-prebsc-1-1.bnbchain.org:8545

# Private key for deployment account (required)
PRIVATE_KEY=your_private_key_here

# BSCscan API key (optional, for verification)
BSCSCAN_API_KEY=your_bscscan_api_key_here
```

### 2. Compile Contracts

```bash
npx hardhat compile
```

This will:
- Validate all Solidity syntax
- Generate ABIs and bytecode
- Output to `artifacts/` directory

### 3. Deploy to BSC Testnet

```bash
npx hardhat run scripts/deploy.ts --network bsc-testnet
```

The deployment script will:
1. Deploy ComplianceOracle
2. Deploy AgentRegistry
3. Deploy RWAVault
4. Deploy RWARouter
5. Configure inter-contract connections
6. Whitelist deployer account for testing
7. Save deployment addresses to `deployment.json`

### 4. Verify Deployment

Check the generated `deployment.json`:

```json
{
  "network": "bsc-testnet",
  "timestamp": "2026-03-30T...",
  "deployer": "0x...",
  "contracts": {
    "complianceOracle": "0x...",
    "agentRegistry": "0x...",
    "rwaVault": "0x...",
    "rwaRouter": "0x..."
  }
}
```

## Contract Addresses

After deployment, you'll have 4 contract addresses:

| Contract | Purpose | Key Features |
|----------|---------|--------------|
| ComplianceOracle | KYC/AML screening | Whitelist, blacklist, risk scoring |
| AgentRegistry | AI agent management | Registration, reputation, leaderboard |
| RWAVault | Collateral vault | Multi-token deposits, health factors |
| RWARouter | DEX routing | Swaps, slippage protection, fees |

## Post-Deployment Configuration

### Add RWA Token Support

For each RWA token (USDY, BUIDL, PAXG, etc.), call:

```solidity
vault.addSupportedToken(
    tokenAddress,
    chainlinkPriceFeedAddress
);
```

**Example Chainlink Price Feeds (BSC Testnet):**
- BUSD/USD: 0x9331b55D9830EF609A2aBCfAc83E3374E977A80F
- BNB/USD: 0x2514895c72f50d8bd4b4f9b1110f0d6bd2c97526

### Register an AI Agent

```solidity
agentRegistry.registerAgent(
    agentAddress,           // AI agent wallet
    "Agent-Name",          // Display name
    stakeAmount           // Minimum 1000 tokens
);
```

### Configure Swap Fees

```solidity
// Set swap fee to 0.5% (50 basis points)
rwaRouter.setFeePercentage(50);
```

### Setup Compliance

```solidity
// Approve KYC for user
complianceOracle.updateKYCStatus(userAddress, true);

// Set risk score (0-100)
complianceOracle.updateRiskScore(userAddress, 30);

// Or whitelist directly
complianceOracle.whitelist(userAddress);
```

## Testing Flows

### 1. User Deposit Flow

```solidity
// 1. User approves vault to spend tokens
token.approve(vaultAddress, amount);

// 2. User deposits
vault.deposit(tokenAddress, amount);

// 3. Check health factor
uint256 hf = vault.getHealthFactor(userAddress);
require(hf >= 2e18, "Insufficient collateral");
```

### 2. Agent Rebalance Flow

```solidity
// Only agent can call
vault.rebalance(
    [token1, token2, token3],
    [amount1, amount2, amount3]
);
```

### 3. Trade Recording Flow

```solidity
// Agent records a profitable trade
agentRegistry.recordTrade(agentAddress, 1000e18); // +$1000 PnL

// Check updated reputation
uint256 reputation = agentRegistry.getReputation(agentAddress);
```

### 4. Swap Flow

```solidity
// User initiates swap with compliance check
router.swap(IRWARouter.SwapParams({
    tokenIn: address(USDY),
    tokenOut: address(BUIDL),
    amountIn: 1000e18,
    minAmountOut: 950e18,  // 5% slippage protection
    swapData: bytes("")
}));
```

## Mainnet Deployment

To deploy to BSC Mainnet:

```bash
# Update .env with mainnet RPC and private key
BSC_MAINNET_RPC=https://bsc-dataseed.bnbchain.org
PRIVATE_KEY=your_mainnet_key

# Deploy
npx hardhat run scripts/deploy.ts --network bsc-mainnet
```

Key differences for mainnet:
- Use real RWA token addresses
- Use real Chainlink price feeds
- Higher gas prices (5 Gwei typical)
- Lower test amounts

## Security Checklist

Before mainnet deployment:

- [ ] All contracts audited
- [ ] Emergency pause tested
- [ ] Health factor calculation verified
- [ ] Price feed addresses confirmed
- [ ] Compliance rules finalized
- [ ] Agent reputation thresholds set
- [ ] Fee percentages agreed
- [ ] Multi-sig wallet for admin functions (recommended)

## Troubleshooting

### "No Hardhat config file found"
Make sure `hardhat.config.js` exists in project root.

### "Contract already deployed at address"
Check `deployment.json` or use a fresh address.

### "Insufficient balance for gas"
Fund the deployment account with testnet BNB from faucet.

### "Chainlink price feed not available"
Verify price feed address on BSCScan for the correct network.

## Contract Sizes

```
RWAVault.sol:        ~13.4 KB (within limits)
ComplianceOracle.sol: ~8.3 KB
AgentRegistry.sol:   ~12.6 KB
RWARouter.sol:       ~10.1 KB
```

All contracts are under BSC's 24KB size limit.

## Next Steps

1. Deploy to testnet and test all flows
2. Record transactions and generate usage examples
3. Prepare demo scenarios for hackathon judges
4. Create UI integration examples
5. Document gas optimization opportunities

---

**Network:** BSC Testnet (ChainID: 97)
**Solidity:** ^0.8.20
**Status:** Ready for deployment
