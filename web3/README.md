# deLend web3 core

This section presents the web3 core of the deLand protocol.
The project was made using the hardhat framework.
Since the protocol greatly simplifies the user's interaction with DeFi tools, a small commission is charged from the user.
At the moment, the following functions are implemented:

- Deposit your own coins (eth/mattic/ etc.) in the token with the highest APY on Aave. With the help of the oracle data feed from chainlink, the user is charged a commission equal to $ 1 at the current rate.
- Deposit any own desired token (usdt/usdc/chain/ etc.) into the token with the highest APY on Aave. The user is charged a commission equal to 1% of the deposit amount.
- Refund of funds previously deposited on Aave.
- Functions for the owner of the contract.

# Contents

- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Quickstart](#quickstart)
- [Usage](#usage)
  - [Testing](#testing)
    - [Test Coverage](#test-coverage)
- [Deployment to a testnet or mainnet](#deployment-to-a-testnet-or-mainnet)
- [Verify on etherscan](#verify-on-etherscan)

# Getting Started

## Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
- [Nodejs](https://nodejs.org/en/)
  - You'll know you've installed nodejs right if you can run:
    - `node --version` and get an ouput like: `vx.x.x`
- [Yarn](https://yarnpkg.com/getting-started/install) instead of `npm`
  - You'll know you've installed yarn right if you can run:
    - `yarn --version` and get an output like: `x.x.x`
    - You might need to [install it with `npm`](https://classic.yarnpkg.com/lang/en/docs/install/) or `corepack`

## Quickstart

```
git clone https://github.com/TamazT/deLend
cd deLend/web3
yarn
```

# Usage

Deploy:

```
yarn deploy --network <name of network>
```

## Testing

```
yarn test
```

### Test Coverage

```
yarn coverage
```

# Deployment to a testnet or mainnet

1. Setup environment variabltes

You'll want to set your `GOERLI_RPC_URL` and `PRIVATE_KEY` as environment variables. You can add them to a `.env` file, similar to what you see in `.envExample`.

- `PRIVATE_KEY`: The private key of your account (like from [metamask](https://metamask.io/)). **NOTE:** FOR DEVELOPMENT, PLEASE USE A KEY THAT DOESN'T HAVE ANY REAL FUNDS ASSOCIATED WITH IT.
  - You can [learn how to export it here](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key).
- `GOERLI_RPC_URL`: This is url of the goerli testnet node you're working with. You can get setup with one for free from [Alchemy](https://alchemy.com/?a=673c802981) (Same for other networks)

2. Get testnet ETH

Head over to [faucets.chain.link](https://faucets.chain.link/) and get some tesnet ETH. You should see the ETH show up in your metamask. [You can read more on setting up your wallet with LINK.](https://docs.chain.link/docs/deploy-your-first-contract/#install-and-fund-your-metamask-wallet)

3. Deploy

Then run:

```
yarn hardhat deploy --network goerli
```

And copy / remember the contract address.

# Verify on etherscan

If you deploy to a testnet or mainnet, you can verify it if you get an [API Key](https://etherscan.io/myapikey) from Etherscan and set it as an environemnt variable named `ETHERSCAN_API_KEY`(and others). You can pop it into your `.env` file as seen in the `.envExample`.

In it's current state, if you have your api key set, it will auto verify goerli/other network contracts!

However, you can manual verify with:

```
yarn hardhat verify --constructor-args arguments.js DEPLOYED_CONTRACT_ADDRESS
```
