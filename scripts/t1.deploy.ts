import { ethers, upgrades } from "hardhat";

async function deployT1() {
	/*
	 *  获取合约工厂
	 *  ethers.getContractFactory 传入的名称一定要在contracts目录下有对应的合约名称
	 *  匹配逻辑：ethers.getContractFactory 会根据提供的合约名称查找编译输出中的 ABI 和字节码，从而生成一个用于部署和交互的合约工厂对象。
	 */
	const T1 = await ethers.getContractFactory("T1");

	const [owner] = await ethers.getSigners();

	// 设置构造函数的初始参数
	const _initName = "SKTT1";
	const _initSymbol = "T1";
	const _initDecimals = 2;

	// @ts-ignore
	const _initTotalSupply = ethers.parseUnits("1000000", _initDecimals); // 发行 1000000 代币

	/*
	 * 传递构造函数参数并部署代理合约
	 * { initializer: "initialize" }: 这是一个选项对象，指定了初始化函数的名称。在这种情况下，初始化函数的名称是 initialize
	 */
	const token = await upgrades.deployProxy(
		T1,
		[_initName, _initSymbol, _initDecimals, _initTotalSupply],
		{ initializer: "initialize" },
	);
	console.log("...部署中");
	// 等待部署完成
	await token.waitForDeployment(); //token.deployed()已作废

	// 铸造代币
	await token.mint(10000);
	const proxyAddress = await token.getAddress(); //token.address 已作废
	console.log(`
    部署成功！！！！，
    部署合约的账户地址 owner：${owner.address},
    合约地址:${proxyAddress}
    `);
}
/*
 * 如果部署遇到
 * TypeError: (0 , ethers_1.getAddress) is not a function at new HardhatEthersSigner
 * 将package.json的ethers升级为^6.0.0版本旧版本弃用掉部分api
 */
async function main() {
	try {
		await deployT1();
	} catch (err) {
		console.log("发布失败！！！！", err);
	}
}

main();
