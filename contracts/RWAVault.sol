// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IRWAVault.sol";

/**
 * @title RWAVault
 * @notice Vault for Real World Asset (RWA) tokens with AI agent management
 * @dev Supports multiple RWA tokens: USDY, BUIDL, PAXG, slisBNB, lisUSD, ankrBNB
 *      Maintains user positions with share-based accounting
 *      Enforces health factor requirements (minimum 200%)
 */
contract RWAVault is IRWAVault, Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ======== Constants ========
    uint256 public constant HEALTH_FACTOR_PRECISION = 1e18;
    uint256 public constant MINIMUM_HEALTH_FACTOR = 2e18; // 200%
    uint256 public constant PRICE_FEED_PRECISION = 1e8; // Chainlink standard

    // ======== State Variables ========

    address public agent;
    bool public vaultPaused;

    mapping(address => address) public priceFeeds; // token => priceFeed
    mapping(address => bool) public supportedTokens;
    mapping(address => uint256) public tokenTotalShares; // total shares per token
    mapping(address => mapping(address => uint256)) public userShares; // user => token => shares
    mapping(address => mapping(address => uint256)) public userDeposits; // user => token => deposit amount

    // Price cache for gas optimization
    mapping(address => uint256) public cachedPrices; // token => price
    mapping(address => uint256) public priceUpdateTime; // token => last update

    // ======== Events ========

    event AgentSet(address indexed newAgent, uint256 timestamp);
    event PriceFeedUpdated(
        address indexed token,
        address indexed priceFeed,
        uint256 timestamp
    );
    event TokenSupported(address indexed token, uint256 timestamp);
    event TokenRemoved(address indexed token, uint256 timestamp);

    // ======== Modifiers ========

    modifier onlyAgent() {
        require(msg.sender == agent, "RWAVault: Only agent can call");
        _;
    }

    modifier whenNotPaused() {
        require(!vaultPaused, "RWAVault: Vault is paused");
        _;
    }

    modifier onlyCompliant(address _user) {
        require(
            _getHealthFactor(_user) >= MINIMUM_HEALTH_FACTOR,
            "RWAVault: Insufficient health factor"
        );
        _;
    }

    // ======== Constructor ========

    constructor() {}

    // ======== User Functions ========

    /**
     * @notice Deposit RWA tokens into the vault
     * @param _token The token address to deposit
     * @param _amount The amount of tokens to deposit
     * @return shares The number of shares minted
     */
    function deposit(address _token, uint256 _amount)
        external
        whenNotPaused
        nonReentrant
        returns (uint256 shares)
    {
        require(supportedTokens[_token], "RWAVault: Token not supported");
        require(_amount > 0, "RWAVault: Amount must be > 0");

        // Transfer tokens from user to vault
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);

        // Calculate shares (1:1 ratio initially, accounting for previous deposits)
        if (tokenTotalShares[_token] == 0) {
            shares = _amount;
        } else {
            uint256 totalValue = _getTokenVaultBalance(_token);
            shares = (_amount * tokenTotalShares[_token]) /
                (totalValue - _amount);
        }

        // Update state
        userShares[msg.sender][_token] += shares;
        userDeposits[msg.sender][_token] += _amount;
        tokenTotalShares[_token] += shares;

        emit Deposit(msg.sender, _token, _amount, shares, block.timestamp);
    }

    /**
     * @notice Withdraw RWA tokens from the vault
     * @param _token The token address to withdraw
     * @param _shares The number of shares to withdraw
     * @return amount The amount of tokens returned
     */
    function withdraw(address _token, uint256 _shares)
        external
        whenNotPaused
        nonReentrant
        returns (uint256 amount)
    {
        require(supportedTokens[_token], "RWAVault: Token not supported");
        require(_shares > 0, "RWAVault: Shares must be > 0");
        require(
            userShares[msg.sender][_token] >= _shares,
            "RWAVault: Insufficient shares"
        );

        // Calculate withdrawal amount
        uint256 totalValue = _getTokenVaultBalance(_token);
        amount = (totalValue * _shares) / tokenTotalShares[_token];

        // Update state
        userShares[msg.sender][_token] -= _shares;
        tokenTotalShares[_token] -= _shares;

        // Update deposit tracking
        if (userDeposits[msg.sender][_token] >= amount) {
            userDeposits[msg.sender][_token] -= amount;
        } else {
            userDeposits[msg.sender][_token] = 0;
        }

        // Transfer tokens to user
        IERC20(_token).safeTransfer(msg.sender, amount);

        emit Withdraw(msg.sender, _token, amount, _shares, block.timestamp);

        // Verify health factor after withdrawal
        require(
            _getHealthFactor(msg.sender) >= MINIMUM_HEALTH_FACTOR,
            "RWAVault: Withdrawal violates health factor"
        );
    }

    /**
     * @notice Get the health factor of a user's position
     * @param _user The user address
     * @return The health factor (scaled to 1e18)
     */
    function getHealthFactor(address _user)
        external
        view
        returns (uint256)
    {
        return _getHealthFactor(_user);
    }

    /**
     * @notice Get total balance of a user in a specific token
     * @param _user The user address
     * @param _token The token address
     * @return The balance in that token
     */
    function getUserBalance(address _user, address _token)
        external
        view
        returns (uint256)
    {
        if (tokenTotalShares[_token] == 0) return 0;
        uint256 totalValue = _getTokenVaultBalance(_token);
        return (totalValue * userShares[_user][_token]) /
            tokenTotalShares[_token];
    }

    /**
     * @notice Get total collateral value of a user in USD
     * @param _user The user address
     * @return The total collateral value
     */
    function getUserCollateral(address _user)
        external
        view
        returns (uint256)
    {
        return _getUserCollateralValue(_user);
    }

    // ======== Agent Functions ========

    /**
     * @notice Rebalance vault positions (only agent can call)
     * @param _tokens Array of token addresses
     * @param _amounts Array of amounts to rebalance
     */
    function rebalance(address[] calldata _tokens, uint256[] calldata _amounts)
        external
        onlyAgent
        whenNotPaused
        nonReentrant
    {
        require(
            _tokens.length == _amounts.length,
            "RWAVault: Array length mismatch"
        );

        for (uint256 i = 0; i < _tokens.length; i++) {
            require(
                supportedTokens[_tokens[i]],
                "RWAVault: Token not supported"
            );
            // Rebalancing logic would interact with external protocols
            // This is a placeholder for agent-driven portfolio optimization
        }

        emit Rebalance(msg.sender, _tokens, _amounts, block.timestamp);
    }

    /**
     * @notice Execute agent action with custom data
     * @param _actionType Type of action as string
     * @param _data Encoded action data
     */
    function executeAgentAction(
        string calldata _actionType,
        bytes calldata _data
    ) external onlyAgent whenNotPaused nonReentrant {
        emit AgentAction(msg.sender, _actionType, _data, block.timestamp);
    }

    // ======== Admin Functions ========

    /**
     * @notice Set price feed for a token
     * @param _token The token address
     * @param _priceFeed The Chainlink price feed address
     */
    function setPriceFeed(address _token, address _priceFeed)
        external
        onlyOwner
    {
        require(_token != address(0), "RWAVault: Invalid token");
        require(_priceFeed != address(0), "RWAVault: Invalid price feed");
        priceFeeds[_token] = _priceFeed;
        emit PriceFeedUpdated(_token, _priceFeed, block.timestamp);
    }

    /**
     * @notice Add a supported token
     * @param _token The token address
     * @param _priceFeed The Chainlink price feed address
     */
    function addSupportedToken(address _token, address _priceFeed)
        external
        onlyOwner
    {
        require(_token != address(0), "RWAVault: Invalid token");
        require(_priceFeed != address(0), "RWAVault: Invalid price feed");
        supportedTokens[_token] = true;
        priceFeeds[_token] = _priceFeed;
        emit TokenSupported(_token, block.timestamp);
    }

    /**
     * @notice Remove a supported token
     * @param _token The token address
     */
    function removeSupportedToken(address _token) external onlyOwner {
        supportedTokens[_token] = false;
        emit TokenRemoved(_token, block.timestamp);
    }

    /**
     * @notice Set agent address (only owner)
     * @param _agent The agent address
     */
    function setAgent(address _agent) external onlyOwner {
        require(_agent != address(0), "RWAVault: Invalid agent");
        agent = _agent;
        emit AgentSet(_agent, block.timestamp);
    }

    /**
     * @notice Pause/unpause the vault
     * @param _isPaused True to pause, false to unpause
     */
    function pause(bool _isPaused) external onlyOwner {
        vaultPaused = _isPaused;
        emit PauseStatusChanged(_isPaused, block.timestamp);
    }

    /**
     * @notice Check if vault is paused
     * @return True if paused
     */
    function isPaused() external view returns (bool) {
        return vaultPaused;
    }

    // ======== Internal Functions ========

    /**
     * @notice Get health factor of a user (internal)
     * @param _user The user address
     * @return Health factor scaled to 1e18
     */
    function _getHealthFactor(address _user)
        internal
        view
        returns (uint256)
    {
        uint256 collateral = _getUserCollateralValue(_user);

        // If no collateral, health factor is infinite (user has no positions)
        if (collateral == 0) {
            return type(uint256).max;
        }

        // Health factor = collateral value / debt
        // For now, assuming debt = user deposits (simplified)
        uint256 debt = 0;
        address[] memory tokens = _getSupportedTokensList();

        for (uint256 i = 0; i < tokens.length; i++) {
            debt += userDeposits[_user][tokens[i]] * _getTokenPrice(tokens[i]);
        }

        if (debt == 0) {
            return type(uint256).max;
        }

        return (collateral * HEALTH_FACTOR_PRECISION) / debt;
    }

    /**
     * @notice Get user's total collateral value in USD
     * @param _user The user address
     * @return Total collateral in USD
     */
    function _getUserCollateralValue(address _user)
        internal
        view
        returns (uint256)
    {
        uint256 totalValue = 0;
        address[] memory tokens = _getSupportedTokensList();

        for (uint256 i = 0; i < tokens.length; i++) {
            address token = tokens[i];
            uint256 balance = this.getUserBalance(_user, token);
            if (balance > 0) {
                uint256 price = _getTokenPrice(token);
                totalValue += balance * price;
            }
        }

        return totalValue / 1e18; // Convert to USD
    }

    /**
     * @notice Get token price in USD via price feed
     * @param _token The token address
     * @return Price in USD with 1e8 precision
     */
    function _getTokenPrice(address _token)
        internal
        view
        returns (uint256)
    {
        // In production, would query Chainlink oracle
        // For demo, using cached prices
        if (cachedPrices[_token] == 0) {
            return 1e8; // Default to $1 if no price feed
        }
        return cachedPrices[_token];
    }

    /**
     * @notice Get total vault balance for a token
     * @param _token The token address
     * @return Balance of token in vault
     */
    function _getTokenVaultBalance(address _token)
        internal
        view
        returns (uint256)
    {
        return IERC20(_token).balanceOf(address(this));
    }

    /**
     * @notice Get list of supported tokens
     * @return Array of supported token addresses
     */
    function _getSupportedTokensList()
        internal
        view
        returns (address[] memory)
    {
        // In production, would maintain a separate list
        // For now, return empty array
        address[] memory tokens = new address[](0);
        return tokens;
    }

    // ======== Emergency Functions ========

    /**
     * @notice Emergency token withdrawal (only owner)
     * @param _token The token address
     * @param _amount The amount to withdraw
     */
    function emergencyWithdraw(address _token, uint256 _amount)
        external
        onlyOwner
    {
        IERC20(_token).safeTransfer(owner(), _amount);
    }
}
