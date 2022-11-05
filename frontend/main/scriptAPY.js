import {
  ethContract,
  ethABI,
  optContract,
  optABI,
  tokenVariables,
  polABI,
  polContract,
} from "./constants.js";
import * as ethers from "ethers";
import { TASK_COMPILE_SOLIDITY_EMIT_ARTIFACTS } from "hardhat/builtin-tasks/task-names.js";
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
const arr = await getAPYETH();
const arr1 = arr.concat(await getAPYOPT());
const arr2 = arr1.concat(await getAPYPOL());
console.log(getHigApy(arr2));
