// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "../node_modules/@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "../node_modules/@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "../node_modules/@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "../node_modules/@aave/core-v3/contracts/interfaces/IPool.sol";
import "../node_modules/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IWETH.sol";

contract deLend is Ownable {
    ISwapRouter private immutable swapRouter;
    IWETH private immutable WETH;
    IPoolAddressesProvider private immutable ADDRESSES_PROVIDER;
    IPool private immutable poolAAVE;
    AggregatorV3Interface private immutable priceFeed;

    uint16 private Ref;

    event Successfull(
        address indexed user,
        address indexed token,
        uint256 amount
    );

    error InsufficientAllowance(address tokenAddress, uint256 supplyAmount);
    error InsufficientBalance(uint256 balance, uint256 supplyAmount);

    constructor(
        ISwapRouter _swapRouter,
        IWETH _WETH,
        IPoolAddressesProvider _ADDRESSES_PROVIDER,
        AggregatorV3Interface _priceFeed
    ) {
        swapRouter = _swapRouter;
        WETH = _WETH;
        priceFeed = _priceFeed;
        ADDRESSES_PROVIDER = _ADDRESSES_PROVIDER;
        poolAAVE = IPool(ADDRESSES_PROVIDER.getPool());
    }

    modifier isUser() {
        uint256 size;
        address _user = msg.sender;
        assembly {
            size := extcodesize(_user)
        }
        if (size == 0) {
            _;
        }
    }

    function supplyFromToken(
        uint256 amountIn,
        address tokenAddressOut,
        address tokenAddressIn,
        uint24 _fee
    ) external isUser returns (uint256 amountOut) {
        uint256 _allowance = IERC20(tokenAddressOut).allowance(
            msg.sender,
            address(this)
        );
        uint256 _balance = IERC20(tokenAddressOut).balanceOf(msg.sender);
        if (_allowance < amountIn) {
            revert InsufficientAllowance({
                tokenAddress: tokenAddressOut,
                supplyAmount: amountIn
            });
        }
        if (_balance < amountIn) {
            revert InsufficientBalance({
                balance: _balance,
                supplyAmount: amountIn
            });
        }
        // send input token to contract
        TransferHelper.safeTransferFrom(
            tokenAddressOut,
            msg.sender,
            address(this),
            amountIn
        );
        amountIn = (amountIn * 99) / 100;
        if (tokenAddressOut != tokenAddressIn) {
            // Approve the router to spend input token.
            TransferHelper.safeApprove(
                tokenAddressOut,
                address(swapRouter),
                amountIn
            );
            //SWAP parameters
            ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
                .ExactInputSingleParams({
                    tokenIn: tokenAddressOut,
                    tokenOut: tokenAddressIn,
                    fee: _fee,
                    recipient: address(this),
                    deadline: block.timestamp,
                    amountIn: amountIn,
                    amountOutMinimum: 0,
                    sqrtPriceLimitX96: 0
                });
            // The call to exactInputSingle executes the swap.
            amountOut = swapRouter.exactInputSingle(params);
        } else {
            amountOut = amountIn;
        }
        //approve to deposit token into aave contract
        TransferHelper.safeApprove(
            tokenAddressIn,
            address(poolAAVE),
            amountOut
        );
        // deposit liquidity in Aave
        poolAAVE.supply(tokenAddressIn, amountOut, msg.sender, Ref);
        emit Successfull(msg.sender, tokenAddressIn, amountOut);
    }

    function supplyFromETH(address tokenAddressIn, uint24 _fee)
        external
        payable
        isUser
        returns (uint256 amountOut)
    {
        // send ETH to contract
        (
            bool sent, /*bytes memory data*/

        ) = payable(address(this)).call{value: msg.value}("");
        require(sent, "Failed to send Ether");
        uint256 amountIn = msg.value - deLendCommission();
        // wrap ETH
        WETH.deposit{value: amountIn}();
        if (address(WETH) != tokenAddressIn) {
            // Approve the router to spend WETH.
            TransferHelper.safeApprove(
                address(WETH),
                address(swapRouter),
                amountIn
            );
            //SWAP parameters
            ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
                .ExactInputSingleParams({
                    tokenIn: address(WETH),
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
        } else {
            amountOut = amountIn;
        }
        //approve to deposit token into aave contract
        TransferHelper.safeApprove(
            tokenAddressIn,
            address(poolAAVE),
            amountOut
        );
        // deposit liquidity in Aave
        poolAAVE.supply(tokenAddressIn, amountOut, msg.sender, Ref);
        emit Successfull(msg.sender, tokenAddressIn, amountOut);
    }

    // function to withdraw tokens from pool
    function withdraw(
        address tokenAddress,
        address aTokenAddress,
        uint256 amountWithdrow
    ) external isUser {
        uint256 _allowance = IERC20(aTokenAddress).allowance(
            msg.sender,
            address(this)
        );
        uint256 _balance = IERC20(aTokenAddress).balanceOf(msg.sender);
        if (_allowance < amountWithdrow) {
            revert InsufficientAllowance({
                tokenAddress: aTokenAddress,
                supplyAmount: amountWithdrow
            });
        }
        if (_balance < amountWithdrow) {
            revert InsufficientBalance({
                balance: _balance,
                supplyAmount: amountWithdrow
            });
        }
        //send aToken to this contract
        TransferHelper.safeTransferFrom(
            aTokenAddress,
            msg.sender,
            address(this),
            amountWithdrow
        );
        // withdraw amount of tokens from aave to userAddress
        poolAAVE.withdraw(tokenAddress, amountWithdrow, msg.sender);
        emit Successfull(msg.sender, tokenAddress, amountWithdrow);
    }

    function getLatestPrice() private view returns (int256) {
        (
            ,
            /*uint80 roundID*/
            int256 price, /*uint startedAt*/ /*uint timeStamp*/ /*uint80 answeredInRound*/
            ,
            ,

        ) = priceFeed.latestRoundData();
        return price;
    }

    function deLendCommission() public view returns (uint256) {
        uint256 price = uint256(getLatestPrice());
        uint256 deLendFee = (100000000 * 1 ether) / price;
        return deLendFee;
    }

    function withdrawETH() public onlyOwner {
        (
            bool sent, /*bytes memory data*/

        ) = payable(msg.sender).call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    function withdrawToken(address _tokenAddress) public onlyOwner {
        uint256 _balance = IERC20(_tokenAddress).balanceOf(address(this));
        // send input token to owner
        TransferHelper.safeTransfer(_tokenAddress, msg.sender, _balance);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}
}
