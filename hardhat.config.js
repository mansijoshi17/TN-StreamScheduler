require("dotenv").config({ path: "./.env" });
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

const privateKey = process.env.REACT_APP_PRIVATE_KEY;
const projectId = process.env.REACT_APP_ROPSTEN_KEY; 


module.exports = {
  networks: {
    hardhat: {}, 
    boba_rinkeby: {
      url: `https://rinkeby.boba.network`,
      accounts: [privateKey],
    },
    matic:{
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY}`,
      accounts:[privateKey],
      gas: 2100000,
      gasPrice: 8000000000
    }, 
    ropsten:{
      url:`https://ropsten.infura.io/v3/${projectId}`,
      accounts:[privateKey],
      gas: 2100000,
      gasPrice: 8000000000
    },
    bsc: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts:[privateKey]
    },
    avalancheTest: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43113,
      accounts:[privateKey],
    },
  },

  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
