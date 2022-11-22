import * as hre from "hardhat"
import { DeployContract, ethers, network } from "./deploy"
import { DeployedContractAddress } from "../config"

const deploy_XENCryptoMiniProxy = async () => {
    const XENCryptoMiniProxy = await ethers.getContractFactory("XENCryptoMiniProxy")
    const xenCryptoMiniProxy = await XENCryptoMiniProxy.deploy()
    await xenCryptoMiniProxy.deployed()
    console.log(xenCryptoMiniProxy.address)
}

const _XENCryptoMiniProxy = "0xD848e91b6DB75E4C27Ae127Ac69d6082c7d3D3F8"

const deploy_XenAssistant = async () => {
    if (network != "dashboard") {
        throw "Error: Check the network set."
    }
    
    const XenBatchMint = await ethers.getContractFactory("XenAssistant")
    const xenBatchMint = await XenBatchMint.deploy(_XENCryptoMiniProxy)
    await xenBatchMint.deployed()

    console.log(`XenBatchMint be deployed to ${xenBatchMint.address}`);
}

async function main() {
    // await deploy_XENCryptoMiniProxy() // 0xD848e91b6DB75E4C27Ae127Ac69d6082c7d3D3F8
    await deploy_XenAssistant() // v1: 0xAe88a614733Db391CaA8DB63e10c853a2A6c46F2
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});