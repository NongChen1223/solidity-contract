import Web3 from "web3";
import { abi } from "../artifacts/contracts/tokens/T1.sol/T1.json";

// 设置Web3提供者
const web3 = new Web3(process.env.WEB3_RPC); // 替换为你的以太坊节点地址

// 已部署合约的地址
const contractAddress = process.env.CONTRACT_ADDRESS; // 替换为你的合约地址

// 获取合约实例
const contract = new web3.eth.Contract(abi, contractAddress);

//查询地址
const address = process.env.WALLET_ADDRESS;
async function testMain(){
    // const accounts = await web3.eth.getAccounts();
    // const owner = accounts[0];
    // const addr1 = accounts[1] ?? "";
    // const addr2 = accounts[2] ?? "";
    // console.log("打印合约",contract)

    // 测试初始供应量
    const totalSupply = await contract.methods.totalSupply().call();
    if(typeof totalSupply === 'string'){
        console.log('总流通', web3.utils.fromWei(totalSupply, 'ether'));
    }


    // // 测试转账功能
    // await contract.methods.transfer(addr1, web3.utils.toWei('100', 'ether')).send({ from: owner });
    // const addr1Balance = await contract.methods.balanceOf(addr1).call();
    // console.log('地址余额:', web3.utils.fromWei(addr1Balance, 'ether'));

    // // 测试白名单功能
    // let isWhitelisted = await contract.methods.whitelist(owner).call();
    // console.log('地址是否在白名单中:', isWhitelisted);
    //
    // // 添加和移除白名单地址
    // await contract.methods.addToWhitelist(addr1).send({ from: owner });
    // isWhitelisted = await contract.methods.whitelist(addr1).call();
    // console.log('添加白名单成功:', isWhitelisted);
    //
    // await contract.methods.removeFromWhitelist(addr1).send({ from: owner });
    // isWhitelisted = await contract.methods.whitelist(addr1).call();
    // console.log('移除白名单成功:', isWhitelisted);
    //
    // // 铸造和销毁代币
    // await contract.methods.mint(web3.utils.toWei('1000', 'ether')).send({ from: owner });
    // let newTotalSupply = await contract.methods.totalSupply().call();
    // console.log('铸造代币成功:', web3.utils.fromWei(newTotalSupply, 'ether'));
    //
    // await contract.methods.burn(web3.utils.toWei('500', 'ether')).send({ from: owner });
    // newTotalSupply = await contract.methods.totalSupply().call();
    // console.log('销毁代币成功:', web3.utils.fromWei(newTotalSupply, 'ether'));
}

testMain();