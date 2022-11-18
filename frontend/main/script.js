import { ethers } from "./ethers-5.6.esm.min.js";
import {
  ethContract,
  ethABI,
  optContract,
  optABI,
  tokenVariables,
  polABI,
  polContract,
  chainVariables,
} from "./constants.js";

const connectButton = document.getElementById("connectButton");
const apyButton = document.getElementById("Apy");
const bestStabelButton = document.getElementById("bestStable");
const depositButton = document.getElementById("depositButton");
const ethButton = document.getElementById("ETH");
const polButton = document.getElementById("POL");
const optButton = document.getElementById("OPT");
const networkButton = document.getElementById("network");
connectButton.onclick = connect;
depositButton.onclick = deposit; //deposit;
ethButton.onclick = ethConnect;
polButton.onclick = polConnect;
optButton.onclick = optConnect;
async function ethConnect() {
  if (typeof window.ethereum !== "undefined") {
    await connect();
    let obj = await getData("0x1");
    apyButton.innerHTML = obj.highapy;
    bestStabelButton.innerHTML = obj.bestStable;
  }
  console.log(window.ethereum.chainId);
  if (window.ethereum.chainId != "0x1") {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }],
    });
    networkButton.innerHTML = "Etherium";
    let obj = await getData("0x1");
    apyButton.innerHTML = obj.highapy + "%";
    bestStabelButton.innerHTML = obj.bestStable;
  }
}
async function polConnect() {
  if (typeof window.ethereum !== "undefined") {
    await connect();
    let obj = await getData("0x89");
    console.log(obj);
    apyButton.innerHTML = +obj.highapy + "%";
    bestStabelButton.innerHTML = +obj.bestStable;
  }
  if (window.ethereum.chainId != "0x89") {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x89" }],
    });
    networkButton.innerHTML = "Polygon";
    let obj = await getData("0x89");
    console.log(obj);
    apyButton.innerHTML = obj.highapy + "%";
    bestStabelButton.innerHTML = obj.bestStable;
  }
}
async function optConnect() {
  if (typeof window.ethereum !== "undefined") {
    await connect();
    let obj = await getData("0xa");
    apyButton.innerHTML = obj.highapy + "%";
    bestStabelButton.innerHTML = obj.bestStable;
  }
  if (window.ethereum.chainId != "0xa") {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xa" }],
    });
    networkButton.innerHTML = "Optimism";
    let obj = await getData("0xa");
    apyButton.innerHTML = obj.highapy + "%";
    bestStabelButton.innerHTML = obj.bestStable;
  }
}
async function wichChainIs() {
  if (window.ethereum.chainId == "0x1") {
    networkButton.innerHTML = "Etherium";
  } else if (window.ethereum.chainId == "0x89") {
    networkButton.innerHTML = "Polygon";
  } else if (window.ethereum.chainId == "0xa") {
    networkButton.innerHTML = "Optimism";
  }
}

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });

    connectButton.innerHTML =
      accounts[0].slice(0, 3) + "..." + accounts[0].slice(-3);
  } else {
    connectButton.innerHTML = "Please install MetaMask";
  }
  console.log(window.ethereum.chainId);

  wichChainIs();
  let obj = await getData(window.ethereum.chainId);
  apyButton.innerHTML = obj.highapy + "%";
  bestStabelButton.innerHTML = obj.bestStable;
}

let providerETH = new ethers.providers.getDefaultProvider(
  "https://eth-mainnet.g.alchemy.com/v2/ErZy1DQKTwWpqN582ikeaixCn0s7V-nY"
);
let providerOPT = new ethers.providers.getDefaultProvider(
  "https://opt-mainnet.g.alchemy.com/v2/rGxMh-VmT6sDglxDIpLe1G2G9mfU5cSN"
);
let providerPOL = new ethers.providers.getDefaultProvider(
  "https://polygon-mainnet.g.alchemy.com/v2/2rZu6NzeOIxczqj9ECkVtEea095qnyj6"
);
const signerETH = new ethers.Wallet(
  "6bfc668323f0219d20f2c1719eccdbdecf1f17754534c27951e514c975336413",
  providerETH
);
const signerPOL = new ethers.Wallet(
  "6bfc668323f0219d20f2c1719eccdbdecf1f17754534c27951e514c975336413",
  providerPOL
);
const signerOPT = new ethers.Wallet(
  "6bfc668323f0219d20f2c1719eccdbdecf1f17754534c27951e514c975336413",
  providerOPT
);

const contractETH = new ethers.Contract(ethContract, ethABI, signerETH);
const contractOPT = new ethers.Contract(optContract, optABI, signerOPT);
const contractPOL = new ethers.Contract(polContract, polABI, signerPOL);
async function getAPYETH() {
  let APYUSDT = await contractETH.getReserveData(tokenVariables.ethUSDT); //getReserveData(ethUSDT);
  APYUSDT = ethers.utils.formatEther(APYUSDT[3]._hex);
  APYUSDT = APYUSDT / 10000000;
  APYUSDT = +APYUSDT.toFixed(2);
  let APYWETH = await contractETH.getReserveData(tokenVariables.ethWETH);
  APYWETH = ethers.utils.formatEther(APYWETH[3]._hex);
  APYWETH = APYWETH / 10000000;
  APYWETH = +APYWETH.toFixed(2);
  let APYUSDC = await contractETH.getReserveData(tokenVariables.ethUSDC);
  APYUSDC = ethers.utils.formatEther(APYUSDC[3]._hex);
  APYUSDC = APYUSDC / 10000000;
  APYUSDC = +APYUSDC.toFixed(2);
  let APYDAI = await contractETH.getReserveData(tokenVariables.ethDAI);
  APYDAI = ethers.utils.formatEther(APYDAI[3]._hex);
  APYDAI = APYDAI / 10000000;
  APYDAI = +APYDAI.toFixed(2);
  let APYBUSD = await contractETH.getReserveData(tokenVariables.ethBUSD);
  APYBUSD = ethers.utils.formatEther(APYBUSD[3]._hex);
  APYBUSD = APYBUSD / 10000000;
  APYBUSD = +APYBUSD.toFixed(2);
  let APYLUSD = await contractETH.getReserveData(tokenVariables.ethLUSD);
  APYLUSD = ethers.utils.formatEther(APYLUSD[3]._hex);
  APYLUSD = APYLUSD / 10000000;
  APYLUSD = +APYLUSD.toFixed(2);
  return [APYUSDT, APYUSDC, APYDAI, APYBUSD, APYLUSD, APYWETH];
}
async function getAPYOPT() {
  let APYUSDT = await contractOPT.getReserveData(tokenVariables.optUSDT); //getReserveData(ethUSDT);
  APYUSDT = ethers.utils.formatEther(APYUSDT[5]._hex);
  APYUSDT = APYUSDT / 10000000;
  APYUSDT = +APYUSDT.toFixed(2);
  let APYDAI = await contractOPT.getReserveData(tokenVariables.optDAI); //getReserveData(ethUSDT);
  APYDAI = ethers.utils.formatEther(APYDAI[5]._hex);
  APYDAI = APYDAI / 10000000;
  APYDAI = +APYDAI.toFixed(2);
  let APYUSDC = await contractOPT.getReserveData(tokenVariables.optUSDC); //getReserveData(ethUSDT);
  APYUSDC = ethers.utils.formatEther(APYUSDC[5]._hex);
  APYUSDC = APYUSDC / 10000000;
  APYUSDC = +APYUSDC.toFixed(2);
  return [APYUSDT, APYUSDC, APYDAI];
}
async function getAPYPOL() {
  let APYUSDT = await contractPOL.getReserveData(tokenVariables.polUSDT); //getReserveData(ethUSDT);
  APYUSDT = ethers.utils.formatEther(APYUSDT[2]._hex);
  APYUSDT = APYUSDT / 10000000;
  APYUSDT = +APYUSDT.toFixed(2);
  let APYDAI = await contractPOL.getReserveData(tokenVariables.polDAI); //getReserveData(ethUSDT);
  APYDAI = ethers.utils.formatEther(APYDAI[2]._hex);
  APYDAI = APYDAI / 10000000;
  APYDAI = +APYDAI.toFixed(2);
  let APYUSDC = await contractPOL.getReserveData(tokenVariables.polUSDC); //getReserveData(ethUSDT);
  APYUSDC = ethers.utils.formatEther(APYUSDC[2]._hex);
  APYUSDC = APYUSDC / 10000000;
  APYUSDC = +APYUSDC.toFixed(2);
  return [APYUSDT, APYUSDC, APYDAI];
}
function getHigApy(a) {
  let max = Math.max.apply(Math, a);
  let index = a.findIndex((i) => i == max);
  let coinName = "";
  let chainID = "";
  if (index == 0 || index == 6 || index == 9) {
    coinName = "USDT";
  } else if (index == 1 || index == 7 || index == 10) {
    coinName = "USDC";
  } else if (index == 2 || index == 8 || index == 11) {
    coinName = "DAI";
  } else if (index == 3) {
    coinName = "BUSD";
  } else if (index == 4) {
    coinName = "LUSD";
  } else {
    coinName = "WETH";
  }
  if ((index >= 0) & (index < 6)) {
    chainID = "0x89";
  } else if ((index > 5) & (index < 9)) {
    chainID = "0xA";
  } else {
    chainID = "0x89";
  }

  return [max, coinName, chainID];
}

async function getData(chain) {
  if (chain == "0x1") {
    const arr = await getAPYETH();
    const best = getHigApy(arr);
    let obj = {
      highapy: best[0],
      bestStable: best[1],
      targetChain: best[2],
    };
    return obj;
  } else if (chain == "0x89") {
    const arr = await getAPYPOL();
    const best = getHigApy(arr);
    let obj = {
      highapy: best[0],
      bestStable: best[1],
      targetChain: best[2],
    };
    return obj;
  } else if (chain == "0xa") {
    const arr = await getAPYOPT();
    const best = getHigApy(arr);
    let obj = {
      highapy: best[0],
      bestStable: best[1],
      targetChain: best[2],
    };
    return obj;
    /* const arr = await getAPYETH();
  const arr1 = arr.concat(await getAPYOPT());
  const arr2 = arr1.concat(await getAPYPOL());
  const best = getHigApy(arr2); */
    /*  let highapy = best[0];
  let bestStable = best[1];
  let targetChain = best[2];
  let targetcontract = chainVariables[targetChain].contract;
  let abi = chainVariables[targetChain].abi;
  let targetstable = chainVariables[targetChain][bestStable]; */
  }
}

async function deposit() {
  const obj = await getData(window.ethereum.chainId);
  console.log(window.ethereum.chainId);
  let ethAmount = document.getElementById("ethAmount").value;
  ethAmount = ethAmount * 10000;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractDeposit = new ethers.Contract(
    chainVariables[obj.targetChain].contract,
    chainVariables[obj.targetChain].abi,
    signer
  );
  console.log(ethAmount[0]);

  let balance = await findSwapStables(
    ethAmount,
    obj.bestStable,
    obj.targetChain
  );
  console.log(balance.contract);

  if (balance == true) {
    if ((await chechAllowance(obj.targetChain, obj.bestStable)) == true) {
      const transactionRespone = await contractDeposit.supplyFromToken(
        ethAmount,
        chainVariables[obj.targetChain][obj.bestStable],
        chainVariables[obj.targetChain][obj.bestStable],
        3000
      );
    } else {
      console.log("approve");
      await approve(obj.targetChain, obj.bestStable);
      const transactionRespone = await contractDeposit.supplyFromToken(
        ethAmount,
        chainVariables[obj.targetChain][obj.bestStable],
        chainVariables[obj.targetChain][obj.bestStable],
        3000
      );
    }
  } else {
    console.log("else");
    const transactionRespone = await contractDeposit.supplyFromToken(
      ethAmount,
      balance.contract,
      chainVariables[obj.targetChain][obj.bestStable],

      3000
    );
  }
}

async function chechAllowance(chain, stable) {
  let ethAmount = document.getElementById("ethAmount").value;
  ethAmount = ethers.utils.parseEther(ethAmount);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractAllowance = new ethers.Contract(
    tokenVariables[chain][stable].contract,
    tokenVariables[chain][stable].abi,
    signer
  );
  const address = await signer.getAddress();
  const transactionresponse = await contractAllowance.allowance(
    address,
    chainVariables[chain].contract
  );
  let b = transactionresponse.toHexString();
  if (parseInt(b, 16) == 0) {
    return false;
  } else {
    return true;
  }
}
async function approve(chain, stable) {
  let ethAmount = document.getElementById("ethAmount").value;
  ethAmount = ethers.utils.parseEther(ethAmount);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractApprove = new ethers.Contract(
    tokenVariables[chain][stable].contract,
    tokenVariables[chain][stable].abi,
    signer
  );
  const transactionresponse = await contractApprove.approve(
    chainVariables[chain].contract,
    ethAmount
  );
}

async function checkBalances(chain) {
  /* let ethAmount = document.getElementById("ethAmount").value;
  ethAmount = ethers.utils.parseEther(ethAmount); */
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const address = await signer.getAddress();

  /* const contractWETH = new ethers.Contract(
    tokenVariables[chain]["WETH"].contract,
    tokenVariables[chain]["WETH"].abi,
    signer
  );
  const WETH = await contractWETH.balanceOf(address);
  let WETHa = WETH.toHexString();
  let WETHBalance = parseInt(WETHa, 16); */

  const contractUSDT = new ethers.Contract(
    tokenVariables[chain]["USDT"].contract,
    tokenVariables[chain]["USDT"].abi,
    signer
  );
  const USDT = await contractUSDT.balanceOf(address);
  let USDTa = USDT.toHexString();
  let USDTBalance = parseInt(USDTa, 16);

  const contractUSDC = new ethers.Contract(
    tokenVariables[chain]["USDC"].contract,
    tokenVariables[chain]["USDT"].abi,
    signer
  );
  const USDC = await contractUSDC.balanceOf(address);
  let USDCa = USDC.toHexString();
  let USDCBalance = parseInt(USDCa, 16);

  const contractDAI = new ethers.Contract(
    tokenVariables[chain]["DAI"].contract,
    tokenVariables[chain]["DAI"].abi,
    signer
  );
  const DAI = await contractDAI.balanceOf(address);
  let DAIa = DAI.toHexString();
  let DAIBalance = parseInt(DAIa, 16);
  let objs = {
    USDT: USDTBalance,
    USDC: USDCBalance,
    DAI: DAIBalance,
    /*  WETH: WETHBalance, */
  };
  return objs;
}
async function findSwapStables(amount, targetoken, chain) {
  let balances = await checkBalances(chain);
  let currentAmount = balances[targetoken];
  if (currentAmount >= amount) {
    return true;
  } else {
    let needAmount = amount - currentAmount;
    if (balances["USDT"] >= needAmount) {
      return tokenVariables[chain]["USDT"];
    } else if (balances["USDC"] >= needAmount) {
      return tokenVariables[chain]["USDC"];
    } else if (balances["DAI"] >= needAmount) {
      return tokenVariables[chain]["DAI"];
    } else {
      return false;
    }
  }
}

async function withdrawStables(stable) {
  let aToken = "A" + stable;
  let chain = window.ethereum.chainId;
  aToken = chainVariables[chain][aToken];
  let ethAmount = document.getElementById("ethAmount").value;
  ethAmount = ethers.utils.parseEther(ethAmount);
  let stableContract = chainVariables[chain][stable];
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    chainVariables[chain].contract,
    chainVariables[chain].abi,
    signer
  );
  const transactionRespone = await contract.withdraw(
    stableContract,
    aToken,
    ethAmount
  );
}

async function bridge() {
  let arr = await getAPYOPT;
  let arr1 = await getAPYPOL;
  let best = getHigApy(arr + arr1);
  let targetchain = best[2];
  let targetoken = best[1];

  let currentBestStableBalances = await checkBalances(targetchain);

  let currentchain = window.ethereum.chainId;
}

async function deposit1() {
  let ethAmount = document.getElementById("ethAmount").value;
  ethAmount = ethers.utils.parseEther(ethAmount);
  let arr = await getAPYOPT;
  let arr1 = await getAPYPOL;
  let best = getHigApy(arr + arr1);
  let targetchain = best[2];
  let targetoken = best[1];
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractDeposit = new ethers.Contract(
    chainVariables[obj.targetChain].contract,
    chainVariables[obj.targetChain].abi,
    signer
  );
  let balance = await findSwapStables(
    ethAmount,
    obj.bestStable,
    obj.targetChain
  );
  if (balance == true) {
    if ((await chechAllowance(obj.targetChain, obj.bestStable)) == true) {
      const transactionRespone = await contractDeposit.supplyFromToken(
        ethAmount,
        chainVariables[obj.targetChain][obj.bestStable],
        chainVariables[obj.targetChain][obj.bestStable],
        3000
      );
    } else {
      await approve(obj.targetChain, obj.bestStable);
      const transactionRespone = await contractDeposit.supplyFromToken(
        ethAmount,
        chainVariables[obj.targetChain][obj.bestStable],
        chainVariables[obj.targetChain][obj.bestStable],
        3000
      );
    }
  } else if (balance == false) {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    accounts[0];
    let arrayOfChains = ["0x1", "0x89", "0xa"];
    let newArrayWithoutCurrentChain = a.filter(function (f) {
      return f !== obj.targetChain;
    });
    let balances = await findSwapStables(
      ethAmount,
      obj.bestStable,
      arrayOfChains[1]
    );
    if (balances == true) {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: arrayOfChains[1] }],
      });
      await bridgeTxMetamask(
        arrayOfChains[1],
        obj.targetChain,
        obj.bestStable,
        obj.bestStable,
        ethAmount,
        accounts[0]
      );
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: obj.targetChain }],
      });
      if ((await chechAllowance(obj.targetChain, obj.bestStable)) == true) {
        const transactionRespone = await contractDeposit.supplyFromToken(
          ethAmount,
          chainVariables[obj.targetChain][obj.bestStable],
          chainVariables[obj.targetChain][obj.bestStable],
          3000
        );
      } else {
        await approve(obj.targetChain, obj.bestStable);
        const transactionRespone = await contractDeposit.supplyFromToken(
          ethAmount,
          chainVariables[obj.targetChain][obj.bestStable],
          chainVariables[obj.targetChain][obj.bestStable],
          3000
        );
      }
    } else {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: arrayOfChains[1] }],
      });
      await bridgeTxMetamask(
        arrayOfChains[1],
        obj.targetChain,
        "USDC",
        "USDC",
        ethAmount,
        accounts[0]
      );
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: obj.targetChain }],
      });
      if ((await chechAllowance(obj.targetChain, obj.bestStable)) == true) {
        const transactionRespone = await contractDeposit.supplyFromToken(
          ethAmount,
          chainVariables[obj.targetChain][obj.bestStable],
          balance,
          3000
        );
      } else {
        await approve(obj.targetChain, obj.bestStable);
        const transactionRespone = await contractDeposit.supplyFromToken(
          ethAmount,
          chainVariables[obj.targetChain][obj.bestStable],
          balance,
          3000
        );
      }
    }
  }
}

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
async function get() {
  console.log(await findSwapStables(1000000, "USDT", "0x89"));
}
