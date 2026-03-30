# RWA Agent Smart Contracts

Production-quality Solidity contracts for Real World Asset (RWA) management on BNB Chain (BSC). Designed for hackathon judges who understand DeFi depth.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      RWA Agent System                        │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                       RWAVault.sol                            │
│  - Multi-token deposit/withdrawal with share accounting      │
│  - Health factor calculation (200% minimum collateral)       │
│  - Agent-controlled rebalancing                              │
│  - Chainlink price feed integration                          │
│  - Emergency pause mechanism                                 │
└──────────────────────────────────────────────────────────────┘
             │                    │                    │
             ▼                    ▼                    ▼
      ┌─────────────┐    ┌──────────────┐    ┌──────────────┐
      │ComplianceOra│    │ AgentRegistry│    │  RWARouter   │
      │cle.sol      │    │  .sol        │    │  .sol        │
      │             │    │              │    │              │
      │ KYC check   │    │ Agent stakes │    │ DEX routing  │
      │ Risk score  │    │ Reputation   │    │ Fee mgmt     │
      │ Whitelist   │    │ Performance  │    │ Slippage     │
      │ Blacklist   │    │ Leaderboard  │    │ protection   │
      └─────────────┘    └──────────────┘    └──────────────┘
```

## Supported RWA Tokens

- USDY (Ondo Finance USD Yield)
- BUIDL (Ondo Finance Short-Term US Bonds)
- PAXG (Paxos Gold)
- slisBNB (Staked Liquid BNB)
- lisUSD (Liquid Staking USD)
- ankrBNB (Ankr Liquid Staked BNB)

## Contract Details

### RWAVault.sol

The core vault contract managing user collateral and agent operations.

**Key Features:**
- Share-based accounting for proportional deposits
- Multi-token support with dynamic share calculations
- Health factor enforcement (minimum 200% collateralization)
- Chainlink price feed integration (configurable)
- Agent-only rebalancing via `onlyAgent` modifier
- Emergency pause mechanism for security
- Event logging for all state changes

**Function Highlights:**

```solidity
// User Functions
function deposit(address _token, uint256 _amount) external returns (uint256 shares)
function withdraw(address _token, uint256 _shares) external returns (uint256 amount)
function getHealthFactor(address _user) external view returns (uint256)
function getUserCollateral(address _user) external view returns (uint256)

// Agent Functions
function rebalance(address[] calldata _tokens, uint256[] calldata _amounts) external onlyAgent
function executeAgentAction(string calldata _actionType, bytes calldata _data) external onlyAgent

// Admin Functions
function setPriceFeed(address _token, address _priceFeed) external onlyOwner
function addSupportedToken(address _token, address _priceFeed) external onlyOwner
function setAgent(address _agent) external onlyOwner
function pause(bool _isPaused) external onlyOwner
```

**Health Factor Calculation:**
```
HealthFactor = (Total Collateral Value USD) / (Total Deposit Value USD)
Minimum Required = 200% (2.0x)
```

### ComplianceOracle.sol

Regulatory compliance screening for wallet interactions.

**Key Features:**
- KYC approval tracking per address
- Risk score management (0-100 scale)
- Whitelist/blacklist functionality
- Role-based access control (COMPLIANCE_OFFICER_ROLE, RISK_MANAGER_ROLE)
- Automatic compliance checks based on risk thresholds
- Batch operations for efficient updates

**Compliance Logic:**
```
isCompliant(wallet) returns true if:
  - NOT blacklisted
  - AND (whitelisted OR (KYC-approved AND risk-score <= threshold))
```

**Roles:**
- DEFAULT_ADMIN_ROLE: Full control
- COMPLIANCE_OFFICER_ROLE: KYC management, whitelist/blacklist
- RISK_MANAGER_ROLE: Risk score updates

### AgentRegistry.sol

AI agent registration, reputation, and performance tracking (ERC-8004 inspired).

**Key Features:**
- Agent registration with minimum stake requirement
- Reputation system (0-1000 scale)
- Trade performance tracking
- Dynamic leaderboard generation
- Agent deactivation mechanism
- Stake/unstake functionality

**Agent Reputation:**
- Initial: 100 points
- Max: 1000 points
- Min: 0 points
- Adjusted based on trade PnL
- Profitable trades increase reputation
- Losing trades decrease reputation

**Leaderboard:**
- Top agents sorted by reputation
- Includes total trades and cumulative PnL
- Queryable on-chain via `getLeaderboard(uint256 limit)`

**Functions:**
```solidity
function registerAgent(address _agentAddress, string calldata _name, uint256 _initialStake)
function recordTrade(address _agentAddress, int256 _pnl) external onlyOwner
function updateReputation(address _agentAddress, int256 _reputationDelta, string calldata _reason)
function getLeaderboard(uint256 _limit) external view returns (LeaderboardEntry[] memory)
```

### RWARouter.sol

DEX routing and swap execution with compliance checks.

**Key Features:**
- Multi-protocol routing (default PancakeSwap)
- Slippage protection via minimum output validation
- Protocol fee collection (configurable in basis points)
- Compliance checks before execution
- Custom route management
- Price quoting functionality

**Swap Flow:**
```
1. User initiates swap with params
2. Compliance check (isCompliant check)
3. Fee calculation and collection
4. Route lookup (custom or default DEX)
5. Execute swap with slippage protection
6. Transfer output to user
```

**Fee Structure:**
- Default: 0.25% (25 basis points)
- Configurable by owner
- Accumulated per token
- Withdrawable by owner

## Deployment on BSC Testnet

### Prerequisites
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts dotenv
```

### Configuration

Create `.env` file:
```
PRIVATE_KEY=your_private_key_here
BSC_TESTNET_RPC=https://data-seed-prebsc-1-1.bnbchain.org:8545
```

### Deploy Scripts

Run `scripts/deploy.ts`:
```bash
npx hardhat run scripts/deploy.ts --network bsc-testnet
```

Deployment order:
1. ComplianceOracle
2. AgentRegistry (set stakeToken after)
3. RWAVault
4. RWARouter
5. Connect contracts together

## Security Considerations

1. **Health Factor Enforcement**: Prevents under-collateralized positions
2. **Emergency Pause**: Owner can pause vault in emergency
3. **Compliance Integration**: All swaps require compliance checks
4. **Reentrancy Guards**: NonReentrant on critical functions
5. **Role-Based Access**: ComplianceOracle uses AccessControl
6. **Input Validation**: All external inputs validated
7. **Safe ERC20**: Uses SafeERC20 for token transfers

## Gas Optimization

- Event-driven architecture reduces storage access
- Cached price lookups reduce oracle calls
- Batch operations for compliance updates
- Efficient share accounting prevents rounding errors

## Integration with AI Agent

The vault exposes agent-specific functions:

```solidity
// Agent rebalances positions based on market conditions
vault.rebalance(
    [USDY, BUIDL, PAXG],
    [1000e18, 500e18, 250e18]
);

// Agent records its trading results
agentRegistry.recordTrade(agentAddress, pnlAmount);

// Agent executes custom actions
vault.executeAgentAction("swap_optimization", encodedData);
```

## Testing

Example test scenarios:
1. Deposit multiple tokens and verify share calculation
2. Withdraw and check health factor requirements
3. Rebalance as agent and verify events
4. Record trades and check reputation updates
5. Verify compliance checks block non-compliant users
6. Test slippage protection on swaps

## Next Steps

1. Deploy on BSC testnet
2. Initialize with real token addresses and price feeds
3. Set minimum health factor thresholds
4. Configure PancakeSwap router for live swaps
5. Onboard agents with stakes
6. Run hackathon demo with live trades

---

**Solidity Version:** ^0.8.20
**License:** MIT
**Target Network:** BNB Chain (Testnet & Mainnet)
