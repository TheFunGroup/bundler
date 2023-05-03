/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      forking: {
        url: "https://rpc.tenderly.co/fork/b7bee232-6e3a-4b60-9ed0-6cf92a3296ed",
      }
    }
  }
};
