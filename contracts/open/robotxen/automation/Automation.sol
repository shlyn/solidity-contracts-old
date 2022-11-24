// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./AutomationConfig.sol";
import "./AutomationMember.sol";
import "./AutomationMember.sol";

// File contracts/protocols/Automation.sol
contract Automation is AutomationConfig, AutomationMember, AutomationRobot {
    receive() external payable {
        joinFeeReceived += msg.value;
    }

    /**
     * @dev Initialize the Automation contract
     */
    function initialize(address _factory) external initializer {
        __Ownable_init();

        factory = _factory;
        minGasPrice = 100000000;
        taskCountPerMember = 5;
    }
}