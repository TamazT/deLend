const { getNamedAccounts, deployments, network } = require("hardhat")
const { verify } = require("../utils/verify")
const { networkConfig } = require("../helper-hardhat-config")

async function main() {
    const { deploy, log } = deployments
    const deployer = process.env.PRIVATE_KEY
    let chainid = network.config.chainid
    console.log(chainid, networkConfig[5].poolAddress, networkConfig[10].poolAddress)
    if ((chainid = 5)) {
        poolAddress = networkConfig[5].poolAddress
    } else if ((chainid = 10)) {
        poolAddress = networkConfig[10].poolAddress
    } else if ((chainid = 137)) {
        poolAddress = networkConfig[137].poolAddress
    } else {
        poolAddress = networkConfig[137].poolAddress
    }
    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")

    const DepositAAVE = await deploy("DepositAAVE", {
        from: deployer,
        args: [poolAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations,
    })
    console.log(await DepositAAVE.address)
    if (chainid !== 31337 && process.env.ETHERSCAN_API_KEY) {
        await verify(DepositAAVE.address, [poolAddress])
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
