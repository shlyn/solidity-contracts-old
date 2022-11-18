import { expect } from "chai";
import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("XENCrypto Contract", function () {
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
        return { xenCrypto, deployer, user1 };
    }

    it("stat check", async function () {
        const { xenCrypto, deployer, user1 } = await loadFixture(deployContract)
        const res = await xenCrypto.connect(user1).claimRank(1)
        await res.wait()
        // expect(await xenBatchMint.getThis()).to.equal(xenBatchMint.address);
    })

    it("claimRank", async function () {
        // const { xenCrypto, deployer, user1 } = await deployContract()
        // const mintInfos = await xenCrypto.userMints(user1.address)
        // console.log(mintInfos)
        // expect(await xenBatchMint.getThis()).to.equal(xenBatchMint.address);
    })
});
