// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
// Sources flattened with hardhat v2.12.2 https://hardhat.org

// File contracts/interfaces/FactoryType.sol

interface FactoryType {
    // INTERNAL TYPE TO DESCRIBE EACH BATCH INFO
    struct BatchInfo {
        uint256 batchId;
        uint256 count;
        uint256 unlockTime;
        bool claimed;
    }
}