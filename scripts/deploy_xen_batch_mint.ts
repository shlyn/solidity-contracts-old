import * as hre from 'hardhat'

// const hre = require('hardhat')
const ethers = hre.ethers
const network = hre.hardhatArguments.network

async function main() {
    if (typeof network == 'undefined' || network == 'hardhat') {
        // local
    } else if (network == 'dashboard') {
        const Contract = await ethers.getContractFactory("XenBatchMint");

        const contract = await Contract.deploy("");
        await contract.deployed();

        console.log(`Contract deployed to ${contract.address}`);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});