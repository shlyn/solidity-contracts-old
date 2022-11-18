import { expect } from "chai";
import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("XenAssistant Contract", function () {
    // Contracts are deployed using the first signer/account by default
    async function deployContract() {
        // XENCrypto
        const [deployer, user1] = await ethers.getSigners();
        const Math = await ethers.getContractFactory("contracts/open/XEN-crypto/Math.sol:Math");
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

        const XenAssistant = await ethers.getContractFactory("XenAssistant");

        const xenAssistant = await XenAssistant.deploy(xenCryptoMiniProxy.address);
        await xenAssistant.deployed()

        return { xenAssistant, xenCrypto, xenCryptoMiniProxy, deployer, user1 };
    }

    describe("deployer valid", function () {
        it("铸造", async function () {
            const { xenAssistant, user1 }  = await deployContract()
            await xenAssistant.connect(user1).batchMint(50,1)

            const countRank = await xenAssistant.countClaimRank(user1.address)
            expect(countRank).to.equal(50);
        })
    })
});
