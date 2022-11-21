import * as  XenAssistantArtfacts from "../artifacts/contracts/XenAssistant/XenAssistant.sol/XenAssistant.json"
import * as XENCryptoArtfacts from "../artifacts/contracts/open/XEN-crypto/XENCrypto.sol/XENCrypto.json"
import { ethers, Contract } from 'ethers'
import { provider, wallet } from './utils'
import { DeployedContractAddress } from '../config'

const XenAssistantABI = XenAssistantArtfacts.abi
const XENCryptoABI = XENCryptoArtfacts.abi

const XenAssistantAddress = DeployedContractAddress.goerli.XenAssistant

// proxy = keccak256(0xff ++ senderAddress ++ salt ++ keccak256(init_code))[12:]
const getProxyContractAddress = function (deployer: string, bytecodeAddress: string, userAddress: string, index: number) {
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

const batchMint = async (contract: Contract, times: number, term: number) => {
  const res = await contract.connect(wallet).batchMint(times, term)
  const receipt = await res.wait()
  console.log("BatchMint call Status", receipt.status)
}

const batchClaim = async (contract: Contract, times: number) => {
  const res = await contract.connect(wallet).batchClaimWithXenContract(times)
  const receipt = await res.wait()
  console.log("BatchClaim call Status", receipt.status)
}

const batchMintStat = async (contract: Contract, user: string) => {
  const countClaimRank = await contract.countClaimRank(wallet.address)
  console.log("countClaimRank ", countClaimRank.toString())

  const countClaimMint = await contract.countClaimMint(wallet.address)
  console.log("countClaimMint ", countClaimMint.toString())
}

async function main() {
  const xenCrypto = new Contract(DeployedContractAddress.goerli.XENCrypto, XENCryptoABI, provider)
  const minInfo = await xenCrypto.userMints(wallet.address)

  console.log("user address: ", minInfo.user.toString())
  console.log("term: ", minInfo.term.toString())
  console.log("maturityTs: ", minInfo.maturityTs.toString())
  console.log("rank: ", minInfo.rank.toString())
  console.log("amplifier: ", minInfo.amplifier.toString())
  console.log("eaaRate ", minInfo.eaaRate.toString())

  const xenAmounts = await xenCrypto.balanceOf(wallet.address)
  console.log("xenAmounts: ", xenAmounts.toString())

  // 0x06f726e344773c2fA3c141ACFAef711B688f4246, 0x0B8aadD028fdDE2D96078F551A5c08AF4CAe475E
  await getProxyContractAddress(XenAssistantAddress, "0x32A42a40504569A5B94a740Aeaa87d4B54dab895", wallet.address, 1)
  await getProxyContractAddress(XenAssistantAddress, "0x32A42a40504569A5B94a740Aeaa87d4B54dab895", wallet.address, 2)
  await getProxyContractAddress(XenAssistantAddress, "0x32A42a40504569A5B94a740Aeaa87d4B54dab895", wallet.address, 3)

  const XenAssistant = new Contract(XenAssistantAddress, XenAssistantABI, provider)
  await batchMintStat(XenAssistant, wallet.address)

  await batchMint(XenAssistant, 10, 1)

  await batchMintStat(XenAssistant, wallet.address)

  // await batchClaim(XenAssistant, 1)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});