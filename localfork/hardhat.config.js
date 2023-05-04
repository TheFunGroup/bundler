/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      forking: {
        url: "https://rpc.tenderly.co/fork/be980598-12cd-4605-ab66-ec2bbe0986c5",
      }
    }
  }
};
