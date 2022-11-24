// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
// File contracts/interfaces/AutomationType.sol

interface AutomationType {
    // INTERNAL TYPE TO DESCRIBE MINT TASK CONFIG INFO
    struct MintInfo {
        address member;
        uint256 term;
        uint256 maxGasPrice;
        uint256 targetValue;
        uint256 maxGasConsumedPerBatchMint;
        uint256 claimId;
        bool stopped;
    }

    // INTERNAL TYPE TO DESCRIBE MINT RESULT
    struct MintResult {
        uint256 gasConsumed;
        uint256 accountsMinted;
        uint256 valueLeft;
    }

    // INTERNAL TYPE TO DESCRIBE CLAIM TASK CONFIG INFO
    struct ClaimInfo {
        uint256 mintId;
        address member;
        uint256 maxGasPrice;
        uint256 targetValue;
        uint256 maxGasConsumedPerBatchClaim;
        bool stopped;
    }

    // INTERNAL TYPE TO DESCRIBE CLAIM RESULT
    struct ClaimResult {
        uint256 gasConsumed;
        uint256 accountsClaimed;
        uint256 valueLeft;
    }

    // INTERNAL TYPE TO DESCRIBE MULTIPLE MINT INFO
    struct MultiMintInfo {
        uint256 mintId;
        MintInfo info;
        MintResult result;
    }

    // INTERNAL TYPE TO DESCRIBE MULTIPLE CLAIM INFO
    struct MultiClaimInfo {
        uint256 claimId;
        ClaimInfo info;
        ClaimResult result;
    }
}