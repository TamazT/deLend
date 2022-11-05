const { getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")

async function main() {
    const { deploy, log } = deployments
    const deployer = process.env.PRIVATE_KEY
    let chainid = network.config.chainid
    let swapRouter
    let WETH
    let poolAddress
    console.log("Get constructor variables")
    if ((chainid = 5)) {
        swapRouter = networkConfig[5].swapRouter
        WETH = networkConfig[5].WETH
        poolAddress = networkConfig[5].poolAddress
    } else if ((chainid = 10)) {
        swapRouter = networkConfig[10].swapRouter
        WETH = networkConfig[10].WETH
        poolAddress = networkConfig[10].poolAddress
    } else if ((chainid = 137)) {
        swapRouter = networkConfig[137].swapRouter
        WETH = networkConfig[137].WETH
        poolAddress = networkConfig[137].poolAddress
    }
    console.log("----------------------------------------------------")
    console.log("Deploying deLend and waiting for confirmations...")

    const deLend = await deploy("deLend", {
        from: deployer,
        args: [swapRouter, WETH, poolAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations,
    })
    console.log(await deLend.address)
    console.log("Verify contract...")
    if (chainid !== 31337 && process.env.ETHERSCAN_API_KEY) {
        await verify(deLend.address, [swapRouter, WETH, poolAddress])
    }
    console.log("Done!")
}

// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (error) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(error)
        }
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
