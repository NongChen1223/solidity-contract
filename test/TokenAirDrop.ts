import dotenv from "dotenv";
import Web3 from "web3";
import { abi } from "../artifacts/contracts/airdrop/TokenAirdrop.sol/TokenAirdrop.json";
import { getL1TokenBalance } from "viem/zksync";
dotenv.config();

//初始化web3
const web3 = new Web3(process.env.WEB3_RPC_OPBNB); // 替换为你的以太坊节点地址

//空投合约地址
const AIR_ADDRESS = process.env.AIR_CONTRACT_ADDRESS_OPBNB;

//代币地址
const TOKEN_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS_OPBNB;

//默克尔树根哈希
const rootHex = process.env.HASH_ROOT;

// 获取合约实例
const contract = new web3.eth.Contract(abi, AIR_ADDRESS);

//地址私钥
const PRIVATE_KEY = `0x${process.env.PRIVATE_KEY}`; //需要手动拼接0x
async function getTokenBalance() {
	const balance: string = await contract.methods.getBalance().call();
	console.log("地址余额:", balance, web3.utils.fromWei(Number(balance), "ether"));
}

async function setRootAndToken() {
	if (!PRIVATE_KEY) return;
	try {
		console.log("打印我的私钥", PRIVATE_KEY);
		//这个方法将一个私钥转换为一个账户对象。账户对象包含了地址、私钥和公钥等信息
		const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
		console.log("打印转换的账户信息", account);

		//这个方法将上一步中生成的账户对象添加到 web3 的钱包中。这样，在发送交易时可以直接使用该账户，而无需每次都手动传递私钥
		web3.eth.accounts.wallet.add(account);
		const owner = account.address;
		console.log("owner地址", owner);

		// 传入参数setTokenAndRoot后使用encodeABI()编码
		const data = contract.methods.setTokenAndRoot(TOKEN_ADDRESS, rootHex).encodeABI();

		console.log("encodeABI成功...");
		// 获取当前gas price
		const gasPrice = await web3.eth.getGasPrice();
		console.log("获取当前gasPrice", gasPrice);

		// 该方法用于估算某个智能合约方法或是发送交易量所需要的gas费用
		const gasEstimate = await web3.eth.estimateGas({
			from: owner,
			to: AIR_ADDRESS, //需要交互的智能合约地址
			data: data,
		});
		console.log(`估算该笔交易需要的gas: ${gasEstimate}`);

		//打包交易信息
		const tx = {
			from: owner,
			to: AIR_ADDRESS,
			gas: gasEstimate,
			gasPrice: gasPrice,
			data: data,
		};
		console.log("交易信息详情", tx);

		//交易签名 signTransaction 方法用于对交易数据进行签名。签名后的交易数据可以用来证明该交易确实是由交易发起者（拥有私钥的人）发出的。这个方法会使用提供的私钥对交易数据进行签名，并返回签名后的交易数据。
		const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);

		//发送签名
		const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

		console.log("交易成功", receipt);
	} catch (err) {
		console.log("交易失败", err);
	}
}
// setRootAndToken();
getTokenBalance();
