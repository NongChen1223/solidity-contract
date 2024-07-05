// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Airdrop {
    IERC20 public token;
    bytes32 public merkleRoot;

    // 已经领取的记录
    mapping(address => bool) public hasClaimed;

    constructor(address _token, bytes32 _merkleRoot) {
        token = IERC20(_token);
        merkleRoot = _merkleRoot;
    }

    // 领取代币
    function claim(bytes32[] calldata _merkleProof) external {
        require(!hasClaimed[msg.sender], "Already received the airdrop");

        // 通过ABI编码索引和领取数量构建用于默克尔验证的节点
        // 假设我们在构建树时使用的是（address, amount）
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));

        // 验证默克尔证明是否正确，确保用户数据正确无误且在白名单中
        require(
            MerkleProof.verify(_merkleProof, merkleRoot, leaf),
            "Invalid proof"
        );

        // 解析金额，这通常是树的构建过程中预先设置好的
        uint256 amount = parseAmountFromProof(_merkleProof);

        // 标记为已领取
        hasClaimed[msg.sender] = true;

        // 向用户发送代币
        require(token.transfer(msg.sender, amount), "Airdrop failure");
    }

    // 解析金额的函数（假设实现）
    function parseAmountFromProof(bytes32[] calldata _merkleProof) private pure returns (uint256) {
        // 这里假设我们已经可以从证明中解析出金额，具体实现取决于证明结构
        return 100; // 示例，实际情况下需要实现真正的解析逻辑
    }
}