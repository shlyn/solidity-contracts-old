import * as hre from "hardhat"
import { DeployContract, ethers, network } from "./deploy"
import { DeployedContractAddress } from "../config"

const deploy_XENCryptoMiniProxy = async () => {
    if (network != "dashboard") {
        throw "Error: Check the network set."
    }
    const XENCrypto = process.env.MAINNET_OR_TEST == "TEST" ?
            DeployedContractAddress.goerli.XENCrypto:
            DeployedContractAddress.mainnet.XENCrypto
    
    const XENCryptoMiniProxy = await ethers.getContractFactory("XENCryptoMiniProxy")
    const xenCryptoMiniProxy = await XENCryptoMiniProxy.deploy(XENCrypto)
    await xenCryptoMiniProxy.deployed()
    console.log(xenCryptoMiniProxy.address)
    return xenCryptoMiniProxy.address
}

const _XENCryptoMiniProxy = "0x53c0D55fF498436d6c1b5C281678483E0EB26495"

const deploy_XenBatchMint = async () => {
    if (network != "dashboard") {
        throw "Error: Check the network set."
    }
    
    const XenBatchMint = await ethers.getContractFactory("XenBatchMint")
    const xenBatchMint = await XenBatchMint.deploy(_XENCryptoMiniProxy)
    await xenBatchMint.deployed()

    console.log(`XenBatchMint be deployed to ${xenBatchMint.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
async function main() {
    // await deploy_XENCryptoMiniProxy() // 0x53c0D55fF498436d6c1b5C281678483E0EB26495
    // await deploy_XenBatchMint() // 0x41e358454D99DE351Bdf0D57bF91A62c4bd79803
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});