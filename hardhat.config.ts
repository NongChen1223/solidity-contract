import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import { ProxyAgent, setGlobalDispatcher } from "undici";
import * as dotenv from "dotenv";

dotenv.config();

// 设置代理
const proxyAgent = new ProxyAgent("http://127.0.0.1:1080");
setGlobalDispatcher(proxyAgent);

const config: HardhatUserConfig = {
	solidity: "0.8.24",
	networks: {
		bscTestnet: {
			url: process.env.WEB3_RPC_BSC,
			chainId: 97,
			gasPrice: 10000000,
			accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
		},
		opbnbTestnet: {
			url: process.env.WEB3_RPC_OPBNB,
			chainId: 5611,
			gasPrice: 10000000,
			accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
		},
	},
};

export default config;
