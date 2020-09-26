const Consumer = artifacts.require("Consumer");

module.exports = async(callback) => {
    let currency1 = process.argv[4];
    let currency2 = process.argv[5];

    try {
        const contract = await Consumer.deployed();

        const hash = web3.utils.sha3(currency1 + currency2);
        const data = await contract.prices.call(hash);

        console.log("Pair hash: " + hash);
        console.log("Latest price: " + data.toNumber() / 100);
    } catch (e) {
        console.error(e);
    }

    return callback();
};