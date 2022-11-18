import * as hre from "hardhat"
import { DeployContract, ethers, network } from "./deploy"
import { DeployedContractAddress } from "../config"

const deploy_XENCryptoMiniProxy = async () => {
    if (network != "dashboard") {
        throw "Error: Check the network set."
    }
    const XENCrypto = process.env.MAINNET_OR_TEST == "TEST" ?
            DeployedContractAddress.goerli.XENCrypto :
            DeployedContractAddress.mainnet.XENCrypto
    
    const XENCryptoMiniProxy = await ethers.getContractFactory("XENCryptoMiniProxy")
    const xenCryptoMiniProxy = await XENCryptoMiniProxy.deploy(XENCrypto)
    await xenCryptoMiniProxy.deployed()
    console.log(xenCryptoMiniProxy.address)
    return xenCryptoMiniProxy.address
}

const _XENCryptoMiniProxy = "0x32A42a40504569A5B94a740Aeaa87d4B54dab895"

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
    // await deploy_XENCryptoMiniProxy()
    // await deploy_XenAssistant() // 0xAe88a614733Db391CaA8DB63e10c853a2A6c46F2
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});