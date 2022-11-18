import { Contract, providers, Wallet } from 'ethers'
import * as dotenv from "dotenv"

dotenv.config()

const xbmABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_miniProxy",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "times",
        "type": "uint256"
      }
    ],
    "name": "batchClaimWithXenContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "times",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "term",
        "type": "uint256"
      }
    ],
    "name": "batchMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "countClaimMint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "countClaimRank",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "i",
        "type": "uint256"
      }
    ],
    "name": "proxyFor",
    "outputs": [
      {
        "internalType": "address",
        "name": "proxy",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

const privekey = process.env.PRIVEKEY as string
const infura_url = `${process.env.URL_INFURA}/${process.env.API_KEY_INFURA}`
const xbmAddress = "0x0B135f74f41556010453bda5758003D1923366A2"

async function main() {
  const provider = new providers.JsonRpcProvider(infura_url)
  const wallet = new Wallet(privekey, provider)
  const contract = new Contract(xbmAddress, xbmABI, provider)
  const res = await contract.connect(wallet).batchMint(2, 1)
  await res.wait()
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});