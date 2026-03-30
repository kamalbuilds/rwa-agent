// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IComplianceOracle
 * @notice Interface for wallet compliance screening and KYC management
 */
interface IComplianceOracle {
    // ======== Events ========

    event KYCStatusUpdated(
        address indexed wallet,
        bool isKYCApproved,
        uint256 timestamp
    );

    event RiskScoreUpdated(
        address indexed wallet,
        uint8 riskScore,
        uint256 timestamp
    );

    event WalletWhitelisted(address indexed wallet, uint256 timestamp);

    event WalletBlacklisted(address indexed wallet, uint256 timestamp);

    // ======== View Functions ========

    /**
     * @notice Check if a wallet is KYC approved
     * @param _wallet The wallet address
     * @return True if wallet is KYC approved
     */
    function isKYCApproved(address _wallet) external view returns (bool);

    /**
     * @notice Get risk score of a wallet (0-100)
     * @param _wallet The wallet address
     * @return The risk score
     */
    function getRiskScore(address _wallet) external view returns (uint8);

    /**
     * @notice Check if wallet is whitelisted
     * @param _wallet The wallet address
     * @return True if wallet is whitelisted
     */
    function isWhitelisted(address _wallet) external view returns (bool);

    /**
     * @notice Check if wallet is blacklisted
     * @param _wallet The wallet address
     * @return True if wallet is blacklisted
     */
    function isBlacklisted(address _wallet) external view returns (bool);

    /**
     * @notice Check if wallet is compliant (can interact with vault)
     * @param _wallet The wallet address
     * @return True if wallet is compliant
     */
    function isCompliant(address _wallet) external view returns (bool);

    // ======== Admin Functions ========

    /**
     * @notice Update KYC status for a wallet
     * @param _wallet The wallet address
     * @param _isApproved True to approve, false to disapprove
     */
    function updateKYCStatus(address _wallet, bool _isApproved) external;

    /**
     * @notice Update risk score for a wallet
     * @param _wallet The wallet address
     * @param _riskScore The risk score (0-100)
     */
    function updateRiskScore(address _wallet, uint8 _riskScore) external;

    /**
     * @notice Whitelist a wallet
     * @param _wallet The wallet address
     */
    function whitelist(address _wallet) external;

    /**
     * @notice Blacklist a wallet
     * @param _wallet The wallet address
     */
    function blacklist(address _wallet) external;

    /**
     * @notice Batch whitelist wallets
     * @param _wallets Array of wallet addresses
     */
    function batchWhitelist(address[] calldata _wallets) external;

    /**
     * @notice Batch blacklist wallets
     * @param _wallets Array of wallet addresses
     */
    function batchBlacklist(address[] calldata _wallets) external;
}
