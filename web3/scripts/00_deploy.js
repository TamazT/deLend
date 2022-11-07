const { deployments, network, userConfig, ethers, run } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");

async function main() {
  const { deploy } = deployments;
  const deployer = process.env.PRIVATE_KEY;
  let chainid = network.config.chainid;
  let currentGasPrice = await ethers.provider.getGasPrice();

  console.log("Get constructor variables");
  if (chainid != 31337) {
    swapRouter = networkConfig[chainid].swapRouter;
    WETH = networkConfig[chainid].WETH;
    poolAddressProvider = networkConfig[chainid].poolAddressProvider;
    AggregatorV3Interface = networkConfig[chainid].AggregatorV3Interface;
    API_KEY = userConfig.etherscan.apiKey[network.name];
  }
  console.log("Done!");

  console.log("Deploying deLend and waiting for confirmations...");
  const deLend = await deploy("deLend", {
    from: deployer,
    args: [swapRouter, WETH, poolAddressProvider, AggregatorV3Interface],
    log: true,
    waitConfirmations: network.config.blockConfirmations,
    gasPrice: currentGasPrice,
  });
  console.log(await deLend.address);

  if (chainid !== 31337 && API_KEY) {
    await verify(deLend.address, [
      swapRouter,
      WETH,
      poolAddressProvider,
      AggregatorV3Interface,
    ]);
  }
  console.log("Done!");
}

const verify = async (contractAddress, args) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(error);
    }
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
