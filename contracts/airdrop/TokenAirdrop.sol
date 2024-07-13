// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenAirdrop is Initializable,UUPSUpgradeable, OwnableUpgradeable  {
    using MerkleProof for bytes32[];
    IERC20 public token;
    bytes32 public merkleRoot;//根哈希

    // 记录领取状态的mapping
    mapping(address => bool) public hasClaimed;

    event ClaimSuccess(address account);

    function initialize(address owner) public initializer {
        __UUPSUpgradeable_init();
        __Ownable_init(owner);
    }

    function setTokenAndRoot(address tokenAddress, bytes32 _merkleRoot) public onlyOwner{
        token = IERC20(tokenAddress);
        merkleRoot = _merkleRoot;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function claim(address account, uint256 amount, bytes32[] calldata proof) external {
        require(!hasClaimed[account], "Airdrop: Tokens already claimed"); // 检查是否已领取

        bytes32 node = keccak256(abi.encodePacked(account,amount));

        // 验证默克尔证明是否正确
        require(MerkleProof.verify(proof,merkleRoot, node), "Invalid proof!!");

        // 发放空投代币
        require(token.transfer(account, amount), "Token transfer failed");

        // 标记为已领取
        hasClaimed[account] = true;

        emit ClaimSuccess(account);
    }
    function getBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
