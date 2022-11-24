// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
// File contracts/protocols/automations/AutomationConfig.sol

import "./OwnableUpgradeable.sol";
import "./AutomationStorage.sol";
import "./transferHelper.sol";

contract AutomationConfig is OwnableUpgradeable, AutomationStorage, transferHelper {
    /**
     * @dev Set bot address and send start value from join fee received
     */
    function setBot(address bot, uint256 startValue) external onlyOwner {
        isBot[bot] = true;

        require(joinFeeReceived >= startValue, "insufficient join fee");
        joinFeeReceived -= startValue;

        _transfer(bot, startValue);
        emit SetBot(bot, startValue);
    }

    /**
     * @dev Set the mi
     */
    function setMinGasPrice(uint256 newMinGasPrice) external onlyOwner {
        minGasPrice = newMinGasPrice;
        emit SetMinGasPrice(newMinGasPrice);
    }

    /**
     * @dev Set the live task count per user can create
     */
    function setTaskCountPerMember(uint256 count) external onlyOwner {
        taskCountPerMember = count;
        emit SetTaskCountPerMember(count);
    }

    /**
     * @dev Set the
     */
    function setJoinFee(uint256 newJoinFee) external onlyOwner {
        joinFee = newJoinFee;
        emit SetJoinFee(newJoinFee);
    }

    function withdrawJoinFee(address receiver) external onlyOwner {
        uint256 withdrawAmount = joinFeeReceived;
        require(
            address(this).balance >= withdrawAmount,
            "insufficient balance"
        );

        joinFeeReceived = 0;
        _transfer(receiver, withdrawAmount);

        emit WithdrawJoinFee(receiver, withdrawAmount);
    }

    // ==================== Events ====================
    event SetBot(address bot, uint256 startValue);
    event SetMinGasPrice(uint256 minGasPrice);
    event SetJoinFee(uint256 joinFee);
    event SetTaskCountPerMember(uint256 count);
    event WithdrawJoinFee(address receiver, uint256 fee);
}