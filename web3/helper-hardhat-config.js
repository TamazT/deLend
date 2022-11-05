module.exports = {
    networkConfig: {
        137: {
            name: "polygon",
            swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
            WETH: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
            poolAddress: "0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6",
        },
        10: {
            name: "optimism",
            swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
            WETH: "0x4200000000000000000000000000000000000006",
            poolAddress: "0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6",
        },
        5: {
            name: "goerli",
            swapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
            WETH: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
            poolAddress: "0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6",
        },
        31337: {
            name: "hardhat",
        },
    },
}
const developmentChan = ["hardhat", "localhost"]
