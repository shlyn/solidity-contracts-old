import { ethers, providers, Wallet } from 'ethers'
import * as dotenv from "dotenv"

dotenv.config()

const privekey = process.env.PRIVEKEY as string
const infura_url = `${process.env.URL_INFURA}/${process.env.API_KEY_INFURA}`

export const provider = new providers.JsonRpcProvider(infura_url)
export const wallet = new Wallet(privekey, provider)

export const getProxyContractAddress = function (deployer: string, bytecodeAddress: string, userAddress: string, index: number) {
  const fun = function (senderAddress: string, salt: string, bytecode: string) {
    return "0x".concat(ethers.utils.keccak256("0x".concat(["ff", senderAddress, salt, ethers.utils.keccak256(bytecode)].map((function (t) {
      return t.replace(/0x/, "")
    }
    )).join(""))).slice(-40)).toLowerCase()
  }
  const bytecode = "0x3d602d80600a3d3981f3363d3d373d3d3d363d73".concat(bytecodeAddress.toLowerCase().replace("0x", ""), "5af43d82803e903d91602b57fd5bf3")
  const salt = ethers.utils.keccak256(ethers.utils.solidityPack(["address", "uint256"], [userAddress, index]))
  const proxy = fun(deployer, salt, bytecode);
  console.log("Proxy Contract Address: ", proxy)
}