/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      forking: {
        url: "http://fun-alchemy-fork-eb-2-dev.us-west-2.elasticbeanstalk.com",
      }
    }
  }
};
