const Consumer = artifacts.require("Consumer");

module.exports = async(callback) => {
    let currency1 = process.argv[4];
    let currency2 = process.argv[5];

    try {
        const contract = await Consumer.deployed();

        console.log("Requesting price for", currency1, "-", currency2);

        const tx = await contract.requestPrice(currency1, currency2);

        console.log("Done", tx.tx);
    } catch (e) {
        console.error(e);
    }

    return callback();
};