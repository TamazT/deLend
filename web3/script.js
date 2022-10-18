import {
  ethUSDT,
  ethContract,
  ethABI,
  ethWETH,
  ethUSDC,
  ethDAI,
  ethBUSD,
  ethLUSD,
} from "./constants.js";
import * as ethers from "ethers";
let provider = new ethers.providers.getDefaultProvider(
  "https://eth-mainnet.g.alchemy.com/v2/ErZy1DQKTwWpqN582ikeaixCn0s7V-nY"
);

const signer = new ethers.Wallet(
  "6bfc668323f0219d20f2c1719eccdbdecf1f17754534c27951e514c975336413",
  provider
);

const contract = new ethers.Contract(ethContract, ethABI, signer);

async function getAPYETH() {
  let APYUSDT = await contract.getReserveData(ethUSDT); //getReserveData(ethUSDT);
  APYUSDT = ethers.utils.formatEther(APYUSDT[3]._hex);
  APYUSDT = APYUSDT / 10000000;
  APYUSDT = +APYUSDT.toFixed(2);
  let APYWETH = await contract.getReserveData(ethWETH);
  APYWETH = ethers.utils.formatEther(APYWETH[3]._hex);
  APYWETH = APYWETH / 10000000;
  APYWETH = +APYWETH.toFixed(2);
  let APYUSDC = await contract.getReserveData(ethUSDC);
  APYUSDC = ethers.utils.formatEther(APYUSDC[3]._hex);
  APYUSDC = APYUSDC / 10000000;
  APYUSDC = +APYUSDC.toFixed(2);
  let APYDAI = await contract.getReserveData(ethDAI);
  APYDAI = ethers.utils.formatEther(APYDAI[3]._hex);
  APYDAI = APYDAI / 10000000;
  APYDAI = +APYDAI.toFixed(2);
  let APYBUSD = await contract.getReserveData(ethBUSD);
  APYBUSD = ethers.utils.formatEther(APYBUSD[3]._hex);
  APYBUSD = APYBUSD / 10000000;
  APYBUSD = +APYBUSD.toFixed(2);
  let APYLUSD = await contract.getReserveData(ethLUSD);
  APYLUSD = ethers.utils.formatEther(APYLUSD[3]._hex);
  APYLUSD = APYLUSD / 10000000;
  APYLUSD = +APYLUSD.toFixed(2);
  return [APYWETH, APYUSDT, APYUSDC, APYDAI, APYBUSD, APYLUSD];
}
const aga = await getAPYETH();
console.log(aga);
