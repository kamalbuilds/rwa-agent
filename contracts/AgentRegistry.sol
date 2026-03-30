// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IAgentRegistry.sol";

/**
 * @title AgentRegistry
 * @notice Registry for AI agents with reputation and performance tracking
 * @dev Inspired by ERC-8004, manages agent identity, stakes, and reputation
 */
contract AgentRegistry is IAgentRegistry, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ======== Constants ========
    uint256 public constant INITIAL_REPUTATION = 100e18;
    uint256 public constant MAX_REPUTATION = 1000e18;
    uint256 public constant MIN_REPUTATION = 0;
    uint256 public constant ACTIVITY_TIMEOUT = 30 days;

    // ======== State Variables ========

    IERC20 public stakeToken;
    uint256 public minimumStake;

    mapping(address => AgentInfo) public agents;
    mapping(address => bool) public isRegistered;
    address[] public agentList;

    // ======== Constructor ========

    constructor() {
        minimumStake = 1000e18; // 1000 tokens
        // stakeToken should be set by owner after deployment
    }

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
    ) external nonReentrant {
        require(_agentAddress != address(0), "AgentRegistry: Invalid address");
        require(!isRegistered[_agentAddress], "AgentRegistry: Already registered");
        require(
            _initialStake >= minimumStake,
            "AgentRegistry: Stake below minimum"
        );
        require(bytes(_name).length > 0, "AgentRegistry: Name cannot be empty");

        // Transfer stake from caller to contract
        if (_initialStake > 0 && address(stakeToken) != address(0)) {
            stakeToken.safeTransferFrom(msg.sender, address(this), _initialStake);
        }

        // Create agent record
        agents[_agentAddress] = AgentInfo({
            agentAddress: _agentAddress,
            name: _name,
            stake: _initialStake,
            reputation: INITIAL_REPUTATION,
            totalTrades: 0,
            totalPnL: 0,
            riskScore: 50, // Medium risk by default
            isActive: true,
            registrationTime: block.timestamp,
            lastActivityTime: block.timestamp
        });

        isRegistered[_agentAddress] = true;
        agentList.push(_agentAddress);

        emit AgentRegistered(_agentAddress, _name, _initialStake, block.timestamp);
    }

    /**
     * @notice Stake additional tokens for an agent
     * @param _agentAddress The agent's address
     * @param _amount Amount to stake
     */
    function stake(address _agentAddress, uint256 _amount)
        external
        nonReentrant
    {
        require(isRegistered[_agentAddress], "AgentRegistry: Agent not registered");
        require(_amount > 0, "AgentRegistry: Amount must be > 0");

        // Transfer stake from caller to contract
        if (address(stakeToken) != address(0)) {
            stakeToken.safeTransferFrom(msg.sender, address(this), _amount);
        }

        agents[_agentAddress].stake += _amount;
        agents[_agentAddress].lastActivityTime = block.timestamp;

        emit AgentStaked(
            _agentAddress,
            _amount,
            agents[_agentAddress].stake,
            block.timestamp
        );
    }

    /**
     * @notice Unstake tokens from an agent
     * @param _agentAddress The agent's address
     * @param _amount Amount to unstake
     */
    function unstake(address _agentAddress, uint256 _amount)
        external
        nonReentrant
    {
        require(isRegistered[_agentAddress], "AgentRegistry: Agent not registered");
        require(
            msg.sender == _agentAddress || msg.sender == owner(),
            "AgentRegistry: Not authorized"
        );
        require(_amount > 0, "AgentRegistry: Amount must be > 0");
        require(
            agents[_agentAddress].stake >= _amount,
            "AgentRegistry: Insufficient stake"
        );

        // Ensure minimum stake remains
        require(
            agents[_agentAddress].stake - _amount >= minimumStake,
            "AgentRegistry: Cannot unstake below minimum"
        );

        agents[_agentAddress].stake -= _amount;

        // Transfer tokens back to agent
        if (address(stakeToken) != address(0)) {
            stakeToken.safeTransfer(_agentAddress, _amount);
        }

        emit AgentUnstaked(
            _agentAddress,
            _amount,
            agents[_agentAddress].stake,
            block.timestamp
        );
    }

    // ======== Performance Tracking ========

    /**
     * @notice Record a trade result for an agent
     * @param _agentAddress The agent's address
     * @param _pnl Profit/Loss from the trade
     */
    function recordTrade(address _agentAddress, int256 _pnl)
        external
        onlyOwner
        nonReentrant
    {
        require(isRegistered[_agentAddress], "AgentRegistry: Agent not registered");

        AgentInfo storage agent = agents[_agentAddress];
        agent.totalTrades += 1;
        agent.totalPnL += _pnl;
        agent.lastActivityTime = block.timestamp;

        // Update reputation based on trade performance
        if (_pnl > 0) {
            // Increase reputation for profitable trades
            uint256 reputationGain = uint256(_pnl / 1e15); // Scale down PnL
            _updateReputation(_agentAddress, int256(reputationGain), "Profitable trade");
        } else if (_pnL < 0) {
            // Decrease reputation for losing trades
            uint256 reputationLoss = uint256(-_pnL / 1e15);
            _updateReputation(_agentAddress, -int256(reputationLoss), "Loss trade");
        }

        emit TradeRecorded(_agentAddress, _pnl, block.timestamp);
    }

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
    ) external onlyOwner {
        _updateReputation(_agentAddress, _reputationDelta, _reason);
    }

    /**
     * @notice Update agent risk score
     * @param _agentAddress The agent's address
     * @param _riskScore New risk score (0-100)
     */
    function updateRiskScore(address _agentAddress, uint8 _riskScore)
        external
        onlyOwner
    {
        require(isRegistered[_agentAddress], "AgentRegistry: Agent not registered");
        require(_riskScore <= 100, "AgentRegistry: Risk score must be <= 100");

        agents[_agentAddress].riskScore = _riskScore;
    }

    // ======== Query Functions ========

    /**
     * @notice Get agent info
     * @param _agentAddress The agent's address
     * @return Agent info struct
     */
    function getAgentInfo(address _agentAddress)
        external
        view
        returns (AgentInfo memory)
    {
        require(isRegistered[_agentAddress], "AgentRegistry: Agent not registered");
        return agents[_agentAddress];
    }

    /**
     * @notice Get top N agents by reputation
     * @param _limit Number of agents to return
     * @return Array of leaderboard entries
     */
    function getLeaderboard(uint256 _limit)
        external
        view
        returns (LeaderboardEntry[] memory)
    {
        uint256 count = _limit > agentList.length ? agentList.length : _limit;
        LeaderboardEntry[] memory leaderboard = new LeaderboardEntry[](count);

        // Simple sorting (bubble sort for small lists)
        address[] memory sortedAgents = agentList;
        for (uint256 i = 0; i < sortedAgents.length; i++) {
            for (uint256 j = i + 1; j < sortedAgents.length; j++) {
                if (
                    agents[sortedAgents[i]].reputation <
                    agents[sortedAgents[j]].reputation
                ) {
                    address temp = sortedAgents[i];
                    sortedAgents[i] = sortedAgents[j];
                    sortedAgents[j] = temp;
                }
            }
        }

        // Fill leaderboard
        for (uint256 i = 0; i < count; i++) {
            AgentInfo memory agent = agents[sortedAgents[i]];
            leaderboard[i] = LeaderboardEntry({
                agentAddress: agent.agentAddress,
                reputation: agent.reputation,
                totalTrades: agent.totalTrades,
                totalPnL: agent.totalPnL
            });
        }

        return leaderboard;
    }

    /**
     * @notice Check if agent is registered and active
     * @param _agentAddress The agent's address
     * @return True if registered and active
     */
    function isAgentActive(address _agentAddress)
        external
        view
        returns (bool)
    {
        return isRegistered[_agentAddress] && agents[_agentAddress].isActive;
    }

    /**
     * @notice Get agent's reputation score
     * @param _agentAddress The agent's address
     * @return Reputation score
     */
    function getReputation(address _agentAddress)
        external
        view
        returns (uint256)
    {
        require(isRegistered[_agentAddress], "AgentRegistry: Agent not registered");
        return agents[_agentAddress].reputation;
    }

    /**
     * @notice Get agent's stake amount
     * @param _agentAddress The agent's address
     * @return Stake amount
     */
    function getStake(address _agentAddress)
        external
        view
        returns (uint256)
    {
        require(isRegistered[_agentAddress], "AgentRegistry: Agent not registered");
        return agents[_agentAddress].stake;
    }

    /**
     * @notice Get total number of registered agents
     * @return Number of agents
     */
    function getTotalAgents() external view returns (uint256) {
        return agentList.length;
    }

    // ======== Admin Functions ========

    /**
     * @notice Deactivate an agent
     * @param _agentAddress The agent's address
     */
    function deactivateAgent(address _agentAddress)
        external
        onlyOwner
    {
        require(isRegistered[_agentAddress], "AgentRegistry: Agent not registered");
        agents[_agentAddress].isActive = false;
        emit AgentDeactivated(_agentAddress, block.timestamp);
    }

    /**
     * @notice Set minimum stake requirement
     * @param _minimumStake The minimum stake in wei
     */
    function setMinimumStake(uint256 _minimumStake) external onlyOwner {
        require(_minimumStake > 0, "AgentRegistry: Minimum stake must be > 0");
        minimumStake = _minimumStake;
    }

    /**
     * @notice Set stake token address
     * @param _stakeToken The ERC20 token to use for staking
     */
    function setStakeToken(address _stakeToken) external onlyOwner {
        require(_stakeToken != address(0), "AgentRegistry: Invalid token");
        stakeToken = IERC20(_stakeToken);
    }

    // ======== Internal Functions ========

    /**
     * @notice Internal function to update reputation with clamping
     * @param _agentAddress The agent's address
     * @param _reputationDelta Change in reputation
     * @param _reason Reason for update
     */
    function _updateReputation(
        address _agentAddress,
        int256 _reputationDelta,
        string memory _reason
    ) internal {
        require(isRegistered[_agentAddress], "AgentRegistry: Agent not registered");

        AgentInfo storage agent = agents[_agentAddress];
        int256 newReputation = int256(agent.reputation) + _reputationDelta;

        // Clamp reputation between MIN and MAX
        if (newReputation > int256(MAX_REPUTATION)) {
            agent.reputation = uint256(MAX_REPUTATION);
        } else if (newReputation < int256(MIN_REPUTATION)) {
            agent.reputation = uint256(MIN_REPUTATION);
        } else {
            agent.reputation = uint256(newReputation);
        }

        agent.lastActivityTime = block.timestamp;

        emit ReputationUpdated(
            _agentAddress,
            agent.reputation,
            _reason,
            block.timestamp
        );
    }
}
