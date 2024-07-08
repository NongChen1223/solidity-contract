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
		address: "0x7aa2B38737F958d9F7f47C27aD0807d61e66f7fb",
		amount: 10,
	},
	{
		address: "0x6C8116a07dF82ADF5888093A58Ab2aa1a0956Eac",
		amount: 20,
	},
	{
		address: "0x64913142f4528DB3eAdA8A8490a96b7d3bbF1d63",
		amount: 30,
	},
];
//使用 keccak256 哈希函数为每个白名单条目创建默克尔树叶子
function createLeavesList(list: WhitelistEntry[]): Buffer[] {
	const leaves = list.map(entry => keccak256(entry.address));
	return leaves;
}
async function createrMerkleTreeNode() {
	const leavesNodes = createLeavesList(WHITE_LIST);
	//创建默克尔树，使用 keccak256 哈希算法和叶节点排序功能
	const merkletree = new MerkleTree(leavesNodes, keccak256, { sortPairs: true });
	// 获取树的根哈希，通常会被存储在智能合约中用于验证
	const rootHash = merkletree.getHexRoot();
	const proofs = leavesNodes.map((leaf, index) => merkletree.getHexProof(leaf));
	console.log("", merkletree.toString());
	console.log("打印树的根哈希rootHash", rootHash);
	proofs.forEach((proof, index) => {
		console.log(`打印第${index + 1}个默克尔证明`, proof);
		console.log(
			`校验proof${index + 1}是否在MerkleTree中`,
			MerkleTree.verify(proof, leavesNodes[index], rootHash, keccak256),
		);
	});
}
createrMerkleTreeNode();
