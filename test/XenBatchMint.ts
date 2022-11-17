import { expect } from "chai";
import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("XenBatchMint", function () {
    // Contracts are deployed using the first signer/account by default
    async function deployContract() {
        const [deployer, user] = await ethers.getSigners();
        // XENCrypto
        const Math = await ethers.getContractFactory("@openzeppelin/contracts/utils/math/Math.sol:Math");
        const math = await Math.deploy()
        await math.deployed()

        const XENCrypto= await ethers.getContractFactory("XENCrypto", {
            libraries: {
                Math: math.address
            }
        });
        const xenCrypto = await XENCrypto.deploy()
        await xenCrypto.deployed()

        // XENCryptoMiniProxy
        const XENCryptoMiniProxy = await ethers.getContractFactory("XENCryptoMiniProxy");
        const xenCryptoMiniProxy = await XENCryptoMiniProxy.deploy(xenCrypto.address)
        await xenCryptoMiniProxy.deployed()

        const XenBatchMint = await ethers.getContractFactory("XenBatchMint");

        const xenBatchMint = await XenBatchMint.deploy(xenCryptoMiniProxy.address);

        return { xenBatchMint, deployer, user };
    }

    describe("deployer valid", function () {
        it("deployer validate", async function () {
            const { xenBatchMint, deployer } = await deployContract()
            console.log(deployer.address)
            // expect().to.equal()
        })
    })
});
