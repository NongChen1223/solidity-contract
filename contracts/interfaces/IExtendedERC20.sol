// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./IERC20.sol";
/*
  继承IERC20
*/
interface IExtendedERC20 is IERC20 {
    function mint(uint256 amount) external returns (bool); //铸造代币
    function burn(uint256 amount) external returns (bool); //销毁代币
    function addToWhitelist(address account) external; //拥有者添加白名单
    function removeFromWhitelist(address account) external; //移除白名单
}
