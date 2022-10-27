// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Lock {

    IPool public immutable poolAAVE;
    uint16 public Ref;
    mapping (address=>uint256) depositBalances;

    constructor(address poolAddress){
        poolAAVE = IPool(poolAddress);
    }


    modifier depositAmount(uint256 amountDeposit) {
       require (amountDeposit > 0 , "You are trying send 0 tokens");
       _;
    }
    
    //function to deposit tokens
    function supply(address tokenAddress, uint256 amountDeposit) external depositAmount(amountDeposit),{
        IERC20 depositToken = IERC20(tokenAddress);
        // check users tokens balance
        require (depositToken.balanceOf(msg.sender) > amountDeposit, "You dont have enough tokens");
        // check  allowance to the contract for deposit token
        require(depositToken.allowance(msg.sender, address(this)) > amountDeposit||depositToken.allowance(msg.sender, address(this)) = amountDeposit, 'You need approve first' )
        //send token to this contract
        depositToken.transferFrom(msg.sender, address(this), amountDeposit);
        //approve to deposit token into aave contract
        depositToken.approve(address(poolAAVE), amountDeposit);
        // deposit liquidity in Aave
        poolAAVE.supply(tokenAddress, amountDeposit, address(this),  Ref);
        depositBalances[msg.sender] = amountDeposit;
    }

        // function to withdraw tokens from pool
    function withdraw(address tokenAddress, uint256 amountWithdrow) external {
        IERC20 token = IERC20(tokenAddress);
        // check that users balance is enough 
        require (balances[msg.sender] > amountWithdrow || amountWithdrow > 0, "Not enough balance");
        // withdraw amount of tokens from aave to userAddress
        poolAAVE.withdraw(address(tokenAddress), amountWithdrow, msg.sender);
        balances[msg.sender] -= amountWithdrow;
    }
}
