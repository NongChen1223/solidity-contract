import { ethers, upgrades } from "hardhat";
import dotenv from "dotenv";
dotenv.config();
async function upgradeT1() {
	const T1_v2 = await ethers.getContractFactory("T1_v2");

	const [owner] = await ethers.getSigners();

	console.log("升级 V2版本合约中...");
	const proxyAddress = process.env.CONTRACT_ADDRESS; //替换为你的代理合约地址

	// @ts-ignore
	const upgraded = await upgrades.upgradeProxy(proxyAddress, T1_v2);

	await upgraded.initV2();

	console.log(`
		合约地址:${proxyAddress},
    升级合约成功，合约地址：${upgraded.address},
    合约拥有者:${owner.address}
    `);
}
async function main() {
	try {
		await upgradeT1();
	} catch (err) {
		console.log("升级失败！！！！", err);
	}
}

main();
