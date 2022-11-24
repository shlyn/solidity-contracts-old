
// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// File contracts/interfaces/FactoryType.sol

// File contracts/interfaces/IFactory.sol

interface FactoryType {
    // INTERNAL TYPE TO DESCRIBE EACH BATCH INFO
    struct BatchInfo {
        uint256 batchId;
        uint256 count;
        uint256 unlockTime;
        bool claimed;
    }
}

interface IFactory is FactoryType {
    function mintBatch(
        address receiver,
        uint256 term,
        uint256 count
    ) external returns (uint256 batchId);

    function claimBatch(address receiver, uint256 batchId) external;

    function getBatchInfo(address receiver, uint256 batchId)
        external
        view
        returns (BatchInfo memory);

    function xen() external view returns (address);

    function automation() external view returns (address);

    function bytecodeHash() external view returns (bytes32);
}










