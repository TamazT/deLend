// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DepositAAVE {
    IPool public immutable poolAAVE;
    uint16 public Ref;

    constructor(address poolAddress) {
        poolAAVE = IPool(poolAddress); //0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6
    }

    modifier depositAmount(uint256 amountDeposit) {
        require(amountDeposit > 0, "You are trying send 0 tokens");
        _;
    }

    //function to deposit tokens
    function supply(address tokenAddress, uint256 amountDeposit)
        external
        depositAmount(amountDeposit)
    {
        IERC20 depositToken = IERC20(tokenAddress);
        // check  allowance to the contract for deposit token
        require(
            depositToken.allowance(msg.sender, address(this)) >= amountDeposit,
            "You need approve first"
        );
        // check users tokens balance
        require(depositToken.balanceOf(msg.sender) >= amountDeposit, "You dont have enough tokens");
        //send token to this contract
        depositToken.transferFrom(msg.sender, address(this), amountDeposit);
        //approve to deposit token into aave contract
        depositToken.approve(address(poolAAVE), amountDeposit);
        // deposit liquidity in Aave
        poolAAVE.supply(tokenAddress, amountDeposit, msg.sender, Ref);
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
}
