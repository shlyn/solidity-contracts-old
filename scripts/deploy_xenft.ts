import * as hre from 'hardhat'
// const hre = require('hardhat')
const ethers = hre.ethers
const network = hre.hardhatArguments.network

async function main() {
    if (typeof network == 'undefined' || network == 'hardhat') {
        // deploy Math library
        const MathContract = await ethers.getContractFactory("Math")
        const mathContract = await MathContract.deploy()
        await mathContract.deployed()
        // deploy  xen
        const XEN = await ethers.getContractFactory("XENCrypto", {
            libraries: {
                Math: mathContract.address
            }
        })
        const xenContract = await XEN.deploy()
        await xenContract.deployed()

        // deploy DateTime contract
        const DTContract = await ethers.getContractFactory("DateTime")
        const dtContract = await DTContract.deploy()
        await dtContract.deployed()

        // deploy Quotes contract
        const Quotes = await ethers.getContractFactory("DateTime")
        const quotesContract = await Quotes.deploy()
        await quotesContract.deployed()

        const XENFTContract = await ethers.getContractFactory("XENFT", {
            libraries: {
                DateTime: dtContract.address,
                Quotes: quotesContract.address
            }
        })

        const xenft = await XENFTContract.deploy(xenContract.address)
        await xenft.deployed()
        console.log(`Contract deployed to ${xenft.address}`);
    } else if (network == 'dashboard') {
        const XENFT = await ethers.getContractFactory("XENFT", {
            libraries: {
                DateTime: "0x8e12A8e323fb7C70BfEEE905f72e3741fA8D6F58",
                Quotes: "0x9db9f78fFe9F83d70B577d6079B1Cc8b26bc6bC0"
            }
        });

        const xenft = await XENFT.deploy(process.env.CONTRACT_XEN_TOKEN_ADDRESS);
        await xenft.deployed();

        console.log(`Contract deployed to ${xenft.address}`);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});