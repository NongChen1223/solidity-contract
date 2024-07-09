import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import * as dotenv from "dotenv";

dotenv.config();
const config: HardhatUserConfig = {
	solidity: "0.8.24",
	networks: {
		bscTestnet: {
			url: `https://endpoints.omniatech.io/v1/bsc/testnet/public/`,
			chainId: 97,
			gasPrice: 100000,
			accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
		},
	},
};

export default config;
