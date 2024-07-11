import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import dotenv from "dotenv";
import { createMerkleTreeHexRoot, verifyProof, bufferConcat } from "../tools/merkleTree";
dotenv.config();
type WhitelistEntry = {
	address: string;
	amount: number;
};
// 示例字符串列表
const WHITES_V2 = [
	{ address: "0x7aa2B38737F958d9F7f47C27aD0807d61e66f7fb", amount: 10 },
	{ address: "0x64913142f4528DB3eAdA8A8490a96b7d3bbF1d63", amount: 20 },
	{ address: "0x55f0A57CB98fb58FAc37bdAeCb1cb0E88aB69c27", amount: 30 },
	{ address: "0xBa557Fc8D40A2eCa08ddD9B1F95F625d5A350189", amount: 40 },
	{ address: "0xbe8Da62D6a8Cd7C01236E2bCFe9C7f06A483Dd00", amount: 50 },
	{ address: "0xDF24BDC333d1AD7aDB057DD03627ad663c90CB77", amount: 60 },
];
const proof = [];
async function testMerkleTree(list: WhitelistEntry[]) {
	const { merkleTree, rootHash } = createMerkleTreeHexRoot(list);
	console.log("打印默克尔树");
	console.log(merkleTree.toString());
	console.log("打印根哈希", rootHash);
	//循环测试校验节点
	list.forEach((str, index) => {
		const leaf = keccak256(bufferConcat(str.address, str.amount));
		const proof = merkleTree.getHexProof(leaf);
		const isValid = verifyProof(merkleTree, proof, leaf, rootHash);
		console.log(`打印${str.address}的leaf:`, leaf);
		console.log(`打印${str.address}的proof:`, proof);
		console.log(`验证字符串 "${str.address}" 是否在Merkle树中:`, isValid);
	});
}
// 运行示例
testMerkleTree(WHITES_V2);
