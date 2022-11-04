// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {ISwapRouter} from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";

interface IWETH9 {
    function deposit() external payable;
}

contract SwapExamples {
    IPool public immutable poolAAVE;
    uint16 public Ref;
    ISwapRouter public swapRouter; // 0xE592427A0AEce92De3Edee1F18E0157C05861564
    IWETH9 public WETH9; // 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6

    // 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984 UNI

    constructor(
        ISwapRouter _swapRouter,
        IWETH9 _WETH9,
        address poolAddress
    ) {
        swapRouter = _swapRouter;
        WETH9 = _WETH9;
        poolAAVE = IPool(poolAddress); //0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6
    }

    function supplyFromToken(
        uint256 amountIn,
        address tokenAddressOut,
        address tokenAddressIn,
        uint24 _fee
    ) external returns (uint256 amountOut) {
        // send input token to contract
        TransferHelper.safeTransferFrom(tokenAddressOut, msg.sender, address(this), amountIn);
        // Approve the router to spend input token.
        TransferHelper.safeApprove(tokenAddressOut, address(swapRouter), amountIn);
        //SWAP parameters
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: tokenAddressOut,
            tokenOut: tokenAddressIn,
            fee: _fee, //3000 standartd
            recipient: address(this),
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        });
        // The call to exactInputSingle executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
        //approve to deposit token into aave contract
        TransferHelper.safeApprove(tokenAddressIn, address(poolAAVE), amountOut);
        // deposit liquidity in Aave
        poolAAVE.supply(tokenAddressIn, amountOut, msg.sender, Ref);
    }

    function supplyFromETH(address tokenAddressIn, uint24 _fee)
        external
        payable
        returns (uint256 amountOut)
    {
        // send ETH to contract
        (bool sent, bytes memory data) = payable(address(this)).call{value: msg.value}("");
        require(sent, "Failed to send Ether");
        // wrap ETH
        WETH9.deposit{value: msg.value}();
        // Approve the router to spend WETH.
        TransferHelper.safeApprove(address(WETH9), address(swapRouter), msg.value);
        //SWAP parameters
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: address(WETH9),
            tokenOut: tokenAddressIn,
            fee: _fee, //3000 standartd
            recipient: address(this),
            deadline: block.timestamp,
            amountIn: msg.value,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        });
        // The call to exactInputSingle executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
        //approve to deposit token into aave contract
        TransferHelper.safeApprove(tokenAddressIn, address(poolAAVE), amountOut);
        // deposit liquidity in Aave
        poolAAVE.supply(tokenAddressIn, amountOut, msg.sender, Ref);
    }

    // function to withdraw tokens from pool
    function withdraw(
        address tokenAddress,
        address aTokenAddress,
        uint256 amountWithdrow
    ) external {
        IERC20 token = IERC20(tokenAddress);
        // check that users balance is enough
        IERC20 aToken = IERC20(aTokenAddress);
        require(
            aToken.allowance(msg.sender, address(this)) > amountWithdrow,
            "You need approve first"
        );
        // check users tokens balance
        require(aToken.balanceOf(msg.sender) >= amountWithdrow, "You dont have enough tokens");
        //send aToken to this contract
        aToken.transferFrom(msg.sender, address(this), amountWithdrow);
        // withdraw amount of tokens from aave to userAddress
        poolAAVE.withdraw(address(token), amountWithdrow, msg.sender);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}
}
