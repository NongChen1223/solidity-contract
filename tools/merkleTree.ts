import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { ethers } from "ethers";
import { dataEncode } from "./tool";
type WhitelistEntry = {
	address: string;
	amount: number;
};
/**
 * @description: 使用 keccak256 函数为每个字符串创建默克尔树叶子
 * @param strings[]
 * @return Buffer[]
 * @date 2024/07/09 15:18:52
 */
function createLeaves(strings: WhitelistEntry[]): Buffer[] {
	return strings.map(item => keccak256(bufferConcat(item.address, item.amount)));
}
/**
 * @description: 拼接address和amount的Buffer
 * @param address:string
 * @return amount:string
 * @date 2024/07/09 15:18:52
 */
function bufferConcat(address: string, amount: number): Buffer {
	return Buffer.concat([
		Buffer.from(address.replace("0x", ""), "hex"),
		Buffer.from(dataEncode(amount, "uint256").replace("0x", ""), "hex"),
	]);
}
/**
 * @description: 创建默克尔树的根哈希把 同时把数组中所有的参数必须转换为solidity中对应的类型
 * @param WhitelistEntry[]
 * @return string
 * @date 2024/07/09 15:20:08
 */
function createMerkleTreeHexRoot(list: WhitelistEntry[]): {
	merkleTree: MerkleTree;
	rootHash: string;
} {
	// 创建叶子节点列表
	const leafNodes = createLeaves(list);
	// 创建默克尔树，使用 keccak256 哈希算法和叶节点排序功能
	const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
	// 获取树的根哈希，通常会被存储在智能合约中用于验证
	const rootHash = merkleTree.getHexRoot();
	return { merkleTree, rootHash };
}
/**
 * @description: 校验proof是否存在于某个树中
 * @param tree MerkleTree; 树
 * @param proof any[]; 证明
 * @param targetNode Buffer | string; 叶子节点
 * @param root Buffer | string; 根哈希
 * @return boolean
 * @date 2024/07/09 15:23:09
 */
function verifyProof(
	tree: MerkleTree,
	proof: any[],
	targetNode: Buffer | string,
	root: Buffer | string,
): boolean {
	return tree.verify(proof, targetNode, root);
}
export { createMerkleTreeHexRoot, verifyProof, bufferConcat };
