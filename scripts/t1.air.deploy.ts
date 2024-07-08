import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import dotenv from "dotenv";
dotenv.config();

type WhitelistEntry = {
	address: string;
	amount: number;
};
// 示例字符串列表
const strings = ["string1", "string2", "string3"];

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
const WHITES = [
	"0x7aa2B38737F958d9F7f47C27aD0807d61e66f7fb",
	"0x6C8116a07dF82ADF5888093A58Ab2aa1a0956Eac",
	"0x64913142f4528DB3eAdA8A8490a96b7d3bbF1d63",
];

//使用 keccak256 哈希函数为每个白名单条目创建默克尔树叶子
function createLeavesList(list: string[]): Buffer[] {
	const leaves = list.map(item => keccak256(item));
	return leaves;
}
async function createrMerkleTreeNode() {
	const leavesNodes = createLeavesList(WHITES);
	//创建默克尔树，使用 keccak256 哈希算法和叶节点排序功能
	const merkletree = new MerkleTree(leavesNodes, keccak256, { sortPairs: true });
	// 获取树的根哈希，通常会被存储在智能合约中用于验证
	const rootHash = merkletree.getHexRoot();
	// 打印Merkle树结构
	console.log("Merkle Tree:");
	console.log(merkletree.toString());
	console.log("打印树的根哈希rootHash", rootHash);
	WHITE_LIST.forEach((item, index) => {
		const leaf = keccak256(item.address);
		const proof = merkletree.getHexProof(leaf);
		const isValid = MerkleTree.verify(proof, leaf, rootHash);
		console.log(`校验proof${index + 1}是否在MerkleTree中:${isValid}`);
	});
}

// 使用 keccak256 哈希函数为每个字符串创建默克尔树叶子
function createLeaves(strings: string[]): Buffer[] {
	return strings.map(str => keccak256(str));
}

async function createMerkleTreeAndVerify(list: string[]) {
	// 创建叶子节点列表
	const leaves = createLeaves(list);
	console.log("校验参数", list);
	// 创建默克尔树，使用 keccak256 哈希算法和叶节点排序功能
	const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

	// 获取树的根哈希，通常会被存储在智能合约中用于验证
	const rootHash = merkleTree.getHexRoot();
	console.log("Merkle Root:", rootHash);

	// 打印Merkle树结构
	console.log("Merkle Tree:");
	console.log(merkleTree.toString());

	// 为每个字符串生成证明并进行验证
	list.forEach((str, index) => {
		const leaf = keccak256(str);
		const proof = merkleTree.getHexProof(leaf);
		const isValid = merkleTree.verify(proof, leaf, rootHash);
		console.log("proof", proof);
		console.log(`验证字符串 "${str}" 是否在Merkle树中:`, isValid);
	});
}

// 运行示例
createMerkleTreeAndVerify(WHITES);
// createrMerkleTreeNode();
