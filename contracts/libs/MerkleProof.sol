// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
/*
  library 特点 作为工具类库是一种特殊的合约，它的代码可以被其他合约复用。与普通合约不同，库不能有状态变量，也不能接收以太币。库中的函数可以被多个合约调用，从而实现代码复用和减少重复代码
  1.无状态：库不能有状态变量，这意味着库函数不依赖于存储在合约中的数据
  2.无以太币接收：库不能接收以太币，因此不能有 payable 函数。
  3.共享代码：库函数可以在多个合约中共享使用，从而减少重复代码和节省 gas 费用
  4.using for 语法：可以使用 using for 语法将库函数附加到某种类型上，使得该类型的变量可以直接调用库函数。
*/
library MerkleProof {
    function verify(
        bytes32[] calldata proof,
        bytes32 root,
        bytes32 leaf
    ) internal pure returns (bool) {
        bytes32 computedHash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (computedHash <= proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }

        return computedHash == root;
    }
}
