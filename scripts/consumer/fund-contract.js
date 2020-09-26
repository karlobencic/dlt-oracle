const helper = require("../helper");

const Consumer = artifacts.require("Consumer");
const LinkToken = artifacts.require("LinkTokenInterface");

/*
  This script is meant to assist with funding the requesting
  contract with LINK. It will send 1 LINK to the requesting
  contract for ease-of-use. Any extra LINK present on the contract
  can be retrieved by calling the withdrawLink() function.
*/

module.exports = async(callback) => {
    try {
        const network = await web3.eth.net.getNetworkType();
        const linkToken = await LinkToken.at(helper.getLinkToken(network));
        const contract = await Consumer.deployed();

        console.log("Sending 1 LINK to the consumer contract...");

        const tx = await linkToken.transfer(contract.address, web3.utils.toWei("1"));

        console.log("Done", tx.tx)
    } catch (e) {
        console.error(e);
    }

    return callback();
};