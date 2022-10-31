// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {ISwapRouter} from "../node_modules/@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "../node_modules/@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

contract SwapExamples {
    ISwapRouter public swapRouter;

    constructor(ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }

    function swapExactInputSingle(
        uint256 amountIn,
        address tokenAddressOut,
        address tokenAddressIn
    ) external returns (uint256 amountOut) {
        TransferHelper.safeTransferFrom(tokenAddressOut, msg.sender, address(this), amountIn);

        // Approve the router to spend DAI.
        TransferHelper.safeApprove(tokenAddressOut, address(swapRouter), amountIn);
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: tokenAddressOut,
            tokenOut: tokenAddressIn,
            fee: 3000,
            recipient: msg.sender,
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 2
        });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }
}
