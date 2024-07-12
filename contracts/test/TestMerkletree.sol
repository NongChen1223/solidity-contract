// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../libs/MerkleProof.sol"; // 导入 MerkleProof 证明函数
contract TestMerkletree is Initializable {
    using MerkleProof for bytes32[];
    bytes32 public merkleRoot;

    // 初始化函数，替代构造函数
    function initialize(bytes32 _merkleRoot) public initializer{
        merkleRoot = _merkleRoot;
    }
    event ClaimSuccess(address account);

    function isWhite(address account, bytes32[] calldata proof) external {
        // 构建用于默克尔验证的节点
        bytes32 node = keccak256(abi.encodePacked(account));

        // 验证默克尔证明是否正确，确保数据未被篡改，且确实在白名单中
        require(MerkleProof.verify(proof,merkleRoot, node), "Invalid proof.");

        // 校验成功 存在白名单
        emit ClaimSuccess(account);
    }
}
