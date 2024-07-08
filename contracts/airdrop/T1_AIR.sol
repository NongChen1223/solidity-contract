// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
import "./MerkleProof.sol";

contract Airdrop {
    using MerkleProof for bytes32[];

    bytes32 public merkleRoot;

    constructor(bytes32 _merkleRoot) {
        merkleRoot = _merkleRoot;
    }

    event ClaimSuccess(address account);

    function isWhite(address account, bytes32[] calldata proof) external {
        // 构建用于默克尔验证的节点
        bytes32 node = keccak256(abi.encodePacked(account));

        // 验证默克尔证明是否正确，确保数据未被篡改，且确实在白名单中
        require(proof.verify(merkleRoot, node), "Invalid proof.");

        // 校验成功 存在白名单
        emit ClaimSuccess(account);
    }
}
