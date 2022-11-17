import * as hre from "hardhat"
import { DeployContract } from "./deploy"
import { DeployedContractAddress } from "../config"

const ethers = hre.ethers
const network = hre.hardhatArguments.network

const deploy_XENCrypto = async () => {
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

const deploy_XENFT = async () => {
    let DateTime = ""
    let Quotes = ""
    let XENCrypto = ""

    if (network == "dashboard") {
        DateTime = DeployedContractAddress.goerli.DateTime
        Quotes = DeployedContractAddress.goerli.Quotes
        XENCrypto = DeployedContractAddress.goerli.XENCrypto

        if (process.env.MAINNET_OR_TEST == "MAINNET") {
            DateTime = DeployedContractAddress.mainnet.DateTime
            Quotes = DeployedContractAddress.mainnet.Quotes
            XENCrypto = DeployedContractAddress.mainnet.XENCrypto
        }
    } else {
        DateTime = await DeployContract("DateTime")
        Quotes = await DeployContract("Quotes")
        XENCrypto = await deploy_XENCrypto()
    }

    const Contract = await ethers.getContractFactory("XENFT", {
        libraries: {
            DateTime,
            Quotes
        }
    })

    const contract = await Contract.deploy(XENCrypto)
    await contract.deployed()
    console.log(`XENFT be deployed to ${contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
async function main() {
    DeployContract("Math")
    // await deploy_XENCrypto()
    // await deploy_XENFT()
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});