var testContract = artifacts.require("./test.sol");

module.exports = function(deployer) {
  deployer.deploy(testContract);
};
