// import the contract
const Twitter = artifacts.require("Twitter")
// import all the coins
const Matic= artifacts.require("Matic")
const Link = artifacts.require("Link")


module.exports = async function (deployer) {
    const matic = await Matic.deployed()
    const link = await Link.deployed()

    await deployer.deploy(Twitter);
    const tw = await Twitter.deployed()
    // Add the coins to the contract's coin list
    await tw.newCoin("MATIC" , matic.address)
    await tw.newCoin("LINK" , link.address)
    
};