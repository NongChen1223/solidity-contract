# solidity-contract
主要用于学习hardhat发布solidity的合约以及各类基本合约，仅供学习参考！！！
# example.env

```
PRIVATE_KEY="你的地址私钥"
WALLET_ADDRESS="钱包地址"
TOKEN_CONTRACT_ADDRESS_BSC="对应hardhat不同链发布成功的代币合约地址"
TOKEN_CONTRACT_ADDRESS_OPBNB="对应hardhat不同链发布成功的代币合约地址"
AIR_CONTRACT_ADDRESS_OPBNB="对应hardhat不同链发布成功的空投合约地址"
HASH_ROOT="空投合约生成的对应根哈希"
```

## 构建项目
```
 pnpm add -D hardhat
 pnpm hardhat init
```
## 发布流程
```
npx hardhat compile 每次发布要先构建合约
npx hardhat run scripts/xx.deploy.ts --network bscTestnet 允许对应的发布合约 --network 根据hardhat.config.ts配置的对应网络 例如(bscTestnet)
```
