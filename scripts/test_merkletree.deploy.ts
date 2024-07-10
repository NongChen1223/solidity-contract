import { ethers, upgrades } from "hardhat";
import dotenv from "dotenv";
dotenv.config();
async function deployMerkletree() {
	const Merkletree = await ethers.getContractFactory("test_merkletree");

	const [owner] = await ethers.getSigners();

	const merkleRoot = process.env.HASH_ROOT;

	// @ts-ignore
	const merkletree = await upgrades.deployProxy(Merkletree, [merkleRoot], {
		initializer: "initialize",
	});

	console.log("...部署中");
	// 等待部署完成
	await merkletree.waitForDeployment();

	const proxyAddress = await merkletree.getAddress();
	console.log(`
    部署成功！！！！，
    部署合约的账户地址 owner：${owner.address},
    合约地址:${proxyAddress}
  `);
}
async function main() {
	try {
		await deployMerkletree();
	} catch (err) {
		console.log("发布失败！！！！", err);
	}
}

main();
