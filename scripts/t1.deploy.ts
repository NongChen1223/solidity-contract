import { ethers, upgrades } from "hardhat";

async function deployT1() {
    /*
    *  获取合约工厂
    *  ethers.getContractFactory 传入的名称一定要在contracts目录下有对应的合约名称
    *  匹配逻辑：ethers.getContractFactory 会根据提供的合约名称查找编译输出中的 ABI 和字节码，从而生成一个用于部署和交互的合约工厂对象。
    */
    const Token = await ethers.getContractFactory("T1");

    const [owner] = await ethers.getSigners();

    // 设置构造函数的初始参数
    const _initName = "SKTT1";
    const _initSymbol = "T1";
    const _initDecimals = 2;
    const _initTotalSupply = ethers.utils.parseUnits("1000000", _initDecimals); // 发行 1000000 代币

    // 传递构造函数参数并部署代理合约
    const token = await upgrades.deployProxy(Token, [_initName, _initSymbol, _initDecimals, _initTotalSupply], { initializer: 'initialize' });

    // 等待部署完成
    await token.deployed();

    // 铸造代币
    await token.mint(1000);
    console.log(`
    部署成功！！！！，
    部署合约的账户地址 owner：${owner.address},
    合约地址:${token.address}
    `);
}

async function main() {
    try {
        await deployT1();
    } catch (err) {
        console.log("发布失败！！！！", err);
    }
}

main();
