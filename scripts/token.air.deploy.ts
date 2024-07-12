import { ethers, upgrades } from "hardhat";
import dotenv from "dotenv";
dotenv.config();
async function deployAirdrop() {
	const Airdrop = await ethers.getContractFactory("TokenAirdrop");

	const [owner] = await ethers.getSigners();

	// 设置构造函数的初始参数
	const tokenAddress = process.env.TOKEN_CONTRACT_ADDRESS_OPBNB;
	const merkleRoot = process.env.HASH_ROOT;

	console.log(`
	代币合约地址：${tokenAddress},
	根哈希：${merkleRoot}
		`);

	// @ts-ignore
	const airdrop = await upgrades.deployProxy(Airdrop, [], {
		initializer: false,
		timeout: 600000, // 10 minutes timeout
		pollingInterval: 15000, // 15 seconds polling interval
	});

	console.log("...部署中");
	// 等待部署完成
	await airdrop.waitForDeployment(); //token.deployed()已作废

	const proxyAddress = await airdrop.getAddress(); //token.address 已作废
	console.log(`
    部署成功！！！！，
    部署合约的账户地址 owner：${owner.address},
    合约地址:${proxyAddress}
    `);
}
async function main() {
	try {
		await deployAirdrop();
	} catch (err) {
		console.log("发布失败！！！！", err);
	}
}

main();
