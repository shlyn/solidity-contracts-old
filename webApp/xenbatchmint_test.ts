import { Contract, providers, Wallet } from 'ethers'

const xbmABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "xenCrypto_",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "bulkClaimMintReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "count",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "term",
          "type": "uint256"
        }
      ],
      "name": "bulkClaimRank",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "callClaimMintReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "term",
          "type": "uint256"
        }
      ],
      "name": "callClaimRank",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "powerDown",
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
      "name": "vmuCount",
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
      "inputs": [],
      "name": "xenCrypto",
      "outputs": [
        {
          "internalType": "contract XENCrypto",
          "name": "",
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
    const contract = new Contract("0xc6374999ceadee71c598dbf22d8cbbcf4fe03f5e", xbmABI, provider)
    const res = await contract.connect(wallet).bulkClaimRank(50, 100)
    await res.wait()
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});