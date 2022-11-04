import * as hre from 'hardhat'

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
        console.log(`Contract deployed to ${xenContract.address}`);
    } else if (network == "dashboard") {
        let mathLibrary = process.env.CONTRACT_MATH_LIBRARY_ADDRESS
        if (!mathLibrary) {
            // deploy Math library
            const MathContract = await ethers.getContractFactory("Math")
            const mathContract = await MathContract.deploy()
            await mathContract.deployed()
            mathLibrary = mathContract.address
        }

        // deploy  xen
        const XEN = await ethers.getContractFactory("XENCrypto", {
            libraries: {
                Math: mathLibrary
            }
        })

        const xenContract = await XEN.deploy()
        await xenContract.deployed()

        console.log(`Contract deployed to ${xenContract.address}`);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});