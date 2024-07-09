import { ethers, upgrades } from "hardhat";
import dotenv from "dotenv";
dotenv.config();
async function deployT1Airdrop() {
	const Airdrop = await ethers.getContractFactory("T1_Airdrop");

	const [owner] = await ethers.getSigners();

	// 设置构造函数的初始参数
	const tokenAddress = process.env.CONTRACT_ADDRESS;
	const merkleRoot = process.env.HASH_ROOT;

	// @ts-ignore
	const airdrop = await upgrades.deployProxy(Airdrop, [tokenAddress, merkleRoot], {
		initializer: "initialize",
		timeout: 600000, // 设置超时时间为10分钟
		pollingInterval: 10000, // 设置轮询间隔为10秒
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
		await deployT1Airdrop();
	} catch (err) {
		console.log("发布失败！！！！", err);
	}
}

main();
