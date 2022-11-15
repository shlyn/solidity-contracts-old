import { Contract, providers, Wallet } from 'ethers'

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
const privekey = "89a6d0cfe51223f8c8fddb7a3f5a622b05b1a2648695d3da536b72002641d28b" 
const infura_url = "https://goerli.infura.io/v3/ca59e94e13e84a1d8ca4ccd2ed56d45d"

async function main () {
    const provider = new providers.JsonRpcProvider(infura_url)
    const wallet = new Wallet(privekey, provider)
    const contract = new Contract("0x0B135f74f41556010453bda5758003D1923366A2", xbmABI, provider)
    const res = await contract.connect(wallet).batchMint(50, 100)
    await res.wait()
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});