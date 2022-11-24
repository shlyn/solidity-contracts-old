// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
// File contracts/protocols/automations/AutomationStorage.sol
import "./AutomationType.sol";
import "./FactoryType.sol";

/**
 * @title AutomationStorage
 * @author CryptoZ
 * @notice Define the storage variable and getter method of the automation contract
 */
contract AutomationStorage is AutomationType {
    uint256 public constant COUNT_PER_BATCH = 100;
    uint256 public constant GAS_USED_PER_BATCH_MINT = 19000000;
    uint256 public constant GAS_USED_PER_BATCH_CLAIM = 7000000;

    address public factory;
    uint256 public joinFee;

    uint256 public joinFeeReceived;
    uint256 public globalMintIndex;
    uint256 public globalClaimIndex;

    uint256 public minGasPrice;
    uint256 public taskCountPerMember;

    mapping(address => bool) public isBot;
    mapping(address => bool) public isMember;

    mapping(uint256 => MintInfo) public mintInfo;
    mapping(uint256 => MintResult) public mintResult;
    mapping(uint256 => ClaimInfo) public claimInfo;
    mapping(uint256 => ClaimResult) public claimResult;

    mapping(uint256 => uint256) public claimedAccounts;
    mapping(uint256 => uint256[]) internal batchIds;

    mapping(address => uint256[]) internal mintTasks;
    mapping(address => uint256[]) internal stoppedMintTasks;
    mapping(address => uint256[]) internal claimTasks;
    mapping(address => uint256[]) internal stoppedClaimTasks;

    /**
     * @dev get the batch info array of a specific mint task
     */
    function getBatchInfos(uint256 mintId)
        external
        view
        returns (IFactory.BatchInfo[] memory infos)
    {
        uint256[] memory ids = batchIds[mintId];
        infos = new IFactory.BatchInfo[](ids.length);
        address receiver = mintInfo[mintId].member;

        for (uint256 i = 0; i < ids.length; i++) {
            infos[i] = IFactory(factory).getBatchInfo(receiver, ids[i]);
        }
    }

    /**
     * @dev get the batch info by index array of a specific mint task
     */
    function getBatchInfosByIndex(
        uint256 mintId,
        uint256 start,
        uint256 end
    )
        external
        view
        returns (uint256 totalCount, IFactory.BatchInfo[] memory infos)
    {
        uint256[] memory ids = batchIds[mintId];
        totalCount = ids.length;
        end = end < totalCount ? end : totalCount;

        require(start >= 0 && start < end, "invalid index");
        uint256 returnCount = end - start;

        infos = new IFactory.BatchInfo[](returnCount);
        address receiver = mintInfo[mintId].member;

        for (uint256 i = start; i < end; i++) {
            infos[i - start] = IFactory(factory).getBatchInfo(receiver, ids[i]);
        }
    }

    /**
     * @dev get multiple mint info array of member
     */
    function getMemberMultiMintInfo(address member)
        external
        view
        returns (MultiMintInfo[] memory infos)
    {
        require(isMember[member], "not member");
        uint256[] memory memberMintTasks = mintTasks[member];
        infos = new MultiMintInfo[](memberMintTasks.length);

        for (uint256 i = 0; i < memberMintTasks.length; i++) {
            uint256 mintId = memberMintTasks[i];
            infos[i] = MultiMintInfo(
                mintId,
                mintInfo[mintId],
                mintResult[mintId]
            );
        }
    }

    /**
     * @dev get multiple claim info array of member
     */
    function getMemberMultiClaimInfo(address member)
        external
        view
        returns (MultiClaimInfo[] memory infos)
    {
        require(isMember[member], "not member");
        uint256[] memory memberClaimTasks = claimTasks[member];
        infos = new MultiClaimInfo[](memberClaimTasks.length);

        for (uint256 i = 0; i < memberClaimTasks.length; i++) {
            uint256 claimId = memberClaimTasks[i];
            infos[i] = MultiClaimInfo(
                claimId,
                claimInfo[claimId],
                claimResult[claimId]
            );
        }
    }
}