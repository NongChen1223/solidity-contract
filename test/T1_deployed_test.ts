import dotenv from "dotenv";
import Web3 from "web3";
import { abi } from "../artifacts/contracts/tokens/T1.sol/T1.json";
dotenv.config();

// 已部署合约的地址
const contractAddress =
	process.env.CONTRACT_ADDRESS; // 替换为你的合约地址

const web3 = new Web3(process.env.WEB3_RPC); // 替换为你的以太坊节点地址

// 获取合约实例
const contract = new web3.eth.Contract(
	abi,
	contractAddress,
);

//查询地址
const address = process.env.WALLET_ADDRESS;

async function testMain() {
	try {
		// 查询代币名称
		const name = await contract.methods
			.name()
			.call();
		console.log("代币名称:", name);

		// 查询代币符号
		const symbol = await contract.methods
			.symbol()
			.call();
		console.log("代币符号:", symbol);

		// 查询代币精度
		const decimals = await contract.methods
			.decimals()
			.call();
		console.log("代币精度:", Number(decimals));

		// 查询总供应量
		const totalSupply: string =
			await contract.methods.totalSupply().call();
		console.log(
			"代币总供应量:",
			web3.utils.fromWei(
				Number(totalSupply),
				"ether",
			),
		);

		// 查询地址余额
		const balance: string = await contract.methods
			.balanceOf(address)
			.call();
		console.log(
			"地址余额:",
			web3.utils.fromWei(
				Number(balance),
				"ether",
			),
		);

		// 添加白名单示例（仅限合约所有者调用）
		// const addToWhitelistTx = await contract.methods.addToWhitelist(address).send({ from: address });
		// console.log("添加白名单交易:", addToWhitelistTx);

		// 销毁代币示例（仅限白名单调用）
		// const burnTx = await contract.methods.burn(web3.utils.toWei("100", "ether")).send({ from: address });
		// console.log("销毁代币交易:", burnTx);

		// 铸造代币示例（仅限白名单调用）
		// const mintTx = await contract.methods.mint(web3.utils.toWei("1000", "ether")).send({ from: address });
		// console.log("铸造代币交易:", mintTx);
	} catch (err) {
		console.log("报错", err);
	}
}

testMain();
