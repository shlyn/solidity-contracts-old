// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./Ownable.sol";
import "./FactoryType.sol";

// File contracts/protocols/Factory.sol
contract Factory is Ownable, FactoryType {
    string public constant PROXY_FUNCTION = "callXEN(bytes)";
    string public constant XEN_MINT_FUNCTION = "claimRank(uint256)";
    string public constant XEN_CLAIM_FUNCTION = "claimMintRewardAndShare(address,uint256)";

    /// The percentage of the XEN token returned to user
    uint256 public constant SHARE_PCT = 100;
    uint256 public constant SECONDS_IN_DAY = 3600 * 24;

    address public xen;
    address public automation;
    address public minterTemplate;

    /// Proxy contract bytecode hash which is used to compute proxy address
    bytes32 public bytecodeHash;

    /// user address => batch count
    mapping(address => uint256) public userBtachId;

    /// user address => batch index => batch info
    mapping(address => mapping(uint256 => BatchInfo)) private batchInfo;

    /**
     * @dev Initialize the Factory contract
     */
    function initialize(address _xen, address _minterTemplate, address _automation) external {
        xen = _xen;
        minterTemplate = _minterTemplate;
        automation = _automation;
        bytecodeHash = keccak256(
            abi.encodePacked(
                bytes.concat(
                    bytes20(0x3D602d80600A3D3981F3363d3d373d3D3D363d73),
                    bytes20(_minterTemplate),
                    bytes15(0x5af43d82803e903d91602b57fd5bf3)
                )
            )
        );
    }

    /**
     * @dev Set address of automation contract
     */
    function setAutomation(address newAutomation) external onlyOwner {
        automation = newAutomation;
        emit SetAutomation(newAutomation);
    }

    /**
     * @dev Create multiple contracts to batch mint XEN token
     */
    function mintBatch(address receiver, uint256 term, uint256 count) external returns (uint256 batchId) {
        require(msg.sender == tx.origin || msg.sender == automation, "firbidden");

        batchId = ++userBtachId[receiver];
        batchInfo[receiver][batchId] = BatchInfo(batchId, count, block.timestamp + term * SECONDS_IN_DAY, false);

        bytes memory bytecode = bytes.concat(
            bytes20(0x3D602d80600A3D3981F3363d3d373d3D3D363d73),
            bytes20(minterTemplate),
            bytes15(0x5af43d82803e903d91602b57fd5bf3)
        );
        bytes memory data = abi.encodeWithSignature(PROXY_FUNCTION, abi.encodeWithSignature(XEN_MINT_FUNCTION, term));

        uint256 i;
        while (i < count) {
            unchecked {
                ++i;
            }

            bytes32 salt = keccak256(abi.encodePacked(receiver, batchId, i));

            assembly {
                let minter := create2(0, add(bytecode, 32), mload(bytecode), salt)
                let success := call(gas(), minter, 0, add(data, 0x20), mload(data), 0, 0)
            }
        }

        emit BatchMint(receiver, term, count, batchId);
    }

    /**
     * @dev Call multiple contracts created for receiver to batch claim XEN
     */
    function claimBatch(address receiver, uint256 batchId) external {
        require(
            msg.sender == tx.origin || msg.sender == automation,
            "firbidden"
        );

        require(batchId <= userBtachId[receiver], "invalid batch id");

        BatchInfo memory info = batchInfo[receiver][batchId];
        require(block.timestamp >= info.unlockTime, "time is not reach");
        require(!info.claimed, "claimed");

        info.claimed = true;
        batchInfo[receiver][batchId] = info;

        bytes memory proxy_data = abi.encodeWithSignature(
            PROXY_FUNCTION,
            abi.encodeWithSignature(XEN_CLAIM_FUNCTION, receiver, SHARE_PCT)
        );

        uint256 i;
        while (i < info.count) {
            unchecked {
                ++i;
            }
            bytes32 salt = keccak256(abi.encodePacked(receiver, batchId, i));
            address minter = address(uint160(uint(keccak256(abi.encodePacked(hex"ff", address(this), salt, bytecodeHash)))));
            assembly {
                let success := call(gas(), minter, 0, add(proxy_data, 0x20), mload(proxy_data), 0, 0)
            }
        }

        emit BatchClaim(receiver, batchId);
    }

    /**
     * @notice get user batch info with specific batch id
     */
    function getBatchInfo(address receiver, uint256 batchId) external view returns (BatchInfo memory) {
        return batchInfo[receiver][batchId];
    }

    // ==================== Events ====================
    event SetAutomation(address automation);
    event BatchMint(address indexed receiver, uint256 term, uint256 count, uint256 batchId);
    event BatchClaim(address indexed receiver, uint256 batchId);
}