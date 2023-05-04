/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      forking: {
        url: "https://rpc.tenderly.co/fork/613ac0a0-390b-4805-99ab-6f16d528d9b1",
      }
    }
  }
};
