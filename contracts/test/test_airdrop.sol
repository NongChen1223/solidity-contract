// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IERC20.sol";
import "../libs/MerkleProof.sol"; // 导入 MerkleProof 证明函数

contract t1_airdrop {
    using MerkleProof for bytes32[]; // 这个语法用于声明并导入库函数，以便在合约中方便地调用库中的函数

    IERC20 public token; // 代币合约实例
    bytes32 public merkleRoot; // 根哈希

    // 记录领取状态的 mapping
    mapping(address => bool) public hasClaimed;

    // 成功响应
    event ClaimSuccess(address account, uint256 amount);

    // 构造函数
    constructor(IERC20 _token, bytes32 _merkleRoot){
        token = _token;
        merkleRoot = _merkleRoot;
    }

    // 校验白名单并发放空投代币
    function claim(address account, uint256 amount, string calldata account_join, bytes32[] calldata proof) external {
        require(!hasClaimed[account], "Airdrop: Tokens already claimed"); // 检查是否已领取

        // 构建用于默克尔验证的节点 由于 Solidity 中没有自己的转字符串方法，改为在外部拼接好后传入内部校验
        bytes32 node = keccak256(abi.encodePacked(account_join));

        // 验证默克尔证明是否正确，确保数据未被篡改，且确实在白名单中
        require(MerkleProof.verify(proof,merkleRoot, node), "Invalid proof.");

        // 发放空投代币
        require(token.transfer(account, amount), "Token transfer failed");

        // 标记为已领取
        hasClaimed[account] = true;

        // 校验成功，存在白名单
        emit ClaimSuccess(account, amount);
    }

    // 获取合约的代币余额
    function getBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
