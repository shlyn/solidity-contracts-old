// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./AbsToken.sol";

/**
 * PancakeSwapRouter
 * mainnet: 0x10ED43C718714eb63d5aA57B78B54704E256024E
 * testnet: 0xD99D1c33F9fC3444f8101754aBC46c52416550D1
 *
 * USDT
 * mainnet: 0x55d398326f99059fF775485246999027B3197955
 * testnet:
 *
 * WBNB
 * mainnet: 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c
 * testnet: 0x094616F0BdFB0b526bD735Bf66Eca0Ad254ca81F
 *
 * Fund account address:
 *
 * Receive account address:
 *
 */

contract Y3 is AbsToken {
    constructor()
        AbsToken(
            // SwapRouter
            address(0x10ED43C718714eb63d5aA57B78B54704E256024E),
            // USDT
            address(0x55d398326f99059fF775485246999027B3197955),
            "Y3",
            "Y3",
            18,
            110000,
            // Fund
            address(0xd7aE2421c60f0A89854D2690A76b7360a26C3C13),
            // Receive
            address(0x8C8848F044b18b23E8debA6509A6048215b53c13)
        )
    {}
}
