import dotenv from "dotenv";
import Web3 from "web3";
import { abi } from "../artifacts/contracts/airdrop/T1_Airdrop.sol/T1_Airdrop.json";
dotenv.config();

//空投合约地址
const air_contractAddress = process.env.AIR_CONTRACT_ADDRESS_OPBNB; // 替换为你的合约地址
const web3 = new Web3(process.env.WEB3_RPC_BSC); // 替换为你的以太坊节点地址
// 获取合约实例
const contract = new web3.eth.Contract(abi, air_contractAddress);
//测试账户地址和私钥
const account = "";
const privateKey = "";
//该账户的merkleProof
const merkleProof = [
	"0xeb799d2f39646a8d839bfbed7911af66d4e6435ff216acfe5d12476e51639d1a",
	"0x227ab06278e0962eed04e9bf6bc5864f1b16d7d1d00a56e58c0e245f37b198f5",
	"0x55ba317728fc52bdb549d5dc4c12ce61df44b811915f2a619d0dc7c64ca76729",
];

//拼接
const amount = 10; // 替换为你的空投代币数量
const accountJoin = `${account}|${amount}`; // 替换为你的account_join字符串

async function testMain() {
	if (!privateKey || !account) return;
	try {
		console.log("打印拼接字符", accountJoin);
		//获取方法ABI
		const data = contract.methods.claim(account, amount, accountJoin, merkleProof).encodeABI();

		// 获取当前账户的nonce值
		const nonce = await web3.eth.getTransactionCount(account, "latest");

		// 获取当前的gas价格
		const gasPrice = await web3.eth.getGasPrice();
		const tx = {
			from: account,
			to: air_contractAddress,
			gasPrice: gasPrice,
			gas: 2000000,
			nonce: nonce,
			data: data,
		};
		console.log("打印交易数据data", tx);

		//发送交易签名
		const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
		console.log("打印交易信息", signedTx);

		web3.eth
			.sendSignedTransaction(signedTx.rawTransaction)
			.on("receipt", res => {
				//在收到交易回执时，打印回执信息。
				console.log("领取成功", res);
			})
			.on("error", res => {
				//在发生错误时，打印错误信息。
				console.log("领取失败", res);
			});
	} catch (err) {
		console.log("报错", err);
	}
}

testMain();
