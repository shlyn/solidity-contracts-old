import * as hre from 'hardhat'

// const hre = require('hardhat')
const ethers = hre.ethers
const network = hre.hardhatArguments.network

async function main() {
    if (typeof network == 'undefined' || network == 'hardhat') {
        // local
    } else if (network == 'dashboard') {
        // MiniProxyV4: 0x721D36Eb89A51A90c7Eb5eC8D9c1A612C29c9E8e
        const MiniProxy = await ethers.getContractFactory("xenAttackV4");

        const miniProxy = await MiniProxy.deploy("0x721D36Eb89A51A90c7Eb5eC8D9c1A612C29c9E8e");
        await miniProxy.deployed();

        console.log(`Contract deployed to ${miniProxy.address}`);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});