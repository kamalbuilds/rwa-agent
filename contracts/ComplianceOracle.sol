// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IComplianceOracle.sol";

/**
 * @title ComplianceOracle
 * @notice Wallet compliance screening and KYC status management
 * @dev Tracks compliance status, KYC approval, and risk scores per wallet
 */
contract ComplianceOracle is IComplianceOracle, Ownable, AccessControl {
    // ======== Roles ========
    bytes32 public constant COMPLIANCE_OFFICER_ROLE =
        keccak256("COMPLIANCE_OFFICER_ROLE");
    bytes32 public constant RISK_MANAGER_ROLE = keccak256("RISK_MANAGER_ROLE");

    // ======== State Variables ========

    mapping(address => bool) public kycApprovals;
    mapping(address => uint8) public riskScores; // 0-100
    mapping(address => bool) public whitelisted;
    mapping(address => bool) public blacklisted;
    mapping(address => uint256) public kycUpdateTime;
    mapping(address => uint256) public riskScoreUpdateTime;

    // Risk score thresholds for automatic actions
    uint8 public riskThreshold = 80; // Wallets with risk > 80 require additional scrutiny

    // ======== Events ========

    event RiskThresholdUpdated(uint8 newThreshold, uint256 timestamp);

    // ======== Constructor ========

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COMPLIANCE_OFFICER_ROLE, msg.sender);
        _grantRole(RISK_MANAGER_ROLE, msg.sender);
    }

    // ======== View Functions ========

    /**
     * @notice Check if a wallet is KYC approved
     * @param _wallet The wallet address
     * @return True if wallet is KYC approved
     */
    function isKYCApproved(address _wallet)
        external
        view
        returns (bool)
    {
        return kycApprovals[_wallet];
    }

    /**
     * @notice Get risk score of a wallet (0-100)
     * @param _wallet The wallet address
     * @return The risk score
     */
    function getRiskScore(address _wallet)
        external
        view
        returns (uint8)
    {
        return riskScores[_wallet];
    }

    /**
     * @notice Check if wallet is whitelisted
     * @param _wallet The wallet address
     * @return True if wallet is whitelisted
     */
    function isWhitelisted(address _wallet)
        external
        view
        returns (bool)
    {
        return whitelisted[_wallet];
    }

    /**
     * @notice Check if wallet is blacklisted
     * @param _wallet The wallet address
     * @return True if wallet is blacklisted
     */
    function isBlacklisted(address _wallet)
        external
        view
        returns (bool)
    {
        return blacklisted[_wallet];
    }

    /**
     * @notice Check if wallet is compliant (can interact with vault)
     * @dev A wallet is compliant if:
     *      1. Not blacklisted
     *      2. Either whitelisted OR (KYC approved AND risk score <= threshold)
     * @param _wallet The wallet address
     * @return True if wallet is compliant
     */
    function isCompliant(address _wallet)
        external
        view
        returns (bool)
    {
        // Blacklisted wallets are never compliant
        if (blacklisted[_wallet]) {
            return false;
        }

        // Whitelisted wallets are always compliant
        if (whitelisted[_wallet]) {
            return true;
        }

        // Otherwise, check KYC and risk score
        return kycApprovals[_wallet] && riskScores[_wallet] <= riskThreshold;
    }

    // ======== Admin Functions ========

    /**
     * @notice Update KYC status for a wallet
     * @param _wallet The wallet address
     * @param _isApproved True to approve, false to disapprove
     */
    function updateKYCStatus(address _wallet, bool _isApproved)
        external
        onlyRole(COMPLIANCE_OFFICER_ROLE)
    {
        require(_wallet != address(0), "ComplianceOracle: Invalid wallet");
        kycApprovals[_wallet] = _isApproved;
        kycUpdateTime[_wallet] = block.timestamp;
        emit KYCStatusUpdated(_wallet, _isApproved, block.timestamp);
    }

    /**
     * @notice Update risk score for a wallet
     * @param _wallet The wallet address
     * @param _riskScore The risk score (0-100)
     */
    function updateRiskScore(address _wallet, uint8 _riskScore)
        external
        onlyRole(RISK_MANAGER_ROLE)
    {
        require(_wallet != address(0), "ComplianceOracle: Invalid wallet");
        require(_riskScore <= 100, "ComplianceOracle: Risk score must be <= 100");
        riskScores[_wallet] = _riskScore;
        riskScoreUpdateTime[_wallet] = block.timestamp;
        emit RiskScoreUpdated(_wallet, _riskScore, block.timestamp);
    }

    /**
     * @notice Whitelist a wallet
     * @param _wallet The wallet address
     */
    function whitelist(address _wallet)
        external
        onlyRole(COMPLIANCE_OFFICER_ROLE)
    {
        require(_wallet != address(0), "ComplianceOracle: Invalid wallet");
        whitelisted[_wallet] = true;
        emit WalletWhitelisted(_wallet, block.timestamp);
    }

    /**
     * @notice Blacklist a wallet
     * @param _wallet The wallet address
     */
    function blacklist(address _wallet)
        external
        onlyRole(COMPLIANCE_OFFICER_ROLE)
    {
        require(_wallet != address(0), "ComplianceOracle: Invalid wallet");
        blacklisted[_wallet] = true;
        // Remove from whitelist if already whitelisted
        if (whitelisted[_wallet]) {
            whitelisted[_wallet] = false;
        }
        emit WalletBlacklisted(_wallet, block.timestamp);
    }

    /**
     * @notice Batch whitelist wallets
     * @param _wallets Array of wallet addresses
     */
    function batchWhitelist(address[] calldata _wallets)
        external
        onlyRole(COMPLIANCE_OFFICER_ROLE)
    {
        for (uint256 i = 0; i < _wallets.length; i++) {
            require(_wallets[i] != address(0), "ComplianceOracle: Invalid wallet");
            whitelisted[_wallets[i]] = true;
            emit WalletWhitelisted(_wallets[i], block.timestamp);
        }
    }

    /**
     * @notice Batch blacklist wallets
     * @param _wallets Array of wallet addresses
     */
    function batchBlacklist(address[] calldata _wallets)
        external
        onlyRole(COMPLIANCE_OFFICER_ROLE)
    {
        for (uint256 i = 0; i < _wallets.length; i++) {
            require(_wallets[i] != address(0), "ComplianceOracle: Invalid wallet");
            blacklisted[_wallets[i]] = true;
            if (whitelisted[_wallets[i]]) {
                whitelisted[_wallets[i]] = false;
            }
            emit WalletBlacklisted(_wallets[i], block.timestamp);
        }
    }

    /**
     * @notice Set risk score threshold for automatic compliance
     * @param _newThreshold The new risk threshold (0-100)
     */
    function setRiskThreshold(uint8 _newThreshold)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            _newThreshold <= 100,
            "ComplianceOracle: Threshold must be <= 100"
        );
        riskThreshold = _newThreshold;
        emit RiskThresholdUpdated(_newThreshold, block.timestamp);
    }

    /**
     * @notice Grant compliance officer role
     * @param _officer The address to grant role to
     */
    function grantComplianceOfficer(address _officer)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        grantRole(COMPLIANCE_OFFICER_ROLE, _officer);
    }

    /**
     * @notice Grant risk manager role
     * @param _manager The address to grant role to
     */
    function grantRiskManager(address _manager)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        grantRole(RISK_MANAGER_ROLE, _manager);
    }

    /**
     * @notice Revoke compliance officer role
     * @param _officer The address to revoke role from
     */
    function revokeComplianceOfficer(address _officer)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        revokeRole(COMPLIANCE_OFFICER_ROLE, _officer);
    }

    /**
     * @notice Revoke risk manager role
     * @param _manager The address to revoke role from
     */
    function revokeRiskManager(address _manager)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        revokeRole(RISK_MANAGER_ROLE, _manager);
    }
}
