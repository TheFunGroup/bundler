/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      forking: {
        url: "https://rpc.tenderly.co/fork/db38d879-8617-4b0c-b142-ba40b41dc776",
      }
    }
  }
};
