// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "hardhat/console.sol";

interface IXENCrypto {
	function claimRank(uint256 term) external;
	function claimMintReward() external;
	function claimMintRewardAndShare(address other, uint256 pct) external;
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface IXENCryptoMiniProxy {
    function claimRank(uint256 term) external;
    function claimMintRewardTo(address to) external;
}

// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1167.md
contract XENCryptoMiniProxy is IXENCryptoMiniProxy {
    address private immutable original;
    // address public constant xenContractAddress = 0xDd68332Fe8099c0CF3619cB3Bb0D8159EF1eCc93;
    address public immutable XENCrypto;

    constructor(address _XENCrypto) {
        original = msg.sender;
		XENCrypto = _XENCrypto;
    }

	function claimRank(uint term) external {
		// require(original == msg.sender, "No Auth");
		IXENCrypto(XENCrypto).claimRank(term);
	}

	function claimMintRewardTo(address to) external {
		// require(original == msg.sender, "No Auth");
		IXENCrypto(XENCrypto).claimMintRewardAndShare(to, 100);
		if(address(this) != original) {
			selfdestruct(payable(tx.origin)); // proxy delegatecall
		}
	}
}

contract XenAssistant {
	bytes miniProxy;
	address private immutable deployer;

	mapping (address=>uint) public countClaimRank;
	mapping (address=>uint) public countClaimMint;
	
	constructor(address _miniProxy) {
		miniProxy = bytes.concat(
            bytes20(0x3D602d80600A3D3981F3363d3d373d3D3D363d73),
            bytes20(address(_miniProxy)),
            bytes15(0x5af43d82803e903d91602b57fd5bf3)
        );
		deployer = msg.sender;
	}

	function batchMint(uint times, uint term) external {
		bytes memory bytecode = miniProxy;
		address proxy;
		uint N = countClaimRank[msg.sender] + 1;
		for(uint i = N; i < N + times; i++) {
	        bytes32 salt = keccak256(abi.encodePacked(msg.sender, i));
			assembly {
	            proxy := create2(0, add(bytecode, 32), mload(bytecode), salt)
			}
			IXENCryptoMiniProxy(proxy).claimRank(term);
		}
		countClaimRank[msg.sender] += times;
	}

	function batchClaimWithXenContract(uint times) external {
		uint N = countClaimRank[msg.sender];
		uint M = countClaimMint[msg.sender];
		N = M + times < N ? M + times : N;
		for(uint i = M + 1; i < N + 1; i++) {
	        address proxy = proxyFor(msg.sender, i);
			IXENCryptoMiniProxy(proxy).claimMintRewardTo(msg.sender);
		}
		countClaimMint[msg.sender] = N;
	}

    function proxyFor(address sender, uint i) private view returns (address proxy) {
        bytes32 salt = keccak256(abi.encodePacked(sender, i));
        proxy = address(uint160(uint(keccak256(abi.encodePacked(
                hex'ff',
                address(this),
                salt,
                keccak256(abi.encodePacked(miniProxy))
            )))));
    }
}