import { BigNumber, ethers } from 'ethers'

export const calculateContractAddress = (deployer: string, nonce: number) => {
    return ethers.utils.keccak256(ethers.utils.RLP.encode([deployer, BigNumber.from(nonce).toHexString()])).slice(-40)
}


export const bn2hexStr = (bn: BigNumber) => '0x' + (bn.toString()?.padStart(64, '0') || '0')