import { expect } from 'chai'
import * as artfacts from "../artifacts/contracts/XenAssistant/XenAssistant.sol/XENCryptoMiniProxy.json";
import { provider } from '../utils/test'
import { DeployedContractAddress } from '../config'
import { Contract } from 'ethers'

describe("XENCryptoMiniProxy Contract Test on Goerli Network", function() {
    const XENCrypto = "0xDd68332Fe8099c0CF3619cB3Bb0D8159EF1eCc93"
    const XenAssistant = "0xAE272C6Ea3FdB317BCA0e83A9CB169f0d0f1073E"

    describe("Props Check", function() {
        it("Should return correct XENCrypto address", async function() {
            const xenCryptoMiniProxy = new Contract(DeployedContractAddress.goerli.XenCryptoMiniProxy, artfacts.abi, provider)
            const value = await xenCryptoMiniProxy._XENCrypto()
            expect(value).to.equal(XENCrypto);
        })

        it("Should return correct XenAssistant address", async function() {
            const xenCryptoMiniProxy = new Contract(DeployedContractAddress.goerli.XenCryptoMiniProxy, artfacts.abi, provider)
            const value = await xenCryptoMiniProxy._XenAssistant()
            expect(value).to.equal(XenAssistant);
        })

        // it("Should throw a error", async function() {
        //     const xenCryptoMiniProxy = new ethers.Contract(DeployedContractAddress.goerli.XenCryptoMiniProxy, artfacts.abi, provider)
        //     expect(() => xenCryptoMiniProxy._original()).rejected("")
        // })
    })
})