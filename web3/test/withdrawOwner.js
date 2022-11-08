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

describe("Tests for owner's functions:", function () {
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

    //supply from ETH
    const txSupplyFromETH = await deLend
      .connect(account1)
      .supplyFromETH(USDT.address, "3000", {
        value: ethers.utils.parseEther("1000"),
      });
    await txSupplyFromETH.wait();

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

  describe("Tests for 'withdrawETH' function:", function () {
    it("Successful withdraw ETH", async function () {
      // setup
      const { deLend, owner } = await loadFixture(deployContractFixture);

      // exercise
      const txWithdrawETH = await deLend.withdrawETH();
      await txWithdrawETH.wait();

      // verify
      expect(await ethers.provider.getBalance(deLend.address)).to.equal(0);
      expect(await ethers.provider.getBalance(owner.address)).to.be.within(
        ethers.utils.parseEther("10000"),
        ethers.utils.parseEther("10001")
      );
    });

    it("User can't withdraw ETH", async function () {
      // setup
      const { deLend, account1 } = await loadFixture(deployContractFixture);

      // exercise

      // verify
      await expect(deLend.connect(account1).withdrawETH()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });
  describe("Tests for 'withdrawToken' function:", function () {
    it("Successful withdraw WETH", async function () {
      // setup
      const { deLend, owner, WETH } = await loadFixture(deployContractFixture);
      const startOwnerBalance = await WETH.balanceOf(owner.address);
      const startContractBalance = await WETH.balanceOf(deLend.address);

      // exercise
      const txWithdrawToken = await deLend.withdrawToken(WETH.address);
      await txWithdrawToken.wait();

      // verify
      expect(await WETH.balanceOf(owner.address)).to.equal(
        startContractBalance
      );
      expect(await WETH.balanceOf(deLend.address)).to.equal(startOwnerBalance);
    });

    it("User can't withdraw WETH", async function () {
      // setup
      const { deLend, account1, WETH } = await loadFixture(
        deployContractFixture
      );

      // exercise

      // verify
      await expect(
        deLend.connect(account1).withdrawToken(WETH.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
