# solidity-contract
Individuals issue test symbol

# .env
.env文件中的PRIVATE_KEY 放置你要发布的钱包地址的私钥

## 构建项目
```
 pnpm add -D hardhat
 pnpm hardhat init
```
## 发布流程
```
npx hardhat compile 编译contracts下的sol
npx hardhat run scripts/t1.deploy.ts --network bscTestnet 发布对应的代币
```
