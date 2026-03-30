// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IAgentRegistry
 * @notice Interface for AI agent registry with reputation system (ERC-8004 inspired)
 */
interface IAgentRegistry {
    // ======== Types ========

    struct AgentInfo {
        address agentAddress;
        string name;
        uint256 stake;
        uint256 reputation;
        uint256 totalTrades;
        int256 totalPnL;
        uint8 riskScore;
        bool isActive;
        uint256 registrationTime;
        uint256 lastActivityTime;
    }

    struct LeaderboardEntry {
        address agentAddress;
        uint256 reputation;
        uint256 totalTrades;
        int256 totalPnL;
    }

    // ======== Events ========

    event AgentRegistered(
        address indexed agentAddress,
        string name,
        uint256 stake,
        uint256 timestamp
    );

    event AgentStaked(
        address indexed agentAddress,
        uint256 amount,
        uint256 totalStake,
        uint256 timestamp
    );

    event AgentUnstaked(
        address indexed agentAddress,
        uint256 amount,
        uint256 totalStake,
        uint256 timestamp
    );

    event ReputationUpdated(
        address indexed agentAddress,
        uint256 newReputation,
        string reason,
        uint256 timestamp
    );

    event TradeRecorded(
        address indexed agentAddress,
        int256 pnl,
        uint256 timestamp
    );

    event AgentDeactivated(address indexed agentAddress, uint256 timestamp);

    // ======== Registration ========

    /**
     * @notice Register a new agent
     * @param _agentAddress The agent's address
     * @param _name Agent name
     * @param _initialStake Initial stake amount
     */
    function registerAgent(
        address _agentAddress,
        string calldata _name,
        uint256 _initialStake
    ) external;

    /**
     * @notice Stake additional tokens for an agent
     * @param _agentAddress The agent's address
     * @param _amount Amount to stake
     */
    function stake(address _agentAddress, uint256 _amount) external;

    /**
     * @notice Unstake tokens from an agent
     * @param _agentAddress The agent's address
     * @param _amount Amount to unstake
     */
    function unstake(address _agentAddress, uint256 _amount) external;

    // ======== Performance Tracking ========

    /**
     * @notice Record a trade result for an agent
     * @param _agentAddress The agent's address
     * @param _pnl Profit/Loss from the trade
     */
    function recordTrade(address _agentAddress, int256 _pnl) external;

    /**
     * @notice Update agent reputation
     * @param _agentAddress The agent's address
     * @param _reputationDelta Change in reputation (can be negative)
     * @param _reason Reason for update
     */
    function updateReputation(
        address _agentAddress,
        int256 _reputationDelta,
        string calldata _reason
    ) external;

    /**
     * @notice Update agent risk score
     * @param _agentAddress The agent's address
     * @param _riskScore New risk score (0-100)
     */
    function updateRiskScore(address _agentAddress, uint8 _riskScore) external;

    // ======== Query Functions ========

    /**
     * @notice Get agent info
     * @param _agentAddress The agent's address
     * @return Agent info struct
     */
    function getAgentInfo(address _agentAddress)
        external
        view
        returns (AgentInfo memory);

    /**
     * @notice Get top N agents by reputation
     * @param _limit Number of agents to return
     * @return Array of leaderboard entries
     */
    function getLeaderboard(uint256 _limit)
        external
        view
        returns (LeaderboardEntry[] memory);

    /**
     * @notice Check if agent is registered
     * @param _agentAddress The agent's address
     * @return True if registered and active
     */
    function isAgentActive(address _agentAddress) external view returns (bool);

    /**
     * @notice Get agent's reputation score
     * @param _agentAddress The agent's address
     * @return Reputation score
     */
    function getReputation(address _agentAddress)
        external
        view
        returns (uint256);

    /**
     * @notice Get agent's stake amount
     * @param _agentAddress The agent's address
     * @return Stake amount
     */
    function getStake(address _agentAddress) external view returns (uint256);

    // ======== Admin Functions ========

    /**
     * @notice Deactivate an agent
     * @param _agentAddress The agent's address
     */
    function deactivateAgent(address _agentAddress) external;

    /**
     * @notice Set minimum stake requirement
     * @param _minimumStake The minimum stake in wei
     */
    function setMinimumStake(uint256 _minimumStake) external;

    /**
     * @notice Set stake token address
     * @param _stakeToken The ERC20 token to use for staking
     */
    function setStakeToken(address _stakeToken) external;
}
