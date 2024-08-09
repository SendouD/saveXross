require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config(); // Load environment variables from .env file

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID", // Replace with your Sepolia RPC URL
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [], // Add your private key to .env
      chainId: 11155111, // Sepolia chain ID
    },
  },
};
