const Matic= artifacts.require("matic")
const Link = artifacts.require("link")


module.exports = async function (deployer) {
    await deployer.deploy(Matic);
    await deployer.deploy(Link)


};