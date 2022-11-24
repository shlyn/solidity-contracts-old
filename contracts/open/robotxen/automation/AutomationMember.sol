// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./AutomationStorage.sol";
import "./transferHelper.sol";

// File contracts/protocols/automations/AutomationMember.sol

/**
 * @title AutomationMember
 * @author CryptoZ
 * @notice Define the method of automation contract that the member calls

 */
contract AutomationMember is AutomationStorage, transferHelper {
    /**
     * @dev join the protocol and become a member
     */
    function join() external payable {
        require(msg.sender == tx.origin, "only EOA");
        require(msg.value >= joinFee, "insufficient join fee");
        require(!isMember[msg.sender], "joined");

        isMember[msg.sender] = true;
        joinFeeReceived += msg.value;

        emit Join(msg.sender, msg.value);
    }

    /**
     * @dev start a mint task with a specefic value
     * @param term The lock days in xen contract
     * @param maxGasPrice The max gas price you can accept when minting xen
     */
    function startMintTask(uint256 term, uint256 maxGasPrice) external payable {
        require(isMember[msg.sender], "not member");
        require(term >= 1, "invalid term");
        require(maxGasPrice >= minGasPrice, "max gas price is too small");
        require(
            mintTasks[msg.sender].length - stoppedMintTasks[msg.sender].length <
                taskCountPerMember,
            "mint task count exceeds limit"
        );

        uint256 maxGasConsumedPerBatchMint = maxGasPrice *
            GAS_USED_PER_BATCH_MINT;
        require(msg.value >= maxGasConsumedPerBatchMint, "insufficient value");

        uint256 mintId = ++globalMintIndex;
        mintTasks[msg.sender].push(mintId);

        mintInfo[mintId] = MintInfo(
            msg.sender,
            term,
            maxGasPrice,
            msg.value,
            maxGasConsumedPerBatchMint,
            0,
            false
        );
        mintResult[mintId] = MintResult(0, 0, msg.value);

        emit StartMintTask(msg.sender, mintId);
    }

    /**
     * @dev Reset the max gas price of the specific mint task
     * you can accept when minting xen
     */
    function setMintMaxGasPrice(uint256 mintId, uint256 maxGasPrice) external {
        require(maxGasPrice >= minGasPrice, "max gas price is too small");

        MintInfo memory info = mintInfo[mintId];
        require(msg.sender == info.member, "invalid caller");
        require(!info.stopped, "stopped");

        info.maxGasPrice = maxGasPrice;
        info.maxGasConsumedPerBatchMint = maxGasPrice * GAS_USED_PER_BATCH_MINT;

        MintResult memory result = mintResult[mintId];
        require(
            result.valueLeft >= info.maxGasConsumedPerBatchMint,
            "value left if less than fee of one batch mint"
        );

        mintInfo[mintId] = info;

        emit SetMintMaxGasPrice(mintId, maxGasPrice);
    }

    /**
     * @dev Top up the specific mint task
     */
    function topUpMintTask(uint256 mintId) external payable {
        require(msg.value > 0, "need none zero value");

        MintInfo memory info = mintInfo[mintId];
        require(msg.sender == info.member, "invalid caller");
        require(!info.stopped, "stopped");

        info.targetValue += msg.value;
        mintInfo[mintId] = info;

        mintResult[mintId].valueLeft += msg.value;

        emit TopUpMintTask(mintId, msg.value);
    }

    /**
     * @dev Stop the specific mint task and get back the task balance
     */
    function stopMintTask(uint256 mintId) external {
        MintInfo memory info = mintInfo[mintId];
        require(msg.sender == info.member, "invalid caller");
        require(!info.stopped, "stopped");

        info.stopped = true;
        mintInfo[mintId] = info;

        MintResult memory result = mintResult[mintId];
        uint256 valueLeft = result.valueLeft;
        result.valueLeft = 0;
        mintResult[mintId] = result;

        stoppedMintTasks[msg.sender].push(mintId);

        _transfer(msg.sender, valueLeft);

        emit StopMintTask(mintId, valueLeft);
    }

    /**
     * @dev start a claim task with a specefic value for a mint task
     * @param mintId The specific mint task id
     * @param maxGasPrice The max gas price you can accept when minting xen
     */
    function startClaimTask(uint256 mintId, uint256 maxGasPrice)
        external
        payable
    {
        require(maxGasPrice >= minGasPrice, "max gas price is too small");

        MintInfo memory info = mintInfo[mintId];
        require(info.member == msg.sender, "invalid caller");
        require(info.claimId == 0, "claim info has been set");

        require(
            claimTasks[msg.sender].length - stoppedClaimTasks[msg.sender].length < taskCountPerMember,
            "claim task count exceeds limit"
        );

        uint256 maxGasConsumedPerBatchClaim = maxGasPrice * GAS_USED_PER_BATCH_CLAIM;
        require(msg.value >= maxGasConsumedPerBatchClaim, "insufficient value");

        uint256 claimId = ++globalClaimIndex;
        claimTasks[msg.sender].push(claimId);

        info.claimId = claimId;
        mintInfo[mintId] = info;

        claimInfo[claimId] = ClaimInfo(
            mintId,
            info.member,
            maxGasPrice,
            msg.value,
            maxGasConsumedPerBatchClaim,
            false
        );
        claimResult[claimId] = ClaimResult(0, 0, msg.value);

        emit StartClaimTask(mintId, claimId);
    }

    /**
     * @dev Reset the max gas price of the specific claim task
     * you can accept when minting xen
     */
    function setClaimMaxGasPrice(uint256 mintId, uint256 maxGasPrice) external {
        require(maxGasPrice >= minGasPrice, "max gas price is too small");

        MintInfo memory minfo = mintInfo[mintId];
        require(minfo.member == msg.sender, "invalid caller");

        uint256 claimId = minfo.claimId;
        require(claimId > 0, "no claim task");

        ClaimInfo memory info = claimInfo[claimId];
        require(!info.stopped, "stopped");

        info.maxGasPrice = maxGasPrice;
        info.maxGasConsumedPerBatchClaim =
            maxGasPrice *
            GAS_USED_PER_BATCH_CLAIM;

        ClaimResult memory result = claimResult[claimId];
        require(
            result.valueLeft >= info.maxGasConsumedPerBatchClaim,
            "value left if less than fee of one batch claim fee"
        );

        claimInfo[claimId] = info;

        emit SetClaimMaxGasPrice(mintId, claimId, maxGasPrice);
    }

    /**
     * @dev Top up the specific claim task
     */
    function topUpClaimTask(uint256 mintId) external payable {
        require(msg.value > 0, "need none zero value");

        MintInfo memory minfo = mintInfo[mintId];
        require(msg.sender == minfo.member, "invalid caller");

        uint256 claimId = minfo.claimId;
        require(claimId > 0, "no claim task");

        ClaimInfo memory info = claimInfo[claimId];
        require(!info.stopped, "stopped");

        info.targetValue += msg.value;
        claimInfo[claimId] = info;

        claimResult[claimId].valueLeft += msg.value;

        emit TopUpClaimTask(mintId, msg.value);
    }

    /**
     * @dev Stop the specific claim task and get back the task balance
     */
    function stopClaimTask(uint256 mintId) external {
        MintInfo memory minfo = mintInfo[mintId];
        require(minfo.member == msg.sender, "invalid caller");

        uint256 claimId = minfo.claimId;
        require(claimId > 0, "no claim task");

        minfo.claimId = 0;
        mintInfo[mintId] = minfo;

        ClaimInfo memory info = claimInfo[claimId];
        require(!info.stopped, "stopped");

        info.stopped = true;
        claimInfo[claimId] = info;

        ClaimResult memory result = claimResult[claimId];
        uint256 valueLeft = result.valueLeft;
        result.valueLeft = 0;
        claimResult[claimId] = result;

        stoppedClaimTasks[msg.sender].push(claimId);
        claimedAccounts[mintId] += result.accountsClaimed;

        _transfer(msg.sender, valueLeft);

        emit StopClaimTask(mintId, claimId, valueLeft);
    }

    // ==================== Events ====================
    event Join(address indexed member, uint256 fee);
    event StartMintTask(address indexed member, uint256 mintId);
    event StopMintTask(uint256 indexed mintId, uint256 valueLeft);
    event TopUpMintTask(uint256 indexed mintId, uint256 value);
    event SetMintMaxGasPrice(uint256 indexed mintId, uint256 maxGsPrice);
    event StartClaimTask(uint256 indexed mintId, uint256 claimId);
    event StopClaimTask(
        uint256 indexed mintId,
        uint256 claimId,
        uint256 valueLeft
    );
    event TopUpClaimTask(uint256 indexed mintId, uint256 value);
    event SetClaimMaxGasPrice(
        uint256 indexed mintId,
        uint256 claimId,
        uint256 maxGsPrice
    );
}