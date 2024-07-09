// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./T1.sol";

/*
    更改旧合约的方式
    最好不要改动原有合约，而是通过继承的方式在新合约上进行改动。
    1.保持存储布局的一致性：通过继承旧合约并在新合约中添加新功能，可以确保存储变量的顺序和位置保持一致，避免存储错乱。
    2.确保兼容性：继承旧合约可以确保新合约与旧合约的接口兼容，现有的系统和用户可以继续与新合约交互而不需要任何更改。
    3.清晰的版本管理：每次升级都创建一个新的合约版本，可以清晰地追踪合约的演变过程，便于审计和维护。
    4.安全性：减少对原有合约的修改，降低引入新漏洞的风险
*/
contract T1_V2 is T1 {
    // address[] private whitelistAddresses; 在原合约已经使用internal进行声明后则不需要在升级合约中再次声明，直接调用

    function initV2() public{
        require(msg.sender == owner, "Not the contract owner");
        // 确保初始化代码仅运行一次
        require(whitelistCount == 0, "Already initialized");
        whitelistCount = 1;
        whitelistAddresses.push(owner);
    }

    // 新的方法：返回白名单地址的数量
    function getWhitelistCount() public view onlyWhitelisted returns (uint256) {
        return whitelistCount;
    }

    // 新的方法：返回所有白名单地址
    function getWhitelistAddresses() public view onlyWhitelisted returns (address[] memory) {
        return whitelistAddresses;
    }

    // 重写添加和移除白名单的方法，更新计数器和地址列表
    function addToWhitelist(address addr) public override onlyOwner {
        if (!whitelist[addr]) {
            whitelist[addr] = true;
            whitelistAddresses.push(addr);
            whitelistCount += 1;
        }
    }

    //移除白名单方法，更新计数器和地址列表
    function removeFromWhitelist(address addr) public override onlyOwner {
        if (whitelist[addr]) {
            whitelist[addr] = false;
            whitelistCount -= 1;

            for (uint256 i = 0; i < whitelistAddresses.length; i++) {
                if (whitelistAddresses[i] == addr) {
                    whitelistAddresses[i] = whitelistAddresses[whitelistAddresses.length - 1];
                    whitelistAddresses.pop();
                    break;
                }
            }
        }
    }
}
