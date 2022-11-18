// @ts-nocheck
import * as  artifacts from "../artifacts/contracts/XenBatchMint/XenBatchMint.sol/XenBatchMint.json"

import { Contract, providers, Wallet } from 'ethers'
import * as dotenv from "dotenv"

dotenv.config()

const privekey = process.env.PRIVEKEY as string
const infura_url = `${process.env.URL_INFURA}/${process.env.API_KEY_INFURA}`

const xbmAddress = "0x41e358454D99DE351Bdf0D57bF91A62c4bd79803"

const abi = artifacts.abi

async function main() {
    const provider = new providers.JsonRpcProvider(infura_url)
    const wallet = new Wallet(privekey, provider)
    const contract = new Contract(xbmAddress, abi, provider)
    const res = await contract.connect(wallet).batchMint(2, 1)
    await res.wait()
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});