module.exports = {
  networkConfig: {
    137: {
      name: "polygon",
      swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      WETH: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      poolAddressProvider: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb",
      AggregatorV3Interface: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
    },
    80001: {
      name: "mumbai",
      swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      WETH: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      poolAddressProvider: "0x5343b5bA672Ae99d627A1C87866b8E53F47Db2E6",
      AggregatorV3Interface: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
    },
    10: {
      name: "optimism",
      swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      WETH: "0x4200000000000000000000000000000000000006",
      poolAddressProvider: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb",
      AggregatorV3Interface: "0x13e3Ee699D1909E989722E753853AE30b17e08c5",
    },
    5: {
      name: "goerli",
      swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      WETH: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      poolAddressProvider: "0xc4dCB5126a3AfEd129BC3668Ea19285A9f56D15D",
      AggregatorV3Interface: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
    31337: {
      name: "hardhat",
      swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      WETH: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      poolAddressProvider: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb",
      AggregatorV3Interface: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
    },
  },
};
const developmentChan = ["hardhat", "localhost"];
