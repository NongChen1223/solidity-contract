// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IExtendedERC20.sol";
import "../libs/MerkleProof.sol";//导入MerkleProof证明函数

contract T1Airdrop is  UUPSUpgradeable, OwnableUpgradeable  {
    using MerkleProof for bytes32[]; //这个语法用于声明并导入库函数，以便在合约中方便地调用库中的函数
    IExtendedERC20 public token; // 代币合约实例
    bytes32 public merkleRoot;//根哈希

    // 记录领取状态的mapping
    mapping(address => bool) public hasClaimed;

    //成功响应
    event ClaimSuccess(address account);

    // 初始化函数，替代构造函数
    function initialize(IExtendedERC20 _token, bytes32 _merkleRoot) public initializer{
        token = _token;
        merkleRoot = _merkleRoot;
    }

    // 授权升级合约
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function claim(address account, uint256 amount, bytes32[] calldata proof) external {
        require(!hasClaimed[account], "Airdrop: Tokens already claimed"); // 检查是否已领取

        bytes32 node = keccak256(abi.encodePacked(account,amount));

        // 验证默克尔证明是否正确，确保数据未被篡改，且确实在白名单中
        require(MerkleProof.verify(proof,merkleRoot, node), "Invalid proof!!");

        // 发放空投代币
        require(token.transfer(account, amount), "Token transfer failed");

        // 标记为已领取
        hasClaimed[account] = true;

        // 校验成功 存在白名单
        emit ClaimSuccess(account);
    }
    // 获取合约的代币余额
    function getBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
