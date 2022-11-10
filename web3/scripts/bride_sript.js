const { ethers } = require("ethers");
const fetch = require("node-fetch");

// Пример реализации брал отсюда "https://docs.metamask.io/guide/sending-transactions.html#example"
// и отсюда "https://docs.synapseprotocol.com/developers/examples"

async function bridgeTxMetamask(
  fromChain,
  toChain,
  fromToken,
  toToken,
  amountFrom,
  addressTo
) {
  // запрашиваем информацию у synapse для формирования тела транзакции
  const query_string = `fromChain=${fromChain}&toChain=${toChain}&fromToken=${fromToken}&toToken=${toToken}&amountFrom=${amountFrom}&addressTo=${addressTo}`;
  const response = await fetch(
    `https://syn-api-dev.herokuapp.com/v1/generate_unsigned_bridge_txn?${query_string}`
  );
  const { unsigned_data, to, chainId, gasLimit } = await response.json();
  // формируем транзакцию
  const txParam = {
    from: ethereum.selectedAddress, // адрес пользователя
    nonce: "0x00", // в документации написано, что параметр не обязательный
    gasPrice: "0x09184e72a000", // в документации написано, что параметр не обязательный
    gas: "0x2710", // String(gasLimit) в документации написано, что параметр не обязательный
    to: to, // кому придут токены на другой сети
    value: "0x00", // тк мы не шлем эфир, то тут 0
    data: unsigned_data, // data получанная от моста
    chainId: chainId, //chainId от моста, но метамаск говорит тоже параметр не обязательный
  };
  console.log(txParam);
  // отправляем транзакцию через метамаск
  const txHash = await ethereum.request({
    method: "eth_sendTransaction",
    params: [transactionParameters],
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

//Внизу приведен пример, если запускать скрипт через хардхэт и форк
//но он не сработает, тк на форковых аккаунтах нет USDC и USDT

/*
async function bridgeTx(
  fromChain,
  toChain,
  fromToken,
  toToken,
  amountFrom,
  addressTo
) {
  // получаем данные из моста
  const query_string = `fromChain=${fromChain}&toChain=${toChain}&fromToken=${fromToken}&toToken=${toToken}&amountFrom=${amountFrom}&addressTo=${addressTo}`;
  const response = await fetch(
    `https://syn-api-dev.herokuapp.com/v1/generate_unsigned_bridge_txn?${query_string}`
  );
  const { unsigned_data, to, chainId, gasLimit } = await response.json();
  // подсоединяемся к кошельку метамаск
  const providerHardhat = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
  );
  const user = await new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    providerHardhat
  );
  // получаем nonce и цену газа
  let nonce = await providerHardhat.getTransactionCount(user.address);
  let gasPrice = String(await providerHardhat.getGasPrice());

  const tx = {
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: String(gasLimit),
    to: to,
    value: 0,
    data: unsigned_data,
    chainId: chainId,
  };
  console.log(tx);
  // отправляем транзакцию
  
  // const sendTx = await user.sendTransaction(tx);
  // console.log(sendTx);
  
}
bridgeTx(
  "POLYGON",
  "ETH",
  "USDT",
  "USDT",
  "100000000",
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
);
*/
