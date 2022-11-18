// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "../XEN-crypto/XENCrypto.sol";

contract XENFTBatchMint {
    // original contract marking to distinguish from proxy copies
    address private immutable _original;

    // XEN Crypto contract
    XENCrypto public immutable xenCrypto;

    mapping(address => uint256) public vmuCount;

    // Creates XENFT contract, writing down immutable address for XEN Crypto main contract
    // and original(self) address to distinguish between proxy clones
    constructor(address xenCrypto_) {
        require(xenCrypto_ != address(0));
        _original = address(this);
        xenCrypto = XENCrypto(xenCrypto_);
    }

    // function callable only in proxy contracts from the original one => XENCrypto.claimRank(term)
    function callClaimRank(uint256 term) external {
        require(msg.sender == _original, "unauthorized");
        bytes memory callData = abi.encodeWithSignature("claimRank(uint256)", term);
        (bool success, ) = address(xenCrypto).call(callData);
        require(success, "call failed");
    }

    // function callable only in proxy contracts from the original one => XENCrypto.claimMintRewardAndShare()
    function callClaimMintReward(address to) external {
        require(msg.sender == _original, "unauthorized");
        bytes memory callData = abi.encodeWithSignature("claimMintRewardAndShare(address,uint256)", to, uint256(100));
        (bool success, ) = address(xenCrypto).call(callData);
        require(success, "call failed");
    }

    // function callable only in proxy contracts from the original one => destroys the proxy contract
    function powerDown() external {
        require(msg.sender == _original, "unauthorized");
        selfdestruct(payable(address(0)));
    }

    // main torrent interface. initiates Bulk Mint (Torrent) Operation
    function bulkClaimRank(uint256 count, uint256 term) public {
        bytes memory bytecode = bytes.concat(
            bytes20(0x3D602d80600A3D3981F3363d3d373d3D3D363d73),
            bytes20(address(this)),
            bytes15(0x5af43d82803e903d91602b57fd5bf3)
        );
        require(count > 0, "Error: Illegal count");
        require(term > 0, "Error: Illegal term");
        bytes memory callData = abi.encodeWithSignature("callClaimRank(uint256)", term);
        address proxy;
        bool succeeded;
        for (uint256 i = 1; i < count + 1; i++) {
            bytes32 salt = keccak256(abi.encodePacked(i, msg.sender));
            assembly {
                proxy := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
                succeeded := call(gas(), proxy, 0, add(callData, 0x20), mload(callData), 0, 0)
            }
            require(succeeded, "XENFT: Error while claiming rank");
        }
        vmuCount[msg.sender] = count;
    }

    /**
        @dev main torrent interface. initiates Mint Reward claim and collection and terminates Torrent Operation
     */
    function bulkClaimMintReward(address to) external {
        require(to != address(0), "Error: Illegal address");

        bytes memory bytecode = bytes.concat(
            bytes20(0x3D602d80600A3D3981F3363d3d373d3D3D363d73),
            bytes20(address(this)),
            bytes15(0x5af43d82803e903d91602b57fd5bf3)
        );
        uint256 end = vmuCount[msg.sender] + 1;
        bytes memory callData = abi.encodeWithSignature("callClaimMintReward(address)", to);
        bytes memory callData1 = abi.encodeWithSignature("powerDown()");
        for (uint256 i = 1; i < end; i++) {
            bytes32 salt = keccak256(abi.encodePacked(i, msg.sender));
            bool succeeded;
            bytes32 hash = keccak256(abi.encodePacked(hex"ff", address(this), salt, keccak256(bytecode)));
            address proxy = address(uint160(uint256(hash)));
            assembly {
                succeeded := call(gas(), proxy, 0, add(callData, 0x20), mload(callData), 0, 0)
            }
            require(succeeded, "Error: Error while claiming rewards");
            assembly {
                succeeded := call(gas(), proxy, 0, add(callData1, 0x20), mload(callData1), 0, 0)
            }
            require(succeeded, "Error: Error while powering down");
        }
    }
}
