require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");
require("hardhat-deploy");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

const PRIVATE_KEY = process.env.PRIVATE_KEY;

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL;
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL;
const OPTIMISM_RPC_URL = process.env.OPTIMISM_RPC_URL;

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const OPTIMISM_API_KEY = process.env.OPTIMISM_API_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY,
      polygon: POLYGON_API_KEY,
      optimism: OPTIMISM_API_KEY,
      polygonMumbai: POLYGON_API_KEY,
    },
  },
  networks: {
    hardhat: {
      chainid: 31337,
      blockConfirmations: 1,
      forking: {
        url: POLYGON_RPC_URL,
        blockNumber: 35328453,
      },
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
      url: POLYGON_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    polygonMumbai: {
      chainid: 80001,
      blockConfirmations: 6,
      url: MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
    optimism: {
      chainid: 10,
      blockConfirmations: 6,
      url: OPTIMISM_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  solidity: "0.8.10",
  path: {
    sources: "./contracts",
  },
};
