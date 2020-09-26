const Oracle = artifacts.require("Oracle");

module.exports = async(callback) => {
    try {
        console.log("Deploying Oracle.sol");

        const oracle = await Oracle.new(process.argv[4]);
        await oracle.setFulfillmentPermission(process.argv[5], true);
        
        console.log("Oracle Address:", oracle.address);
    } catch (e) {
        console.error(e);
    }
    return callback();
};