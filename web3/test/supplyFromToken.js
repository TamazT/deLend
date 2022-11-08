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

describe("Tests for 'supplyFromToken' function:", function () {
  async function deployContractFixture() {
    // Preparing before starting tests...
    // Get constructor variables and contracts from fork...
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

  it("Successful supply From WETH to USDT", async function () {
    // setup
    const { WETH, USDT, AUSDT, deLend, account1 } = await loadFixture(
      deployContractFixture
    );
    let startBalance = await AUSDT.balanceOf(account1.address);
    let deLendFee = String(ethers.utils.parseEther("1") * 0.01);

    // exercise
    const txApproveWETH = await WETH.connect(account1).approve(
      deLend.address,
      ethers.utils.parseEther("10")
    );
    await txApproveWETH.wait();

    const txDepositWETH = await WETH.connect(account1).deposit({
      value: ethers.utils.parseEther("10"),
    });
    await txDepositWETH.wait();

    const txSupplyFromToken = await deLend
      .connect(account1)
      .supplyFromToken(
        ethers.utils.parseEther("1"),
        WETH.address,
        USDT.address,
        "3000"
      );
    await txSupplyFromToken.wait();
    let endBalance = await AUSDT.balanceOf(account1.address);

    // verify
    expect(endBalance).not.to.equal(startBalance);
    expect(await WETH.balanceOf(deLend.address)).to.deep.equal(deLendFee);
    await expect(txSupplyFromToken)
      .to.emit(deLend, "Successfull")
      .withArgs(account1.address, USDT.address, endBalance);
  });

  it("Successful supply From WETH to WETH", async function () {
    // setup
    const { WETH, AWETH, deLend, account1 } = await loadFixture(
      deployContractFixture
    );
    let startBalance = await AWETH.balanceOf(account1.address);
    let deLendFee = String(ethers.utils.parseEther("3000") * 0.01);

    // exercise
    const txApproveWETH = await WETH.connect(account1).approve(
      deLend.address,
      ethers.utils.parseEther("10000")
    );
    await txApproveWETH.wait();

    const txDepositWETH = await WETH.connect(account1).deposit({
      value: ethers.utils.parseEther("3000"),
    });
    await txDepositWETH.wait();

    const txSupplyFromToken = await deLend
      .connect(account1)
      .supplyFromToken(
        ethers.utils.parseEther("3000"),
        WETH.address,
        WETH.address,
        "3000"
      );
    await txSupplyFromToken.wait();
    let endBalance = await AWETH.balanceOf(account1.address);

    // verify
    expect(endBalance).not.to.equal(startBalance);
    expect(await WETH.balanceOf(deLend.address)).to.deep.equal(deLendFee);
    await expect(txSupplyFromToken)
      .to.emit(deLend, "Successfull")
      .withArgs(account1.address, WETH.address, endBalance);
  });

  it("Insufficient allowance", async function () {
    // setup
    const { WETH, USDT, deLend, account1 } = await loadFixture(
      deployContractFixture
    );

    // exercise
    const txDepositWETH = await WETH.connect(account1).deposit({
      value: ethers.utils.parseEther("3000"),
    });
    await txDepositWETH.wait();

    // verify
    await expect(
      deLend
        .connect(account1)
        .supplyFromToken(
          ethers.utils.parseEther("3000"),
          WETH.address,
          USDT.address,
          "3000"
        )
    )
      .to.be.revertedWithCustomError(deLend, "InsufficientAllowance")
      .withArgs(WETH.address, ethers.utils.parseEther("3000"));
  });

  it("Insufficient balance", async function () {
    // setup
    const { WETH, USDT, deLend, account1 } = await loadFixture(
      deployContractFixture
    );

    // exercise
    const txApproveWETH = await WETH.connect(account1).approve(
      deLend.address,
      ethers.utils.parseEther("10000")
    );
    await txApproveWETH.wait();

    // verify
    await expect(
      deLend
        .connect(account1)
        .supplyFromToken(
          ethers.utils.parseEther("3000"),
          WETH.address,
          USDT.address,
          "3000"
        )
    )
      .to.be.revertedWithCustomError(deLend, "InsufficientBalance")
      .withArgs(0, ethers.utils.parseEther("3000"));
  });

  it("Value is zero", async function () {
    // setup
    const { WETH, USDT, AUSDT, deLend, account1 } = await loadFixture(
      deployContractFixture
    );
    let startBalance = await AUSDT.balanceOf(account1.address);
    let deLendFee = String(ethers.utils.parseEther("1") * 0.01);

    // exercise
    const txApproveWETH = await WETH.connect(account1).approve(
      deLend.address,
      ethers.utils.parseEther("10")
    );
    await txApproveWETH.wait();

    const txDepositWETH = await WETH.connect(account1).deposit({
      value: ethers.utils.parseEther("10"),
    });
    await txDepositWETH.wait();

    // verify
    await expect(
      deLend
        .connect(account1)
        .supplyFromToken(0, WETH.address, USDT.address, "3000")
    ).to.be.reverted;
  });
});
