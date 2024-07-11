import Web3 from "web3";
import dotenv from "dotenv";
dotenv.config();
// 初始化 Web3 实例
const web3 = new Web3(process.env.WEB3_RPC);
/**
 * @description: 数据类型转换为ABI的类型
 * @param param:string | Object 数字类型
 * @param type:string solidity 中的类型 例如 "uint256"
 * @return
 * @date 2024/07/11 17:21:29
 */
function dataEncode(data: string | Object, type: string): string {
	return web3.eth.abi.encodeParameter("uint256", data.toString());
}
export { dataEncode };
