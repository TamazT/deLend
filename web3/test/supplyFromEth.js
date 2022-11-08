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

describe("Tests for 'supplyFromETH' function:", function () {
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

  it("Successful supply to USDT", async function () {
    // setup
    const { USDT, AUSDT, deLend, account1 } = await loadFixture(
      deployContractFixture
    );
    let startBalance = await AUSDT.balanceOf(account1.address);
    let deLendCommision = await deLend.deLendCommission();

    // exercise
    const tx = await deLend
      .connect(account1)
      .supplyFromETH(USDT.address, "3000", {
        value: ethers.utils.parseEther("1000"),
      });
    await tx.wait();
    let endBalance = await AUSDT.balanceOf(account1.address);
    let deLendBalance = await ethers.provider.getBalance(deLend.address);

    // verify
    expect(endBalance).not.to.equal(startBalance);
    expect(deLendCommision).to.equal(deLendBalance);
    await expect(tx)
      .to.emit(deLend, "Successfull")
      .withArgs(account1.address, USDT.address, endBalance);
  });

  it("Successful supply to WETH", async function () {
    // setup
    const { WETH, AWETH, deLend, account1 } = await loadFixture(
      deployContractFixture
    );
    let startBalance = await AWETH.balanceOf(account1.address);
    let deLendCommision = await deLend.deLendCommission();

    // exercise
    const tx = await deLend
      .connect(account1)
      .supplyFromETH(WETH.address, "3000", {
        value: ethers.utils.parseEther("10"),
      });
    await tx.wait();
    let endBalance = await AWETH.balanceOf(account1.address);
    let deLendBalance = await ethers.provider.getBalance(deLend.address);

    // verify
    expect(endBalance).not.to.equal(startBalance);
    expect(deLendCommision).to.equal(deLendBalance);
    await expect(tx)
      .to.emit(deLend, "Successfull")
      .withArgs(account1.address, WETH.address, endBalance);
  });

  it("Not enough funds", async function () {
    // setup
    const { WETH, deLend, account1 } = await loadFixture(deployContractFixture);
    let error = "";

    // exercise
    try {
      await deLend.connect(account1).supplyFromETH(WETH.address, "3000", {
        value: ethers.utils.parseEther("100000"),
      });
    } catch (e) {
      error = e;
    }

    // verify
    expect(error).not.to.equal("");
  });

  it("Value is zero", async function () {
    // setup
    const { WETH, deLend, account1 } = await loadFixture(deployContractFixture);

    // exercise
    // verify
    expect(
      deLend.connect(account1).supplyFromETH(WETH.address, "3000", {
        value: ethers.utils.parseEther("100000"),
      })
    ).to.be.revertedWithPanic(0x11);
  });
});
