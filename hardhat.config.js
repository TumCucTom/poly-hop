require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { PRIVATE_KEY, POLYGON_RPC_URL, MUMBAI_RPC_URL } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    // Add conditional networks to prevent HH8 when env vars are missing
    ...(POLYGON_RPC_URL && PRIVATE_KEY
      ? {
          polygon: {
            url: POLYGON_RPC_URL,
            accounts: [PRIVATE_KEY],
          },
        }
      : {}),
    ...(MUMBAI_RPC_URL && PRIVATE_KEY
      ? {
          mumbai: {
            url: MUMBAI_RPC_URL,
            accounts: [PRIVATE_KEY],
          },
        }
      : {}),
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY, // optional for verification
  },
};