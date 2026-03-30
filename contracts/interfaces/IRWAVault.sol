// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IRWAVault
 * @notice Interface for the RWA (Real World Asset) Vault contract
 */
interface IRWAVault {
    // ======== Events ========

    event Deposit(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 shares,
        uint256 timestamp
    );

    event Withdraw(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 shares,
        uint256 timestamp
    );

    event Rebalance(
        address indexed agent,
        address[] tokens,
        uint256[] amounts,
        uint256 timestamp
    );

    event AgentAction(
        address indexed agent,
        string actionType,
        bytes data,
        uint256 timestamp
    );

    event HealthFactorUpdated(
        address indexed user,
        uint256 healthFactor,
        uint256 timestamp
    );

    event PauseStatusChanged(bool isPaused, uint256 timestamp);

    // ======== User Functions ========

    /**
     * @notice Deposit RWA tokens into the vault
     * @param _token The token address to deposit
     * @param _amount The amount of tokens to deposit
     */
    function deposit(address _token, uint256 _amount) external returns (uint256 shares);

    /**
     * @notice Withdraw RWA tokens from the vault
     * @param _token The token address to withdraw
     * @param _shares The number of shares to withdraw
     */
    function withdraw(address _token, uint256 _shares) external returns (uint256 amount);

    /**
     * @notice Get the health factor of a user's position
     * @param _user The user address
     * @return The health factor (scaled to 1e18)
     */
    function getHealthFactor(address _user) external view returns (uint256);

    /**
     * @notice Get total balance of a user in a specific token
     * @param _user The user address
     * @param _token The token address
     * @return The balance in that token
     */
    function getUserBalance(address _user, address _token)
        external
        view
        returns (uint256);

    /**
     * @notice Get total collateral value of a user in USD
     * @param _user The user address
     * @return The total collateral value
     */
    function getUserCollateral(address _user) external view returns (uint256);

    // ======== Agent Functions ========

    /**
     * @notice Rebalance vault positions (only agent can call)
     * @param _tokens Array of token addresses
     * @param _amounts Array of amounts to rebalance
     */
    function rebalance(address[] calldata _tokens, uint256[] calldata _amounts)
        external;

    /**
     * @notice Execute agent action with custom data
     * @param _actionType Type of action as string
     * @param _data Encoded action data
     */
    function executeAgentAction(string calldata _actionType, bytes calldata _data)
        external;

    // ======== Admin Functions ========

    /**
     * @notice Set price feed for a token
     * @param _token The token address
     * @param _priceFeed The Chainlink price feed address
     */
    function setPriceFeed(address _token, address _priceFeed) external;

    /**
     * @notice Set agent address (only owner)
     * @param _agent The agent address
     */
    function setAgent(address _agent) external;

    /**
     * @notice Pause/unpause the vault
     * @param _isPaused True to pause, false to unpause
     */
    function pause(bool _isPaused) external;

    /**
     * @notice Check if vault is paused
     * @return True if paused
     */
    function isPaused() external view returns (bool);
}
