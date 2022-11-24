// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
// File contracts/protocols/automations/AutomationRobot.sol

import "./AutomationStorage.sol";
import "./transferHelper.sol";

/**
 * @title AutomationRobot
 * @author CryptoZ
 * @notice Define the method of automation contract that the robot calls
 */
contract AutomationRobot is AutomationStorage, transferHelper {
    /**
     * @dev Batch mint for a specific mint task, only robot can call this function
     * @param mintId The specific mint task
     */
    function mint(uint256 mintId) external {
        require(isBot[msg.sender], "caller is not bot");
        require(mintId <= globalMintIndex, "invalid mint id");

        MintInfo memory info = mintInfo[mintId];
        require(!info.stopped, "stopped");
        require(tx.gasprice <= info.maxGasPrice, "gas price exceeds the limit");

        MintResult memory result = mintResult[mintId];
        require(
            result.valueLeft >= info.maxGasConsumedPerBatchMint,
            "task done"
        );

        uint256 batchId = IFactory(factory).mintBatch(
            info.member,
            info.term,
            COUNT_PER_BATCH
        );

        uint256 gasConsumed;
        unchecked {
            gasConsumed = GAS_USED_PER_BATCH_MINT * tx.gasprice;
            result.gasConsumed += gasConsumed;
            result.valueLeft -= gasConsumed;
            result.accountsMinted += COUNT_PER_BATCH;
        }

        mintResult[mintId] = result;
        batchIds[mintId].push(batchId);

        _transfer(msg.sender, gasConsumed);

        emit Mint(mintId, batchId, gasConsumed, msg.sender);
    }

    /**
     * @dev Batch claim for a specific mint task, only robot can call this function
     * @param mintId The specific mint task
     * @param batchId The batch id was obtained during batch mint
     */
    function claim(uint256 mintId, uint256 batchId) external {
        require(isBot[msg.sender], "caller is not bot");
        require(mintId <= globalMintIndex, "invelid mint id");

        MintInfo memory minfo = mintInfo[mintId];
        uint256 claimId = minfo.claimId;
        require(claimId > 0, "no claim task");

        ClaimInfo memory info = claimInfo[claimId];
        require(!info.stopped, "stopped");
        require(tx.gasprice <= info.maxGasPrice, "gas price exceeds the limit");

        ClaimResult memory result = claimResult[claimId];
        require(
            result.valueLeft >= info.maxGasConsumedPerBatchClaim,
            "task done"
        );

        IFactory(factory).claimBatch(info.member, batchId);

        uint256 gasConsumed;
        unchecked {
            gasConsumed = GAS_USED_PER_BATCH_CLAIM * tx.gasprice;
            result.accountsClaimed += COUNT_PER_BATCH;
            result.valueLeft -= gasConsumed;
            result.gasConsumed += gasConsumed;
        }

        claimResult[claimId] = result;

        _transfer(msg.sender, gasConsumed);

        emit Claim(mintId, claimId, batchId, gasConsumed, msg.sender);
    }

    // ==================== Events ====================
    event Mint(
        uint256 indexed mintId,
        uint256 batchId,
        uint256 gasConsumed,
        address bot
    );
    event Claim(
        uint256 indexed mintId,
        uint256 claimId,
        uint256 batchId,
        uint256 gasConsumed,
        address bot
    );
}