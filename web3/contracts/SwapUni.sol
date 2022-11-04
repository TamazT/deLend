// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {ISwapRouter} from "../node_modules/@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "../node_modules/@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

interface IWETH9{
    function deposit() external payable;
}


contract SwapExamples {
    ISwapRouter public swapRouter; // 0xE592427A0AEce92De3Edee1F18E0157C05861564 
    IWETH9 public WETH9; // 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6 
    // 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984 UNI
    
    constructor(ISwapRouter _swapRouter, IWETH9 _WETH9) {
        swapRouter = _swapRouter;
        WETH9 = _WETH9;
    }

    function swapExactInputSingle(
        uint256 amountIn,
        address tokenAddressOut,
        address tokenAddressIn
    ) external returns (uint256 amountOut) {
        // send input token to contract
        TransferHelper.safeTransferFrom(tokenAddressOut, msg.sender, address(this), amountIn);
        // Approve the router to spend input token.
        TransferHelper.safeApprove(tokenAddressOut, address(swapRouter), amountIn);
        //SWAP parameters
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: tokenAddressOut,
            tokenOut: tokenAddressIn,
            fee: 3000,
            recipient: msg.sender,
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        });
        // The call to exactInputSingle executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }
    
    
    function swapExactInputSingleETH(
        address tokenAddressIn
    ) external payable returns (uint256 amountOut)  {
        // send ETH to contract
        (bool sent, bytes memory data) = payable(address(this)).call{value: msg.value}("");
        require(sent, "Failed to send Ether");
        // wrap ETH
        WETH9.deposit{value:msg.value}();
        // Approve the router to spend WETH.
        TransferHelper.safeApprove(address(WETH9), address(swapRouter), msg.value);
        //SWAP parameters
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: address(WETH9),
            tokenOut: tokenAddressIn,
            fee: 3000,
            recipient: msg.sender,
            deadline: block.timestamp,
            amountIn: msg.value,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        });
        // The call to exactInputSingle executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
        
    }
      
    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

