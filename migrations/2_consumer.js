const Consumer = artifacts.require("Consumer");

const config = require('../truffle.js');
const helper = require('../scripts/helper');

module.exports = function(deployer, network) {
  let job = config.networks[helper.getNetwork(network)].apiAggregatorJob;
  if (!job.oracle) return;
  deployer.deploy(
      Consumer,
      helper.getLinkToken(network),
      job.oracle,
      web3.utils.utf8ToHex(job.id)
  );
};
