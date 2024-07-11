// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

library StringUtils {
    // 将 address 和 uint256 拼接，并返回 bytes32 类型的哈希值
    function concatenateAndHash(address account, uint256 amount) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(toAsciiString(account), "|", uintToString(amount)));
    }

    // 将 address 转换为字符串
    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(42);
        s[0] = '0';
        s[1] = 'x';
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2 ** (8 * (19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2 + 2 * i] = char(hi);
            s[3 + 2 * i] = char(lo);
        }
        return string(s);
    }

    // 将十六进制字符转换为 ASCII 字符
    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    // 将 uint256 转换为字符串
    function uintToString(uint v) internal pure returns (string memory str) {
        uint maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint i = 0;
        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = bytes1(uint8(48 + remainder));
        }
        bytes memory s = new bytes(i);
        for (uint j = 0; j < i; j++) {
            s[j] = reversed[i - 1 - j];
        }
        str = string(s);
    }
}
