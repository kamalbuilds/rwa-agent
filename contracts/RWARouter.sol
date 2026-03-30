// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IRWARouter.sol";
import "./interfaces/IComplianceOracle.sol";

/**
 * @title RWARouter
 * @notice Router for RWA swaps with compliance checks and slippage protection
 * @dev Routes swaps through DEX protocols (e.g., PancakeSwap on BSC)
 */
contract RWARouter is IRWARouter, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ======== State Variables ========

    IComplianceOracle public complianceOracle;
    mapping(address => mapping(address => address)) public customRoutes;
    mapping(address => uint256) public accumulatedFees;
    uint256 public feePercentage; // In basis points (e.g., 25 = 0.25%)

    // Price oracle (simplified for demo)
    mapping(bytes32 => uint256) public routePrices;

    // ======== Constants ========
    address public constant PANCAKESWAP_ROUTER =
        0x10ED43C718714eb63d5aA57B78f985F8541b8A53; // BSC mainnet
    address public constant PANCAKESWAP_TESTNET_ROUTER =
        0xD99D7F6488cBDd2fB2eEc6fC4a64c9e8fd0A6c7E; // BSC testnet (example)
    uint256 public constant SLIPPAGE_TOLERANCE = 500; // 5% in basis points

    // ======== Constructor ========

    constructor() {
        feePercentage = 25; // 0.25% default fee
    }

    // ======== Swap Functions ========

    /**
     * @notice Execute a swap with compliance check
     * @param _params Swap parameters
     * @return amountOut Amount received
     */
    function swap(SwapParams calldata _params)
        external
        nonReentrant
        returns (uint256 amountOut)
    {
        require(_params.tokenIn != address(0), "RWARouter: Invalid tokenIn");
        require(_params.tokenOut != address(0), "RWARouter: Invalid tokenOut");
        require(_params.amountIn > 0, "RWARouter: Amount must be > 0");

        // Check compliance
        require(
            isUserCompliant(msg.sender),
            "RWARouter: User not compliant"
        );

        // Transfer tokens from user to router
        IERC20(_params.tokenIn).safeTransferFrom(
            msg.sender,
            address(this),
            _params.amountIn
        );

        // Calculate fees
        uint256 feeAmount = (_params.amountIn * feePercentage) / 10000;
        uint256 swapAmount = _params.amountIn - feeAmount;

        // Collect fees
        accumulatedFees[_params.tokenIn] += feeAmount;

        // Execute swap (simplified - in production would call DEX)
        amountOut = _executeSwap(
            _params.tokenIn,
            _params.tokenOut,
            swapAmount,
            _params.swapData
        );

        // Check slippage protection
        require(
            amountOut >= _params.minAmountOut,
            "RWARouter: Slippage too high"
        );

        // Transfer output to user
        IERC20(_params.tokenOut).safeTransfer(msg.sender, amountOut);

        emit SwapExecuted(
            msg.sender,
            _params.tokenIn,
            _params.tokenOut,
            _params.amountIn,
            amountOut,
            block.timestamp
        );
    }

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
    ) external view returns (uint256 amountOut) {
        // Simplified quote - in production would query DEX pools
        bytes32 priceKey = keccak256(abi.encodePacked(_tokenIn, _tokenOut));
        uint256 price = routePrices[priceKey];

        if (price == 0) {
            // Default 1:1 if no custom price
            return _amountIn;
        }

        return (_amountIn * price) / 1e18;
    }

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
        returns (address router, address[] memory path)
    {
        // Check for custom route
        address customRouter = customRoutes[_tokenIn][_tokenOut];
        if (customRouter != address(0)) {
            // Return custom route with direct path
            path = new address[](2);
            path[0] = _tokenIn;
            path[1] = _tokenOut;
            return (customRouter, path);
        }

        // Default to PancakeSwap
        path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;
        router = PANCAKESWAP_TESTNET_ROUTER;
    }

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
    ) external onlyOwner {
        require(_tokenA != address(0), "RWARouter: Invalid tokenA");
        require(_tokenB != address(0), "RWARouter: Invalid tokenB");
        require(_router != address(0), "RWARouter: Invalid router");

        customRoutes[_tokenA][_tokenB] = _router;
        customRoutes[_tokenB][_tokenA] = _router;

        emit RouteUpdated(_tokenA, _tokenB, _router, block.timestamp);
    }

    /**
     * @notice Remove custom route for token pair
     * @param _tokenA First token
     * @param _tokenB Second token
     */
    function removeRoute(address _tokenA, address _tokenB) external onlyOwner {
        require(_tokenA != address(0), "RWARouter: Invalid tokenA");
        require(_tokenB != address(0), "RWARouter: Invalid tokenB");

        customRoutes[_tokenA][_tokenB] = address(0);
        customRoutes[_tokenB][_tokenA] = address(0);
    }

    // ======== Fee Management ========

    /**
     * @notice Set swap fee percentage (in basis points)
     * @param _feePercentage Fee in basis points (e.g., 25 = 0.25%)
     */
    function setFeePercentage(uint256 _feePercentage) external onlyOwner {
        require(
            _feePercentage <= 1000,
            "RWARouter: Fee too high (max 10%)"
        );
        feePercentage = _feePercentage;
    }

    /**
     * @notice Get accumulated fees for a token
     * @param _token The token address
     * @return Accumulated fee amount
     */
    function getAccumulatedFees(address _token)
        external
        view
        returns (uint256)
    {
        return accumulatedFees[_token];
    }

    /**
     * @notice Withdraw accumulated fees
     * @param _token The token address
     * @param _amount Amount to withdraw
     */
    function withdrawFees(address _token, uint256 _amount)
        external
        onlyOwner
        nonReentrant
    {
        require(_token != address(0), "RWARouter: Invalid token");
        require(
            accumulatedFees[_token] >= _amount,
            "RWARouter: Insufficient fees"
        );

        accumulatedFees[_token] -= _amount;
        IERC20(_token).safeTransfer(owner(), _amount);

        emit FeeCollected(_token, _amount, block.timestamp);
    }

    // ======== Compliance ========

    /**
     * @notice Check if user is allowed to swap
     * @param _user The user address
     * @return True if user is compliant
     */
    function isUserCompliant(address _user)
        public
        view
        returns (bool)
    {
        if (address(complianceOracle) == address(0)) {
            return true; // No compliance check if oracle not set
        }
        return complianceOracle.isCompliant(_user);
    }

    /**
     * @notice Set compliance oracle address
     * @param _complianceOracle The compliance oracle address
     */
    function setComplianceOracle(address _complianceOracle)
        external
        onlyOwner
    {
        require(
            _complianceOracle != address(0),
            "RWARouter: Invalid oracle"
        );
        complianceOracle = IComplianceOracle(_complianceOracle);
    }

    // ======== Internal Functions ========

    /**
     * @notice Execute the actual swap (simplified for demo)
     * @param _tokenIn Input token
     * @param _tokenOut Output token
     * @param _amountIn Input amount
     * @param _swapData Additional swap data
     * @return amountOut Output amount
     */
    function _executeSwap(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        bytes calldata _swapData
    ) internal returns (uint256 amountOut) {
        // In production, would execute actual DEX swap via router
        // For demo purposes, use quote function
        amountOut = this.getSwapQuote(_tokenIn, _tokenOut, _amountIn);

        // Verify we have enough output token balance
        // In production, would execute the actual swap

        return amountOut;
    }

    /**
     * @notice Set price for a token pair (for demo/testing)
     * @param _tokenIn Input token
     * @param _tokenOut Output token
     * @param _price Price ratio (1e18 scale)
     */
    function setPriceQuote(
        address _tokenIn,
        address _tokenOut,
        uint256 _price
    ) external onlyOwner {
        bytes32 priceKey = keccak256(abi.encodePacked(_tokenIn, _tokenOut));
        routePrices[priceKey] = _price;
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
        nonReentrant
    {
        require(_token != address(0), "RWARouter: Invalid token");
        IERC20(_token).safeTransfer(owner(), _amount);
    }
}
