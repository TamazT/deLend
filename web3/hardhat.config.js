require("@nomicfoundation/hardhat-toolbox")
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainid: 31337,
            blockConfirmations: 1,
        },
        goerli: {
            chainid: 5,
            blockConfirmations: 6,
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
        },
        polygon: {
            chainid: 137,
            blockConfirmations: 6,
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
        },
        optimizm: {
            chainid: 10,
            blockConfirmations: 6,
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
        },
    },
    solidity: "0.8.10",
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 1,
        },
    },
}
