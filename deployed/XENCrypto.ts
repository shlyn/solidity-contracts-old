// @ts-nocheck
import * as  artifacts from "../artifacts/@faircrypto/xen-crypto/contracts/XENCrypto.sol/XENCrypto.json"
import { Contract } from 'ethers'
import { provider, wallet } from './utils'
import { DeployedContractAddress } from '../config'

const abi = artifacts.abi
const address = DeployedContractAddress.goerli.XENCrypto

async function main() {
    const contract = new Contract(address, abi, provider)
    // const res = await contract.connect(wallet).claimRank(1, {
    //     gasLimit: 200000
    // })

    const gas = await contract.connect(wallet).estimateGas.claimRank(1, {
        gasLimit: 200000
    })
    console.log(gas)

    // const res = await contract.connect(wallet).claimRank(1)
    // const receipt = await res.wait()
    // console.log(receipt)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});