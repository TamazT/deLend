import * as ethers from "ethers"
import { network } from "hardhat"
import { networkConfig } from "./helper-hardhat-config.js"

async function main() {
    const { deployer } = await ethers.getNamedAccounts()
    let chainid = network.config.chainId
    if ((chainid = 5)) {
        let poolAddress = networkConfig[5].poolAddress
    } else if ((chainid = 10)) {
        let poolAddress = networkConfig[10].poolAddress
    } else if ((chainid = 137)) {
        let poolAddress = networkConfig[137].poolAddress
    } else {
        let poolAddress = networkConfig[137].poolAddress
    }

    const DepositAAVE = await ethers.deploy("DepositAAVE", {
        from: deployer,
        args: [poolAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations,
    })
    if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
        await verify(DepositAAVE.address, [poolAddress])
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
