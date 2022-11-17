import * as hre from "hardhat"
import { DeployContract } from "./deploy"
import { DeployedContractAddress } from "../config"

const ethers = hre.ethers
const network = hre.hardhatArguments.network

const deploy_MiniXenBatchMint = async () => {
    let mathLibrary = ""
    if (network == "dashboard") {
        mathLibrary = process.env.MAINNET_OR_TEST == "TEST" ?
            DeployedContractAddress.goerli.Math :
            DeployedContractAddress.mainnet.Math
    } else {
        mathLibrary = await DeployContract("Math")
    }
    const xenCryptoAddress = await DeployContract("XENCrypto", { Math: mathLibrary })
    return xenCryptoAddress
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
async function main() {
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});