const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  loadFixture,
  time,
} = require("@nomicfoundation/hardhat-network-helpers");
const { networkConfig } = require("../helper-hardhat-config");

const { abiWETH } = require("./helpers/abiWETH");
const { abiUSDT } = require("./helpers/abiUSDT");
const { abiAUSDT } = require("./helpers/abiAUSDT");
const { abiAWETH } = require("./helpers/abiAWETH");

describe("Tests for 'withdraw' function:", function () {
  async function deployContractFixture() {
    // Preparing before starting tests...
    // Get contracts from fork...
    const addressSwapRouter = networkConfig[31337].swapRouter;
    const addressWETH = networkConfig[31337].WETH;
    const poolAddressProvider = networkConfig[31337].poolAddressProvider;
    const addressAggregatorV3Interface =
      networkConfig[31337].AggregatorV3Interface;

    const WETH = await ethers.getContractAt(abiWETH, addressWETH);
    const USDT = await ethers.getContractAt(
      abiUSDT,
      "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
    );
    const AUSDT = await ethers.getContractAt(
      abiAUSDT,
      "0x6ab707Aca953eDAeFBc4fD23bA73294241490620"
    );
    const AWETH = await ethers.getContractAt(
      abiAWETH,
      "0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97"
    );
    // Done!

    // Deploying deLend contract...
    const deLendContract = await ethers.getContractFactory("deLend");
    const deLend = await deLendContract.deploy(
      addressSwapRouter,
      addressWETH,
      poolAddressProvider,
      addressAggregatorV3Interface
    );
    await deLend.deployed();
    // Done

    // Get accounts...
    const [owner, account1, account2] = await ethers.getSigners();
    // Done

    //supply from WETH to USDT
    const txApproveWETH = await WETH.connect(account1).approve(
      deLend.address,
      ethers.utils.parseEther("100")
    );
    await txApproveWETH.wait();

    const txDepositWETH = await WETH.connect(account1).deposit({
      value: ethers.utils.parseEther("100"),
    });
    await txDepositWETH.wait();

    const txSupplyFromToken = await deLend
      .connect(account1)
      .supplyFromToken(
        ethers.utils.parseEther("100"),
        WETH.address,
        USDT.address,
        "3000"
      );
    await txSupplyFromToken.wait();
    // Done

    return {
      WETH,
      USDT,
      AUSDT,
      AWETH,
      deLend,
      owner,
      account1,
      account2,
    };
  }

  it("Successful withdraw USDT", async function () {
    // setup
    const { USDT, AUSDT, deLend, account1 } = await loadFixture(
      deployContractFixture
    );
    let amountWithdraw = await AUSDT.balanceOf(account1.address);

    // exercise
    const txApproveAUSDT = await AUSDT.connect(account1).approve(
      deLend.address,
      amountWithdraw
    );
    await txApproveAUSDT.wait();

    const txWithdrawUSDT = await deLend
      .connect(account1)
      .withdraw(USDT.address, AUSDT.address, amountWithdraw);
    await txWithdrawUSDT.wait();

    // verify
    expect(await USDT.balanceOf(account1.address)).to.deep.equal(
      amountWithdraw
    );
    expect(await AUSDT.balanceOf(deLend.address)).to.deep.equal("0");
    await expect(txWithdrawUSDT)
      .to.emit(deLend, "Successfull")
      .withArgs(account1.address, USDT.address, amountWithdraw);
  });

  it("Insufficient allowance", async function () {
    // setup
    const { USDT, AUSDT, deLend, account1 } = await loadFixture(
      deployContractFixture
    );
    let amountWithdraw = await AUSDT.balanceOf(account1.address);

    // exercise

    // verify
    await expect(
      deLend
        .connect(account1)
        .withdraw(USDT.address, AUSDT.address, amountWithdraw)
    )
      .to.be.revertedWithCustomError(deLend, "InsufficientAllowance")
      .withArgs(AUSDT.address, amountWithdraw);
  });

  it("Insufficient balance", async function () {
    // setup
    const { USDT, AUSDT, deLend, account1 } = await loadFixture(
      deployContractFixture
    );
    let amountWithdraw = await AUSDT.balanceOf(account1.address);

    // exercise
    const txApproveAUSDT = await AUSDT.connect(account1).approve(
      deLend.address,
      amountWithdraw + 1000000
    );
    await txApproveAUSDT.wait();

    // verify
    await expect(
      deLend
        .connect(account1)
        .withdraw(USDT.address, AUSDT.address, amountWithdraw + 1000000)
    )
      .to.be.revertedWithCustomError(deLend, "InsufficientBalance")
      .withArgs(amountWithdraw, amountWithdraw + 1000000);
  });

  it("Value is zero", async function () {
    // setup
    const { USDT, AUSDT, deLend, account1 } = await loadFixture(
      deployContractFixture
    );
    let amountWithdraw = await AUSDT.balanceOf(account1.address);

    // exercise
    const txApproveAUSDT = await AUSDT.connect(account1).approve(
      deLend.address,
      amountWithdraw + 1000000
    );
    await txApproveAUSDT.wait();

    // verify
    await expect(
      deLend.connect(account1).withdraw(USDT.address, AUSDT.address, 0)
    ).to.be.reverted;
  });
});
