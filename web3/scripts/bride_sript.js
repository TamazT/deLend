const { ethers } = require("ethers");
const fetch = require("node-fetch");

// Implementation example taken from here "https://docs.metamask.io/guide/sending-transactions.html#example"
// and from here "https://docs.synapseprotocol.com/developers/examples"

async function bridgeTxMetamask(
  fromChain,
  toChain,
  fromToken,
  toToken,
  amountFrom,
  addressTo
) {
  // request information from synapse to form the transaction body
  const query_string = `fromChain=${fromChain}&toChain=${toChain}&fromToken=${fromToken}&toToken=${toToken}&amountFrom=${amountFrom}&addressTo=${addressTo}`;
  const response = await fetch(
    `https://syn-api-dev.herokuapp.com/v1/generate_unsigned_bridge_txn?${query_string}`
  );
  const { unsigned_data, to, chainId, gasLimit } = await response.json();
  // build transaction
  const txParam = {
    from: ethereum.selectedAddress, // user address
    nonce: "0x00", // optional parameter
    gasPrice: "0x09184e72a000", // optional parameter
    gas: "0x2710", // String(gasLimit) / optional parameter
    to: to, // bridge address
    value: "0x00", // equals zero
    data: unsigned_data, // transaction data
    chainId: chainId, //bridge chainId
  };
  console.log(txParam);
  // send transaction from MM
  const txHash = await ethereum.request({
    method: "eth_sendTransaction",
    params: [txParam],
  });
}

bridgeTxMetamask(
  "POLYGON",
  "ETH",
  "USDT",
  "USDT",
  "100000000",
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
);
