# Decentralized oracle for requesting cryptocurrency market prices

### Used technologies
- Docker and Docker Compose
- Node (v10.20.1)
- Ethereum and Solidity
- Chainlink and LinkPool
- React (Truffle Box)
- Web3.js

## Install

Install dependencies with yarn/npm.

## General Usage

To first use this on Ropsten, you can update `truffle.js` with your private key and RPC host for deployment. 
This could be Infura or your own node for example.

**This repository includes the ropsten contract `build` files, so once you set up `truffle.js` you can use the scripts
 on the Ropsten network.**

You can also deploy this locally using `ganache-cli`, but you need to deploy the `Oracle.sol` contract for 
your Chainlink node and create a new job spec as per the example you want to use in `specs`.

### Setup

In `truffle.js` enter your mnemonic and Ethereum URL, eg Infura.

### Deployment

To deploy contract, run a standard Truffle migration (uses Truffle from local deps):
```
npm run migrate
```
or 
```
truffle migrate --network ropsten --reset
```

#### API Aggregator

To run the external adapter:
```
docker run -d -p 8080:8080 linkpool/apiaggregator-bridge:latest
```

Request the current price of ETH aggregated from Coinbase & Bitstamp:
```
npm run exec scripts/consumer/fund-contract.js -- --network ropsten
npm run exec scripts/consumer/request-data.js eth usd -- --network ropsten
npm run exec scripts/consumer/read-contract.js eth usd -- --network ropsten
```

### Chainlink node setup

To deploy Chainlink node, setup credentials in `chainlink.env` and run:
```
cd deploy
./start.sh
```

- Navigate to http://localhost:6688
- Create a bridge called `api-aggregator` with your host IP address and port 8080
- Create a new job with JSON specification from `specs/api_aggregator.json`
- Call `setFulfillmentPermission` on Oracle contract for your Oracle node as described in https://docs.chain.link/docs/fulfilling-requests#add-your-node-to-the-oracle-contract

### Client

Run the dApp:
```
cd client
npm start
```