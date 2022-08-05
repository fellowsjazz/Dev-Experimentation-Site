require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/2bc94932a0c4464f81e2d3adab12ccb0",
      accounts: ["d4585203b50b80b6e8b7a079a4f5d2b6da4f46595cd7ded139bb0d411be7ba78"] //testnet account
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"]
    }
  }
};
