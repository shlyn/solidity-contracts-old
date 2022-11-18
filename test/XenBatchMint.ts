import { expect } from "chai";
import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("XenBatchMint Contract", function () {
    // Contracts are deployed using the first signer/account by default
    async function deployContract() {
        const [deployer, user1] = await ethers.getSigners();
        // XENCrypto
        const Math = await ethers.getContractFactory("@openzeppelin/contracts/utils/math/Math.sol:Math");
        const math = await Math.deploy()
        await math.deployed()

        const XENCrypto = await ethers.getContractFactory("XENCrypto", {
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

        const xBM = await XenBatchMint.deploy(xenCryptoMiniProxy.address);
        await xBM.deployed()

        return { xBM, xenCrypto, xenCryptoMiniProxy, deployer, user1 };
    }

    describe("deployer valid", function () {
        it("铸造", async function () {
            const { xBM, user1 }  = await deployContract()
            // await xBM.connect(user1).batchMint(1,1)
            xBM.connect(user1).batchMint(1,1)
            // console.log(await xenCrypto.userMints(user1.address))
            // console.log(await xenCrypto.userMints(user2.address))
            // const { xBM, xenCrypto, user } = await deployContract();
            // await xBM.connect(user).batchMint(1, 1)
            // console.log(await xenCrypto.userMints(user.address))
            // expect(await xenBatchMint.getThis()).to.equal(xenBatchMint.address);
        })
    })
});
