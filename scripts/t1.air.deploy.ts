import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import dotenv from "dotenv";
dotenv.config();

type WhitelistEntry = {
	address: string;
	amount: number;
};

const WHITE_LIST: WhitelistEntry[] = [
	{
		address:
			"0x7aa2B38737F958d9F7f47C27aD0807d61e66f7fb",
		amount: 10,
	},
];
//使用 keccak256 哈希函数为每个白名单条目创建默克尔树叶子
function createLeavesList(
	list: WhitelistEntry[],
) {
	const leaves = list.map(entry =>
		keccak256(`${entry.address}${entry.amount}`),
	);
	return leaves;
}
async function createrMerkleTreeNode() {
	const leavesList = createLeavesList(WHITE_LIST);
	//创建默克尔树，使用 keccak256 哈希算法和叶节点排序功能
	const tree = new MerkleTree(
		leavesList,
		keccak256,
		{ sortPairs: true },
	);
	// 获取树的根哈希，通常会被存储在智能合约中用于验证
	const rootHash = tree.getHexRoot();
	// 生成并打印第一个地址的默克尔证明
	const proof = tree.getHexProof(leavesList[0]);
	console.log("打印leavesList", leavesList);
	console.log("打印tree", tree);
	console.log("打印rootHash", rootHash);
	console.log("打印第0个默克尔证明", proof);
}
function verifyUserInWhitelist() {
	const verifyData = {
		address:
			"0x7aa2B38737F958d9F7f47C27aD0807d61e66f7fb",
		amount: 10,
	};
	const leaf = keccak256(
		`${verifyData.address}${verifyData.amount}`,
	);
}
