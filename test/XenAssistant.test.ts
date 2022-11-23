import { expect, assert } from 'chai'
import * as artfacts from "../artifacts/contracts/XenAssistant/XenAssistant.sol/XenAssistant.json"
import { provider, wallet } from '../utils/test'
import { DeployedContractAddress, TestAccounts } from '../config'
import { Contract } from 'ethers'

describe("XenAssistant Contract Test on Goerli Network", function() {
    const otherXenAssistant = "0xF49ef2ceC20e24d989eA410Bc4fA2c3d6c08a2B1"
    let XenAssistant: Contract

    before(function() {
        XenAssistant= new Contract(DeployedContractAddress.goerli.XenAssistant, artfacts.abi, provider)
    })

    describe("Props Check", function() {
        it("Should be 0 when a new EOA", async function() {
            const countRank = await XenAssistant.countClaimRank(TestAccounts[1].Account)
            const countMint = await XenAssistant.countClaimMint(TestAccounts[1].Account)
            expect(countRank.toString()).to.equal("0");
            expect(countMint.toString()).to.equal("0");
        })

        it("Should return correct countClaimRank", async function() {
            const count = await XenAssistant.countClaimRank(wallet.address)
            expect(count.toNumber()).to.equal(1);
        })

        it("Should revered unauthorized", async function() {
            const assistant= new Contract(otherXenAssistant, artfacts.abi, provider)
            expect(await assistant.connect(wallet).batchMint(1, 1)).throw(/.*/)
        })
    })
})