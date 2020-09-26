const HDWalletProvider = require("truffle-hdwallet-provider");
const path = require("path");

const mnemonic = "drink body fuel cute barrel arrive voice begin tone extra execute twelve";
const infuraKey = "9e2db724d0fa4766ace54a8c633f1aab";

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  compilers: {
    solc: {
      version: "0.4.24",
    },
  },
  networks: {
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${infuraKey}`),
      network_id: 3,
      gas: 5500000,
      gasPrice: 10000000000,
      skipDryRun: true,

      // Chainlink Configuration: local job ids and oracle contract addresses (not node address!)
      linkToken: "0x20fe562d797a42dcb3399062ae9546cd06f63280",
      apiAggregatorJob: {
        id: "82afa17dcd3d428b9760dff4a528172b",
        oracle: "0x270873E493FefB3f76378b535D76423B352e3e47",
      },
    },
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 6712390,

      // Chainlink Configuration: local job ids and oracle addresses
      linkToken: "",
      apiAggregatorJob: {
        id: "",
        oracle: "",
      },
    },
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
