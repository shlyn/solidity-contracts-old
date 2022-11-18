import * as  artifacts from "../artifacts/contracts/XenAssistant/XenAssistant.sol/XenAssistant.json"
import { Contract } from 'ethers'
import { provider, wallet } from './utils'
import { DeployedContractAddress } from '../config'

const abi = artifacts.abi
const contractAddress = DeployedContractAddress.goerli.XenAssistant

async function main() {
  // const code = await provider.getCode(address)
  // const gas = await contract.connect(wallet).estimateGas.claimRank(1)

  const contract = new Contract(contractAddress, abi, provider)

  const res = await contract.connect(wallet).batchMint(2, 1)
  const receipt = await res.wait()
  console.log(receipt)

//   const minInfo = await contract.userMints(wallet.address)
//   console.log(minInfo)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});