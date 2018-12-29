var testContract = artifacts.require("./TicTacToe.sol");

module.exports = function(deployer) {
  deployer.deploy(testContract);
};
