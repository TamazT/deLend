const { ethers, providers } = require("ethers")

let url = "https://eth-goerli.g.alchemy.com/v2/OfIgU2h669O427enI6571d_C4TnzB8ln"

const providerRPC = {
    goerli: {
        name: "Goerli test network",
        rpc: url, // Insert your RPC URL here
        chainId: 5, // 0x504 in hex,
    },
}
// 3. Create ethers provider
const provider = new ethers.providers.StaticJsonRpcProvider(providerRPC.goerli.rpc, {
    chainId: providerRPC.goerli.chainId,
    name: providerRPC.goerli.name,
})

let wallet = new ethers.Wallet("private key", provider)

// USDT 0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49
//aUSDT 0x73258E6fb96ecAc8a979826d503B45803a382d68

new ethers.Contract(
    "0x73258E6fb96ecAc8a979826d503B45803a382d68",
    ["function approve(address spender, uint256 tokens)"],
    wallet
).approve("0x1cf9380001676ef72B4023dac19F5742F19e9b21", "1000000000000000000000000000")
