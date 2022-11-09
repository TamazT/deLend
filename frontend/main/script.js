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
depositButton.onclick = deposit;
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
    apyButton.innerHTML = obj.highapy;
    bestStabelButton.innerHTML = obj.bestStable;
  }
}
async function polConnect() {
  if (typeof window.ethereum !== "undefined") {
    await connect();
    let obj = await getData("0x89");
    console.log(obj);
    apyButton.innerHTML = obj.highapy;
    bestStabelButton.innerHTML = obj.bestStable;
  }
  if (window.ethereum.chainId != "0x89") {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x89" }],
    });
    networkButton.innerHTML = "Polygon";
    let obj = await getData("0x89");
    console.log(obj);
    apyButton.innerHTML = obj.highapy;
    bestStabelButton.innerHTML = obj.bestStable;
  }
}
async function optConnect() {
  if (typeof window.ethereum !== "undefined") {
    await connect();
    let obj = await getData("0xA");
    apyButton.innerHTML = obj.highapy;
    bestStabelButton.innerHTML = obj.bestStable;
  }
  if (window.ethereum.chainId != "0xA") {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xA" }],
    });
    networkButton.innerHTML = "Optimizm";
    let obj = await getData("0xA");
    apyButton.innerHTML = obj.highapy;
    bestStabelButton.innerHTML = obj.bestStable;
  }
}
async function wichChainIs() {
  if (window.ethereum.chainId == "0x1") {
    networkButton.innerHTML = "Etherium";
  } else if (window.ethereum.chainId == "0x89") {
    networkButton.innerHTML = "Polygon";
  } else if (window.ethereum.chainId == "0xA") {
    networkButton.innerHTML = "Optimizme";
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
  wichChainIs();
  let obj = await getData(window.ethereum.chainId);
  apyButton.innerHTML = obj.highapy;
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
  console.log(index);
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
    chainID = "ETH";
  } else if ((index > 5) & (index < 9)) {
    chainID = "OPT";
  } else {
    chainID = "POL";
  }

  return [max, coinName, chainID];
}

window.onload;
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
  } else if (chain == "0xA") {
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
  const obj = await getData();
  let ethAmount = document.getElementById("ethAmount").value;
  ethAmount = ethers.utils.parseEther(ethAmount);
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
  } else {
    const transactionRespone = await contractDeposit.supplyFromToken(
      ethAmount,
      chainVariables[obj.targetChain][obj.bestStable],
      balance,
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
    tokenVariables[chain][contract].contract,
    tokenVariables[chain][contract].abi,
    signer
  );
  const transactionresponse = await contractApprove.approve(
    chainVariables[chain].contract,
    ethAmount
  );
}

async function checkBalances(chain) {
  let ethAmount = "0.5";
  ethAmount = ethers.utils.parseEther(ethAmount);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const address = await signer.getAddress();

  const contractWETH = new ethers.Contract(
    tokenVariables[chain]["WETH"].contract,
    tokenVariables[chain]["WETH"].abi,
    signer
  );
  const WETH = await contractWETH.balanceOf(address);
  let WETHa = WETH.toHexString();
  let WETHBalance = parseInt(WETHa, 16);

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
    WETH: WETHBalance,
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
//кнопка должна принимать тот стейблы который нужно свапнуть
//Atoken
//сеть в которой происходит вывод
//сумму для вывод
//Вызвать функцию

async function withdrawStables(stable, chain) {
  let aToken = "A" + stable;
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
