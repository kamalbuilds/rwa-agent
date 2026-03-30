// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IRWARouter
 * @notice Interface for RWA routing and swapping through DEX protocols
 */
interface IRWARouter {
    // ======== Types ========

    struct SwapParams {
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 minAmountOut;
        bytes swapData;
    }

    // ======== Events ========

    event SwapExecuted(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 timestamp
    );

    event FeeCollected(
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );

    event SlippageProtectionTriggered(
        address indexed user,
        uint256 expectedAmount,
        uint256 receivedAmount,
        uint256 timestamp
    );

    event RouteUpdated(
        address indexed tokenA,
        address indexed tokenB,
        address indexed router,
        uint256 timestamp
    );

    // ======== Swap Functions ========

    /**
     * @notice Execute a swap with compliance check
     * @param _params Swap parameters
     * @return amountOut Amount received
     */
    function swap(SwapParams calldata _params) external returns (uint256 amountOut);

    /**
     * @notice Quote swap amount (view function)
     * @param _tokenIn Input token
     * @param _tokenOut Output token
     * @param _amountIn Input amount
     * @return amountOut Expected output amount
     */
    function getSwapQuote(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn
    ) external view returns (uint256 amountOut);

    /**
     * @notice Get best route for swap
     * @param _tokenIn Input token
     * @param _tokenOut Output token
     * @return router Address of best router
     * @return path Path through liquidity pools
     */
    function getBestRoute(address _tokenIn, address _tokenOut)
        external
        view
        returns (address router, address[] memory path);

    // ======== Route Management ========

    /**
     * @notice Set custom route for token pair
     * @param _tokenA First token
     * @param _tokenB Second token
     * @param _router Router contract address
     */
    function setRoute(
        address _tokenA,
        address _tokenB,
        address _router
    ) external;

    /**
     * @notice Remove custom route for token pair
     * @param _tokenA First token
     * @param _tokenB Second token
     */
    function removeRoute(address _tokenA, address _tokenB) external;

    // ======== Fee Management ========

    /**
     * @notice Set swap fee percentage (in basis points)
     * @param _feePercentage Fee in basis points (e.g., 25 = 0.25%)
     */
    function setFeePercentage(uint256 _feePercentage) external;

    /**
     * @notice Get accumulated fees for a token
     * @param _token The token address
     * @return Accumulated fee amount
     */
    function getAccumulatedFees(address _token) external view returns (uint256);

    /**
     * @notice Withdraw accumulated fees
     * @param _token The token address
     * @param _amount Amount to withdraw
     */
    function withdrawFees(address _token, uint256 _amount) external;

    // ======== Compliance ========

    /**
     * @notice Check if user is allowed to swap
     * @param _user The user address
     * @return True if user is compliant
     */
    function isUserCompliant(address _user) external view returns (bool);

    /**
     * @notice Set compliance oracle address
     * @param _complianceOracle The compliance oracle address
     */
    function setComplianceOracle(address _complianceOracle) external;
}
