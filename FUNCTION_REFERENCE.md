# RWA Agent Smart Contracts - Function Reference

Complete API reference for all smart contracts in the RWA Agent system.

## RWAVault.sol

The core vault contract managing user collateral and AI agent operations.

### User-Facing Functions

#### `deposit(address _token, uint256 _amount) -> uint256 shares`
Deposit RWA tokens into the vault and receive shares.

**Parameters:**
- `_token`: Token contract address (USDY, BUIDL, PAXG, etc.)
- `_amount`: Amount of tokens to deposit

**Returns:** Number of shares minted

**Events:** `Deposit(user, token, amount, shares, timestamp)`

**Requirements:** Token must be supported, amount > 0

---

#### `withdraw(address _token, uint256 _shares) -> uint256 amount`
Withdraw RWA tokens from the vault by burning shares.

**Parameters:**
- `_token`: Token to withdraw
- `_shares`: Number of shares to burn

**Returns:** Amount of tokens received

**Events:** `Withdraw(user, token, amount, shares, timestamp)`

**Requirements:**
- User must have sufficient shares
- Health factor must remain >= 200% after withdrawal

---

#### `getHealthFactor(address _user) -> uint256`
Calculate user's health factor (collateral / debt).

**Parameters:**
- `_user`: User wallet address

**Returns:** Health factor with 1e18 precision
- 2e18 = exactly 200% (minimum)
- 3e18 = 300% (excellent)

---

#### `getUserBalance(address _user, address _token) -> uint256`
Get user's balance in a specific token.

**Parameters:**
- `_user`: User wallet
- `_token`: Token address

**Returns:** Balance in token units

---

#### `getUserCollateral(address _user) -> uint256`
Get total collateral value in USD.

**Parameters:**
- `_user`: User wallet

**Returns:** Total USD value of all collateral

---

### Agent-Only Functions

#### `rebalance(address[] _tokens, uint256[] _amounts)`
AI agent rebalances vault positions based on market conditions.

**Parameters:**
- `_tokens`: Array of token addresses to rebalance
- `_amounts`: Array of target amounts for each token

**Events:** `Rebalance(agent, tokens, amounts, timestamp)`

**Modifiers:** `onlyAgent` - only registered agent can call

---

#### `executeAgentAction(string _actionType, bytes _data)`
Execute custom agent actions with encoded data.

**Parameters:**
- `_actionType`: Description of action (e.g., "swap_optimization")
- `_data`: Encoded action parameters

**Events:** `AgentAction(agent, actionType, data, timestamp)`

**Modifiers:** `onlyAgent`

---

### Admin Functions

#### `setPriceFeed(address _token, address _priceFeed)`
Set Chainlink price feed for a token.

**Parameters:**
- `_token`: Token address
- `_priceFeed`: Chainlink price feed address

**Modifiers:** `onlyOwner`

---

#### `addSupportedToken(address _token, address _priceFeed)`
Add a new RWA token to the vault.

**Parameters:**
- `_token`: Token contract address
- `_priceFeed`: Associated price feed

**Events:** `TokenSupported(token, timestamp)`

**Modifiers:** `onlyOwner`

---

#### `removeSupportedToken(address _token)`
Disable a token from deposits.

**Modifiers:** `onlyOwner`

---

#### `setAgent(address _agent)`
Register the AI agent that can rebalance positions.

**Parameters:**
- `_agent`: Agent wallet address

**Events:** `AgentSet(newAgent, timestamp)`

**Modifiers:** `onlyOwner`

---

#### `pause(bool _isPaused)`
Emergency pause mechanism for security.

**Parameters:**
- `_isPaused`: True to pause, false to resume

**Events:** `PauseStatusChanged(isPaused, timestamp)`

**Modifiers:** `onlyOwner`

---

#### `isPaused() -> bool`
Check if vault is paused.

---

## ComplianceOracle.sol

Wallet screening and regulatory compliance management.

### View Functions

#### `isKYCApproved(address _wallet) -> bool`
Check if wallet has KYC approval.

---

#### `getRiskScore(address _wallet) -> uint8`
Get wallet's risk score (0-100).
- 0-30: Low risk
- 31-70: Medium risk
- 71-100: High risk

---

#### `isWhitelisted(address _wallet) -> bool`
Check if wallet is whitelisted (auto-compliant).

---

#### `isBlacklisted(address _wallet) -> bool`
Check if wallet is banned from platform.

---

#### `isCompliant(address _wallet) -> bool`
Main compliance check for vault/router access.

**Returns:** True if wallet can interact with protocols
- NOT blacklisted
- AND (whitelisted OR (KYC-approved AND risk <= threshold))

---

### Admin Functions

#### `updateKYCStatus(address _wallet, bool _isApproved)`
Update KYC approval for a wallet.

**Events:** `KYCStatusUpdated(wallet, isApproved, timestamp)`

**Modifiers:** `onlyRole(COMPLIANCE_OFFICER_ROLE)`

---

#### `updateRiskScore(address _wallet, uint8 _riskScore)`
Set risk score for a wallet (0-100).

**Requirements:** Risk score must be <= 100

**Events:** `RiskScoreUpdated(wallet, riskScore, timestamp)`

**Modifiers:** `onlyRole(RISK_MANAGER_ROLE)`

---

#### `whitelist(address _wallet)`
Approve wallet for immediate compliance.

**Events:** `WalletWhitelisted(wallet, timestamp)`

**Modifiers:** `onlyRole(COMPLIANCE_OFFICER_ROLE)`

---

#### `blacklist(address _wallet)`
Ban wallet from all protocol interactions.

**Events:** `WalletBlacklisted(wallet, timestamp)`

**Modifiers:** `onlyRole(COMPLIANCE_OFFICER_ROLE)`

---

#### `batchWhitelist(address[] _wallets)`
Whitelist multiple wallets in single transaction.

**Modifiers:** `onlyRole(COMPLIANCE_OFFICER_ROLE)`

---

#### `batchBlacklist(address[] _wallets)`
Blacklist multiple wallets in single transaction.

**Modifiers:** `onlyRole(COMPLIANCE_OFFICER_ROLE)`

---

#### `setRiskThreshold(uint8 _newThreshold)`
Set risk score threshold for auto-compliance.

**Requirements:** Threshold must be <= 100

**Events:** `RiskThresholdUpdated(newThreshold, timestamp)`

**Modifiers:** `onlyRole(DEFAULT_ADMIN_ROLE)`

---

#### `grantComplianceOfficer(address _officer)`
Grant compliance officer role.

**Modifiers:** `onlyRole(DEFAULT_ADMIN_ROLE)`

---

## AgentRegistry.sol

AI agent registration, reputation, and performance tracking.

### View Functions

#### `getAgentInfo(address _agentAddress) -> AgentInfo`
Get complete agent profile.

**Returns:** Struct containing:
- `agentAddress`: Agent wallet
- `name`: Display name
- `stake`: Current stake amount
- `reputation`: Reputation score (0-1000)
- `totalTrades`: Number of recorded trades
- `totalPnL`: Cumulative profit/loss
- `riskScore`: Agent risk score (0-100)
- `isActive`: Active status
- `registrationTime`: Registration timestamp
- `lastActivityTime`: Last action timestamp

---

#### `getLeaderboard(uint256 _limit) -> LeaderboardEntry[]`
Get top agents by reputation.

**Parameters:**
- `_limit`: Number of top agents to return

**Returns:** Array of leaderboard entries (sorted by reputation descending)

---

#### `isAgentActive(address _agentAddress) -> bool`
Check if agent is registered and active.

---

#### `getReputation(address _agentAddress) -> uint256`
Get agent's current reputation score.

**Returns:** Score 0-1000 (0=inactive, 1000=maximum)

---

#### `getStake(address _agentAddress) -> uint256`
Get agent's current staked amount.

---

#### `getTotalAgents() -> uint256`
Get count of registered agents.

---

### Registration Functions

#### `registerAgent(address _agentAddress, string _name, uint256 _initialStake)`
Register a new AI agent.

**Parameters:**
- `_agentAddress`: Agent wallet address
- `_name`: Agent display name (non-empty)
- `_initialStake`: Initial stake amount (>= minimumStake)

**Events:** `AgentRegistered(agentAddress, name, stake, timestamp)`

**Requirements:**
- Agent not already registered
- Stake >= minimum requirement
- Name cannot be empty

---

#### `stake(address _agentAddress, uint256 _amount)`
Add additional stake to an agent.

**Events:** `AgentStaked(agentAddress, amount, totalStake, timestamp)`

---

#### `unstake(address _agentAddress, uint256 _amount)`
Withdraw stake from an agent.

**Requirements:**
- Remaining stake must stay >= minimumStake

**Events:** `AgentUnstaked(agentAddress, amount, totalStake, timestamp)`

---

### Performance Tracking

#### `recordTrade(address _agentAddress, int256 _pnl)`
Record a trade result and update reputation.

**Parameters:**
- `_agentAddress`: Agent address
- `_pnL`: Profit/loss amount (can be negative)

**Events:**
- `TradeRecorded(agentAddress, pnl, timestamp)`
- `ReputationUpdated(agentAddress, newReputation, "Profitable trade", timestamp)`

**Modifiers:** `onlyOwner`

**Reputation Impact:**
- Profitable trade (+PnL): Reputation increases
- Losing trade (-PnL): Reputation decreases

---

#### `updateReputation(address _agentAddress, int256 _reputationDelta, string _reason)`
Manually adjust agent reputation.

**Parameters:**
- `_agentAddress`: Agent address
- `_reputationDelta`: Change amount (positive or negative)
- `_reason`: Reason string (e.g., "Risk management bonus")

**Events:** `ReputationUpdated(agentAddress, newReputation, reason, timestamp)`

**Modifiers:** `onlyOwner`

**Clamping:** Score automatically clamped to 0-1000 range

---

#### `updateRiskScore(address _agentAddress, uint8 _riskScore)`
Set agent's risk profile.

**Parameters:**
- `_riskScore`: Risk score 0-100

**Modifiers:** `onlyOwner`

---

### Admin Functions

#### `deactivateAgent(address _agentAddress)`
Disable an agent from future operations.

**Events:** `AgentDeactivated(agentAddress, timestamp)`

**Modifiers:** `onlyOwner`

---

#### `setMinimumStake(uint256 _minimumStake)`
Update minimum stake requirement.

**Modifiers:** `onlyOwner`

---

#### `setStakeToken(address _stakeToken)`
Set ERC20 token used for staking.

**Modifiers:** `onlyOwner`

---

## RWARouter.sol

DEX routing and swap execution with compliance integration.

### View Functions

#### `getSwapQuote(address _tokenIn, address _tokenOut, uint256 _amountIn) -> uint256`
Get expected output amount for a swap.

**Parameters:**
- `_tokenIn`: Input token address
- `_tokenOut`: Output token address
- `_amountIn`: Input amount

**Returns:** Expected output amount (before fees and slippage)

---

#### `getBestRoute(address _tokenIn, address _tokenOut) -> (address router, address[] path)`
Get recommended swap route.

**Returns:**
- `router`: DEX router contract address
- `path`: Token path through pools

---

#### `getAccumulatedFees(address _token) -> uint256`
Get collected protocol fees for a token.

---

#### `isUserCompliant(address _user) -> bool`
Check if user passes compliance requirements.

---

### Swap Functions

#### `swap(SwapParams _params) -> uint256 amountOut`
Execute a swap with compliance and slippage protection.

**Parameters:**
```solidity
struct SwapParams {
    address tokenIn;
    address tokenOut;
    uint256 amountIn;
    uint256 minAmountOut;
    bytes swapData;
}
```

**Returns:** Actual output amount received

**Events:** `SwapExecuted(user, tokenIn, tokenOut, amountIn, amountOut, timestamp)`

**Requirements:**
- User must be compliant
- Output >= minAmountOut (slippage protection)
- TokenIn balance sufficient

**Fee Calculation:**
1. Input amount: 1000 tokens
2. Fee (0.25%): 2.5 tokens
3. Swap amount: 997.5 tokens
4. Output: Received tokens

---

### Route Management

#### `setRoute(address _tokenA, address _tokenB, address _router)`
Configure custom DEX route for token pair.

**Parameters:**
- `_tokenA`: First token address
- `_tokenB`: Second token address
- `_router`: DEX router contract (e.g., PancakeSwap)

**Events:** `RouteUpdated(tokenA, tokenB, router, timestamp)`

**Modifiers:** `onlyOwner`

---

#### `removeRoute(address _tokenA, address _tokenB)`
Delete custom route and revert to default.

**Modifiers:** `onlyOwner`

---

### Fee Management

#### `setFeePercentage(uint256 _feePercentage)`
Set swap fee in basis points.

**Parameters:**
- `_feePercentage`: Basis points (e.g., 25 = 0.25%)

**Requirements:** Fee must be <= 1000 (10% max)

**Modifiers:** `onlyOwner`

---

#### `withdrawFees(address _token, uint256 _amount)`
Withdraw accumulated protocol fees.

**Parameters:**
- `_token`: Token to withdraw fees in
- `_amount`: Amount to withdraw

**Requirements:** Accumulated fees >= amount

**Modifiers:** `onlyOwner`

---

### Compliance

#### `setComplianceOracle(address _complianceOracle)`
Set the compliance oracle contract address.

**Parameters:**
- `_complianceOracle`: ComplianceOracle contract address

**Modifiers:** `onlyOwner`

---

## Events Reference

### RWAVault Events

- `Deposit(address indexed user, address indexed token, uint256 amount, uint256 shares, uint256 timestamp)`
- `Withdraw(address indexed user, address indexed token, uint256 amount, uint256 shares, uint256 timestamp)`
- `Rebalance(address indexed agent, address[] tokens, uint256[] amounts, uint256 timestamp)`
- `AgentAction(address indexed agent, string actionType, bytes data, uint256 timestamp)`
- `HealthFactorUpdated(address indexed user, uint256 healthFactor, uint256 timestamp)`
- `PauseStatusChanged(bool isPaused, uint256 timestamp)`

### ComplianceOracle Events

- `KYCStatusUpdated(address indexed wallet, bool isKYCApproved, uint256 timestamp)`
- `RiskScoreUpdated(address indexed wallet, uint8 riskScore, uint256 timestamp)`
- `WalletWhitelisted(address indexed wallet, uint256 timestamp)`
- `WalletBlacklisted(address indexed wallet, uint256 timestamp)`

### AgentRegistry Events

- `AgentRegistered(address indexed agentAddress, string name, uint256 stake, uint256 timestamp)`
- `AgentStaked(address indexed agentAddress, uint256 amount, uint256 totalStake, uint256 timestamp)`
- `AgentUnstaked(address indexed agentAddress, uint256 amount, uint256 totalStake, uint256 timestamp)`
- `ReputationUpdated(address indexed agentAddress, uint256 newReputation, string reason, uint256 timestamp)`
- `TradeRecorded(address indexed agentAddress, int256 pnl, uint256 timestamp)`
- `AgentDeactivated(address indexed agentAddress, uint256 timestamp)`

### RWARouter Events

- `SwapExecuted(address indexed user, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut, uint256 timestamp)`
- `FeeCollected(address indexed token, uint256 amount, uint256 timestamp)`
- `SlippageProtectionTriggered(address indexed user, uint256 expectedAmount, uint256 receivedAmount, uint256 timestamp)`
- `RouteUpdated(address indexed tokenA, address indexed tokenB, address indexed router, uint256 timestamp)`

---

## Constants

### RWAVault
- `HEALTH_FACTOR_PRECISION`: 1e18
- `MINIMUM_HEALTH_FACTOR`: 2e18 (200%)
- `PRICE_FEED_PRECISION`: 1e8 (Chainlink standard)

### AgentRegistry
- `INITIAL_REPUTATION`: 100e18
- `MAX_REPUTATION`: 1000e18
- `MIN_REPUTATION`: 0
- `ACTIVITY_TIMEOUT`: 30 days

### RWARouter
- `PANCAKESWAP_ROUTER`: BSC mainnet address
- `PANCAKESWAP_TESTNET_ROUTER`: BSC testnet address
- `SLIPPAGE_TOLERANCE`: 500 (5% in basis points)

---

**Generated:** 2026-03-30
**Solidity Version:** ^0.8.20
**Network:** BNB Chain (BSC)
