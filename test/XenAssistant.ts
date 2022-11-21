import { expect } from "chai";
import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";

const getProxyContractAddress = function (deployer: string, bytecodeAddress: string, userAddress: string, index: number) {
  const fun = function (senderAddress: string, salt: string, bytecode: string) {
    return "0x".concat(ethers.utils.keccak256("0x".concat(["ff", senderAddress, salt, ethers.utils.keccak256(bytecode)].map((function (t) {
      return t.replace(/0x/, "")
    }
    )).join(""))).slice(-40)).toLowerCase()
  }
  const bytecode = "0x3d602d80600a3d3981f3363d3d373d3d3d363d73".concat(bytecodeAddress.toLowerCase().replace("0x", ""), "5af43d82803e903d91602b57fd5bf3")
  const salt = ethers.utils.keccak256(ethers.utils.solidityPack(["address", "uint256"], [userAddress, index]))
  const proxy = fun(deployer, salt, bytecode);
  console.log("Proxy Contract Address: ", proxy)
}

describe("XenAssistant Contract", function () {
    let mathLibrary = ""

    before(async function() {})

    beforeEach(async function name() {
        const Math = await ethers.getContractFactory("contracts/open/XEN-crypto/Math.sol:Math");
        const math = await Math.deploy()
        mathLibrary = math.address
    })

    // Contracts are deployed using the first signer/account by default
    async function deployContract() {
        const [deployer, user1] = await ethers.getSigners();
        console.log("deployer.address => ", deployer.address)
        console.log("user1.address => ", user1.address)

        // XENCrypto
        const XENCrypto = await ethers.getContractFactory("XENCrypto", {
            libraries: {
                Math: mathLibrary
            }
        });
        const xenCrypto = await XENCrypto.deploy()
        console.log("xenCrypto => ", xenCrypto.address)

        // XENCryptoMiniProxy
        const XENCryptoMiniProxy = await ethers.getContractFactory("XENCryptoMiniProxy");
        const xenCryptoMiniProxy = await XENCryptoMiniProxy.deploy(xenCrypto.address)
        console.log("xenCryptoMiniProxy => ", xenCryptoMiniProxy.address)

        const XenAssistant = await ethers.getContractFactory("XenAssistant");
        const xenAssistant = await XenAssistant.deploy(xenCryptoMiniProxy.address);
        console.log("xenAssistant => ", xenAssistant.address)

        return { xenAssistant, xenCrypto, xenCryptoMiniProxy, deployer, user1 };
    }

    describe("ClaimRank: ", function () {
        it("batchMint 0 times with 1 day", async function () {
            const { xenAssistant, user1 }  = await loadFixture(deployContract)
            // expect(await xenAssistant.connect(user1).batchMint(0,1)).to.reverted("Error: Illegal times")
        })

        it("batchMint 1 times with 1 day", async function () {
            const { xenAssistant, user1, xenCryptoMiniProxy }  = await loadFixture(deployContract)
            await xenAssistant.connect(user1).batchMint(1,1)
            await getProxyContractAddress(xenAssistant.address, xenCryptoMiniProxy.address, user1.address, 1)
            const countRank = await xenAssistant.countClaimRank(user1.address)
            expect(countRank).to.equal(1);
        })
    })
});
