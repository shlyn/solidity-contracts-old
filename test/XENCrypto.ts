import { expect } from "chai";
import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { BigNumber } from "ethers";

describe("XENCrypto Contract Test:", function () {
    // XENCrypto deploy
    async function deployContract() {
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
        return { xenCrypto, deployer, user1 };
    }

    describe("XENCrypto Contract Data Check", function () {
        it("contract data", async function () {
            const { xenCrypto, user1 } = await loadFixture(deployContract)
            const res = await xenCrypto.connect(user1).claimRank(10)
            await res.wait()

            const mintInfos = await xenCrypto.userMints(user1.address)
            expect(mintInfos.term).to.equal(10);
        })
    })

    describe("user data", function () {
        it("开始用户的余额应该为0", async function () {
            const { xenCrypto, user1 } = await loadFixture(deployContract)
            const user1Balance = await xenCrypto.balanceOf(user1.address) 
            expect(user1Balance.toString()).to.equal(BigNumber.from(0).toString())
        })

        it("stat check", async function () {
            const { xenCrypto, deployer, user1 } = await loadFixture(deployContract)
            // await xenCrypto.connect(user1).claimMintReward()
        })
    })
});
